# 유세아의 문하수도

> **The Literary Underground**  
> 게임 산업, 인터넷 문화, 서브컬처, 영화, AI와 사회를 비평하는 유세아의 에세이·칼럼 아카이브입니다.

**웹사이트:** https://seah-yoo.github.io/

## 소개

이 저장소는 GitHub Pages와 Jekyll로 운영되는 개인 칼럼 블로그입니다.

각 글은 `/posts/<slug>/` 형태의 독립적인 정적 HTML 문서로 생성됩니다. 검색 엔진과 소셜 미디어 미리보기 봇이 글의 제목, 설명, 본문, 대표 이미지와 구조화 데이터를 직접 읽을 수 있도록 구성되어 있습니다.

오로라 배경, 글래스 패널, 고정형 사이드바를 중심으로 한 기존 디자인을 유지하면서 방문자 통계, 게시물 조회수, 번역 링크, 공유 기능, 댓글과 반응 기능을 추가했습니다.

## 주요 기능

### 콘텐츠와 탐색

- 글마다 고유한 permalink와 canonical 주소
- 이전 `#/post/<slug>` 주소에서 새 포스트 주소로 자동 이동
- `/categories/` 카테고리 모아보기와 카테고리별 앵커 이동
- 사이드바의 Archive 및 Categories 내비게이션
- 현재 읽는 글의 사이드바 항목 강조
- 마크다운 이미지의 `alt` 문구를 이미지 캡션으로 자동 변환

### 검색 엔진과 공유 미리보기

- Open Graph 메타데이터
- X(Twitter) 카드 메타데이터
- `Blog` 및 `BlogPosting` JSON-LD 구조화 데이터
- 자동 생성되는 `sitemap.xml`
- `robots.txt`를 통한 크롤링 안내
- 포스트별 canonical URL
- 번역본이 등록된 경우 `hreflang` 대체 언어 링크 자동 생성

### 반응형 UI

- PC에서는 고정형 사이드바 사용
- 모바일에서는 스크롤을 내리면 Archive와 Categories 영역만 접힘
- 카운터와 `TOP` 버튼은 접힌 상태에서도 유지
- `TOP` 버튼을 누르면 페이지 상단으로 부드럽게 이동하고 사이드바가 다시 펼쳐짐
- 실제 콘텐츠 높이를 사용하는 CSS Grid 기반 접힘 애니메이션
- 약 `0.52초`의 완만한 감속 애니메이션
- `prefers-reduced-motion` 환경에서는 불필요한 모션 최소화

## GoatCounter 방문자 카운터와 조회수

이 사이트는 GoatCounter를 사용해 방문자 수와 게시물별 조회수를 표시합니다.

### 사이드바 카운터

카운터는 최근 7일, 최근 30일, 전체 누적 방문 수를 표시합니다. `Week`와 `Month`는 달력상의 주·월이 아니라 각각 최근 7일과 최근 30일 범위입니다.

PC 표시:

```text
Week 0001 · Month 0001
Total 0001
```

모바일 표시:

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
- 각 숫자 `0`부터 `9`까지 서로 다른 파스텔 계열 색상 적용
- `W`, `M`, `T` 첫 글자는 숫자 팔레트와 다른 포인트 색상으로 강조
- 공개 카운터 캐시 시점이 달라도 `Week ≤ Month ≤ Total` 관계가 유지되도록 화면에서 보정
- 데이터가 아직 없는 경우 GoatCounter의 `404 + count: 0` 응답도 정상적인 `0`으로 처리

### 게시물 조회수

게시물별 조회수는 포스트 제목 바로 아래에 표시합니다.

- 네 자리까지는 일반 숫자로 표시
- 다섯 자리부터 천 단위 쉼표 적용
- 포스트별 전체 누적 조회수 사용

### GoatCounter 설정 변경 시

다른 GoatCounter 계정을 사용할 경우 다음 위치를 함께 변경해야 합니다.

