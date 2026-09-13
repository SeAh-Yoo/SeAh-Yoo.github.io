# 이상기록 문하수도 — 유세아
> **하위 문화의 중심을 꿈꾸는 서브컬처의 하수도**  

**웹사이트:** https://seah-yoo.github.io/

## 소개
이 저장소는 GitHub Pages와 Jekyll로 운영되는 유세아의 개인 칼럼 블로그와 개인 위키입니다. AI, 게임, 만화·애니메이션, 영화, 인터넷 방송, 커뮤니티 등 서브컬처의 이야기를 기록합니다. 실제 운영 환경을 포함한 Jekyll 테마로도 구성되어 있습니다.

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
- 최근 기록을 보여 주는 홈과 질문별 입문 경로를 제공하는 안내소
- 소재의 연결 관계를 보여 주는 태그 및 소재별 분류 페이지
- 작성 시각순 전체 목록인 히스토리 페이지
- GoatCounter 기반 익명 방문과 완독 흐름을 보여 주는 현황 페이지
- 포스트·위키의 Front Matter 기반 출처 및 인용 페이지
- 개인 위키: 제목·별칭 검색, 자동 연결·역링크, 재사용 틀, 접기·펼치기
- 제목·본문·카테고리·주제·연재 전체 검색
- SNS 공유, RSS, 인쇄와 PDF 저장, 인용문 PNG 카드
- 국기 아이콘으로 선택하는 한국어·영어·일본어 인터페이스
- 언어별 포스트 자동 선택과 번역본이 없을 때 한국어 원문 대체 출력
- 5종류의 색상 변경 테마 (giscus 테마 호환, 선택한 테마와 언어는 브라우저의 localStorage에 저장)
- 언어별 포스트 링크와 `hreflang` 메타데이터 자동 생성
- giscus 댓글과 반응
- 데스크톱 스티키 사이드바와 모바일 접이식 메뉴
- `_data/site_identity.yml` 기반 전체 인터페이스 문구·링크·페이지 메모 관리

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
- 공통 디자인 토큰은 `styles/design-system.css`, 테마별 색상은 `styles/theme-system.css`에서 관리. 기능별 스타일은 각 CSS 파일에서 보완.
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
  "summaryCacheMinutes": 20
}
```

`goatcounterCode`에는 `https://<code>.goatcounter.com`에서 `<code>`에 해당하는 값을 입력합니다. 기존 `seah-yoo` 값은 반드시 자신의 계정 코드로 교체해야 합니다.

이 설정은 다음 기능에 함께 사용됩니다.

* 페이지와 포스트 방문 기록
* 포스트별 누적 방문 수
* 주간·월간·전체 방문 현황
* 75% 읽기와 완독 이벤트
* 공유, 주소 복사, 인쇄·PDF 및 인용 카드 이벤트
* `/visitor-stats/` 정적 방문 현황 페이지
* GitHub Actions를 통한 일일 통계 스냅샷 갱신

`/visitor-stats/`와 포스트별 공개 카운터는 GoatCounter의 공개 `/counter/*.json` 응답을 사용하며 별도의 API 비밀키를 저장하지 않습니다. 해당 기능을 사용하려면 자신의 GoatCounter 사이트에서 공개 카운터 응답을 사용할 수 있어야 합니다.

포크 직후에는 기존 블로그 통계가 들어 있는 `_data/reading_pulse.json`을 삭제하거나 초기화해야 합니다.

`.github/workflows/refresh-reading-pulse.yml`은 매일 통계를 갱신한 뒤 `_data/reading_pulse.json`의 변경 내용을 자동 커밋합니다. 이 기능을 사용하려면 포크한 저장소에서 GitHub Actions의 콘텐츠 쓰기 권한을 허용해야 합니다.

자동 통계 페이지를 사용하지 않을 경우 해당 워크플로를 비활성화하거나 삭제할 수 있습니다. GoatCounter 추적을 모두 끄려면 다음처럼 코드를 비워 둡니다.

```json
{
  "goatcounterCode": "",
  "summaryCacheMinutes": 20
}
```

`scripts/refresh-reading-pulse.mjs`의 요청 User-Agent에는 기존 블로그 이름과 주소가 포함되어 있으므로 포크 사용자는 자신의 프로젝트명과 사이트 주소로 교체하는 것을 권장합니다.

## 브랜드와 화면 문구 관리

관리인 이름은 한국어 `유세아`, 영어 `SeAh Yoo`, 일본어 `ユ・セア`로 표기합니다.
공통 저자 정보는 `shared.brand.locales.<언어>.author`, 소개 페이지는
`pages.about.locales.<언어>.sections.profile`에서 이름·대체 이름·이미지 설명을 함께 수정합니다.

포스트의 제목·부제·본문·출처처럼 글 자체에 속한 내용을 제외한 인터페이스 문구는 `_data/site_identity.yml`에서 관리합니다. 브랜드와 관리인 정보, 내부·외부 링크, 이미지 경로, 탐색 메뉴, 모든 정적 페이지의 제목·소개·목록, 검색·분석·포스트 도구 문구, 테마와 언어 표시명이 여기에 포함됩니다.

레이아웃, include, 정적 페이지와 JavaScript에는 표시 문구를 직접 적지 않고 중앙 설정의 키를 읽습니다. `{count}`, `{minutes}` 같은 치환 변수와 HTML 태그는 세 언어에서 보존합니다. 공통 URL은 `links`, 공통 이미지는 `assets`, 관리인 페이지 이미지는 `pages.about.images`에서 관리합니다.

기본 빌드는 `settings.default_language`인 한국어 문구로 정적 HTML을 만들고, `scripts/site-preferences.js`가 사용자가 고른 언어의 같은 키를 적용합니다.

### 중앙 설정 구조

| 설정 그룹 | 관리하는 내용 |
| --- | --- |
| `settings` | 기본 언어, 지원 언어와 국기·아이콘 경로, 브라우저 저장 키 |
| `links` | 홈·피드·검색 색인·라이선스·분석 안내 경로 |
| `assets` | 파비콘·프로필·기본 소셜 이미지 경로 |
| `shared.<구성요소>.locales.ko/en/ja` | 브랜드·메뉴·검색·테마·포스트 도구 등 공통 문구를 구성 요소별로 비교·편집 |
| `pages.<페이지>.locales.ko/en/ja` | 한 페이지의 제목·소개·SEO·본문·하단 메모를 세 언어와 함께 편집 |
| `pages.about.locales.<언어>.sections` | 관리인 소개와 다섯 섹션의 본문·이미지 대체 텍스트 |
| `pages.about.images` | 섹션별 이미지 경로, 크기, 좌우 배치 |
| `locales.ko/en/ja` | 기존 Liquid와 JavaScript를 위한 YAML 참조. 이곳에 문구를 중복 작성하지 않음 |

