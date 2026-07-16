# 유세아의 문하수도
> **하위 문화의 중심을 꿈꾸는 서브컬처의 하수도**  

**웹사이트:** https://seah-yoo.github.io/

## 소개
이 저장소는 GitHub Pages와 Jekyll로 운영되는 유세아의 개인 칼럼 블로그이자, 실제 운영 환경을 포함한 Jekyll 블로그 테마입니다.

- 화면 구성은 장문의 가독성을 최우선으로 하며, 오래 머물러도 가급적 눈이 아프지 않도록 디자인하는 것이 목표입니다.

- 이 저장소는 배포용 예제 테마가 아니라 실제 운영 중인 블로그입니다. 포크하여 사용할 경우, 포스트 내용, 저자 정보, 이미지, 분석 설정, giscus 저장소 정보와 브랜드 문구를 자신의 환경에 맞게 교체해야 합니다.

각 글은 `/posts/<slug>/` 형태의 독립적인 정적 HTML 문서로 생성됩니다.

검색 엔진과 소셜 미디어 미리보기 봇이 제목, 설명, 본문, 대표 이미지와 구조화 데이터를 직접 읽을 수 있도록 구성되어 있습니다.

## 주요 기능

> Jekyll 기반 정적 GitHub Pages 개인 블로그

- 포스트별 고유 URL과 검색 엔진용 대표 주소(canonical URL) 기능
- 존재하지 않는 포스트 404 페이지 출력 기능
- SNS 링크 미리보기(Open Graph·X 카드)와 검색엔진 구조화 데이터(JSON-LD)
- 자동으로 작성 및 처리되는 `sitemap.xml`과 `robots.txt`
- 예상 완독 시간, 스크롤 진행 표시, 핵심 논지와 자동 목차
- Kramdown 각주 및 참고 문헌과 본문 상호 이동
- Front Matter 작성 시각 기준 이전 글·다음 글
- Front Matter 기반 연재 목록
- 질문별 입문 경로인 메인 페이지
- 소재의 연결 관계를 보여 주는 태그 및 소재별 분류 페이지
- 작성 시각순 전체 목록인 히스토리 페이지
- GoatCounter 기반 익명 방문과 완독 흐름을 보여 주는 현황 페이지
- Front Matter 기반 레퍼런스(각주 및 참고자료) 페이지
- 제목·본문·카테고리·주제·연재 전체 검색
- SNS 공유, RSS, 인쇄와 PDF 저장, 인용문 PNG 카드
- 한국어·영어·일본어 번역 포스트 링크
- 5종류의 색상 변경 테마 (giscus 테마 호환, 선택한 테마는 브라우저의 localStorage에 저장)
- [작업 예정] 한국어·영어·일본어 메뉴 기능 (선택한 언어는 브라우저의 localStorage에 저장)
- giscus 댓글과 반응
- 데스크톱 스티키 사이드바와 모바일 접이식 메뉴
- `_data/site_identity.yml` 기반 블로그 콘셉트와 세계관 문구 관리

## 디자인 원칙

> 사이트의 외피는 유리처럼, 글을 읽는 종이는 종이처럼.

- 장문의 가독성을 최우선으로 디자인.
- 포스트 본문에는 읽기에 필요한 기능만 제공하고, 그 밖의 화면에서는 불필요한 정보를 최소화.
- 버튼, 카드, 테두리, 그림자를 과도하게 강조하지 않도록 디자인.
- 장식보다 여백과 정보 위계로 고급스러운 연출.
- 중요한 요소만 강하게 보이고 나머지는 조용히 물러서게 디자인.
- 본문 폭, 글자 크기, 행간과 정보 위계는 모든 색상 테마에서 동일.
- 본문은 모든 테마에서 가급적 중립적인 색상으로 긴 글을 읽을 때 피로가 생기지 않게 제한.
- 큰 메뉴명은 기능을 명확히 설명하고, 작은 보조 명칭은 블로그 콘셉트를 반영한 공간 은유를 담당.
- 리퀴드 글래스는 외곽에, 본문은 차분하게 디자인.
- 유리 효과 자체보다는 경계, 반사, 층위, 부드러운 깊이감으로 표현.
- 배경에는 은은한 오로라와 색 번짐 사용.
- 테마 색상은 링크, 분류, 선, 버튼, 작은 표식에만 사용.
- 콘셉트와 세계관 표현은 기능의 이해와 사용자 경험을 방해하지 않는 범위에서 제한적으로 사용.
- 모바일은 축소판이 아니라 별도의 읽기 환경임을 명심.
- 사이드바가 독서를 방해하지 않도록 디자인.
- 접근성을 장식보다 우선.
- 모든 디자인 토큰은 `styles/design-system.css`에서 중앙 관리.
- 브랜드, 화면 문구와 블로그 콘셉트 관련 문구는 `_data/site_identity.yml`에서 중앙 관리.

