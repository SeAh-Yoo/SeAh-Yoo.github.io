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
- `/categories/` 카테고리 모아보기와 카테고리별 앵커 이동
- 하단 정렬된 사이드바 아카이브·카테고리 내비게이션
- GoatCounter 기반 사이드바 방문자 수 및 게시물별 조회수 표시


## GoatCounter 방문자 수 카운터

이 사이트는 [GoatCounter](https://www.goatcounter.com/)를 사용해 방문자 수를 표시합니다.

- `_layouts/home.html`, `_layouts/categories.html`, `_layouts/post.html`에는 `https://seah-yoo.goatcounter.com/count`를 가리키는 GoatCounter 추적 스크립트가 들어 있습니다.
- `_includes/sidebar.html`의 브랜드 바로 아래에는 `Week: 숫자 / Month: 숫자 / Total: 숫자` 형식의 사이트 카운터가 표시됩니다.
- 사이드바 카운터는 1자리 수를 `0001`처럼 최소 네 자리로 표시하며, 10,000 이상은 자릿수를 자르지 않고 그대로 표시합니다.
- `_layouts/post.html`의 게시물 상단에는 `조회수: 숫자` 형식의 게시물별 조회수가 작고 옅은 글씨로 표시됩니다.
- `scripts/index.js`는 `https://seah-yoo.goatcounter.com`의 공개 카운터 JSON 엔드포인트를 호출하며, GoatCounter의 `TOTAL` 특수 경로로 최근 7일·최근 30일·전체 누적값을 각각 요청합니다.

> **중요:** 이 저장소를 복사하거나 포크해 다른 GitHub Pages 사이트로 사용할 경우, GoatCounter 설정을 반드시 본인 사이트의 카운터로 바꿔야 합니다. 그대로 두면 방문 기록과 공개 카운터 요청이 `seah-yoo.goatcounter.com`으로 전송됩니다.

복사 후 수정해야 하는 위치는 다음과 같습니다.

```html
<script data-goatcounter="https://seah-yoo.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
```

위 스크립트의 `data-goatcounter` 값을 본인의 GoatCounter 주소로 바꾸고, `scripts/index.js`의 `GOATCOUNTER_COUNTER_ORIGIN` 값도 같은 GoatCounter 사이트의 origin으로 바꿉니다.

```js
const GOATCOUNTER_COUNTER_ORIGIN = 'https://seah-yoo.goatcounter.com';
```

## 프로젝트 구조

```text
.
├─ _config.yml                     # Jekyll 및 사이트 기본 설정
├─ _includes/
│  ├─ head.html                    # SEO 메타 태그와 구조화 데이터
│  └─ sidebar.html                 # 공통 아카이브·카테고리 사이드바
├─ _layouts/
│  ├─ categories.html              # 카테고리 페이지 레이아웃
│  ├─ home.html                    # 홈페이지 레이아웃
│  └─ post.html                    # 칼럼 레이아웃
├─ _posts/                         # 마크다운 칼럼 원본
├─ assets/
│  └─ images/                      # 모든 칼럼의 공개 이미지
├─ scripts/index.js                # 기존 해시 주소 호환 처리, 이미지 캡션 생성, GoatCounter 표시
├─ styles/index.css                # 사이트 디자인
├─ categories.html                 # 카테고리별 글 모아보기 페이지
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

`category` 값은 홈페이지 카드, 글 상단 카테고리 버튼, 사이드바 카테고리 목록, `/categories/` 페이지에서 자동으로 사용됩니다. 공백이 포함된 카테고리 이름도 앵커 이동이 가능하도록 slug로 변환되므로, 예를 들어 `Game Industry`는 `/categories/#game-industry`로 연결됩니다.

### 3. 이미지 추가하기

이미지는 `_posts`가 아니라 `assets/images` 폴더에 저장합니다.

```text
assets/images/example-post-cover.png
assets/images/example-post-image-02.png
assets/images/example-post-image-03.jpg
```
