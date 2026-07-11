## 2026-07-01 00:45:53 KST / Version 3.925

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.925.html
- /Users/GHOST/Documents/REALJEJU/base_3.925.css
- /Users/GHOST/Documents/REALJEJU/app_3.925.js
- /Users/GHOST/Documents/REALJEJU/sql/admin_tools_3.274.sql
- /Users/GHOST/Downloads/realjeju_3.925.html
- /Users/GHOST/Downloads/css/base_3.925.css
- /Users/GHOST/Downloads/js/app_3.925.js
- /Users/GHOST/Downloads/sql/admin_tools_3.274.sql
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- `realjeju_3.924.html`, `base_3.924.css`, `app_3.924.js`를 기준으로 3.925 배포 파일 세트를 생성했다.
- HTML의 CSS/JS 참조, 화면 버전 표기, 하단 버전 다운로드 파일명, `APP_VERSION`을 3.925로 갱신했다.
- 운영자 페이지 신청 목록 조회용 SQL 패치 `admin_tools_3.274.sql`을 Downloads 루트와 `Downloads/sql` 폴더에 복사했다.

## 2026-07-01 00:10:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Downloads/realjeju_3.924.html
- /Users/GHOST/Downloads/css/base_3.924.css
- /Users/GHOST/Downloads/js/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- `Downloads` 폴더 쓰기 제한 구간에서 다시 동기화를 성공 처리하기 위해 권한 상승 실행 후
  `realjeju_3.924.html`, `base_3.924.css`, `app_3.924.js`를 재복사했다.
- 재복사한 배포본 기준으로 기본 정적 리소스(폴더 상대 경로, favicon 포함) 존재 여부를 점검해
  누락된 `404` 경로가 없도록 정리했다.

## 2026-07-01 00:00:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Downloads/css/base_3.924.css
- /Users/GHOST/Downloads/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자 페이지/관리자 페이지/마이페이지 공통 상단 패널 정렬 규격을 `--realjeju-admin-suite-page-gap` 변수 기반으로 통일하고, `operator-page-open`/`admin-page-open`/`my-suite-page-open` 대상 패널의 상단 패딩/마진 정렬을 한 번에 맞췄다.
- `body.realjeju-side-nav-enabled` 모드에서 해당 탭/패널 여백을 공통 축으로 맞춰, 최근 신고된 여백1/여백2 불일치 이슈의 기준점을 정리했다.
- 변경 파일을 Downloads 배포본(`/Users/GHOST/Downloads/css/base_3.924.css`, `/Users/GHOST/Downloads/realjeju_3.924.html`) 쪽에도 동기화했다.

## 2026-07-01 00:06:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Downloads/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 로컬 실행 환경에서 정적 파일이 `?v=...` 쿼리스트링으로 인해 404이 나는 이슈를 줄이기 위해 `realjeju_3.924.html`에서 CSS/JS 참조 쿼리를 제거했다.

## 2026-06-30 23:59:58 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 중개사무소 가입 신청 목록(관리자/운영자) 모바일 뷰에서 액션 버튼 그룹이 화면 폭 축소 시 4분할로 강제 고정되며 일부 버튼이 보이지 않던 레이아웃을
  `auto-fit` 그리드 + 버튼 최소 폭 규칙으로 완화했다.
- 승인 상태(예: `승인완료`) 행에서 `승인` 버튼이 좁은 화면에서 사라지지 않도록 운영자/관리자 공통 모바일 스타일을 정렬해 버튼 가시성을 안정화했다.

## 2026-06-30 00:00:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 상단 `운영자 페이지` / `관리자 페이지` / `마이페이지` 탭 시작 여백을 라벨 기준으로 동기화하기 위해
  `global-topbar` 탭 위치 보정 동기화 로직을 추가해 오차를 줄였다.
- 마이페이지에서 측정된 라벨-탭 간격을 캐시해 운영자/관리자 탭에도 동일한 기준값을 재사용하도록 정리했다.

## 2026-06-30 00:00:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자 페이지에서 `profiles` 조회 시 존재하지 않는 `avatar_url` 컬럼을 직접 선택하던 쿼리를 제거해 `400` 오류를 차단했다.
- `profiles` 프로필 이미지 조회를 `profile_image/profile_photo` 중심으로 전환해 운영자/관리자 신청 리스트 로딩 실패를 방지했다.
- 프로필 썸네일 선택 로직에서 `profile_photo` fallback를 추가해 프로필 소스 보강 안정성을 높였다.

## 2026-06-30 23:42 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자 페이지에서 `get_admin_agencies` RPC 호출을 직접 우회하여 운영자 권한만으로 신청 목록을 로드하도록 변경해 `admin only` 403 오류를 방지했다.
- 운영자/관리자 신청 목록의 사용자 프로필 조회에서 `profiles`의 비존재 컬럼(`profile_photo`)을 더 이상 조회하지 않도록 수정해 400 오류를 제거했다.
- 운영자 신청 조회에서 프로필 이미지 후보값 정리를 `profile_image/avatar_url` 중심으로 보정해 프로필 표시 경로를 안정화했다.

## 2026-06-30 23:59:55 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자/관리자 신청 목록의 `profiles` 조회에서 `avatar_url` 컬럼 의존을 다시 점검해, `select("...profile_image")`로 고정해 400/프로필 조회 오류 재발을 방지했다.
- 운영자 페이지 스크립트 로드 버전을 `v=3.924.10`으로 갱신해, 오래된 캐시 JS가 남아도 새로운 쿼리 코드가 반영되도록 정리했다.

## 2026-06-30 23:59:30 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자 중개사무소 신청 목록 접근 시 `get_admin_users` 권한 오류(42501)로 프로필 조회가 실패하더라도 목록 자체는 동작하도록 폴백 로직을 추가했다.
- 가입 신청 사용자 보강 함수에 `profiles` 직접 조회(아이디 기반 배치 조회) 경로를 넣어 운영자 조회 실패 케이스를 보완했다.
- 운영자 권한 계정도 `loadAdminApplications`를 열 수 있도록 체크를 `관리자/운영자`로 확장했다.

## 2026-06-30 23:59 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 운영자 페이지(`운영자 페이지 > ...`)와 관리자 페이지 상단 탭 시작 여백을 마이페이지 탭 기준으로 통일해 `left` 오프셋을 `+96px`로 맞췄다.

## 2026-06-30 23:45 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/sql/admin_tools_3.273.sql

### 수정 내용
- 운영자 승인 버튼 동작에서 `admin only(42501)`가 계속 나는 이유로 SQL RPC 권한 제약이 남아 있던 점을 정리했다.
- 운영자/관리자 공용 승인 RPC(`admin_update_agency_status`)가 `role_request`/`role`/메타데이터의 `operator` 값일 때도 통과되도록 새 패치 SQL(`sql/admin_tools_3.273.sql`)을 준비했다.
- 운영자 페이지 승인 실패 모달의 안내 텍스트를 운영자 전용 패치 파일(`admin_tools_3.273.sql`)로 변경해 재설치 대상이 더 정확히 노출되게 했다.

### 검증
- `app_3.924.js` 문자열/함수 수정 반영 확인.
- `sql/admin_tools_3.273.sql` 문법은 SQL Editor에서 실행 전 점검용으로 정리.

## 2026-06-30 23:25 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md
- /Users/GHOST/Documents/REALJEJU/app_3.924.js

### 수정 내용
- 운영자 상단 타이틀(`운영자 페이지 >`)과 마이페이지 상단 타이틀 규격을 맞추기 위해 사이드 메뉴 모드에서 타이틀 크기/굵기/자간을 동일하게 정렬했다.
- 운영자 상단 탭 위치를 마이페이지 규격 기준으로 정렬해 좌우 여백과 시작 위치를 맞췄다.
- 운영자 페이지 상단 탭 시작점이 관리자/마이페이지 상단 탭과 동일 간격이 되도록 `+96px`→`+124px`로 보정했다.
- `상단 안내 문구: 운영자 페이지 > 중개사무소 가입 신청`과 `마이페이지` 계열의 기준선을 통일했다.
- 관리자 페이지 회원 관리 목록에서 운영자 계정의 회원유형이 `운영자`로 보이도록 처리.
- 운영자 판별값(`operator`, `operations`, `is_operator`)을 반영해 회원유형 텍스트를 보강했다.
- 기본 역할 라벨 변환(`getRoleLabel`)에 운영자 항목을 추가해 마이페이지 및 행정 뷰에서 일관성 보장.

## 2026-06-30 23:18 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 왼쪽 사이드 메뉴의 기존 `톱니바퀴 관리자 페이지` 위치를 운영자 계정에서는 `톱니바퀴 운영자 페이지`로 보이도록 분기했다.
- 운영자 페이지 상단을 `운영자 페이지 > 중개사무소 가입 신청` 형태로 구성하고, 운영자 전용 상단 탭을 추가했다.
- 운영자 페이지 본문에 관리자 페이지와 같은 중개사무소 가입 신청 목록/필터를 만들되 `가입 신청`, `승인 완료`, `승인 대기`, `승인 거부`만 표시하도록 했다.
- 운영자 페이지 신청 카드의 액션은 `승인` 버튼만 렌더링하고, `대기`, `거부`, `삭제` 버튼은 표시하지 않도록 제한했다.
- 운영자 승인 처리 함수에서도 `active` 승인 상태만 허용해 DOM 조작으로 다른 상태가 들어와도 처리되지 않도록 막았다.
- 운영자 페이지가 열릴 때 지도/주소 필터바가 섞이지 않도록 관리자 페이지와 같은 비지도 페이지 숨김 규칙을 적용했다.
- CSS/JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.19`, JS 캐시 쿼리를 `3.924.9`로 갱신했다.

### 검증
- `/Users/GHOST/Documents/REALJEJU/app_3.924.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- 운영자 페이지 HTML/CSS/JS 핵심 선택자(`operatorPagePanel`, `global-topbar-operator-tabs`, `openOperatorPage`, `data-operator-status`) 반영 확인.

## 2026-06-30 22:53 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 `중개사무소 가입 신청 > 승인 완료` 카드에서 프로필 사진 오른쪽 여백을 카드 좌측/상하 여백과 같은 `16px` 기준으로 맞췄다.
- 프로필 사진 오른쪽의 상호/대표자/등록번호 텍스트가 조금 더 오른쪽으로 이동하도록 간격을 정리했다.
- 상호명 폰트 크기를 주소/연락처/이메일 메타와 같은 `14px`로 맞추고, 상호명은 진한 굵기 `900`을 유지하도록 변수까지 정리했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.18`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 22:49 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 `중개사무소 가입 신청` 목록의 프로필 사진을 회원관리 프로필 사진 크기와 같은 `60px` 기준으로 키웠다.
- 신청 목록 프로필 사진을 회원관리에서 쓰는 `get_admin_users` 프로필 값과 `profiles.profile_image` 보강 조회를 통해 최대한 동일하게 표시하도록 했다.
- 신청 카드의 사무소명 아래 정보를 `대표자`, `등록번호` 2줄로 분리해 사무소명 포함 3줄 구조로 정리했다.
- 신청 목록의 `승인`, `대기`, `거부`, `삭제` 버튼을 pill round 형태로 변경했다.
- CSS/JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.17`, JS 캐시 쿼리를 `3.924.8`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 22:41 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 오른쪽 지도 메뉴 아이콘 크기를 `18px`에서 `17px`로 줄였다.
- 버튼 박스 크기 `42px`, 아이콘 영역 `22px x 20px`, 라벨 `11px`은 유지했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.16`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 22:39 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 생활안전 참고지표 선택 후 뜨는 설명 박스를 상단 필터 버튼 기준으로 배치하도록 수정했다.
- 설명 박스가 `생활안전 참고지표` 필터 버튼 하단에서 `16px` 아래에 뜨도록 실제 버튼 좌표를 계산해 배치한다.
- 창 크기가 바뀔 때도 설명 박스 위치가 다시 계산되도록 resize 연동을 추가했다.
- JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 JS 캐시 쿼리를 `3.924.7`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 22:32 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 매물등록/수정 사진 순서 변경 중 현재 잡고 있는 사진이 보이도록 드래그 복제 썸네일을 추가했다.
- pointer 드래그가 시작되면 원본 썸네일을 복제한 `.property-photo-drag-ghost`가 커서 아래를 따라 이동하도록 했다.
- 드래그 종료/취소/초기화 시 복제 썸네일을 제거해 화면에 잔상이 남지 않도록 했다.
- CSS/JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.15`, JS 캐시 쿼리를 `3.924.6`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 22:28 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 매물등록/수정 사진 썸네일 순서 변경을 HTML5 drag/drop에만 의존하지 않고 pointer 이벤트 기반으로도 동작하도록 보강했다.
- 마이크로소프트 엣지에서 `dataTransfer` 기반 드래그 흐름이 끊겨 사진 순서 변경이 안 되는 경우를 막기 위해, `pointerdown / pointermove / pointerup`으로 대상 썸네일을 직접 계산해 순서를 바꾸도록 했다.
- 썸네일의 기본 `draggable` 동작을 끄고, `touch-action: none`, `user-select: none`을 적용해 브라우저 기본 이미지 드래그/텍스트 선택이 순서 변경을 방해하지 않도록 했다.
- JS/CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.14`, JS 캐시 쿼리를 `3.924.5`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:25 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 오른쪽 지도 메뉴 버튼의 기준 폭/높이 변수 `--map-control-box-size`를 `44px`에서 `42px`로 줄였다.
- 교육/편의/개발/중개/거리뷰/지도/거리재기 등 오른쪽 지도 버튼의 폭이 더 슬림하게 보이도록 조정했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.13`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:23 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 매물 숫자 뱃지를 선택한 뒤 줌 변경으로 클러스터가 다시 나뉠 때 여러 숫자 뱃지가 동시에 선택색으로 보이던 문제를 수정했다.
- 클러스터 선택 모드에서는 현재 선택을 이어받을 하위 클러스터가 계산되면 그 뱃지 하나만 선택 상태로 표시하도록 했다.
- 기존 선택 클러스터와 새 하위 클러스터가 동시에 선택 처리되던 조건을 제거했다.
- JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 JS 캐시 쿼리를 `3.924.4`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:20 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 `공지사항 관리` 본문 폭을 `1:1 문의내역`과 같은 `min(560px, 100%)` 기준으로 맞췄다.
- 관리자 탭 전체 폭은 유지하고, 공지사항 작성 폼/목록을 감싸는 `admin-notice-manager`만 560px 컨테이너로 정리했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.12`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:16 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 `1:1 문의내역` 본문 폭을 마이페이지 `1:1 문의내역`과 같은 `min(560px, 100%)` 기준으로 맞췄다.
- 기존 관리자 문의내역의 `4/6` 계산 폭 규칙을 제거하고, 필터바와 문의 목록이 같은 560px 컨테이너 안에서 시작되도록 정리했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.11`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:13 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 우측 상단 로그인 상태에서 프로필 사진 오른쪽 여백을 `16px`에서 `8px`로 줄였다.
- 프로필 사진과 버전 정보 사이가 과하게 벌어지지 않도록 프로필 래퍼의 오른쪽 여백만 조정했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.10`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:11 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 왼쪽 매물 목록이 열린 상태에서 초등학교, 중학교, 고등학교, 어린이집, 유치원, 학원 마커를 클릭하면 매물 목록 오른쪽에 교육 상세가 뜨던 흐름을 수정했다.
- 교육 시설 상세 진입 전 매물 목록 패널만 먼저 접어, 교육 상세 패널이 기존 왼쪽 매물 목록 자리에서 열리도록 했다.
- 기존 로드뷰 상세 교체 흐름은 유지해, 거리뷰 파란선 상태에서는 로드뷰 상세만 닫고 교육 상세로 교체되도록 했다.
- JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 JS 캐시 쿼리를 `3.924.3`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:06 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 마이페이지 화면 상단의 `마이페이지 >` 텍스트가 클릭 가능한 이동 버튼처럼 동작하지 않도록 수정했다.
- HTML 내부 fallback 클릭 핸들러와 메인 JS 클릭 핸들러 둘 다 `my-suite-page-open` 상태에서는 이동 호출을 하지 않고 클릭만 소비하도록 맞췄다.
- 마이페이지 화면에서는 해당 텍스트 커서를 기본 커서로 바꿔 설명 제목처럼 보이게 했다.
- CSS/JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.9`, JS 캐시 쿼리를 `3.924.2`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:02 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 우측 상단 로그인 상태에서 프로필 사진과 버전 정보 숫자가 붙어 보이는 문제를 수정했다.
- 프로필 영역 오른쪽에 `16px` 여백을 직접 부여하고, 로그인 트리거의 `max-width` 제한을 해제해 긴 버전 숫자에서도 간격이 눌리지 않도록 했다.
- 기존 spacer는 폭을 0으로 정리해 프로필 래퍼의 실제 오른쪽 여백이 간격을 담당하도록 했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.8`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 20:00 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 공지사항 화면 상단에 `마이페이지`가 보이던 문제를 수정했다.
- 공지사항 전용 상단 제목 span을 추가하고, `notice-page-open` 상태에서는 `공지사항` 제목을 표시하도록 했다.
- 공지사항 화면에서는 로고 옆 마이페이지 링크를 숨기도록 했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.7`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:49 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 거리뷰 파란선이 켜진 상태에서 초등학교, 중학교, 고등학교, 어린이집, 유치원, 학원 마커를 클릭하면 로드뷰 상세 패널만 닫고 교육 상세 패널로 교체되도록 했다.
- 같은 상태에서 중개사 뱃지/중개사 툴팁 항목을 클릭하면 로드뷰 상세 패널만 닫고 왼쪽 중개사 매물 목록으로 교체되도록 했다.
- 교육 상세 패널이 열린 상태에서 다시 파란선을 클릭하면 교육 상세 패널을 먼저 닫고 로드뷰 상세뷰가 다시 뜨도록 보강했다.
- 도로 위 파란선 로드뷰 가능 상태는 유지하고, 왼쪽 패널만 로드뷰 상세뷰/매물 목록/교육 상세/중개사 목록으로 교체되는 흐름으로 맞췄다.
- JS 변경이 브라우저 캐시에 막히지 않도록 HTML의 JS 캐시 쿼리를 `3.924.1`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/js/app_3.924.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:25 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 상단 제목을 마이페이지처럼 `관리자 페이지 >` 형태로 표시하도록 변경했다.
- 관리자 페이지 상단 메뉴가 `>` 포함 제목 오른쪽에서 왼쪽 정렬로 시작하도록 탭 시작 위치를 보정했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.6`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:24 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 마이페이지 `1:1 문의내역` 하단 `문의하기` 버튼 크기를 내 정보 액션 버튼과 같은 compact pill 규격으로 맞췄다.
- 해당 버튼만 `height: 34px`, `padding: 0 14px`, `font-size: 13.5px`로 조정해 문의 등록/저장 폼 버튼에는 영향이 없도록 했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.5`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:22 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 중개사 홈 상단 제목 글자 크기/굵기를 마이페이지 상단 제목과 같은 `14.5px / 760` 기준으로 맞췄다.
- 관리자 페이지 상단 제목과 탭 메뉴가 같은 좌측 기준선을 쓰도록 `--realjeju-topbar-page-title-left` 공통 기준값을 추가했다.
- 관리자 페이지 상단 탭 메뉴를 기존 중앙 정렬에서 제목 오른쪽 시작점 기준의 왼쪽 정렬 배치로 변경했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.4`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:20 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 마이페이지 상단 제목에서 마이페이지 화면일 때만 `마이페이지 >` 형태로 보이도록 화살표 표시를 추가했다.
- 마이페이지 상단 탭 메뉴를 기존 중앙 정렬에서 제목 오른쪽 시작점 기준의 왼쪽 정렬 배치로 변경했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.3`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:18 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 관리자 페이지 상단 제목이 오른쪽으로 밀려 보이던 문제를 수정했다.
- 관리자 페이지 제목 위치를 마이페이지 제목과 같은 기준선인 `var(--realjeju-side-nav-width) + var(--realjeju-page-gap)` 기준으로 맞췄다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.2`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:17 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 중개사 홈 화면에서 상단 로고 옆에 `마이페이지`가 보이던 문제를 수정했다.
- 중개사 홈용 상단 페이지 제목 span에 `중개사 홈` 텍스트를 직접 넣고, 중개사 홈 상태에서는 로고 옆 `마이페이지` 버튼을 숨기도록 했다.
- CSS 변경이 브라우저 캐시에 막히지 않도록 HTML의 CSS 캐시 쿼리를 `3.924.1`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.924.html`, `/Users/GHOST/Downloads/css/base_3.924.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:14 KST / Version 3.924

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.924.html
- /Users/GHOST/Documents/REALJEJU/base_3.924.css
- /Users/GHOST/Documents/REALJEJU/app_3.924.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- `realjeju_3.923` 작업본을 `realjeju_3.924` 배포 파일 세트로 버전업했다.
- HTML의 CSS/JS 참조와 화면 버전 표기, `APP_VERSION`을 `3.924`로 갱신했다.
- 최근 조회 상세/왼쪽 매물 패널에서 `관심 부동산`, `마이페이지`, `중개사 홈`으로 이동할 때 지도 홈 전용 상단 필터바와 주소검색창이 남아 화면이 깨지는 문제를 CSS 최종 방어 규칙으로 보강했다.
- `my-suite-page-open`, `broker-home-page-open`, `admin-page-open` 상태에서는 `#topbarMenu.has-map-filters`와 내부 지도 필터/주소검색 UI가 무조건 숨겨지도록 했다.