## 포크 후 반드시 변경할 항목

이 저장소는 배포용 빈 테마가 아니라 실제 운영 중인 블로그를 포함합니다. 포크하여 사용할 경우 아래의 사이트 소유권, 외부 서비스 계정, 분석 정보와 저장소 연결값을 자신의 환경에 맞게 교체해야 합니다.

### Google Search Console 사이트 소유권 인증

저장소 루트의 `google27564fde5057ccbe.html`은 현재 블로그의 Google Search Console 사이트 소유권 인증 파일입니다.

포크한 저장소에서는 기존 인증 파일을 삭제한 뒤 자신의 Google Search Console에서 새 HTML 인증 파일을 발급받아 저장소 루트에 추가해야 합니다.

`_config.yml`에도 기존 인증 파일명이 등록되어 있으므로 함께 삭제하거나 새 파일명으로 교체합니다.

```yaml
defaults:
  - scope:
      path: "본인의-google-인증파일.html"
    values:
      sitemap: false
```

이 설정은 인증 파일이 `sitemap.xml`에 포함되지 않도록 합니다. Google Search Console을 사용하지 않는 경우 인증 파일과 관련된 `_config.yml` 설정을 모두 삭제할 수 있습니다.

### 카카오톡 공유 API

포스트 공유 창에는 카카오톡 공유 기능이 구현되어 있습니다. 기본 상태에서는 Kakao JavaScript 키가 설정되지 않아 브라우저의 시스템 공유 기능을 사용하며, 시스템 공유를 사용할 수 없는 환경에서는 글 주소를 복사합니다.

Kakao SDK 기반 공유를 활성화하려면 자신의 Kakao Developers 애플리케이션에서 발급한 JavaScript 키를 `_config.yml`에 추가합니다.

```yaml
kakao_javascript_key: "본인의_Kakao_JavaScript_키"
```

카카오 개발자 설정에도 실제 블로그 주소를 허용된 웹 도메인으로 등록해야 합니다. 키는 포스트의 HTML에 포함되는 공개 JavaScript 키이므로 REST API 키나 Admin 키를 입력하지 않습니다.

설정이 완료되면 사용자가 카카오톡 공유 버튼을 눌렀을 때 Kakao JavaScript SDK를 지연 로딩하여 제목, 설명, 대표 이미지와 포스트 주소를 포함한 피드형 공유 메시지를 생성합니다.

### GoatCounter 방문 통계

이 블로그는 GoatCounter를 이용해 방문 횟수와 읽기·공유 이벤트를 익명 집계합니다.

현재 계정 코드는 `_data/analytics.json`에서 관리합니다.

```json
{
  "goatcounterCode": "본인의-GoatCounter-코드",
  "summaryCacheMinutes": 20,
  "summaryLabel": "익명 방문 집계"
}
```

`goatcounterCode`에는 `https://<code>.goatcounter.com`에서 `<code>`에 해당하는 값을 입력합니다. 기존 `seah-yoo` 값은 반드시 자신의 계정 코드로 교체해야 합니다.

이 설정은 다음 기능에 함께 사용됩니다.

* 페이지와 포스트 방문 기록
* 포스트별 누적 방문 수
* 주간·월간·전체 방문 현황
* 75% 읽기와 완독 이벤트
* 공유, 주소 복사, 인쇄·PDF 및 인용 카드 이벤트
* `/reading-pulse/` 정적 방문 현황 페이지
* GitHub Actions를 통한 일일 통계 스냅샷 갱신

`/reading-pulse/`와 포스트별 공개 카운터는 GoatCounter의 공개 `/counter/*.json` 응답을 사용하며 별도의 API 비밀키를 저장하지 않습니다. 해당 기능을 사용하려면 자신의 GoatCounter 사이트에서 공개 카운터 응답을 사용할 수 있어야 합니다.

포크 직후에는 기존 블로그 통계가 들어 있는 `_data/reading_pulse.json`을 삭제하거나 초기화해야 합니다.