`&page_about_ko`는 원본에 붙인 이름이고 `*page_about_ko`는 그 원본을 가리킵니다.
페이지별 영역에서 수정하면 기존 `locales.ko.pages.about` 경로에도 자동으로 반영됩니다.
별도의 동기화 스크립트나 Jekyll 플러그인은 필요 없습니다.
관리인 소개는 기존 `operator`에서 `pages.about.locales.<언어>.sections.profile/editorial`로 이동했습니다.
명시적인 `data-i18n`(텍스트), `data-i18n-html`(저장소의 HTML 문구), `data-i18n-alt`(대체 텍스트)를 사용하면
같은 원문이라도 페이지 문맥에 맞는 키로 번역되고 줄바꿈·강조를 유지합니다.

세 언어의 키 구조는 동일하게 유지합니다. 새 문구 키를 추가할 때는 `ko`, `en`, `ja`에 같은 위치로 모두 추가해야 언어 전환 시 빠진 문구가 생기지 않습니다.

### 페이지별 하단 메모

정적 페이지의 하단 메모는 `pages.<identity_key>.locales.<언어>.notes`에서 편집합니다.

```yaml
pages:
  about:
    locales:
      ko:
        notes:
          enabled: true
          items:
            - title: "주의사항"
              body: "페이지에 표시할 첫 번째 메모"
            - title: "관리인의 메모"
              body: "페이지에 표시할 두 번째 메모"
```

메모 전체를 숨기려면 `enabled: false`로 바꾸고, 한 칸만 쓰려면 필요하지 않은 `items` 항목을 제거합니다. 같은 페이지 바로 아래의 `en`, `ja`에도 동일한 항목 구조를 유지합니다.

위키 목록(`/wiki/`)의 메모는 `pages.wiki.locales.<언어>.notes`에서 관리합니다. 다른 페이지와 마찬가지로
`enabled: false` 또는 `items: []`로 숨길 수 있습니다.

### 메뉴명 위계

사이드바는 각 페이지의 `label`을 큰 기능명으로, `title`을 작은 공간형 보조 명칭으로 표시합니다.

```yaml
pages:
  timeline:
    locales:
      ko:
        label: "시간순"
        title: "작성 이력"
        eyebrow: "시간순 | WRITTEN TRACES"
```

작은 모바일 화면에서는 보조 명칭이 숨겨질 수 있으므로 `label`만 읽어도 기능을 이해할 수 있어야 합니다.

### 페이지 식별자

각 정적 페이지의 Front Matter에는 화면 문구 대신 `identity_key`를 둡니다.

| `identity_key` | 경로 | 화면 기능 | 콘셉트 강조용 보조 명칭 |
| --- | --- | --- | --- |
| `home` | `/` | 홈 | 이상기록 문하수도 |
| `wiki` | `/wiki/` | 이상위키 | 개념 정리 |
| `start` | `/start-here/` | 안내소 | 시작 지점 |
| `about` | `/about/` | 관리인 | 관리 부서 |
| `timeline` | `/timeline/` | 시간순 | 작성 이력 |
| `visitor_stats` | `/visitor-stats/` | 방문 기록 | 방문객의 흔적 |
| `tags` | `/tags/` | 소재별 | 태그 모음 |
| `references` | `/references/` | 출처 & 인용 | 이상기록 추가 보관함 |
| `categories` | `/categories/` | 주제별 | 기록 분류 |
| `not_found` | `/404.html` | 오류 안내 | 해당 구역으로 진입할 수 없습니다 |

## 인터페이스 언어

사이드바의 국기 선택 메뉴에서 한국어(`ko`), 영어(`en`), 일본어(`ja`) 인터페이스를 선택합니다. 선택한 언어와 테마는 `localStorage`의 `literary-underground:preferences:v1`에 함께 저장되며, 다음 방문과 같은 사이트의 다른 페이지에도 적용됩니다.

언어를 바꾸면 다음 요소가 즉시 갱신됩니다.

- 탐색 메뉴, 페이지 소개, 하단 메모, 검색창과 포스트 도구
- 날짜 형식, 브라우저 제목, SEO·소셜 설명 메타데이터
- 테마·언어 선택기의 접근성 레이블과 giscus 언어
- 포스트 목록, 검색 결과와 현재 포스트의 언어별 문서

포스트는 같은 `translation_key`를 가진 문서 중 선택한 언어를 우선합니다. 해당 언어의 번역 문서가 없으면 `settings.default_language`인 한국어 문서를 출력합니다. 이 대체 규칙은 홈, 사이드바, 탐색·분류·히스토리 페이지, 검색 결과와 포스트 직접 방문에 동일하게 적용됩니다.

## 색상 테마

사이드바의 테마 변경 메뉴 (`공간 설정`)에서 다섯 가지 테마를 선택할 수 있습니다.

테마는 색상 분위기만 바꾸며 타이포그래피, 간격과 레이아웃은 바꾸지 않습니다.

- `sewer-center` — **하수관 중심**: 남보라 바탕과 보라·민트 강조색
- `brick-road-pipeline` — **벽돌길 관로**: 적갈색 바탕과 주황·적색 강조색
- `sewage-reservoir` — **하수 저장고**: 청색 바탕과 하늘색·연보라 강조색
- `dim-passage` — **어둑한 통로**: 흑요색 바탕과 금색·장미색 강조색
- `moss-pipeline` — **이끼 배관로**: 녹청색 바탕과 민트·주황 강조색

선택값은 인터페이스 언어와 함께 `localStorage`의 `literary-underground:preferences:v1`에 저장됩니다.

`scripts/site-preferences.js`는 사이트 문구·포스트 언어, 브라우저 테마 색상과 giscus 언어·사용자 정의 테마를 함께 갱신합니다.

## 발견과 아카이브

사이드바의 탐색 메뉴에서 아래 정적 페이지로 이동합니다.

기록 목록은 Jekyll 빌드 시 포스트·위키의 Front Matter와 중앙 페이지 설정을 읽어 생성됩니다.

