# 유세아의 문하수도

> **The Literary Underground**  
> 게임 산업, 인터넷 문화, 서브컬처, 영화, AI와 사회를 비평하는 유세아의 에세이·칼럼 아카이브입니다.

**웹사이트:** https://seah-yoo.github.io/

## 소개

이 저장소는 GitHub Pages와 Jekyll로 운영되는 개인 칼럼 블로그입니다.

각 글은 `/posts/<slug>/` 형태의 독립적인 정적 HTML 문서로 생성됩니다. 검색 엔진과 소셜 미디어 미리보기 봇이 제목, 설명, 본문, 대표 이미지와 구조화 데이터를 직접 읽을 수 있도록 구성되어 있습니다.

코스믹 오렌지 오로라, 리퀴드 글래스 패널, 고정형 사이드바를 중심으로 한 디자인을 유지하면서 다음 기능을 제공합니다.

- 포스트별 고유 URL과 canonical 주소
- Open Graph, X 카드, `Blog`·`BlogPosting` JSON-LD
- 자동 `sitemap.xml`과 `robots.txt`
- GoatCounter 익명 방문·읽기 신호와 정적 읽기의 맥박
- 예상 완독 시간, 스크롤 진행 표시, 핵심 논지와 자동 목차
- Kramdown 각주 및 참고 문헌과 본문 상호 이동
- Front Matter 작성 시각 기준 이전 글·다음 글
- Front Matter 기반 연재 목록
- 관측 시작, 주제 성좌, 자동 시간의 궤적
- 공개 카운터 기반 정적 「읽기의 맥박」 페이지
- Front Matter 기반 자료 기록실
- 제목·본문·카테고리·주제·연재 전체 검색
- 영어·일본어 번역 링크
- SNS 공유, RSS, 인쇄와 PDF 저장, 인용문 PNG 카드
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

## GoatCounter: 익명 방문과 읽기의 맥박

이 사이트는 GoatCounter를 사용합니다. 여기서 숫자는 사람을 식별한 정확한 독자 수가 아니라, 세션 기반으로 집계된 **익명 방문 흐름**입니다. GoatCounter의 공개 카운터 응답에서 `count_unique`는 `count`와 같은 하위호환 필드이므로 별도의 순방문 지표로 표시하지 않습니다.

### 공통 설정

GoatCounter 사이트 코드와 화면 캐시 시간은 한 곳에서 관리합니다.

```json
// _data/analytics.json
{
  "goatcounterCode": "seah-yoo",
  "summaryCacheMinutes": 20,
  "summaryLabel": "익명 방문 집계"
}
```

- `goatcounterCode`만 바꾸면 모든 레이아웃의 추적 스크립트와 공개 카운터 요청이 함께 바뀝니다.
- 공통 추적 태그는 `_includes/analytics-tracking.html`에 있습니다.
- 정적 페이지·홈·카테고리·포스트가 같은 설정을 사용하므로 포크하거나 도메인을 바꿀 때 누락될 위험이 적습니다.

### 사이드바와 게시물 카운터

사이드바에는 `READING PULSE`라는 이름으로 최근 7일, 최근 30일, 누적 방문을 보입니다.

```text
7일 42 · 30일 84
Σ누적 1,240
```

- 달력상 주·월이 아니라 각각 최근 7일·최근 30일 범위입니다.
- 숫자는 사이드바가 화면 가까이에 보일 때만 불러옵니다.
- 같은 브라우저 탭에서는 `sessionStorage`에 짧게 보관해 매 페이지 이동마다 3~4회 요청하지 않습니다. 이 저장값에는 방문자 식별 정보가 없습니다.
- 새 경로와 새 읽기 이벤트의 `404 + count: 0` 응답은 정상적인 0으로 처리합니다.
- 게시물 제목 아래에는 `누적 방문 N회`를 보입니다. 카운터 경로는 canonical URL을 우선 사용해 레거시 URL과 통계가 갈라질 가능성을 줄입니다.
- GoatCounter 공개 카운터는 즉시 갱신되는 수치가 아니며, 광고 차단기·네트워크 환경에 따라 일부 방문이 빠질 수 있습니다.

### 읽기·공유 이벤트

