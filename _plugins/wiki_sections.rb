# Wiki-only Markdown rendering. Keep the normal post converter unchanged.
require_relative 'extended_headings'
require 'cgi'

module WikiSections
  HANGUL = %w[가 나 다 라 마 바 사 아 자 차 카 타 파 하].freeze

  def self.hangul(number)
    result = ''
    while number > 0
      number -= 1
      result.prepend(HANGUL[number % HANGUL.length])
      number /= HANGUL.length
    end
    result
  end

  def self.alphabet(number)
    result = ''
    while number > 0
      number -= 1
      result.prepend((97 + number % 26).chr)
      number /= 26
    end
    result
  end

  def self.label(depth, number)
    case depth
    when 1 then "#{number}."
    when 2 then "#{hangul(number)}."
    when 3 then "#{number})"
    when 4 then "#{hangul(number)})"
    when 5 then "[#{number}]"
    when 6 then "[#{hangul(number)}]"
    when 7 then "#{alphabet(number)}."
    end
  end

  def self.render(source, site)
    config = site.config.merge('kramdown' => site.config.fetch('kramdown', {}).merge('input' => 'WikiGFM'))
    Jekyll::Converters::Markdown::KramdownParser.new(config).convert(source)
  end

  module Renderer
    def convert(content)
      if document.respond_to?(:collection) && document.collection&.label == 'wiki'
        WikiSections.render(content, site)
      else
        super
      end
    end
  end

  module Filters
    def wiki_markdownify(source)
      WikiSections.render(source.to_s, @context.registers[:site])
    end

    def wiki_contents(html, url)
      roots = []
      stack = []
      html.scan(/<h([2-6])\b([^>]*)>(.*?)<\/h\1>/m) do |tag, attrs, text|
        id = attrs[/\bid="([^"]*)"/, 1]
        next unless id
        level = (attrs[/data-heading-level="(\d+)"/, 1] || tag).to_i
        number = text[/<span\b[^>]*class="wiki-heading-number"[^>]*>(.*?)<\/span>/m, 1].to_s.strip
        title = text.sub(/<span\b[^>]*class="wiki-heading-number"[^>]*>.*?<\/span>/m, '').gsub(/<[^>]*>/, '')
        node = { level: level, id: id, number: number, text: title, children: [] }
        stack.pop while stack.last && stack.last[:level] >= level
        (stack.last ? stack.last[:children] : roots) << node
        stack << node
      end
      render_nodes = lambda do |nodes|
        nodes.map do |node|
          children = node[:children].empty? ? '' : "<ol>#{render_nodes.call(node[:children])}</ol>"
          href = CGI.escapeHTML("#{url}##{CGI.unescapeHTML(node[:id])}")
          title = CGI.escapeHTML(CGI.unescapeHTML(node[:text]))
          label = CGI.escapeHTML(CGI.unescapeHTML("#{node[:number]} #{node[:text]}"))
          "<li class=\"wiki-heading-level-#{node[:level]}\"><span class=\"wiki-toc-row\" data-no-interface-translation><a class=\"wiki-toc-number\" href=\"#{href}\" aria-label=\"#{label}\">#{node[:number]}</a><span class=\"wiki-toc-title\">#{title}</span></span>#{children}</li>"
        end.join
      end
      render_nodes.call(roots)
    end
  end
end

