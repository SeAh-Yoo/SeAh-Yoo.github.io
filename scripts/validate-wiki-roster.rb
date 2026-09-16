#!/usr/bin/env ruby
# frozen_string_literal: true

require 'optparse'
require 'set'

SECTIONS = {
  'city' => ['#### 봉누도시청', '#### 봉누도방송국'],
  'broadcast' => ['#### 봉누도방송국', '#### 봉누도경찰서'],
  'police' => ['#### 봉누도경찰서', '#### 봉누도병원'],
  'hospital' => ['#### 봉누도병원', '#### 교통정비공사'],
  'transport' => ['#### 교통정비공사', '### 사업체'],
  'citizen' => ['<!-- 시민명단:', '{% include wiki-template.html name="시민명단" title="봉누도 무소속 시민"']
}.freeze

options = {}
OptionParser.new do |parser|
  parser.banner = '사용법: ruby scripts/validate-wiki-roster.rb --wiki FILE --reference FILE'
  parser.on('--wiki FILE', '검사할 위키 Markdown 파일') { |value| options[:wiki] = value }
  parser.on('--reference FILE', 'section|RP 이름|방송인·채널 형식의 기준 목록') { |value| options[:reference] = value }
end.parse!

abort '--wiki와 --reference를 모두 지정하세요.' unless options[:wiki] && options[:reference]

def normalize(value)
  value.to_s.strip.unicode_normalize(:nfc).gsub(/\s+/, ' ')
end

def placeholder?(value)
  %w[ ? - —].include?(normalize(value)) || normalize(value).empty?
end

def source_entry(entry)
  rp = normalize(entry.split('[+', 2).first)
  streamer = entry.scan(/\{([^{}]*)\}/).flatten.last
  streamer = entry[/\[\+([^\]]+)\]/, 1] if streamer.nil?
  streamer = entry unless streamer
  [placeholder?(rp) ? '?' : rp, normalize(streamer)]
end

def table_rows(text)
  text.each_line.filter_map do |line|
    next unless line.lstrip.start_with?('|')

    cells = line.strip.split('|', -1)[1...-1]&.map(&:strip)
    next unless cells&.length == 3
    next if ['직책', 'RP 이름'].include?(cells[0]) || cells[0].match?(/\A:?-+\z/)

    cells
  end
end

def source_roster(text, section)
  start_heading, end_heading = SECTIONS.fetch(section)
  heading_offset = lambda do |heading, offset = 0|
    if heading.start_with?('#')
      match = text.match(/^#{Regexp.escape(heading)}(?:\s|$)/, offset)
      match&.begin(0)
    else
      text.index(heading, offset)
    end
  end
  start = heading_offset.call(start_heading)
  finish = heading_offset.call(end_heading, (start || 0) + start_heading.length)
  abort "위키에서 #{section} 구간을 찾을 수 없습니다." unless start && finish

  rows = table_rows(text[start...finish])
  if text.include?('.wiki-citizen-source')
    # The two-column rosters now refer to the document's ten-column source.
    registry = {}
    text.each_line do |line|
      next unless line.start_with?('|')
      cells = line.strip.split('|', -1)[1...-1]&.map(&:strip)
      next unless cells&.length == 10 && %w[1등급 2등급 3등급].include?(cells[0])
      streamer = cells[1].scan(/\{([^{}]*)\}/).flatten.last || cells[1]
      rp = placeholder?(cells[2]) ? '?' : normalize(cells[2])
      key = rp == '?' ? "@#{streamer}" : rp
      registry[normalize(key).delete(' ')] = [rp, normalize(streamer)]
    end
    return text[start...finish].each_line.filter_map do |line|
      next unless line.start_with?('|')
      cells = line.strip.split('|', -1)[1...-1]&.map(&:strip)
      next unless cells&.length == 2
      next if cells[0] == 'RP 이름' || cells[0].match?(/\A:?-+\z/)
      registry.fetch(normalize(cells[0]).delete(' ')) { abort "전체 시민에 없는 이름: #{cells[0]}" }
    end
  end
  if section == 'citizen'
    rows.map do |rp, streamer, _history|
      rp = placeholder?(rp) ? '?' : normalize(rp)
      label = streamer.scan(/\{([^{}]*)\}/).flatten.last || streamer
      [rp, normalize(label)]
    end
  else
    rows.flat_map do |_role, members, _history|
      members.split(/<br\s*\/?\s*>/i).filter_map do |entry|
        next if placeholder?(entry)

        source_entry(entry)
      end
    end
  end
end

def reference_roster(path)
  entries = []
  File.foreach(path, encoding: 'UTF-8').with_index(1) do |line, line_number|
    line = line.strip
    next if line.empty? || line.start_with?('#')

    fields = line.split('|', -1).map(&:strip)
    unless fields.length == 3 && SECTIONS.key?(fields[0])
      abort "기준 목록 #{path}:#{line_number} 형식 오류 (section|RP 이름|방송인·채널)"
    end

    rp = placeholder?(fields[1]) ? '?' : normalize(fields[1])
    entries << [fields[0], rp, normalize(fields[2])]
  end
  entries
end

wiki = File.read(options[:wiki], encoding: 'UTF-8')
reference = reference_roster(options[:reference])
actual = SECTIONS.keys.flat_map do |section|
  source_roster(wiki, section).map { |rp, streamer| [section, rp, streamer] }
end

duplicates = actual.group_by { |section, rp, streamer| [section, rp == '?' ? streamer : rp] }
                   .select { |_key, values| values.length > 1 }
                   .keys

actual_set = actual.to_set
reference_set = reference.to_set
missing = (reference_set - actual_set).sort
extra = (actual_set - reference_set).sort

changed = []
reference.group_by { |section, rp, _streamer| [section, rp] }.each do |key, expected_rows|
  actual_rows = actual.select { |section, rp, _streamer| [section, rp] == key }
  expected_streamers = expected_rows.map(&:last).uniq
  actual_streamers = actual_rows.map(&:last).uniq
  next if expected_streamers == actual_streamers || key[1] == '?'

  changed << [key, expected_streamers, actual_streamers]
end

puts "위키 명단 검증: #{options[:wiki]}"
SECTIONS.keys.each do |section|
  puts format('%-9s 실제 %3d명 · 기준 %3d명', section, actual.count { |row| row[0] == section }, reference.count { |row| row[0] == section })
end
puts "중복: #{duplicates.length}건"
puts "누락: #{missing.length}건"
missing.each { |section, rp, streamer| puts "  - #{section}|#{rp}|#{streamer}" }
puts "추가: #{extra.length}건"
extra.each { |section, rp, streamer| puts "  - #{section}|#{rp}|#{streamer}" }
puts "방송인 변경: #{changed.length}건"
changed.each { |(section, rp), expected, found| puts "  - #{section}|#{rp}: 기준=#{expected.join(', ')} 실제=#{found.join(', ')}" }
puts "시민 RP 미확인: 실제 #{actual.count { |section, rp, _| section == 'citizen' && rp == '?'}}, 기준 #{reference.count { |section, rp, _| section == 'citizen' && rp == '?'}}"

exit 1 unless duplicates.empty? && missing.empty? && extra.empty? && changed.empty?
