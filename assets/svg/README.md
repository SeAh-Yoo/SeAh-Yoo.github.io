# 플랫폼 SVG 로고

이 폴더는 사용자가 제공한 공식 로고 이미지를 기준으로 만든 **벡터 변환본**입니다.
플랫폼이 직접 배포한 원본 SVG 파일이라고 주장하지 않습니다. 이전 텍스트 배지를
교체했으며 각 파일은 24×24 viewBox 안에 원본 비율을 유지해 배치했습니다.
폰트·외부 이미지·래스터 데이터에 의존하지 않고 SVG path로만 로고를 표시합니다.

| SVG | 사용자 제공 원본 | 처리 |
| --- | --- | --- |
| chzzk.svg | `assets/01_chzzk_logo_03.png` | 녹색 심벌 윤곽과 원본 색상 유지, 투명 배경 |
| soop.svg | `assets/02_soop_logo_03.jfif` | 연결 고리 심벌 윤곽 추출, 청색·청록 그라데이션 근사, 앱 타일 배경 제거 |
| twitch.svg | `assets/03_Twitch_Logo_02.png` | 검정 실루엣·흰색 내부·눈 유지, 어두운 테마의 대비를 위해 원본 보라색 타일 유지(여백 축소) |
| rplay.svg | `assets/04_Rplay_logo_02.jfif` | 흰색 심벌 윤곽 추출, 청색 배경 제거, 어두운 테마용 |
| youtube.svg | `assets/05_Youtube_log_02.png` | 붉은 외곽·흰색 재생 삼각형 유지, 체크무늬 배경 제거 |

2026-09-12 변환: 색상별 마스크에서 OpenCV 윤곽을 추출하고 원본 이미지 좌표 기준
0.65~1.2px 오차로 꼭짓점을 단순화했습니다. JPEG 경계와 그라데이션은 근사값입니다.
배지의 접근성 이름·원래 Markdown 텍스트·홈 링크는 기존 HTML에서 유지합니다.
흰색 RPlay 심벌은 사이트의 어두운 테마용입니다.
사용자 제공 원본 파일은 변경하지 않았으며 이번 커밋에는 포함하지 않았습니다.

공식 공개 안내 확인 경로:

- 치지직: https://chzzk.naver.com/ 및 https://help.naver.com/service/30044/category/7043?lang=ko
- SOOP: https://corp.sooplive.com/esg/2023/index.php?page=grow
- Twitch: https://brand.twitch.com/ 및 https://legal.twitch.com/en/legal/trademark/
- RPlay: https://rplay.live/ 및 https://rplaylive.gitbook.io/rplay-userguide/helpcenter/faq
- YouTube: https://brand.youtube/

이 변환은 사용자의 공식 로고 기반 SVG 교체 요청에 따른 것입니다. 위 안내 경로의
구체적인 변형·재배포 조건은 기존 조회에서 확정하지 못했으며, 이 저장소의 일반 콘텐츠
라이선스가 플랫폼 상표에 대한 권리를 부여하는 것은 아닙니다. 로고와 상표의 권리는
각 권리자에게 있습니다.