`.github/workflows/refresh-reading-pulse.yml`은 매일 통계를 갱신한 뒤 `_data/reading_pulse.json`의 변경 내용을 자동 커밋합니다. 이 기능을 사용하려면 포크한 저장소에서 GitHub Actions의 콘텐츠 쓰기 권한을 허용해야 합니다.

자동 통계 페이지를 사용하지 않을 경우 해당 워크플로를 비활성화하거나 삭제할 수 있습니다. GoatCounter 추적을 모두 끄려면 다음처럼 코드를 비워 둡니다.

```json
{
  "goatcounterCode": "",
  "summaryCacheMinutes": 20,
  "summaryLabel": "익명 방문 집계"
}
```

`scripts/refresh-reading-pulse.mjs`의 요청 User-Agent에는 기존 블로그 이름과 주소가 포함되어 있으므로 포크 사용자는 자신의 프로젝트명과 사이트 주소로 교체하는 것을 권장합니다.

## 브랜드와 화면 문구 관리

브랜드명, 공간 관리인 정보, 홈 화면, 탐색 메뉴, 페이지 제목·소개, 검색 문구, 방문 현황 지표와 테마 표시명은 `_data/site_identity.yml`에서 관리합니다.

레이아웃과 페이지 파일에는 가능한 한 표시 문구를 직접 적지 않습니다.

`_layouts/home.html`, `about.html`, `_layouts/page.html`, `_includes/sidebar.html`과 `_includes/head.html`은 중앙 설정의 값을 조합해 화면과 SEO 메타데이터를 생성합니다.

### 중앙 설정 구조

| 설정 그룹 | 관리하는 내용 |
| --- | --- |
| `brand` | 블로그명, 슬로건, SEO 설명, 홈 태그라인, 저자와 인용 카드 문구 |
| `operator` | 공간 관리인 소개, 기록 목적·방법, 보존 메모와 안내문 |
| `navigation` | 사이드바와 보조 탐색 메뉴 문구 |
| `search` | 검색창 제목, 상태와 도움말 |
| `themes` | 화면 테마 표시명 |
| `pages.home` | 홈 대표 글, 최근 기록과 탐색 영역 문구 |
| `pages.about` | 공간 안내의 섹션 제목과 익명 통계 문구 |
| `pages.reading_pulse.dashboard` | 방문 현황의 지표명과 설명 |
| 그 밖의 `pages` 항목 | 페이지별 메뉴명, 공간형 보조 명칭, 제목, 소개와 SEO 설명 |

### 메뉴명 위계

사이드바는 각 페이지의 `label`을 큰 기능명으로, `title`을 작은 공간형 보조 명칭으로 표시합니다.

```yaml
pages:
  timeline:
    label: "전체 게시물"
    title: "공간 이력"
    eyebrow: "WRITTEN TRACES"
```

작은 모바일 화면에서는 보조 명칭이 숨겨질 수 있으므로 `label`만 읽어도 기능을 이해할 수 있어야 합니다.

### 페이지 식별자

각 정적 페이지의 Front Matter에는 화면 문구 대신 `identity_key`를 둡니다.

| `identity_key` | 경로 | 화면 기능 | 콘셉트 강조용 보조 명칭 |
| --- | --- | --- | --- |
| `home` | `/` | 홈 | 문하수도 |
| `start` | `/start-here/` | 처음 읽기 | 중심 합류점 |
| `about` | `/about/` | 공간 안내 | 이곳은 어디 |
| `timeline` | `/timeline/` | 전체 게시물 | 공간 이력 |
| `reading_pulse` | `/reading-pulse/` | 방문자 현황 | 남겨진 발자국 |
| `topics` | `/topics/` | 소재별 분류 | 공간 계통 |
| `references` | `/references/` | 출처 및 인용 | 수집물 보관함 |
| `categories` | `/categories/` | 주제별 분류 | 하수 관로 |
| `not_found` | `/404.html` | 찾을 수 없는 페이지 | 막힌 통로 |

## 색상 테마

사이드바의 테마 변경 메뉴 (`공간 설정`)에서 다섯 가지 테마를 선택할 수 있습니다.

테마는 색상 분위기만 바꾸며 타이포그래피, 간격과 레이아웃은 바꾸지 않습니다.

