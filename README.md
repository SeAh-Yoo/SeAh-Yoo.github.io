# 유세아의 문하수도

> **The Literary Underground**  
> 게임 산업, 인터넷 문화, 서브컬처, 영화, AI와 사회를 비평하는 유세아의 에세이·칼럼 아카이브입니다.

**웹사이트:** https://seah-yoo.github.io/

## 소개

이 저장소는 GitHub Pages와 Jekyll로 운영되는 개인 칼럼 블로그입니다.

각 글은 `/posts/<slug>/` 형태의 독립적인 정적 HTML 문서로 생성됩니다. 검색 엔진과 소셜 미디어 미리보기 봇이 제목, 설명, 본문, 대표 이미지와 구조화 데이터를 직접 읽을 수 있도록 구성되어 있습니다.

오로라 배경, 글래스 패널, 고정형 사이드바를 중심으로 한 디자인을 유지하면서 다음 기능을 제공합니다.

- 포스트별 고유 URL과 canonical 주소
- Open Graph, X 카드, `Blog`·`BlogPosting` JSON-LD
- 자동 `sitemap.xml`과 `robots.txt`
- GoatCounter 방문자 카운터와 게시물별 조회수
- 자동 목차와 현재 읽는 항목 표시
- Front Matter 작성 시각 기준 이전 글·다음 글
- Front Matter 기반 연재 목록
- 제목·본문·카테고리·연재 전체 검색
- 영어·일본어 번역 링크
- SNS 공유, RSS, 인쇄와 PDF 저장
- giscus 댓글과 반응
- 모바일 사이드바 접힘과 `TOP` 버튼

## 콘텐츠와 탐색

### 자동 목차

포스트 본문에 `h2` 또는 `h3`가 두 개 이상 있으면 제목 아래에 목차가 자동으로 생성됩니다.

- `##`, `###` 제목을 자동 수집
- Front Matter의 `subtitle`과 정확히 같은 부제목은 목차에서 제외
- PC에서는 기본적으로 펼침
- 모바일에서는 기본적으로 접힘
- 스크롤 위치에 따라 현재 읽는 항목 강조
- 목차 항목 클릭 시 해당 소제목으로 이동
- 소제목 옆 `#` 버튼으로 해당 위치의 URL 복사
- 제목이 하나 이하이면 목차 영역을 표시하지 않음

관련 파일:

- `_layouts/post.html`
- `scripts/post-actions.js`
- `styles/post-actions.css`

### 이전 글과 다음 글

포스트 하단에는 이전 글과 다음 글이 표시됩니다.

정렬 기준은 **오직 각 마크다운 파일 Front Matter의 `date` 값**입니다.

```yaml
date: 2026-06-22 14:30:00 +0900
```

다음 값은 순서 계산에 전혀 사용하지 않습니다.

- `last_modified_at`
- 실제 `.md` 파일 생성 시각
- Git 커밋 시각
- 파일명이나 마지막 편집 시각

`이전 글`은 현재 글보다 `date`가 이른 글 중 가장 가까운 글이고, `다음 글`은 현재 글보다 `date`가 늦은 글 중 가장 가까운 글입니다. 정확히 같은 작성 시각을 가진 글끼리는 임의의 보조 기준을 사용하지 않으므로 서로 이전·다음 관계로 연결하지 않습니다.

카테고리 유입 여부에 따라 이동 대상을 바꾸는 방식은 사용하지 않으며, 항상 블로그 전체 작성 시간순으로 작동합니다.

관련 파일:

- `_includes/post-navigation.html`
- `_layouts/post.html`

### 연재 기능

같은 연재에 속한 글은 Front Matter에 `series`와 `series_order`를 작성합니다.

```yaml
series: "게임사가 신뢰를 잃는 방법"
series_order: 1
```

동일한 `series` 값을 가진 글은 포스트 하단에 하나의 연재 목록으로 표시됩니다.

- 현재 글의 연재 순서와 전체 편수 표시
- 현재 글 강조
- 다른 회차로 바로 이동
- `series_order`가 있으면 회차 순으로 정렬
- `series_order`를 사용하지 않는 연재는 작성 시각순으로 정렬