module Kramdown
  module Parser
    class WikiGFM < ExtendedGFM
      WIKI_INLINE_START = /\[\+|\{(?!:)/.freeze
      IMPLICIT_RP_BASE = /([\p{L}\p{M}\p{N}_]+)\z/u.freeze
      define_parser(:wiki_inline, WIKI_INLINE_START, '\[\+|\{(?!:)')

      def initialize(source, options)
        super
        # Code spans and escapes keep their existing precedence. The wiki syntax
        # only needs to win over ordinary links and Kramdown's {:-IAL parser.
        insertion = @span_parsers.index(:link) || 0
        @span_parsers.insert(insertion, :wiki_inline)
      end

      def parse_wiki_inline
        if @wiki_fragment || @tree.type == :a || @stack.any? { |item, _| item&.type == :a }
          add_text(@src.getch)
          return
        end
        raw = @src.rest
        parsed = raw.start_with?('[+') ? parse_implicit_rp(raw) : parse_explicit_wiki_inline(raw)
        return if parsed

        marker_start = 0 if raw.start_with?('[+')
        if raw.start_with?('{')
          _, label_end = balanced_part(raw, 0, '{', '}')
          tail = raw.each_char.drop(label_end + 1).join if label_end
          marker_start = label_end + 1 if tail&.match?(/\A\[(?:\+|->)/)
        end
        if marker_start
          _, marker_end = balanced_part(raw, marker_start, '[', ']')
          literal = marker_end ? raw.each_char.take(marker_end + 1).join : raw.split(/\r?\n/, 2).first
          protected_text = Element.new(:html_element, 'span', { 'data-wiki-no-autolink' => '' }, category: :span)
          protected_text.children << Element.new(:text, literal)
          @tree.children << protected_text
          @src.pos += literal.bytesize
          return
        end

        # A failed candidate is ordinary text. Consume only the opener so the
        # remaining source is still available to the established parsers.
        add_text(@src.getch)
      end

      def parse_implicit_rp(raw)
        annotation, finish = balanced_part(raw, 0, '[', ']')
        return false unless annotation&.start_with?('+') && !annotation[1..].to_s.strip.empty?

        previous = @tree.children.last
        match = IMPLICIT_RP_BASE.match(previous.value) if previous&.type == :text
        return false unless match

        base = match[1]
        previous.value = previous.value[0...match.begin(1)]
        @tree.children.pop if previous.value.empty?
        append_rp(base, annotation[1..])
        consume_characters(raw, finish + 1)
        true
      end

      def parse_explicit_wiki_inline(raw)
        label, label_finish = balanced_part(raw, 0, '{', '}')
        return false unless label

        connector = label_finish + 1
        return false unless raw.each_char.drop(connector).first == '['

        destination, finish = balanced_part(raw, connector, '[', ']')
        return false unless destination

        if destination.start_with?('+')
          return false if label.strip.empty? || destination[1..].to_s.strip.empty?
          append_rp(label, destination[1..])
        elsif destination.start_with?('->')
          target = plain_wiki_fragment(destination[2..].to_s)
          return false if plain_wiki_fragment(label).strip.empty? || target.strip.empty?
          append_heading_reference(label, target)
        else
          return false
        end
        consume_characters(raw, finish + 1)
        true
      end

      def append_rp(base, annotation)
        ruby = Element.new(:html_element, 'ruby', { 'class' => 'wiki-rp' }, category: :span)
        base_element = Element.new(:html_element, 'span', { 'class' => 'wiki-rp-base' }, category: :span)
        annotation_element = Element.new(:html_element, 'rt', { 'class' => 'wiki-rp-annotation' }, category: :span)
        parse_wiki_fragment(base, base_element)
        parse_wiki_fragment(annotation, annotation_element)
        ruby.children.concat([base_element, annotation_element])
        @tree.children << ruby
      end

      def append_heading_reference(label, target)
        element = Element.new(:html_element, 'span', {
          'class' => 'wiki-heading-reference',
          'data-wiki-heading-target' => target,
        }, category: :span)
        element.attr['data-wiki-no-autolink'] = ''
        element.children << Element.new(:text, plain_wiki_fragment(label))
        @tree.children << element
      end

      # Nested wiki annotations/references are deliberately disabled, while all
      # established inline Markdown parsers (including links) remain available.
      def parse_wiki_fragment(source, element)
        original = @src
        previous_fragment = @wiki_fragment
        @wiki_fragment = true
        @src = Kramdown::Utils::StringScanner.new(source, original.current_line_number)
        parse_spans(element, nil, @span_parsers.reject { |name| name == :wiki_inline })
      ensure
        @src = original
        @wiki_fragment = previous_fragment
      end

      def plain_wiki_fragment(source)
        container = Element.new(:html_element, 'span', {}, category: :span)
        parse_wiki_fragment(source, container)
        collect = lambda do |element|
          case element.type
          when :text, :codespan
            element.value.to_s
          when :entity
            element.value.char
          when :br
            ' '
          when :img
            ''
          else
            element.children.map { |child| collect.call(child) }.join
          end
        end
        unescape_wiki_text(collect.call(container))
      end

      def balanced_part(source, start, opener, closer)
        characters = source.split(/\r?\n/, 2).first.to_s.each_char.to_a
        return unless characters[start] == opener
        depth = 0
        escaped = false
        skip_until = -1
        parentheses = 0
        characters.each_with_index do |character, index|
          next if index < start || index <= skip_until
          if escaped
            escaped = false
          elsif character == '\\'
            escaped = true
          elsif character == '`'
            run = characters[index..].take_while { |char| char == '`' }.length
            delimiter = '`' * run
            tail = characters[(index + run)..].join
            closing = tail.index(delimiter)
            skip_until = index + run + closing + run - 1 if closing
          elsif opener == '[' && character == '(' && (parentheses > 0 || characters[index - 1] == ']')
            parentheses += 1
          elsif parentheses > 0
            parentheses -= 1 if character == ')'
          elsif character == opener
            depth += 1
          elsif character == closer
            depth -= 1
            return [characters[(start + 1)...index].join, index] if depth.zero?
          elsif character == "\n" || character == "\r"
            return
          end
        end
        nil
      end

      def consume_characters(source, count)
        @src.pos += source.each_char.take(count).join.bytesize
      end

      def unescape_wiki_text(text)
        text.gsub(/\\([\\`*{}\[\]()#+\-.!_>])/, '\\1')
      end

      def add_header(level, text, id)
        folded = level >= 2 && text.match?(/\s+\[(?:\\)?_접기\]\s*\z/)
        text = text.sub(/\s+\[(?:\\)?_접기\]\s*\z/, '') if folded
        super(level, text, id)
        @tree.children.last.attr['data-wiki-fold'] = '' if folded
      end

      def parse
        super
        counters = Array.new(7, 0)
        previous = 1
        visit = lambda do |element|
          if element.type == :header
            level = (element.attr['data-heading-level'] || element.options[:level]).to_i
            if level.between?(2, 8)
              if level > previous + 1
                message = "Wiki heading skips a level: H#{previous} to H#{level} (#{element.options[:raw_text]})"
                warning(message)
                Jekyll.logger.warn('Wiki heading:', message) if defined?(Jekyll.logger)
              end
              previous = level
              depth = level - 1
              counters[depth - 1] += 1
              (depth...7).each { |index| counters[index] = 0 }
              label = WikiSections.label(depth, counters[depth - 1])
              element.attr['data-wiki-depth'] = depth.to_s
              number = Element.new(:html_element, 'span', { 'class' => 'wiki-heading-number', 'data-wiki-no-autolink' => '' }, category: :span)
              number.children << Element.new(:text, "#{label} ")
              element.children.unshift(number)
            end
          end
          element.children.each { |child| visit.call(child) }
        end
        visit.call(@root)
      end
    end
  end
end

if defined?(Jekyll::Renderer)
  Jekyll::Renderer.prepend(WikiSections::Renderer)
  Liquid::Template.register_filter(WikiSections::Filters)
end