- `unit-violet` — **하수관 중심**: 남보라 바탕과 보라·민트 강조색
- `ember-white` — **벽돌길 관로**: 적갈색 바탕과 주황·적색 강조색
- `azure-form` — **하수 저장고**: 청색 바탕과 하늘색·연보라 강조색
- `sovereign-obsidian` — **어둑한 통로**: 흑요색 바탕과 금색·장미색 강조색
- `neon-shell` — **이끼 배관로**: 녹청색 바탕과 민트·주황 강조색

선택값은 `localStorage`의 `literary-underground:preferences:v1`에 저장됩니다.

`scripts/site-preferences.js`는 사이트 본문, 브라우저 테마 색상과 giscus 사용자 정의 테마를 함께 갱신합니다.

## 발견과 아카이브

사이드바의 `탐색기`와 `보조 탐색기`에서 아래 정적 페이지로 이동합니다.

목록은 Jekyll 빌드 시 게시물 Front Matter를 읽어 자동으로 생성됩니다.

| 주소 | 역할 | 콘셉트 강조용 보조 명칭 | 작성자가 관리할 값 |
| --- | --- | --- | --- |
| `/start-here/` | 탐색 페이지 | 중심 합류점 | `start_here`, `start_here_order` |
| `/about/` | 소개 페이지 | 공간 안내 | `_data/site_identity.yml`의 `operator`, `pages.about` |
| `/timeline/` | 전체 게시물 | 공간 이력 | 없음 |
| `/reading-pulse/` | 방문자 현황 | 남겨진 발자국 | GoatCounter 공개 집계 |
| `/topics/` | 소재별 분류 | 공간 계통 | `topics` |
| `/references/` | 출처 및 인용 | 수집물 보관함 | `references` |
| `/categories/` | 주제별 분류 | 하수 관로 | `category` |

### 탐색 페이지

`_data/paths.yml`에 입문 경로의 제목과 설명을 정하고, 각 포스트에 아래 값을 추가합니다.

```yaml
start_here: "game-industry"
start_here_order: 2
```

`start_here` 값은 `_data/paths.yml`의 `id`와 정확히 같아야 합니다. 같은 경로의 글은 `start_here_order` 오름차순으로 표시됩니다.

### 소재별 분류 페이지

`category`가 큰 전문 분야라면 `topics`는 글을 여러 질문과 소재로 연결하는 세분화된 분류입니다. 주제 목록과 설명은 `_data/topics.yml`에서 관리합니다.

```yaml
topics:
  - "여성향 게임"
  - "게임 문화"
  - "시장 관성"
```

주제는 2~4개 정도를 권장합니다. 새 주제는 먼저 `_data/topics.yml`에 `label`, `slug`, `description`을 등록한 뒤 같은 `label`을 게시물에 추가합니다.

### 각주 모아보기 및 출처, 레퍼런스 페이지

`/references/`는 각 포스트의 `references` 배열을 합쳐 보여 줍니다. 동일한 `id`를 쓰면 출처 목록에는 한 번만 나타나며, 그 자료를 인용한 글이 함께 표시됩니다.

```yaml
references:
  - id: "esa-2025-game-player-survey"
    type: "Report"
    author: "미국 엔터테인먼트소프트웨어협회"
    title: "2025년 게임 이용자 조사"
    publisher: "선택 사항"
    year: 2025
    url: "https://example.com/source"
    note: "이 자료를 인용한 이유나 범위"
```

- `id`는 영문·숫자·하이픈으로 만든 안정적인 식별자이며 필수입니다.
- 같은 자료를 여러 글에서 쓸 때는 서지 정보와 `id`를 동일하게 적습니다.
- `url`이 있으면 제목이 외부 원문 링크가 됩니다.
- 본문 각주와 블로그 전체 출처용 `references`는 함께 사용할 수 있습니다.

## 블로그 전체 검색

검색은 사이드바 상단의 빠른 도구 영역에서 `TOP` 버튼과 나란히 제공됩니다.

- 데스크톱: 검색 버튼과 단축키 안내 표시
- 모바일: 돋보기 버튼만 표시
- 현재 페이지를 떠나지 않는 명령 팔레트형 검색창
- 제목, 본문, 설명, 카테고리, 주제와 연재명 검색
- 제목 일치도를 가장 높게 평가하고 최신 작성 시각을 보조 기준으로 사용
- 최대 12개 결과 표시