한 연재에서는 모든 글에 `series_order`를 일관되게 작성하는 것을 권장합니다.

관련 파일:

- `_includes/post-series.html`
- `_layouts/post.html`
- `styles/post-actions.css`

## 블로그 전체 검색

사이드바의 카운터와 `TOP` 버튼 아래, Archive 위에 블로그 전체 검색 기능이 있습니다.

PC에서는 `블로그 검색` 버튼과 단축키 안내가 표시됩니다. 모바일에서는 공간을 차지하지 않도록 돋보기 버튼만 표시됩니다.

명령 팔레트형 검색창은 화면 위에 별도의 검색 패널을 띄우는 방식입니다. 검색 중에도 현재 페이지를 떠나지 않으며 키보드로 빠르게 이동할 수 있습니다.

### 검색 대상

- 포스트 제목
- 본문 전체
- 설명
- 카테고리
- 연재명

### 조작 방법

```text
Ctrl + K 또는 Cmd + K  검색창 열기
/                      검색창 열기
↑ / ↓                  검색 결과 이동
Enter                  선택한 글 열기
Esc                    검색창 닫기
```

검색 결과는 제목 일치도를 가장 높게 평가하고, 그다음 연재명·카테고리·설명·본문 일치도를 반영해 정렬합니다. 동점이면 작성 시각이 최근인 글을 우선합니다.

검색 색인은 Jekyll 빌드 시 `/search.json`으로 정적으로 생성되며 별도의 검색 서버나 외부 검색 서비스가 필요하지 않습니다. 최대 12개의 결과를 표시합니다.

관련 파일:

- `_includes/site-search.html`
- `search.json`
- `scripts/site-search.js`
- `styles/search.css`
- `_includes/sidebar.html`

## GoatCounter 방문자 카운터와 조회수

이 사이트는 GoatCounter를 사용해 방문자 수와 게시물별 조회수를 표시합니다.

### 사이드바 카운터

최근 7일, 최근 30일, 전체 누적 방문 수를 표시합니다. `Week`와 `Month`는 달력상의 주·월이 아니라 각각 최근 7일과 최근 30일 범위입니다.

PC:

```text
Week 0001 · Month 0001
Total 0001
```

모바일:

```text
W 0001 · M 0001
T 0001
```

표시 규칙:

```text
0       → 0000
1       → 0001
42      → 0042
1234    → 1234
10000   → 10,000
50304   → 50,304
1000000 → 1,000,000
```

- 네 자리 미만은 앞에 `0`을 채움
- 다섯 자리부터 천 단위 쉼표 적용
- 숫자 `0`부터 `9`까지 서로 다른 파스텔 색상 적용
- `W`, `M`, `T`는 숫자와 다른 포인트 색상으로 강조
- 독립적인 캐시 시점에도 `Week ≤ Month ≤ Total` 관계가 유지되도록 보정
- 데이터가 없을 때의 `404 + count: 0` 응답을 정상적인 0으로 처리

게시물 조회수는 포스트 제목 바로 아래에 표시하며, 다섯 자리부터 천 단위 쉼표를 적용합니다.

## 번역 링크

각 포스트 상단에는 영어와 일본어 번역 버튼이 표시됩니다. 번역본이 없으면 비활성화된 준비 중 상태로 보입니다.

번역본을 작성한 뒤 원문 Front Matter에 공개 주소를 추가합니다.

```yaml
translation_en: /en/posts/example-post/
translation_ja: /ja/posts/example-post/
```

등록 시 번역 버튼과 `hreflang="en"`, `hreflang="ja"` 메타데이터가 함께 활성화됩니다. 원문에는 `hreflang="ko"`가 사용됩니다.

## 공유, RSS, 인쇄와 PDF 저장

본문과 탐색 영역 아래, 작성일·수정일·작성자 정보 위에 세 개의 도구가 표시됩니다.

```text
공유 · 피드 · 인쇄 / PDF
```

### 공유

공유 버튼은 다음 서비스를 지원합니다.