페이지뷰만으로는 글이 실제로 읽혔는지 알기 어려우므로, 다음의 익명 이벤트를 추가로 기록합니다. 읽기 진행 이벤트는 게시물당 한 번만 보내고, 나머지 상호작용은 GoatCounter의 기본 세션 집계로 중복을 줄입니다. 검색어·인용문 원문·이메일·사용자 입력은 보내지 않습니다.

| 이벤트 | 발생 조건 |
| --- | --- |
| `read-75--<slug>` | 글의 읽기 진행이 75%에 도달했을 때 |
| `read-complete--<slug>` | 30초 이상 머문 뒤 읽기 진행이 90%에 도달했을 때 |
| `quote-card-export--<slug>` | PNG 인용 카드를 만들었을 때 |
| `share-*--<slug>` | 공유 창·공유 수단·주소 복사·인쇄/PDF를 사용했을 때 |
| `reference-open--<id>` | 자료 기록실의 외부 참고문헌을 열었을 때 |
| `start-here-select--<path>` | 시작 경로에서 글을 선택했을 때 |

GoatCounter가 아직 준비되지 않은 아주 이른 클릭은 짧은 큐에 보관해 전송을 재시도합니다. 동적으로 만들어지는 인용 카드처럼 초기 자동 바인딩 대상이 아닌 요소도 JavaScript에서 직접 기록합니다.

### 공유 UTM 규칙

카카오톡, 텔레그램, LINE, X, Threads, Facebook 및 시스템 공유는 공유 대상 URL에 아래 UTM 값을 붙입니다. GoatCounter는 이 값을 캠페인으로 자동 분류합니다.

```text
utm_source=threads
utm_medium=share
utm_campaign=post-2026-07-07-game-for-girls
```

주소 복사는 읽기 좋은 canonical 주소를 그대로 유지하고, 복사 행동 자체만 이벤트로 기록합니다. 뉴스레터나 직접 작성한 SNS 게시물에도 같은 규칙을 사용하면 유입원을 비교할 수 있습니다.

### 정적 「읽기의 맥박」 페이지