```text
Ctrl + K 또는 Cmd + K  검색창 열기
/                      검색창 열기
↑ / ↓                  검색 결과 이동
Enter                  선택한 글 열기
Esc                    검색창 닫기
```

검색 색인은 Jekyll 빌드 시 `/search.json`으로 정적으로 생성됩니다.

## 익명 방문과 읽기 현황

### 공통 설정

```json
// _data/analytics.json
{
  "goatcounterCode": "seah-yoo",
  "summaryCacheMinutes": 20,
  "summaryLabel": "익명 방문 집계"
}
```

- 게시물 제목 아래에 게시 일자, 예상 완독 시간과 누적 방문을 표시합니다.
- canonical URL을 카운터 경로로 우선 사용합니다.
- 공개 카운터는 즉시 갱신되지 않으며 광고 차단기·네트워크 환경에 따라 일부 방문이 빠질 수 있습니다.
- 검색어, 인용문 원문, 이메일과 사용자 입력은 전송하지 않습니다.

### 기록하는 읽기·공유 이벤트

| 이벤트 | 발생 조건 |
| --- | --- |
| `read-75--<slug>` | 글의 읽기 진행이 75%에 도달했을 때 |
| `read-complete--<slug>` | 30초 이상 머문 뒤 읽기 진행이 90%에 도달했을 때 |
| `quote-card-export--<slug>` | PNG 인용 카드를 만들었을 때 |
| `share-*--<slug>` | 공유 창·공유 수단·주소 복사·인쇄/PDF를 사용했을 때 |
| `reference-open--<id>` | 수집물 보관함의 외부 원문을 열었을 때 |
| `start-here-select--<path>` | 중심 합류점에서 글을 선택했을 때 |

### 정적 방문 현황 페이지

`/reading-pulse/`는 공개 GoatCounter 카운터를 하루 한 번 읽어 만든 정적 스냅샷입니다. 누적 방문, 최근 30일 방문, 75% 읽기와 완독 기록을 글별로 보여 줍니다.

- 원본 데이터: `_data/reading_pulse.json`
- 생성 도구: `scripts/refresh-reading-pulse.mjs`
- 자동 갱신: `.github/workflows/refresh-reading-pulse.yml`
- 비밀키 없이 공개 `/counter/*.json` 응답만 사용

```powershell
node scripts/refresh-reading-pulse.mjs
```

소개 페이지에서 이 브라우저의 통계 수집을 제외할 수 있습니다.

## 글 읽기 보강

### 본문 폭과 타이포그래피

본문 폭과 글자 크기, 행간은 `styles/design-system.css`의 읽기 토큰을 단일 기준으로 사용합니다.

```css
--reading-width: 43rem;
--reading-font-size: clamp(1rem, 0.96rem + 0.24vw, 1.125rem);
--reading-line-height: 1.8;
```

- 데스크톱 일반 본문은 최대 43rem 안에 배치
- 이미지·표·코드는 필요할 때 본문보다 넓게 표시하거나 독립적으로 가로 스크롤
- 모바일에서도 좌우 읽기 여백 확보
- 한국어 제목과 본문 소제목에 `word-break: keep-all` 사용

### 예상 완독 시간과 핵심 논지

포스트가 열리면 본문 텍스트를 기준으로 예상 완독 시간을 계산하고 화면 상단에 읽기 진행 표시를 보여 줍니다.

글의 핵심 주장을 제목 아래에 따로 보여 주려면 `thesis`를 추가합니다.

```yaml
thesis: "이 글에서 독자가 먼저 붙잡아야 할 핵심 주장"
```

### 자동 목차

본문에 `h2` 또는 `h3`가 두 개 이상 있으면 제목 아래에 목차가 자동 생성됩니다.

- PC에서는 기본 펼침, 모바일에서는 기본 접힘
- 현재 읽는 항목 강조
- 항목을 누르면 해당 소제목으로 이동
- 소제목 옆 `#` 버튼으로 주소 복사
- 각주 및 참고 문헌 영역은 목차에서 제외

### 각주와 인용 카드

Kramdown의 표준 footnote 문법을 사용합니다.

```markdown
이 주장은 한 조사 결과와 함께 읽을 필요가 있다.[^source-1]

[^source-1]: 저자 또는 기관, 『자료 제목』, 2025, 12–15쪽. [원문 보기](https://example.com)
```

Markdown 인용문 아래에는 `인용 카드 만들기` 버튼이 자동으로 생깁니다. 버튼을 누르면 브라우저에서 1080×1350 PNG를 생성합니다.