- 카카오톡
- 텔레그램
- LINE
- X
- Threads
- Facebook
- 웹페이지 주소 복사

Kakao JavaScript 키가 없으면 모바일 시스템 공유창을 사용하고, 지원하지 않는 환경에서는 주소를 복사합니다. 전용 카카오톡 공유 템플릿을 사용할 때는 `_config.yml`에 JavaScript 키를 추가할 수 있습니다.

```yaml
kakao_javascript_key: "YOUR_JAVASCRIPT_KEY"
```

Kakao Developers의 허용 도메인은 실제 사이트 주소로 제한해야 합니다.

### RSS 피드

`/feed.xml`에서 RSS 2.0 피드를 제공합니다.

- 최신 포스트 최대 20개 제공
- 제목, URL, 작성 시각, 카테고리, 설명 포함
- 모든 페이지의 `<head>`에 RSS 자동 발견 링크 추가
- 포스트 하단의 `피드` 버튼으로 직접 열기

관련 파일:

- `feed.xml`
- `_includes/head.html`
- `_includes/post-share.html`

### 인쇄와 PDF 저장

`인쇄 / PDF` 버튼은 브라우저의 인쇄 창을 엽니다. 인쇄 창에서 프린터를 선택하거나 `PDF로 저장`을 선택할 수 있습니다.

인쇄용 스타일에서는 다음 요소를 숨깁니다.

- 사이드바와 오로라 배경
- 번역 버튼, 조회수, 목차
- 연재와 이전·다음 탐색
- 공유·RSS·인쇄 버튼
- giscus 댓글

본문, 이미지, 작성일과 작성자 정보는 밝은 인쇄용 레이아웃으로 출력됩니다.

## giscus 댓글과 반응

작성일·수정일·작성자 정보 아래에는 giscus 댓글과 반응 영역이 표시됩니다.

```text
저장소: SeAh-Yoo/SeAh-Yoo.github.io
Discussion 카테고리: Announcements
연결 방식: pathname
엄격한 일치: 사용
반응: 사용
Discussion 메타데이터 전송: 사용 안 함
댓글 입력창: 위쪽
테마: transparent_dark
언어: 한국어
로딩: lazy
```

댓글 데이터는 GitHub Discussions에 저장됩니다. 댓글이나 반응을 남기려면 방문자가 GitHub 계정으로 로그인해야 합니다.

성능을 위해 사용자가 댓글 영역 가까이 내려왔을 때만 giscus 스크립트를 불러옵니다.

## 반응형 사이드바

- PC에서는 화면 왼쪽의 고정형 사이드바
- 모바일에서는 스크롤을 내리면 Archive와 Categories만 접힘
- 카운터, `TOP`, 검색 버튼은 접힌 상태에서도 유지
- `TOP` 버튼을 누르면 페이지 상단으로 이동하며 목록이 다시 펼쳐짐
- CSS Grid의 실제 콘텐츠 높이를 사용한 약 0.52초 애니메이션
- `prefers-reduced-motion` 환경에서는 모션 최소화

## 현재 포스트 화면 순서

```text
카테고리
번역 버튼
제목
조회수
자동 목차
부제목과 본문
연재 목록
이전 글 / 다음 글
공유 / RSS / 인쇄·PDF
작성일 / 수정일 / 작성자
giscus 댓글과 반응
```

연재 정보가 없는 글에는 연재 목록이 나타나지 않으며, 목차 항목이 부족한 글에는 목차가 나타나지 않습니다.

## 새 글 작성 방법

### 1. 파일 만들기

```text
_posts/YYYY-MM-DD-slug.md
```

### 2. Front Matter 작성하기

```yaml
---
layout: post
title: "글 제목"
subtitle: "부제목"
date: 2026-06-22 14:30:00 +0900
last_modified_at: 2026-06-24 20:00:00 +0900
category: "Game Industry"
description: "검색 결과와 공유 미리보기에 표시할 글 소개"
slug: example-post
permalink: /posts/example-post/
image: /assets/images/example-post-cover.png

# 선택 사항: 연재
# series: "연재명"
# series_order: 1

# 선택 사항: 번역본
# translation_en: /en/posts/example-post/
# translation_ja: /ja/posts/example-post/
---
```

