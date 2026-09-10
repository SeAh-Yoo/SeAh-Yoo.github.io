---
title: 위키 연결 안내
description: 본문 링크, 소제목 링크, 별도 세부 설명과 자동 역링크를 사용하는 방법.
aliases: [역링크, backlink]
last_modified_at: 2026-09-10
details:
  - title: Markdown 문법 예시
    target: /wiki/wiki-guide/#markdown
---

## 본문에서 연결하기 {#inline-links}

[위키 작성 안내]({{ '/wiki/wiki-guide/' | relative_url }})처럼 문장 안에서 다른 개념을 연결할 수 있습니다.

```markdown
[위키 작성 안내](/wiki/wiki-guide/)
[특정 소제목으로 이동](/wiki/wiki-guide/#markdown)
```

## 세부 설명 연결하기 {#detail-links}

문서 상단에 다음 정보를 추가하면 문서 목차와 색인에 세부 설명 링크가 자동으로 표시됩니다. `target`은 같은 문서의 `#식별자` 또는 `/wiki/파일명/`으로 시작하는 페이지 주소를 사용합니다.

```yaml
details:
  - title: 같은 문서의 설명
    target: "#details"
  - title: 별도 문서의 설명
    target: /wiki/wiki-guide/
  - title: 별도 문서의 특정 소제목
    target: /wiki/wiki-guide/#markdown
```

본문 소제목은 별도 설정 없이 목차에 포함되므로, `details`는 추가로 안내할 연결에만 사용하면 됩니다.

## 자동 역링크 {#backlinks}

다른 위키가 본문이나 `details`에서 이 페이지를 연결하면 페이지 하단에 그 위키의 이름이 표시됩니다. 특정 소제목을 가리키는 링크도 포함하며, 같은 문서가 여러 번 언급해도 한 번만 표시합니다.

역링크는 페이지를 열 때 브라우저에서 계산합니다. 문서를 저장하고 사이트가 다시 배포된 후 반영됩니다. 코드 블록 안에 적은 링크 예시는 역링크로 계산하지 않습니다.