## 2026-06-30 19:12 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.923.html
- /Users/GHOST/Documents/REALJEJU/app_3.923.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 왼쪽 메뉴 `최근 조회`에서 매물 상세/왼쪽 매물 패널을 연 뒤 `관심 부동산`, `중개사 홈`, `마이페이지`로 이동하면 지도용 상단 필터바와 주소검색창 상태가 남아 화면이 깨지던 문제를 수정했다.
- `openMySuitePage()` 진입 전 공통 지도 홈 정리 루틴을 호출해 `관심 부동산`과 `마이페이지` 이동 시 최근조회 상세 상태를 먼저 닫도록 했다.
- `openBrokerHomePage()` 진입 전에도 같은 정리 루틴을 호출해 `중개사 홈` 이동 시 최근조회 상세/필터바 잔상이 남지 않도록 했다.
- 수정된 JS가 브라우저 캐시에 막히지 않도록 HTML의 JS 캐시 쿼리를 `3.923.3`으로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.923.html`, `/Users/GHOST/Downloads/js/app_3.923.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:10 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.923.html
- /Users/GHOST/Documents/REALJEJU/base_3.923.css
- /Users/GHOST/Documents/REALJEJU/app_3.923.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 우측 상단 로그인 상태에서 프로필 사진과 버전 정보가 붙어 보이는 문제를 CSS margin 방식 대신 실제 DOM spacer(`.topbar-profile-version-gap`)로 수정했다.
- 프로필 사진과 `Ver 3.923` 사이에 고정 `14px` 폭의 spacer를 넣어 화면에서 간격이 확실히 생기도록 했다.
- 기존 `topbar-version-text`의 `margin-left` 방식은 제거하고 spacer가 간격을 담당하도록 정리했다.
- 브라우저가 기존 `3.923` CSS/JS 캐시를 계속 읽는 문제를 피하기 위해 HTML의 CSS/JS 캐시 쿼리를 `3.923.2`로 갱신했다.
- 다운로드 폴더의 실제 참조 경로(`/Users/GHOST/Downloads/realjeju_3.923.html`, `/Users/GHOST/Downloads/css/base_3.923.css`, `/Users/GHOST/Downloads/js/app_3.923.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:09 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.923.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 왼쪽 메뉴 `최근 조회`에서 매물 상세/왼쪽 매물 패널을 연 뒤 관리자 페이지로 이동하면 지도용 상단 필터바와 주소검색창 상태가 남아 관리자 화면에서 깨져 보이던 문제를 수정했다.
- 관리자 페이지 진입 전 `최근조회 공유 상세`, `왼쪽 매물 목록`, `상세 패널`, `지도 필터 드롭다운`, `주소검색/필터바 보정 클래스`를 한 번에 닫는 정리 루틴을 추가했다.
- 다운로드 폴더의 실제 JS 참조 경로(`/Users/GHOST/Downloads/js/app_3.923.js`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:06 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.923.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 우측 상단 로그인 상태의 프로필 사진과 버전 정보 사이 간격을 `프로필 margin-right` 방식에서 `버전 텍스트 margin-left: 12px` 방식으로 변경했다.
- 버튼 내부 gap은 `0`으로 정리해 실제 화면에서 `프로필 사진`과 `Ver 3.923` 사이가 딱 붙어 보이지 않도록 고정했다.
- 다운로드 폴더의 실제 CSS 참조 경로(`/Users/GHOST/Downloads/css/base_3.923.css`)에도 동일하게 복사 적용했다.

## 2026-06-30 19:06 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Downloads/base_3.923.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- HTML에서 실제로 참조하지 않는 다운로드 폴더 루트의 중복 CSS 파일(`/Users/GHOST/Downloads/base_3.923.css`)을 삭제했다.
- 실제 참조 경로인 `/Users/GHOST/Downloads/css/base_3.923.css`는 유지했다.

## 2026-06-30 19:04 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.923.css
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- 로그인 상태 우측 상단에서 프로필 사진과 버전 정보(`Ver 3.923`) 사이가 붙어 보이지 않도록 프로필 영역 오른쪽 여백을 `8px`에서 `12px`로 조정했다.
- HTML이 참조하는 다운로드 폴더 CSS 경로(`/Users/GHOST/Downloads/css/base_3.923.css`)에도 같은 변경을 복사 적용했다.

## 2026-06-30 16:00 KST / Version 3.923

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_3.923.html
- /Users/GHOST/Documents/REALJEJU/base_3.923.css
- /Users/GHOST/Documents/REALJEJU/app_3.923.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_CHANGELOG.md

### 수정 내용
- `realjeju_3.922` 작업본을 `realjeju_3.923` 배포 파일 세트로 버전업했다.
- HTML에서 CSS/JS 캐시 버전 쿼리를 `3.923`으로 갱신하고 상단/다운로드 버전 텍스트도 `Ver 3.923`로 업데이트했다.
- `app_3.923.js`의 `APP_VERSION` 상수를 `3.923`으로 갱신했다.
- `REALJEJU_CHANGELOG.md`에 작업 이력을 누적 기록했다.

## 2026-06-30 18:14 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.922.js

### 수정 내용
- 거리뷰(파란선) 상태에서 매물/교육 마커 경로로 상세 패널을 열 때
  로드뷰 상세 패널만 정리하고, 도로 위 파란선(지도 로드뷰 오버레이) 상태는 유지되도록 정리 함수를 통일.
- `closeRoadviewBeforeFacilityDetail()` 내부를 `closeRoadviewPanelForPropertyInteraction()` 기반으로 정비해
  교육 상세 진입 시에도 매물 클릭과 동일하게 로드뷰 라인 유지를 보장.
- `openEducationFacilityDetailPanel()` 진입 시 폴백 분기에도 위 로직을 타도록 보강하여,
  매물 뱃지/마커 클릭 후 좌측 목록/패널 전환 시 로드뷰 라인이 끊기지 않도록 정렬.

## 2026-06-30 15:35 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.922.css

### 수정 내용
- 우측 상단 로그인 상태에서 프로필 영역과 버전 텍스트 사이 간격을 1칸 더 넓혀 `8px`로 조정.
  - `.global-topbar-right #detailAuthTrigger.logged-in .topbar-account-profile { margin-right: 8px; }`

## 2026-06-30 17:10 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.922.css

### 수정 내용
- 마이페이지 1:1 문의내역 본문(`.my-suite-content.my-suite-inquiries-content`) 폭을 `내 정보` 페이지와 동일한 규격으로 맞춤.
  - `width`를 `min(560px, 100%)`으로 변경하고, 기존의 4/6 분할 폭을 제거.
  - 오른쪽에 생기던 분할 여백(`margin-right`)을 제거해 좌우 폭이 동일하게 보이도록 정렬.

## 2026-06-30 17:32 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/base_3.922.css

### 수정 내용
- 로그인 상태의 상단 우측 영역에서 버전 텍스트(`Ver 3.922`)와 프로필 사진 사이에 간격을 `6px` 추가해 가독성과 간격감을 개선.
  - `.global-topbar-right #detailAuthTrigger.logged-in .topbar-account-profile { margin-right: 6px; }`

## 2026-06-30 16:58 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/app_3.922.js
- /Users/GHOST/Downloads/REALJEJU_CHANGELOG.md

### 수정 내용
- 교육 마커(초등/중/고/어린이집/유치원/학원) 클릭 시 `closeRoadviewBeforeFacilityDetail()`에서
  지도 로드뷰 오버레이 토글(`setMapRoadviewOverlayVisible(false)`)을 제거해,
  로드뷰 상세패널은 닫되 거리뷰 경로 표시(파란선)는 유지되도록 조정.

## 2026-06-30 16:22 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.922.html
- /Users/GHOST/Downloads/js/app_3.922.js
- /Users/GHOST/Downloads/css/base_3.922.css

### 수정 내용
- 좌측 로드뷰 상세 패널이 떠 있는 상태에서 매물 마커/클러스터/목록 카드/최근 조회 진입 경로에서도 `hideRoadview()` 직전에 교육 상세 오버레이 정리 함수를 선반영하도록 통합.
- `openDetailFromUrl`, `focusProperty`, `moveMapToProperty`, 마커 클릭, 클러스터 선택 경로에 동일한 순서를 적용해 로드뷰 잔상 없이 매물 패널이 열리도록 정리.
- 클러스터/매물 마커 클릭 시 교육 시설 상세 패널 상태가 남아있더라도 매물 경로가 우선 처리되도록 보완.

## 2026-06-30 16:38 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.922.js

### 수정 내용
- 교육 마커 클릭 경로에서 `openEducationFacilityDetailPanel()` 진입 직전에 로드뷰/패널 정리 함수를 강제 실행하도록 보강.
- 로드뷰 오버레이 DOM(`roadviewPanel`)의 `open` 클래스 및 표시 스타일을 즉시 제거하고, 지도 로드뷰 관련 바디 클래스를 선제 삭제해 교육 상세가 열릴 때 로드뷰 잔상과 겹침이 남지 않게 정렬.
- 교육 마커 클릭 핸들러를 `await` 기반으로 변경해 패널 정리 후에만 교육 상세 렌더링이 시작되도록 조정.
- 교육 상세 함수 자체를 `async`로 전환해 호출 전후 처리 순서를 명시적으로 통일.

## 2026-06-30 15:16 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.922.html
- /Users/GHOST/Downloads/js/app_3.922.js
- /Users/GHOST/Downloads/css/base_3.922.css

### 수정 내용
- 교육 마커 클릭 시 로드뷰가 남아 있을 때 로드뷰 오버레이를 강제 숨김 처리해 교육 상세 패널이 위로만 보이게 보정.
- 교육 상세 패널 오픈 직전 프레임 동기화 대기를 추가해 렌더 순서를 안정화.
- 로드뷰 패널이 아직 닫히지 않은 구간에 `.education-facility-detail-open` 상태에서 CSS로 로드뷰 오버레이를 비노출 처리.
- 기존 동작은 유지하면서 로드뷰-교육 상세 겹침만 차단되도록 최소 범위로 적용.

## 2026-06-30 15:02 KST / Version 3.922

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.922.html
- /Users/GHOST/Downloads/js/app_3.922.js
- /Users/GHOST/Downloads/css/base_3.922.css

### 수정 내용
- 3.921 소스를 기준으로 3.922 HTML/JS/CSS 파일을 생성하고, HTML의 CSS/JS 참조와 화면 버전 표시를 `3.922`로 갱신.
- 교육 마커 클릭 시 기존 `hideRoadview()`만 호출하던 흐름을 `closeRoadviewBeforeFacilityDetail()` 전용 정리 함수로 변경.
- 로드뷰 왼쪽 상세/분할 로드뷰/지도 로드뷰 overlay 모드가 남아 있을 때 교육 상세가 겹치지 않도록 로드뷰 패널, 로드뷰 body class, 지도 roadview overlay, 기존 매물 상세 패널을 먼저 닫도록 보강.
- 초등학교, 중학교, 고등학교, 어린이집, 유치원, 학원 마커 클릭이 모두 같은 교육 마커 클릭 경로를 타도록 유지.

### 검증
- `app_3.922.js` 문법 검사 통과: bundled `node --check`
- `base_3.922.css` 괄호 균형 확인: `braceBalance=0`
- `realjeju_3.922.html` 내 CSS/JS/버전 표시가 `3.922`를 참조하는 것 확인.

## 2026-06-30 14:57 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 관리자 페이지 `중개사무소 가입 신청` 목록에서 중개사무소명/대표자명 왼쪽에 프로필 사진이 표시되도록 카드 구조를 변경.
- `가입 신청`, `승인 완료` 등 같은 카드 렌더를 쓰는 상태 목록에서 `user_id` 기준으로 `profiles.profile_image`를 추가 조회해 신청 데이터에 병합.
- 프로필 사진이 없을 때는 대표자명/중개사무소명의 첫 글자 fallback 원형 배지를 표시.
- 관리자 신청 카드 전용 프로필 사진 원형 스타일과 모바일 정렬을 추가.

### 검증
- `app_3.921.js` 문법 검사 통과: bundled `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`

## 2026-06-30 14:50 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 상단바 `관리자 페이지` 제목의 시작 위치를 `마이페이지` 글자 시작 위치와 같은 계산식으로 조정.
- 기존 고정값 `194px`로 인해 관리자 제목이 마이페이지보다 왼쪽에 보이던 어긋남을 보정.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`

## 2026-06-30 14:29 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 `내 정보`, `중개사 정보`의 `비밀번호 변경`, `수정`, `취소`, `저장` 버튼 높이를 `42px`에서 `34px`로 축소.
- 버튼 좌우 패딩을 `18px`에서 `14px`로 줄이고, 글자 크기를 `13.5px`로 낮춰 더 컴팩트하게 정리.
- 기존 오른쪽 정렬, 흰 배경, hover 회색 배경 규칙은 유지.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`

## 2026-06-30 14:27 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 관리자 페이지 `1:1 문의내역` 본문 폭을 마이페이지 문의내역처럼 전체 콘텐츠의 `4/6` 폭으로 조정.
- 관리자 문의 상태 필터 버튼 높이/폰트/패딩을 마이페이지 상단 필 탭 크기와 맞춤.
- 관리자 문의 목록 행의 작성자, 제목, 상태 배지, 삭제 버튼 크기를 마이페이지 `1:1 문의내역` 행 스케일로 축소.
- 모바일에서는 문의내역 폭을 다시 `100%`로 풀어 좁은 화면에서 잘리지 않게 유지.

### 검증
- `base_3.921.css` 최종 관리자 문의내역 규칙 위치 확인.

## 2026-06-30 14:22 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 관리자 페이지 제목 `관리자 페이지`를 상단바 로고 오른쪽에 표시되도록 HTML span을 복구.
- 관리자 페이지 메뉴(`공지사항`, `1:1 문의내역`, `쿠폰 관리`, `매물 관리`, `회원 관리`, `중개사무소 가입 신청`)를 마이페이지 탭처럼 상단바 중앙에 배치.
- 본문 안에 있던 기존 관리자 메뉴는 관리자 페이지 열림 상태에서 숨겨 중복 노출을 제거.
- 관리자 페이지 열림 상태에서는 기존 상단 필터 메뉴를 숨기고, 관리자 상단 메뉴만 표시.
- 관리자 메뉴 버튼 위치/크기/hover/선택 상태는 마이페이지 상단 탭 규칙과 같은 필 라운드 계열로 유지.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 상단바 관리자 제목/메뉴 HTML 추가와 본문 관리자 메뉴 숨김 CSS 확인.

## 2026-06-30 14:16 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 관리자 페이지 상단 메뉴 버튼을 마이페이지 메뉴와 같은 필 라운드 탭 스타일로 변경.
- 기존 6등분 박스형 탭의 외곽선/분할선을 제거하고, 가운데 정렬된 `34px` 높이 pill 버튼으로 정리.
- hover 상태는 연한 회색 배경, 선택 상태는 파란 배경/흰 글자/`700` 두께로 마이페이지 메뉴와 맞춤.
- 사이드 메뉴 활성 상태에서도 관리자 페이지 콘텐츠 폭 안에서 중앙 정렬되도록 유지.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 관리자 페이지 탭 전용 최종 CSS 규칙이 기존 박스형 탭 규칙 뒤에서 적용되는 것 확인.

## 2026-06-30 14:14 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 `내 정보`, `중개사 정보` 액션 버튼을 오른쪽 정렬로 고정.
- `비밀번호 변경`, `수정`, `취소`, `저장` 버튼 모두 흰 배경/연한 회색 선으로 통일.
- hover 상태는 연한 회색 배경으로 표시.
- 버튼 폭이 동일하게 늘어나지 않도록 `flex: 0 0 auto`, `width: auto`, `min-width: 0`으로 조정해 글자 길이에 비례하도록 변경.
- `1:1 문의내역` 버튼 스타일은 변경하지 않음.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 기존 마이페이지 필 버튼 규칙 뒤에서 `내 정보/중개사 정보` 버튼 전용 규칙이 최종 적용되는 것 확인.

## 2026-06-30 14:03 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 내부 액션 버튼을 필 라운드 형태로 통일.
- `1:1 문의내역`의 `문의하기`, `1:1 문의하기` 입력 화면의 `취소`, `문의 등록` 버튼을 `42px` 높이와 `999px` radius로 변경.
- `내 정보`, `중개사 정보`의 `비밀번호 변경`, `수정`, 수정 화면의 `취소`, `저장` 버튼도 같은 필 버튼 규칙으로 통일.
- 기본 버튼은 흰 배경/연한 회색 선, 주요 버튼은 파란 배경/흰 글자, 글자 두께 `700`으로 정리.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 마이페이지 패널 내부 버튼에만 적용되도록 `.my-suite-panel` 범위로 제한.

## 2026-06-30 13:59 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js

### 수정 내용
- 로드뷰 상세가 왼쪽에 열린 상태에서 교육 시설 마커를 클릭하면 로드뷰를 먼저 닫고 교육 상세 패널이 뜨도록 변경.
- 매물 마커 클릭 때처럼 교육 시설 상세가 로드뷰 위에 겹쳐 뜨지 않도록 클릭 순서를 보정.
- 로드뷰를 지도에서 새로 열 때 오른쪽 `교육`, `편의`, `개발`, `중개`, 지도타입 패널이 남아 있으면 모두 닫히도록 처리.

### 검증
- `app_3.921.js` 문법 검사 통과: bundled `node --check`
- 교육 시설 마커 클릭 핸들러와 로드뷰 오픈 흐름 변경 위치 확인.

## 2026-06-30 13:32 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 `1:1 문의내역` 화면의 상단 여백이 문구 왼쪽 여백보다 커 보이던 문제를 보정.
- `1:1 문의내역` 컨텐츠가 열린 경우에만 마이페이지 패널 상단 padding을 왼쪽 페이지 여백 기준(`40px`)으로 맞춤.
- 다른 마이페이지 탭의 본문 배치와 푸터 여백은 변경하지 않음.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 검색 확인: `my-suite-inquiries-content` 전용 상단 여백 보정 규칙 추가.

## 2026-06-30 13:31 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js

### 수정 내용
- 중개사무소 등록번호 저장 전 공통 정규화 헬퍼 `normalizeBrokerOfficeRegNo()`를 추가.
- `50110202400027`처럼 14자리 숫자로 입력하면 저장 직전에 `50110-2024-00027` 형식으로 자동 변환.
- 이미 `50110-2024-00027`처럼 `5-4-5` 하이픈 형식이면 그대로 저장.
- 마이페이지 중개사 정보 수정, 중개사무소 가입 신청, 기존 프로필 중개사무소 수정/신청, 매물 등록 payload의 중개사 등록번호 스냅샷까지 같은 포맷을 적용.
- 중개사 카드 표시 등록번호도 같은 형식으로 보이도록 보정.

### 검증
- `app_3.921.js` 문법 검사 통과: bundled `node --check`
- 변경 검색 확인: 중개사무소 등록번호 저장 경로가 모두 `normalizeBrokerOfficeRegNo()`를 거치도록 정리.

## 2026-06-30 13:21 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js

### 수정 내용
- 오른쪽 `중개` 패널에서 `내 매물만`, `우리 사무소 매물`을 클릭하면 상단 `매물 유형` 필터의 모든 항목이 체크되도록 변경.
- 상단 `매물 유형` 필터와 전체 필터 패널의 `매물 유형` 체크박스가 같이 전체 선택 상태로 동기화되도록 헬퍼 추가.
- 중개사 전용 필터 적용 시 기존 중개사무소 마커 숨김/목록 필터 적용 흐름은 유지.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 상단 매물유형 전체 선택 헬퍼와 중개사 전용 필터 클릭 분기만 변경.

## 2026-06-30 13:19 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 상단 메뉴 위치는 유지하고, 본문 내용 영역의 추가 위쪽 margin만 제거.
- 마이페이지 본문 시작 높이가 왼쪽 여백(`40px`)과 같은 패널 기준 여백을 쓰도록 정렬.
- 관심 부동산, 1:1 문의내역, 허위매물 신고, 이용권 결제, 내 정보, 중개사 정보 본문에 공통 적용.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 본문 content top margin 정렬 규칙만 추가.

## 2026-06-30 13:16 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 탭 메뉴가 본문으로 내려간 12:00 변경을 정정.
- `관심 부동산`, `1:1 문의내역`, `허위매물 신고`, `이용권 결제`, `내 정보`, `중개사 정보` 메뉴를 다시 상단바 중앙 라운드 필 메뉴로 복구.
- 마이페이지 패널 본문 안의 중복 탭 메뉴를 제거하고, 마이페이지 진입 시 기존 상단 필터 메뉴는 숨김 유지.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 탭 메뉴를 상단바로 복구하고 본문 중복 메뉴를 제거.

## 2026-06-30 13:14 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 우측 상단 로그인 프로필 사진 크기를 `매물` 버튼 외곽이 아닌 내부 파란 원 크기(`30px × 30px`)로 정정.
- 프로필 사진 외곽선을 `0.5px`의 더 연한 회색 라인으로 조정.
- 프로필 이미지 fallback 글자 크기도 30px 원에 맞게 축소.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 우측 상단 프로필 사진 크기와 외곽선 두께/색만 변경.

## 2026-06-30 13:11 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 우측 상단 로그인 프로필 사진을 오른쪽 지도 메뉴 `매물` 버튼 원 크기와 같은 `44px × 44px`로 조정.
- 프로필 사진이 1:1 비율을 유지하도록 `aspect-ratio`, `min/max width/height`를 고정.
- 프로필 사진 외곽선을 약한 회색 라인으로 낮추고 fallback 원도 같은 약한 외곽선 기준으로 정리.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 우측 상단 프로필 사진 크기/외곽선만 변경.

## 2026-06-30 12:00 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 내부 탭 메뉴를 상단바가 아닌 마이페이지 패널 첫 줄로 이동.
- 마이페이지 내부 탭 메뉴의 위쪽 여백이 왼쪽 여백(`40px`)과 같은 기준을 쓰도록 정렬.
- 라운드 필 버튼 스타일과 가운데 정렬은 유지하고, 마이페이지 진입 시 기존 상단 필터 메뉴는 숨김 유지.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 내부 탭 메뉴 위치와 여백 스타일만 변경.

## 2026-06-30 11:58 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 로그인 후 우측 상단 계정 표시에서 이름 텍스트를 제거.
- 우측 상단은 프로필 사진과 `Ver 3.921`만 보이도록 로그인 상태 버튼 폭과 간격을 축소.
- 프로필 사진 클릭 시 `마이페이지 > 내 정보`로 이동하는 기존 동작은 유지.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 우측 상단 로그인 계정 이름 제거와 관련 폭/간격만 변경.

## 2026-06-30 11:44 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 탭 메뉴를 본문 영역에서 제거하고 상단바 중앙의 라운드 필 버튼 메뉴로 이동.
- 로고 오른쪽 `마이페이지` 제목 시작선을 마이페이지 본문/내 정보 카드 왼쪽 선과 맞추도록 보정.
- 왼쪽 사이드 메뉴 폭을 `176px`로 조정.
- 마이페이지 상단 탭 기본/hover/선택 상태를 필 버튼 스타일로 정리하고, 마이페이지 진입 시 기존 상단 필터 메뉴는 숨김 처리.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 탭 위치/스타일, 상단 마이페이지 제목 x좌표, 사이드 메뉴 폭만 변경.

## 2026-06-30 11:39 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 로그인 전 우측 상단은 기존처럼 `Ver 3.921`만 표시하도록 유지.
- 로그인 후 우측 상단에 `프로필 사진 / 이름 / Ver 3.921` 조합을 표시하도록 변경.
- 프로필 사진 또는 이름 클릭 시 `마이페이지 > 내 정보` 탭으로 이동하도록 클릭 분기 추가.
- 중개사 계정은 승인된 중개사무소명이 있으면 개인 이름보다 중개사무소명을 우선 표시.
- 관리자 계정은 `개인 이름(관리자)` 형식으로 표시.
- JS 배포 버전 상수를 3.921로 맞춰 로그인 후에도 버전 표기가 3.921로 유지되도록 조정.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 우측 상단 로그인 계정/버전 표시와 클릭 분기만 변경.

## 2026-06-30 11:32 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html
- /Users/GHOST/Downloads/css/base_3.921.css
- /Users/GHOST/Downloads/js/app_3.921.js

### 수정 내용
- 상단 로고 오른쪽에 배경 없는 텍스트형 `마이페이지` 버튼을 추가.
- `마이페이지` 버튼 클릭 시 `마이페이지 > 내 정보` 탭으로 이동하도록 앱 JS와 HTML fallback 클릭 처리를 연결.
- 관리자 페이지에서는 상단 `마이페이지` 버튼이 보이지 않도록 숨김 처리.
- 마이페이지 진입 상태에서는 버튼 글자를 조금 더 진하게 표시.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 상단 마이페이지 버튼 추가/스타일/클릭 연결만 변경.

## 2026-06-30 11:25 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.921.html

### 수정 내용
- 관리자 페이지 상단바에서 로고 옆에 표시되던 `관리자 페이지` 텍스트 span을 제거.
- 마이페이지/중개사 홈 상단 제목 구조는 유지.

### 검증
- 변경 diff 확인: 상단바 관리자 페이지 제목 span 1줄 제거만 변경.

## 2026-06-30 11:23 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 내부 상단 메뉴(`관심 부동산`, `1:1 문의내역`, `허위매물 신고`, `이용권 결제`, `내 정보`, `중개사 정보`)를 네모 버튼형에서 텍스트 탭형으로 변경.
- 기본 상태는 배경 없는 볼드 텍스트(`14.5px`, `680`, `#374151`)로 정리.
- hover 상태는 `820`, 선택 상태는 `810`과 파란 글자/2px 하단선으로 표시.
- 모바일에서도 2열 박스 대신 줄바꿈 가능한 텍스트 탭으로 보이도록 조정.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 상단 탭 스타일만 변경.

## 2026-06-30 11:18 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/realjeju_3.921.html

### 수정 내용
- 중개사 홈 사용현황 한도를 전체 사용자 기준으로 `일반매물 300건`, `프리미엄 매물 50건`, `하루 재등록 100건`으로 변경.
- 실제 사용량 계산에 쓰이는 `REALJEJU_CURRENT_PAYMENT_PLAN` 한도와 2026-12-31까지 적용되는 임시 전체 사용자 한도를 같은 값으로 통일.
- 중개사 홈 초기 HTML 표시값과 현재 이용권 안내 문구도 `300 / 50 / 100` 기준으로 맞춤.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 중개사 홈 사용현황 한도와 관련 계산 상수만 변경.

## 2026-06-30 11:14 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 내부 `허위매물 신고` 탭에 전용 클래스 `my-suite-reports-content`를 부여해 중앙 배치 대신 왼쪽 시작선에 맞춤.
- `허위매물 신고`, `이용권 결제`, `내 정보`, `중개사 정보` 콘텐츠 시작 높이를 `관심 부동산` 탭 기준인 상단 48px로 통일.
- `내 정보`/`중개사 정보` 내부 카드가 다시 가운데로 밀리지 않도록 카드 좌우 margin을 왼쪽 기준으로 정리.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 탭 컨텐츠 위치 보정과 허위매물 신고 전용 클래스 지정만 변경.

## 2026-06-30 10:58 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.921.js
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 마이페이지 내부 `1:1 문의내역` 화면에서 제목 `1:1 문의내역`을 제거하고 안내문만 표시하도록 변경.
- `문의하신 내용을 확인하고 새 문의를 남길 수 있습니다.` 안내문의 시작 높이를 `관심 부동산` 탭 필터바 시작 높이에 맞추기 위해 `my-suite-inquiries-content` 상단 여백을 `72px`에서 `48px`로 조정.
- 로그인 필요/오류 상태의 문의내역 화면에서도 `1:1 문의내역` 제목을 제거.

### 검증
- `app_3.921.js` 문법 검사 통과: `node --check`
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 문의내역 제목 제거와 상단 위치 조정만 변경.

## 2026-06-30 10:52 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css
- /Users/GHOST/Downloads/realjeju_3.921.html

### 수정 내용
- 마이페이지 내부 `1:1 문의내역` 콘텐츠 시작점을 내부 탭 첫 번째 버튼(`관심 부동산`)의 왼쪽 시작선에 맞춤.
- `my-suite-inquiries-content`의 왼쪽 여백을 `0`으로 조정하고, 기존 폭을 유지하도록 오른쪽 여백을 2칸분으로 보정.
- HTML fallback의 `1:1 문의내역` 안내 문구를 실제 앱 문구인 `문의하신 내용을 확인하고 새 문의를 남길 수 있습니다.`로 통일.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 마이페이지 문의내역 콘텐츠 위치와 fallback 안내 문구만 변경.

## 2026-06-30 10:40 KST / Version 3.921

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.921.css

### 수정 내용
- 3.921 소스 기준으로 회원가입 이용약관 체크박스의 왼쪽 끝을 `모두 확인, 동의합니다.` 버튼 왼쪽 라인에 맞춤.
- 앞의 3개 약관 행 체크 영역은 `justify-content: flex-start`, 마지막 `만 14세 이상` 행은 `justify-self: start`로 보정.

### 검증
- `base_3.921.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 회원가입 약관 체크박스 왼쪽 정렬 CSS만 변경.

## 2026-06-30 10:25 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 회원가입 이용약관 체크박스의 왼쪽 끝을 `모두 확인, 동의합니다.` 버튼 왼쪽 라인에 맞춤.
- 앞의 3개 약관 행 체크 영역은 `justify-content: flex-start`, 마지막 `만 14세 이상` 행은 `justify-self: start`로 보정.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 회원가입 약관 체크박스 왼쪽 정렬 CSS만 변경.

## 2026-06-30 10:22 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 회원가입 이용약관 화면에서 `만 14세 이상` 체크박스가 다른 약관 체크박스보다 왼쪽으로 밀려 보이던 정렬을 보정.
- 직접 `label` 아래에 있는 체크박스도 앞의 약관 행과 같은 28px 체크 칼럼 중앙에 맞도록 `justify-self: center`를 추가.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 회원가입 약관 체크박스 정렬 CSS만 변경.

## 2026-06-30 00:07 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 같은 주소 중개사 row overlay를 가로 배치에서 세로 배치로 변경.
- 같은 주소 중개사 버튼 사이 간격은 `4px`로 유지.
- 첫 번째 중개사가 기존 주소 좌표 위치에 오도록 세로 row overlay의 `yAnchor` 계산을 추가.
- 각 중개사 버튼은 하나의 overlay 내부 개별 버튼 구조를 유지해 클릭 가능 상태를 보존.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 같은 주소 중개사 row overlay의 세로 배치와 anchor 계산만 변경.

## 2026-06-30 00:02 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 같은 주소 중개사 마커를 서로 다른 `CustomOverlay`로 따로 띄우지 않고, 하나의 row overlay 안에 개별 버튼으로 나란히 렌더링하도록 변경.
- row overlay 안의 중개사 버튼 간격을 `4px`로 고정.
- 같은 주소에서 왼쪽 중개사가 실제 클릭 영역 밖에 있어 지도 드래그 커서가 뜨던 문제를, 하나의 overlay 내부 버튼 구조로 수정.
- 각 중개사 버튼을 클릭하면 해당 중개사의 매물 목록이 열리도록 개별 클릭 이벤트 유지.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 같은 주소 중개사 row overlay 생성 로직과 row 버튼 CSS만 변경.

## 2026-06-29 23:58 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- 같은 주소 중개사 마커의 오른쪽 순차 배치 간격을 `38px`에서 `56px`로 조정.
- `매물 n` 라벨 폭 기준으로 약 `8px` 여유를 두어 라벨끼리 겹치지 않게 수정.
- 라벨/버튼 히트 영역이 겹쳐 왼쪽 중개사 클릭이 오른쪽 중개사에 가로막히는 현상을 줄이도록 배치 간격 보강.
- 좌표 재계산 없이 기존 CSS 픽셀 offset 방식은 유지.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 같은 주소 중개사 마커의 CSS offset 간격과 주석만 변경.

## 2026-06-29 23:45 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- 같은 주소 중개사 마커 배치를 가운데 기준 좌우 분산에서 오른쪽 순차 배치로 변경.
- 첫 번째 중개사는 기존 주소 좌표에 그대로 두고, 두 번째부터 오른쪽으로 `38px`씩 이동하도록 조정.
- 중개사 원형 마커 크기 `36px` 기준으로 약 `2px` 간격만 두어 바로 옆에 붙어 보이게 수정.
- 좌표 확대/축소 시마다 위경도 offset을 재계산하지 않고 기존 CSS 픽셀 offset 방식 유지.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 같은 주소 중개사 마커의 CSS offset 간격/계산식만 변경.

## 2026-06-29 23:42 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- 같은 주소 중개사 마커가 줌 축소/확대 때 멀어졌다 붙는 현상을 막기 위해 offset 좌표 변환을 제거.
- 같은 주소 그룹은 하나의 지도 기준 좌표에 고정하고, 화면상 CSS 픽셀 offset만 적용해 항상 나란히 붙어 보이도록 변경.
- 같은 주소 마커 간격 `72px`은 유지.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 같은 주소 중개사 마커의 위경도 offset 변환 제거 및 CSS offset 유지 로직만 변경.

## 2026-06-29 23:39 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- `제주특별자치도 제주시 우정로9`와 `제주특별자치도 제주시 우정로 9(1층)`처럼 같은 도로명 주소가 다르게 표기된 경우 같은 주소 키로 묶이도록 정규화 보강.
- 중개사 마커 그룹 기준을 화면 좌표보다 주소 키 우선으로 변경해 같은 주소 마커가 줌 축소/확대 때 다시 벌어지지 않도록 수정.
- 같은 주소 그룹은 각 중개사별 DB 좌표가 아니라 그룹 기준 좌표 하나에서 좌우 픽셀 offset만 적용하도록 변경.
- 같은 주소 마커 간격은 바로 옆에 붙어 보이도록 `72px` 기준으로 조정.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 주소 정규화 테스트 통과: `제주특별자치도 제주시 우정로9`와 `제주특별자치도 제주시 우정로 9(1층)` 모두 `우정로9`로 변환.
- 변경 diff 확인: 중개사 주소 정규화, 그룹 기준, 그룹 anchor offset 로직만 변경.

## 2026-06-29 23:35 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- 같은 주소/같은 좌표의 중개사 지도 마커가 여전히 겹쳐 보이는 문제를 보강.
- 중개사 마커 분산 그룹을 주소 문자열 우선이 아니라 실제 지도 화면 좌표 기준으로 먼저 묶도록 변경.
- 지도 좌표 변환이 어려운 경우에는 위경도 반올림 좌표, 주소 키 순서로 fallback.
- 같은 위치 중개사 마커 간격을 `64px`에서 `104px`로 넓혀 프로필 원과 `매물 n` 라벨이 옆으로 확실히 분리되도록 조정.
- 분산 단계에서 같은 이름 기준으로 다시 합치지 않고 원본 중개사 행을 그대로 펼치도록 변경.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 중개사 마커 분산 그룹/간격 로직만 변경.

## 2026-06-29 23:31 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 왼쪽 패드 하단 안내 문구 `지도 레벨 6단계까지만 표시`의 글자 두께를 `550`에서 `500`으로 조정.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: `.education-facility-filter-radius`의 `font-weight` 한 줄만 변경.

## 2026-06-29 23:28 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 지도 위 학원 점 색상을 보라색에서 시안 블루 계열로 변경.
- 기본 학원 점은 `rgba(8,145,178,0.78)`, 선택 학원 점은 `#0E7490`으로 조정.
- 왼쪽 교육 패널에서 학원 선택 시 아이콘/외곽선 색도 시안 블루 계열로 맞춤.
- 왼쪽 패널 선택 글자는 기존 공통 검정 톤 유지.
- 학원 점 크기와 흰색 외곽선 두께는 기존 유지.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 학원 지도 점과 학원 선택 패널 색상 규칙만 변경.

## 2026-06-29 23:26 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 지도 위 유치원 뱃지를 다시 기본 빨간색 배경으로 조정.
- 비선택 유치원은 자주색 배경과 흰 아이콘, 선택 유치원은 흰 배경과 자주색 아이콘/외곽선으로 표시되도록 복원.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 유치원 지도 뱃지 색상과 관련 주석만 변경.

## 2026-06-29 23:24 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 왼쪽 패드 메뉴의 `전체 선택해제` 버튼이 눌러지는 흰색 상태일 때 글자색을 검정 계열 `#111827`로 복원.
- 비활성 상태의 연한 글자색 `#d4d8de`는 그대로 유지.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: `전체 선택해제` enabled 글자색 한 줄만 변경.

## 2026-06-29 23:23 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 지도 위 유치원 뱃지의 선택/비선택 색상을 서로 반전.
- 비선택 유치원은 흰 배경과 자주색 아이콘/외곽선, 선택 유치원은 자주색 배경과 흰 아이콘으로 표시되도록 조정.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: 유치원 지도 뱃지의 선택/비선택 SVG 색상만 변경.

## 2026-06-29 23:20 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.920.css

### 수정 내용
- 오른쪽 메뉴 클릭 시 왼쪽에 뜨는 패드 메뉴의 `전체 선택해제` 버튼 글자색을 더 연한 회색으로 조정.
- 활성 버튼 글자색은 `#9ca3af`, 비활성 버튼 글자색은 `#d4d8de`로 낮춰 패널 카드 톤과 더 자연스럽게 맞춤.

### 검증
- `base_3.920.css` 괄호 균형 확인: `braceBalance=0`
- 변경 diff 확인: `전체 선택해제` 버튼 글자색 2곳만 변경.

## 2026-06-29 23:18 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- 같은 주소의 중개사 지도 마커가 겹치지 않도록 CSS 이동값만 쓰던 방식에서 실제 Kakao 지도 좌표를 픽셀 기준으로 좌우 변환해 배치하도록 수정.
- 같은 주소 중개사 마커 간격을 `46px`에서 `64px`로 넓혀 원형 마커와 `매물 n` 라벨이 나란히 분리되어 보이도록 조정.
- 기존 overlay를 재사용할 때도 새로 계산한 분산 좌표로 `setPosition()` 하도록 보강.
- projection 변환을 사용할 수 없는 경우에는 기존 CSS offset fallback을 유지.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 중개사 지도 마커 분산 로직만 변경.

## 2026-06-29 23:15 KST / Version 3.920

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.920.html
- /Users/GHOST/Downloads/css/base_3.920.css
- /Users/GHOST/Downloads/js/app_3.920.js

### 수정 내용
- `3.919` 기준 파일을 `3.920`으로 버전업.
- HTML의 CSS/JS 참조, 상단/하단 `Ver 3.920` 표시, 다운로드 파일명을 `3.920`으로 갱신.
- JS `APP_VERSION`을 `3.920`으로 갱신.
- 오른쪽 메뉴 버튼 클릭 시 뜨는 왼쪽 패드의 비활성 카드 배경을 참고 이미지 톤에 맞춰 `#f4f5f7`로 조정.
- 비활성 글자/아이콘 톤은 기존 회색 계열을 유지하고, `전체 선택해제` 비활성 버튼은 `#f8f9fb` 배경과 `#c6cbd1` 글자색으로 더 연하게 조정.

### 검증
- `app_3.920.js` 문법 검사 통과: `node --check`
- `base_3.920.css` 괄호 균형 확인.
- `realjeju_3.920.html`의 CSS/JS 참조와 `Ver 3.920` 표기 확인.

## 2026-06-29 23:13 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 점의 흰색 외곽선 두께를 `2.2px`로 조정.
- 학원 점 기본 보라색 배경과 선택 상태 진보라색 배경은 기존 유지.
- 기존 `1px`, `1.5px`, `2px`로 남아 있던 후반 학원 지도 점 외곽선 규칙을 `2.2px`로 맞춤.

### 검증
- `base_3.919.css` 괄호 균형 확인.
- 변경 diff 확인: 학원 지도 점 외곽선 관련 CSS만 변경.

## 2026-06-29 23:11 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.919.js

### 수정 내용
- 매물 숫자 뱃지에 쓰는 공통 폰트 스택을 `Inter` 우선에서 `Pretendard` 우선으로 변경.
- 단일 매물 `1` 뱃지와 클러스터 숫자 뱃지 모두 같은 폰트 기준을 사용하도록 유지.
- 폰트 크기, 굵기, 색상, 외곽선은 기존 유지.

### 검증
- `app_3.919.js` 문법 검사 통과: `node --check`
- 변경 diff 확인: 숫자 뱃지 폰트 스택 한 줄만 변경.

## 2026-06-29 23:09 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 오른쪽 도구 버튼 클릭 시 왼쪽에 뜨는 패널의 비활성 카드 배경을 `#f1f2f4`에서 더 연한 `#f7f8fa`로 조정.
- 교육/편의/개발/중개 패널의 비활성 아이콘 배경과 placeholder, 비활성 초기화 버튼 배경도 같은 밝은 톤으로 정리.
- 글자색, 아이콘색, 카드 크기와 간격은 기존 유지.

### 검증
- `base_3.919.css` 괄호 균형 확인.
- 변경 diff 확인: 패널 배경색 관련 CSS만 변경.

## 2026-06-29 23:05 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.919.js

### 수정 내용
- 지도 바탕 클릭 시 오른쪽 도구 패널 `교육`, `편의`, `개발`, `중개`, `지도`가 모두 닫히도록 공통 닫기 함수를 추가.
- 오른쪽 `교육` 버튼을 패널이 열린 상태에서 다시 누르면 선택 적용 루틴 대신 패널만 닫히도록 토글 동작을 통일.
- 기존 `편의`, `개발`, `중개`, `지도` 버튼의 클릭 토글 동작은 유지.

### 검증
- `app_3.919.js` 문법 검사 통과: `node --check`

## 2026-06-29 22:58 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 선택 안 한 학원 점에 흰색 `1px` 외곽선을 명시적으로 적용.
- 기존 학원 점 색상과 선택 상태 스타일은 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:57 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 보라색 원의 흰색 외곽선을 기본/선택 상태 모두 `1px`로 적용.
- 학원 점 배경색과 왼쪽 패널 색상/글자 두께 규칙은 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:55 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 패널 메뉴의 비선택 글자 두께를 `700`, 선택 글자 두께를 `740`으로 교육/편의/개발/중개 패널에 동일 적용.
- 선택된 메뉴 글자색을 패널 종류와 카테고리와 관계없이 검정 계열 `#111827`로 통일.
- 어린이집/유치원/학원 선택 시에도 초등학교/중학교/고등학교와 같은 글자 두께 기준을 적용.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:53 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널의 초등학교/중학교/고등학교 글자 웨이트를 비선택 `700`, 선택 `740`으로 최종 고정.
- 기존에는 비선택 `700`, 선택 `650`으로 선택 상태가 더 가벼워지던 부분을 보정.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:51 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 선택된 학원 점의 흰색 외곽선 두께를 `2px`에서 `1.5px`로 조정.
- 기본 학원 점 보라색과 왼쪽 교육 필터 패널 학원 선택 색상은 기존 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:49 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 기본 학원 점을 유치원색이 아닌 보라색 `rgba(124,58,237,0.88)`로 최종 고정.
- 지도 위 선택 학원 점은 `#4C1D95` 배경과 흰색 `2px` 외곽선으로 표시.
- 왼쪽 교육 필터 패널에서 학원 선택 시 연필 아이콘, 글자, 아이콘 주변 원 선을 지도 선택 색상과 같은 `#4C1D95`로 맞춤.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:45 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 선택된 학원 점 색상을 `#4C1D95`로 적용하고 흰색 `2px` 외곽선을 추가.
- 왼쪽 교육 필터 패널에서 학원 선택 시 버튼 외곽선, 아이콘색, 글자색을 지도 선택 학원 색상과 같은 `#4C1D95`로 맞춤.
- 기본 학원 점 색상과 왼쪽 패널 비선택 회색 톤은 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:43 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 점의 흰색 외곽선이 남지 않도록 학원 마커와 내부 아이콘에 `border`, `outline`, `box-shadow`, `filter`를 모두 `!important`로 제거.
- 기본 학원 점 배경은 요청값 `rgba(219,39,119,0.88)`로 유지.
- 선택 학원 점은 반전 배경을 유지하되 외곽선은 제거.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:41 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 점의 외곽선을 기본/선택 상태 모두 `border: 0`으로 제거.
- 왼쪽 교육 필터 패널 학원 버튼은 변경하지 않음.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:40 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 필터 패널의 비선택 메뉴 아이콘/글자 색상을 참고 이미지와 비슷한 회색 `#8d9094`로 정리.
- 비선택 메뉴 글자 두께를 `700`으로 맞춰 참고 이미지처럼 또렷하게 보이도록 조정.
- 선택된 메뉴의 기존 컬러 상태는 유지하고, 기본/비선택 상태에만 적용 범위를 제한.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:38 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 기본 학원 점을 `not(.selected)` 전용 최종 규칙으로 분리해 `rgba(219,39,119,0.88)`로 고정.
- 선택된 학원 점은 흰 배경과 빨간 외곽선 반전 상태를 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:36 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 기본 점을 기존 선택 상태처럼 진한 유치원색 계열 `rgba(219,39,119,0.88)`로 변경.
- 선택된 학원 점은 기본 점 색상의 반전 느낌으로 흰 배경과 빨간 외곽선 조합으로 변경.
- 학원 기본 점도 기존 선택 점 기준인 `20px`로 맞추고, 왼쪽 교육 필터 패널 학원 아이콘은 기존 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:34 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 작은 점 색상을 유치원 색상 계열인 `rgba(219,39,119,0.72)` 반투명 빨간색으로 변경.
- 학원 선택 상태는 같은 색상 계열의 `rgba(219,39,119,0.88)`로 더 진하게 표시.
- 학원 점 크기와 왼쪽 교육 필터 패널 학원 아이콘은 기존 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:30 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 학원 마커만 아이콘 없는 작은 보라색 점으로 변경.
- 학원 기본 마커는 `17px`, `rgba(124,58,237,0.72)` 배경, 흰색 `1px` 외곽선으로 정리.
- 학원 선택 상태는 `20px`로 살짝 키우고 배경을 `rgba(124,58,237,0.88)`로 더 진하게 표시.
- 왼쪽 교육 필터 패널의 학원 버튼 아이콘은 기존 상태를 유지.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:28 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 초등학교/중학교/고등학교 마커의 흰 배경 투명도를 `0.78`에서 `0.88`로 올려 더 또렷하게 보이도록 조정.
- 선택된 초/중/고 지도 마커 배경은 `0.92`로 올리고, 외곽선 색상 알파값도 `0.90`으로 보강.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:27 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 초등학교/중학교/고등학교 원형 마커 외곽선 두께를 어린이집 마커와 같은 `3px`로 맞춤.
- 왼쪽 교육 필터 패널의 얇은 선택 외곽선 규칙은 유지하고, 지도 마커에만 적용 범위를 제한.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:24 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 초등학교/중학교/고등학교 원형 마커를 어린이집/유치원과 같은 `34px × 34px` 기준으로 최종 고정.
- 지도 초/중/고 마커는 반투명 흰 배경에 각 카테고리 색상 글자와 외곽선이 보이도록 정리.
- 왼쪽 교육 필터 패널 아이콘의 그림자 효과를 제거하고, 초/중/고는 비선택 회색 유지/선택 시 지도 색상과 같은 초록·하늘·보라로 표시되도록 보정.
- 선택된 초/중/고 네모 버튼 외곽선도 얇은 상태로 유지하면서 지도 색상 계열로 맞춤.

### 검증
- `base_3.919.css` 최하단 최종 규칙 추가 확인.

## 2026-06-29 22:20 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널에서 어린이집/유치원 아이콘의 선택/비선택 상태가 뒤집혀 보이던 문제를 최종 규칙으로 보정.
- 어린이집/유치원 비선택 상태는 회색 배경/회색 아이콘으로, 선택 상태는 어린이집 녹색·유치원 자주색으로 표시되도록 분리.
- 선택된 네모 버튼 외곽선 얇게 처리한 규칙은 유지.

### 검증
- `base_3.919.css` 최하단 어린이집/유치원 왼쪽 패널 선택 상태 최종 규칙 추가 확인.

## 2026-06-29 22:17 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널에서 선택된 네모 버튼 외곽선을 `0.5px`로 얇게 고정.
- 선택 상태 버튼에 겹쳐 보이던 `inset` 그림자 외곽선을 제거해 선이 두껍게 보이지 않도록 정리.
- 지도 위 교육 마커와 패널 내부 원형 아이콘 색상/크기 규칙은 변경하지 않음.

### 검증
- `base_3.919.css` 최하단 선택 버튼 외곽선 최종 규칙 추가 확인.

## 2026-06-29 22:14 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널의 초/중/고/어린이집/유치원/학원 아이콘을 선택 여부와 관계없이 회색 계열로 최종 고정.
- 패널 아이콘 배경은 `rgba(241,242,244,0.82)`, 외곽선은 `rgba(156,163,175,0.72)`로 적용.
- 지도 위 교육 마커 색상은 유지하고, 왼쪽 교육 필터 패널에만 회색 최종 규칙을 적용.

### 검증
- `base_3.919.css` 최하단에 왼쪽 교육 필터 패널 전용 회색 최종 규칙 추가 확인.

## 2026-06-29 22:13 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 초등학교/중학교/고등학교 마커의 바깥 원, 아이콘 컨테이너, 내부 글자 라벨 크기를 어린이집 마커와 같은 `34px × 34px` 기준으로 최종 고정.
- 초/중/고 글자 라벨을 중앙 정렬하고 `line-height: 1`로 맞춰 어린이집 원형 마커와 시각적 크기 기준이 흔들리지 않도록 보정.
- 왼쪽 교육 필터 패널 크기 조정 규칙과 섞이지 않도록 지도 마커 전용 선택자로 분리 적용.

### 검증
- `base_3.919.css` 최하단에 지도 초/중/고/어린이집 마커 크기 최종 규칙 추가 확인.

## 2026-06-29 22:11 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널의 초/중/고 원형 라벨을 색상 배경에서 반투명 흰 배경(`rgba(255,255,255,0.78)`)으로 변경.
- 기존 초/중/고 카테고리 색상은 각각 글자색과 외곽선 색으로 이동.
- 외곽선은 카테고리 색상 `0.82` 알파값으로 적용해 원형 라벨 투명도와 같이 부드럽게 보이도록 조정.

### 검증
- `base_3.919.css` 최하단 초/중/고 필터 라벨 최종 규칙 추가 확인.

## 2026-06-29 22:08 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널의 초/중/고 원형 라벨을 `28px × 28px`에서 `26px × 26px`로 축소.
- 초/중/고 원형 라벨 글자 크기를 `13px`에서 `12.5px`로 소폭 축소해 원 안 균형을 맞춤.
- 어린이집/유치원/학원 필터 아이콘 컨테이너도 같은 `26px × 26px` 기준으로 맞추고, 어린이집 내부 SVG를 `17px × 17px`로 조정.

### 검증
- 교육 필터 패널 기준 초/중/고 및 어린이집/유치원/학원 아이콘 크기 규칙이 `26px`로 정리된 것 확인.

## 2026-06-29 22:07 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 유치원 지도 마커의 선택 전/선택 후 색상 상태를 서로 교환.
- 선택 전은 자주색 배경 + 흰 얼굴로, 선택 후는 흰 배경 + 자주색 얼굴로 표시되도록 SVG 원/얼굴/입 선 색상을 최종 규칙으로 고정.
- 왼쪽 교육 필터 패널의 유치원 버튼 아이콘도 같은 기준으로 선택 전/선택 후 색상을 교환.

### 검증
- `base_3.919.css` 최하단 유치원 색상 교환 규칙 추가 확인.

## 2026-06-29 22:05 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 어린이집 기본 마커의 녹색 배경 투명도를 올리기 위해 알파값을 `rgba(52,211,153,0.82)`에서 `rgba(52,211,153,0.70)`으로 조정.
- 선택 상태가 아닌 지도 어린이집 마커만 대상으로 적용해 왼쪽 교육 필터 패널 색상은 유지.

### 검증
- `base_3.919.css` 최종 어린이집 기본 마커 규칙의 알파값 변경 확인.

## 2026-06-29 22:04 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 교육 필터 패널의 원형 아이콘 컨테이너가 `28px × 25px`로 눌려 보이던 규칙을 `28px × 28px`로 정리.
- 초/중/고 원형 라벨, 어린이집/유치원/학원 아이콘 컨테이너, 필터 패널 첫 줄 높이를 모두 1:1 기준에 맞춤.
- 어린이집/유치원/학원 패널 아이콘 공통 규칙에 `aspect-ratio: 1 / 1`을 추가해 원형 비율 유지.

### 검증
- 교육 필터 패널 구간에서 남은 `height: 25px` 없음 확인.

## 2026-06-29 22:02 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 어린이집 지도 마커의 선택 전/선택 후 색상 상태를 서로 교환.
- 선택 전은 기존 선택 상태처럼 녹색 배경 + 흰 집 + 녹색 하트로 표시하고, 선택 후는 기존 선택 전 상태처럼 흰 배경 + 녹색 집 + 흰 하트로 표시.
- 교육 필터 패널의 어린이집 버튼 아이콘도 같은 기준으로 선택 전/선택 후 색상을 교환.

### 검증
- `base_3.919.css` 최하단 색상 교환 규칙 추가 확인.

## 2026-06-29 22:00 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 지도 위 어린이집 마커 선택 상태에서 집 모양은 흰색, 내부 하트는 어린이집 녹색(`#34D399`)으로 보이도록 SVG path 색상을 최종 규칙으로 고정.
- 교육 필터 패널의 어린이집 선택 아이콘도 동일하게 녹색 원 안에 흰 집/녹색 하트 구조로 맞춤.

### 검증
- `base_3.919.css` 최하단 선택 상태 규칙 추가 확인.

## 2026-06-29 21:51 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.919.js
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 왼쪽 최근 조회 목록의 제목/요약 줄에서 브라우저 기본 말줄임표(`...`)가 보이지 않도록 CSS `text-overflow`를 `clip`으로 변경.
- 최근 조회 렌더링 후 실제 표시 폭을 기준으로 텍스트를 다시 맞추는 `fitSideRecentListText` 계열 함수를 추가해, `평대리 비자...`처럼 단어 중간에서 끊기는 표시를 가능한 한 마지막 단어 단위로 정리.
- 최근 조회 항목에 원문 텍스트를 `data-recent-full-text`로 보관해 창 크기 변경 시에도 다시 계산되도록 보정.

### 검증
- `app_3.919.js`를 JS 파서로 문법 확인 완료.

## 2026-06-29 21:48 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.919.js

### 수정 내용
- 왼쪽 최근 조회 목록 제목/요약 문자열에서 마침표 3개(`...`) 및 동작형 생략 표기(`…`)가 뒤에 붙은 경우, 표시할 때 해당 부분을 잘라내어 `글...` 같은 형태를 `글`로 정리.
- 최근 조회 목록 렌더링 시 title/요약 데이터 정규화 경로에 `trimRecentListEllipsisText`를 추가해 동일 규칙 적용.

## 2026-06-29 21:44 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css
- /Users/GHOST/Downloads/js/app_3.919.js

### 수정 내용
- 왼쪽 사이드 메뉴 기준 폭을 `--realjeju-side-nav-width` 기준 `168px`에서 `170px`로 확장.
- 관련 보조 계산식 폴백 값(`var(--realjeju-side-nav-width, ...)`, `fallbackNavWidth`)도 함께 `170`으로 맞춰 일관성 유지.

## 2026-06-29 19:30 KST / Version 3.919

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.919.html`
- `/Users/GHOST/Downloads/css/base_3.919.css`
- `/Users/GHOST/Downloads/js/app_3.919.js`
- `/Users/GHOST/Downloads/REALJEJU_CHANGELOG.md`

### 수정 내용
- 교육 패널(초등학교/어린이집/중학교/유치원/고등학교/학원) 버튼을 교육 패널 전용 규칙으로 정리해, 선택 전에는 회색 계열, 선택 시 카테고리 컬러(초록/파랑/보라/초록/핑크/보라)로 바뀌게 변경.
- 교육 패널 6개 아이콘 영역 크기를 `28×25` 기준으로 통일해 지도 아이콘 대비 균형 맞춤.
- 유치원, 어린이집, 학원 버튼도 교육 패널에서 동일한 배경/선택 시 컬러 처리되도록 보정해 지도 위 가시성 저해를 줄임.

### 검증
- `REALJEJU_CHANGELOG.md` 최신 항목 추가 확인.
- `base_3.919.css`, `app_3.919.js`, `realjeju_3.919.html`은 동일 버전(3.919) 기준으로 동기화 확인.

## 2026-06-29 19:26 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 교육 패널(초등학교/유치원/중학교/어린이집/고등학교/학원) 버튼의 기본 상태를 회색 계열로 정리하고, 선택 시 카테고리 컬러(초-연두/중-파랑/고-보라/어린이집-초록/유치원-주황/학원-보라)로 변하도록 스타일을 정리했다.
- 교육 패널 버튼의 유치원/어린이집/학원 아이콘 영역 크기를 `28×25` 기준으로 통일하고, 비선택 상태의 색상을 무채색으로 맞춰 지도에서 덜 거슬리게 만들었다.
- 기존 색상 규칙이 겹치던 라인업을 교육 패널 전용 규칙으로 우선 정렬해, 교육 패널만 일관된 동작을 보이도록 했다.

### 검증
- 파일 수정은 `work/base_3.919.css` 경로에 우선 반영되어 있으며, `Downloads` 권한 제약으로 최종 반영은 사용자의 수동 동기화가 필요합니다.

## 2026-06-29 23:02 KST / Version 3.919

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.919.html
- /Users/GHOST/Downloads/js/app_3.919.js
- /Users/GHOST/Downloads/css/base_3.919.css

### 수정 내용
- 상단 필터 드롭다운(버튼 토글/선택) 시 우측 교육/편의/개발/중개사 패널이 닫히도록 연동을 추가했다.
- 상단 드롭다운 상호작용에서 우측 패널 오픈 상태가 남는 이슈를 방지하기 위해 공통 종료 경로를 추가했다.
- 버전 업그레이드를 위해 `APP_VERSION`, 상단/하단 표시 버전, 리소스/다운로드 링크 쿼리를 `3.919`로 정리했다.

### 검증
- app_3.919.js 문법 검사: Node 실행기 미설치 상태로 미확인(로컬 JS 런타임 확인 필요).

## 2026-06-29 17:50 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 어린이집 기본 지도 마커를 `흰색 바탕 + 두꺼운 초록 외곽선`으로 조정했다.
- 어린이집 집+하트 아이콘을 기존보다 조금 키워 `24px`로 조정했다.
- 유치원 기본 지도 마커가 어린이집과 같은 `34px` 외형 기준으로 보이도록 유지했다.
- 유치원 기본 상태는 `흰색 바탕 + 자주색 외곽선/얼굴` 조합으로 정리했다.
- 학원 기본 지도 마커를 유치원과 같은 선 두께의 `흰색 바탕 + 보라색 외곽선/아이콘`으로 맞췄다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:47 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 교육 필터 패널에서 선택된 카테고리 버튼 외곽선이 두껍게 보이던 내부 강조선을 제거했다.
- 교육 필터 패널 선택 버튼 외곽선은 `1px` 단일 선으로 보이도록 조정했다.
- 지도 위 선택된 교육 마커의 외곽선 두께를 `1.5px`로 낮췄다.
- 유치원 선택 마커의 SVG 외곽선도 `1.5px`로 낮춰 다른 교육 마커와 두께를 맞췄다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:45 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 학원 지도 마커의 선택 안 된 기본 상태를 `흰색 바탕 + 보라색 아이콘/외곽선`으로 변경했다.
- 학원 지도 마커의 선택 상태는 반전되어 `보라색 바탕 + 흰색 아이콘`으로 보이도록 조정했다.
- 학원 지도 마커의 크기와 아이콘 크기는 기존 `34px` 기준을 유지했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:42 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 교육 지도 마커 원 크기를 `36px`에서 `34px`로 소폭 줄였다.
- 초등학교/중학교/고등학교/어린이집/유치원/학원 마커가 선택 전/선택 후 모두 같은 `34px` 박스 크기를 유지하도록 했다.
- 유치원 SVG의 외곽 원 반지름을 줄여 선택 시 두꺼운 선이 바깥으로 튀며 커져 보이는 문제를 완화했다.
- 초중고 원 내부 글자 크기도 `14px`로 함께 낮춰 줄어든 원 크기에 맞췄다.
- 어린이집 집+하트 및 학원 아이콘 크기도 줄어든 원 크기에 맞춰 각각 보정했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:37 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 어린이집 지도 마커를 `집 + 하트` 형태의 커스텀 SVG 아이콘으로 변경했다.
- 교육 필터 패널의 어린이집 버튼 아이콘도 지도와 같은 `집 + 하트` SVG로 맞췄다.
- 어린이집/유치원/학원 지도 마커가 초등학교/중학교/고등학교 원과 같은 `36px` 기준으로 유지되도록 최종 스타일을 보강했다.
- 교육 필터 패널 안의 어린이집/유치원/학원 아이콘도 초중고 버튼 원과 같은 `25px` 기준으로 맞췄다.
- 어린이집 선택 전/선택 후 상태에서 집과 하트가 겹쳐 사라지지 않도록 SVG 내부 색상을 분리했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:30 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 오른쪽 교육 버튼 옆에 뜨는 교육 필터 패널의 카테고리 버튼 외곽선을 지도 마커 색상과 맞췄다.
- 초등학교/중학교/고등학교 버튼 외곽선을 각각 `#10B981`, `#0EA5E9`, `#6366F1` 계열로 조정했다.
- 어린이집/유치원/학원 버튼 외곽선을 각각 `#34D399`, `#DB2777`, `#7C3AED` 계열로 조정했다.
- 선택 전 버튼 외곽선은 반투명 색상으로, 선택된 버튼 외곽선은 선명한 색상과 내부 1px 강조선으로 보이게 했다.
- 편의/개발/중개 패널에는 영향을 주지 않도록 교육 필터 패널에만 적용했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:28 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 어린이집/유치원/학원 지도 마커의 기본 원 크기를 `36px`로 동일하게 유지했다.
- 선택되지 않은 어린이집/학원 마커의 흰 외곽선을 `1px`로 얇게 낮췄다.
- 선택되지 않은 유치원 마커의 SVG 원 외곽선도 `1px`로 낮췄다.
- 선택되지 않은 어린이집/유치원/학원 마커 배경을 `0.78` 투명도 계열로 조정했다.
- 선택된 상태의 색상 반전 및 두꺼운 외곽선은 기존대로 유지했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:24 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 학원/교습소 마커의 100개 제한 및 격자 샘플링 로직을 제거하고, 현재 지도 범위 안의 선택된 교육 시설 마커가 모두 표시되도록 복구했다.
- 초등학교/중학교/고등학교/어린이집/유치원/학원 지도 마커 크기를 중개사 원형 마커와 같은 `36px` 기준으로 맞췄다.
- 학원 마커 색상을 `#7C3AED` 배경 + 흰 아이콘으로 변경했다.
- 유치원 마커 색상을 `#DB2777` 계열로 변경하고 흰색 얼굴 표시가 유지되도록 했다.
- 교육 시설 마커 클릭 시 선택된 원만 색상 반전 상태가 되도록 `selected` 클래스를 동기화했다.
- 상세 패널을 닫으면 선택된 교육 시설 마커 반전 상태도 해제되도록 했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 17:12 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 오른쪽 지도 도구의 편의/교육/개발/중개/지도 팝업이 화면 바깥 클릭으로 닫히던 전역 click 핸들러를 제거했다.
- 상단 필터 드롭다운 클릭 시 오른쪽 지도 도구 팝업을 강제로 닫던 보조 핸들러도 제거했다.
- 오른쪽 도구 팝업은 해당 도구 버튼을 다시 클릭하거나 다른 오른쪽 도구를 여는 경우에만 닫히도록 정리했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 17:07 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 학원/교습소가 현재 지도 화면에서 100개를 초과할 때 전부 숨기던 방식을 격자 샘플링 방식으로 변경했다.
- 현재 지도 화면을 10x5 격자로 나누고, 각 칸에서 최대 2개씩 안정적으로 골라 전체 최대 100개까지만 표시하도록 했다.
- 샘플링은 랜덤이 아니라 `id/구분/이름/주소/좌표` 기준 정렬을 사용해 같은 화면에서는 같은 마커가 보이도록 했다.
- 교육 필터 패널 하단 안내를 `학원/교습소 n개 중 m개 표시 · 확대하면 더 표시` 형식으로 변경했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 16:57 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 교육 시설 중 `학원/교습소` 마커가 현재 지도 화면 안에서 100개를 초과하면 해당 카테고리 마커를 렌더링하지 않도록 제한했다.
- 100개 이하로 줄어드는 확대 상태에서는 기존처럼 학원/교습소 마커가 다시 표시되도록 했다.
- 학원/교습소가 숨겨진 상태에서는 교육 필터 패널 하단에 `학원/교습소 n개 · 확대하면 표시` 안내가 나오도록 했다.
- 초등학교/중학교/고등학교/어린이집/유치원 등 다른 교육 시설 카테고리는 기존 렌더링 흐름을 유지했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 16:49 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개 필터 패널의 구분선을 제거하고 `중개사 전용` 텍스트 라벨로 교체했다.
- `중개사 전용` 라벨은 `내 매물만/우리 사무소 매물` 옵션이 표시되는 경우에만 나오도록 했다.
- 라벨 스타일은 `11px`, `font-weight: 800`, `#64748B`, 상단 여백 `16px`, 하단 여백 `8px`로 적용했다.
- 라벨 정렬은 가운데 정렬로 적용했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 16:38 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 중개사 홈에서 기존 매물을 수정 완료할 때 같은 매물의 `listing_no`를 중복 매물번호로 오인할 수 있던 문제를 보정했다.
- 수정 폼 진입 시 기존 `listingId`와 별도로 `editListingId`를 보관해 저장 직전 수정 대상 매물 ID를 안정적으로 확인하도록 했다.
- 저장 시 `listingId`가 일시적으로 비어도 `editListingId`를 사용해 insert가 아니라 update 경로로 처리하도록 했다.
- 매물번호 중복 검사에서 현재 수정 중인 매물 ID는 제외하고, 실제 다른 매물과 중복될 때만 중복 안내가 뜨도록 했다.
- DB unique constraint에서 매물번호 중복 오류가 직접 올라오는 경우에도 `매물 수정/매물 등록` 상황에 맞는 안내 문구를 띄우도록 했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 16:32 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개 필터 패널 구분선이 두껍게 보이던 것을 완화했다.
- 구분선은 `scaleY(0.5)`를 적용해 더 얇게 보이도록 조정했다.
- 구분선 색상은 `rgba(15, 23, 42, 0.07)`로 더 옅게 낮췄다.
- 구분선 상하 여백은 요청대로 `16px`로 조정했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 16:29 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개 필터 패널에서 `전체/전문 중개사` 필터 묶음과 `내 매물만/우리 사무소 매물` 필터 묶음을 분리했다.
- `내 매물만/우리 사무소 매물` 옵션이 표시되는 경우에만 두 묶음 사이에 얇은 구분선을 넣도록 했다.
- 구분선은 `1px`, `rgba(15, 23, 42, 0.10)`, 상하 여백 `10px`로 적용했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 16:22 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 전문 중개사 원형 뱃지의 그라디언트/스펙트럼 링 적용을 제거했다.
- 전문 필터 상태에서 마커에 붙이던 `is-specialty` 클래스를 제거했다.
- 전문/일반 중개사 마커 모두 기존 흰색 외곽선 스타일을 동일하게 사용하도록 되돌렸다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.
- `is-specialty`, 전문 그라디언트 링 잔여 규칙 없음 확인.

## 2026-06-29 16:19 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 전문 중개사 원형 뱃지 그라디언트 링 색이 너무 진하게 보이던 것을 완화했다.
- 링 색을 원색 계열에서 알파가 들어간 파스텔 블루/시안/그린 계열로 낮췄다.
- 링 그림자도 `0 2px 7px rgba(15,41,66,0.26)`에서 `0 2px 5px rgba(15,41,66,0.20)`로 줄였다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 16:16 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 전문 중개사 지도 마커에 별도 글자나 콜아웃을 추가하지 않고 원형 뱃지 링 색만 적용했다.
- 아파트/오피스텔/토지/상가/원룸·투룸 전문 필터가 선택된 상태에서 표시되는 중개사 마커에만 `is-specialty` 클래스를 붙이도록 했다.
- 전문 중개사 원형 링은 기존 흰 선 대신 파랑-시안-초록 계열의 얇은 conic-gradient 링으로 표시하도록 했다.
- 프로필 사진과 `매물 N` 라벨은 기존 구조를 그대로 유지했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 16:09 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/sql/broker_specialty_stats_3.918.sql

### 수정 내용
- 토지 전문/원룸·투룸 전문 필터가 모두 0개로 사라질 수 있던 전문 통계 판정 로직을 수정했다.
- 프론트가 DB boolean 값만 믿고 잘라내지 않고, 저장된 `*_count`, `*_ratio` 값으로도 전문 여부를 다시 판정하도록 했다.
- DB 통계 row가 특정 중개사 위치 row와 매칭되지 않을 때 화면이 전부 비는 것을 막기 위해 기존 매물 캐시 기준 보조 계산을 유지하도록 했다.
- 전문 필터 버튼 클릭 시 이전 빈 통계 캐시를 재사용하지 않고 `broker_specialty_stats`를 강제로 다시 조회하도록 했다.
- SQL refresh 함수가 `property_listings.agency_id` 기준으로 `agencies.office_name`, `agencies.user_id`를 보강해 통계 row와 중개사 위치 row가 더 잘 붙도록 했다.
- 토지 전문 후보 확인용 SQL 조회 구문을 추가했다.

### 운영 방법
- Supabase SQL Editor에서 `/Users/GHOST/Downloads/sql/broker_specialty_stats_3.918.sql`을 다시 실행하거나 아래 쿼리를 실행한다.
  - `select public.refresh_broker_specialty_stats();`
- 실행 후 전문 필터 버튼을 다시 누르면 통계를 강제 재조회한다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 16:05 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/sql/broker_specialty_stats_3.918.sql

### 수정 내용
- `원룸/투룸 전문` 필터가 중개사 통계 row를 못 찾을 수 있던 매칭 우선순위를 수정했다.
- 중개사 위치 row의 `id`를 `agency_id`처럼 사용하지 않도록 정리했다.
- 전문 통계 조회 키 순서를 `agency_id → 사무소명 → user_id`로 변경해 같은 계정/위치 row에서도 사무소명 기준 통계가 먼저 매칭되도록 했다.
- 원룸/투룸 전문 통계 확인용 SQL 조회 구문을 `broker_specialty_stats_3.918.sql` 끝에 추가했다.

### 운영 방법
- SQL 반영 후 아래 쿼리를 다시 실행해야 최신 원룸/투룸 전문 통계가 화면에 반영된다.
  - `select public.refresh_broker_specialty_stats();`

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check

## 2026-06-29 16:00 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/sql/broker_specialty_stats_3.918.sql
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 중개사 전문 필터용 DB 통계 테이블 `public.broker_specialty_stats` 생성 SQL을 추가했다.
- `public.refresh_broker_specialty_stats()` 함수를 추가해 아파트/오피스텔/토지/상가/원룸·투룸 전문 매물 수와 비율을 SQL에서 재계산하도록 했다.
- 첫 SQL 실행 시 통계 테이블 생성, 인덱스 생성, 초기 refresh까지 한 번에 수행되도록 했다.
- 프론트의 중개사 전문 지도 필터가 전체 매물 `state.all`을 매번 훑는 대신 `broker_specialty_stats` 저장값을 조회해 사용하도록 변경했다.
- 중개사 지도 마커의 매물 수 표시도 DB 통계 캐시값을 우선 사용하도록 연결했다.
- 전문 필터 패널 하단 안내 문구를 `DB 통계 기준 60% 이상 · 최소 3건`으로 변경했다.
- 현재 사용 가능성이 있는 3.917 파일에도 동일한 프론트 보정을 반영했다.

### 운영 방법
- Supabase SQL Editor에서 `/Users/GHOST/Downloads/sql/broker_specialty_stats_3.918.sql`을 1회 실행한다.
- 이후 일주일에 한 번 또는 매물 데이터가 많이 바뀐 뒤 아래 쿼리만 실행하면 통계가 갱신된다.
  - `select public.refresh_broker_specialty_stats();`

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- `broker_specialty_stats` 조회 연결 및 패널 문구 변경 위치 확인.

## 2026-06-29 15:44 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 중개사 지도 뱃지를 클릭했을 때 왼쪽 매물 목록이 현재 지도 위치나 화면 범위에 영향을 받지 않도록 수정했다.
- 중개사 매물 목록 소스를 `state.filtered` 우선이 아니라 전체 매물 캐시 `state.all` 기준으로 변경했다.
- 같은 중개사 매물은 지도 viewport 밖에 있어도 왼쪽 목록에 모두 표시되도록 했다.
- 현재 사용 중인 3.917 파일에도 동일한 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:43 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.918.html
- /Users/GHOST/Downloads/js/app_3.918.js
- /Users/GHOST/Downloads/css/base_3.918.css
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 3.917 세트를 3.918 파일 세트로 복사하고, 3.918 HTML의 CSS/JS 참조와 상단/하단 버전 표기를 `Ver 3.918`로 갱신했다.
- `APP_VERSION`을 3.918로 갱신했다.
- 중개사 지도 마커 클릭 시 왼쪽 매물 목록 필터가 사무소명을 너무 엄격하게 비교해 0건으로 나오던 문제를 수정했다.
- 왼쪽 중개사 매물 목록 필터도 지도 마커 매물 수 계산과 같은 느슨한 사무소명 매칭을 사용하도록 했다.
- 중개사 지도 마커에는 프로필 사진이 보이는데 왼쪽 중개사 카드에는 안 보이던 문제를 수정해, 같은 프로필 이미지 fallback을 사용하도록 했다.
- 현재 사용 중인 3.917 파일에도 동일한 매칭/프로필 카드 보정을 반영했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- app_3.918.js 문법 검사 통과: bundled node --check
- realjeju_3.918.html의 CSS/JS 참조, 상단/하단 `Ver 3.918`, `APP_VERSION = "3.918"` 확인.
- base_3.917.css 및 base_3.918.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:39 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 같은 주소의 중개사무소 지도 마커를 하나로 합쳐 tooltip 목록으로 보여주던 방식을 제거했다.
- 같은 주소/좌표에 여러 중개사무소가 있으면 각 중개사무소를 개별 마커로 만들고, 가로 오프셋을 줘 바로 옆에 나란히 보이도록 했다.
- 중개사 마커에 `--broker-office-marker-offset-x` CSS 변수를 추가해 좌표는 유지하면서 화면 표시 위치만 벌어지게 했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:36 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개사 지도 원 아래 `매물 N` 라벨의 font-weight를 800에서 700으로 낮췄다.

### 검증
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:35 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개사 지도 프로필/아이콘 원 크기를 32px에서 36px로 키웠다.
- 사진이 없는 중개사 아이콘 폰트 크기도 14px에서 15px로 맞췄다.
- 원 아래 `매물 N` 라벨은 기존 상태를 유지했다.

### 검증
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:33 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개사 지도 프로필/아이콘 원 크기를 28px에서 32px로 살짝 키웠다.
- 중개사 원 외곽선을 파란색에서 흰색 `3px`로 변경했다.
- 프로필 사진이 없는 아이콘 상태에서도 흰 외곽선이 보이도록 원 배경을 파란색, 아이콘을 흰색으로 조정했다.
- 원 아래 `매물 N` 라벨은 기존 상태를 유지했다.

### 검증
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:32 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개사 지도 프로필/아이콘 원 크기를 초중고 지도 원과 같은 28px로 조정했다.
- 중개사 원 외곽선을 `3px solid #2563EB`로 적용했다.
- 원 아래 `매물 N` 라벨 크기와 위치는 유지했다.

### 검증
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:30 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- Supabase `agencies.email` 컬럼이 없는 환경에서 중개사무소 이메일 조회가 400 에러를 내던 문제를 막았다.
- 사이드 계정/중개사무소 조회는 스키마 의존 컬럼 목록 대신 `select("*")`와 `user_id` 기준 조회만 사용하도록 정리했다.
- 중개사 지도 프로필 사진 보강 조회에서 `profiles.avatar_url` 컬럼 선택을 제거하고 `profiles.profile_image`만 조회하도록 변경했다.
- 프로필 사진은 DB 프로필 조회가 실패해도 매물 데이터 안의 `agentImage` fallback으로 계속 표시되도록 유지했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- `agencies.email` ilike 조회와 `profiles.avatar_url` select 패턴 제거 확인.
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:29 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 중개사 지도 프로필 사진이 `broker_office_locations`/`profiles` 경로에 없을 때도 보이도록, 해당 중개사의 매물 데이터 안에 있는 `agentImage`, `agent_image`, `registrant.profile_image`를 fallback으로 사용하게 했다.
- 카카오 지도 커스텀 오버레이 안에서 프로필 사진이 늦게 로드되지 않도록 마커 이미지의 `loading="lazy"`를 제거했다.
- 프로필 사진 URL은 기존 매물 이미지 처리와 같은 `toRemotePath` 경로 보정을 거치도록 했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:24 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 중개사 지도 프로필 원형 뱃지의 외부 파란 링이 원 바깥으로 커지지 않도록 안쪽 링으로 변경했다.
- 원형 프로필/아이콘의 실제 표시 지름은 매물 1개 뱃지와 같은 40px 기준으로 유지했다.
- 하단 `매물 N` 라벨은 기존 크기와 위치를 유지했다.

### 검증
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:21 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 부동산 홈 중개사 지도 마커를 매물 1개 숫자 뱃지와 같은 40px 원형 크기로 키웠다.
- 중개사무소가 1곳이고 프로필 사진이 있으면 원형 프로필 사진으로 표시하도록 했다.
- 프로필 사진이 없거나 같은 주소에 여러 중개사무소가 묶인 경우에는 기존 중개사 아이콘을 유지하도록 했다.
- 중개사 마커 아래에 해당 중개사무소의 매물 수를 `매물 N` 라벨로 표시하도록 했다.
- 중개사 지도 데이터에 프로필 사진이 없으면 `profiles.profile_image`를 user_id 기준으로 보강해서 표시하도록 했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- base_3.917.css 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 15:08 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 부동산 홈 상단 필터 버튼의 font-weight 규칙을 정리했다.
- 앞쪽 중간 CSS에 남아 있던 상단/필터 active 계열 `830` 웨이트를 `810` 기준으로 맞췄다.
- 지목 필터에 따로 떨어져 있던 중간 `810 !important` 규칙을 제거하고, 마지막 `PATCH 3.917: final top filter font weights` 블록 안으로 합쳤다.
- 흰색/열림 상태 필터는 공통 subbar 웨이트를 쓰고, 닫힌 검정 선택 필터만 `810 !important`를 쓰도록 주석과 최종 규칙을 정리했다.
- 오래된 상단 필터 웨이트 실험 규칙이 최종 규칙 뒤에서 다시 덮이지 않도록 중복 규칙을 정리했다.

### 검증
- `font-weight: 830`은 폰트 파일 등록용 `@font-face` 값만 남은 것 확인.
- `font-weight: 860` 및 오래된 `PATCH 3.819 LEGACY` 상단 필터 웨이트 규칙이 남아 있지 않은 것 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 12:02 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 모바일 관리자 페이지의 `중개사무소 가입 신청` 목록에서 중개사 정보와 승인/대기/거부/삭제 버튼이 화면 오른쪽 밖으로 밀려 보이지 않던 문제를 수정했다.
- 기존 모바일 보정 규칙이 뒤쪽 기본 카드 grid 규칙에 덮이던 문제를 피하기 위해 후순위 `body.admin-page-open` 모바일 규칙을 추가했다.
- 모바일에서는 신청 카드가 1열로 접히고, 상태/등록일과 액션 버튼줄이 카드 내부에서 보이도록 조정했다.
- 승인/대기/거부/삭제 버튼은 모바일에서 4칸 그리드로 균등 배치되도록 했다.

### 검증
- base_3.917.css에서 후순위 모바일 규칙 적용 위치 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:52 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 부동산 홈 지도 매물 숫자 뱃지의 기본 배경 alpha 값을 0.74에서 0.80으로 올렸다.
- 선택 상태 alpha 0.78은 기존 요청값대로 유지했다.

### 검증
- app_3.917.js에서 BADGE_BASE_ALPHA = 0.80 적용 확인.
- app_3.917.js 문법 검사 통과: bundled node --check

## 2026-06-29 11:50 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 부동산 홈 지도 매물 숫자 뱃지의 기본 배경 alpha 값을 0.70에서 0.74로 소폭 올렸다.
- 선택 상태 alpha 0.78은 유지해 일반/선택 상태의 차이는 그대로 남겼다.

### 검증
- app_3.917.js에서 BADGE_BASE_ALPHA = 0.74 적용 확인.
- app_3.917.js 문법 검사 통과: bundled node --check

## 2026-06-29 11:47 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 지도 영역 유치원 마커에서 내부 초록 원과 외곽 링 사이에 틈이 보이던 문제를 수정했다.
- 유치원 SVG 원의 반지름을 r=13에서 r=14로 키워 28px 컨테이너 끝까지 채우도록 했다.
- 유치원 SVG와 marker 컨테이너를 28px block으로 고정하고 overflow visible을 적용해 외곽 링과 내부 원이 붙어 보이도록 보정했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- base_3.917.css 중괄호 균형 검사 결과 0 확인.
- 유치원 SVG circle이 r="14"로 변경된 것 확인.

## 2026-06-29 11:43 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 지도 영역 학원 마커를 색면 배지에서 흰 바탕 + 틸(#14B8A6) 아이콘 방식으로 반전했다.
- 학원 마커 외곽은 흰색 링 대신 틸 1px 링과 흰색 보조 링을 함께 사용해 배경과 구분되도록 했다.
- 파일 뒤쪽 후순위 교육 마커 그림자 규칙도 같은 기준으로 정리해 학원 반전 스타일이 최종 적용되도록 했다.

### 검증
- base_3.917.css에서 academy 지도 마커 최종 규칙이 background #ffffff, color #14B8A6, 틸 링 box-shadow를 적용하는 것 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:39 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 지도 영역의 교육 마커 6종(초등학교/중학교/고등학교/어린이집/유치원/학원) 원형 배지 외곽에 매물 숫자 뱃지와 비슷한 얇은 흰색 링을 추가했다.
- 실제 border 대신 box-shadow `0 0 0 0.5px rgba(255,255,255,0.96)`를 사용해 레이아웃 크기 변화 없이 경계만 살렸다.
- 같은 규칙에서 28px 원형 크기와 약한 그림자 `0 2px 5px rgba(15, 23, 42, 0.18)`를 통일했다.

### 검증
- base_3.917.css에서 교육 지도 마커 6종에 흰색 0.5px 링 적용 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:35 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 교육 필터 패널에서 초등학교/중학교/고등학교 선택 버튼의 외곽선을 각 원형 배지 색상에 맞췄다.
- 초등학교 버튼 외곽선은 #10B981, 중학교는 #0EA5E9, 고등학교는 #6366F1로 적용했다.
- active 상태에서 초/중/고 원 안의 글자가 다른 색으로 덮이지 않고 흰색으로 유지되도록 우선순위를 보강했다.

### 검증
- base_3.917.css에서 elementary/middle/high active 버튼 border-color 적용 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:31 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 교육 시설 초등학교/중학교/고등학교 지도 마커에서 학교 아이콘을 숨기고, 어린이집과 같은 28px 원형 배지 안에 `초`/`중`/`고` 글자만 표시되도록 변경했다.
- 초등학교 #10B981, 중학교 #0EA5E9, 고등학교 #6366F1 색상은 유지했다.
- 교육 필터 패널 안의 초등학교/중학교/고등학교 아이콘도 학교 아이콘 대신 원형 글자 배지로 정리했다.

### 검증
- base_3.917.css에서 elementary/middle/high 카테고리의 학교 아이콘 i가 display:none 처리되는 것 확인.
- 지도 마커 라벨이 28px 원형 글자 배지로 표시되도록 최종 오버라이드 적용 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:27 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 부동산 홈 지도 클러스터 뱃지가 100개 이상일 때 `99+`로 표시되던 제한을 제거했다.
- 클러스터 뱃지 라벨을 실제 매물 개수 전체 숫자(String(count))로 표시하도록 변경했다.
- 4자리 이상 숫자도 잘리지 않도록 getBadgeConfig()에서 글자 수에 따라 뱃지 크기와 폰트 크기를 조정하도록 보완했다.

### 검증
- app_3.917.js에서 `99+` 문자열 제거 확인.
- app_3.917.js 문법 검사 통과: bundled node --check

## 2026-06-29 11:23 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 교육 시설 초등학교/중학교/고등학교 지도 마커 색상을 각각 초등학교 #10B981, 중학교 #0EA5E9, 고등학교 #6366F1로 분리했다.
- 교육 필터 패널의 초등학교/중학교/고등학교 active 아이콘 색상도 지도 마커와 같은 색상으로 맞췄다.
- 학교 마커 내부 글자 라벨 배경도 각 학교급 색상에 맞춰 적용했다.

### 검증
- base_3.917.css에서 elementary/middle/high 카테고리별 색상 규칙 적용 확인.
- CSS 중괄호 균형 검사 결과 0 확인.

## 2026-06-29 11:18 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 부동산 홈 숫자 클러스터 뱃지를 선택한 뒤 지도를 확대해 선택 클러스터가 여러 하위 클러스터로 쪼개질 때, 하위 클러스터 3개가 모두 선택 표시되던 문제를 수정했다.
- 선택한 클러스터의 중심 위치를 selectedClusterAnchor로 저장하고, 줌 후에는 잠금 목록에 포함된 하위 클러스터 중 대표 1개만 선택 외곽선으로 표시하도록 했다.
- 왼쪽 매물 목록 잠금은 기존처럼 선택한 전체 매물 목록을 유지하되, 지도 뱃지의 선택 시각 표시만 하나로 제한했다.
- 단일 매물 선택/최근조회 등 기존 selectedMarkerIds 기반 선택 표시는 기존 동작을 유지하도록 클러스터 선택 모드와 분리했다.

### 검증
- app_3.917.js 문법 검사 통과: bundled node --check
- refreshClusterBadges()에서 selectionMode === "cluster"일 때 selectedClusterKey 또는 대표 descendantClusterKey 한 개만 selected 처리하는 것 확인.
- 선택 목록 유지용 lockedListIds와 지도 선택 외곽선 표시 로직이 분리된 것 확인.

## 2026-06-29 11:07 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 어린이집/유치원/학원 지도 마커의 외곽선 느낌을 줄이기 위해 흰색 테두리와 어두운 outline성 drop-shadow를 제거했다.
- 어린이집 마커 색상을 핑크 계열에서 산뜻한 민트 그린(#34D399)으로 변경했다.
- 유치원 마커 색상을 그린(#22C55E)으로 정리했다.
- 학원 마커 색상을 회갈색 계열에서 틸(#14B8A6)로 변경했다.
- 마커 구분감은 선 대신 약한 그림자(drop-shadow 0 2px 5px rgba(15, 23, 42, 0.18))로 처리했다.
- 교육 필터 패널의 어린이집/유치원/학원 active 색상도 같은 팔레트로 맞췄다.

### 검증
- base_3.917.css에서 기존 핑크/회갈색 마커 색상(#f48fa4, #f2a3b3, #8a7d78, #8d7f7b) 제거 확인.
- 어린이집 #34D399, 유치원 #22C55E, 학원 #14B8A6 적용 확인.
- CSS 중괄호 균형 검사 결과 0 확인.
- app_3.917.js 문법 검사 통과: node --check

## 2026-06-29 10:58 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 왼쪽 매물 목록에서 면적이 잘못 표시되는 문제를 수정했다.
- 목록 카드 면적 파싱 시 '전용면적 9평'처럼 이미 평 단위로 표시된 값을 9㎡로 오해해 2.7평으로 재변환하던 단위 처리 오류를 고쳤다.
- parseDetachedHouseAreas(), parseApartmentAreas(), findCardLabeledAreaValue()가 ㎡/평 단위를 인식해 내부 기준 m²로 정규화하도록 보완했다.
- 중개사 매물 목록 정렬/재렌더링 시 기존 area raw 캐시가 최신 item.area보다 우선되어 예전 면적이 남는 문제를 막기 위해 현재 item.area를 우선하고 상세 fetch 시 캐시를 최신값으로 갱신하도록 수정했다.

### 검증
- app_3.917.js 문법 검사 통과: node --check
- '계약면적10평ㆍ전용면적9평' 테스트에서 왼쪽 목록 표시값이 2.7평이 아니라 9평으로 계산되는 것 확인.
- getLeftListAreaDisplayRaw()가 현재 item.area를 캐시보다 우선하도록 적용 확인.

## 2026-06-29 02:44 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 매물 등록 화면에서 부동산 홈으로 돌아온 뒤 왼쪽 하단 관리자 페이지 메뉴가 사라지는 문제를 추가 보완했다.
- 사이드 메뉴 가시성 동기화 단계에서 같은 로그인 사용자에게 이미 보이던 관리자 메뉴 상태를 기억하도록 sideNavKnownAdminUserId와 hasVisibleSideNavAction() 로직을 추가했다.
- 관리자 권한 정보가 일시적으로 비어 들어와도, 같은 사용자이며 관리자 메뉴가 이미 보이던 상태라면 hidden 처리하지 않도록 했다.

### 검증
- syncSideNavVisibility()에서 adminWasVisible 및 sideNavKnownAdminUserId 기준 보존 로직 확인.
- app_3.917.js 문법 검사 통과: node --check

## 2026-06-29 02:42 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css
- /Users/GHOST/Downloads/js/app_3.917.js

### 수정 내용
- 왼쪽 사이드 일반 메뉴(부동산 홈/관심 부동산/분양/중개사 홈/관리자 페이지/공지사항)의 hover 상태 font-weight를 820으로 조정했다.
- 매물 등록 버튼도 별도 클래스(.realjeju-side-register-btn)에 hover/active/is-open font-weight 820 규칙을 추가해 일반 메뉴와 맞췄다.
- 같은 로그인 사용자에서 세션/프로필이 재동기화될 때 기존 관리자 플래그가 일시적으로 false로 덮여 관리자 페이지 메뉴가 숨겨지지 않도록 setRealjejuActiveSession()에서 관리자 플래그 보존 로직을 추가했다.

### 검증
- .realjeju-side-nav-item:hover/.active/.is-open에 font-weight 820 적용 확인.
- .realjeju-side-register-btn:hover/.active/.is-open에 font-weight 820 적용 확인.
- app_3.917.js 문법 검사 통과: node --check
- setRealjejuActiveSession()에서 canPreserveAdminFlag 및 resolvedIsAdmin 병합 로직 확인.

## 2026-06-29 02:36 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 왼쪽 사이드의 매물 등록 버튼이 별도 클래스(.realjeju-side-register-btn)를 사용해 메뉴 폰트 조정이 적용되지 않던 부분을 맞췄다.
- 매물 등록 버튼 글자 크기를 15px에서 14.5px로, 굵기를 760에서 680으로 조정했다.
- 부동산 홈/관심 부동산/분양/중개사 홈 메뉴와 매물 등록 버튼의 폰트 크기/굵기를 통일했다.

### 검증
- .realjeju-side-nav-item의 font-size 14.5px, font-weight 680 유지 확인.
- .realjeju-side-register-btn의 font-size 14.5px, font-weight 680 적용 확인.

## 2026-06-29 02:31 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 왼쪽 사이드 메뉴(부동산 홈/관심 부동산/분양/중개사 홈)의 글자 크기를 14px에서 14.5px로 조정했다.
- 글자 굵기 680은 유지했다.

### 검증
- .realjeju-side-nav-item의 font-size가 14.5px, font-weight가 680으로 적용된 것 확인.

## 2026-06-29 02:18 KST / Version 3.918

### 수정 파일
- /Users/GHOST/Downloads/sql/site_visit_counter_3.918.sql

### 수정 내용
- 상단 버전 표시의 접속자 숫자가 누적값이 아니라 KST(Asia/Seoul) 날짜 기준 일일 카운트로 동작하도록 record_site_visit() RPC를 교체하는 SQL을 추가했다.
- site_visit_daily_ip_counts 테이블을 추가해 날짜 + IP 해시 기준으로 오늘의 고유 IP 수를 계산하도록 했다.
- site_visit_daily_totals 테이블을 추가해 날짜별 총 접속 횟수를 계산하도록 했다.
- 기존 site_visit_ip_counts/site_visit_totals 누적 테이블은 건드리지 않고, 새 daily 테이블만 사용하도록 구성했다.
- 24:00 KST가 지나면 visit_date가 새 날짜로 바뀌어 화면의 Ver 3.917(숫자1, 숫자2)가 새 일일 카운트로 시작되도록 했다.

### 검증
- record_site_visit() 함수가 (now() at time zone 'Asia/Seoul')::date 값을 visit_day로 사용함을 확인.
- unique_ip_count가 site_visit_daily_ip_counts에서 visit_date = visit_day 조건으로 계산되는 것 확인.
- total_visit_count가 site_visit_daily_totals에서 visit_date = visit_day 조건으로 계산되는 것 확인.
- anon/authenticated execute grant와 실행 검증 select 포함 확인.

## 2026-06-29 02:15 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 왼쪽 사이드 메뉴(부동산 홈/관심 부동산/분양/중개사 홈)의 글자 굵기를 700에서 680으로 낮췄다.
- 글자 크기 14px은 유지했다.

### 검증
- .realjeju-side-nav-item의 font-size가 14px, font-weight가 680으로 적용된 것 확인.

## 2026-06-29 02:13 KST / Version 3.917

### 수정 파일
- /Users/GHOST/Downloads/css/base_3.917.css

### 수정 내용
- 왼쪽 사이드 메뉴(부동산 홈/관심 부동산/분양/중개사 홈)의 글자 크기를 15px에서 14px로 낮췄다.
- 같은 메뉴의 글자 굵기를 720에서 700으로 낮춰 168px 폭에서 덜 답답하게 보이도록 조정했다.

### 검증
- .realjeju-side-nav-item의 font-size가 14px, font-weight가 700으로 적용된 것 확인.
- 최근 조회 제목 12.5px, 최근 조회 매물 제목 11.5px 값 유지 확인.

## 2026-06-29 01:52 KST / Version 3.916

### 수정 파일
- /Users/GHOST/Downloads/sql/site_visit_counter_3.916.sql

### 수정 내용
- site_visit_counter_3.915.sql 실행 후 record_site_visit()의 RETURN QUERY에서 total_visit_count 반환 컬럼명과 테이블 컬럼명이 충돌하던 문제를 수정했다.
- public.site_visit_totals 테이블에 svt alias를 붙이고 svt.total_visit_count, svt.id처럼 명시적으로 참조하도록 변경했다.
- 기존 record_site_visit() RPC를 create or replace로 교체하는 SQL-only 복구 파일을 추가했다.

### 검증
- site_visit_counter_3.916.sql의 RETURN QUERY에서 svt.total_visit_count alias 참조 확인.
- record_site_visit() 생성, anon/authenticated execute grant, 검증 select 포함 확인.

## 2026-06-29 01:51 KST / Version 3.915

### 수정 파일
- /Users/GHOST/Downloads/sql/site_visit_counter_3.915.sql

### 수정 내용
- site_visit_counter_3.914.sql 실행 후 record_site_visit() 호출 시 pgcrypto digest(text, unknown) 함수 조회가 실패하던 문제를 보완했다.
- Supabase 확장 스키마/search_path 차이에 영향을 받지 않도록 IP 해시 생성을 내장 md5() 기반으로 변경한 복구 SQL을 추가했다.
- record_site_visit() 함수의 search_path를 public, pg_catalog로 설정해 내장 함수 조회가 안정적으로 되도록 했다.
- 기존 site_visit_ip_counts, site_visit_totals 테이블과 동일한 RPC 이름 record_site_visit()을 create or replace로 교체하도록 구성했다.

### 검증
- site_visit_counter_3.915.sql 내용 확인: 함수 본문에서 digest() 대신 md5() 사용.
- record_site_visit() 생성, anon/authenticated execute grant, 검증 select 포함 확인.

## 2026-06-29 01:49 KST / Version 3.914

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.914.html
- /Users/GHOST/Downloads/css/base_3.914.css
- /Users/GHOST/Downloads/js/app_3.914.js
- /Users/GHOST/Downloads/sql/site_visit_counter_3.914.sql

### 수정 내용
- realjeju_3.913 작업본을 realjeju_3.914 배포 파일 세트로 버전업했다.
- 상단 오른쪽 버전 표시가 record_site_visit RPC 응답을 받으면 Ver 3.914(고유 IP 수, 총 접속 수) 형식으로 표시되도록 추가했다.
- 프론트는 페이지 로드당 한 번 record_site_visit RPC를 호출하고, RPC가 없거나 실패하면 기존 Ver 3.914 표시를 유지하도록 했다.
- 로그인 UI가 상단 버튼을 다시 렌더링해도 방문 통계가 포함된 버전 텍스트를 유지하도록 renderTopbarVersionTrigger()를 수정했다.
- 버전 정보 텍스트의 오른쪽 끝선을 아래 오른쪽 지도 버튼 묶음의 오른쪽 끝선과 맞추도록 CSS를 추가했다.
- IP 원문을 저장하지 않고 해시로만 고유 IP를 집계하는 Supabase 설치 SQL site_visit_counter_3.914.sql을 추가했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.914로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.914.js 문법 검사 통과: node --check
- realjeju_3.914.html이 base_3.914.css, app_3.914.js를 참조하는 것 확인.
- app_3.914.js에서 record_site_visit RPC 호출, 방문 통계 버전 텍스트 적용, renderTopbarVersionTrigger() 통계 유지 로직 확인.
- base_3.914.css에서 .global-topbar-right가 --map-side-tools-right 기준으로 오른쪽 정렬되는 것 확인.
- site_visit_counter_3.914.sql에 site_visit_ip_counts, site_visit_totals, record_site_visit() 생성 및 execute grant 포함 확인.
- realjeju_3.914.html, base_3.914.css, app_3.914.js 내 3.913 참조 없음 확인.

## 2026-06-29 01:41 KST / Version 3.913

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.913.html
- /Users/GHOST/Downloads/css/base_3.913.css
- /Users/GHOST/Downloads/js/app_3.913.js

### 수정 내용
- realjeju_3.912 작업본을 realjeju_3.913 배포 파일 세트로 버전업했다.
- 부동산 홈 지도 숫자 뱃지 클릭으로 열린 왼쪽 매물 목록이 지도 이동/줌/idle 갱신 후 다른 매물 목록으로 바뀔 수 있던 조건을 수정했다.
- refreshViewportList()에서 keepLockedListOnMapClick 상태이고 왼쪽 목록이 열려 있으면 선택 숫자 뱃지가 현재 화면에 보이지 않아도 lockedListIds 목록을 계속 유지하도록 변경했다.
- 새 숫자 뱃지를 클릭하거나 왼쪽 매물 목록 X로 닫기 전까지 숫자 뱃지에서 열린 매물 목록이 유지되도록 했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.913으로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.913.js 문법 검사 통과: node --check
- realjeju_3.913.html이 base_3.913.css, app_3.913.js를 참조하는 것 확인.
- app_3.913.js에서 shouldKeepLockedItems 조건이 keepLockedListOnMapClick && state.isListOpen일 때 true가 되는 것 확인.
- realjeju_3.913.html, base_3.913.css, app_3.913.js 내 3.912 참조 없음 확인.

## 2026-06-29 01:37 KST / Version 3.912

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.912.html
- /Users/GHOST/Downloads/css/base_3.912.css
- /Users/GHOST/Downloads/js/app_3.912.js

### 수정 내용
- realjeju_3.911 작업본을 realjeju_3.912 배포 파일 세트로 버전업했다.
- 부동산 홈 지도 숫자 뱃지로 열린 왼쪽 매물 목록에서 카드 클릭 시 기존 뱃지 목록 잠금이 풀리던 문제를 수정했다.
- 왼쪽 매물 카드 클릭 시 클릭한 매물이 숫자 뱃지 잠금 목록에 포함되어 있으면 lockedListIds와 keepLockedListOnMapClick을 유지하도록 변경했다.
- 상세 패널을 열고 지도 위치를 이동한 뒤에도 왼쪽 목록이 현재 지도 영역 전체 매물로 바뀌지 않고, 숫자 뱃지로 선택된 매물 목록만 유지되도록 했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.912로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.912.js 문법 검사 통과: node --check
- realjeju_3.912.html이 base_3.912.css, app_3.912.js를 참조하는 것 확인.
- 왼쪽 카드 클릭 핸들러에서 preserveBadgeListLock 조건일 때 clearListLock()을 호출하지 않는 것 확인.
- realjeju_3.912.html, base_3.912.css, app_3.912.js 내 3.911 참조 없음 확인.

## 2026-06-29 00:52 KST / Version 3.911

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.911.html
- /Users/GHOST/Downloads/css/base_3.911.css
- /Users/GHOST/Downloads/js/app_3.911.js

### 수정 내용
- realjeju_3.909 앱 작업본을 realjeju_3.911 배포 파일 세트로 버전업했다.
- 오른쪽 상세 패널의 등록일 표시가 DB UTC 날짜 문자열 앞부분만 잘라 2026-06-28처럼 하루 전으로 보이던 문제를 수정했다.
- 상세 패널 등록일 formatter가 날짜만 있는 값은 그대로 표시하고, 시간 정보가 있는 DB timestamp는 Asia/Seoul 기준으로 변환해 표시하도록 변경했다.
- 왼쪽 매물 목록의 26.06.29 표시와 오른쪽 상세 패널 등록일이 같은 KST 날짜 기준을 쓰도록 맞췄다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.911로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.911.js 문법 검사 통과: node --check
- realjeju_3.911.html이 base_3.911.css, app_3.911.js를 참조하는 것 확인.
- app_3.911.js의 formatDetailSummaryDate()가 Asia/Seoul 기준으로 timestamp를 포맷하는 것 확인.
- realjeju_3.911.html, base_3.911.css, app_3.911.js 내 3.909 참조 없음 확인.

## 2026-06-29 00:47 KST / Version 3.910

### 수정 파일
- /Users/GHOST/Downloads/sql/repair_listing_no_sequence_3.910.sql

### 수정 내용
- enable_listing_no_sequence_3.909.sql 실행 시 기존 listing_no 중복 때문에 unique index 생성이 실패하는 문제를 보완했다.
- 기존 중복 listing_no를 먼저 sequence 새 번호로 재부여한 뒤 unique index를 생성하는 통합 복구 SQL을 추가했다.
- 중복 정리 후 sequence를 다시 현재 최대 listing_no에 맞춰 정렬하고, listing_no 기본값을 property_listing_no_seq로 설정하도록 했다.
- 실행 후 중복 잔여 여부와 listing_no column_default를 확인하는 검증 쿼리를 포함했다.

### 검증
- repair_listing_no_sequence_3.910.sql 내용 확인: 중복 정리 -> sequence 재정렬 -> default 설정 -> unique index 생성 순서.
- 3.909 SQL 실패 원인인 기존 중복 listing_no를 unique index 생성 전에 처리하는 것 확인.

## 2026-06-29 00:45 KST / Version 3.909

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.909.html
- /Users/GHOST/Downloads/css/base_3.909.css
- /Users/GHOST/Downloads/js/app_3.909.js
- /Users/GHOST/Downloads/sql/enable_listing_no_sequence_3.909.sql

### 수정 내용
- realjeju_3.908 작업본을 realjeju_3.909 배포 파일 세트로 버전업했다.
- 남아 있던 브라우저 localStorage 기반 자동 매물번호 발급 함수 createAutoPropertyListingNo()를 완전히 제거했다.
- 자동 매물번호 모드에서는 프론트가 listing_no를 보내지 않고 DB sequence 기본값이 발급하도록 정리했다.
- DB sequence 기본값과 unique index를 설정하는 전용 SQL 파일을 생성했다.
- 수동 매물번호 중복 확인 로직은 유지했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.909로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.909.js 문법 검사 통과: node --check
- realjeju_3.909.html이 base_3.909.css, app_3.909.js를 참조하는 것 확인.
- app_3.909.js에 createAutoPropertyListingNo, realjeju:autoListingNo, return createAutoPropertyListingNo 참조가 남아 있지 않은 것 확인.
- enable_listing_no_sequence_3.909.sql에서 property_listing_no_seq 기본값과 listing_no unique index 설정 확인.
- realjeju_3.909.html, base_3.909.css, app_3.909.js 내 3.908 참조 없음 확인.

## 2026-06-29 00:43 KST / Version 3.908

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.908.html
- /Users/GHOST/Downloads/css/base_3.908.css
- /Users/GHOST/Downloads/js/app_3.908.js
- /Users/GHOST/Downloads/sql/fix_duplicate_listing_no_3.908.sql

### 수정 내용
- realjeju_3.907 작업본을 realjeju_3.908 배포 파일 세트로 버전업했다.
- 자동 매물번호를 브라우저 localStorage 기준으로 10166030부터 생성하던 흐름을 중단하고, 자동 모드에서는 DB 기본값(sequence)이 listing_no를 발급하도록 수정했다.
- 수동 매물번호 입력 시 저장 전에 property_listings에서 같은 listing_no를 가진 다른 매물이 있는지 확인하고, 중복이면 저장을 막도록 추가했다.
- listing_no 저장 오류 발생 시 listing_no를 삭제하고 재저장하던 fallback을 제거해 중복/제약 오류가 숨겨지지 않도록 했다.
- 기존 DB 중복 listing_no를 정리하고 unique index를 추가하는 SQL 파일을 생성했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.908로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.908.js 문법 검사 통과: node --check
- realjeju_3.908.html이 base_3.908.css, app_3.908.js를 참조하는 것 확인.
- app_3.908.js에서 자동 매물번호 localStorage 생성 호출 제거, 수동 매물번호 중복 확인, listing_no 삭제 재시도 제거 확인.
- fix_duplicate_listing_no_3.908.sql 생성 및 중복 정리/unique index 추가 SQL 확인.
- realjeju_3.908.html, base_3.908.css, app_3.908.js 내 3.907 참조 없음 확인.

## 2026-06-29 00:41 KST / Version 3.907

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.907.html
- /Users/GHOST/Downloads/css/base_3.907.css
- /Users/GHOST/Downloads/js/app_3.907.js

### 수정 내용
- realjeju_3.906 작업본을 realjeju_3.907 배포 파일 세트로 버전업했다.
- 최근 조회 매물 상세 열기와 목록 공유 상세 열기에서 openDetailPanel() 이후 조회수를 한 번 더 증가시키던 중복 호출을 제거했다.
- 조회수 증가는 openDetailPanel() 내부의 단일 경로에서만 수행되도록 정리했다.
- 매물번호가 resolve 전후로 다르게 잡히는 경우 같은 상세 열기에서 조회수가 2회 증가할 수 있던 원인을 차단했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.907로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.907.js 문법 검사 통과: node --check
- realjeju_3.907.html이 base_3.907.css, app_3.907.js를 참조하는 것 확인.
- app_3.907.js에서 incrementViewCount() 직접 호출이 openDetailPanel() 내부 단일 경로만 남은 것 확인.
- realjeju_3.907.html, base_3.907.css, app_3.907.js 내 3.906 참조 없음 확인.

## 2026-06-29 00:30 KST / Version 3.906

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.906.html
- /Users/GHOST/Downloads/css/base_3.906.css
- /Users/GHOST/Downloads/js/app_3.906.js

### 수정 내용
- realjeju_3.905 작업본을 realjeju_3.906 배포 파일 세트로 버전업했다.
- 숫자 뱃지로 열린 왼쪽 매물 목록을 지도 빈 곳 클릭으로 닫지 않는 조건을 1개 매물에도 적용했다.
- 목록 잠금 함수에 keepOnMapClick 옵션을 추가하고, 단일 숫자 뱃지 클릭과 클러스터 숫자 뱃지 클릭에서 모두 해당 옵션을 켜도록 수정했다.
- 단일 숫자 뱃지 클릭 상태를 badge-list로 기록해 2개 이상 클러스터 목록과 같은 유지 흐름을 타도록 맞췄다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.906으로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.906.js 문법 검사 통과: node --check
- realjeju_3.906.html이 base_3.906.css, app_3.906.js를 참조하는 것 확인.
- 단일 숫자 뱃지와 클러스터 숫자 뱃지 모두 keepLockedListOnMapClick 조건을 사용하는 것 확인.
- realjeju_3.906.html, base_3.906.css, app_3.906.js 내 3.905 참조 없음 확인.

## 2026-06-29 00:27 KST / Version 3.905

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.905.html
- /Users/GHOST/Downloads/css/base_3.905.css
- /Users/GHOST/Downloads/js/app_3.905.js

### 수정 내용
- realjeju_3.904 작업본을 realjeju_3.905 배포 파일 세트로 버전업했다.
- 숫자 뱃지 선택 상태의 3px 색상 외곽선에도 BADGE_SELECTED_BG_ALPHA 0.78 투명도를 적용했다.
- 단일 매물 숫자 마커의 SVG stroke와 클러스터 숫자 마커의 CSS border 모두 같은 0.78 알파 색상을 사용하도록 맞췄다.
- 선택 상태 흰색 배경 투명도 0.78과 일반 상태 흰색 0.5px 외곽선은 유지했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.905로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.905.js 문법 검사 통과: node --check
- realjeju_3.905.html이 base_3.905.css, app_3.905.js를 참조하는 것 확인.
- app_3.905.js에서 선택 상태 외곽선 3px 및 색상 투명도 0.78 적용 확인.
- realjeju_3.905.html, base_3.905.css, app_3.905.js 내 3.904 참조 없음 확인.

## 2026-06-29 00:26 KST / Version 3.904

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.904.html
- /Users/GHOST/Downloads/css/base_3.904.css
- /Users/GHOST/Downloads/js/app_3.904.js

### 수정 내용
- realjeju_3.903 작업본을 realjeju_3.904 배포 파일 세트로 버전업했다.
- 숫자 뱃지 선택 상태의 흰색 배경 투명도 옵션을 0.72에서 0.78로 조정했다.
- 숫자 뱃지 선택 상태의 색상 외곽선을 2px에서 3px로 두껍게 조정했다.
- 단일 매물 숫자 마커와 클러스터 숫자 마커 모두 같은 선택 상태 기준을 적용했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.904로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.904.js 문법 검사 통과: node --check
- realjeju_3.904.html이 base_3.904.css, app_3.904.js를 참조하는 것 확인.
- app_3.904.js에서 BADGE_SELECTED_BG_ALPHA 0.78, 선택 상태 외곽선 3px 적용 확인.
- realjeju_3.904.html, base_3.904.css, app_3.904.js 내 3.903 참조 없음 확인.

## 2026-06-29 00:23 KST / Version 3.903

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.903.html
- /Users/GHOST/Downloads/css/base_3.903.css
- /Users/GHOST/Downloads/js/app_3.903.js

### 수정 내용
- realjeju_3.902 작업본을 realjeju_3.903 배포 파일 세트로 버전업했다.
- 숫자 뱃지 선택 상태의 흰색 배경 투명도를 조절하는 BADGE_SELECTED_BG_ALPHA 옵션을 추가했다.
- 선택 상태 흰색 배경을 0.72 투명도로 낮춰 지도 배경이 더 비치도록 조정했다.
- 단일 매물 숫자 마커와 클러스터 숫자 마커 모두 같은 선택 배경 투명도 옵션을 사용하도록 맞췄다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.903으로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.903.js 문법 검사 통과: node --check
- realjeju_3.903.html이 base_3.903.css, app_3.903.js를 참조하는 것 확인.
- app_3.903.js에서 BADGE_SELECTED_BG_ALPHA, 선택 상태 단일/클러스터 뱃지 배경 적용 확인.
- realjeju_3.903.html, base_3.903.css, app_3.903.js 내 3.902 참조 없음 확인.

## 2026-06-29 00:19 KST / Version 3.902

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.902.html
- /Users/GHOST/Downloads/css/base_3.902.css
- /Users/GHOST/Downloads/js/app_3.902.js

### 수정 내용
- realjeju_3.901 작업본을 realjeju_3.902 배포 파일 세트로 버전업했다.
- 지도 숫자 뱃지 클릭으로 열린 왼쪽 매물 목록이 지도 빈 곳 클릭으로 닫히지 않도록 수정했다.
- 숫자 뱃지 목록 선택 시 selectionMode를 cluster로 명확히 기록하고 selectedClusterKey를 유지하도록 보강했다.
- 지도 클릭 핸들러에서 cluster 잠금 목록이 열려 있는 경우 closeSidebarList(), 선택 해제, 목록 초기화를 건너뛰도록 분기했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.902로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.902.js 문법 검사 통과: node --check
- realjeju_3.902.html이 base_3.902.css, app_3.902.js를 참조하는 것 확인.
- 숫자 뱃지 목록 상태에서 지도 클릭 핸들러가 closeSidebarList() 전에 return하는 분기 확인.
- realjeju_3.902.html, base_3.902.css, app_3.902.js 내 3.901 참조 없음 확인.

## 2026-06-29 00:17 KST / Version 3.901

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.901.html
- /Users/GHOST/Downloads/css/base_3.901.css
- /Users/GHOST/Downloads/js/app_3.901.js

### 수정 내용
- realjeju_3.900 작업본을 realjeju_3.901 배포 파일 세트로 버전업했다.
- 중개사 매물 목록에서 매물을 클릭했을 때 상세 패널과 선택 표시만 바뀌고 지도 중심이 이동하지 않던 흐름을 보강했다.
- 목록 클릭 공통 포커스 함수가 현재 필터 목록, 전체 목록, 왼쪽 목록 캐시, 현재 상세 매물까지 정규화된 id로 찾아 최근 조회 매물과 같은 지도 이동 루틴을 사용하도록 수정했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.901로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.901.js 문법 검사 통과: node --check
- realjeju_3.901.html이 base_3.901.css, app_3.901.js를 참조하는 것 확인.
- focusProperty()가 정규화 id 검색 후 focusRecentViewedListingOnMap()을 호출해 지도 중심 이동을 수행하는 것 확인.
- realjeju_3.901.html, base_3.901.css, app_3.901.js 내 3.900 참조 없음 확인.

## 2026-06-29 00:13 KST / Version 3.900

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.900.html
- /Users/GHOST/Downloads/css/base_3.900.css
- /Users/GHOST/Downloads/js/app_3.900.js

### 수정 내용
- realjeju_3.899 작업본을 realjeju_3.900 배포 파일 세트로 버전업했다.
- 부동산 홈 지도 숫자 뱃지 원의 일반 상태 흰색 외곽선을 0.5px로 줄였다.
- 숫자 뱃지 선택 상태의 색상 외곽선은 2px로 두껍게 조정했다.
- 단일 매물 숫자 마커와 여러 매물이 겹친 클러스터 숫자 마커에 같은 외곽선 기준을 적용했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.900으로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.900.js 문법 검사 통과: node --check
- realjeju_3.900.html이 base_3.900.css, app_3.900.js를 참조하는 것 확인.
- app_3.900.js에서 일반 상태 0.5px 흰색 외곽선, 선택 상태 2px 색상 외곽선 적용 확인.
- realjeju_3.900.html, base_3.900.css, app_3.900.js 내 3.899 참조 없음 확인.

## 2026-06-29 00:10 KST / Version 3.899

### 수정 파일
- /Users/GHOST/Downloads/realjeju_3.899.html
- /Users/GHOST/Downloads/css/base_3.899.css
- /Users/GHOST/Downloads/js/app_3.899.js

### 수정 내용
- realjeju_3.898 작업본을 realjeju_3.899 배포 파일 세트로 버전업했다.
- 부동산 홈 지도 숫자 뱃지 원에 얇은 흰색 외곽선만 추가했다.
- 단일 매물 숫자 마커와 여러 매물이 겹친 클러스터 숫자 마커 모두 일반 상태에서 흰색 외곽선이 보이도록 맞췄다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 3.899로 갱신했다.

### 검증
- /Users/GHOST/Downloads/js/app_3.899.js 문법 검사 통과: node --check
- realjeju_3.899.html이 base_3.899.css, app_3.899.js를 참조하는 것 확인.
- realjeju_3.899.html, base_3.899.css, app_3.899.js 내 3.898 참조 없음 확인.

# REALJEJU Change Log

## 2026-06-28 23:13 KST / Version 3.898

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.898.html`
- `/Users/GHOST/Downloads/css/base_3.898.css`
- `/Users/GHOST/Downloads/js/app_3.898.js`

### 수정 내용
- `realjeju_3.897` 작업본을 `realjeju_3.898` 배포 파일 세트로 버전업하고 HTML의 CSS/JS 캐시 버전도 `3.898`로 올렸다.
- 상단 필터바 메뉴 클릭 시 교육/편의/개발 박스 메뉴와 동일하게 오른쪽 `중개` 박스 메뉴도 닫히도록 `closeRightMapToolPopupsForTopbarFilterClick()`에 `closeBrokerOfficeFilterPanel()` 호출을 추가했다.
- 거리재기 시작 시에도 오른쪽 `중개` 박스 메뉴가 함께 닫히도록 보조 정리 흐름을 맞췄다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.898.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/realjeju_3.898.html`의 CSS/JS 참조와 화면 버전 표기가 `3.898`로 갱신된 것 확인.
- `/Users/GHOST/Downloads/js/app_3.898.js`에서 상단 필터바 클릭 정리 함수에 `closeBrokerOfficeFilterPanel()` 호출이 포함된 것 확인.

## 2026-06-28 21:46 KST / Version 3.897

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.897.html`
- `/Users/GHOST/Downloads/css/base_3.897.css`
- `/Users/GHOST/Downloads/js/app_3.897.js`

### 수정 내용
- `realjeju_3.896` 작업본을 `realjeju_3.897` 배포 파일 세트로 버전업하고 HTML의 CSS/JS 캐시 버전도 `3.897`로 올렸다.
- 조회수 기능을 기존 SQL(`/Users/GHOST/Downloads/0. 리얼제주/listing_views.sql`)에 맞춰 `listing_views(listing_no, views)`와 `increment_listing_view(p_listing_no)` 기준으로 수정했다.
- 존재하지 않는 `increment_property_view`, `get_property_view_counts` 호출을 제거해 Supabase 400 응답이 발생하던 원인을 정리했다.
- 조회수 키는 `listingNo/listing_no`를 우선 사용하는 전용 `getListingViewKey()`로 분리하고, 관심수/문의수에 쓰이는 기존 `getItemViewKey()`는 매물 id 기준을 유지하도록 되돌렸다.
- `get_property_engagement_counts` 집계 RPC는 기본 비활성화해 조회수 기능과 무관한 400 호출을 막았다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.897.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/realjeju_3.897.html`의 CSS/JS 참조와 화면 버전 표기가 `3.897`로 갱신된 것 확인.
- `/Users/GHOST/Downloads/js/app_3.897.js`에서 `increment_property_view`, `get_property_view_counts` 호출이 제거된 것 확인.

## 2026-06-28 21:09 KST / Version 3.896

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.896.html`
- `/Users/GHOST/Downloads/css/base_3.896.css`
- `/Users/GHOST/Downloads/js/app_3.896.js`

### 수정 내용
- `realjeju_3.895` 작업본을 `realjeju_3.896` 배포 파일 세트로 버전업하고 HTML의 CSS/JS 캐시 버전도 `3.896`으로 올렸다.
- 매물 상세 패널이 열릴 때 공통 경로에서 조회수 증가를 시도하도록 `openDetailPanel()`에 `incrementViewCount()` 호출을 추가했다.
- 기존에는 일부 목록/최근조회 경로에서만 조회수 증가가 호출되어 지도 마커, URL 직접 진입 등 다른 상세 진입에서는 조회수가 증가하지 않을 수 있던 문제를 보강했다.
- `get_property_engagement_counts` 집계 RPC가 없거나 실패할 때 조회수 증가 RPC까지 함께 비활성화하던 오류 처리를 분리했다.
- 중개사 매물 목록 집계 RPC 실패 시에도 조회수 증가 기능이 꺼지지 않도록 처리했다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.896.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/realjeju_3.896.html`의 CSS/JS 참조와 화면 버전 표기가 `3.896`으로 갱신된 것 확인.
- `/Users/GHOST/Downloads/js/app_3.896.js`에서 집계 RPC 실패가 `viewCountRpcDisabled`를 건드리지 않는 것 확인.

## 2026-06-28 21:05 KST / Version 3.895

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.895.html`
- `/Users/GHOST/Downloads/css/base_3.895.css`
- `/Users/GHOST/Downloads/js/app_3.895.js`

### 수정 내용
- `realjeju_3.894` 작업본을 `realjeju_3.895` 배포 파일 세트로 버전업하고 HTML의 CSS/JS 캐시 버전도 `3.895`로 올렸다.
- 부동산 홈 `전체` 필터의 `기타조건` 초기화 버튼을 스크롤 본문 밖 footer로 이동해 `주소/현재위치` 드롭다운처럼 스크롤바가 하단 버튼 영역 위에서 끝나도록 구조를 변경했다.
- `전체` 필터 footer는 상단 선, 52px 초기화 버튼, 하단 24px 여백으로 분리하고 스크롤 본문 높이에서 footer 높이 91px을 제외하도록 조정했다.
- footer로 이동한 `data-all-extra-reset` 버튼도 기존 초기화 동작이 유지되도록 JS 이벤트 바인딩 대상을 갱신했다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.895.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/realjeju_3.895.html`의 CSS/JS 참조와 화면 버전 표기가 `3.895`로 갱신된 것 확인.
- `/Users/GHOST/Downloads/css/base_3.895.css`에서 `전체` 필터 footer 분리 및 스크롤 본문 높이 보정 규칙 확인.

## 2026-06-28 21:00 KST / Version 3.894

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.894.html`
- `/Users/GHOST/Downloads/css/base_3.894.css`
- `/Users/GHOST/Downloads/js/app_3.894.js`
- `/Users/GHOST/Downloads/css/base_3.893.css`

### 수정 내용
- `realjeju_3.893` 작업본을 `realjeju_3.894` 배포 파일 세트로 버전업하고 HTML의 CSS/JS 캐시 버전도 `3.894`로 올렸다.
- 부동산 홈 `전체` 필터 하단에서 초기화 버튼 아래 여백이 계속 크게 보이던 문제를 직접 보정했다.
- `전체` 필터 스크롤 본문이 남는 높이를 강제로 차지하지 않도록 `height: auto`와 `flex: 0 1 auto`를 적용했다.
- `기타조건` 섹션 하단은 좌우 여백과 같은 24px만 남기고, 초기화 버튼 reset row의 추가 하단 여백은 제거했다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.894.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/realjeju_3.894.html`의 CSS/JS 참조와 화면 버전 표기가 `3.894`로 갱신된 것 확인.
- `/Users/GHOST/Downloads/css/base_3.894.css`에서 `전체` 필터 하단 여백 보정 규칙 확인.

## 2026-06-28 20:16 KST / Version 3.893

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.893.html`
- `/Users/GHOST/Downloads/css/base_3.893.css`
- `/Users/GHOST/Downloads/js/app_3.893.js`

### 수정 내용
- `realjeju_3.892` 작업본을 `realjeju_3.893` 배포 파일 세트로 버전업했다.
- 주소/현재위치 드롭다운의 매물 목록에서 항목을 클릭하면 최근 조회 매물과 같은 방식으로 지도 중심이 해당 매물 좌표로 이동하도록 보강했다.
- 교육시설 아이콘 클릭으로 왼쪽 상세 패널이 열릴 때 상단 필터바가 상세 패널 오른쪽으로 밀리도록 보정했다.
- 교육시설 상세 패널이 열린 상태에서도 상단 필터 메뉴의 왼쪽 스크롤 화살표가 상세 패널 오른쪽 기준으로 보이도록 화살표 좌표/스크롤 상태 재계산을 보강했다.
- 오른쪽 중개 버튼 패널의 `전체`, `아파트 전문`, `오피스텔 전문`, `토지 전문`, `상가 전문`, `원룸/투룸 전문`을 같은 버튼 재클릭 시 해제되는 토글 방식으로 수정했다.
- 부동산 홈 `전체` 필터 드롭다운 하단에서 초기화 버튼 아래 여백이 좌우 여백 수준으로 보이도록 중복 하단 여백을 제거했다.
- 부동산 홈 `전체` 필터의 `기타조건` 섹션에서 초기화 버튼 아래에 남아 있던 보강용 빈 공간을 제거해 하단 여백을 좌우 여백과 같은 24px 기준으로 맞췄다.
- 부동산 홈 `전체` 필터 하단 보강용 빈 공간 제거 후 사라진 하단 우측 곡률을 본문/기타조건 섹션에 직접 적용해 복구했다.
- 부동산 홈 `전체` 필터에서 스크롤 본문이 남는 높이까지 늘어나 초기화 버튼 아래 여백이 과하게 커지던 문제를 막고, 추가 footer 없이 섹션 자체의 24px 하단 여백만 남기도록 조정했다.
- 상단/하단 버전 표기와 HTML의 CSS/JS 참조를 `3.893`으로 갱신했다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.893.js` 문법 검사 통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `realjeju_3.893.html`, `base_3.893.css`, `app_3.893.js` 내 `3.892` 참조 없음 확인.
- `/Users/GHOST/Downloads/js/app_3.893.js` 교육시설 상세 패널 화살표 보강 후 문법 검사 재통과: `/Users/GHOST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check`
- `/Users/GHOST/Downloads/css/base_3.893.css`에서 `전체` 필터 하단 보강용 `::after` 공간 제거 규칙 확인.
- `/Users/GHOST/Downloads/css/base_3.893.css`에서 `전체` 필터 본문/기타조건 섹션 하단 곡률 복구 규칙 확인.
- `/Users/GHOST/Downloads/css/base_3.893.css`에서 `전체` 필터 스크롤 본문 `flex: 0 1 auto` 고정 및 추가 footer 제거 규칙 확인.

## 2026-06-28 17:08 KST / Version 3.892

### 수정 파일
- `/Users/GHOST/Downloads/realjeju_3.892.html`
- `/Users/GHOST/Downloads/css/base_3.892.css`
- `/Users/GHOST/Downloads/js/app_3.892.js`

### 수정 내용
- 부동산 홈, 중개사 홈, 관심 부동산의 드롭다운 버튼 동작 규칙을 통일했다.
- 중개사 홈 면적 드롭다운을 부동산 홈 면적 드롭다운의 슬라이더/토글 동작에 맞췄다.
- 면적 필터에서 `전용면적 기준으로 찾기`와 `토지`를 단일 선택 토글로 정리하고 기본값을 전용면적으로 설정했다.
- 평/제곱미터 전환 버튼이 실제 면적 단위와 숫자 표시에 반영되도록 수정했다.
- 토지 선택 시 면적 숫자 단위와 필터 대상이 토지 기준으로 바뀌도록 정리했다.
- 관심 부동산에 `매물 유형`, `가격 유형`, `면적`, `지목`, `용도지역` 필터 버튼과 드롭다운을 적용했다.
- 관심 부동산에 새로 추가된 필터 버튼들의 모양과 드롭다운 동작을 부동산 홈/중개사 홈과 맞췄다.
- 용도지역 `자연환경보전지역` 표시를 `자연환경보전`으로 줄이고 한 줄 표시 및 폰트 크기를 맞췄다.
- 가격 유형 필터는 부동산 홈, 중개사 홈, 관심 부동산 모두 기본값을 매매/전세/월세/년세 전체 선택 상태로 맞췄다.
- 가격 유형 초기화 버튼을 누르면 매매/전세/월세/년세가 모두 켜지도록 수정했다.
- 가격 유형을 하나 선택하면 해당 거래 유형 매물만 나오도록 필터링 규칙을 정리했다.
- 거리뷰 버튼을 눌러 파란선 표시 상태일 때도 상단 필터 메뉴가 보이도록 했다.
- 로드뷰 상세 화면이 실제로 열렸을 때만 상단 필터 메뉴가 사라지도록 했다.
- 지도 우측 `+/-` 버튼과 현위치 버튼 사이 간격을 14px로 조정했다.
- 평/제곱미터 버튼 뒤에 보이던 투명 사각형 그림자 문제를 제거했다.
- 중개 버튼 클릭 시 교육/편의/개발과 같은 위치와 폭의 왼쪽 패널이 열리도록 했다.
- 중개 패널 메뉴를 `전체`, `아파트 전문`, `오피스텔 전문`, `토지 전문`, `상가 전문`, `원룸/투룸 전문`으로 구성했다.
- 중개사 회원에게는 `내 매물만`, `우리 사무소 매물` 필터를 추가로 노출하도록 했다.
- 중개 패널 아이콘을 메뉴별로 적용했다.
- 중개 전문 필터에서 각 전문 메뉴도 `전체`처럼 중개사 뱃지가 나오도록 했다.
- 중개 패널의 시작 위치, 폭, 라벨 표기(`원룸/투룸`)를 다른 지도 보조 메뉴와 맞췄다.
- 중개사 전문 분류는 기본 3건 이상, 해당 유형 60% 이상 기준으로 계산하도록 했다.
- 중개사 매물 매칭은 `agency_id`, `user_id`, 정규화된 사무소명으로 비교하도록 보강했다.
- `isApprovedBrokerOffice is not defined` 오류를 해결했다.
- `원룸/투룸 전문` 기준에 원룸/투룸, 오피스텔, 다가구주택, 생활형숙박시설, 빌라/다세대/연립 계열을 포함하도록 수정했다.
- 실제 공개 데이터 기준으로 승연공인중개사사무소가 `원룸/투룸 전문` 60% 기준을 통과하는 것을 확인했다.

### 검증
- `/Users/GHOST/Downloads/js/app_3.892.js` 문법 검사 통과: `node --check`
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