[`/reading-pulse/`](https://seah-yoo.github.io/reading-pulse/)는 공개 GoatCounter 카운터를 하루 한 번 읽어 만든 정적 스냅샷입니다. 누적 방문, 최근 30일 글 방문, 75% 읽기와 완독 신호를 글별로 보여 줍니다.

- 원본 데이터: `_data/reading_pulse.json`
- 생성 도구: `scripts/refresh-reading-pulse.mjs`
- 자동 갱신: `.github/workflows/refresh-reading-pulse.yml` — 매일 12:17 KST 및 수동 실행
- 비밀키를 사용하지 않습니다. 공개 `/counter/*.json` 응답만 읽으므로 브라우저나 저장소에 GoatCounter API 키를 넣지 않습니다.

로컬에서 스냅샷을 새로 만들려면 Node.js 20 이상에서 다음을 실행합니다.

```powershell
node scripts/refresh-reading-pulse.mjs
```

### 개인정보와 통계 제외

GoatCounter는 쿠키·localStorage·영구 식별자를 사용하지 않는 익명 집계를 표방합니다. 사이트의 [소개 페이지](https://seah-yoo.github.io/about/)에는 `#toggle-goatcounter`를 이용해 이 브라우저의 추적을 제외하는 링크를 둡니다. 통계 제외를 선택해도 공개 숫자를 화면에 보여 주는 읽기 전용 요청은 별도로 남을 수 있습니다.

관련 문서: [Visitor counter](https://www.goatcounter.com/help/visitor-counter), [Events](https://www.goatcounter.com/help/events), [Campaign tracking](https://www.goatcounter.com/help/campaigns), [Privacy policy](https://www.goatcounter.com/help/privacy).

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
테마: Cosmic Orange 사용자 정의 테마
언어: 한국어
로딩: lazy
```

댓글 데이터는 GitHub Discussions에 저장됩니다. 댓글이나 반응을 남기려면 방문자가 GitHub 계정으로 로그인해야 합니다.

성능을 위해 사용자가 댓글 영역 가까이 내려왔을 때만 giscus 스크립트를 불러옵니다.

## 반응형 사이드바

- PC에서는 화면 왼쪽의 고정형 사이드바
- 모바일에서는 아래로 스크롤하면 방문 집계, 메뉴, Archive, Categories가 모두 접힘
- 브랜드, `TOP`, 검색 버튼은 접힌 상태에서도 유지
- 위로 스크롤하면 메뉴가 다시 펼쳐지고, `TOP` 버튼은 페이지 상단으로 이동
- CSS Grid의 실제 콘텐츠 높이를 사용한 약 0.52초 애니메이션
- `prefers-reduced-motion` 환경에서는 모션 최소화

## 발견과 아카이브 페이지

사이드바의 `Observe` 영역에서 아래 정적 페이지로 이동할 수 있습니다. 모든 목록은 Jekyll 빌드 시 게시물 Front Matter를 읽어 자동으로 생성됩니다.

| 주소 | 역할 | 작성자가 관리할 값 |
| --- | --- | --- |
| `/start-here/` | 관측 시작: 질문별 입문 읽기 순서 | `start_here`, `start_here_order` |
| `/about/` | 관측자: 블로그 소개와 편집 원칙 | `about.html`의 문구 |
| `/timeline/` | 시간의 궤적: 작성 시각순 아카이브 | 없음 |
| `/reading-pulse/` | 읽기의 맥박: 익명 방문·읽기 신호 | GoatCounter 공개 집계 |
| `/topics/` | 주제 성좌: 여러 질문으로 글 탐색 | `topics` |
| `/references/` | 자료 기록실: 참고문헌 통합 목록 | `references` |

### 시작 경로

`_data/paths.yml`에 경로의 제목·소개·순서를 정하고, 각 포스트에 아래 값을 추가합니다.

```yaml
start_here: "game-industry"
start_here_order: 2
```

`start_here` 값은 `_data/paths.yml`의 `id`와 정확히 같아야 합니다. 같은 경로의 글은 `start_here_order` 오름차순으로 표시됩니다. 경로에 넣지 않을 글은 두 값을 생략하면 됩니다.

### 주제 성좌

`category`가 큰 분류라면 `topics`는 글을 여러 관점으로 연결하는 세분화된 분류입니다. 주제 목록과 설명은 `_data/topics.yml`에 두고, 게시물에서는 사람에게 읽기 쉬운 `label` 값을 그대로 씁니다.

```yaml
topics:
  - "여성향 게임"
  - "게임 문화"
  - "시장 관성"
```

주제는 2~4개 정도를 권장합니다. 새 주제는 먼저 `_data/topics.yml`에 `label`, `slug`, `description`을 등록한 뒤 같은 `label`을 게시물에 추가합니다. 주제는 검색 색인에도 포함됩니다.

### 자료 기록실과 참고문헌

`/references/`는 각 포스트의 `references` 배열을 합쳐 보여줍니다. 동일한 `id`를 쓰면 자료 기록실에는 한 번만 보이고, 그 자료를 인용한 글이 함께 표시됩니다.

```yaml
references:
  - id: "esa-2025-game-player-survey"
    type: "Report"
    author: "미국 엔터테인먼트소프트웨어협회"
    title: "2025년 게임 이용자 조사"
    publisher: "선택 사항"
    year: 2025
    url: "https://example.com/source" # 선택 사항
    note: "이 자료를 인용한 이유나 범위" # 선택 사항
```

- `id`는 영문·숫자·하이픈으로 만든 안정적인 식별자이며 필수입니다.
- 같은 자료를 여러 글에서 쓸 때는 서지 정보와 `id`를 동일하게 적습니다.
- `url`이 있으면 자료 기록실의 제목이 외부 원문 링크가 됩니다.
- 본문 속 각주와 자료 기록실용 `references`는 함께 쓸 수 있습니다. 전자는 문장 가까이, 후자는 블로그 전체의 서지를 관리합니다.

### 시간의 궤적과 관측자 페이지

시간의 궤적은 모든 포스트를 연도·날짜순으로 자동으로 배열하므로 별도 메타데이터가 필요 없습니다. 연도별 반투명 글래스 패널 위에 각 글의 기록 카드를 배치하며, 모바일에서는 같은 정보를 더 촘촘한 세로 흐름으로 보여줍니다.

관측자·편집 원칙은 `about.html`을 직접 고쳐 관리합니다. 현재 초안에는 블로그가 다루는 범위, 쓰는 방식, 읽는 방법, 이용과 참여 원칙이 들어 있습니다.

## 글 읽기 보강

### 예상 완독 시간, 진행 표시, 핵심 논지

포스트가 열리면 본문 텍스트를 기준으로 `예상 완독 시간: n분`을 계산하고, 화면 맨 위에 읽기 진행 표시를 보여줍니다. 서버 요청 없이 브라우저에서 동작합니다.

글의 핵심 주장을 제목 아래에 따로 보여주려면 선택적으로 `thesis`를 추가합니다.

```yaml
thesis: "이 글에서 독자가 먼저 붙잡아야 할 핵심 주장"
```

값이 없으면 핵심 논지 카드도 표시하지 않습니다.

### 각주 및 참고 문헌

Kramdown의 표준 footnote 문법을 사용합니다. 화면에서는 글 끝의 `각주 및 참고 문헌` 영역으로 정리되며 본문 번호, 참고 문헌 번호, 돌아가기 링크를 모두 제공합니다.

```markdown
이 주장은 한 조사 결과와 함께 읽을 필요가 있다.[^source-1]

[^source-1]: 저자 또는 기관, 『자료 제목』, 2025, 12–15쪽. [원문 보기](https://example.com)
```

각주 및 참고 문헌 영역은 자동 목차에서 제외됩니다. 영역 안의 제목이 본문 목차에 섞이지 않도록 처리되어 있습니다.

### 인용 카드

Markdown 인용문(`>`)은 글래스 인용 블록으로 표시되고, 그 아래에 `인용 카드 만들기` 버튼이 자동으로 생깁니다.

```markdown
> 독립적으로 읽혀야 할 문장 또는 짧은 단락입니다.
```

버튼을 누르면 브라우저에서만 Canvas로 1080×1350 PNG를 만들고 저장합니다. 서버 업로드나 자동 다운로드는 없으며, 독자가 직접 버튼을 누를 때만 파일을 만듭니다. 긴 인용문은 카드 안에서 읽기 좋게 일부가 말줄임 처리될 수 있습니다.

## 현재 포스트 화면 순서

```text
카테고리(왼쪽) / 번역 버튼(오른쪽)
제목
부제목
예상 완독 시간(왼쪽) / 누적 방문(오른쪽)
자동 목차
핵심 논지
본문
공유 / RSS / 인쇄·PDF
각주 및 참고 문헌
연재 목록
이어 읽기: 이전 글 / 다음 글
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
thesis: "선택 사항: 목차 바로 아래에 표시할 핵심 논지"
start_here: "game-industry" # 선택 사항: _data/paths.yml의 id
start_here_order: 1 # 선택 사항: 같은 시작 경로 안의 순서
topics: # 선택 사항: _data/topics.yml의 label을 2~4개 권장
  - "게임 문화"
references: # 선택 사항: /references/에 자동 수집
  - id: "source-id"
    type: "Report"
    author: "저자 또는 기관"
    title: "자료 제목"
    year: 2025
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
- `subtitle`: 포스트 제목 아래에 표시할 부제목
- `date`: 작성 시각 및 이전·다음 글 정렬의 유일한 기준
- `last_modified_at`: 화면과 구조화 데이터에 표시할 마지막 수정 시각
- `category`: 카테고리 분류
- `description`: 검색 결과와 SNS 미리보기 설명
- `thesis`: 목차 바로 아래에 표시할 선택적인 핵심 논지
- `start_here`, `start_here_order`: 시작 경로와 해당 경로의 읽기 순서
- `topics`: 주제 성좌와 검색에 쓰는 세분화된 주제 배열
- `references`: 자료 기록실에 자동 수집할 참고문헌 배열
- `slug`, `permalink`: 포스트 식별자와 공개 URL
- `image`: 대표 이미지
- `series`, `series_order`: 선택적인 연재명과 회차
- `translation_en`, `translation_ja`: 선택적인 번역본 주소

### 3. 본문 작성하기

```markdown
본문 내용

## 첫 번째 장

### 세부 항목
```

제목과 부제목은 Front Matter의 `title`, `subtitle`에서 자동으로 출력되므로 본문에 다시 적지 않습니다. 본문에서 줄을 한 번 바꾸면 화면에서도 그대로 줄바꿈됩니다. 새 문단을 만들고 싶을 때는 빈 줄을 한 줄 둡니다.

```markdown
안녕.
반갑습니다.
```

위 예시는 화면에서도 두 줄로 표시됩니다. 이 동작은 `_config.yml`의 `kramdown.hard_wrap` 설정으로 관리합니다.

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
├─ .github/workflows/
│  └─ refresh-reading-pulse.yml    # 매일 공개 카운터 스냅샷 갱신
├─ _config.yml
├─ _includes/
│  ├─ head.html                    # SEO, RSS 발견, SNS 카드, JSON-LD, hreflang
│  ├─ analytics-tracking.html      # 공통 GoatCounter 추적 태그
│  ├─ sidebar.html                 # 카운터, TOP, 검색, Archive, Categories
│  ├─ site-search.html             # 명령 팔레트 검색 UI
│  ├─ post-translations.html       # 영어·일본어 번역 버튼
│  ├─ post-series.html             # 연재 목록
│  ├─ post-navigation.html         # date 기준 이전·다음 글
│  ├─ post-share.html              # 공유, RSS, 인쇄·PDF와 공유 모달
│  └─ post-comments.html           # giscus 댓글 설정
├─ _data/
│  ├─ analytics.json               # GoatCounter 코드와 요약 캐시 설정
│  ├─ paths.yml                    # 시작 경로의 제목과 소개
│  ├─ reading_pulse.json           # 공개 카운터 기반 정적 독서 스냅샷
│  └─ topics.yml                   # 주제 지도 항목과 설명
├─ _layouts/
│  ├─ categories.html
│  ├─ home.html
│  ├─ page.html                    # 관측 시작·주제 성좌·자료 기록실·시간의 궤적·읽기의 맥박·관측자 공통 레이아웃
│  └─ post.html                    # 포스트 전체 구성과 읽기 정보·목차 삽입 위치
├─ _posts/                         # 포스트 마크다운 원본
├─ assets/images/                  # 포스트와 프로필 이미지
├─ scripts/
│  ├─ index.js                     # 레거시 URL, 캡션, GoatCounter 요약·이벤트
│  ├─ sidebar-collapse.js          # 모바일 사이드바와 TOP 동작
│  ├─ site-search.js               # 전체 검색, 단축키, 결과 정렬
│  ├─ post-actions.js              # 공유, 인쇄, 완독 시간, 각주, 목차, 인용 카드, giscus 지연 로딩
│  └─ refresh-reading-pulse.mjs    # 공개 GoatCounter 정적 스냅샷 생성
├─ styles/
│  ├─ index.css                    # 기본 디자인과 반응형 레이아웃
│  ├─ sidebar-collapse.css         # 모바일 사이드바 애니메이션
│  ├─ counter.css                  # 카운터 디자인
│  ├─ search.css                   # 검색 버튼과 명령 팔레트
│  ├─ post-actions.css             # 읽기 보강, 각주, 목차, 연재, 공유, 인쇄, 댓글
│  ├─ cosmic-orange.css            # 코스믹 오렌지 디자인 토큰과 전체 테마
│  └─ giscus-cosmic-orange.css     # giscus 코스믹 오렌지 사용자 정의 테마
├─ categories.html
├─ start-here.html                 # 관측 시작: 입문 읽기 경로
├─ topics.html                     # 주제 성좌
├─ timeline.html                   # 시간의 궤적
├─ references.html                 # 자료 기록실
├─ reading-pulse.html              # 읽기의 맥박
├─ about.html                      # 관측자와 편집 원칙
├─ search.json                     # Jekyll이 생성하는 정적 검색 색인
├─ feed.xml                        # RSS 2.0 피드
├─ index.html
├─ robots.txt
├─ sitemap.xml
└─ README.md
```

## 외부 서비스 의존성

- GitHub Pages 및 Jekyll: 정적 사이트 호스팅과 빌드
- GoatCounter: 익명 방문·읽기 신호·공개 카운터 기반 정적 독서 스냅샷
- giscus 및 GitHub Discussions: 댓글과 반응
- Google Fonts 및 jsDelivr: 웹폰트와 스타일 리소스
- 각 SNS의 공식 공유 URL: 포스트 공유

전체 검색, 관측 시작, 주제 성좌, 시간의 궤적, 자료 기록실, 읽기의 맥박, 예상 완독 시간, 각주 및 참고 문헌, 인용 카드, 목차, 연재, 이전·다음 글, RSS 생성과 인쇄 레이아웃은 별도의 유료 서버 없이 정적으로 동작합니다.
