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
