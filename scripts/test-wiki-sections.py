"""Build an isolated section demo; --keep retains it for manual Chrome checks."""
import importlib.util
import re
import shutil
import sys
import tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('wiki_checks', Path(__file__).with_name('test-wiki.py'))
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)


def run(temp):
    source, dest = temp / 'source', temp / 'site'
    source.mkdir()
    for name in ('_config.yml', 'wiki.html', 'wiki-index.json', 'search.json', 'sitemap.xml', 'references.html'):
        shutil.copy2(checks.ROOT / name, source / name)
    for name in ('_plugins', '_layouts', '_includes', '_data', 'scripts', 'styles', '_wiki'):
        shutil.copytree(checks.ROOT / name, source / name)
    shutil.copytree(checks.ROOT / 'assets/svg', source / 'assets/svg')
    (source / '_data/analytics.json').write_text('{}', encoding='utf-8')
    (source / '_posts').mkdir()
    body = '''
이 문서는 임시 검증용입니다. 실제 위키 글에는 추가되지 않습니다.
목차 링크, 중첩 접기, 브라우저 찾기(검색어: 접힌내용검색), 인쇄를 확인하세요.

## 기본 접기 [_접기] {#folded}

접힌내용검색: 열기 버튼을 누르면 이 문장이 보입니다.

### 하위 접기 [_접기] {#nested}

부모를 닫았다 열어도 이 구역의 열림 상태는 유지됩니다.

#### 세 번째 단계 {#deep}

상단 목차에서 이 제목을 누르거나 주소 끝에 #deep을 붙여 직접 들어오세요.

##### 네 번째 단계

본문입니다.

###### 다섯 번째 단계

본문입니다.

####### 여섯 번째 단계

본문입니다.

######## 일곱 번째 단계

본문입니다.

### 같은 부모의 두 번째 제목

앞의 하위 접기에는 포함되지 않고 부모 접기에만 포함됩니다.

## 다음 구역 {#next}

이 구역은 기본적으로 보이며 앞 구역의 접기에 포함되지 않습니다.

### 번호 다시 시작

`[_접기]`는 본문에서는 그대로 표시됩니다.

<details markdown="1">
<summary>기존 문법의 접힌 구역</summary>

기존 접기 문법도 같은 책 아이콘과 열기·접기 표시를 사용합니다.

<details markdown="1" open>
<summary>기존 문법의 열린 하위 구역</summary>

처음부터 열려 있는 상태와 중첩 접기를 유지합니다.

</details>
</details>

```markdown
## 코드 예시 [_접기]
```

## 한글 순서 넘침 [_접기]

'''
    body += '\n\n'.join(f'### 한글 항목 {n}\n\n내용 {n}.' for n in range(1, 43))
    body += '\n\n## 영문 순서 넘침 [_접기]\n\n### 준비 2\n\n#### 준비 3\n\n##### 준비 4\n\n###### 준비 5\n\n####### 준비 6\n\n'
    body += '\n\n'.join(f'######## 영문 항목 {n}\n\n내용 {n}.' for n in range(1, 29))
    metadata = '---\ntitle: 위키 목차·접기 검증\ndescription: 기본 접기, 7단계 번호, 넘침과 링크 이동 검증\ncomments: false\n---\n'
    (source / '_wiki/section-preview.md').write_text(metadata + body, encoding='utf-8')
    (source / '_posts/2020-01-01-section-preview.md').write_text('---\nlayout: post\ntitle: 일반 포스트 유지 검증\nlang: ko\ncomments: false\n---\n' + body, encoding='utf-8')
    checks.build(source, dest)
    checks.check_site(dest)
    article = (dest / 'wiki/section-preview/index.html').read_text(encoding='utf-8')
    directory = (dest / 'wiki/index.html').read_text(encoding='utf-8')
    post = (dest / 'posts/section-preview/index.html').read_text(encoding='utf-8')
    for label in ['1. 기본 접기', '가. 하위 접기', '1) 세 번째 단계', '가) 네 번째 단계', '[1] 다섯 번째 단계', '[가] 여섯 번째 단계', 'a. 일곱 번째 단계', '가가. 한글 항목 15', '가하. 한글 항목 28', '나가. 한글 항목 29', '나하. 한글 항목 42', 'aa. 영문 항목 27']:
        assert label in directory, label
        assert label in article, label
        assert label in re.sub('<[^>]*>', '', article.split('<div class="post-content">')[1]), label
    assert 'data-wiki-fold=""' in article
    assert article.index('</article>') < article.index('<aside class="wiki-backlinks glass-panel"')
    assert '<summary>기존 문법의 접힌 구역</summary>' in article
    assert '<details open' in article
    assert 'data-wiki-depth' not in post and '/scripts/wiki-sections.js' not in post
    assert '## 코드 예시 [_접기]' in article
    assert 'href="/wiki/section-preview/#deep"' in directory
    print('PASS: wiki-only numbering, all three displays, overflow, folding metadata and stable links')
    if '--keep' in sys.argv:
        print(f'FIXTURE_SITE={dest}')


if '--keep' in sys.argv:
    run(Path(tempfile.mkdtemp(prefix='wiki-sections-')))
else:
    with tempfile.TemporaryDirectory(prefix='wiki-sections-') as temp:
        run(Path(temp))
