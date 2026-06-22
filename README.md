# 유세아의 문하수도

> **The Literary Underground**  
> 게임 산업, 인터넷 문화, 서브컬처, 영화, AI와 사회를 비평하는 유세아의 에세이·칼럼 아카이브입니다.

**웹사이트:** https://seah-yoo.github.io/

## 소개

이 저장소는 GitHub Pages와 Jekyll로 운영되는 개인 칼럼 블로그입니다.

기존의 해시 기반 SPA 방식 대신, 각 글을 `/posts/<slug>/` 형태의 독립적인 정적 HTML 문서로 생성합니다. 덕분에 검색 엔진과 소셜 미디어 미리보기 봇이 글의 제목, 설명, 본문, 대표 이미지를 직접 읽을 수 있습니다.

현재 디자인의 오로라 배경, 글래스 패널, 고정형 아카이브 사이드바와 반응형 레이아웃은 그대로 유지하면서 다음 항목을 지원합니다.

- 글마다 고유한 URL과 canonical 주소
- Open Graph 및 X(Twitter) 카드
- `Blog`·`BlogPosting` 구조화 데이터
- 자동 생성되는 `sitemap.xml`
- `robots.txt`를 통한 검색 엔진 크롤링 안내
- 이전 `#/post/<slug>` 주소의 새 글 주소 이동

## 프로젝트 구조

```text
.
├─ _config.yml                     # Jekyll 및 사이트 기본 설정
├─ _includes/
│  ├─ head.html                    # SEO 메타 태그와 구조화 데이터
│  └─ sidebar.html                 # 공통 아카이브 사이드바
├─ _layouts/
│  ├─ home.html                    # 홈페이지 레이아웃
│  └─ post.html                    # 칼럼 레이아웃
├─ _posts/                         # 마크다운 칼럼 원본
├─ assets/
│  └─ images/                      # 모든 칼럼의 공개 이미지
├─ scripts/index.js                # 기존 해시 주소 호환 처리
├─ styles/index.css                # 사이트 디자인
├─ index.html                      # 홈페이지 진입점
├─ robots.txt
└─ README.md
```

## 새 글 작성 방법

### 1. 마크다운 파일 만들기

`_posts` 폴더에 다음 형식으로 파일을 만듭니다.

```text
_posts/YYYY-MM-DD-slug.md
```

예시:

```text
_posts/2026-06-22-ncsoft-trust-2026.md
```

### 2. Front Matter 작성하기

파일 상단에 글의 메타데이터를 작성합니다.

```yaml
---
layout: post
title: "글 제목"
subtitle: "부제목"
date: 2026-06-22 00:00:00 +0900
last_modified_at: 2026-06-22 00:00:00 +0900
category: "Game Industry"
description: "검색 결과와 공유 미리보기에 표시할 글 소개"
slug: example-post
permalink: /posts/example-post/
image: /assets/images/example-post-cover.png
---
```

`description`은 검색 결과에 표시될 수 있으므로 글의 핵심 내용을 자연스러운 한두 문장으로 작성합니다.

### 3. 이미지 추가하기

이미지는 `_posts`가 아니라 `assets/images` 폴더에 저장합니다.

```text
assets/images/example-post-cover.png
assets/images/example-post-image-02.png
assets/images/example-post-image-03.jpg
```

본문에서는 대표 이미지를 다음처럼 사용할 수 있습니다.

```markdown
![이미지 설명]({{ page.image | relative_url }})
```

본문에 이미지가 여러 장이라면 각 파일의 공개 경로를 직접 지정합니다.

```markdown
![두 번째 이미지](/assets/images/example-post-image-02.png)

![세 번째 이미지](/assets/images/example-post-image-03.jpg)
```

모든 이미지를 한 폴더에서 관리하므로 파일 이름이 겹치지 않도록 글의 slug나 날짜를 접두어로 붙이는 방식을 권장합니다.

```text
ncsoft-trust-2026-cover.png
ncsoft-trust-2026-chart-01.png
20260622-ncsoft-image-02.jpg
```

### 4. 본문 작성하기

Front Matter 아래부터 일반 Markdown 문법으로 글을 작성합니다.

```markdown
# 글 제목

## 부제목

첫 문단을 작성합니다.
```

파일을 `main` 브랜치에 반영하면 GitHub Pages가 글별 HTML과 사이트맵을 자동으로 다시 생성합니다.

## URL 규칙

각 글은 다음 형태의 실제 URL로 공개됩니다.

```text
https://seah-yoo.github.io/posts/<slug>/
```

예시:

```text
https://seah-yoo.github.io/posts/ncsoft-trust-2026/
```

홈페이지와 사이드바에는 Jekyll이 `_posts`의 글을 읽어 최신순으로 자동 표시합니다.

## 디자인과 검색 최적화

사이트는 JavaScript가 없어도 제목과 본문을 읽을 수 있는 정적 HTML을 생성합니다. 각 칼럼에는 제목, 설명, 작성일, 수정일, 대표 이미지, canonical URL과 `BlogPosting` 구조화 데이터가 포함됩니다.

공통 UI는 `_layouts`, `_includes`, `styles/index.css`에서 관리하므로 글을 추가할 때 별도의 HTML이나 JavaScript를 작성할 필요가 없습니다.
