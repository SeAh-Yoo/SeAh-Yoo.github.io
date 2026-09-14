require 'minitest/autorun'
require_relative '../_plugins/wiki_sections'

class WikiSectionsTest < Minitest::Test
  def render(source, input = 'WikiGFM')
    Kramdown::Document.new(source, input: input, hard_wrap: true).to_html
  end

  def test_depths_and_parent_reset
    source = (2..8).map { |level| "#{'#' * level} Heading #{level}\n\n" }.join
    html = render(source + "## Next\n\n### Child\n")
    labels = html.scan(/data-wiki-no-autolink="">(.*?)<\/span>/).flatten
    assert_equal ['1. ', '가. ', '1) ', '가) ', '[1] ', '[가] ', 'a. ', '2. ', '가. '], labels
  end

  def test_overflow
    assert_equal %w[하 가가 가나 가하 나가 나하 하하 가가가], [14, 15, 16, 28, 29, 42, 210, 211].map { |n| WikiSections.hangul(n) }
    assert_equal %w[z aa az ba zz aaa], [26, 27, 52, 53, 702, 703].map { |n| WikiSections.alphabet(n) }
  end

  def test_marker_does_not_change_ids_or_inline_markup
    plain = "## **Title**\n\n## **Title**\n\n### Explicit {#custom}\n"
    folded = "## **Title** [_접기]\n\n## **Title** [_접기]\n\n### Explicit [_접기] {#custom}\n"
    assert_equal render(plain).scan(/id="([^"]*)"/), render(folded).scan(/id="([^"]*)"/)
    assert_equal 3, render(folded).scan('data-wiki-fold').size
    assert_includes render(folded), '<strong>Title</strong>'
    refute_includes render(folded), '[_접기]'
  end

  def test_code_and_posts_are_unchanged
    source = "## Normal [_접기]\n\n```md\n### Code [_접기]\n```\n\n`[_접기]` and [_접기]\n"
    post = render(source, 'ExtendedGFM')
    refute_includes post, 'data-wiki-'
    assert_includes post, '[_접기]'
    wiki = render(source)
    assert_equal 1, wiki.scan('data-wiki-fold').size
    assert_includes wiki, '### Code [_접기]'
    assert_includes wiki, '<code>[_접기]</code>'
  end

  def test_nested_markdown_and_level_warning
    document = Kramdown::Document.new("## Parent\n\n<details markdown=\"1\">\n<summary>More</summary>\n\n#### Deep [_접기]\n\nText\n\n</details>\n", input: 'WikiGFM')
    assert_includes document.to_html, 'data-wiki-fold'
    assert document.warnings.any? { |warning| warning.include?('skips a level') }
  end
end
