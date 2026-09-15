require 'minitest/autorun'
require_relative '../_plugins/wiki_sections'

class WikiOrganizationsTest < Minitest::Test
  def render(rows, attrs = '', input = 'WikiGFM')
    source = <<~MD
      <div class="wiki-organization" data-org-title="테스트 조직" #{attrs} markdown="1">

      | 직책 | 소속 인원 | 변동 기록 |
      | :--- | :--- | :--- |
      #{rows}
      {: .wiki-service-table }

      </div>
    MD
    Kramdown::Document.new(source, input: input, hard_wrap: true).to_html
  end

  def test_counts_only_current_members_and_excludes_guides_from_player_total
    html = render('| 대표 | 하나[+방송인]<br>둘[+가이드]<br />셋[+운영자] | 퇴사자[+과거방송인]: 9/10 퇴사 |')
    assert_includes html, 'wiki-org-count">3명'
    assert_includes html, '총 1명 (가이드·운영자 포함 3명)'
    assert_includes html, 'scope="row"'
    assert_includes html, '<tfoot>'
    assert_operator html.index('wiki-org-title'), :<, html.index('scope="col"')
  end

  def test_empty_rows_trailing_breaks_and_plain_linked_members
    html = render("| 대표 | **홍길동**<BR/>[이름](https://example.com)<br> | — |\n| 공석 | — | — |\n| 빈칸 | | — |\n| 미배치 | - | — |")
    assert_includes html, '총 2명 (가이드·운영자 포함 2명)'
    assert_equal 3, html.scan('wiki-org-count">0명').length
  end

  def test_rp_channel_links_and_escaped_pipes_remain_intact
    html = render('| 대표 | {긴 이름}[+[치지직:abc]{방송인}]<br>다른이[+가이드북] | [근거](https://example.com) A\|B |')
    assert_includes html, '총 2명 (가이드·운영자 포함 2명)'
    assert_includes html, 'wiki-rp-annotation'
    assert_includes html, 'href="https://example.com"'
    assert_includes html, 'A|B'
  end

  def test_duplicate_members_and_missing_separator_fail_with_actionable_error
    error = assert_raises(ArgumentError) { render("| 대표 | 이름[+방송인] | — |\n| 겸직 | 이름[+방송인] | — |") }
    assert_includes error.message, '중복 기재'
    assert_raises(ArgumentError) { render('| 대표 | 하나[+가이드] 둘[+방송인] | — |') }
  end

  def test_other_icons_baseurl_optional_metadata_and_escaping
    %w[business gang party].each do |icon|
      html = render('| 자유 직책 | 새인물 | 임명 |', "data-org-icon=\"#{icon}\" data-org-baseurl=\"/preview\" data-org-status=\"활동 중\" data-org-as-of=\"2026-09-15\" data-org-subtitle=\"A &amp; B\"")
      assert_includes html, "/preview/assets/icons/organizations/#{icon}.svg"
      assert_includes html, '명단 기준: 2026-09-15'
      assert_includes html, 'A &amp; B'
      assert_includes html, '총 1명'
    end
    assert_includes render('| 대표 | — | — |', 'data-org-icon="../../bad"'), '/organizations/organization.svg'
  end

  def test_ordinary_posts_and_unmarked_tables_are_unchanged
    refute_includes render('| 대표 | 이름 | — |', '', 'ExtendedGFM'), 'wiki-org-count'
    plain = Kramdown::Document.new("| A | B |\n|---|---|\n| C | D |", input: 'WikiGFM').to_html
    refute_includes plain, 'wiki-org-count'
  end

  def test_separate_organizations_allow_same_member_without_shared_state
    2.times { assert_includes render('| 대표 | 이름[+방송인] | — |'), '총 1명 (가이드·운영자 포함 1명)' }
  end

  def test_search_index_can_render_already_built_html_without_recounting
    html = render('| 대표 | 이름[+방송인] | — |')
    indexed = Kramdown::Document.new(html, input: 'WikiGFM').to_html
    assert_equal 1, indexed.scan('총 1명 (가이드·운영자 포함 1명)').length
    assert_equal 1, indexed.scan('wiki-org-count').length
  end
end