| 주소 | 역할 | 콘셉트 강조용 보조 명칭 | 작성자가 관리할 값 |
| --- | --- | --- | --- |
| `/start-here/` | 탐색 페이지 | 시작 지점 | `start_here`, `start_here_order` |
| `/wiki/` | 개인 위키 | 개념 정리 | `_wiki/`의 제목·별칭·본문 |
| `/about/` | 소개 페이지 | 관리 부서 | `_data/site_identity.yml`의 `pages.about.locales.<언어>.sections` |
| `/timeline/` | 전체 게시물 | 작성 이력 | 없음 |
| `/visitor-stats/` | 방문자 현황 | 방문객의 흔적 | GoatCounter 공개 집계 |
| `/tags/` | 소재별 분류 | 태그 모음 | `topics` |
| `/references/` | 출처 및 인용 | 이상기록 추가 보관함 | `references` |
| `/categories/` | 주제별 분류 | 기록 분류 | `category` |

### 탐색 페이지

`_data/site_identity.yml`의 `pages.start.locales.<언어>.paths`에 입문 경로의 제목과 설명을 정하고, 각 포스트에 아래 값을 추가합니다.

```yaml
start_here: "game-industry"
start_here_order: 2
```

`start_here` 값은 기본 언어의 `pages.start.paths`에 있는 `id`와 정확히 같아야 합니다. 같은 `id`를 영어·일본어 사전에도 등록하고, 언어마다 `title`, `description`, `prompt`를 작성합니다. 같은 경로의 글은 `start_here_order` 오름차순으로 표시됩니다.

### 소재별 분류 페이지

`category_key`가 큰 전문 분야의 안정적인 식별자라면 `topics`는 글을 여러 질문과 소재로 연결하는 세분화된 분류입니다. 주제 목록과 설명은 `_data/site_identity.yml`의 `pages.tags.locales.<언어>.items`에서 관리합니다.

```yaml
topics:
  - "여성향 게임"
  - "게임 문화"
  - "시장 관성"
```

주제는 2~4개 정도를 권장합니다. 새 주제는 먼저 세 언어의 `pages.tags.items`에 같은 `id`와 언어별 `label`, `description`을 등록한 뒤 기본 언어의 `label`을 게시물에 추가합니다.

### 각주 모아보기 및 출처, 레퍼런스 페이지

`/references/`는 포스트와 위키의 `references` 배열을 합쳐 보여 줍니다. 설명용 각주의 URL은 자동 수집하지 않습니다. 동일한 `id`를 쓰면 출처 목록에는 한 번만 나타나며, 그 자료를 인용한 글이 함께 표시됩니다.

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

- 데스크톱: 검색, TOP, RSS 도구와 국기 언어 선택기를 표시
- 모바일: 터치 영역을 유지한 아이콘 버튼으로 표시
- 현재 페이지를 떠나지 않는 명령 팔레트형 검색창
- 포스트의 제목·본문·설명·카테고리·주제·연재명과 위키의 제목·별칭·본문 검색
- 제목 일치도를 가장 높게 평가하고 최신 작성 시각을 보조 기준으로 사용
- 최대 12개 결과 표시

```text
Ctrl + K 또는 Cmd + K  검색창 열기
/                      검색창 열기
↑ / ↓                  검색 결과 이동
Enter                  선택한 글 열기
Esc                    검색창 닫기
```

검색 색인은 Jekyll 빌드 시 `/search.json`으로 정적으로 생성됩니다. 모든 언어의 포스트가 색인에 들어가며, 검색 결과에는 같은 `translation_key` 그룹에서 현재 언어의 문서를 우선하고 없으면 한국어 문서를 한 번만 표시합니다.

## 익명 방문과 읽기 현황

### 공통 설정

