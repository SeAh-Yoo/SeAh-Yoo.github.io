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

  def test_rp_reading_implicit_and_explicit_forms
    html = render("명총희[+시라유키 히나], {어둠 속의 명총희}[+시라유키 히나], A[+에이]\n")
    assert_equal 3, html.scan('<ruby class="wiki-rp">').size
    assert_includes html, '<span class="wiki-rp-base">명총희</span><rt class="wiki-rp-annotation">시라유키 히나</rt>'
    assert_includes html, '<span class="wiki-rp-base">어둠 속의 명총희</span>'
    assert_includes html, '<span class="wiki-rp-base">A</span><rt class="wiki-rp-annotation">에이</rt>'
  end

  def test_rp_allows_established_inline_links_but_not_nested_rp
    source = "{명총희}[+[시라유키 히나](https://example.com)], " \
             "{명총희}[+[치지직:b044e3a3b9259246bc92e863e7d3f3b8]{시라유키 히나}], " \
             "{바깥}[+안쪽[+중첩]]\n"
    html = render(source)
    assert_includes html, '<rt class="wiki-rp-annotation"><a href="https://example.com">시라유키 히나</a></rt>'
    assert_includes html, '<rt class="wiki-rp-annotation">[치지직:b044e3a3b9259246bc92e863e7d3f3b8]{시라유키 히나}</rt>'
    assert_includes html, '<rt class="wiki-rp-annotation">안쪽[+중첩]</rt>'
    refute_match(/<a[^>]*>.*<a/m, html)
  end

  def test_heading_reference_preserves_label_markup_and_target_text
    html = render("{**무면라이더**}[->공무직 오리엔테이션 (2026.09.12)]\n\n#### 공무직 오리엔테이션 (2026.09.12)\n")
    assert_includes html, 'data-wiki-heading-target="공무직 오리엔테이션 (2026.09.12)" data-wiki-no-autolink="">무면라이더</span>'
    assert_match(/<h4 [^>]*id="[^"]+"/, html)
  end

  def test_code_escapes_and_invalid_wiki_syntax_stay_literal
    source = "`명총희[+읽기]`와 `{표시}[->제목]`\n\n" \
             "```md\n명총희[+읽기]\n{표시}[->제목]\n```\n\n" \
             "명총희\\[+읽기] {}[+읽기] {명총희}[+] {표시}[->] 명총희[+열림\n"
    html = render(source)
    assert_includes html, '<code>명총희[+읽기]</code>'
    assert_includes html, "명총희[+읽기]\n{표시}[-&gt;제목]"
    assert_includes html.gsub(/<[^>]+>/, ''), '명총희[+읽기] {}[+읽기] {명총희}[+] {표시}[-&gt;] 명총희[+열림'
    assert_equal 0, html.scan('<ruby').size
    assert_equal 0, html.scan('data-wiki-heading-target').size
  end

  def test_existing_braces_links_images_and_ials_keep_precedence
    source = "[링크](https://example.com) ![그림](/image.png) *강조* [^note]\n\n" \
             "<span>속성</span>{:.kept}\n\n[^note]: 각주\n"
    html = render(source)
    assert_includes html, '<a href="https://example.com">링크</a>'
    assert_includes html, '<img src="/image.png" alt="그림" />'
    assert_includes html, '<em>강조</em>'
    assert_includes html, 'class="kept"'
    assert_includes html, 'class="footnote"'
  end

  def test_delimiters_inside_inline_code_and_link_urls
    html = render('{명총희}[+`닫는 ] 문자` [링크](https://example.com/a]b)]')
    assert_includes html, '<code>닫는 ] 문자</code>'
    assert_includes html, 'href="https://example.com/a]b"'
    assert_equal 1, html.scan('<ruby').size
    assert_match(%r{</a></rt></ruby></p>}, html)
  end

  def test_nested_link_labels_and_nested_annotations_are_not_links
    html = render('{[표시](https://example.com)}[->대상] {밖}[+**안[+중첩]**]')
    assert_includes html, 'data-wiki-no-autolink="">표시</span>'
    assert_equal 1, html.scan('<ruby').size
    assert_includes html, '<strong>안[+중첩]</strong>'
  end

  def test_unclosed_outer_annotation_does_not_parse_inner_candidate
    html = render('이름[+안쪽[+주석]')
    refute_includes html, '<ruby'
    assert_includes html.gsub(/<[^>]+>/, ''), '이름[+안쪽[+주석]'
  end

  def test_heading_reference_entities_and_links_keep_display_text
    html = render('{A &amp; B}[->A &amp; **B** [C](https://example.com)]')
    assert_includes html, 'data-wiki-heading-target="A &amp; B C"'
    assert_includes html, '>A &amp; B</span>'
  end
end
