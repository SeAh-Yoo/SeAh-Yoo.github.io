"""Check built wiki links, then build isolated empty and edge-case fixtures.

Run after `jekyll build --safe`. Uses Python's standard library and installed Jekyll.
"""
import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids, self.links, self.groups = [], [], []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if 'data-group-label' in attrs:
            self.groups.append(attrs['data-group-label'])


def check_site(site, base=''):
    search = json.loads((site / 'search.json').read_text(encoding='utf-8'))
    index = json.loads((site / 'wiki-index.json').read_text(encoding='utf-8'))
    wiki_results = [entry for entry in search if entry['type'] == 'wiki']
    assert {x['url'] for x in wiki_results} == {x['url'] for x in index}
    assert len({x['translationKey'] for x in wiki_results}) == len(index)
    pages = [site / 'wiki/index.html'] + [site / unquote(x['url'][len(base):]).strip('/') / 'index.html' for x in index]
    for file in pages:
        html = file.read_text(encoding='utf-8')
        page = Page(html)
        assert len(page.ids) == len(set(page.ids)), f'Duplicate ID in {file}'
        source = 'https://example.test' + base + '/' + file.relative_to(site).as_posix().removesuffix('index.html')
        for href in page.links:
            link = urlsplit(urljoin(source, href))
            if link.netloc != 'example.test' or not link.path.startswith(base + '/wiki/'):
                continue
            target = site / unquote(link.path[len(base):]).strip('/')
            if target.suffix != '.html':
                target = target / 'index.html'
            assert target.is_file(), f'Missing target: {href} in {file}'
            if link.fragment:
                assert unquote(link.fragment) in Page(target.read_text(encoding='utf-8')).ids, f'Missing anchor: {href} in {file}'
    sitemap = (site / 'sitemap.xml').read_text(encoding='utf-8')
    for entry in index:
        assert entry['url'] in sitemap
    return index


def build(source, destination, base=''):
    command = [shutil.which('jekyll') or 'jekyll', 'build', '--safe', '--source', str(source), '--destination', str(destination), '--baseurl', base]
    if os.environ.get('JEKYLL_VERSION'):
        command.insert(1, '_' + os.environ['JEKYLL_VERSION'] + '_')
    result = subprocess.run(command, cwd=ROOT, capture_output=True, encoding='utf-8', errors='replace')
    assert result.returncode == 0, result.stdout + result.stderr


def main():
    actual = ROOT / '_site'
    index = check_site(actual)
    assert all('{{' not in entry['html'] for entry in index), 'Unrendered Liquid in backlink index'
    print('PASS: real site, search, sitemap, heading/summary/detail links')

    with tempfile.TemporaryDirectory(prefix='jekyll-wiki-test-') as temp:
        source, dest = Path(temp) / 'source', Path(temp) / 'site'
        source.mkdir()
        for name in ('_config.yml', 'wiki.html', 'wiki-index.json', 'search.json', 'sitemap.xml'):
            shutil.copy2(ROOT / name, source / name)
        for name in ('_layouts', '_includes', '_data'):
            shutil.copytree(ROOT / name, source / name)
        (source / '_wiki').mkdir()
        build(source, dest)
        assert check_site(dest) == []
        empty_html = (dest / 'wiki/index.html').read_text(encoding='utf-8')
        identity = json.loads(re.search(r'<script id="site-identity-data" type="application/json">(.*?)</script>', empty_html, re.S).group(1))
        empty_message = identity['locales'][identity['settings']['default_language']]['wiki']['empty']
        assert f'<p>{empty_message}</p>' in empty_html
        print('PASS: zero posts and zero wiki entries')

        titles = ['가방', '까치', '나무', '다리', '따옴표', '라디오', '마음', '바다', '빠름', '사전', '쌍', '아침', '자전거', '짜임', '차', '카드', '타자', '파도', '하늘', 'Alpha', '2번', 'Ω']
        for i, title in enumerate(titles):
            # A mix of minimal, summary-only and linked detailed entries.
            metadata = '' if i else 'description: 간략 설명\naliases: [별칭]\ndetails:\n  - title: 다음 페이지\n    target: /wiki/entry-1/\n'
            body = '' if i else '\n## 자세한 설명 {#detail}\n\n~~농담~~\n\n### **하위** 설명 {#child}\n\n#### 깊은 설명 {#deep}\n\n## A & B {#symbols}\n\n```markdown\n## 가짜 제목\n```\n'
            (source / '_wiki' / f'entry-{i}.md').write_text(f'---\ntitle: {title}\n{metadata}---\n{body}', encoding='utf-8')
        build(source, dest, '/preview')
        assert len(check_site(dest, '/preview')) == len(titles)
        assert '<del>농담</del>' in (dest / 'wiki/entry-0/index.html').read_text(encoding='utf-8')
        directory = (dest / 'wiki/index.html').read_text(encoding='utf-8')
        assert Page(directory).groups == list('ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ') + ['A–Z', '0–9 / 기타']
        assert 'href="/preview/wiki/entry-0/#child"' in directory
        assert 'href="/preview/wiki/entry-0/#deep"' in directory
        assert '가짜 제목</a>' not in directory
        assert 'data-no-interface-translation>하위 설명</a>' in directory
        assert 'data-no-interface-translation>A &amp; B</a>' in directory
        print('PASS: all letter groups, double consonants, optional fields, nested headings, escaped code, baseurl')


if __name__ == '__main__':
    main()
