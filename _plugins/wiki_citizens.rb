# A document-local registry: references resolve even when the source table comes last.
module WikiCitizens
  extend self

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
      raise ArgumentError, '전체 시민 표는 10열이어야 합니다.' unless row.children.length == 10
      grade, streamer, rp = row.children
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
        unless WikiOrganizations::EMPTY.include?(plain(row.children[1]))
          combined.children = [] if WikiOrganizations::EMPTY.include?(plain(combined))
          combined.children << WikiOrganizations.element(:br) unless combined.children.empty?
          combined.children.concat(copy(row.children[1]).children)
        end
        fields = if %w[service gang crew].include?(mode)
                   # Multiple offices are stored as organization: role lines in the source.
                   scoped = plain(role).include?(':') ? plain(role).split(';').find { |part| part.strip.start_with?("#{title}:") }&.split(':', 2)&.last&.strip : plain(role)
                   [cell(scoped || '—'), copy(rp), copy(streamer), copy(promotion), copy(reputation), copy(concept), combined]
                 else
                   [copy(rp), copy(streamer), copy(affiliation), copy(grade), copy(concept), combined]
                 end
        result = WikiOrganizations.element(:tr, fields)
        result.attr['data-guide'] = 'true' if %w[가이드 운영자].include?(plain(streamer))
        result.attr['data-ended'] = 'true' if plain(status) == '참여 종료'
        result.attr['data-uncertain'] = 'true' if plain(combined).include?('멤버 미확정')
        result
      end
      labels = %w[service gang crew].include?(mode) ? ['직책', 'RP 이름', '방송인·채널', '진급 기록', '조직 내 평판·역할', 'RP·컨셉 요약', '특이사항'] : ['RP 이름', '방송인·채널', '소속', '시민 등급', 'RP·컨셉 요약', '특이사항']
      table.children = [WikiOrganizations.element(:thead, [WikiOrganizations.element(:tr, labels.map { |label| cell(label) })]), WikiOrganizations.element(:tbody, output)]
      decorate(table, org.attr, output)
      org.attr['data-org-rendered'] = 'true'
    end
    # Source order is grade, streamer name, then RP name; browser sorting uses Korean collation.
    body = source.children.find { |n| n.type == :tbody }
    body.children.sort_by! { |r| [plain(r.children[0]), streamer_name(r.children[1]).downcase, plain(r.children[2])] }
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
    guides = entries.count { |r| r.attr['data-guide'] == 'true' || (count == 10 && %w[가이드 운영자].include?(plain(r.children[1]))) }
    ended = entries.count { |r| r.attr['data-ended'] == 'true' || (count == 10 && plain(r.children[9]) == '참여 종료') }
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
  end
end
