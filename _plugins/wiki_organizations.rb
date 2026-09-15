# Enrich the parsed Markdown tree, so counts also exist in static HTML and indexes.
module WikiOrganizations
  ICONS = %w[city police hospital broadcast transport business gang party organization citizen].freeze
  EMPTY = ['', '-', '—'].freeze

  def self.element(type, children = [], attrs = {})
    node = Kramdown::Element.new(type, nil, attrs)
    node.children.concat(children)
    node
  end

  def self.text(value)
    Kramdown::Element.new(:text, value)
  end

  def self.span(value, klass)
    node = Kramdown::Element.new(:html_element, 'span', { 'class' => klass }, category: :span)
    node.children << text(value)
    node
  end

  def self.plain(node)
    case node.type
    when :text, :codespan then node.value.to_s
    when :entity then node.value.char
    else node.children.map { |child| plain(child) }.join
    end
  end

  def self.break?(node)
    node.type == :br || (node.type == :html_element && node.value == 'br')
  end

  def self.members(cell)
    entries = [[]]
    cell.children.each do |child|
      break?(child) ? entries << [] : entries.last << child
    end
    entries.filter_map do |nodes|
      label = nodes.map { |node| plain(node) }.join.strip
      next if EMPTY.include?(label)
      rubies = nodes.select { |node| node.type == :html_element && node.value == 'ruby' }
      raise ArgumentError, '조직 명단: 인원 사이에 <br>를 넣으세요.' if rubies.length > 1
      ruby = rubies.first
      annotation = ruby&.children&.find { |node| node.value == 'rt' }
      base = ruby&.children&.find { |node| node.attr['class'] == 'wiki-rp-base' }
      { key: (base ? plain(base) : label).strip.unicode_normalize(:nfc),
        guide: annotation && %w[가이드 운영자].include?(plain(annotation).strip) }
    end
  end

  def self.transform(root)
    root.children.each do |child|
      if child.type == :html_element && child.attr.fetch('class', '').split.include?('wiki-organization')
        next if child.attr['data-org-rendered'] == 'true'
        tables = child.children.select { |node| node.type == :table && node.attr.fetch('class', '').split.include?('wiki-service-table') }
        raise ArgumentError, '조직 틀에는 .wiki-service-table 명단 표가 하나 필요합니다.' unless tables.length == 1
        enrich(tables.first, child.attr)
        child.attr['data-org-rendered'] = 'true'
      else
        transform(child)
      end
    end
  end

  def self.enrich(table, attrs)
    citizens = attrs['data-org-kind'] == 'citizen'
    title = attrs.fetch('data-org-title', '').strip
    raise ArgumentError, '조직 틀의 title이 비어 있습니다.' if title.empty?
    header = table.children.find { |node| node.type == :thead }
    bodies = table.children.select { |node| node.type == :tbody }
    rows = bodies.flat_map(&:children)
    unless header && header.children.length == 1 && header.children.first.children.length == 3 && rows.all? { |row| row.children.length == 3 }
      raise ArgumentError, "#{title}: 명단 표는 이름·직책 / 인원·방송인 / 기록의 3열이어야 합니다."
    end
    raise ArgumentError, "#{title}: 합계는 자동 생성됩니다. 수동 footer를 제거하세요." if table.children.any? { |node| node.type == :tfoot }
    seen = {}
    total = 0
    guides = 0
    identified = []
    unidentified = []
    rows.each do |row|
      rank, people, = row.children
      listed = members(people)
      if citizens
        unless listed.length == 1
          raise ArgumentError, "#{title}: 시민은 한 행에 한 명의 방송인·채널을 기록하세요."
        end
        known = !EMPTY.include?(plain(rank).strip)
        key = known ? "rp:#{plain(rank).strip.unicode_normalize(:nfc)}" : "streamer:#{listed.first[:key]}"
        raise ArgumentError, "#{title}: #{key} 중복 기재." if seen[key]
        seen[key] = true
        (known ? identified : unidentified) << row
        rank.attr['class'] = 'wiki-citizen-name'
        people.attr['class'] = 'wiki-citizen-streamer'
        row.children[2].attr['class'] = 'wiki-org-history'
        total += 1
        next
      end
      listed.each do |person|
        raise ArgumentError, "#{title}: #{person[:key]} 중복 기재 (겸직은 기록 칸에 작성)." if seen[person[:key]]
        seen[person[:key]] = true
      end
      total += listed.length
      guides += listed.count { |person| person[:guide] }
      # Kramdown renders body cells as td; use an explicit row header for accessibility.
      rank.type = :html_element
      rank.value = 'th'
      rank.options[:category] = :block
      rank.attr.merge!('scope' => 'row', 'class' => 'wiki-org-rank')
      rank.children.concat([element(:br), span("#{listed.length}명", 'wiki-org-count')])
      people.attr['class'] = 'wiki-org-members'
      row.children[2].attr['class'] = 'wiki-org-history'
    end
    if citizens
      table.children.reject! { |node| node.type == :tbody }
      [['RP 이름 확인', identified], ['RP 이름 미확인', unidentified]].each do |label, group|
        cell = Kramdown::Element.new(:html_element, 'th', { 'colspan' => '3', 'scope' => 'rowgroup', 'class' => 'wiki-citizen-group-title' }, category: :block)
        cell.children << text("#{label} · #{group.length}명")
        table.children << element(:tbody, [element(:tr, [cell])] + group, 'class' => 'wiki-citizen-group')
      end
    end
    header.children.first.children.each { |cell| cell.attr['scope'] = 'col' }
    icon = attrs['data-org-icon']
    icon = 'organization' unless ICONS.include?(icon)
    table.attr['class'] = "wiki-service-table wiki-service-#{icon}#{citizens ? ' wiki-citizen-table' : ''}"
    table.attr['aria-label'] = "#{title} 명단"
    baseurl = attrs.fetch('data-org-baseurl', '').sub(%r{/\z}, '')
    image = Kramdown::Element.new(:img, nil, {
      'src' => "#{baseurl}/assets/icons/organizations/#{icon}.svg", 'alt' => '',
      'width' => '40', 'height' => '40', 'class' => 'wiki-org-icon', 'aria-hidden' => 'true'
    })
    title_cell = element(:td, [image, span(title, 'wiki-org-name')], 'colspan' => '3', 'class' => 'wiki-org-title')
    %w[subtitle period status as-of].each do |key|
      value = attrs["data-org-#{key}"]
      next if value.to_s.strip.empty?
      prefix = { 'period' => '활동 기간: ', 'status' => '상태: ', 'as-of' => '명단 기준: ' }.fetch(key, '')
      title_cell.children << span(prefix + value, 'wiki-org-meta')
    end
    header.children.unshift(element(:tr, [title_cell]))
    summary = if citizens
                "총 #{total}명 (RP 이름 확인 #{identified.length}명 · 미확인 #{unidentified.length}명)"
              else
                "총 #{total - guides}명 (가이드·운영자 포함 #{total}명)"
              end
    table.children << element(:tfoot, [element(:tr, [element(:td, [text(summary)], 'colspan' => '3')])])
  end
end
