require 'minitest/autorun'
require_relative '../_plugins/wiki_sections'

class WikiCitizensTest < Minitest::Test
  def render(source)
    Kramdown::Document.new(source, input: 'WikiGFM', hard_wrap: true).to_html
  end

  def registry(rows = '| 1등급 | [치지직:abc]{방송인} | 하나 | 기관 | 설정 | 기본 기록 | 기관: 대표 | 진급 | 역할 | 참여 중 |')
    <<~MD
      | 시민 등급 | 방송인·채널 | RP 이름 | 소속 | RP·컨셉 요약 | 특이사항 | 직책 | 진급 기록 | 조직 내 평판·역할 | 참여 상태 |
      | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
      #{rows}
      {: .wiki-citizen-source }
    MD
  end

  def reference(mode = 'citizen', name = '하나')
    <<~MD
      <div class="wiki-organization" data-org-title="기관" data-org-source="citizens" data-org-layout="#{mode}" markdown="1">

      | RP 이름 | 특이사항 |
      | --- | --- |
      | #{name} | 지역 기록 |
      {: .wiki-service-table }

      </div>
    MD
  end

  def test_forward_reference_and_single_source_updates
    html = render(reference + "\n" + registry)
    assert_equal 2, html.scan('기본 기록').length
    assert_equal 2, html.scan('설정').length
    assert_includes html, '지역 기록'
    assert_includes html, '<th scope="col">방송인·채널</th>'
    assert_includes html, 'wiki-grade-1'
    assert_includes html, 'colspan="6"'
    assert_includes render(reference + "\n" + registry.gsub('설정', '새 설정')), '새 설정'
  end

  def test_service_roles_and_grade_constraints
    html = render(reference('service') + "\n" + registry)
    assert_includes html, 'colspan="7"'
    assert_includes html, '>대표</td>'
    assert_includes html, '조직 내 평판·역할'
    assert_raises(ArgumentError) { render(reference('service') + "\n" + registry.gsub('1등급', '2등급')) }
    assert_raises(ArgumentError) { render(reference('gang') + "\n" + registry) }
    assert_includes render(reference('gang') + "\n" + registry.gsub('1등급', '3등급')), 'wiki-grade-3'
    assert_includes render(reference('crew') + "\n" + registry.gsub('1등급', '2등급')), 'colspan="7"'
  end

  def test_missing_duplicate_and_unknown_rp_validation
    assert_raises(ArgumentError) { render(reference('citizen', '없는사람') + "\n" + registry) }
    row = '| 2등급 | [치지직:abc]{꽃빈} | — | 무소속 | — | — | — | — | — | 참여 중 |'
    assert_includes render(reference('citizen', '@꽃빈') + "\n" + registry(row)), '지역 기록'
    assert_raises(ArgumentError) { render(registry(row + "\n" + row)) }
    assert_raises(ArgumentError) { render(registry(row.sub('2등급', '4등급'))) }
  end

  def test_guides_departures_and_uncertain_members_are_explicit
    source = registry('| 1등급 | 가이드 | 하나 | 기관 | — | — | 대표 | — | — | 가이드 |' + "\n" +
                      '| 2등급 | 방송인 | 둘 | 무소속 | — | — | — | — | — | 참여 종료 |')
    html = render(reference.gsub('지역 기록', '멤버 미확정') + "\n" + source)
    assert_includes html, '참여자 0명 · 가이드·운영자 1명 · 참여 종료 1명'
    assert_includes html, '멤버 미확정 1명 포함'
    assert_includes render(reference('citizen', '둘') + "\n" + source), '참여자 0명 · 가이드·운영자 0명 · 참여 종료 1명'
  end
end
