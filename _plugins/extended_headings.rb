# Extend the existing GFM parser, preserving its code blocks, escaping and IDs.
require 'kramdown'
require 'kramdown-parser-gfm'

module Kramdown
  module Parser
    class ExtendedGFM < GFM
      EXTENDED_HEADER = /^(?<level>\#{1,8})[\t ]+(?<contents>.*)\n/.freeze
      define_parser(:extended_header, EXTENDED_HEADER, nil, 'parse_atx_header')
      define_parser(:extended_header_quirk, EXTENDED_HEADER, nil, 'parse_atx_header_gfm_quirk')

      def initialize(source, options)
        super
        @block_parsers.map! do |parser|
          { atx_header_gfm: :extended_header,
            atx_header_gfm_quirk: :extended_header_quirk }.fetch(parser, parser)
        end
        @paragraph_end = Regexp.union(@paragraph_end, EXTENDED_HEADER) if @options[:gfm_quirks].include?(:paragraph_end)
      end

      def add_header(level, text, id)
        super([level, 6].min, text, id)
        if level > 6
          @tree.children.last.attr.merge!('data-heading-level' => level.to_s,
                                         'role' => 'heading', 'aria-level' => level.to_s)
        end
      end
    end
  end
end