```json
// _data/analytics.json
{
  "goatcounterCode": "seah-yoo",
  "summaryCacheMinutes": 20
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
| `reference-open--<id>` | 이상기록 추가 보관함의 외부 원문을 열었을 때 |
| `start-here-select--<path>` | 시작 지점에서 글을 선택했을 때 |

### 정적 방문 현황 페이지

`/visitor-stats/`는 공개 GoatCounter 카운터를 하루 한 번 읽어 만든 정적 스냅샷입니다.
상단은 사이트 누적 집계, 포스트·위키의 최근 30일 방문 합계, 포스트의 누적 완독 기록을 보여 줍니다.
포스트별 목록 아래에 위키별 방문 목록을 별도로 표시합니다. 위키에는 방문 수만 있으며 읽기 이벤트는 수집하지 않습니다.
75% 읽기와 완독은 중복될 수 있는 별개 이벤트이므로 합쳐서 조회수로 표시하지 않습니다.
사이트 누적값은 다른 페이지·이벤트를 포함할 수 있어 아래 목록의 합계와 다를 수 있습니다.

- 원본 데이터: `_data/reading_pulse.json`
- 생성 도구: `scripts/refresh-reading-pulse.mjs`
- 공개 URL 목록: Jekyll이 생성하는 `_site/reading-pulse-index.json`
- 자동 갱신: `.github/workflows/refresh-reading-pulse.yml`
- 비밀키 없이 공개 `/counter/*.json` 응답만 사용

```powershell
jekyll build --safe
node scripts/refresh-reading-pulse.mjs
jekyll serve --safe --host 127.0.0.1 --port 4173
```

스크립트는 기본 언어 포스트와 공개 위키 문서의 실제 Jekyll URL을 사용합니다.
개별 permalink, 컬렉션 설정, baseurl과 비공개/미래 포스트 제외는 Jekyll의 빌드 결과를 따릅니다.
다른 빌드 경로를 쓰면 `node scripts/refresh-reading-pulse.mjs <생성된-manifest-경로>`로 지정합니다.
정기 워크플로도 Jekyll 3.10.0으로 URL 목록을 만든 다음 집계합니다.

스냅샷 `schema_version: 2`는 `posts`, `wiki`, `period.start/end/timezone`을 저장합니다.
`month` 필드는 호환을 위해 이름을 유지하지만, 사이트 시간대의 오늘을 포함하는 최근 30개 날짜를 뜻합니다.
해당 범위를 `start=YYYY-MM-DD&end=YYYY-MM-DD`로 명시해 조회합니다.
공개 카운터의 범위와 캐시 동작은 [GoatCounter 문서](https://www.goatcounter.com/help/visitor-counter)를 참고하세요.
아직 방문하지 않은 경로의 404는 0으로 처리하고, 통신·응답 오류는 기존 스냅샷을 보존한 채 실패합니다.
수치나 표시 기간이 달라졌을 때만 저장하며, 위키만 달라진 경우도 갱신합니다.

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

포스트 상단에는 지원 언어별 번역 버튼이 자동으로 표시됩니다. 원문 Front Matter에 번역 주소를 직접 적지 않고, 각 언어를 별도의 포스트 파일로 만들며 같은 `translation_key`를 사용합니다.

```yaml
# 한국어 원문
lang: ko
translation_key: "example-post"
permalink: /posts/example-post/

# 영어 번역 파일
lang: en
translation_key: "example-post"
permalink: /en/posts/example-post/

# 일본어 번역 파일
lang: ja
translation_key: "example-post"
permalink: /ja/posts/example-post/
```

같은 `translation_key`가 연결된 문서를 기준으로 번역 버튼, 언어별 `hreflang`과 `x-default` 메타데이터가 함께 생성됩니다. 선택한 인터페이스 언어의 번역본이 없으면 한국어 원문으로 이동하고, 해당 번역 버튼은 준비 중 상태로 표시됩니다.

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
- 선택한 인터페이스 언어와 연동
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
lang: ko
translation_key: "example-post"
category_key: "game-industry"
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
---
```

- `lang`: 포스트 문서의 언어. `ko`, `en`, `ja` 중 하나
- `translation_key`: 원문과 번역본을 연결하는 공통 식별자
- `category_key`: 언어가 바뀌어도 유지되는 큰 전문 분야 식별자. `site_identity.yml`의 `pages.categories.locales.<언어>.items[].id`와 일치
- `date`: 작성 시각 및 이전·다음 글 정렬의 유일한 기준
- `last_modified_at`: 화면과 구조화 데이터에 표시할 마지막 수정 시각
- `category`: 큰 전문 분야
- `description`: 검색 결과와 SNS 미리보기 설명
- `thesis`: 선택적인 핵심 논지
- `start_here`, `start_here_order`: 시작 지점의 경로와 읽기 순서
- `topics`: 태그 모음과 검색에 쓰는 세분화된 소재 배열
- `references`: 이상기록 추가 보관함에 자동 수집할 출처 배열
- `series`, `series_order`: 선택적인 연재명과 회차

제목과 부제목은 Front Matter에서 자동 출력되므로 본문에 다시 적지 않습니다. `_config.yml`의 `kramdown.hard_wrap`이 활성화되어 있어 본문에서 한 번 줄을 바꾸면 화면에도 줄바꿈으로 반영됩니다.

이미지는 `assets/images` 폴더에 저장하며, 마크다운 이미지의 대체 텍스트는 화면에서 캡션으로도 사용됩니다.

번역본을 추가할 때는 원문을 복사한 새 Markdown 파일에서 `lang`, 제목·부제·설명·본문과 `permalink`를 번역 언어에 맞게 바꾸고 `translation_key`, `category_key`는 원문과 같게 유지합니다. 원문과 번역본의 `date`를 같게 두면 목록 정렬도 일치합니다.

## 개인 위키 작성

`_wiki/`에 개념별 Markdown 파일을 추가합니다. 예를 들어 `_wiki/trust.md`는
`/wiki/trust/`가 됩니다. 제목 변경과 무관하게 파일명 또는 `permalink`는 유지하세요.
사이트 사이드바의 **개인 위키**에서 가나다순으로 탐색할 수 있습니다.

```markdown
---
title: 신뢰
description: 이곳에 내가 생각하는 신뢰의 간략한 정의를 적습니다.
aliases: [Trust, 믿음]
date: 2026-09-10
last_modified_at: 2026-09-10
details:
  - title: 별도 문서의 설명
    target: /wiki/responsibility/
  - title: 별도 문서의 특정 소제목
    target: /wiki/responsibility/#examples
---

## 세부 설명 {#details}

이곳에 자세한 설명을 적습니다. ~~취소선도 사용할 수 있습니다.~~

[책임](/wiki/responsibility/)과 연결해서 설명할 수 있습니다.
```

- 필수 필드는 `title`이며, 나머지는 선택입니다. 예시 링크의 대상은 직접 생성한
  실제 문서로 바꿔 주세요.
- `description`은 짧은 일반 텍스트입니다. 간략 설명 구역(`#wiki-summary`),
  색인의 설명 링크, 검색 요약, SEO 설명에 함께 쓰입니다. 긴 내용은 본문에 적습니다.
- 본문의 `##`부터 `######`까지 실제 소제목은 문서 목차와 색인의 **세부 설명**에
  자동으로 연결됩니다. 코드 블록의 예시는 포함되지 않습니다.
- `details`에는 추가 연결을 적습니다. `target: "#고정-id"`, `/wiki/파일명/`,
  `/wiki/파일명/#고정-id`를 지원합니다. 같은 소제목은 자동 목록에 이미 있으므로
  특별한 연결 이름이 필요할 때만 `details`에 다시 지정하세요.
- 소제목에 `{#고정-id}`를 붙이면 문구를 고쳐도 링크가 유지됩니다. ID는 문서 내에서
  중복되지 않아야 하며 `wiki-summary`, `wiki-detail-pages`, `wiki-backlinks-title`, `post-endnotes`, `wiki-link-preview`는
  레이아웃에서 사용하는 예약 ID입니다.
- 본문과 간략 설명에 다른 위키의 **제목 또는 별칭**을 적으면 해당 항목으로 자동 연결됩니다.
  `봉누도 시즌 2`와 `봉누도 시즌2`처럼 띄어쓰기가 달라도 인식하며, 표기한 문장은 유지합니다.
  항목마다 첫 등장에만 자동 링크를 붙입니다. 한국어 조사(`시즌2가`, `시즌2는`)도 인식합니다.
  기존 링크·코드·소제목·자기 자신은 제외하고, 같은 이름이 여러 항목을 뜻하면 연결하지 않습니다.
  긴 이름을 우선하며 `시즌2`를 `시즌20`의 일부로 연결하지 않습니다. 강조 등으로 나뉜
  텍스트는 한 키워드로 연결하지 않으므로 그 경우에는 직접 Markdown 링크를 작성합니다.
  특정 구역을 제외하려면 `<span data-wiki-no-autolink>텍스트</span>`을 사용할 수 있습니다.
- 직접 지정하는 기본 Markdown 링크도 계속 지원합니다. `[[문서명]]` 문법은 지원하지 않습니다.
  프로젝트 하위 경로에서 호스팅할 경우 본문 링크에
  {% raw %}`[이름]({{ '/wiki/파일명/' | relative_url }})`{% endraw %}를 사용하세요.
  `details`와 자동 목차는 `baseurl`을 자동 반영합니다.
- **역링크**는 다른 위키의 본문 링크·자동 연결·`details`에서 자동으로 계산합니다. 소제목 링크,
  상대 경로와 절대 URL도 인식하고, 자기 자신·외부 사이트·중복 링크·코드 예시는 제외합니다.
  자동 연결과 역링크는 브라우저의 JavaScript와 `/wiki-index.json`을 사용합니다. 목차·내용·직접 작성한 링크는
  JavaScript 없이도 보이며, 변경 사항은 재빌드·배포 후 페이지를 새로고침하면 반영됩니다.
- 한글은 ㄱ~ㅎ로 묶고 쌍자음은 기본 자음 구역에 포함합니다. 영문은 A–Z,
  숫자 및 나머지 문자는 기타 구역에 표시합니다. `sort_title: 한글 정렬명`으로 분류와
  정렬 기준을 지정할 수 있습니다. 브라우저에서는 한국어 사전식 순서를 적용합니다.
- 통합 검색은 이름·별칭·본문을 검색하며 위키와 게시물을 구분해서 표시합니다.
  한국어 위키는 영어·일본어 인터페이스에서도 검색됩니다. 위키 본문은 자동 번역하지 않습니다.
- 수정일은 `last_modified_at`을 직접 갱신합니다. 위키는 게시물 목록과 RSS에 섞이지 않습니다.

로컬 확인은 `jekyll build --safe` 후 `python scripts/test-wiki.py`와
`node --test scripts/wiki-autolinks.test.cjs scripts/navigation.test.cjs`를 실행합니다.
브라우저 미리보기는 `python -m http.server 4173 --bind 127.0.0.1 --directory _site`로
시작하여 `http://127.0.0.1:4173/wiki/`를 엽니다.

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
│  ├─ page-notes.html              # 정적 페이지의 선택형 하단 메모
│  ├─ site-search.html             # 검색 UI
│  ├─ post-translations.html       # translation_key 기반 번역 버튼
│  ├─ post-series.html             # 연재 목록
│  ├─ post-navigation.html         # 이전·다음 글
│  ├─ post-share.html              # 공유, RSS, 인쇄·PDF
│  └─ post-comments.html           # giscus 댓글
├─ _data/
│  ├─ analytics.json               # GoatCounter 설정
│  ├─ reading_pulse.json           # 방문자 현황 스냅샷
│  └─ site_identity.yml            # KO/EN/JA 인터페이스 문구·링크·페이지 데이터
├─ _layouts/
│  ├─ categories.html
│  ├─ home.html                    # 홈 편집 화면과 중앙화된 홈 카피
│  ├─ page.html                    # 정적 탐색 페이지 공통 레이아웃
│  ├─ post.html                    # 포스트 전체 구성
│  ├─ wiki.html                    # 개별 위키 문서
│  └─ redirect.html                # 이전 탐색 주소 호환
├─ _wiki/                          # 개인 위키 마크다운 원본
├─ _posts/                         # 포스트 마크다운 원본
├─ assets/svg/                     # 언어·도구 아이콘과 동적 플랫폼 배지
├─ assets/images/                  # 포스트와 프로필 이미지
├─ scripts/
│  ├─ index.js
│  ├─ sidebar-collapse.js
│  ├─ site-search.js               # 언어별 검색 결과와 한국어 대체 출력
│  ├─ site-preferences.js          # 테마·언어 저장과 인터페이스 전환
│  ├─ post-actions.js
│  ├─ platform-links.js            # 플랫폼 배지·스트리머 채널 링크
│  ├─ wiki.js                       # 위키 색인·역링크·미리보기
│  ├─ wiki-autolinks.js             # 제목·별칭 자동 연결
│  ├─ wiki-authoring.js             # 접기 구역 탐색
│  ├─ document-notes.js            # 포스트·위키 공통 각주
│  ├─ document-comments.js         # 공통 댓글 로딩
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
├─ visitor-stats.html              # 방문자 현황
├─ reading-pulse.html              # 기존 주소 리디렉션
├─ tags.html                       # 소재별 분류
├─ topics.html                     # 기존 주소 리디렉션
├─ references.html                 # 출처 및 인용
├─ categories.html                 # 주제별 분류
├─ wiki.html                       # 위키 색인
├─ wiki-index.json                 # 자동 연결·역링크·미리보기용 색인
├─ search.json
├─ feed.xml
├─ index.html
└─ README.md
```

## 개인정보와 브라우저 저장

### 화면 설정 저장

사용자가 선택한 화면 테마와 인터페이스 언어를 기억하기 위해 브라우저의 로컬 저장소(localStorage)에 두 설정값을 함께 저장합니다.

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

## 이 저장소를 복제해서 사용하기

자신의 블로그·개인 위키로 시작하려면 저장소를 복제한 뒤 **`_posts/`, `_wiki/`, `assets/`의
기존 내용을 전부 지우고**, **`_config.yml`과 `_data/site_identity.yml`을 원하는 내용으로
바꾸면 됩니다.** 이는 복제본을 초기화하는 안내이며 이 저장소의 현재 콘텐츠는 삭제하지 않습니다.
레이아웃·스타일·스크립트·include는 남겨 두고 자신의 Markdown과 이미지를 새로 추가하세요.

1. `_config.yml`의 `url`을 자신의 도메인으로 바꿉니다. `사용자명.github.io` 저장소라면
   `baseurl: ""`, 프로젝트 저장소라면 `baseurl: "/저장소명"`을 사용합니다.
   `timezone`, 기본 언어와 permalink도 확인하세요.
2. `_data/site_identity.yml`의 한국어·영어·일본어 브랜드명, 작성자·운영자 소개,
   메뉴·페이지 문구, 링크, notes와 브라우저 저장 키를 자신의 값으로 바꿉니다.
   언어별 설정을 남기면 각 언어의 개인 소개도 모두 교체해야 합니다.
3. `assets/`를 비웠다면 새 프로필·사이트 심볼·파비콘·공유 이미지·언어 아이콘을 추가하고
   `site_identity.yml`의 `assets` 및 `settings.supported_languages[].icon` 경로를 수정합니다.
   `_posts/`·`_wiki/`에 새로 작성한 이미지 경로도 존재하는 파일을 가리켜야 합니다.
   플랫폼 배지를 쓸 계획이면 기본 `assets/svg/{chzzk,soop,twitch,rplay,youtube}.svg` 다섯 개는
   삭제 전 별도 보관해 다시 넣거나 같은 이름·크기의 자체 SVG로 교체하세요.
   플랫폼 배지 경로는 `scripts/platform-links.js`에서 플랫폼 ID로 동적으로 구성합니다.
4. 댓글을 쓰기 전 `site_identity.yml`에서 `comments.enabled: false`로 둡니다.
   자신의 공개 저장소에서 Discussions를 켜고 giscus 앱 연결을 설정한 뒤
   [giscus 설정 페이지](https://giscus.app/ko)에서 받은 `repo`, `repo_id`, `category`,
   `category_id`를 입력하고 다시 활성화하세요. `theme_base`는 자신의 공개
   `styles/` 배포 경로(끝 `/` 포함)로 바꾸거나 비워 기본 테마를 사용합니다.
5. 통계를 사용하지 않으면 `_data/analytics.json`의 `goatcounterCode`를 비웁니다.
   기존 작성자의 통계 스냅샷 `_data/reading_pulse.json`도 자신의 데이터로 초기화하고,
   `.github/workflows/refresh-reading-pulse.yml`은 자신의 통계 설정을 마칠 때까지 끄세요.
   통계를 쓸 경우 `scripts/refresh-reading-pulse.mjs`의 사이트 식별용 User-Agent도 교체합니다.
6. 자신의 GitHub Pages 배포 설정과 필요하면 `CNAME`, `google27564fde5057ccbe.html` 같은
   도메인·소유 확인 파일을 점검합니다. 원래 소유자의 검증 파일은 복제본에 필요하지 않습니다.
   `AGENTS.md`의 개인 계정·origin 안내도 자신의 저장소에 맞게 교체하세요.
   다른 소유자의 SSH 별칭·키 경로를 그대로 사용하지 마세요.
7. 새 `_posts/` 파일에는 날짜 파일명과 Front Matter를, 새 `_wiki/` 파일에는 `title`,
   `date`, 필요시 `description`, `aliases`, `last_modified_at`을 적습니다.
   공통 틀은 `_includes/wiki-templates/`와 `_data/wiki_templates.yml`에서 수정합니다.
8. 아래 빌드·테스트 명령으로 확인한 뒤 자신의 원격 저장소에 푸시합니다.
   비밀키·인증정보·환경변수 파일은 커밋하지 않습니다.

추가 점검으로 `rg -n "SeAh-Yoo|seah-yoo|유세아|SeAh Yoo|ユ・セア"`을 실행하면 남아 있는 원래 소유자의
설정이나 문구를 찾을 수 있습니다. Git 기록까지 복제하면 삭제한 예전 콘텐츠도 과거 커밋에 남습니다.
자신의 새 콘텐츠만 있는 기록으로 시작하려면 새 저장소에 필요한 템플릿 파일을 복사해 시작하세요.
공유 URL, RSS, 검색, 위키 본문 링크는 자신의 `url`·`baseurl` 환경에서 다시 확인하는 것이 좋습니다.

## 위키 기능과 상세 작성법

개인 위키는 `_wiki/`의 Markdown, 가나다순 `/wiki/` 색인, 제목·별칭 검색,
표준 Markdown 링크와 자동 연결, 역링크, 소제목 목차, 취소선 기능을 함께 제공합니다.
본문은 인터페이스 언어와 별개로 유지되며 테마와 모바일 레이아웃을 공유합니다.

### 개별 위키 하단과 댓글

개별 위키에는 포스트와 마찬가지로 `주의사항`·`방문객의 메모` 같은 하단 notes 카드를
출력하지 않습니다. 위키 **색인 페이지**의 notes는 기존
`pages.wiki.locales.<언어>.notes` 설정을 계속 사용합니다.

포스트와 개별 위키의 댓글은 **GitHub Discussions 기반 giscus**를 공유합니다.
`pathname` 기준이므로 각 위키 주소에 별도 댓글과 반응이 연결됩니다.
`_includes/post-comments.html`, `scripts/document-comments.js`, `styles/document-comments.css`가
공통 영역입니다. 화면 가까이 왔을 때 로드하고 선택한 테마·언어를 반영합니다.
설정은 `_data/site_identity.yml`의 `comments`에서 관리하며, 사이트 전체를 끄려면
`enabled: false`, 문서 하나만 끄려면 Front Matter에 `comments: false`를 넣습니다.
실제 댓글 작성은 방문자가 GitHub로 로그인한 뒤 직접 수행합니다.

### 최초 등록일과 수정일

```yaml
date: 2026-09-10
last_modified_at: 2026-09-12
```

`date`는 이 위키에 최초 등록한 날짜, `last_modified_at`은 작성자가 관리하는 수정일입니다.
수정일을 생략하면 최초 등록일을 표시합니다. 날짜를 확인하지 못했다면 생략할 수 있으며,
Jekyll이 자동으로 제공하는 빌드 시각은 최초 등록일이나 검색 정렬 날짜로 표시하지 않습니다.
날짜 파일명에서 Jekyll이 해석한 날짜도 사용되므로 위키 파일명은 날짜 없는 개념명을 권장합니다.
화면 레이블은 `_data/site_identity.yml`의 `shared.wiki.locales.<언어>.created/updated`에서 관리합니다.

이번 보완에서는 기존 다섯 문서의 Git 최초 추가 커밋 `7920b15`의 작성 시각
`2026-09-10T22:46:18+09:00`을 근거로 `date: 2026-09-10`을 추가했습니다.
이는 이 저장소에 등록한 날짜이며, 다루는 방송의 시작일이나 원고의 최초 집필일을 뜻하지 않습니다.
기존 `last_modified_at`과 본문은 유지했습니다. 확인 명령은 다음과 같습니다.

```powershell
git log --follow --diff-filter=A --format="%h %aI %s" -- _wiki/wiki-acau-pg2.md
```

### 각주와 명시적인 서지 정보

```markdown
본문의 보충 설명입니다.[^explanation]

[^explanation]: 설명만 적어도 됩니다. [보충 링크](https://example.com/notes)
```

블로그와 위키가 `scripts/document-notes.js`와 `styles/document-notes.css`를 공유합니다.
위키에는 블로그 공유·인용 카드 기능 전체를 로드하지 않습니다. 댓글은 별도 공통 모듈로 로드합니다.
각주 번호는 각주로 이동하고, 각주 앞 번호와 돌아가기 화살표는 본문으로 복귀합니다.
이동한 항목에 포커스와 잠시 지속되는 강조를 제공합니다.

출처 목록에 올릴 자료는 해당 문서의 Front Matter `references`에 따로 적습니다.
설명용 각주에 URL이 있어도 `/references/`에 자동 수집하지 않습니다.

```yaml
references:
  - id: sample-source
    title: 자료 제목
    author: 저자 또는 기관
    publisher: 발행처
    year: 2026
    type: 문서
    url: https://example.com/source
    note: 필요한 보충 서지 정보
```

게시물과 위키의 배열을 함께 수집하고, 같은 `id`는 한 번만 표시합니다.
같은 자료를 인용한 모든 문서의 링크를 나열하며 한 문서의 중복 ID는 링크를 늘리지 않습니다.
동일 ID에는 동일 서지 정보를 작성하세요. 값이 다르면 수집 순서상 첫 번째 값이 표시됩니다.
ID는 `sample-source`처럼 구분이 쉬운 고유 영문·숫자·하이픈 조합을 권장합니다.
새로운 중앙 등록소나 ID 전용 인용 문법은 없습니다.

### 각주와 위키 링크 미리보기

- 마우스: 각주 번호나 다른 위키 링크 위에 포인터를 올립니다.
- 키보드: Tab으로 각주 번호나 위키 링크에 포커스를 두면 미리보기가 열립니다.
- 모바일: 링크를 터치하면 원래 대상으로 이동합니다.
- 포인터를 벗어나거나 Escape, 바깥 터치로 닫습니다. 별도 아이콘과 이동·닫기 버튼은 없습니다.
- Ctrl/Cmd 클릭 등 링크의 기본 동작을 유지합니다.

각주 제목은 `각주 #001` 형식이며, 각주 본문의 서식과 출처 링크를 표시합니다.
위키 링크에는 번호 없이 제목과 `description`이 표시됩니다. 설명이 없으면 안내 문구가 표시됩니다.
두 미리보기는 약 567px 너비와 18px 여백을 사용하며 작은 화면에서는 화면 너비에 맞춥니다.
위키 항목 미리보기는 각주보다 밝은 배경색으로 구분합니다.
JavaScript나 색인 요청이 실패해도 원래 Markdown 링크는 그대로 사용할 수 있습니다.

### 재사용 가능한 틀

공통 내용을 `_includes/wiki-templates/`에서 한 번 정의하고 필요한 위치에서 불러옵니다.
문서 위·중간·하단 어디에나, 같은 틀을 여러 번 넣을 수 있습니다. 호출 앞뒤에 빈 줄을 두세요.

{% raw %}
```liquid
{% include wiki-template.html name="안내문" %}

{% include wiki-template.html name="안내문" title="범위" text="이 문서의 **작성 범위**를 적습니다." %}

{% include wiki-template.html name="방송정보" platform="[치지직]" period="작성자가 확인한 진행 시기" note="선택적인 비고" %}

{% include wiki-template.html name="관련항목" %}
```
{% endraw %}

| 틀 이름 | 원본 파일 | 인수 |
| --- | --- | --- |
| 안내문 | `_includes/wiki-templates/notice.md` | `title`, `text` |
| 방송정보 | `_includes/wiki-templates/broadcast.md` | `title`, `platform`, `period`, `note` |
| 관련항목 | `_includes/wiki-templates/related.md` | `title`, `links` |

기본 안내문은 중립적인 읽기 안내, 정보표의 미입력 값은 `미기재`, 관련항목의 기본 링크는
위키 전체 색인입니다. 실제 사실이나 추천 목록은 작성자가 원본 틀에 추가합니다.
여러 문서가 공유하는 관련 링크 묶음은 `related.md`를 수정하거나 별도의 틀 파일로 정의하세요.
호출별 정보가 필요하면 `links`에 Markdown 목록을 전달할 수도 있습니다.

{% raw %}
```liquid
{% capture related_links %}
- [연결할 문서]({{ '/wiki/실제-파일명/' | relative_url }})
- [연결할 소제목]({{ '/wiki/실제-파일명/' | relative_url }}#고정-id)
{% endcapture %}
{% include wiki-template.html name="관련항목" links=related_links %}
```
{% endraw %}

예시 링크는 실제 작성한 문서 주소로 바꾸세요. 새 틀은 ASCII 파일명(예: `custom.md`)으로
만들고 `_data/wiki_templates.yml`에 `내틀: custom`처럼 한글 이름을 등록합니다.
매핑 없이 `name="custom"`으로도 부를 수 있습니다. 없는 이름은 조용히 누락되지 않고 빌드를 실패시킵니다.
틀 안에서는 `include.args.platform`처럼 전달된 인수를 참조합니다.

{% raw %}
```markdown
**{{ include.args.title | default: "공통 제목" | escape }}**

여기에 공통 Markdown 내용과 [문서 링크]({{ '/wiki/실제-파일명/' | relative_url }})를 적습니다.
```
{% endraw %}

틀은 Markdown 상태로 삽입한 뒤 문서 전체에서 한 번 Kramdown으로 변환합니다.
따라서 본문·틀·접기 구역의 제목/별칭 자동 연결, 검색 색인, 역링크가 같은 내용을 읽습니다.
정의 수정 후 재빌드하면 사용하는 모든 문서와 색인에 반영됩니다. 별도 Ruby 플러그인은 없습니다.
기본 틀은 HTML ID를 만들지 않습니다. 새 틀에도 고정 `id`/`{#id}`를 반복해 넣지 마세요.
소제목을 넣으면 Kramdown이 문서 전체에서 중복 없는 ID를 생성합니다.
틀 내부에 별도 `markdownify`를 적용하면 독립 변환으로 ID·각주 번호가 충돌할 수 있으므로 사용하지 않습니다.
표 인수의 `|`는 `&#124;`로 적고, 여러 문단이나 목록이 필요하면 `capture`를 사용하세요.

### 작성자가 지정하는 접기·펼치기

{% raw %}
```markdown
<details markdown="1">
<summary>접힌 상태로 시작하는 구역</summary>

## 구역 내부 소제목 {#folded-section}

- 목록을 쓸 수 있습니다.
- 설명 각주도 쓸 수 있습니다.[^inside]

| 항목 | 설명 |
| --- | --- |
| 예시 | 작성자가 채울 내용 |

{% include wiki-template.html name="방송정보" platform="[YouTube]" %}

</details>

<details markdown="1" open>
<summary>처음부터 펼쳐진 구역</summary>

본문과 [소제목 링크](#folded-section)를 적습니다.

</details>

[^inside]: 접힌 구역에서 인용한 각주입니다.
```
{% endraw %}

`open`이 있으면 펼쳐진 상태, 없으면 접힌 상태로 시작합니다. `<summary>`는 짧은 일반 텍스트로
쓰고 그 다음에 빈 줄을 둡니다. 문단 길이와 관계없이 작성자가 표시한 구역만 접힙니다.
각주 정의는 위 예시처럼 문서 마지막에 모으면 관리하기 편합니다.
목차, 직접 URL의 `#folded-section`, 뒤로/앞으로 이동이 내부 소제목을 가리키면
상위 `details`를 모두 펼칩니다. JavaScript 없이도 `summary`의 기본 키보드·터치 조작은 작동합니다.

### 플랫폼 배지

```markdown
[chzzk] [치지직]
[SOOP] [숲]
[Twitch] [트위치]
[RPlay] [알플레이] [알플]
[Youtube] [YouTube] [유튜브] [유튭]
```

영문 대소문자를 구별하지 않습니다. 명시적인 대괄호 표기만 24×24 SVG 로고 배지로 바뀌며
각각 치지직, SOOP, Twitch, RPlay, YouTube의 홈으로 연결됩니다. 같은 탭의 일반 링크입니다.
ID 없는 기존 배지는 홈페이지 링크 동작을 유지합니다.
`[SOOP](https://example.com/)` 같은 Markdown 링크, 코드, 이미지 대체 텍스트,
HTML 속성과 일반 플랫폼명은 그대로 유지합니다. 틀과 접기 구역에도 적용됩니다.

원본 Markdown은 바꾸지 않습니다. 변환은 렌더링된 **텍스트 노드**에서 플랫폼 배지 → 위키 자동 연결
순서로 진행하고, 역링크용 HTML에도 같은 순서를 적용합니다. 검색 색인에는 원래 표기가 남으며
화면 DOM에도 검색 가능한 숨김 텍스트와 플랫폼 접근성 이름을 보존합니다.
배지 파일은 `assets/svg/`에 있으며 `scripts/platform-links.js`가 플랫폼 ID에 `.svg`를 붙여 불러옵니다.
따라서 파일명을 직접 참조하는 코드가 없다는 이유만으로 미사용 자산으로 분류하면 안 됩니다.

### 스트리머 채널 링크와 이름 자동 연결

위키와 블로그 포스트 본문에서 다음 문법을 사용할 수 있습니다.

```markdown
[치지직:458f6ec20b034f49e0fc6d03921646d2]서새봄냥
[숲:ayanesena]아야네 세나
[유튜브:@Normaltic]Normaltic Place
[알플:676715572c8262ab2b1e0a25]변소담
[트위치:michimochievee]michimochievee

아야네 세나의 방송을 보았습니다.
```

로고와 입력한 이름 전체가 채널 링크가 되어 새 탭으로 열립니다.
SOOP은 `[숲:ID]` 또는 `[SOOP:ID]`로 지정합니다. 치지직 ID를 SOOP으로 추측하지 않습니다.
YouTube 표시 이름은 번역하지 않습니다. 기존 플랫폼 별칭과 영문 대소문자 무시를 지원합니다.

축약형 이름은 같은 텍스트 노드의 줄 끝 또는 구분 기호(쉼표, 괄호, `|`, `;`, `:`, `!`, `?` 등)까지입니다.
공백과 영문 마침표는 이름에 포함되므로 문장 중간에서는 반드시 중괄호로 이름 끝을 지정하세요.

```markdown
[숲:ayanesena]{아야네 세나}의 방송입니다.
[유튜브:@Normaltic]{노말틱 플레이스}를 소개합니다.
```

명시적 선언 이후 같은 문서의 이름을 매번 자동 연결하며 조사는 링크 밖에 둡니다.
선언 이전 이름, 소제목의 일반 이름, 기존 링크, 코드는 자동 연결하지 않습니다.
같은 이름에 서로 다른 채널을 선언하면 명시적 링크만 만들고 그 이름의 자동 연결은 생략합니다.
이름 내부를 Markdown 강조 등으로 나누지 마세요.
`data-wiki-no-autolink` 속성이 있는 요소에서는 변환하지 않습니다.
표, 목록, 틀, 접기 내부에서도 작동하며 다른 문서에는 등록 정보가 전파되지 않습니다.
원본 Markdown과 검색 색인은 변경하지 않으며 브라우저에서 JavaScript로 변환합니다.
잘못된 플랫폼 ID와 이름 없는 채널 표기는 그대로 남습니다.

### 개발 검증

```powershell
jekyll build --safe
python scripts/test-wiki.py
node --test scripts/wiki-autolinks.test.cjs scripts/navigation.test.cjs
python scripts/test-wiki-authoring.py
```

GitHub Pages의 Jekyll 버전으로도 확인하려면 해당 gem을 설치한 환경에서 실행합니다.

```powershell
jekyll _3.10.0_ build --safe
$env:JEKYLL_VERSION = "3.10.0"
python scripts/test-wiki.py
python scripts/test-wiki-authoring.py
Remove-Item Env:JEKYLL_VERSION
```

[GitHub Pages 의존성 목록](https://pages.github.com/versions/)에서 버전을 확인할 수 있습니다.
통합 테스트는 임시 폴더에 별도 문서를 만들며 실제 위키에 테스트 내용을 추가하지 않습니다.
각주, 출처 ID 중복, 반복 틀, 공통 틀 수정의 색인 반영, 중첩 접기, 날짜 없는 문서,
수정일 기본값, 하위 경로 호스팅을 검사합니다.

`python scripts/test-wiki-authoring.py --keep`은 마지막 `FIXTURE_SITE` 경로에 Chrome용 테스트 사이트를 남깁니다.
그 경로로 아래 서버를 실행해 `/wiki/example/`, `/wiki/target/`, `/references/`, `/posts/example/`를 확인합니다.

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory "FIXTURE_SITE에 출력된 경로"
```

Chrome에서 390px/320px 모바일 폭과 데스크톱을 확인하고, Tab/Enter/Escape,
터치의 열기·닫기·원래 링크 이동, `#deep` 직접 진입, 테마·언어 전환,
검색의 `공통변경검증`/`테스트별칭`, 자동 연결과 대상 문서의 역링크를 검사합니다.
검증을 마치면 서버를 종료하세요. 내부 브라우저는 사용하지 않습니다.

### 탐색 URL 호환성

- 태그 페이지는 `/tags/`, 방문 통계는 `/visitor-stats/`를 사용합니다. 이전 `/topics/`, `/reading-pulse/`는 검색 매개변수와 앵커를 유지하며 이동합니다.
- 리디렉션 페이지는 사이트맵에서 제외하고 새 주소를 canonical로 지정합니다.
- 새 페이지의 `analytics_path`는 기존 GoatCounter 경로를 유지합니다. 리디렉션 페이지에서는 집계하지 않아 중복 집계를 피합니다. 통계 스냅샷 파일과 갱신 도구 이름은 유지합니다.
- 안내소 AI 항목의 새 ID는 `ai-issues`입니다. `source_id: ai-society`로 기존 포스트 분류를 읽으며 `#path-ai-society` 앵커도 유지합니다. 포스트의 `topics` 필드는 그대로 사용합니다.
- 검증: `jekyll build --safe` 후 `node --test scripts/navigation.test.cjs`.