## 번역, 공유와 댓글

### 번역 링크

포스트 상단에는 영어와 일본어 번역 버튼이 표시됩니다. 번역본이 있으면 원문 Front Matter에 주소를 추가합니다.

```yaml
translation_en: /en/posts/example-post/
translation_ja: /ja/posts/example-post/
```

등록 시 번역 버튼과 `hreflang` 메타데이터가 함께 활성화됩니다.

### 공유, RSS, 인쇄와 PDF

포스트 하단에는 다음 도구가 표시됩니다.

```text
공유 · 피드 · 인쇄 / PDF
```

공유는 카카오톡, 텔레그램, LINE, X, Threads, Facebook, 시스템 공유와 주소 복사를 지원합니다. `/feed.xml`에서는 최신 포스트 최대 20개의 RSS 2.0 피드를 제공합니다.

인쇄용 스타일에서는 사이드바, 배경 장식, 번역 버튼, 조회수, 목차, 공유 도구와 댓글을 숨기고 본문을 밝은 레이아웃으로 출력합니다.

### giscus

작성 정보 아래에는 giscus 댓글과 반응 영역이 표시됩니다.

- 저장소: `SeAh-Yoo/SeAh-Yoo.github.io`
- Discussion 카테고리: `Announcements`
- 연결 방식: pathname
- 선택한 사이트 테마와 연동
- 한국어 UI
- 댓글 영역 가까이 내려왔을 때 지연 로딩

## 반응형 사이드바

- PC에서는 화면 왼쪽에 머무는 스티키 탐색 축
- 900px 이하에서는 상단 접이식 메뉴로 전환
- 브랜드, 검색, `MENU`, `TOP` 버튼은 메뉴가 닫혀도 유지
- 링크 선택, 바깥 영역 클릭, `Esc` 입력 시 메뉴 닫힘
- 스크롤 방향에 따라 자동으로 열거나 닫지 않음
- `prefers-reduced-motion` 환경에서는 모션 최소화

## 새 글 작성 방법

### 파일 만들기

```text
_posts/YYYY-MM-DD-slug.md
```

### Front Matter

```yaml
---
layout: post
title: "글 제목"
subtitle: "부제목"
date: 2026-06-22 14:30:00 +0900
last_modified_at: 2026-06-24 20:00:00 +0900
category: "Game Industry"
description: "검색 결과와 공유 미리보기에 표시할 글 소개"
thesis: "선택 사항: 목차 아래에 표시할 핵심 논지"
start_here: "game-industry"
start_here_order: 1
topics:
  - "게임 문화"
references:
  - id: "source-id"
    type: "Report"
    author: "저자 또는 기관"
    title: "자료 제목"
    year: 2025
slug: example-post
permalink: /posts/example-post/
image: /assets/images/example-post-cover.png

# 선택 사항
# series: "연재명"
# series_order: 1
# translation_en: /en/posts/example-post/
# translation_ja: /ja/posts/example-post/
---
```

- `date`: 작성 시각 및 이전·다음 글 정렬의 유일한 기준
- `last_modified_at`: 화면과 구조화 데이터에 표시할 마지막 수정 시각
- `category`: 큰 전문 분야
- `description`: 검색 결과와 SNS 미리보기 설명
- `thesis`: 선택적인 핵심 논지
- `start_here`, `start_here_order`: 중심 합류점의 경로와 읽기 순서
- `topics`: 공간 계통과 검색에 쓰는 세분화된 소재 배열
- `references`: 수집물 보관함에 자동 수집할 출처 배열
- `series`, `series_order`: 선택적인 연재명과 회차
- `translation_en`, `translation_ja`: 선택적인 번역본 주소

제목과 부제목은 Front Matter에서 자동 출력되므로 본문에 다시 적지 않습니다. `_config.yml`의 `kramdown.hard_wrap`이 활성화되어 있어 본문에서 한 번 줄을 바꾸면 화면에도 줄바꿈으로 반영됩니다.

이미지는 `assets/images` 폴더에 저장하며, 마크다운 이미지의 대체 텍스트는 화면에서 캡션으로도 사용됩니다.

## 프로젝트 구조