필드 설명:

- `title`: 포스트 제목
- `subtitle`: 포스트 부제목이자 자동 목차 제외 기준
- `date`: 작성 시각 및 이전·다음 글 정렬의 유일한 기준
- `last_modified_at`: 화면과 구조화 데이터에 표시할 마지막 수정 시각
- `category`: 카테고리 분류
- `description`: 검색 결과와 SNS 미리보기 설명
- `slug`, `permalink`: 포스트 식별자와 공개 URL
- `image`: 대표 이미지
- `series`, `series_order`: 선택적인 연재명과 회차
- `translation_en`, `translation_ja`: 선택적인 번역본 주소

### 3. 본문 작성하기

```markdown
# 글 제목

## 부제목

본문 내용

## 첫 번째 장

### 세부 항목
```

본문의 첫 번째 `# 제목`은 화면상 포스트 제목으로 사용됩니다. 조회수와 목차는 첫 번째 `<h1>` 아래에 자동 삽입됩니다.

### 4. 이미지 추가하기

이미지는 `assets/images` 폴더에 저장합니다.

```text
assets/images/example-post-cover.png
assets/images/example-post-image-02.png
assets/images/example-post-image-03.jpg
```

마크다운 이미지의 대체 텍스트는 화면에서 캡션으로도 사용됩니다.

## 프로젝트 구조

```text
.
├─ _config.yml
├─ _includes/
│  ├─ head.html                    # SEO, RSS 발견, SNS 카드, JSON-LD, hreflang
│  ├─ sidebar.html                 # 카운터, TOP, 검색, Archive, Categories
│  ├─ site-search.html             # 명령 팔레트 검색 UI
│  ├─ post-translations.html       # 영어·일본어 번역 버튼
│  ├─ post-series.html             # 연재 목록
│  ├─ post-navigation.html         # date 기준 이전·다음 글
│  ├─ post-share.html              # 공유, RSS, 인쇄·PDF와 공유 모달
│  └─ post-comments.html           # giscus 댓글 설정
├─ _layouts/
│  ├─ categories.html
│  ├─ home.html
│  └─ post.html                    # 포스트 전체 구성과 목차 삽입 위치
├─ _posts/                         # 포스트 마크다운 원본
├─ assets/images/                  # 포스트와 프로필 이미지
├─ scripts/
│  ├─ index.js                     # 레거시 URL, 캡션, GoatCounter
│  ├─ sidebar-collapse.js          # 모바일 사이드바와 TOP 동작
│  ├─ site-search.js               # 전체 검색, 단축키, 결과 정렬
│  └─ post-actions.js              # 공유, 인쇄, 목차, giscus 지연 로딩
├─ styles/
│  ├─ index.css                    # 기본 디자인과 반응형 레이아웃
│  ├─ sidebar-collapse.css         # 모바일 사이드바 애니메이션
│  ├─ counter.css                  # 카운터 디자인
│  ├─ search.css                   # 검색 버튼과 명령 팔레트
│  └─ post-actions.css             # 목차, 연재, 탐색, 공유, 인쇄, 댓글
├─ categories.html
├─ search.json                     # Jekyll이 생성하는 정적 검색 색인
├─ feed.xml                        # RSS 2.0 피드
├─ index.html
├─ robots.txt
├─ sitemap.xml
└─ README.md
```

## 외부 서비스 의존성

- GitHub Pages 및 Jekyll: 정적 사이트 호스팅과 빌드
- GoatCounter: 방문자 카운터와 게시물 조회수
- giscus 및 GitHub Discussions: 댓글과 반응
- Google Fonts 및 jsDelivr: 웹폰트와 스타일 리소스
- 각 SNS의 공식 공유 URL: 포스트 공유

전체 검색, 목차, 연재, 이전·다음 글, RSS 생성과 인쇄 레이아웃은 별도의 유료 서버 없이 정적으로 동작합니다.
