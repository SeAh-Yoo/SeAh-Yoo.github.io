require 'minitest/autorun'
require_relative '../_plugins/extended_headings'

class ExtendedHeadingsTest < Minitest::Test
  def render(source)
    Kramdown::Document.new(source, input: 'ExtendedGFM', hard_wrap: true).to_html
  end

  def test_all_levels_and_duplicate_ids
    html = render((2..8).map { |level| "#{'#' * level} Same\n\n" }.join)
    assert_equal 7, html.scan(/<h[2-6] /).size
    assert_includes html, 'id="same-6"'
    [7, 8].each { |level| assert_match(/<h6 [^>]*data-heading-level="#{level}"[^>]*aria-level="#{level}"/, html) }
  end

  def test_inline_markup_explicit_ids_and_details
    html = render("<details markdown=\"1\">\n<summary>More</summary>\n\n####### **Deep** {#deep}\n\n######## Last\n\n</details>\n")
    assert_match(/<h6 [^>]*id="deep"[^>]*><strong>Deep<\/strong><\/h6>/, html)
    assert_includes html, 'aria-level="8"'
  end

  def test_examples_are_not_headings
    html = render("```md\n####### Code\n```\n\n~~~md\n######## Code\n~~~\n\n    ####### Indented\n\n\\####### Escaped\n\n`######## Inline`\n\n######### Nine\n")
    refute_includes html, '<h6'
  end

  def test_standard_markdown_is_unchanged
    source = "## Title\n\n### Title {#custom}\n\nText *emphasis*.\n\n###### Sixth\n"
    assert_equal Kramdown::Document.new(source, input: 'GFM', hard_wrap: true).to_html, render(source)
  end
end