```text
.
├─ .github/workflows/
│  └─ refresh-reading-pulse.yml    # 공개 카운터 스냅샷 갱신
├─ _config.yml
├─ _includes/
│  ├─ head.html                    # SEO, SNS 카드, JSON-LD, hreflang
│  ├─ analytics-tracking.html      # GoatCounter 추적 태그
│  ├─ sidebar.html                 # 브랜드와 탐색 메뉴
│  ├─ site-search.html             # 검색 UI
│  ├─ post-translations.html       # 번역 버튼
│  ├─ post-series.html             # 연재 목록
│  ├─ post-navigation.html         # 이전·다음 글
│  ├─ post-share.html              # 공유, RSS, 인쇄·PDF
│  └─ post-comments.html           # giscus 댓글
├─ _data/
│  ├─ analytics.json               # GoatCounter 설정
│  ├─ paths.yml                    # 탐색 페이지의 경로 정보
│  ├─ reading_pulse.json           # 방문자 현황 스냅샷
│  ├─ site_identity.yml            # 브랜드·관리인·메뉴·페이지 문구
│  └─ topics.yml                   # 소재별 분류의 소재(태그)와 설명
├─ _layouts/
│  ├─ categories.html
│  ├─ home.html                    # 홈 편집 화면과 중앙화된 홈 카피
│  ├─ page.html                    # 정적 탐색 페이지 공통 레이아웃
│  └─ post.html                    # 포스트 전체 구성
├─ _posts/                         # 포스트 마크다운 원본
├─ assets/images/                  # 포스트와 프로필 이미지
├─ scripts/
│  ├─ index.js
│  ├─ sidebar-collapse.js
│  ├─ site-search.js
│  ├─ site-preferences.js
│  ├─ post-actions.js
│  └─ refresh-reading-pulse.mjs
├─ styles/
│  ├─ design-system.css
│  ├─ theme-system.css
│  ├─ index.css
│  ├─ home-editorial.css
│  ├─ reading-experience.css
│  ├─ sidebar-collapse.css
│  ├─ counter.css
│  ├─ search.css
│  └─ post-actions.css
├─ start-here.html                 # 탐색 페이지
├─ about.html                      # 안내 페이지
├─ timeline.html                   # 전체 게시물
├─ reading-pulse.html              # 방문자 현황
├─ topics.html                     # 소재별 분류
├─ references.html                 # 출처 및 인용
├─ categories.html                 # 주제별 분류
├─ search.json
├─ feed.xml
├─ index.html
└─ README.md
```

## 개인정보와 브라우저 저장

### 화면 설정 저장

사용자가 선택한 화면 테마를 기억하기 위해 브라우저의 로컬 저장소(localStorage)에 테마 설정값을 저장합니다.

이 정보에는 이름, 연락처 또는 사용자를 식별하기 위한 정보가 포함되지 않으며, 방문자가 브라우저의 사이트 데이터를 삭제하면 함께 제거됩니다.

### 익명 방문 통계

문하수도는 GoatCounter를 이용해 페이지별 방문 횟수와 브라우저·운영체제·국가·화면 크기 등의 익명 집계 정보를 확인합니다.

GoatCounter는 방문자의 브라우저에 추적용 쿠키나 고유 식별자를 저장하지 않으며, 수집된 정보는 사이트 이용 현황을 파악하고 읽기 환경을 개선하는 목적으로만 사용합니다.

표시되는 숫자는 개인을 식별한 독자 수의 실제 방문 수 또는 확정적인 단일 값이 아니며, 세션 기반이며 익명의 방문 흐름입니다.

### 외부 댓글 서비스 및 외부 서비스 의존성

댓글 기능은 GitHub 기반의 giscus를 사용합니다.

댓글을 열람하거나 작성하는 과정에서는 giscus와 GitHub의 개인정보 처리 기준이 적용될 수 있습니다.

- GitHub Pages 및 Jekyll: 정적 사이트 호스팅과 빌드
- GoatCounter: 익명 방문·읽기 현황과 공개 카운터
- giscus 및 GitHub Discussions: 댓글과 반응
- jsDelivr: 웹폰트와 giscus 사용자 정의 테마 리소스
- 각 SNS의 공식 공유 URL: 포스트 공유

검색, 탐색 페이지, 안내 페이지, 전체 게시물, 출처 및 인용, 방문자 현황, 예상 완독 시간, 각주와 참고 문헌, 인용 카드, 목차, 연재, 이전·다음 글, RSS와 인쇄 레이아웃은 별도의 유료 서버 없이 Github Pages 내에서 정적으로 동작합니다.
