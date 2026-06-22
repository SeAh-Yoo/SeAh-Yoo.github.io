# SeAh Yoo GitHub Pages Blog

마크다운 칼럼을 `posts/<date-or-slug>/index.md`에 작성하고, 같은 폴더에 이미지를 둔 뒤 `posts/posts.json`에 메타데이터를 추가하면 GitHub Pages에서 자동으로 렌더링되는 다크 테마 블로그입니다.

## 글 작성 방법

1. `posts/2026-06-22-example/index.md`처럼 글 폴더를 만듭니다.
2. 이미지는 같은 폴더에 저장합니다.
3. 본문에서 `[img:filename.png]` 형식으로 이미지를 삽입합니다.
4. `posts/posts.json`에 `slug`, `title`, `date`, `excerpt`, `file`을 추가합니다.

홈 화면에는 최신순 5개 글만 보이고, 왼쪽 사이드바에는 과거 글이 아래에서 위로 쌓이는 아카이브가 표시됩니다.
