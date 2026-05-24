# REALJEJU.APP

제주도 부동산 매물을 지도와 목록으로 확인하고, 중개사 회원이 매물을 등록·관리할 수 있는 부동산 플랫폼입니다.

## Current Version

`Ver 2.865`

현재 배포 기준 파일은 아래 4개입니다.

```text
realjeju_2.865.html
css/base_2.865.css
js/app_2.865.js
favicon_realjeju_blue.png
```

`2.865`부터는 CSS와 JS가 각각 하나로 합쳐져 있습니다.

- CSS: `css/base_2.865.css`
- JS: `js/app_2.865.js`

## Main Features

- 제주도 부동산 지도 기반 매물 탐색
- 왼쪽 패널 매물 목록 및 오른쪽 상세 패널
- 매물 유형, 거래 유형, 가격, 면적 등 필터
- 관심매물 저장 및 마이페이지 관심매물 관리
- 중개사 홈 매물 관리
- 매물 등록 및 수정
- 중개사무소 가입 신청 및 정보 관리
- 이용권 결제 화면
- 약관, 개인정보처리방침, 위치기반 서비스 이용약관, 환불 및 취소 정책 연결

## Deploy

GitHub Pages 또는 정적 호스팅에 올릴 때는 최신 버전 파일을 기준으로 배포합니다.

```text
realjeju_2.865.html
css/base_2.865.css
js/app_2.865.js
favicon_realjeju_blue.png
```

GitHub Pages에서 첫 화면으로 바로 열려야 한다면 `realjeju_2.865.html`을 `index.html`로 복사해서 배포합니다.

```text
index.html
css/base_2.865.css
js/app_2.865.js
favicon_realjeju_blue.png
```

## External Services

이 프로젝트는 아래 외부 서비스를 사용합니다.

- Kakao Maps JavaScript SDK
- Daum Postcode
- Supabase
- Font Awesome
- Pretendard Web Font

## Notes

- `service_role` 같은 서버 전용 키는 절대 GitHub에 올리지 않습니다.
- 브라우저에서 사용하는 공개용 키만 정적 파일에 포함합니다.
- 최신 버전으로 올릴 때는 HTML 안의 CSS/JS 파일명과 화면의 `Ver` 표시를 함께 맞춥니다.

