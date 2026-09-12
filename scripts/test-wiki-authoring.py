"""Jekyll integration fixtures for reusable wiki authoring; no production sample entries.

Use --keep to leave an isolated fixture site in TEMP for Chrome testing.
"""
import json
from pathlib import Path
import re
import shutil
import sys
import tempfile
import importlib.util
spec = importlib.util.spec_from_file_location('test_wiki', Path(__file__).with_name('test-wiki.py'))
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)
ROOT, build, check_site = checks.ROOT, checks.build, checks.check_site


def run(temp):
    source, dest = temp / 'source', temp / 'site'
    source.mkdir()
    for name in ('_config.yml', 'wiki.html', 'wiki-index.json', 'search.json', 'sitemap.xml', 'references.html'):
        shutil.copy2(ROOT / name, source / name)
    for name in ('_layouts', '_includes', '_data', 'scripts', 'styles'):
        shutil.copytree(ROOT / name, source / name)
    shutil.copytree(ROOT / 'assets/svg', source / 'assets/svg')
    # Local fixtures must never send reading events.
    (source / '_data/analytics.json').write_text('{}', encoding='utf-8')
    (source / '_wiki').mkdir()
    (source / '_posts').mkdir()
    body = '''
{% include wiki-template.html name="안내문" text="**공통 안내**: 연결대상과 [치지직]" %}

{% include wiki-template.html name="방송정보" platform="[SOOP]" period="작성자가 입력한 시기" %}

{% include wiki-template.html name="방송정보" platform="[Twitch]" %}

{% include wiki-template.html name="관련항목" links="- [연결대상](/wiki/target/)" %}

내용.[^sample] 반복.[^sample]

<details markdown="1">
<summary>접힌 구역</summary>

## 내부 소제목 {#inside}

- 접기 목록
- ~~취소선~~

| 열 | 값 |
| --- | --- |
| 표 | 내용 |

{% include wiki-template.html name="안내문" text="접기 안의 **틀** [알플]" %}

접기 각주.[^fold]

<details markdown="1">
<summary>중첩 구역</summary>

### 깊은 소제목 {#deep}

[설명 없는 문서](/wiki/no-description/)

</details>
</details>

<details markdown="1" open>
<summary>펼친 구역</summary>

처음부터 보이는 **내용**.

</details>

[chzzk] [치지직] [SOOP] [숲] [Twitch] [트위치] [RPlay] [알플레이] [알플] [Youtube] [YouTube] [유튜브] [유튭] [sOoP]

일반 플랫폼 이름 SOOP Twitch 치지직은 그대로.

[SOOP](https://example.com/normal) `[SOOP]`

```text
[유튜브]
```

![이미지 [SOOP]](/assets/svg/soop.svg)

<span title="[SOOP]">속성 보존</span>

[^sample]: 설명 각주. https://example.com/explanation-only

[^fold]: 접기 각주 내용과 [일반 링크](https://example.com/footnote).
'''
    metadata = '''---
title: 작성 기능 검증
aliases: [테스트별칭]
date: 2020-01-02
last_modified_at: 2021-03-04
references:
  - id: shared-reference
    title: 공통 자료
    url: https://example.com/source
  - id: wiki-reference
    title: 위키 자료
---
'''
    (source / '_wiki/example.md').write_text(metadata + body, encoding='utf-8')
    (source / '_wiki/second.md').write_text('---\ntitle: 재사용 검증\ndate: 2022-02-03\n---\n{% include wiki-template.html name="안내문" %}', encoding='utf-8')
    (source / '_wiki/target.md').write_text('---\ntitle: 연결대상\ndescription: 대상의 간략 설명입니다.\n---\n대상 본문.', encoding='utf-8')
    (source / '_wiki/no-description.md').write_text('---\ntitle: 설명 없는 문서\ncomments: false\n---\n설명 없는 본문.', encoding='utf-8')
    (source / '_posts/2020-01-01-example.md').write_text('''---
layout: post
lang: ko
title: 출처 검증 게시물
references:
  - id: shared-reference
    title: 공통 자료
    url: https://example.com/source
  - id: shared-reference
    title: 중복 자료
---
블로그 각주.[^blog]

[^blog]: 블로그 공통 각주 기능.
''', encoding='utf-8')
    build(source, dest)
    check_site(dest)
    html = (dest / 'wiki/example/index.html').read_text(encoding='utf-8')
    assert html.count('class="wiki-template"') == 5
    assert '<strong>공통 안내</strong>' in html and '<strong>틀</strong>' in html
    assert '<details>' in html and '<details open' in html
    assert '<del>취소선</del>' in html and '<table>' in html
    assert 'id="inside"' in html and 'id="deep"' in html
    assert 'href="#fn:fold"' in html and 'id="fn:fold"' in html
    assert '2020-01-02' in html and '2021-03-04' in html
    assert '/scripts/post-actions.js' not in html and '/styles/post-actions.css' not in html
    assert 'data-giscus-container' in html and 'data-mapping="pathname"' in html
    assert '/scripts/document-comments.js' in html
    assert 'class="page-note-grid' not in html
    assert 'class="page-note-grid' in (dest / 'wiki/index.html').read_text(encoding='utf-8')
    assert 'data-giscus-container' not in (dest / 'wiki/no-description/index.html').read_text(encoding='utf-8')
    assert 'post-endnotes' not in html  # enhancement is client-side
    undated = (dest / 'wiki/target/index.html').read_text(encoding='utf-8')
    dates = re.search(r'<div class="wiki-dates">(.*?)</div>', undated, re.S).group(1)
    assert '<time' not in dates, 'Jekyll build date leaked into undated entry'
    second = (dest / 'wiki/second/index.html').read_text(encoding='utf-8')
    assert len(re.findall(r'<time datetime="2022-02-03', second)) == 2
    index = json.loads((dest / 'wiki-index.json').read_text(encoding='utf-8'))
    indexed = next(x for x in index if x['title'] == '작성 기능 검증')
    assert '<strong>공통 안내</strong>' in indexed['html'], 'Liquid include was not rendered in wiki index'
    assert '<table>' in indexed['html'] and '{%' not in indexed['html']
    search = json.loads((dest / 'search.json').read_text(encoding='utf-8'))
    assert '공통 안내' in next(x for x in search if x['title'] == '작성 기능 검증')['content']
    assert next(x for x in search if x['title'] == '연결대상')['date'] == ''
    refs = (dest / 'references/index.html').read_text(encoding='utf-8')
    assert refs.count('id="shared-reference"') == 1
    assert 'data-no-interface-translation>작성 기능 검증</a>' in refs
    assert 'id="wiki-reference"' in refs
    assert 'explanation-only' not in refs
    section = refs.split('id="shared-reference"', 1)[1].split('<li class="reference-item', 1)[0]
    assert '/wiki/example/' in section and '/posts/example/' in section
    assert section.count('href="/posts/example/"') == 1
    print('PASS: includes, repeated IDs, nested details, footnotes, dates, references and both indexes')
    # Editing the one shared template must update every caller and both static indexes.
    template = source / '_includes/wiki-templates/notice.md'
    template.write_text(template.read_text(encoding='utf-8') + '\n## 공통 틀 소제목\n\n공통변경검증\n', encoding='utf-8')
    build(source, dest, '/preview')
    check_site(dest, '/preview')
    for file in ['wiki/example/index.html', 'wiki/second/index.html', 'wiki-index.json', 'search.json']:
        assert '공통변경검증' in (dest / file).read_text(encoding='utf-8')
    html = (dest / 'wiki/example/index.html').read_text(encoding='utf-8')
    assert 'data-platform-assets="/preview/assets/svg/"' in html
    print('PASS: shared template change propagates, baseurl respected')
    # Leave a root-hosted version for repeatable browser tests.
    if '--keep' in sys.argv:
        build(source, dest)
        print(f'FIXTURE_SITE={dest}')


if __name__ == '__main__':
    if '--keep' in sys.argv:
        run(Path(tempfile.mkdtemp(prefix='wiki-authoring-test-')))
    else:
        with tempfile.TemporaryDirectory(prefix='wiki-authoring-test-') as directory:
            run(Path(directory))
