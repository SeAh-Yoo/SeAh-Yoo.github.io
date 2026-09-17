# A document-local registry: references resolve even when the source table comes last.
module WikiCitizens
  extend self

  COLUMNS = {
    '직책' => ['role', 5.8], 'RP 이름' => ['rp', 8.8],
    '방송인·채널' => ['streamer', 9.6], 'RP·컨셉 요약' => ['concept', 9.6],
    '시민 등급' => ['grade', 6.2], '소속' => ['affiliation', 9.2],
    '진급 기록' => ['promotion', 11.52], '조직 내 평판·역할' => ['reputation', 11.52],
    '특이사항' => ['notes', 5.8]
  }.freeze
  AFFILIATIONS = {
    /경찰/ => 'police', /EMS|병원|의료/i => 'hospital', /시청/ => 'city',
    /방송/ => 'broadcast', /교통|정비/ => 'transport', /갱단/ => 'gang',
    /정당/ => 'party', /무소속|시민/ => 'citizen', /사업|회사/ => 'business'
  }.freeze

  def append_note(notes, value)
    return if WikiOrganizations::EMPTY.include?(value) || plain(notes).include?(value)
    notes.children = [] if WikiOrganizations::EMPTY.include?(plain(notes))
    notes.children << WikiOrganizations.element(:br) unless notes.children.empty?
    notes.children << WikiOrganizations.text(value)
  end

  def affiliation_icons(c, baseurl)
    parts = [[]]
    c.children.each { |child| WikiOrganizations.break?(child) ? parts << [] : parts.last << child }
    c.children = parts.flat_map.with_index do |nodes, index|
      label = nodes.map { |n| plain(n) }.join
      next nodes if WikiOrganizations::EMPTY.include?(label)
      kind = AFFILIATIONS.find { |pattern, _| pattern.match?(label) }&.last || 'organization'
      icon = Kramdown::Element.new(:img, nil, {
        'src' => "#{baseurl}/assets/icons/organizations/#{kind}.svg", 'alt' => '',
        'class' => 'wiki-affiliation-icon', 'width' => '16', 'height' => '16', 'aria-hidden' => 'true'
      })
      badge = Kramdown::Element.new(:html_element, 'span', { 'class' => "wiki-affiliation wiki-service-#{kind}" }, category: :span)
      badge.children = [icon] + nodes
      index.zero? ? [badge] : [WikiOrganizations.element(:br), badge]
    end
  end

  def walk(node, &block)
    yield node
    node.children.each { |child| walk(child, &block) }
  end

  def plain(node)
    WikiOrganizations.plain(node).strip
  end

  def copy(cell)
    Marshal.load(Marshal.dump(cell))
  end

  def cell(value)
    WikiOrganizations.element(:td, [WikiOrganizations.text(value)])
  end

  def rows(table)
    table.children.select { |n| n.type == :tbody }.flat_map(&:children)
  end

  def key(value)
    value.unicode_normalize(:nfc).gsub(/\s+/, '')
  end

  def streamer_name(node)
    value = plain(node)
    value[/\{([^}]+)\}/, 1] || value
  end

  def transform(root)
    tables = []
    walk(root) { |n| tables << n if n.type == :table }
    sources = tables.select { |n| n.attr.fetch('class', '').split.include?('wiki-citizen-source') }
    return if sources.empty?
    raise ArgumentError, '전체 시민 원본 표는 문서당 하나만 허용됩니다.' unless sources.length == 1
    source = sources.first
    registry = {}
    rows(source).each do |row|
      raise ArgumentError, '전체 시민 표는 9열이어야 합니다.' unless [9, 10].include?(row.children.length)
      grade, streamer, rp = row.children
      notes = row.children[5]
      status = row.children[9] && plain(row.children[9])
      append_note(notes, status) if status && status != '참여 중'
      append_note(notes, '현재 미접속/RP 이름 없음') if WikiOrganizations::EMPTY.include?(plain(rp))
      row.attr['data-guide'] = 'true' if %w[가이드 운영자].include?(plain(streamer))
      row.attr['data-ended'] = 'true' if plain(notes).include?('참여 종료')
      raise ArgumentError, '시민 등급은 1등급, 2등급, 3등급 중 하나입니다.' unless %w[1등급 2등급 3등급].include?(plain(grade))
      id = key(WikiOrganizations::EMPTY.include?(plain(rp)) ? "@#{streamer_name(streamer)}" : plain(rp))
      raise ArgumentError, "전체 시민 중복: #{id}" if registry.key?(id)
      registry[id] = row.children
    end
    walk(root) do |org|
      next unless org.attr['data-org-source'] == 'citizens' && org.attr['data-org-rendered'] != 'true'
      table = org.children.find { |n| n.type == :table }
      next unless table
      mode = org.attr['data-org-layout'] || 'citizen'
      raise ArgumentError, "알 수 없는 명단 형식: #{mode}" unless %w[citizen service gang crew].include?(mode)
      title = org.attr['data-org-title']
      seen = {}
      output = rows(table).map do |row|
        raise ArgumentError, "#{title}: 참조 표는 RP 이름·특이사항 2열이어야 합니다." unless row.children.length == 2
        id = key(plain(row.children[0]))
        raise ArgumentError, "#{title}: 중복 RP 이름 #{id}" if seen[id]
        seen[id] = true
        data = registry.fetch(id) { raise ArgumentError, "#{title}: 전체 시민에서 #{id}을 찾을 수 없습니다." }
        grade, streamer, rp, affiliation, concept, notes, role, promotion, reputation, status = data
        raise ArgumentError, "#{title}: 공무직은 1등급이어야 합니다." if mode == 'service' && plain(grade) != '1등급'
        raise ArgumentError, "#{title}: 정식 갱단은 3등급이어야 합니다." if mode == 'gang' && plain(grade) != '3등급'
        combined = copy(notes)
        unless WikiOrganizations::EMPTY.include?(plain(row.children[1])) && row.children[1].children.none? { |n| n.type == :footnote }
          combined.children = [] if WikiOrganizations::EMPTY.include?(plain(combined))
          combined.children << WikiOrganizations.element(:br) unless combined.children.empty?
          combined.children.concat(copy(row.children[1]).children)
        end
        fields = if %w[service gang crew].include?(mode)
                   # Multiple offices are stored as organization: role lines in the source.
                   scoped = plain(role).include?(':') ? plain(role).split(';').find { |part| part.strip.start_with?("#{title}:") }&.split(':', 2)&.last&.strip : plain(role)
                   [cell(scoped || '—'), copy(rp), copy(streamer), copy(concept), copy(promotion), copy(reputation), combined]
                 else
                   [copy(rp), copy(streamer), copy(concept), copy(grade), copy(affiliation), combined]
                 end
        result = WikiOrganizations.element(:tr, fields)
        result.attr['data-guide'] = 'true' if %w[가이드 운영자].include?(plain(streamer))
        result.attr['data-ended'] = 'true' if plain(combined).include?('참여 종료')
        result.attr['data-uncertain'] = 'true' if plain(combined).include?('멤버 미확정')
        result
      end
      labels = %w[service gang crew].include?(mode) ? ['직책', 'RP 이름', '방송인·채널', 'RP·컨셉 요약', '진급 기록', '조직 내 평판·역할', '특이사항'] : ['RP 이름', '방송인·채널', 'RP·컨셉 요약', '시민 등급', '소속', '특이사항']
      table.children = [WikiOrganizations.element(:thead, [WikiOrganizations.element(:tr, labels.map { |label| cell(label) })]), WikiOrganizations.element(:tbody, output)]
      decorate(table, org.attr, output)
      org.attr['data-org-rendered'] = 'true'
    end
    # Source order is grade, streamer name, then RP name; browser sorting uses Korean collation.
    body = source.children.find { |n| n.type == :tbody }
    body.children.sort_by! { |r| [plain(r.children[0]), streamer_name(r.children[1]).downcase, plain(r.children[2])] }
    body.children.each do |r|
      r.children = [6, 2, 1, 4, 0, 3, 7, 8, 5].map { |index| r.children[index] }
      role = r.children.first
      if plain(role).include?(':')
        role.attr['title'] = plain(role)
        parts = plain(role).split(';').map { |part| part.split(':', 2).last.strip }
        role.children = parts.flat_map.with_index do |part, index|
          index.zero? ? [WikiOrganizations.text(part)] : [WikiOrganizations.element(:br), WikiOrganizations.text(part)]
        end
      end
    end
    source.children.first.children.first.children = COLUMNS.keys.map { |label| cell(label) }
    source_attrs = { 'data-org-title' => '전체 시민', 'data-org-icon' => 'citizen' }
    walk(root) do |node|
      source_attrs.merge!(node.attr) if node.children.include?(source)
    end
    decorate(source, source_attrs, rows(source))
  end

  def decorate(table, attrs, entries)
    count = table.children.first.children.first.children.length
    table.attr['class'] = "#{table.attr['class']} wiki-service-table wiki-expanded-table wiki-service-#{attrs.fetch('data-org-icon', 'citizen')}"
    table.attr['data-wiki-sortable'] = ''
    table.attr['aria-label'] = attrs['data-org-title']
    headers = table.children.first.children.first.children
    columns = headers.map { |c| COLUMNS.fetch(plain(c)) }
    total = columns.sum { |_, width| width }.round(2)
    table.attr['style'] = "--wiki-table-units: #{total}"
    table.attr['data-wiki-fixed-columns'] = ''
    baseurl = attrs.fetch('data-org-baseurl', '').sub(%r{/\z}, '')
    headers.each_with_index do |c, index|
      name, width = columns[index]
      c.attr['class'] = "wiki-col-#{name}"
      c.attr['style'] = "width: #{(width / total * 100).round(6)}%"
      entries.each do |row|
        row.children[index].attr['class'] = "wiki-col-#{name}"
        affiliation_icons(row.children[index], baseurl) if name == 'affiliation'
      end
    end
    table.children.first.children.first.children.each do |c|
      c.type = :html_element
      c.value = 'th'
      c.options[:category] = :block
      c.attr['scope'] = 'col'
    end
    entries.each do |row|
      row.children.each do |c|
        next unless %w[1등급 2등급 3등급].include?(plain(c))
        grade = plain(c)[0]
        icon = Kramdown::Element.new(:html_element, 'svg', { 'class' => "wiki-grade-icon wiki-grade-#{grade}", 'viewBox' => '0 0 24 24', 'aria-hidden' => 'true', 'focusable' => 'false' }, category: :span)
        path = { '1' => 'M3 7l4 4 5-7 5 7 4-4-2 12H5Z M5 22h14', '2' => 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21v-3a8 8 0 0 1 16 0v3Z', '3' => 'M8 21 19 10a5 5 0 0 0-7-7l-2 2 3 3 2-2 1 1L5 18Z' }.fetch(grade)
        icon.children << Kramdown::Element.new(:html_element, 'path', { 'd' => path }, category: :span)
        c.children.unshift(icon)
      end
    end
    guides = entries.count { |r| r.attr['data-guide'] == 'true' }
    ended = entries.count { |r| r.attr['data-ended'] == 'true' && r.attr['data-guide'] != 'true' }
    uncertain = entries.count { |r| r.attr['data-uncertain'] == 'true' }
    summary = "총 #{entries.length}명 (참여자 #{entries.length - guides - ended}명 · 가이드·운영자 #{guides}명"
    summary += " · 참여 종료 #{ended}명" if ended > 0
    summary += " · 멤버 미확정 #{uncertain}명 포함" if uncertain > 0
    summary += ')'
    summary = "총 #{entries.length}명 (확정 #{entries.length - uncertain}명 · 멤버 미확정 #{uncertain}명)" if attrs['data-org-layout'] == 'crew'
    icon = attrs['data-org-icon']
    icon = 'citizen' unless WikiOrganizations::ICONS.include?(icon)
    baseurl = attrs.fetch('data-org-baseurl', '').sub(%r{/\z}, '')
    image = Kramdown::Element.new(:img, nil, {
      'src' => "#{baseurl}/assets/icons/organizations/#{icon}.svg", 'alt' => '',
      'width' => '40', 'height' => '40', 'class' => 'wiki-org-icon', 'aria-hidden' => 'true'
    })
    heading = WikiOrganizations.element(:td, [image, WikiOrganizations.span(attrs['data-org-title'], 'wiki-org-name')], 'colspan' => count.to_s, 'class' => 'wiki-org-title')
    %w[subtitle period status as-of].each do |name|
      value = attrs["data-org-#{name}"]
      next if value.to_s.strip.empty?
      prefix = { 'period' => '활동 기간: ', 'status' => '상태: ', 'as-of' => '명단 기준: ' }.fetch(name, '')
      heading.children << WikiOrganizations.span(prefix + value, 'wiki-org-meta')
    end
    table.children.first.children.unshift(WikiOrganizations.element(:tr, [heading]))
    table.children << WikiOrganizations.element(:tfoot, [WikiOrganizations.element(:tr, [WikiOrganizations.element(:td, [WikiOrganizations.text(summary)], 'colspan' => count.to_s)])])
    group = Kramdown::Element.new(:html_element, 'colgroup', {}, category: :block)
    columns.each do |name, width|
      group.children << Kramdown::Element.new(:html_element, 'col', {
        'class' => "wiki-col-#{name}", 'style' => "width: #{(width / total * 100).round(6)}%"
      }, category: :block, is_closed: true)
    end
    table.children.unshift(group)
  end
end