```html
<script data-goatcounter="https://example.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

```js
const GOATCOUNTER_COUNTER_ORIGIN = 'https://example.goatcounter.com';
```

현재 관련 파일:

- `_layouts/home.html`
- `_layouts/categories.html`
- `_layouts/post.html`
- `_includes/sidebar.html`
- `scripts/index.js`
- `styles/counter.css`

## 포스트 번역 링크

각 포스트 상단에는 영어와 일본어 번역 버튼이 표시됩니다.

번역본이 없으면 버튼은 비활성화된 준비 중 상태로 표시됩니다. 번역본을 작성한 뒤 원문 포스트의 Front Matter에 주소를 추가하면 자동으로 활성화됩니다.

```yaml
translation_en: /en/posts/example-post/
translation_ja: /ja/posts/example-post/
```

등록 시 다음 기능이 함께 적용됩니다.

- 영어 `hreflang="en"`
- 일본어 `hreflang="ja"`
- 원문 한국어 `hreflang="ko"`
- 번역 버튼의 해당 언어 링크 활성화

번역 페이지의 저장 경로와 permalink는 자유롭게 정할 수 있으며, Front Matter에는 실제 공개 주소를 입력해야 합니다.

## 포스트 공유 기능

본문이 끝난 뒤, 작성일·수정일·작성자 정보보다 위에 `이 글 공유하기` 버튼이 표시됩니다.

버튼을 누르면 모달 공유 창이 열리며 다음 항목을 지원합니다.

- 카카오톡
- 텔레그램
- LINE
- X
- Threads
- Facebook
- 웹페이지 주소 복사

### 카카오톡 공유

Kakao JavaScript 키가 없는 현재 기본 상태에서는 다음 순서로 동작합니다.

1. 모바일이나 지원 브라우저에서는 시스템 공유 창 사용
2. 시스템 공유를 지원하지 않으면 페이지 주소 복사

전용 카카오톡 공유 템플릿을 사용하려면 Kakao Developers에서 JavaScript 키와 사이트 도메인을 설정한 뒤 `_config.yml`에 다음 값을 추가할 수 있습니다.

```yaml
kakao_javascript_key: "YOUR_JAVASCRIPT_KEY"
```

JavaScript 키는 웹 클라이언트에서 사용하는 공개 식별자이지만, Kakao Developers의 허용 도메인은 반드시 실제 사이트 주소로 제한해야 합니다.

## giscus 댓글과 반응

작성일·수정일·작성자 정보 아래에는 giscus 기반 댓글과 반응 영역이 표시됩니다.

현재 설정:

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

성능을 위해 giscus 스크립트는 포스트를 열자마자 불러오지 않습니다. 사용자가 댓글 영역에 가까이 내려왔을 때 `IntersectionObserver`를 통해 추가로 지연 로딩합니다.

관련 파일:

- `_includes/post-comments.html`
- `scripts/post-actions.js`
- `styles/post-actions.css`

## 포스트 화면 구성

현재 포스트는 다음 순서로 구성됩니다.

```text
카테고리
번역 버튼
제목
조회수
부제목과 본문
공유 버튼
작성일 / 수정일 / 작성자
giscus 댓글과 반응
```

## 프로젝트 구조

```text
.
├─ _config.yml
├─ _includes/
│  ├─ head.html                    # SEO, SNS 카드, JSON-LD, hreflang
│  ├─ sidebar.html                 # 카운터, TOP, Archive, Categories
│  ├─ post-translations.html       # 영어·일본어 번역 버튼
│  ├─ post-share.html              # 공유 버튼과 공유 모달
│  └─ post-comments.html           # giscus 댓글 컨테이너와 설정
├─ _layouts/
│  ├─ categories.html
│  ├─ home.html
│  └─ post.html                    # 포스트 전체 구성
├─ _posts/                         # 한국어 포스트 마크다운 원본
├─ assets/
│  └─ images/                      # 포스트와 프로필 이미지
├─ scripts/
│  ├─ index.js                     # 레거시 URL, 캡션, GoatCounter
│  ├─ sidebar-collapse.js          # 모바일 사이드바 접힘과 TOP 동작
│  └─ post-actions.js              # 공유 기능, 주소 복사, giscus 지연 로딩
├─ styles/
│  ├─ index.css                    # 기본 디자인과 반응형 레이아웃
│  ├─ sidebar-collapse.css         # 모바일 사이드바 애니메이션
│  ├─ counter.css                  # 카운터 숫자와 라벨 디자인
│  └─ post-actions.css             # 번역, 공유 모달, 댓글 영역 디자인
├─ categories.html
├─ index.html
├─ robots.txt
├─ sitemap.xml
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
_posts/2026-06-22-example-post.md
```

### 2. Front Matter 작성하기

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
# 번역본이 준비된 경우에만 사용
# translation_en: /en/posts/example-post/
# translation_ja: /ja/posts/example-post/
---
```

필드 설명:

- `title`: 포스트 제목
- `subtitle`: 포스트 부제목
- `date`: 작성 시각
- `last_modified_at`: 마지막 수정 시각
- `category`: 홈페이지 카드와 카테고리 페이지에서 사용할 분류
- `description`: 검색 결과와 공유 미리보기 설명
- `slug`: 포스트 식별자
- `permalink`: 실제 공개 URL
- `image`: 대표 이미지
- `translation_en`, `translation_ja`: 선택적인 번역본 주소

### 3. 본문 작성하기

본문의 첫 번째 `# 제목`은 포스트의 화면상 제목으로 사용됩니다. 조회수는 렌더링된 첫 번째 `<h1>` 바로 아래에 자동 삽입됩니다.

```markdown
# 글 제목

## 부제목

본문 내용
```

### 4. 이미지 추가하기

이미지는 `_posts`가 아니라 `assets/images` 폴더에 저장합니다.

```text
assets/images/example-post-cover.png
assets/images/example-post-image-02.png
assets/images/example-post-image-03.jpg
```

마크다운 이미지의 대체 텍스트는 화면에서 캡션으로도 사용됩니다.

```markdown
![이미지 설명]({{ page.image | relative_url }})
```

## 외부 서비스 의존성

이 사이트는 다음 외부 서비스를 사용합니다.

- GitHub Pages 및 Jekyll: 정적 사이트 호스팅과 빌드
- GoatCounter: 방문자 카운터와 게시물 조회수
- giscus 및 GitHub Discussions: 댓글과 반응
- Google Fonts 및 jsDelivr: 웹폰트와 스타일 리소스
- 각 SNS의 공식 공유 URL: 포스트 공유

외부 서비스가 일시적으로 차단되거나 광고 차단 확장 프로그램에 의해 제한되더라도 포스트 본문과 기본 탐색 기능은 계속 사용할 수 있습니다.
