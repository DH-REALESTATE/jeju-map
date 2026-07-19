## 2026-07-19 / Version 4.838 - Administrative Office Region Anchors

- 읍면동 네모 매물 수 뱃지의 앵커를 74개 법정동 코드별 담당 동사무소ㆍ주민센터ㆍ읍사무소ㆍ면사무소 인근으로 통일.
- 한 행정기관을 함께 쓰는 법정동은 가까운 미세 오프셋으로 뱃지 겹침을 피하고, 아라일동ㆍ아라이동을 각각 표시하도록 고정.
- 기존 노형동ㆍ연동 개별 특수 앵커를 공통 행정기관 앵커 원칙으로 교체하고 지도 지시사항과 GIS 기록에 같은 규칙을 남김.
- 74개 경계 코드와 앵커를 대조해 누락ㆍ중복ㆍ제주 범위 밖 좌표가 없음을 확인하고 JavaScript 문법을 검사. ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.837 - Presale Condition Tiles And Region Source

- `분양조건`의 입주예정ㆍ청약가능통장ㆍ브랜드 선택지에서 체크 아이콘을 제거하고, `분양현황`ㆍ`분양형태`와 같은 3열ㆍ36px 높이ㆍ6px 곡률의 네모 타일로 통일.
- 분양 페이지의 왼쪽 위치 드롭다운이 일반 부동산의 `state.filtered`ㆍ`state.all`을 읽지 않도록 차단.
- 분양 전용 데이터가 연결되기 전에는 위치 드롭다운을 `0건`으로 유지하며 일반 부동산 매물을 대체 표시하지 않음.
- 부동산 홈의 위치 드롭다운과 기존 필터 치수ㆍ곡률ㆍ간격은 변경하지 않음.
- JavaScript 문법, CSS 괄호, 버전 참조와 루트 파일 동기화를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.836 - Presale Dropdown Title Canonical Size

- 분양 드롭다운 안쪽 제목을 부동산 홈 `매물유형` 제목과 같은 `18px / 700 / line-height 1.2` 규격으로 통일.
- `분양현황`과 `분양형태`의 앞 체크 아이콘을 제거하고, 선택지를 부동산 홈 `매물유형`과 같은 3열ㆍ36px 높이ㆍ6px 곡률의 네모 타일로 통일.
- `분양가/보증금`, `면적`, `세대수`를 포함한 모든 분양 드롭다운 제목에 같은 제목 규격을 적용.
- 상단 필터 버튼, 드롭다운 외곽, 선택 타일과 슬라이더 등 나머지 확정 규격은 변경하지 않음.
- JavaScript 문법, CSS 괄호, 버전 참조와 루트 파일 동기화를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.835 - Canonical Property Filter Geometry

- 부동산 홈 지도 필터의 기존 완전 원형 곡률을 복원하고 높이ㆍ패딩ㆍ글자 규격은 변경하지 않음.
- 분양 상단 필터가 부동산 홈과 같은 공통 트리거를 사용하도록 유지하고, 분양유형 타일을 기존 `매물유형`의 3열ㆍ36px 높이ㆍ6px 곡률 규격과 동일하게 맞춤.
- 분양 드롭다운 외곽을 기존 `매물유형`과 같은 420px 폭ㆍ20px 곡률ㆍ패딩ㆍ그림자로 맞춤.
- 분양 범위 슬라이더를 부동산 가격ㆍ면적 필터와 같은 파란색, 30px 레일 영역, 26px 손잡이 규격으로 통일.
- 확정된 크기ㆍ곡률ㆍ색상ㆍ간격은 사용자 확인 없이 바꾸지 않고, 부동산 필터를 분양 필터 디자인의 원본으로 사용한다는 변경 잠금 규칙을 지시사항에 기록.
- JavaScript 문법, CSS 괄호, 버전 참조와 루트 배포 HTML 동기화를 정적 검사하며 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.834 - Single SPA Entry and Region Selection Reset

- Vercel과 로컬 SPA 서버의 `/properties`, `/jobs`, `/companies` 등 깨끗한 경로가 모두 루트 `index.html` 하나를 읽도록 변경해 `menu_routes/*/index.html` 중복 배포 의존성을 제거.
- 좁은 브라우저에서 검색창이 첫 `부동산` 카테고리 메뉴를 덮지 않도록 공통 카테고리 네비의 쌓임 순서를 검색창보다 한 단계 높게 통일하고, 알바 전용 위치ㆍ쌓임 예외는 추가하지 않음.
- 행정구역 네모 매물 박스로 연 목록을 `X`로 닫으면 선택 키와 어두운 박스 상태도 함께 해제되도록 수정.
- JavaScriptㆍPython 문법, JSON, 버전 참조와 루트 배포 HTML 동기화를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.833 - Shared Search Geometry and 16:10 Detail Hero

- 오른쪽 상세 패널의 단일 대표 사진 비율을 `16:9`에서 `16:10`으로 변경.
- 알바를 포함한 스크롤형 문서 페이지도 부동산ㆍ동네업체ㆍ자동차와 같은 공통 검색창 `286px × 40px` 고정 좌표를 사용하도록 정리.
- 페이지별 검색창 좌표 예외를 만들지 않고, 문서 상단바 컨테이너가 공통 검색창ㆍ네비와 함께 스크롤하도록 처리.
- JavaScript 문법과 버전 참조, 배포용 HTML 동기화를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-19 / Version 4.832 - Shared Document Topbar and Plan Copy

- 알바를 포함한 모든 스크롤형 문서 페이지에서 검색창과 카테고리 네비가 상단바 안의 같은 절대 좌표를 사용하도록 정리해, 본문 스크롤 중 두 요소만 화면에 고정되어 공고 카드와 겹치던 회귀를 수정.
- 알바 전용 상단바 DOMㆍ좌표ㆍ지연 재배치는 추가하지 않고 기존 공통 `realjeju-document-page-open` 경로 한 곳에서 처리.
- 분양 필터 버튼은 부동산 홈의 공통 트리거 규격을 유지하고, 종류마다 달랐던 드롭다운 폭을 부동산 공통 `410px` 외곽 규격과 동일하게 통일.
- 부동산 홈 왼쪽 최근 조회의 매물 제목을 4.604 기준 `11.5px / 700`, 가격을 `11px / 600`으로 복원.
- 베이직 플랜 설명의 고정 HTML과 동적 템플릿을 모두 `일반매물 100건과 하루 재등록 20건, 중개사홈을 30일 동안 이용할 수 있습니다.`로 변경.
- JavaScript 문법과 버전 참조, 배포용 HTML 동기화를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.831 - Presale Map Filters

- 분양 페이지 지도 상단에 공통 위치 칩과 같은 규격의 `분양유형`, `분양현황`, `분양형태`, `분양가/보증금`, `면적`, `세대수`, `분양조건` 전용 필터 일곱 개를 추가.
- 분양유형ㆍ단계ㆍ일정ㆍ분양형태ㆍ입주예정ㆍ청약통장ㆍ브랜드 선택 메뉴와 가격ㆍ면적ㆍ세대수 이중 범위 슬라이더, 직접 입력, 면적 `m²/평` 전환 UI를 구성.
- 분양 화면에서는 일반 부동산 필터 버튼과 일반 매물 마커ㆍ클러스터ㆍ행정구역 박스ㆍ하단 매물 수 버튼을 계속 숨기며, 분양 전용 데이터 연결 전에는 전용 필터 UI만 동작하도록 유지.
- 4.830의 비부동산 경유 중개사 매물 `0건` 회귀 수정은 그대로 보존하고, 공통 검색창ㆍ상단 네비 좌표ㆍ페이지별 데이터 로딩 경로는 변경하지 않음.
- JavaScript 문법, 필터 트리거ㆍ메뉴 수, 버전 참조를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.830 - Broker Listing Data Readiness

- `/jobs` 직접 새로고침처럼 비부동산 초기 라우트에서 전체 매물 로딩을 생략한 세션이 동네업체로 이동한 뒤 `매물 보기`를 누르면, 빈 `state.all`로 중개사 목록을 먼저 계산해 `0건`을 표시하던 순서 문제를 수정.
- 공통 `openBrokerOfficeListingPanel()`이 기존 IndexedDB 캐시 우선 `loadProperties()` 완료를 기다린 뒤 중개사 필터와 목록을 계산하도록 연결.
- 동네업체 진입과 중개사 뱃지 렌더만으로 전체 부동산 매물을 요청하지 않고, 사용자가 `매물 보기`를 실행한 경우에만 필요한 전체 매물 데이터를 준비하도록 유지.
- 분양 페이지 필터 작업은 포함하지 않고 4.831로 분리했으며, JavaScript 문법과 버전 참조를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.829 - Shared Topbar Search Geometry

- 알바가 `realjeju-document-page-open` 상태에서만 주소 검색창의 위치ㆍ폭ㆍ배치 방식을 다시 지정하던 후순위 CSS 두 곳을 제거.
- 부동산ㆍ동네업체ㆍ알바ㆍ자동차가 모두 기존 공통 `#subAddressSearch` DOM과 `286px × 40px`, 사이드 메뉴 끝에서 같은 간격으로 시작하는 고정 좌표 규칙을 그대로 사용하도록 통일.
- 알바의 `알바검색` 안내 문구와 스크롤형 본문 동작은 유지하고, 알바 전용 검색창 보정 선택자나 새 `!important` 규칙은 추가하지 않음.
- JavaScript와 HTML 버전 참조를 정적 검사하며 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.828 - Live Broker Count Fallback

- 원격 `broker_specialty_stats` 스냅샷이 빈 배열인 상태에서 동네업체 지도 렌더가 600ms마다 같은 통계 조회와 경고를 반복하던 흐름을 제거.
- 스냅샷이 비었거나 조회에 실패할 때만 게시 매물의 중개사 식별자와 매물 유형 최소 필드 여섯 개를 분할 조회해 중개사별 매물 수를 직접 집계하도록 fallback 추가.
- fallback 결과를 5분간 캐시하고 동시 요청을 하나의 Promise로 합쳤으며, 실패 재시도도 최소 30초 간격으로 제한해 지도 이동ㆍ재렌더마다 같은 전체 집계를 다시 실행하지 않도록 고정.
- 게시 매물 전체 조회가 끝난 뒤에만 실제 0건을 확정하며, 사진ㆍ주소ㆍ설명ㆍ가격 등 뱃지 집계에 불필요한 payload는 요청하지 않음.
- 게시 매물 854건, 집계 33개 중개사무소가 실제 원격 데이터와 매칭되는 것을 확인하고 반복 경고 문구가 4.828 JavaScript에 남아 있지 않은지 정적 검사.
- 공통 상단바와 페이지별 레이아웃은 변경하지 않았으며 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.827 - Reliable Local-Business Broker Counts

- 동네업체 F5 새로고침에서 중개사 위치 캐시가 `broker_specialty_stats`보다 먼저 복원되어 모든 뱃지가 `매물 0`으로 만들어지던 순서 문제를 수정.
- 통계 결과가 비어 있거나 중개사무소 rows와 실제 양수 집계가 하나도 매칭되지 않으면 0 뱃지를 렌더하지 않고 기존 오버레이를 지운 뒤 재조회하도록 변경.
- 통계가 준비되기 전에 캐시된 중개사 뱃지 DOM을 먼저 붙이던 복원 경로를 제거하고, 통계와 위치가 매칭된 뒤에만 뱃지를 생성하도록 고정.
- 빈 통계 응답을 정상 캐시로 덮어쓰지 않으며, 동네업체 자동 레이어 재시도 횟수를 늘려 일시적인 Supabase 준비 지연 뒤에도 실제 매물 수를 복원.
- 부동산ㆍ동네업체ㆍ알바ㆍ자동차 공통 상단 네비가 페이지별 검색창 폭을 측정하지 않고 같은 고정 좌표를 사용하도록 정리해 알바 진입 시 좌우 이동을 차단.
- 승인 중개사 계정의 우측 상단 명칭은 개인 이름보다 승인된 `agencies.office_name`을 우선하고, 일시적인 조회 실패에도 이미 확인된 사무소명을 유지.
- JavaScript 문법과 버전 참조를 정적 검사하고 ZIP 및 `localhost:5500` 실행ㆍ확인은 수행하지 않음.

## 2026-07-18 / Version 4.826 - Lazy Roadview Initialization

- `/properties` 직접 새로고침에서는 초기 라우트 가드를 매물 데이터와 첫 지도 페인트가 끝날 때까지 유지하고, 가드 중 문서 배경을 흰색으로 고정해 회색 빈 화면과 필터 버튼 플래시가 보이지 않도록 수정.
- 공통 상단바 위치 재측정 직전에 메뉴를 임시 `50vw`로 옮기던 동작을 제거해 알바 등 카테고리 전환에서 네비 메뉴가 오른쪽으로 갔다가 돌아오는 움직임을 차단.
- 동네업체가 캐시된 중개사 위치 뱃지를 복원할 때 `broker_specialty_stats` 집계를 먼저 준비하고, 일시적인 Supabase 준비 실패는 다음 렌더에서 재시도해 `매물 0`이 고착되지 않도록 수정.
- 모든 카테고리의 앱 부팅 과정에서 카카오 `Roadview` 객체를 미리 생성하던 호출을 제거하고, 사용자가 로드뷰를 실제로 처음 열 때만 객체와 Canvas를 생성하도록 변경.
- 로드뷰 초기화를 멱등 처리해 같은 페이지에서 여러 번 열어도 컨테이너와 이벤트 리스너를 중복 생성하지 않도록 유지.
- 로드뷰 패널이 닫힌 동안에는 `position_changed`, `viewpoint_changed` 이벤트가 앱 지도 위치ㆍ방향 오버레이를 갱신하지 않도록 차단.
- 카카오 SDK가 활성 로드뷰 Canvas에서 출력하는 `willReadFrequently` 성능 안내는 외부 라이브러리 내부 동작이므로 SDK 파일을 수정하거나 콘솔을 강제로 숨기지 않음.
- 지도 도구 선택, 목록 선택 규칙과 라우트 URL은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.825 - Persistent Property Map Tools

- 부동산에서 사용자가 켠 `교육`, `편의`, `중개`, `개발` 도구와 세부 선택을 카테고리 이탈 전에 보존하고, 동네업체ㆍ알바ㆍ자동차 등을 다녀온 뒤 부동산 복귀 시 같은 선택으로 복원.
- 비부동산 화면에서는 부동산 분석 레이어를 숨기는 기존 동작을 유지하면서, 동네업체가 임시로 켜는 중개사 레이어가 사용자의 부동산 도구 선택을 덮어쓰지 않도록 분리.
- 동네업체 카드와 부동산 중개사 매물 목록 제목을 왼쪽 정렬한 `중개사무소명 (매물 : N)`으로 통일하고 원래 `매물 목록` 제목과 같은 17px/700 규칙을 재사용.
- 동네업체 중개사 매물 수는 전체 매물 배열이 없는 비부동산 경로에서도 `broker_specialty_stats` 집계를 먼저 불러 실제 수를 표시하도록 수정.
- 분양 페이지에서 일반 매물 마커ㆍ클러스터ㆍ행정구역 박스와 하단 매물 수 라운드 버튼을 차단하고, 알바를 포함한 스크롤형 문서 페이지는 공통 상단바 좌표를 사용하도록 정리.
- 새 `!important`를 추가하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.824 - REALJEJU R App Icon

- Downloads의 `favicon_realjeju_blue.png` 지정본을 확인해 파란 원 안의 흰색 `R` 1:1 이미지를 프로젝트 파비콘 원본으로 동기화.
- 지정본은 `100x100` PNG, 7.1KB로 카카오 Developers 앱 아이콘 제한 250KB보다 충분히 작게 유지.
- 사이트 파비콘을 지정본으로 교체하고 브라우저가 이전 아이콘을 재사용하지 않도록 아이콘 URL에 4.824 캐시 키를 연결.
- 공통 상단바, 지도, 목록, 라우팅과 데이터 요청은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.823 - External Detail Panel Toggle

- `agentList=1`과 `id`가 함께 있는 외부 카카오 공유 URL에서 `direct-detail-list-mode`의 강제 표시 규칙이 `map-panels-collapsed` 이동 규칙을 덮어 버튼만 움직이던 원인을 수정.
- 외부 상세 모드의 강제 표시 선택자를 펼쳐진 상태에만 적용해 왼쪽 매물 목록과 오른쪽 상세 패널 전체가 일반 진입과 같은 280ms 접기ㆍ펼치기 경로를 사용하도록 복구.
- 계정 페이지 공통 푸터 초기화가 관심부동산의 한 줄 푸터를 일반 사업자정보 푸터로 교체하던 경로를 차단해, 실제 화면에서도 중개사 홈과 같은 `© REALJEJU.APP` 한 줄만 유지.
- 카카오 공유 카드 하단 발신명은 공유 payload가 아니라 Kakao Developers 앱 이름에서 오는 값임을 고정 지시 문서에 기록하고, 해당 앱 이름을 `REALJEJU.APP`로 관리하도록 명시.
- 새 `!important`를 추가하지 않았으며 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.820 - Agency Link Route and Selected Menu Icon

- `/properties?agency=<public_id>` 경로를 부동산 카테고리 라우트에 직접 연결해, 매물 데이터 준비 후 해당 중개사 카드와 매물 목록을 열도록 수정.
- 외부공유 링크 진입으로 오른쪽 `중개` 레이어 버튼을 자동 조작하지 않는 기존 수동 규칙을 유지.
- 왼쪽 사이드 메뉴 선택 상태는 배경 없이 아이콘만 브랜드 파란색, 글자는 검정 700으로 변경하고 `관심 부동산` 아이콘만 기존 빨간 하트 색상을 적용.
- 관심부동산 푸터에서 레거시 마이페이지 푸터 클래스를 제거해 중개사 홈과 동일한 `© REALJEJU.APP` 한 줄 푸터 DOM만 사용.
- 새 `!important`를 추가하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.819 - Selected Side Menu Text Only

- 왼쪽 사이드 메뉴의 선택 상태에서 진한 파란 배경과 흰색 아이콘 처리를 제거.
- 선택된 메뉴의 글자만 브랜드 파란색 `#2563eb`로 표시하고 아이콘은 기존 기본 색상을 유지.
- 선택되지 않은 메뉴와 hover 배경, 공통 상단바, 지도, 데이터 요청 및 라우팅은 변경하지 않음.
- 기존 공통 `.active` 규칙 한 곳만 수정했으며 별도 페이지 예외와 `!important`는 추가하지 않음.
- ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.818 - Agency Public ID Underscore

- 외부공유 아이디 입력에서 언더바(`_`)를 하이픈과 같은 내부 구분자로 허용.
- 정적ㆍ동적 중개사무소 정보 입력 안내를 `영문 소문자, 숫자, 하이픈, 언더바`로 통일.
- 앱 입력 정리ㆍ유효성 검증과 Supabase `CHECK` 제약ㆍ중복 확인 RPCㆍ저장 RPC가 동일한 문자 규칙을 사용하도록 수정.
- 기존 4.800 설치 환경에도 적용할 수 있는 `sql/agency_public_id_4.818_allow_underscore.sql`을 추가.
- 예약 아이디, 4~24자 길이, 대소문자 무시 중복 검사, 일반 사용자의 최초 1회 설정 규칙은 유지.
- 공통 상단바ㆍ지도ㆍ목록ㆍ푸터와 다른 화면 동작은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.817 - Solid Blue Selected Side Menu

- 왼쪽 사이드 메뉴의 선택 상태를 연한 배경 시험안에서 로고와 같은 브랜드 파란색 `#2563eb` 배경으로 변경.
- 선택 메뉴의 아이콘과 글자를 흰색 `#ffffff`로 변경해 선택 상태 대비를 강화.
- 기존 `6px` 곡률과 선택되지 않은 메뉴의 `#f5f7fa` hover는 유지하고, 공통 `.active` 선택자 외의 메뉴 동작은 변경하지 않음.
- 관심부동산 하단의 별도 푸터 DOM을 중개사 홈과 같은 `broker-home-mini-footer` 구조로 교체하고 `© REALJEJU.APP` 한 줄만 표시.
- `!important`를 추가하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.816 - Selected Side Menu Color

- 부동산ㆍ동네업체ㆍ알바ㆍ자동차가 공유하는 왼쪽 사이드 메뉴의 현재 선택 항목에 `#eef4ff` 배경을 적용.
- 선택 항목의 아이콘과 글자를 브랜드 파란색 `#2563eb`로 통일하고 기존 `6px` 곡률을 유지.
- 선택되지 않은 메뉴의 hover에는 `#f5f7fa`만 적용하며, 페이지별 선택 스타일이나 `!important`는 추가하지 않음.
- 공통 상단바, 지도, 데이터 요청과 라우팅은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.815 - Landing Notice Image Sync

- 작업 폴더의 `img/landingpage_5.jpg`가 Downloads 지정본과 다른 옛 이미지로 되돌아간 상태를 확인.
- `/Users/GHOST/Downloads/img/landingpage_5.jpg`를 작업 폴더의 공지사항 카드 배경 자산으로 그대로 동기화.
- 브라우저가 옛 그림을 재사용하지 않도록 CSS 이미지 URL을 현재 파일 해시 `6a4ba786`과 4.815 전용 캐시 키로 갱신.
- 다른 랜딩 카드, 공통 상단바와 카테고리 라우팅은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.814 - Landing Car Card

- 메인 랜딩 주요 서비스의 `중고거래` 카드를 `자동차` 카드로 교체.
- 카드 클릭 대상을 `used-market`에서 `car`로 변경하고 자동차 아이콘과 네 번째 카드 배경 선택자를 함께 연결.
- 상단 네비에서 중고거래ㆍ모임을 숨기는 기존 규칙과 다른 카테고리ㆍ공통 상단바는 변경하지 않음.
- ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.813 - Register Scroll Lock and Favorite View Counts

- 알바 공고 등록 화면이 열린 동안 문서와 뒤쪽 공고 목록의 스크롤ㆍ입력을 잠그고 등록 화면만 독립 스크롤하도록 수정.
- 관심부동산 목록이 스냅샷의 빈 조회값을 `0`으로 표시하던 문제를 수정하고, 현재 페이지 매물을 우측 상세와 같은 `get_property_engagement_counts` 통합 집계로 한 번에 조회한 뒤 매칭되지 않은 항목만 `listing_views`로 보완.
- 관리자 페이지 상단에서 `관리자 페이지 >` 선행 문구를 제거하고 관리자 메뉴 탭을 기존 제목 시작점으로 당김.
- 공통 카테고리 상단바 치수와 좌표는 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.812 - Admin Listing View Counts

- 관리자 매물관리 목록이 `property_listings`만 조회한 뒤 비어 있는 조회수 캐시를 읽어 모든 매물을 `0`으로 표시하던 문제를 수정.
- 목록 렌더 전에 `listing_views` 실제 값을 150개 단위로 분할 조회해 `매물번호`와 일치하는 조회수를 합치도록 변경.
- 실제 조회수가 없거나 0인 비삭제 매물만 15~70 범위로 채우고 저장 집계를 재동기화하는 `sql/backfill_zero_listing_views_4.812.sql`을 추가.
- 표 열 순서ㆍ간격, 공통 상단바, 지도와 다른 페이지 동작은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.811 - Local Business Broker Refresh Recovery

- `/companies` 새로고침에서 동네업체 자동 레이어가 Supabase 스크립트보다 먼저 실행되면 빈 중개사 목록을 완료 캐시로 저장하던 순서 문제를 수정.
- 중개사 위치 조회 전에 Supabase 클라이언트 준비를 기다리고, 일시적인 빈 결과나 조회 실패 시 기존의 정상 목록을 보존하며 빈 배열을 캐시하지 않도록 변경.
- 승인 중개사 조회가 아직 비어 있을 때 `broker_office_locations` 전체를 삭제된 데이터처럼 걸러 완료 처리하지 않고 다음 지도 렌더에서 재조회하도록 수정.
- 중개사 위치 데이터가 실제로 준비된 경우에만 동네업체 자동 레이어를 로드 완료로 기록.
- 공통 상단바, 다른 카테고리, 중개사 카드 디자인은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.810 - Part-time Register Bottom Alignment and Legal Links

- 알바 공고등록 하단 고정 바의 안쪽 폭과 왼쪽 좌표를 `.part-time-register-inner`의 실제 화면 좌표에 맞춰, 안내 문구와 버튼이 스크롤바 폭만큼 오른쪽으로 밀리던 현상을 수정.
- 법령 안내를 두 줄로 구성하고 둘째 줄에 국가법령정보센터의 `근로기준법`, `최저임금 관련 법령` 링크를 추가.
- 알바 공고등록 화면 외 공통 상단바, 다른 등록 화면, 지도와 데이터 요청은 변경하지 않음.
- ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.809 - Favorite Sync, Landing Reset, Shared Management Layout

- 부동산 홈에서 관심 부동산을 추가할 때 현재 매물 스냅샷을 ID와 함께 메모리에 먼저 저장해 관심부동산 페이지에 즉시 반영.
- 관심부동산에서 `REALJEJU.APP` 로고를 누르면 열린 마이페이지ㆍ관리 패널 상태를 공통 정리 함수로 닫고 랜딩 페이지만 표시하도록 수정.
- 관심부동산과 관리자 매물관리에 `조회` 열을 추가하고, 중개사 홈과 동일하게 `매물유형 / 상태 / 등록날짜 / 매물번호 / 조회 / 제목` 사이에 `30px` 공통 간격을 적용.
- 관심부동산ㆍ관리자 매물관리ㆍ중개사 홈 하단을 `© REALJEJU.APP` 한 줄과 상단 `72px`ㆍ하단 `48px` 공통 여백으로 통일.
- 관리자 매물관리 하단에 중복으로 누적되던 페이지네이션ㆍ패널ㆍ목록 셸 여백을 제거.
- 공통 상단바, 지도 레벨, 지도 표시 기준은 변경하지 않았으며 ZIP과 `localhost:5500` 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.808 - Property Refresh Cache Prime

- `/properties` 새로고침이 시작되면 기존 IndexedDB 매물 캐시를 HTML 파싱 단계부터 미리 읽어 지도 SDK와 DOM 준비 시간에 병렬 처리.
- 지도 생성 직후 저장된 매물 캐시를 먼저 적용하고, 캐시가 오래된 경우에만 기존처럼 Supabase 갱신을 백그라운드에서 수행.
- 최초 `tilesloaded` 완료를 지도 생성 시점부터 기록해 이미 끝난 이벤트를 나중에 기다리며 최대 1.2초를 소모하던 경로를 제거.
- 필터 구성, 필터 선택값, 공통 상단바, 다른 카테고리 초기화는 변경하지 않음.
- ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.807 - Broker Listing Equal Column Gaps

- 중개사 홈의 `매물번호`와 `조회`만 별도 중첩 그리드에 묶여 실제 간격이 달라지던 구조를 제거.
- `매물유형 / 상태 / 등록날짜 / 매물번호 / 조회 / 제목`을 같은 부모 그리드 열로 배치하고, 각 열 사이에 동일한 `30px` 간격 트랙을 적용.
- 기존에 같은 영역을 반복 덮던 4.783ㆍ4.795 보정 규칙을 하나의 4.807 규칙으로 정리하고 `!important`는 추가하지 않음.
- 공통 상단바, 지도, 라우팅, 다른 화면의 동작은 변경하지 않음.
- ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.806 - Jobs Refresh Data and Public ID Preview

- `/jobs` 직접 새로고침에서 알바 공고 조회가 Supabase 초기화보다 먼저 끝나 빈 목록으로 고정되던 순서 문제를 수정.
- 알바 공고는 해당 페이지의 필수 데이터이므로 `/jobs` 진입에서만 Supabase 클라이언트 준비를 기다린 뒤 조회.
- 중개사무소 화면의 `중개사 외부공유 아이디` 명칭을 `외부공유 아이디`로 변경.
- 중복 확인 아래 `/properties?agency=ID` 미리보기는 기존 파란색을 유지하면서 이동하지 않는 일반 텍스트로 변경.
- 공통 상단바 위치ㆍ치수와 다른 카테고리 초기화는 변경하지 않음.
- ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.805 - Property Refresh First Paint and External Broker ID

- 중개사무소 화면의 `공유 ID` 명칭을 `중개사 외부공유 아이디`로 통일.
- `agencies.public_id` DB 마이그레이션이 설치되지 않은 상태에서 지도 중개사 조회가 선택 컬럼을 두 번 시험하며 400을 만들던 요청을 제거.
- `/properties` 직접 새로고침 시 매물 초기 데이터와 지도 타일이 준비될 때까지 라우트 가드를 유지해 필터바와 빈 지도 화면이 먼저 나타나는 현상을 방지.
- 공지 미리보기, 방문통계, 관심매물 동기화와 휴지통 정리를 첫 부동산 화면 이후 유휴 시간으로 지연.
- 공통 상단바 위치ㆍ치수와 다른 카테고리 초기화는 변경하지 않음.
- JavaScript 문법 검사와 진입 파일 버전ㆍ해시 검사를 수행하고 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.804 - Landing Refresh and Route Entry Sync

- 랜딩 URL과 버전 HTML에서는 부동산 매물 데이터를 미리 불러오지 않도록 제한해 새로고침 시 `/properties`로 바뀌는 문제를 수정.
- 사용자가 실제로 부동산 홈에 진입할 때 매물 데이터를 불러오도록 진입 흐름을 보완.
- `index.html`, `404.html`, 모든 `menu_routes/*/index.html`을 4.804 완료본과 동일하게 동기화해 경로 새로고침 시 4.803으로 되돌아가던 문제를 수정.
- JavaScript 문법과 모든 진입 파일의 버전 참조ㆍ해시 일치를 검사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.803 - Broker Badge Shared-ID Scope

- 4.802에서 공유 ID 함수가 `initEvents()` 내부에만 선언되어 지도 중개사 뱃지 렌더링이 `ReferenceError`로 중단되던 문제를 수정.
- 공유 ID 정규화ㆍ조회ㆍ표시 함수를 앱 셸 이벤트 초기화 시작 시 공용으로 등록해 동네업체 중개사 뱃지, 최근조회 카드, 중개사무소 정보가 같은 구현을 사용하도록 복구.
- 지도 좌표, 뱃지 노출 단계, 카드 디자인, 공통 상단바 규칙은 변경하지 않음.
- JavaScript 문법 검사를 통과했으며 사용자 지시에 따라 `localhost:5500` 실행 및 화면 확인은 수행하지 않음.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.802 - Companies Initial Route Prime and Menu Routes

- `/companies`, `/companies/`, `/companies/index.html`을 공통 초기 카테고리 경로 표에서 `local-business`로 선적용.
- 본문 파싱 즉시 동네업체 모드와 필터 메뉴 숨김 상태를 설정해 부동산 필터가 먼저 나타나는 새로고침 플래시를 제거.
- 앱 또는 지도 데이터 준비가 늦을 때도 대기 라우트 초기화가 같은 카테고리 상태를 유지하도록 보강.
- `/properties`, `/jobs`, `/used`, `/cars`, `/meetups`도 같은 초기 경로 표를 사용하며 기존 알바 초기 상태를 보존.
- 프로젝트의 `admin`, `mypage`, `notices`, `cars`, `companies`, `jobs`, `properties`, `used`, `meetups` 폴더를 루트에서 `menu_routes/` 아래로 이동.
- 로컬 SPA 서버와 Vercel rewrite가 깨끗한 URL을 `menu_routes/<route>/index.html`로 연결하도록 변경하고, 중첩 경로를 직접 연 경우도 동일 라우트로 정규화.
- 사용자 지시에 따라 `localhost:5500` 실행 및 화면 확인은 수행하지 않음.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.801 - Panel Collapse Animation Sync

- 왼쪽 목록ㆍ오른쪽 상세 패널 옆 접기 버튼의 위치 이동을 `left`에서 패널과 동일한 GPU `transform 280ms` 애니메이션으로 변경.
- 접기ㆍ펼치기 클릭 즉시 최대 10회 가까이 실행되던 지도 재배치를 제거하고, 패널 이동 완료 후 단일 `relayout()`만 실행하도록 동기화.
- 패널 크기와 최종 위치, 펼침ㆍ접힘 상태는 기존과 동일하게 유지.
- 사용자 지시에 따라 `localhost:5500` 응답 및 화면 확인은 수행하지 않음.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-18 / Version 4.800 - Jobs Refresh Route and Agency Public ID

- `/jobs`, `/jobs/`, `/jobs/index.html`을 같은 알바 라우트로 정규화하고 HTML 초기 단계에서 알바 페이지 상태를 먼저 적용해 새로고침 시 부동산 홈으로 바뀌는 문제를 수정.
- 알바 등 비부동산 라우트에서는 초기 부동산 매물 지도 데이터 요청을 건너뛰도록 초기 로딩 범위를 제한.
- 프로젝트와 실제 배포본의 `jobs/`, `properties/` 등 라우트 폴더는 깨끗한 URL을 위해 루트에 유지하고, Downloads에서만 `menu_routes/` 아래에 배포 준비본을 모으는 규칙을 확정.
- 중개사무소 정보 이메일 아래에 짧은 `공유 ID` 입력, 중복 확인, 공유 URL 미리보기를 추가.
- 중개사 공유 링크를 `/properties?agency=<public_id>`로 만들고, 해당 URL로 진입하면 부동산 홈에서 중개사 카드와 매물 목록을 복원하도록 연결.
- `agencies.public_id` 형식ㆍ대소문자 무관 중복ㆍ일반 사용자 최초 1회 설정을 DB에서 강제하는 `sql/agency_public_id_4.800.sql` 추가. 기존 UUID/구형 공유 링크는 호환 유지.
- 서버 업로드 ZIP은 생성하지 않음.
- 사용자 지시에 따라 `localhost:5500` 응답 및 화면 확인은 수행하지 않음.

## 2026-07-18 / Version 4.799 - Authoritative Work Instructions

- 반복 수정에서 반드시 먼저 읽을 단일 기준 문서 `REALJEJU_INSTRUCTIONS.md`를 추가.
- 왼쪽 매물 목록은 선택 전 흰색, 현재 선택한 한 칸만 회색이라는 고정 규칙과 기존 확정 UXㆍ라우팅ㆍ배포 규칙을 기록.
- 후속 작업이 기준 문서를 놓치지 않도록 저장소 진입 지침 `AGENTS.md`를 추가.
- 런타임 UI 동작은 변경하지 않음.
- `5500` 서버 응답 및 화면 확인은 수행하지 않고 Downloads에 개별 파일만 복사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-16 / Version 4.676 - Profile Edit Top Background

- 내 정보 수정 등 정보 계열 페이지에서 상단 네비게이션이 스크롤된 뒤 드러나던 흰색 여백을 제거.
- 회색 콘텐츠 배경을 상단바 뒤까지 연장해 스크롤 중에도 배경이 끊기지 않도록 조정.
- 내 정보ㆍ수정ㆍ중개사무소 정보ㆍ수정의 푸터를 결제 페이지와 동일한 상단 40pxㆍ하단 60px로 고정하고, 짧은 화면의 남는 높이는 푸터 뒤가 아닌 콘텐츠 구간에서 채우도록 변경.
- `5500` 서버 응답 확인은 수행하지 않고 다운로드 폴더에 개별 파일만 복사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-16 / Version 4.675 - Shared Scrollable Page Header

- 내 정보ㆍ내 정보 수정ㆍ중개사무소 정보ㆍ중개사무소 수정ㆍ이용권 결제ㆍ1:1 문의내역의 상단 네비게이션을 본문과 함께 스크롤하도록 공통화.
- 알바 페이지도 목록 스크롤 시 상단 네비게이션과 우측 계정 메뉴가 함께 올라가도록 변경.
- 내 정보 계열 패널의 고우선순위 회색 배경과 `100vmax` 확장을 제거하고, 회색은 콘텐츠 구간에만 표시하며 푸터와 종료 영역은 흰색으로 통일.
- 내 정보 수정 및 중개사무소 정보 카드 내부는 흰색으로 유지.
- `5500` 서버 응답 확인은 수행하지 않고 다운로드 폴더에 개별 파일만 복사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.674 - Scrollable My Info Topbar

- 내 정보 페이지의 상단 네비게이션과 우측 프로필 메뉴가 패널 스크롤을 따라 함께 위로 사라지도록 변경.
- 패널을 화면 최상단부터 스크롤하게 하고 기존 콘텐츠 시작 위치는 상단바 높이만큼 내부 여백으로 유지.
- `5500` 서버 응답 확인은 수행하지 않고 다운로드 폴더에 개별 파일만 복사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.673 - Shared Footer Rhythm

- 모든 마이페이지 마지막 요소 아래 32px, 푸터 상단 40pxㆍ하단 60px으로 고정하고 푸터 flex 자동 확장과 흰색 페인트 제거.
- 내 정보 수정 패널 배경을 회색, 입력 카드 내부를 흰색으로 강제.
- 회원유형 선택값 왼쪽 패딩을 10px로 재조정해 일반 입력값 시작선과 정렬.
- 이용권 결제 외곽 폭을 1184px로 조정해 좌우 32px 내부 패딩을 제외한 실제 본문 1120px을 푸터 본문과 일치시킴.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.672 - Account Actions and Inquiry Layout

- 중개사무소 정보 하단은 수정 버튼만 유지하고 중개사무소 수정 하단은 취소ㆍ저장 순서로 변경.
- 중개사무소 위치 저장 함수를 전역 연결해 수정 저장 시 ReferenceError 제거.
- 내 정보 수정 페이지 바탕을 회색으로 고정하고 입력 카드만 흰색 유지.
- 이용권 결제 본문 폭을 공통 푸터 본문과 같은 1120px로 고정.
- 1:1 문의 제목ㆍ설명을 목록 박스 위로 분리하고 질문 행은 개별 외곽 박스 없이 구분선만 유지.
- 공통 푸터 아래는 레이아웃 높이를 늘리지 않는 흰색 페인트로 회색 노출 차단.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.671 - Account Common Geometry

- 마이페이지 패널 높이를 상단바 아래 실제 뷰포트 높이로 고정하고 푸터 뒤 하단 높이ㆍ패딩 제거.
- 내 정보와 내 정보 수정은 콘텐츠 구간에만 회색 배경을 표시하도록 범위 제한.
- 이용권 결제 폭을 공통 푸터 본문 폭 1120px에 맞추고 제목 시작 높이와 박스 하단 32px 간격 통일.
- 마이페이지에서 지도 확대ㆍ축소ㆍ현위치 도구 완전 숨김.
- 회원유형 선택값 왼쪽선을 다른 입력값과 맞추고 우측 마이페이지 메뉴를 15pxㆍ500 굵기로 조정.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.670 - Account Background Boundary

- 마이페이지 회색 배경을 콘텐츠 구간까지만 표시하고 공통 푸터부터 화면 바닥까지 흰색으로 분리.
- 내 정보 수정 배경을 내 정보와 같은 회색으로 통일.
- 이용권 결제 콘텐츠 박스 아래 공통 32px 간격 추가.
- 우측 상단 마이페이지 메뉴 글자를 실제 상단 네비와 맞는 15px로 조정.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.669 - Unified My Page Cards

- 내 정보ㆍ내 정보 수정ㆍ중개사무소 정보ㆍ중개사무소 수정ㆍ이용권 결제ㆍ1:1 문의내역을 연회색 페이지와 흰색 1px 외곽 콘텐츠 박스 구조로 통일.
- 마이페이지 공통 푸터를 남은 화면 높이까지 흰색으로 확장해 푸터 아래 회색 잔여 영역 제거.
- 마이페이지 패널의 세로 스크롤 기능은 유지하면서 우측 스크롤바 트랙만 숨김.
- 우측 상단 마이페이지 드롭다운 글자를 상단 네비 글자 크기로 확대.
- 내 정보 회원탈퇴 안내 위 구분선 제거.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.668 - Account Page Root Fix

- 이용권 결제 진입 시 이전 중개사무소 정보 패널이 남던 문제를 페이지 초기화 대상 누락으로 확인하고 수정.
- 내 정보ㆍ문의내역 부모의 기존 `min-height`와 flex 자동 확장을 ID 기준 최종 규칙으로 해제.
- 마이페이지 마지막 요소 아래 32px, 푸터 내부 상단 40pxㆍ하단 60px만 남도록 충돌 규칙 정리.
- 내 정보 페이지를 연회색 바탕과 흰색 1px 외곽 정보 박스 구조로 복원.
- 내 정보 수정의 개인정보 동의 체크박스를 정보 라벨 시작선에 정렬.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 / Version 4.667 - Account Suite Consistency

- `마이페이지 메뉴들`을 내 정보ㆍ중개사무소 정보ㆍ이용권 결제ㆍ1:1 문의내역 네 페이지로 고정.
- 네 페이지와 수정 화면의 마지막 요소 아래 여백을 공통 32px 변수로 통일.
- 마이페이지 공통 푸터가 짧은 페이지에서 아래로 밀리지 않도록 별도 자동 여백을 제거하고 랜딩ㆍ알바의 상단 40pxㆍ하단 60px 공식을 그대로 사용.
- 이용권 결제와 1:1 문의내역에서 부동산 홈 지도 우측 도구를 숨기고 공통 상단 네비는 유지.
- 중개사무소 수정 이메일을 로그인 아이디용 읽기 전용 회색 필드로 변경.
- 최근 조회 업체 없음 문구를 한 줄로 표시하고 공통 푸터 글자색을 부드러운 진회색으로 조정.
- 4.666의 내 정보ㆍ중개사무소 저장 함수 스코프 오류 수정 포함.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 22:16 KST / Version 4.666 - Shared Account Save Helpers

- 내 정보 수정 저장 시 `saveRealjejuOwnProfile is not defined`가 발생하던 스코프 오류 수정.
- 여러 인증ㆍ계정 IIFE에서 함께 사용하는 프로필 저장 함수를 파일 전역 공용 함수로 승격.
- 기존 프로필 update, 프로필 사진 컬럼 호환 재시도, 신규 프로필 insert 흐름 유지.
- 중개사무소 수정 시 `isValidRealjejuOfficePhone is not defined`가 발생하던 스코프 오류 수정.
- 중개사무소 전화번호ㆍ이메일ㆍ카카오 URL 검사와 Supabase 저장 함수를 공용화.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 22:08 KST / Version 4.665 - Account Page Layout Formula

- 내 정보ㆍ내 정보 수정ㆍ중개사무소 정보ㆍ이용권 결제ㆍ1:1 문의내역에 공통 페이지 여백 공식 적용.
- 공통 공식은 랜딩ㆍ알바와 같은 본문 최대 1120px, 최소 좌우 32px, 푸터 상단 40pxㆍ하단 60px 사용.
- 1:1 문의내역 본문을 내 정보와 같은 680px 폭으로 맞추고 제목ㆍ설명ㆍ목록 정렬과 글자 크기 통일.
- 결제 페이지는 3열 카드 때문에 1120px 본문을 유지하되 페이지 시작 여백과 푸터 기준은 동일 적용.
- 결제ㆍ문의 푸터를 내부 컨테이너에서 페이지 패널 직계 하단으로 이동해 부모 폭에 따른 좌우 계산 차이 제거.
- 짧은 계정 페이지에서도 푸터 뒤에 별도 빈 공간이 남지 않도록 공통 패널을 세로 flex 구조로 통일.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:58 KST / Version 4.664 - Broker Edit Last Row

- 중개사무소 수정 화면의 마지막 항목 `카카오 오픈 채팅방` 아래 구분선 제거.
- 나머지 입력 행 구분선과 입력칸 외곽선은 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:54 KST / Version 4.663 - Account Row Weight and Spacing

- 내 정보ㆍ내 정보 수정ㆍ중개사무소 정보ㆍ중개사무소 수정의 정보 항목명 굵기를 700에서 600으로 축소.
- 값과 입력 내용 굵기를 600에서 500으로 축소.
- 계정 정보 계열 화면의 마지막 내용 아래 공통 여백을 40px로 통일해 중개사무소 정보의 수정ㆍ닫기 버튼 아래에도 동일 적용.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:50 KST / Version 4.662 - Profile Edit Bottom Spacing

- 내 정보 수정 화면의 `취소`ㆍ`저장` 버튼 아래에 40px 여백 추가.
- 푸터 내부 여백과 분리해 수정 내용 영역과 푸터 상단선 사이 간격만 조정.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:46 KST / Version 4.661 - Account Footer Spacing

- 내 정보의 `회원탈퇴 - 리얼제주 회원을 탈퇴합니다.` 안내 아래에 40px 여백 추가.
- 계정 페이지 공통 푸터의 하단 여백을 60px에서 32px로 축소해 화면 하단의 과도한 빈 공간 제거.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:38 KST / Version 4.660 - Profile Panel Focus Release

- 내 정보의 수정 버튼에 포커스가 남은 상태로 부모 패널을 `aria-hidden` 처리하던 순서 수정.
- 내 정보ㆍ수정ㆍ중개사무소 정보 계열 전환 시 기존 패널 내부 포커스를 먼저 해제한 후 숨기도록 공통 처리.
- `Blocked aria-hidden` 접근성 경고 방지.
- 내 정보 수정 저장 시 다른 스코프의 휴대폰 검증 함수를 호출하던 `ReferenceError`를 제거하고 제출 함수 내부에서 직접 검증.
- 내 정보 수정 하단 버튼을 `취소`ㆍ`저장` 순서로 변경.
- 비밀번호 변경 완료 안내 본문을 `비밀번호가 변경되었습니다.`와 `다시 로그인해 주세요.` 두 줄로 표시.
- 중개사무소 정보ㆍ이용권 결제ㆍ1:1 문의내역을 왼쪽 메뉴 없는 독립 전체페이지 구조로 통일.
- 계정 메뉴의 이용권 결제ㆍ중개사무소 정보가 마이페이지 임시 탭으로 먼저 빠지던 라우팅 순서를 수정해 전용 페이지로 직접 이동.
- 1:1 문의내역에 전용 페이지 제목ㆍ설명을 추가하고, 결제 페이지에도 내 정보와 같은 제목 영역 적용.
- 계정 페이지 공통 푸터를 결제ㆍ문의 페이지까지 확대하고 상단 1px 구분선, 상단 40pxㆍ하단 60px 여백을 동일하게 적용.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:34 KST / Version 4.659 - Profile Edit Last Row

- 내 정보 수정 화면의 마지막 항목인 `회원유형` 아래 구분선 제거.
- 다른 정보 행 구분선과 입력칸 외곽선은 그대로 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:30 KST / Version 4.658 - Account and Terms Navigation

- 런타임에 복제되는 내 정보 공통 푸터의 이용약관 링크도 작동하도록 약관 클릭 처리를 공통 이벤트 방식으로 변경.
- 이용약관 화면에서 내 정보로 이동할 때 약관 전체화면 레이어를 먼저 닫고 내 정보 전용 페이지를 열도록 수정.
- 약관 화면을 숨기기 전에 내부 포커스를 상단 계정 메뉴로 이동해 `aria-hidden` 포커스 경고를 방지.
- 4.657의 랜딩 페이지와 동일한 계정 푸터 여백 및 마지막 정보 행 밑줄 제거를 함께 포함.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:18 KST / Version 4.657 - Exact Landing Footer Geometry

- 내 정보와 중개사무소 정보의 마지막 정보 행 아래 밑줄 제거.
- 계정 페이지 공통 푸터에 랜딩 페이지의 실제 레이아웃 값을 그대로 적용.
- 푸터 너비 `100vw`, 좌우 `calc(50% - 50vw)`, 좌우 내부 여백 `var(--realjeju-main-page-edge)`, 상단 40pxㆍ하단 60px로 통일.
- 랜딩 페이지와 동일하게 푸터 별도 상단선 및 가상 구분선 제거.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:14 KST / Version 4.656 - Compact Account Actions and Footer

- 내 정보 하단 버튼 높이를 44px에서 36px로 낮추고 좌우 패딩을 12px로 축소.
- 내 정보 화면의 중복 `중개사무소 정보` 버튼 제거.
- 계정 페이지 공통 푸터의 위ㆍ아래 여백을 랜딩 페이지와 같은 40pxㆍ60px로 통일.
- 계정 페이지 푸터 상단에 화면 전체 너비의 1px 연회색 구분선 적용.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:11 KST / Version 4.655 - Locked Account Cluster

- PC 상단 프로필ㆍ채팅ㆍ알림ㆍ9점 메뉴 묶음에 `globalTopbarRight` 고유 ID 부여.
- 페이지별 상단바 규칙보다 높은 우선순위로 우측 18pxㆍ상단 32.5pxㆍ높이 34pxㆍ간격 8px를 고정.
- 관심부동산ㆍ분양ㆍ중개사 홈 전환 시 계정 메뉴 위치와 간격이 변하지 않도록 처리.
- 9점 메뉴의 각 사각형을 `4.8px × 4.8px`로 변경.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 21:03 KST / Version 4.654 - Account Forms and Common Footer

- 비밀번호 변경 화면에 `이전 비밀번호` 입력칸을 추가하고, 기존 비밀번호 재인증 후에만 변경되도록 처리.
- 비밀번호 복구 링크로 진입한 경우에는 이전 비밀번호 입력 없이 기존 복구 흐름을 유지.
- 내 정보의 비밀번호 변경ㆍ수정 버튼과 수정 화면의 저장ㆍ닫기 버튼을 무채색 내용 맞춤형 버튼으로 통일.
- 내 정보 수정 화면의 왼쪽 예약 영역을 제거하고, 수정 가능한 입력칸은 흰색ㆍ읽기 전용 이메일은 연회색으로 구분.
- 내 정보ㆍ내 정보 수정ㆍ중개사무소 정보ㆍ수정 페이지의 개별 푸터를 랜딩 페이지 공통 푸터로 교체하고 별도 구분선 및 개인정보처리방침 빨간색 강조를 제거.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 20:55 KST / Version 4.653 - Dedicated Account Detail Pages

- `내 정보`의 수정 버튼을 흰 배경, 연회색 1px 외곽선, 진한 회색 글자의 둥근 버튼으로 통일.
- `내 정보 수정`을 왼쪽 메뉴와 외곽 카드가 없는 680px 중앙 독립 페이지로 변경.
- `중개사무소 정보`와 `중개사무소 수정`도 내 정보와 동일한 독립 페이지 구조로 통일.
- 정보 페이지의 중개사무소 수정 버튼도 같은 외곽선 버튼 스타일로 적용.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 20:45 KST / Version 4.652 - Viewport Account Layer

- PC 프로필ㆍ채팅ㆍ알림ㆍ9점 묶음을 페이지별 상단바 내부에서 `body` 직속 고정 레이어로 이동.
- 랜딩 페이지 기준 우측 18px, 상단 32.5px, 높이 34px를 모든 페이지에서 유지.
- 화면 폭이 모바일로 바뀌면 원래 상단바 위치로 자동 복귀.
- 9점 메뉴와 상단 프로필 사진의 `내 정보`를 관심부동산 마이페이지에서 분리.
- 내 정보 진입 시 기존 화면ㆍ패널ㆍ상세ㆍ필터 상태를 닫고 독립 내 정보 전용 화면만 표시.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 20:21 KST / Version 4.651 - Viewport Fixed Account Cluster

- PC 우측 상단 계정 묶음을 부모 컨테이너 기준 `absolute`에서 화면 기준 `fixed`로 변경.
- 랜딩 페이지와 동일하게 우측 18px, 상단바 중앙 32.5px, 전체 높이 34px로 고정.
- 관심부동산ㆍ분양ㆍ중개사 홈ㆍ관리자 페이지의 부모 레이아웃 차이로 발생하던 위치 이동 제거.
- 모바일 배치는 기존 상태 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 20:15 KST / Version 4.650 - Account Menu Focus Safety

- 9점 마이페이지 메뉴를 닫기 전에 내부 포커스를 9점 버튼으로 반환.
- 포커스 반환이 불가능한 경우 내부 활성 버튼을 `blur()` 처리.
- 닫힌 메뉴에 `inert`를 먼저 적용한 뒤 `aria-hidden="true"`로 변경.
- 메뉴를 열 때는 `inert`를 제거한 후 표시해 키보드 접근을 복원.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 20:10 KST / Version 4.649 - Visible My Info Panel Selector

- 실제 열린 `#myInfoPagePanel[aria-hidden="false"]`을 직접 기준으로 내 정보 화면 스타일 적용.
- body 화면 상태가 바뀌어도 `내 정보` 제목과 설명이 표시되도록 수정.
- 왼쪽 예약 영역을 제거하고 680px 내용을 전체 화면 중앙에 배치.
- 패널ㆍ중앙 컨테이너ㆍ정보 카드 외곽선을 제거.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 19:34 KST / Version 4.648 - My Info Title And Frameless Layout

- PC 내 정보 화면에서 `내 정보` 제목의 표시ㆍ가시성ㆍ높이를 최종 규칙으로 고정.
- 패널ㆍ중앙 컨테이너ㆍ정보 카드의 외곽선, 배경, 그림자를 모두 제거.
- 컨테이너와 카드 가상요소로 생길 수 있는 외곽선도 제거.
- 모바일 배치는 기존 상태 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 19:28 KST / Version 4.647 - Fixed Account Cluster

- 랜딩 페이지의 우측 상단 위치를 기준으로 PC 전 메뉴의 계정 컨트롤 묶음을 우측 18px에 고정.
- 프로필ㆍ채팅ㆍ알림ㆍ9점 버튼 묶음의 높이를 34px, 간격을 8px로 통일.
- 프로필 이미지는 30px로 고정해 관심부동산ㆍ분양ㆍ중개사 홈ㆍ매물 등록ㆍ관리자ㆍ공지사항 전환 시 크기와 위치가 변하지 않도록 처리.
- 모바일 상단 배치는 기존 상태 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 17:18 KST / Version 4.646 - Centered Borderless My Info

- PC 내 정보 화면에서 왼쪽 사이드 내비게이션과 예약 폭을 제거.
- 내 정보 패널을 전체 화면 폭으로 복원하고 680px 폼을 중앙 정렬.
- 숨겨졌던 `내 정보` 제목과 설명을 다시 표시.
- 폼 전체를 감싸던 큰 외곽선ㆍ배경ㆍ안쪽 여백을 제거하고 입력칸 외곽선만 유지.
- 회원탈퇴 영역 위에 1px 옅은 구분선 추가.
- 모바일 아코디언과 모바일 배치는 기존 상태 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 17:10 KST / Version 4.645 - Equal Icon Bounds

- Font Awesome 채팅 아이콘을 전용 SVG로 교체해 종과 동일한 렌더링 기준 사용.
- 채팅ㆍ종은 24×24 SVG 안에서 중심 경로를 `x/y 3~21`에 두고 1.9px 선 외곽까지 약 20×20px로 통일.
- 두 아이콘의 선을 1.9px로 통일하고 9점 메뉴의 20×20px 외곽과 상하선을 맞춤.
- 종 추는 몸체 하단선 17.5에서 공통 검은 하단선 약 22까지 내려오도록 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 17:06 KST / Version 4.644 - Rounded Bell Edges

- 종 몸체와 하단 수평선을 별도 경로로 분리.
- `stroke-linecap: round`가 양옆 끝에 직접 적용되도록 만들어 날카로운 모서리를 둥글게 정리.
- 선 굵기와 하단 추의 크기는 4.643 설정을 유지.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 17:03 KST / Version 4.643 - Thin And Deeper Bell

- 종 선 굵기를 `2.5px`에서 `1.9px`로 낮춰 채팅 아이콘 선과 통일.
- 종 하단 추의 폭은 유지하고 세로 반경을 3.25px에서 4.25px로 늘려 1px 더 아래로 연장.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 17:00 KST / Version 4.642 - Bell Stroke And Clapper

- 종 선 굵기를 `2.15px`에서 `2.5px`로 높여 채팅 아이콘 외곽선과 시각적으로 맞춤.
- 종 하단 추의 폭을 5px에서 6.5px로, 내려오는 깊이를 2.5px에서 3.25px로 확대.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 16:56 KST / Version 4.641 - Balanced Custom Bell

- 알림 종을 예시처럼 수평 하단과 작은 추가 있는 전용 SVG 도형으로 다시 그림.
- SVG 박스를 24px로 확대하고 선 굵기를 2.15로 조정해 채팅ㆍ9점 아이콘의 실제 표시 외곽과 통일.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 16:49 KST / Version 4.640 - Custom Bell And Larger Nine Dots

- 9점 메뉴의 각 사각형을 `4.5px`에서 `5px`로 확대하고 간격을 조정해 전체 20px 크기는 유지.
- 채팅과 9점 메뉴 사이에 Font Awesome 대신 직접 그린 20px 선형 종 알림 버튼 추가.
- 채팅ㆍ알림 패널을 분리하고 다른 우측 드롭다운 및 지도 패널과 동시에 열리지 않도록 연결.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 16:43 KST / Version 4.639 - Chat Icon Up 1px

- `comment-dots`의 수직 이동값을 `0.5px`에서 `-0.5px`로 바꿔 정확히 1px 위로 이동.
- 크기와 나머지 상단 메뉴 배치는 유지.
- 번들 Node.js 문법 검사 후 다운로드 폴더에 개별 파일 복사.
- 서버 업로드 ZIP은 생성하지 않음.

## 2026-07-15 16:38 KST / Version 4.638 - Pixel Matched Topbar Icons

### 수정 내용
- 확대 이미지 측정값에 따라 `comment-dots`를 1px 아래로 이동한다.
- 말풍선 가로ㆍ세로 비율을 `scaleX(0.98) scaleY(1.16)`으로 조정해 9점 메뉴의 39×39px 실제 외곽에 맞춘다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.638.js` 문법 검사 통과.

## 2026-07-15 16:32 KST / Version 4.637 - Lower Comment Dots 1px

### 수정 내용
- `comment-dots`의 수직 이동값을 `-1.5px`에서 `-0.5px`로 변경해 1px 아래로 내린다.
- 아이콘과 9점 크기, 버튼 영역, 우측 위치, 드롭다운 동작은 그대로 유지한다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.637.js` 문법 검사 통과.

## 2026-07-15 16:28 KST / Version 4.636 - Centered Topbar Icons

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.636.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.636.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.636.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.636.html
- /Users/GHOST/Downloads/css/base_4.636.css
- /Users/GHOST/Downloads/js/app_4.636.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.635에서 맞춘 말풍선과 9점 메뉴의 크기는 그대로 유지한다.
- 아래로 내려가 보이던 `comment-dots` 글리프를 1.5px 위로 이동한다.
- 세로 확대 기준을 위쪽에서 정중앙으로 변경해 9점 메뉴와 위ㆍ아래 중심선을 맞춘다.
- 버튼 클릭 영역ㆍ우측 위치ㆍ드롭다운 동작은 변경하지 않는다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.636.js` 문법 검사 통과.
- 5500 화면의 4.636 CSSOM에서 중앙 확대 기준과 -1.5px 수직 보정 규칙을 확인했다.

## 2026-07-15 16:19 KST / Version 4.635 - Balanced Topbar Icon Height

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.635.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.635.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.635.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.635.html
- /Users/GHOST/Downloads/css/base_4.635.css
- /Users/GHOST/Downloads/js/app_4.635.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 9점 메뉴의 각 사각형을 4px에서 4.5px로 키우고 전체 표시 영역을 20×20px로 조정한다.
- `comment-dots` 아이콘도 20×20px로 키우고 `scaleX(0.95) scaleY(1.10)`으로 도형 비율을 보정한다.
- 말풍선 글리프의 확대 기준을 위쪽 중앙으로 잡아 아래쪽 빈 공간을 채우고 9점 전체 높이와 맞춘다.
- 두 버튼의 34px 클릭 영역과 우측 18px 고정 위치는 유지한다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.635.js` 문법 검사 통과.
- 5500 화면의 4.635 CSSOM에서 20px 아이콘 영역과 4.5px 사각형 9개 규칙을 확인했다.
- 말풍선의 `scaleX(0.95) scaleY(1.10)` 및 위쪽 중앙 확대 기준이 적용된 것을 확인했다.

## 2026-07-15 16:09 KST / Version 4.634 - Square Comment Dots Ratio

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.634.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.634.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.634.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.634.html
- /Users/GHOST/Downloads/css/base_4.634.css
- /Users/GHOST/Downloads/js/app_4.634.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- `comment-dots` 알림 아이콘의 18×18px 바깥 박스와 34px 버튼 크기는 유지한다.
- 말풍선 글리프에 `scaleX(0.86)`을 적용해 좌우로 길어 보이던 비율을 정사각형에 가깝게 보정한다.
- 프로필ㆍ알림ㆍ9점 메뉴 위치와 드롭다운 동작은 변경하지 않는다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.634.js` 문법 검사 통과.
- 5500 화면의 4.634 CSSOM에서 `comment-dots`의 `scaleX(0.86)` 비율 보정 규칙을 확인했다.
- 18×18px 아이콘 박스와 34px 버튼 규칙이 유지되는 것을 확인했다.

## 2026-07-15 16:04 KST / Version 4.633 - Comment Dots Notification Icon

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.633.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.633.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.633.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.633.html
- /Users/GHOST/Downloads/css/base_4.633.css
- /Users/GHOST/Downloads/js/app_4.633.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 우측 상단 알림 아이콘을 종 모양에서 Font Awesome Classic Regular `comment-dots`로 변경한다.
- 알림 버튼은 9점 메뉴와 같은 34px 크기를 유지한다.
- `comment-dots` 아이콘의 실제 표시 박스를 9점 묶음과 같은 18×18px로 고정하고 수평ㆍ수직 중앙 정렬한다.
- 4.632의 우측 18px 위치 고정과 알림ㆍ9점 메뉴 배타 동작을 그대로 유지한다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.633.js` 문법 검사 통과.
- 5500 화면에서 `fa-regular fa-comment-dots` 클래스와 4.633 CSS 로드를 확인했다.
- CSSOM에서 아이콘의 18×18px 표시 박스와 중앙 정렬 규칙을 확인했다.

## 2026-07-15 15:51 KST / Version 4.632 - Topbar Notification + Stable Account Position

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.632.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.632.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.632.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.632.html
- /Users/GHOST/Downloads/css/base_4.632.css
- /Users/GHOST/Downloads/js/app_4.632.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 로그인 상태의 우측 상단 9점 메뉴 왼쪽에 같은 34px 크기의 알림 종 버튼을 추가한다.
- 종 버튼을 누르면 `알림` 패널과 `새로운 알림이 없습니다.` 빈 상태를 표시한다.
- 알림ㆍ9점 메뉴ㆍ지도 도구 드롭다운은 하나를 열면 기존에 열린 메뉴가 닫히도록 배타 동작을 공유한다.
- 닫힌 알림 패널에는 `inert`와 `aria-hidden`을 함께 적용하고 내부 포커스를 먼저 회수한다.
- 부동산 홈ㆍ관심 부동산ㆍ분양ㆍ중개사 홈에서 프로필ㆍ알림ㆍ9점 묶음의 오른쪽 좌표를 현재 부동산 홈 기준 18px로 고정한다.
- 모바일에서는 기존 9점 메뉴와 같이 상단 알림 버튼과 패널을 숨긴다.
- 서버 업로드 ZIP은 생성하지 않는다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.632.js` 문법 검사 통과.
- 4.632 화면에서 알림 버튼 DOM, 닫힌 패널의 `inert`ㆍ`aria-hidden`, 로그인 상태 동기화로 추가되는 `aria-hidden` 값을 확인했다.
- 부동산 홈과 분양 화면에서 우측 상단 묶음의 계산 좌표가 모두 화면 오른쪽 18px인 것을 확인했다.
- 관심 부동산ㆍ중개사 홈도 같은 마지막 CSS 선택자와 18px 고정값을 사용하며 알림ㆍ9점 버튼은 각각 34px 공통 규칙을 사용한다.
- 알림과 9점 메뉴 토글이 공통 배타 닫기 함수에 연결되고 지도 도구 클릭 시 두 메뉴가 닫히는 실행 경로를 확인했다.

## 2026-07-15 15:21 KST / Version 4.631 - Category Recent Views + Natural Ellipsis

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.631.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.631.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.631.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.631.html
- /Users/GHOST/Downloads/css/base_4.631.css
- /Users/GHOST/Downloads/js/app_4.631.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 최근 조회 저장소와 빈 상태 문구를 부동산ㆍ동네업체ㆍ알바ㆍ중고거래ㆍ자동차ㆍ모임별로 분리한다.
- 부동산 최근 매물은 부동산 카테고리에서만 표시하고 다른 카테고리로 이동하면 해당 카테고리 기록만 렌더링한다.
- 알바 상세 조회와 동네업체의 중개업체ㆍ대형마트ㆍ편의시설 지도 항목 클릭을 해당 카테고리 최근 조회에 기록한다.
- 중고거래ㆍ자동차ㆍ모임은 독립 저장소와 공용 기록 API를 준비하고, 현재 상세 화면이 없는 동안에는 카테고리별 빈 상태를 표시한다.
- 최근 조회 제목은 실제 폭에서 말줄임표 공간을 먼저 확보하고 공백ㆍ`|`ㆍ`/`ㆍ괄호 경계를 우선해 자른 뒤 `…`를 표시한다.
- CSS의 최근 조회 `text-overflow`도 `clip`에서 `ellipsis`로 바꿔 글자가 잘린 채 끝나지 않게 한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.631.js` 문법 검사 통과.
- 부동산에서 기존 매물 최근 조회 표시, 동네업체ㆍ알바ㆍ중고거래ㆍ자동차에서 부동산 기록 미표시를 확인했다.
- 긴 제목 예시가 단어 또는 구분자 경계에서 `…`로 끝나며 요소 폭을 넘지 않는 것을 확인했다.

## 2026-07-15 14:58 KST / Version 4.630 - Landing Focus and Inert Accessibility

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.630.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.630.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.630.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.630.html
- /Users/GHOST/Downloads/css/base_4.630.css
- /Users/GHOST/Downloads/js/app_4.630.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 랜딩 화면을 닫기 전에 내부의 활성 버튼 포커스를 먼저 해제한다.
- 닫힌 랜딩에는 `inert`를 먼저 적용한 뒤 `aria-hidden="true"`를 설정해 숨겨진 내부 컨트롤이 포커스를 다시 받지 않게 한다.
- 랜딩을 다시 열 때는 `inert`를 먼저 제거하고 `aria-hidden="false"`로 복원한다.
- 최초 랜딩 상태 동기화에도 같은 접근성 상태 관리 함수를 사용한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.630.js` 문법 검사 통과.
- 공지사항 행 버튼을 포커스한 뒤 열어도 랜딩 내부에 포커스가 남지 않고 `inert`와 `aria-hidden`이 함께 적용되는 것을 확인했다.
- 브라우저 콘솔에서 랜딩의 포커스 후손 관련 `Blocked aria-hidden` 경고가 다시 발생하지 않는 것을 확인했다.

## 2026-07-15 14:51 KST / Version 4.629 - Hide PC Side Account Before Login

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.629.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.629.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.629.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.629.html
- /Users/GHOST/Downloads/css/base_4.629.css
- /Users/GHOST/Downloads/js/app_4.629.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- PC 761px 이상에서는 로그인 여부와 관계없이 왼쪽 `로그인 · 회원가입` 및 프로필 계정 영역을 항상 숨긴다.
- 모바일 760px 이하에서는 기존 왼쪽 계정 아코디언을 계속 표시한다.
- 중개사 홈 아래의 계정 영역 앞쪽 구분선은 유지하고 숨긴 계정 영역 뒤쪽 중복 구분선만 숨긴다.
- 4.628의 새 공지사항 배경 이미지 해시와 5500번 캐시 금지 서버 설정을 유지한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.629.js` 문법 검사 통과.
- PC 로그아웃 상태에서 왼쪽 계정 영역 숨김과 중개사 홈 아래 구분선 표시를 확인했다.
- 모바일용 미디어 규칙에는 왼쪽 계정 아코디언 표시 동작이 유지되는 것을 확인했다.

## 2026-07-15 14:46 KST / Version 4.628 - Notice Image Content Hash

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.628.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.628.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.628.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.628.html
- /Users/GHOST/Downloads/css/base_4.628.css
- /Users/GHOST/Downloads/js/app_4.628.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/img/landingpage_5.jpg

### 수정 내용
- 공지사항 배경 이미지 URL에 현재 파일 해시 `6a4ba786`을 포함해 4.627에서 저장된 예전 액자 이미지 캐시와 완전히 분리한다.
- 5500번 다운로드 폴더 서버가 `Cache-Control: no-store`를 반환하도록 실행해 로컬 이미지 교체본을 캐시에 남기지 않는다.
- 4.627의 중개사 홈 아래 구분선 복원과 계정명 말줄임 동작을 유지한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.628.js` 문법 검사 통과.
- `localhost:5500`에서 4.628 CSS가 `landingpage_5.jpg?v=6a4ba786-20260715-4628`을 요청하는 것을 확인했다.
- 5500번 이미지 응답 해시가 다운로드 폴더 원본과 일치하고 액자 없는 흰 벽 이미지로 표시되는 것을 확인했다.

## 2026-07-15 14:27 KST / Version 4.627 - Restore Broker Home Divider

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.627.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.627.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.627.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.627.html
- /Users/GHOST/Downloads/css/base_4.627.css
- /Users/GHOST/Downloads/js/app_4.627.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- PC에서 왼쪽 프로필 계정 영역을 숨기더라도 중개사 홈 바로 아래의 기존 구분선은 유지한다.
- 숨긴 계정 영역 뒤쪽의 중복 구분선만 계속 숨겨 최근 조회 영역과의 간격은 기존대로 유지한다.
- 임시로 사용하던 5501번 서버를 종료하고 `/Users/GHOST/Downloads`를 루트로 하는 5500번 서버를 실행한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.627.js` 문법 검사 통과.
- PC 계정 상태에서 중개사 홈 아래 구분선 표시, 왼쪽 프로필 영역과 뒤쪽 중복 구분선 숨김을 확인했다.
- `http://localhost:5500/realjeju_4.627.html` HTTP 200과 새 5번 이미지 응답 해시 일치를 확인했다.

## 2026-07-15 14:21 KST / Version 4.626 - Account Ellipsis + Landing Notice Image Refresh

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.626.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.626.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.626.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.626.html
- /Users/GHOST/Downloads/css/base_4.626.css
- /Users/GHOST/Downloads/js/app_4.626.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/img/landingpage_5.jpg

### 수정 내용
- 우측 상단 중개사무소명 또는 회원명이 10글자를 넘으면 앞 10글자 뒤에 `…`를 표시한다.
- 전체 명칭은 기존처럼 `title`과 접근성 이름에 보존한다.
- 액자가 없는 새 `Downloads/img/landingpage_5.jpg`가 이전 이미지 캐시에 가리지 않도록 전용 캐시 키를 적용한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.626.js` 문법 검사 통과.
- 10글자 이하에는 말줄임표가 없고 10글자를 넘을 때만 `…`가 붙는 것을 확인했다.
- 다운로드 폴더의 새 5번 이미지가 300×256 JPEG이며 새 캐시 URL로 응답되는 것을 확인했다.

## 2026-07-15 14:12 KST / Version 4.625 - Exclusive Floating Menus + Download Image Refresh

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.625.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.625.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.625.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.625.html
- /Users/GHOST/Downloads/css/base_4.625.css
- /Users/GHOST/Downloads/js/app_4.625.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 최근 조회 매물 제목을 실제 표시 폭으로 측정하고 `/`, `|`, 괄호, 공백 등 자연스러운 문장 경계에서 한 줄로 줄인다.
- PC에서는 왼쪽 프로필 계정 영역을 숨기고 모바일에서는 기존 계정 아코디언을 유지한다.
- 우측 상단 계정 명칭은 최대 10글자만 표시하고 전체 명칭은 툴팁과 접근성 이름에 보존한다.
- 계정 9점 메뉴를 최상위로 표시하며, 계정 메뉴ㆍ지도 종류ㆍ교육ㆍ편의ㆍ개발ㆍ중개 패널 중 하나를 열면 나머지를 닫는다.
- 랜딩 공지사항 카드의 5번 이미지 주소와 CSSㆍJS 캐시 키를 갱신해 `Downloads/img/landingpage_5.jpg` 교체본을 즉시 다시 요청한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.625.js` 문법 검사 통과.
- 최근 조회 예시 4건이 각각 자연스러운 문장 경계에서 잘리고 지정 폭 안에 들어가는 것을 확인했다.
- 다운로드 폴더의 `landingpage_5.jpg`가 작업 폴더 이미지와 다른 새 파일이며 새 캐시 URL로 요청되는 것을 확인했다.

## 2026-07-15 13:23 KST / Version 4.624 - Responsive Account Navigation

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.624.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.624.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.624.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.624.html
- /Users/GHOST/Downloads/css/base_4.624.css
- /Users/GHOST/Downloads/js/app_4.624.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/img/landingpage_5.jpg

### 수정 내용
- 4.623 기준으로 4.624 버전을 생성했다.
- 로그인 상태의 우측 상단을 `프로필 사진 + 중개사무소 명칭`으로 변경하고, 사무소명이 없을 때는 회원 이름, 이름도 없을 때만 이메일을 표시한다.
- 로그인 상태에서 표시하던 `Ver 4.xxx` 문구를 계정 명칭으로 교체했다.
- PC 761px 이상에서는 우측 상단 9점 메뉴만 사용하고 왼쪽 계정 아코디언의 화살표와 메뉴를 숨겼다.
- 모바일 760px 이하에서는 우측 9점 메뉴를 숨기고 왼쪽 계정 아코디언을 유지했다.
- 화면 폭이 PC와 모바일 경계를 오갈 때 반대쪽에 열려 있던 계정 메뉴를 자동으로 닫도록 했다.
- 9점 버튼은 마우스 오버ㆍ포커스ㆍ열림 상태에도 색상, 배경, 외곽선이 변하지 않게 했다.
- 우측 드롭다운의 개별 메뉴 카드 테두리와 배경을 제거하고 아이콘과 텍스트만 세로로 표시했다.
- 배포본이 `Downloads/img/`에서 랜딩 이미지 1~5를 모두 읽을 수 있도록 누락된 `landingpage_5.jpg`를 다운로드 폴더에 추가했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.624.js` 문법 검사 통과.
- 1280px PC에서 9점 버튼 표시, 왼쪽 화살표ㆍ아코디언 숨김, 사무소명 표시를 확인했다.
- 9점 버튼 호버 전후가 외곽선 0px, 투명 배경, 동일한 진회색으로 유지되는 것을 확인했다.
- 드롭다운 메뉴 항목이 테두리 0px, 투명 배경, 44px 높이의 아이콘ㆍ텍스트 행으로 표시되는 것을 확인했다.
- 390px 모바일에서 9점 버튼ㆍ드롭다운 숨김, 왼쪽 화살표ㆍ아코디언 표시를 확인했다.
- `/Users/GHOST/Downloads/img/landingpage_1.jpg`부터 `landingpage_5.jpg`까지 모두 존재하는 것을 확인했다.
- 브라우저 오류ㆍ경고가 없는 것을 확인했다.

## 2026-07-15 13:00 KST / Version 4.623 - Natural Recent Title + One-Column Account Menu

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.623.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.623.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.623.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.623.html
- /Users/GHOST/Downloads/css/base_4.623.css
- /Users/GHOST/Downloads/js/app_4.623.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.622 기준으로 4.623 버전을 생성했다.
- 왼쪽 `최근 조회` 제목을 다시 한 줄로 복원하고, 고정 18글자가 아니라 실제 요소 폭과 글꼴 너비에 맞춰 글자 단위로 자르도록 변경했다.
- 제목 원문은 `data-recent-full-text`와 버튼 툴팁에 그대로 보존해 화면 크기 변경 때 다시 계산할 수 있게 했다.
- 우측 상단 9점 메뉴 버튼의 외곽선ㆍ배경ㆍ모서리를 제거하고 4px 정사각형 9개만 표시했다.
- 계정 메뉴를 248px 폭의 세로 1열로 변경하고 각 메뉴 행을 44px로 통일했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.623.js` 문법 검사 통과.
- 148px 최근 조회 폭에서 예시 제목이 한 줄 21자 `(J15-16) 메종글레드 인근/7층/`까지 자연스럽게 표시되는 것을 확인했다.
- 9점 버튼이 34×34px 클릭 영역, 외곽선 0px, 투명 배경, 4×4px 정사각형 9개로 표시되는 것을 확인했다.
- 계정 메뉴가 248px 단일 열과 44px 높이 4개 행으로 표시되고 브라우저 오류가 없는 것을 확인했다.

## 2026-07-15 12:45 KST / Version 4.622 - Recent Listing Title Preservation

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.622.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.622.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.622.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.622.html
- /Users/GHOST/Downloads/css/base_4.622.css
- /Users/GHOST/Downloads/js/app_4.622.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.621 기준으로 4.622 버전을 생성했다.
- 왼쪽 `최근 조회` 제목을 3단어ㆍ18글자로 강제 절단하던 로직을 제거했다.
- 제목은 원문 전체를 DOM과 툴팁에 보존하고 최대 3줄로 표시하도록 변경했다.
- `/`로 이어진 층수ㆍ난방ㆍ옵션ㆍ입주 정보가 한 덩어리로 잘리던 문제를 해결했다.
- 매물 유형과 가격을 표시하는 두 번째 줄은 기존 한 줄 규칙을 유지했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.622.js` 문법 검사 통과.
- `(J15-16) 메종글레드 인근/7층/도시가스/풀옵션/즉시입주/` 제목의 DOM 원문과 버튼 툴팁이 끝까지 보존되는 것을 확인했다.
- 148px 최근 조회 목록 폭에서 제목이 3줄, `아파트 1억 3,000`이 별도 한 줄로 표시되는 것을 확인했다.

## 2026-07-15 12:31 KST / Version 4.621 - Topbar Account Launcher

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.621.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.621.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.621.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.621.html
- /Users/GHOST/Downloads/css/base_4.621.css
- /Users/GHOST/Downloads/js/app_4.621.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.620 기준으로 4.621 버전을 생성했다.
- 부동산 지도 홈의 로그아웃 상태에서도 버전 표시를 숨기고 34px 높이의 로그인ㆍ회원가입 그룹을 표시한다.
- 로그인 상태에서는 프로필 오른쪽에 34×34px 3×3 정사각형 점 메뉴 버튼을 표시한다.
- 계정 드롭다운은 내 정보ㆍ중개사무소 정보ㆍ이용권 결제ㆍ1:1 문의내역을 2열로, 로그아웃을 구분선 아래 전체 폭으로 배치한다.
- 기존 계정 메뉴의 `data-account-action` 라우팅을 재사용해 화면별 동작을 통일했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.621.js` 문법 검사 통과.
- 부동산 지도 홈에서 로그인ㆍ회원가입 그룹 높이 34px, 버전 버튼과 9점 버튼 숨김 확인.
- 로그인 화면 상태에서 9점 버튼 34×34px, 드롭다운 316px, 2열 141px×2, 로그아웃 전체 폭 290px 확인.
- 390px 모바일에서 9점 버튼과 316px 드롭다운이 화면 안에 배치되는 것 확인.
- 브라우저 오류 0건 확인.

## 2026-07-14 22:26 KST / Version 4.620 - Profile Suite Leaves Landing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.620.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.620.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.620.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.620.html
- /Users/GHOST/Downloads/css/base_4.620.css
- /Users/GHOST/Downloads/js/app_4.620.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.619 기준으로 4.620 버전을 생성했다.
- 프로필 내정보ㆍ프로필 수정ㆍ중개사무소 정보 계열 화면을 열기 전에 메인 랜딩 상태를 종료하도록 공통 진입 함수를 추가했다.
- 공개 랜딩 종료 함수를 우선 사용하고, 준비되지 않은 경우에도 `main-landing-page-open` 제거와 `aria-hidden=true` 처리를 보장한다.
- 데스크톱 계정 패널은 168px 왼쪽 공통 메뉴를 제외한 나머지 화면에 배치한다.
- 계정 화면에서 왼쪽 공통 메뉴가 보이도록 복원하고, 모바일 760px 이하에서는 가독성을 위해 계정 화면을 전체 폭으로 유지한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.620.js` 문법 검사 통과.
- 데스크톱 1280px에서 랜딩 `display: none`, 왼쪽 메뉴 `0~168px`, 내정보 패널 `168~1280px` 배치 확인.
- 모바일 390px에서 왼쪽 메뉴 `display: none`, 내정보 패널 `0~390px` 전체 폭 배치 확인.
- 프로필 화면 전환 관련 브라우저 오류는 없으며, 로컬에서 누락된 기존 행정구역 경계 파일의 404 경고만 별도로 확인.

## 2026-07-14 22:11 KST / Version 4.619 - Global Auth Group + Softer Dividers

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.619.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.619.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.619.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.619.html
- /Users/GHOST/Downloads/css/base_4.619.css
- /Users/GHOST/Downloads/js/app_4.619.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.618 기준으로 4.619 버전을 생성했다.
- 브랜드 문구를 `리얼제주에서 광고를 시작해보세요.`로 변경했다.
- 옅은 청회색 브랜드 띠와 기존 위아래 여백은 유지하고 상하 구분선은 모두 제거했다.
- 로그인ㆍ회원가입 그룹의 1px 외곽선과 가운데 구분선을 `#edf0f3`으로 더 옅게 조정했다.
- 로그아웃 상태의 동네업체ㆍ알바ㆍ중고거래ㆍ자동차ㆍ모임 상단 우측에도 랜딩과 같은 로그인ㆍ회원가입 그룹을 표시한다.
- 위 다섯 카테고리에서는 중복되는 로그아웃용 버전 버튼을 숨기며, 로그인 상태의 프로필 버튼 동작은 변경하지 않았다.
- 로그인ㆍ회원가입 등 인증 화면에서는 상단 로그인 그룹을 숨기는 기존 규칙을 유지했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.619.js` 문법 검사 통과.
- 랜딩 브랜드 문구가 `리얼제주에서 광고를 시작해보세요.`로 표시되고 브랜드 띠 상하선이 0px인 것 확인.
- 로그인 그룹 외곽선ㆍ구분선이 `rgb(237, 240, 243)`이며 높이 34px인 것 확인.
- 동네업체ㆍ알바ㆍ중고거래ㆍ자동차ㆍ모임에서 로그인 그룹이 표시되고 기존 로그아웃용 버전 버튼은 `display: none`인 것 확인.
- 인증 화면에서는 로그인 그룹이 숨겨지는 것 확인.
- 390x844 동네업체 화면에서 로그인 그룹 좌우 좌표가 241.45pxㆍ372px로 화면 안에 표시되는 것 확인.
- 브라우저 콘솔 오류ㆍ경고 0건 확인.

## 2026-07-14 21:53 KST / Version 4.618 - Brand Band Spacing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.618.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.618.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.618.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.618.html
- /Users/GHOST/Downloads/css/base_4.618.css
- /Users/GHOST/Downloads/js/app_4.618.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.617 기준으로 4.618 버전을 생성했다.
- `제주도 대표 프롭테크 서비스` 브랜드 문구 영역의 위아래 여백을 데스크톱 44px, 모바일 36px로 확대했다.
- 브랜드 문구 띠의 바탕을 랜딩 본문보다 한 단계 진한 옅은 청회색 `#f1f4f8`로 변경했다.
- 화면 폭 전체의 위ㆍ아래 1px 구분선과 바로 이어지는 푸터 구조는 유지했다.
- 하단 푸터의 자간은 PC별 글자 뭉침을 막기 위해 `letter-spacing: 0`을 유지했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.618.js` 문법 검사 통과.
- 브랜드 띠의 위아래 여백이 데스크톱 44pxㆍ390x844 모바일 36px로 적용된 것 확인.
- 브랜드 띠 배경이 `rgb(241, 244, 248)`이고 상하 1px 구분선이 데스크톱 1280pxㆍ모바일 390px 화면 폭 전체에 표시되는 것 확인.
- 데스크톱ㆍ모바일 가로 넘침과 브라우저 콘솔 오류ㆍ경고 0건 확인.

## 2026-07-14 21:20 KST / Version 4.617 - Three Spaced Landing Notices

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.617.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.617.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.617.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.617.html
- /Users/GHOST/Downloads/css/base_4.617.css
- /Users/GHOST/Downloads/js/app_4.617.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.616 기준으로 4.617 버전을 생성했다.
- 랜딩 공지 미리보기를 최신 4건에서 3건으로 줄였다.
- `더보기`에서 전체 공개 공지를 확인하는 기존 동작은 유지했다.
- 공지 행 높이를 데스크톱ㆍ모바일 모두 48px로 늘리고 위아래 패딩을 8px로 조정했다.
- 3개 목록의 최소 높이를 144px로 고정해 이전 4개 구성과 전체 영역 높이가 크게 달라지지 않도록 했다.
- 하단의 `광고문의 : 064-745-0531` 전화 버튼과 진한 광고 배경을 제거했다.
- `제주도 대표 프롭테크 서비스`와 `리얼제주의 광고를 지금 이용해보세요.` 문구는 가운데 정렬 브랜드 문장으로 유지했다.
- 랜딩 우측 상단 로그인ㆍ회원가입 그룹의 1px 외곽선과 구분선을 `#d9dde3`에서 더 옅은 `#e5e7eb`로 조정했다.
- 랜딩 사진 버튼의 기본 검은 음영을 옅게 하고 원본 사진 밝기ㆍ채도를 소폭 높였다.
- 사진 버튼에 마우스를 올리거나 키보드로 선택하면 사진 밝기가 1.2배로 올라가고 검은 음영 불투명도가 0.42로 낮아지도록 조정했다.
- 두 줄 브랜드 문구 영역을 화면 폭 전체로 확장하고 위ㆍ아래에 1px 연회색 구분선을 넣은 뒤 바로 아래에 푸터가 이어지도록 정리했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.617.js` 문법 검사 통과.
- 데스크톱ㆍ390x844 모바일에서 최신 공지 3건과 각 행 높이 48px 확인.
- `더보기`에서 전체 공개 공지 5건이 그대로 표시되는 것 확인.
- 광고문의 버튼이 제거되고 두 줄 브랜드 문구만 표시되는 것 확인.
- 로그인ㆍ회원가입 그룹의 외곽선과 구분선이 `rgb(229, 231, 235)`로 표시되는 것 확인.
- 사진 버튼의 기본 필터와 검은 음영이 완화된 값으로 적용되는 것 확인.
- 두 줄 브랜드 문구 위ㆍ아래 1px 구분선이 데스크톱 1280pxㆍ모바일 390px 화면 폭 전체에 표시되고 아래 푸터와 바로 이어지는 것 확인.
- 데스크톱ㆍ모바일 가로 넘침과 브라우저 콘솔 오류ㆍ경고 0건 확인.

## 2026-07-14 20:51 KST / Version 4.616 - Live Notices + Gray Landing Body

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.616.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.616.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.616.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.616.html
- /Users/GHOST/Downloads/css/base_4.616.css
- /Users/GHOST/Downloads/js/app_4.616.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.615 기준으로 4.616 버전을 생성했다.
- 첫 랜딩 공지 조회가 Supabase 라이브러리 로드보다 먼저 실행되면서 임시 공지 3개를 캐시하던 문제를 수정했다.
- 공지 조회 전에 Supabase 라이브러리 준비를 기다리고 실제 `notices` 공개 자료만 성공 시 메모리에 캐시하도록 변경했다.
- 조회 실패 시 실제 자료처럼 보이는 임시 공지를 표시하지 않고 로드 실패 문구만 표시하도록 정리했다.
- 랜딩 최신 공지를 3개에서 공개 공지 전체 4개로 늘렸다.
- 공지 날짜는 브라우저 시간대 변환 없이 서버의 `YYYY-MM-DD` 값을 그대로 표시해 `가오픈 안내`를 `2026.06.26`으로 고정했다.
- 랜딩 공지 4개가 늘어져 보이지 않도록 행 높이를 데스크톱 38px, 모바일 40px로 줄였다.
- 관리자에서 공지를 저장ㆍ공개 전환ㆍ삭제하면 랜딩 미리보기와 전체 공지 캐시를 함께 갱신한다.
- 흰색 상단 네비게이션 바로 아래부터 랜딩 본문 전체에 흰색보다 한 단계 어두운 `#f7f8fa` 배경을 적용했다.
- 랜딩 `공지사항` 제목을 `동네업체` 제목과 같은 21px, 공지 행 제목을 `우리동네 업체 정보`와 같은 15px로 맞췄다.
- 전체 공지사항 페이지 본문을 왼쪽 사이드 메뉴를 제외한 화면 안에서 가운데 정렬해 좌우 여백을 동일하게 맞췄다.
- 전체 공지 패널에 양쪽 스크롤바 여백을 동일하게 예약하고, 모바일 공지 화면에서는 왼쪽 메뉴와 상단 카테고리 메뉴를 숨겨 본문 겹침과 가로 넘침을 막았다.
- 랜딩 우측 상단 로그인ㆍ회원가입을 높이 34px의 흰색 버튼 그룹으로 묶고 1px 연회색 외곽선ㆍ가운데 세로 구분선ㆍ4px 모서리를 적용했다. 기존 글자 크기ㆍ색상ㆍ굵기는 유지했다.
- 회원가입 약관 화면의 제목을 `회원가입 · 이용약관 동의`로 변경했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.616.js` 문법 검사 통과.
- Supabase 공개 공지 5건 중 최신 4건이 랜딩에 표시되고 `가오픈 안내` 날짜가 `2026.06.26`인 것 확인.
- 랜딩 공지 행 높이가 데스크톱 38px이며 제목ㆍ날짜 4줄과 가로 넘침 없음 확인.
- 상단 네비게이션은 흰색, 그 아래 랜딩 본문은 `rgb(247, 248, 250)`로 이어지는 것 확인.
- `공지사항`과 `동네업체` 제목이 21px, 공지 행 제목과 `우리동네 업체 정보`가 15px로 일치하는 것 확인.
- 공지 미리보기에서 전체 공지 페이지가 열리고 서버 공개 공지 5건이 표시되는 것 확인.
- 전체 공지 본문 좌우 여백이 데스크톱 106pxㆍ모바일 31px로 동일하고 모바일 가로 넘침이 없는 것 확인.
- 랜딩 로그인ㆍ회원가입 그룹이 데스크톱과 모바일에서 높이 34px, 외곽선 1px, 모서리 4px, 그림자 없음으로 표시되는 것 확인.
- 로그인ㆍ회원가입 글자가 기존 13pxㆍ굵기 600ㆍ진회색을 유지하고 가운데 구분선이 1px x 18px인 것 확인.
- 회원가입 화면에서 제목이 `회원가입 · 이용약관 동의`로 표시되고 상단 로그인ㆍ회원가입 그룹이 숨겨지며, 390x844 화면에서도 제목이 잘리지 않는 것 확인.
- 브라우저 콘솔 오류ㆍ경고 0건 확인.

## 2026-07-14 20:35 KST / Version 4.615 - Blue Map Callout + Notice Preview

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.615.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.615.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.615.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.615.html
- /Users/GHOST/Downloads/css/base_4.615.css
- /Users/GHOST/Downloads/js/app_4.615.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.614 기준으로 4.615 버전을 생성했다.
- 사진 카드 5개와 가장자리 채움 구성은 그대로 유지했다.
- `우리동네 한눈에 보기` 패널을 단색 브랜드 파랑 `#2563eb`으로 변경했다.
- 제목ㆍ설명ㆍ지도 아이콘을 흰색으로 바꾸고 지도 아이콘은 낮은 불투명도로 배치했다.
- 실행 표시는 흰색 반투명 배경과 얇은 흰색 외곽선을 적용했다.
- 기존 원형 장식은 복원하지 않았으며 그라데이션도 사용하지 않았다.
- 서비스 카드와 파란 광고 띠 사이에 외곽 카드 없는 최신 공지 미리보기 3개를 추가했다.
- 공지 제목ㆍ날짜ㆍ더보기를 제공하고 각 행과 더보기는 기존 공지사항 페이지로 연결한다.
- 랜딩 미리보기와 공지사항 전체 페이지가 같은 메모리 캐시를 사용해 공지 데이터를 중복 요청하지 않는다.
- 공지 로딩 중에도 목록 높이를 고정해 파란 광고 띠가 밀리지 않게 했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.615.js` 문법 검사 통과.
- 데스크톱과 390x844 모바일에서 파란 패널, 최신 공지 3개, 날짜 배치와 가로 넘침 없음 확인.
- 랜딩 공지 행 클릭 시 기존 공지사항 페이지가 열리고 같은 공지 3개가 표시되는 것 확인.
- 랜딩 미리보기와 전체 공지 페이지가 `getPublicNoticeRows()`의 메모리 캐시를 공유하도록 코드 확인.
- 브라우저 콘솔 오류ㆍ경고 0건 확인.

## 2026-07-14 20:25 KST / Version 4.614 - Edge To Edge Landing Photo Cards

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.614.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.614.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.614.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.614.html
- /Users/GHOST/Downloads/css/base_4.614.css
- /Users/GHOST/Downloads/js/app_4.614.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.613 기준으로 4.614 버전을 생성했다.
- 부동산 홈ㆍ알바ㆍ동네업체ㆍ중고거래ㆍ공지사항 카드의 7px 흰색 속프레임을 제거했다.
- 사진과 명암 덮개를 카드의 네 가장자리까지 채웠다.
- 카드 자체의 8px 모서리와 1px 외곽선만 유지해 이중 박스 인상을 없앴다.
- 기존 텍스트ㆍ아이콘 위치, 사진 밝기 호버 효과, 카드 크기는 변경하지 않았다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.614.js` 문법 검사 통과.
- PCㆍ390px 모바일에서 사진 카드 5개의 사진ㆍ덮개 inset 0px, 모서리 8px, 외곽선 1px 확인.
- 모든 텍스트ㆍ아이콘이 카드 안에 있고 가로 넘침 없음 확인.
- 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 20:21 KST / Version 4.613 - Expand Cards To Ad Gap

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.613.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.613.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.613.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.613.html
- /Users/GHOST/Downloads/css/base_4.613.css
- /Users/GHOST/Downloads/js/app_4.613.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.612 기준으로 4.613 버전을 생성했다.
- 4.612에서 잘못 줄인 마지막 사진 카드 행과 파란 광고 띠 사이 여백을 다시 넓혔다.
- PC에서는 카드 아래 여백을 80px, 760px 이하 모바일에서는 48px로 적용했다.
- 파란 광고 띠 아래쪽과 푸터 내용 사이 40px 여백은 변경하지 않았다.
- 광고 띠 내부 패딩과 문장ㆍ광고문의 버튼 배치는 변경하지 않았다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.613.js` 문법 검사 통과.
- PC에서 마지막 카드 행과 광고 띠 사이 80px, 390px 모바일에서 48px 실제 좌표 계산값 확인.
- 광고 띠 아래 40px 유지, 가로 넘침 없음, 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 20:17 KST / Version 4.612 - Landing Ad Outer Spacing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.612.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.612.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.612.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.612.html
- /Users/GHOST/Downloads/css/base_4.612.css
- /Users/GHOST/Downloads/js/app_4.612.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.611 기준으로 4.612 버전을 생성했다.
- 파란 광고 띠 위쪽 바깥 여백을 데스크톱 70pxㆍ모바일 34px에서 모두 32px로 통일했다.
- 광고 띠 아래쪽은 별도 margin을 제거하고 기존 공통 푸터 상단 여백 40px을 사용한다.
- 결과적으로 파란 띠 바깥 흰 여백이 위 32pxㆍ아래 40px로 보이도록 정리했다.
- 광고 띠 내부 패딩과 문장 간격은 변경하지 않았다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.612.js` 문법 검사 통과.
- PCㆍ390px 모바일에서 광고 띠 위 32pxㆍ아래 40px 실제 좌표 계산값 확인.
- PCㆍ모바일 가로 넘침 없음, 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 19:56 KST / Version 4.611 - Hide Duplicate Auth Links

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.611.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.611.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.611.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.611.html
- /Users/GHOST/Downloads/css/base_4.611.css
- /Users/GHOST/Downloads/js/app_4.611.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.610 기준으로 4.611 버전을 생성했다.
- 우측 상단 `로그인 · 회원가입`은 메인 랜딩에서만 표시한다.
- `auth-page-open` 상태에서는 랜딩 클래스가 함께 남아 있어도 계정 바로가기를 강제로 숨긴다.
- 로그인ㆍ회원가입ㆍ약관 화면 안의 기존 로그인ㆍ회원가입 동선은 그대로 유지한다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.611.js` 문법 검사 통과.
- 메인 랜딩에서는 상단 `로그인 · 회원가입` 링크 표시 확인.
- 로그인 화면 진입 후 `auth-page-open` 상태에서 상단 링크 `display: none`과 비표시 확인.
- 로그인 폼과 내부 회원가입 링크 유지, 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 19:53 KST / Version 4.610 - Light Neighborhood Callout

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.610.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.610.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.610.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.610.html
- /Users/GHOST/Downloads/css/base_4.610.css
- /Users/GHOST/Downloads/js/app_4.610.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.609 기준으로 4.610 버전을 생성했다.
- `우리동네 한눈에 보기` 패널의 원색 파란 배경과 원형 장식을 제거했다.
- 패널을 옅은 청회색 `#f8fbff`, 1px 외곽선, 8px 모서리로 변경해 사진 카드와 통일했다.
- 제목은 진회색, 설명은 중간 회색으로 바꾸고 파란색은 실행 버튼과 지도 아이콘에만 사용했다.
- 기존 Font Awesome `map-location-dot` 아이콘을 오른쪽 아래에 은은하게 배치했다.
- PCㆍ태블릿ㆍ모바일에서 패널 크기와 텍스트 영역이 안정적으로 유지되도록 반응형 높이와 아이콘 크기를 지정하고, 모바일 제목을 한 줄로 고정했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.610.js` 문법 검사 통과.
- 1280px PC와 390px 모바일 랜딩에서 패널 배치와 텍스트ㆍ버튼ㆍ아이콘 비겹침 확인.
- 모바일 제목 한 줄 표시와 PCㆍ모바일 가로 넘침 없음 확인.
- 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 19:41 KST / Version 4.609 - Landing Card Hover Brightness

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.609.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.609.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.609.js
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.609.html
- /Users/GHOST/Downloads/css/base_4.609.css
- /Users/GHOST/Downloads/js/app_4.609.js
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.608 기준으로 4.609 버전을 생성했다.
- 메인 랜딩 사진 카드에 커서를 올리면 사진 밝기를 12% 높이고 채도ㆍ대비를 선명하게 조정한다.
- 호버 시 어두운 덮개의 불투명도를 `0.58`로 낮춰 사진이 확실히 밝아지게 했다.
- 공지사항 카드는 검은 글자 가독성을 위해 밝은 덮개 불투명도를 `0.72`로 유지한다.
- 180ms 전환 효과를 적용해 밝기 변화가 자연스럽게 이어진다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.609.js` 문법 검사 통과.
- CSS 호버 규칙에 사진 `brightness(1.12)`와 덮개 불투명도 `0.58`, 공지사항 `0.72`가 적용된 것 확인.
- 브라우저에서 랜딩 카드 5개 표시, 4.609 스타일시트 로드, 가로 넘침 없음 확인.
- 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 19:23 KST / Version 4.608 - Landing JPEG Size Reduction

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.608.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.608.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.608.js
- /Users/GHOST/Documents/REALJEJU/img/landingpage_1.jpg ~ landingpage_5.jpg
- /Users/GHOST/Documents/REALJEJU/REALJEJU_MAP_GIS_HISTORY.md
- /Users/GHOST/Downloads/realjeju_4.608.html
- /Users/GHOST/Downloads/css/base_4.608.css
- /Users/GHOST/Downloads/js/app_4.608.js
- /Users/GHOST/Downloads/img/landingpage_1.jpg ~ landingpage_5.jpg
- /Users/GHOST/Downloads/REALJEJU_MAP_GIS_HISTORY.md

### 수정 내용
- 4.607 기준으로 4.608 버전을 생성했다.
- 메인 랜딩 JPEG 5종을 1200px에서 600px로 줄였다.
- JPEG 품질 58, progressive, 4:2:0 색상 압축, 메타데이터 제거, 최적화 저장을 적용했다.
- 이미지 합계 용량을 약 752KB에서 약 108KB로 약 86% 줄였다.
- 같은 파일명을 유지하고 CSS 캐시 번호를 `v=4608`로 갱신했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 5개 이미지가 모두 600px 폭의 progressive JPEG이며 EXIF 메타데이터가 없는 것 확인.
- 번들 Node.js `--check`로 `js/app_4.608.js` 문법 검사.
- 브라우저에서 5개 랜딩 카드 배경과 `v=4608` 이미지 참조, 콘솔 오류 여부 확인.

## 2026-07-14 16:12 KST / Version 4.607 - Landing Login And Signup Links

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.607.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.607.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.607.js
- /Users/GHOST/Downloads/realjeju_4.607.html
- /Users/GHOST/Downloads/css/base_4.607.css
- /Users/GHOST/Downloads/js/app_4.607.js

### 수정 내용
- 4.606 기준으로 4.607 버전을 생성했다.
- 메인 랜딩 우측 상단에 텍스트형 `로그인 · 회원가입` 링크를 추가했다.
- 로그아웃한 랜딩에서는 버전 표시를 숨기고 로그인ㆍ회원가입 링크만 표시한다.
- 로그인 링크는 기존 로그인 화면, 회원가입 링크는 기존 이용약관 동의 화면을 바로 연다.
- 로그인 상태에서는 랜딩 전용 링크를 숨기고 기존 프로필 이미지와 버전 표시를 유지한다.
- 760px 이하 랜딩에서는 상단 카테고리 메뉴를 숨겨 로고와 계정 링크가 겹치지 않게 했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.607.js` 문법 검사 통과.
- PC 로그아웃 랜딩에서 `로그인 · 회원가입` 표시와 `Ver 4.607` 숨김 확인.
- 로그인 클릭 시 로그인 화면, 회원가입 클릭 시 `이용약관` 화면이 열리는 것 확인.
- 390px 모바일 폭에서 로고와 계정 링크가 겹치지 않고 문서 가로 넘침이 없는 것 확인.
- 브라우저 콘솔 오류ㆍ경고 없음.

## 2026-07-14 15:59 KST / Version 4.606 - Landing Card Photo Backgrounds

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.606.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.606.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.606.js
- /Users/GHOST/Documents/REALJEJU/img/landingpage_1.jpg
- /Users/GHOST/Documents/REALJEJU/img/landingpage_2.jpg
- /Users/GHOST/Documents/REALJEJU/img/landingpage_3.jpg
- /Users/GHOST/Documents/REALJEJU/img/landingpage_4.jpg
- /Users/GHOST/Documents/REALJEJU/img/landingpage_5.jpg
- /Users/GHOST/Downloads/realjeju_4.606.html
- /Users/GHOST/Downloads/css/base_4.606.css
- /Users/GHOST/Downloads/js/app_4.606.js
- /Users/GHOST/Downloads/img/landingpage_1.jpg ~ landingpage_5.jpg

### 수정 내용
- 4.605 기준으로 4.606 버전을 생성했다.
- 메인 랜딩의 부동산 홈ㆍ알바ㆍ동네업체ㆍ중고거래ㆍ공지사항 카드에 각각 JPEG 배경 이미지를 적용했다.
- 카드 사진은 1200px 폭, JPEG 품질 72로 변환해 5장 합계 약 752KB로 줄였다.
- 사진에는 제목이나 설명을 합성하지 않고 기존 HTML 글자와 Font Awesome 아이콘을 앞 레이어로 유지해 한글이 깨지지 않게 했다.
- 동네업체 배경은 간판ㆍ포스터ㆍ로고ㆍ숫자가 없는 빈 간판 상점 사진으로 교체했다.
- 첫 네 카드는 저채도 사진과 어두운 오버레이 위에 흰 글자, 공지사항은 밝은 사진 위에 진한 글자와 파란 아이콘을 사용했다.
- 서버 업로드 ZIP은 생성하지 않았다.

### 검증
- 번들 Node.js `--check`로 `js/app_4.606.js` 문법 검사 통과.
- 로컬 브라우저 PC 화면에서 사진 5장 로드와 `Ver 4.606` 표시 확인.
- 390px 모바일 폭에서 카드 5개의 가로ㆍ세로 내부 넘침 없음과 아이콘이 카드 안에 유지되는 것 확인.
- 브라우저 콘솔 오류ㆍ경고 없음.
- HTML의 CSSㆍJSㆍ화면 버전ㆍ다운로드 파일 참조를 4.606으로 통일하고 4.605 잔여 참조 없음 확인.

## 2026-07-14 14:25 KST / Version 4.605 - Persistent Map Listing Cache

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.605.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.605.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.605.css
- /Users/GHOST/Downloads/realjeju_4.605.html
- /Users/GHOST/Downloads/js/app_4.605.js
- /Users/GHOST/Downloads/css/base_4.605.css

### 수정 내용
- 4.604 기준으로 4.605 버전을 생성했다.
- 공개 매물 마커 목록의 메모리 재사용 시간을 15초에서 60초로 연장했다.
- IndexedDB `realjeju-map-listings`에 공개 매물 마커 목록과 저장 시각을 보관해 새 탭ㆍ브라우저 재실행 후에도 기존 자료를 먼저 표시한다.
- 저장 자료가 60초보다 오래된 경우에만 기존 화면을 유지한 채 최신 목록을 백그라운드에서 한 번 조회하는 stale-while-revalidate 흐름을 적용했다.
- 네트워크 갱신 중에는 같은 Promise를 공유해 전체 매물 조회가 겹치지 않게 했고, 갱신 실패 시 이미 표시한 캐시 매물을 유지한다.
- 백그라운드 갱신이 끝나도 사용자가 선택한 평ㆍ제곱미터 상태를 초기화하지 않도록 최초 목록 적용과 후속 갱신을 구분했다.
- 매물 한 건 저장ㆍ수정 후 전체 목록을 다시 요청하지 않고 갱신된 메모리 목록을 IndexedDB에도 반영한다.

### 검증
- `js/app_4.605.js` 문법 검사 통과: bundled Node `--check`.
- 독립 IndexedDB 모의 테스트에서 새 실행 컨텍스트의 영구 캐시 복원과 연속 저장 시 최신 자료 병합 기록 확인.
- 로컬 브라우저에서 4.605 대문과 부동산 홈 지도 진입 확인, 콘솔 오류 없음.
- 4.605 HTML의 CSSㆍJSㆍ화면 버전ㆍ다운로드 파일 참조 일치 확인.

## 2026-07-11 20:29 KST / Version 4.584 - Admin Boundary EMD First LIO Load

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.584.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.584.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.584.css
- /Users/GHOST/Downloads/realjeju_4.584.html
- /Users/GHOST/Downloads/js/app_4.584.js
- /Users/GHOST/Downloads/css/base_4.584.css

### 수정 내용
- 4.583 기준으로 4.584 버전을 생성했다.
- 6레벨 이하 행정구역 탐색 시 `jeju_emd.geojson`을 먼저 확인하도록 변경했다.
- 현재 중심의 읍면동이 `동`이면 `jeju_lio.geojson`을 요청하지 않고 `emd` 결과를 바로 사용한다.
- 현재 중심의 읍면동이 `읍` 또는 `면`이면 그때만 `jeju_lio.geojson`을 요청해 리 단위를 찾고, 리가 없으면 읍/면 결과를 유지한다.

### 검증
- `js/app_4.584.js` 문법 검사 통과: bundled Node `--check`.
- 4.584 파일 내 4.583 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 20:16 KST / Version 4.583 - Admin Boundary GeoJSON Memory Request Cache

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.583.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.583.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.583.css
- /Users/GHOST/Downloads/realjeju_4.583.html
- /Users/GHOST/Downloads/js/app_4.583.js
- /Users/GHOST/Downloads/css/base_4.583.css

### 수정 내용
- 4.582 기준으로 4.583 버전을 생성했다.
- 행정구역 경계 GeoJSON 로더에 `adminBoundaryGeoJsonPromiseCache`를 추가했다.
- `jeju_sig.geojson`, `jeju_emd.geojson`, `jeju_lio.geojson`이 로딩 중일 때도 같은 Promise를 재사용해 같은 세션에서 중복 서버 요청이 발생하지 않도록 했다.
- 행정구역 경계 파일 요청에 `cache: "force-cache"`를 적용했다.

### 검증
- `js/app_4.583.js` 문법 검사 통과: bundled Node `--check`.
- 4.583 파일 내 4.582 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 20:08 KST / Version 4.582 - Admin Simple Footer Side Nav Spacing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.582.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.582.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.582.css
- /Users/GHOST/Downloads/realjeju_4.582.html
- /Users/GHOST/Downloads/js/app_4.582.js
- /Users/GHOST/Downloads/css/base_4.582.css

### 수정 내용
- 4.581 기준으로 4.582 버전을 생성했다.
- 관리자/운영자 페이지 하단 `© REALJEJU.APP` 푸터의 여백을 왼쪽 사이드바 `공지사항` 하단 여백 기준인 `18px`에 맞췄다.
- `.admin-page-simple-copy` 상단 여백과 `.admin-page-simple-footer` 하단 여백을 모두 `18px`로 통일했다.

### 검증
- `js/app_4.582.js` 문법 검사 통과: bundled Node `--check`.
- 4.582 파일 내 4.581 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 19:58 KST / Version 4.581 - Admin Simple Footer Spacing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.581.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.581.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.581.css
- /Users/GHOST/Downloads/realjeju_4.581.html
- /Users/GHOST/Downloads/js/app_4.581.js
- /Users/GHOST/Downloads/css/base_4.581.css

### 수정 내용
- 4.580 기준으로 4.581 버전을 생성했다.
- 관리자/운영자 페이지 하단 `© REALJEJU.APP` 단순 푸터의 위쪽 여백을 `72px`에서 `48px`로 줄였다.
- 기존 아래쪽 여백 `48px`과 맞춰 `© REALJEJU.APP` 위아래 여백이 동일하게 보이도록 했다.

### 검증
- `js/app_4.581.js` 문법 검사 통과: bundled Node `--check`.
- 4.581 파일 내 4.580 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 19:45 KST / Version 4.580 - Admin Performance Panel Full Width

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.580.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.580.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.580.css
- /Users/GHOST/Downloads/realjeju_4.580.html
- /Users/GHOST/Downloads/js/app_4.580.js
- /Users/GHOST/Downloads/css/base_4.580.css

### 수정 내용
- 4.579 기준으로 4.580 버전을 생성했다.
- 관리자 페이지 `성능 관리` 본문 탭을 기존 `매물 관리` 화면과 같은 폭 규칙에 포함했다.
- `performance` 패널과 `.admin-performance-content`가 좌측 기준선, 우측 여백, 100% 내부 폭을 `매물 관리`와 동일하게 사용하도록 했다.

### 검증
- `js/app_4.580.js` 문법 검사 통과: bundled Node `--check`.
- 4.580 파일 내 4.579 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 19:32 KST / Version 4.579 - Admin Performance Management Panel

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.579.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.579.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.579.css
- /Users/GHOST/Downloads/realjeju_4.579.html
- /Users/GHOST/Downloads/js/app_4.579.js
- /Users/GHOST/Downloads/css/base_4.579.css

### 수정 내용
- 4.578 기준으로 4.579 버전을 생성했다.
- 관리자 페이지의 `매물 관리` 오른쪽에 `성능 관리` 탭을 추가했다.
- 현재 브라우저 세션 기준으로 `fetch` 요청 시간, 상태, 데이터 크기, 빠른/느린 요청 목록을 수집하도록 했다.
- 지도 시설 레이어, 클린하우스 마커, 행정구역 경계, 관리자 매물 목록 로드 구간을 렌더/로드 성능 기록에 남기도록 했다.
- 성능 관리 패널에 요약 카드, 느린 요청, 데이터 요청량, 느린 렌더 구간, 빠른 요청 표를 표시했다.

### 검증
- `js/app_4.579.js` 문법 검사 통과: bundled Node `--check`.
- 4.579 파일 내 4.578 참조 잔여 없음 확인.

## 2026-07-11 18:24 KST / Version 4.578 - Clean House Region Request Inflight Cache

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.578.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.578.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.578.css
- /Users/GHOST/Downloads/realjeju_4.578.html
- /Users/GHOST/Downloads/js/app_4.578.js
- /Users/GHOST/Downloads/css/base_4.578.css

### 수정 내용
- 4.577 기준으로 4.578 버전을 생성했다.
- `coord2RegionCode` 요청에 `mapCenterRegionInflightCache`를 추가했다.
- 같은 지도 중심 좌표에서 현재위치 라벨 갱신과 클린하우스 도시 판정이 동시에 들어와도 기존 요청 Promise를 재사용하도록 변경했다.
- 클린하우스 JSON 데이터는 기존처럼 도시별 `state.cleanHouseRowsCacheByCity`에 저장해서 같은 세션에서 반복 다운로드하지 않는다.

### 검증
- `js/app_4.578.js` 문법 검사 통과: bundled Node `--check`.
- 4.578 파일 내 4.577 및 이전 cache key 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 18:13 KST / Version 4.577 - Seogwipo Clean House Coordinates

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.577.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.577.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.577.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses/seogwipo_city.json
- /Users/GHOST/Documents/REALJEJU/data/clean_houses/jeju_city.json
- /Users/GHOST/Documents/REALJEJU/data/clean_houses.json
- /Users/GHOST/Downloads/realjeju_4.577.html
- /Users/GHOST/Downloads/js/app_4.577.js
- /Users/GHOST/Downloads/css/base_4.577.css
- /Users/GHOST/Downloads/data/clean_houses/seogwipo_city.json
- /Users/GHOST/Downloads/data/clean_houses/jeju_city.json
- /Users/GHOST/Downloads/data/clean_houses.json

### 수정 내용
- 4.576 기준으로 4.577 버전을 생성했다.
- `data/clean_houses/seogwipo_city.json`의 서귀포시 클린하우스 388건을 모두 `rows`로 이동하고 `lat/lng`를 채웠다.
- 서귀포시 클린하우스 `geocodingPending`을 0건으로 정리했다.
- `data/clean_houses.json` 통합 파일도 제주시/서귀포시 분리 JSON 기준으로 다시 생성했다.
- 클린하우스 JSON fetch는 예전 404 캐시를 붙잡지 않도록 4.577 앱에서 `cache: "no-cache"`로 조정했다.

### 검증
- `js/app_4.577.js` 문법 검사 통과: bundled Node `--check`.
- `data/clean_houses/seogwipo_city.json` JSON 파싱 통과.
- 서귀포시 클린하우스 검증: rows 388, geocodingPending 0, lat/lng null 0, 제주 범위 밖 좌표 0.
- `data/clean_houses.json` JSON 파싱 통과: rows 1747, geocodingPending 0.
- 4.577 파일 내 4.576 및 이전 cache key 참조 잔여 없음 확인.
- 다운로드 폴더 복사본과 작업 폴더 원본 `cmp -s` 동일성 확인.

## 2026-07-11 17:23 KST / Version 4.576 - Empty Deal Filter Matches No Listings

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.576.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.576.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.576.css
- /Users/GHOST/Downloads/realjeju_4.576.html
- /Users/GHOST/Downloads/js/app_4.576.js
- /Users/GHOST/Downloads/css/base_4.576.css

### 수정 내용
- 4.575 기준으로 4.576 버전을 생성했다.
- 관심 부동산 거래 유형 필터가 비어 있으면 `필터 없음`이 아니라 `매칭 없음`으로 판정하도록 변경했다.
- 관리자 페이지 매물 관리 거래 유형 필터가 비어 있으면 매물을 통과시키지 않도록 변경했다.
- 중개사 홈 거래 유형 필터도 비어 있으면 매물을 통과시키지 않도록 변경했다.
- 거래 유형 초기화 후 기존 매물들이 그대로 남던 원인을 제거했다.

### 검증
- `js/app_4.576.js` 문법 검사 통과: bundled Node `--check`.
- 4.576 파일 내 4.575 및 이전 cache key 참조 잔여 없음 확인.
- 관심 부동산, 관리자 매물 관리, 중개사 홈 필터 조건에 `if (!dealFilter.size) return false;` 적용 확인.

## 2026-07-11 17:16 KST / Version 4.575 - Cross Page Deal Reset

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.575.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.575.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.575.css
- /Users/GHOST/Downloads/realjeju_4.575.html
- /Users/GHOST/Downloads/js/app_4.575.js
- /Users/GHOST/Downloads/css/base_4.575.css

### 수정 내용
- 4.574 기준으로 4.575 버전을 생성했다.
- 관심 부동산 거래 유형 초기화가 다시 전체 거래 유형을 켜지 않고 빈 선택 상태로 비우도록 변경했다.
- 관리자 페이지 매물 관리 거래 유형 초기화도 빈 선택 상태로 비우도록 변경했다.
- 중개사 홈 거래 유형 초기화도 빈 선택 상태로 비우도록 변경했다.
- 부동산 홈에서 적용한 거래 유형 초기화 규칙을 관심 부동산, 중개사 홈, 관리자 매물 관리까지 통일했다.

### 검증
- `js/app_4.575.js` 문법 검사 통과: bundled Node `--check`.
- 4.575 파일 내 4.574 및 이전 cache key 참조 잔여 없음 확인.

## 2026-07-11 17:08 KST / Version 4.574 - Deal Type Reset Matches Property Type Reset

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.574.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.574.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.574.css
- /Users/GHOST/Downloads/realjeju_4.574.html
- /Users/GHOST/Downloads/js/app_4.574.js
- /Users/GHOST/Downloads/css/base_4.574.css

### 수정 내용
- 4.573 기준으로 4.574 버전을 생성했다.
- 거래 유형 초기화 버튼이 `매매/전세/월세/년세`를 다시 켜던 동작을 제거하고, 매물 유형 초기화처럼 선택값을 빈 세트로 비우도록 변경했다.
- 전체 필터 초기화에서도 거래 유형/매물 유형 reset DOM 기준값을 빈 세트로 맞춰 체크박스가 다시 켜지지 않게 했다.
- 전체 필터 초기화 후 거래 유형/매물 유형 요약 문구가 긴 선택 목록으로 남지 않고 `전체`로 표시되도록 정리했다.

### 검증
- `js/app_4.574.js` 문법 검사 통과: bundled Node `--check`.
- 4.574 파일 내 4.573 및 이전 cache key 참조 잔여 없음 확인.

## 2026-07-11 16:38 KST / Version 4.573 - Clean House City Split Lazy Load

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.573.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.573.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.573.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses/jeju_city.json
- /Users/GHOST/Documents/REALJEJU/data/clean_houses/seogwipo_city.json
- /Users/GHOST/Downloads/realjeju_4.573.html
- /Users/GHOST/Downloads/js/app_4.573.js
- /Users/GHOST/Downloads/css/base_4.573.css
- /Users/GHOST/Downloads/data/clean_houses/jeju_city.json
- /Users/GHOST/Downloads/data/clean_houses/seogwipo_city.json

### 수정 내용
- 4.572 기준으로 4.573 버전을 생성했다.
- 클린하우스 데이터를 `data/clean_houses/jeju_city.json`, `data/clean_houses/seogwipo_city.json`로 분리했다.
- 제주시 클린하우스 1,359건은 좌표 포함 파일로 분리하고, 서귀포시 388건은 좌표 변환 대기 데이터로 별도 파일에 분리했다.
- 클린하우스 로더가 지도 중심 시/읍면동을 역지오코딩해 현재 필요한 시 파일만 lazy load 하도록 변경했다.
- 한 번 받은 시 파일은 `state.cleanHouseRowsCacheByCity`에 저장해 네비 이동/패널 토글 시 같은 JSON을 다시 요청하지 않도록 했다.
- 서귀포시처럼 좌표가 없는 클린하우스 주소는 현재 지도 중심 읍면동 범위만 카카오 주소 변환하고, 성공 좌표는 `localStorage`에 저장해 같은 주소를 반복 변환하지 않도록 했다.

### 검증
- `js/app_4.573.js` 문법 검사 통과: bundled Node `--check`.
- `data/clean_houses/jeju_city.json`, `data/clean_houses/seogwipo_city.json` JSON 파싱 통과.
- 4.573 파일 내 4.572 및 기존 `data/clean_houses.json` 참조 잔여 없음 확인.

## 2026-07-11 16:20 KST / Version 4.572 - Boundary Region List Shows Individual Listings

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.572.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.572.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.572.css
- /Users/GHOST/Downloads/realjeju_4.572.html
- /Users/GHOST/Downloads/js/app_4.572.js
- /Users/GHOST/Downloads/css/base_4.572.css

### 수정 내용
- 4.571 기준으로 4.572 버전을 생성했다.
- 하단 중앙 행정구역 배지에서 열린 주소/현재위치 매물 목록은 동일 제목/유형 매물을 한 줄로 묶지 않고 매물 단위로 각각 표시하도록 변경했다.
- `buildMapRegionListingGroups()`를 추가해 `태흥리 매물 3`처럼 배지 카운트가 3개일 때 목록에도 3개 행이 표시되도록 보정했다.
- 일반 주소/현재위치 목록의 기존 단지/동일 제목 그룹 방식은 유지하고, 하단 행정구역 배지(`boundaryState`) 진입에만 매물 단위 렌더를 적용했다.

### 검증
- `js/app_4.572.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.572.css` 중괄호 균형 검사 통과.
- 4.572 파일 내 4.571 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 16:14 KST / Version 4.571 - Broker Agent List Share Link

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.571.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.571.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.571.css
- /Users/GHOST/Downloads/realjeju_4.571.html
- /Users/GHOST/Downloads/js/app_4.571.js
- /Users/GHOST/Downloads/css/base_4.571.css

### 수정 내용
- 4.570 기준으로 4.571 버전을 생성했다.
- 왼쪽 중개사 매물 목록 공유하기가 `location.href`를 그대로 복사하지 않도록 변경했다.
- 공유 URL을 `agentList=1` 전용 링크로 생성하고, `brokerEdit`, `id` 같은 현재 패널/수정 상태 파라미터가 섞이지 않도록 했다.
- `agentList=1` 공유 링크로 진입하면 메인 랜딩을 닫고 해당 중개사 매물 목록을 복원하도록 딥링크 핸들러를 추가했다.
- 메인 랜딩 자동 오픈 차단 조건에 중개사 매물 목록 공유 링크(`agentList=1`)를 포함했다.

### 검증
- `js/app_4.571.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.571.css` 중괄호 균형 검사 통과.
- 4.571 파일 내 4.570 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 16:06 KST / Version 4.570 - Broker Edit Deep Link Landing Bypass

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.570.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.570.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.570.css
- /Users/GHOST/Downloads/realjeju_4.570.html
- /Users/GHOST/Downloads/js/app_4.570.js
- /Users/GHOST/Downloads/css/base_4.570.css

### 수정 내용
- 4.569 기준으로 4.570 버전을 생성했다.
- URL에 `brokerEdit` 파라미터가 있으면 메인 랜딩 페이지를 즉시 닫도록 처리했다.
- `brokerEdit` 딥링크 진입 시 로그인 세션과 Supabase 클라이언트 준비를 짧게 기다린 뒤 `realjejuOpenBrokerListingEdit()`로 매물 수정 화면을 열도록 초기 진입 핸들러를 추가했다.
- 메인 랜딩 페이지 오픈 함수가 `brokerEdit` 딥링크 상태에서 랜딩을 다시 열지 않도록 차단했다.

### 검증
- `js/app_4.570.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.570.css` 중괄호 균형 검사 통과.
- 4.570 파일 내 4.569 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 15:57 KST / Version 4.569 - Close Share Box With Panels

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.569.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.569.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.569.css
- /Users/GHOST/Downloads/realjeju_4.569.html
- /Users/GHOST/Downloads/js/app_4.569.js
- /Users/GHOST/Downloads/css/base_4.569.css

### 수정 내용
- 4.568 기준으로 4.569 버전을 생성했다.
- `closeFloatingDetailShareMenu()`를 추가해 `detailShareMenu` 공유하기 박스를 공통으로 닫을 수 있게 했다.
- 오른쪽 상세 패널 닫기(`closeDetailPanel`, `hardCloseDetailPanel`) 때 공유하기 박스도 함께 닫히도록 연결했다.
- 왼쪽 중개사 매물 목록 닫기(`closeSidebarList`)와 목록 패널 접기(`collapseSidebarListForMapOverlayPanelSwitch`) 때도 공유하기 박스가 남지 않도록 연결했다.
- 페이지/패널 전환 정리 함수(`closeMapHomePanelsForPageNavigation`)에서도 공유하기 박스를 닫도록 보정했다.

### 검증
- `js/app_4.569.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.569.css` 중괄호 균형 검사 통과.
- 4.569 파일 내 4.568 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 10:13 KST / Version 4.568 - Bank Facility Level 6

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.568.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.568.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.568.css
- /Users/GHOST/Downloads/realjeju_4.568.html
- /Users/GHOST/Downloads/js/app_4.568.js
- /Users/GHOST/Downloads/css/base_4.568.css

### 수정 내용
- 4.567 기준으로 4.568 버전을 생성했다.
- 은행 지도 마커 표시 레벨을 9단계에서 6단계로 변경했다.
- `CONVENIENCE_CATEGORY_PLACE_CONFIGS.bank.visibleLevel`을 `LARGE_MART_MAP_VISIBLE_LEVEL`에서 `FACILITY_MAP_VISIBLE_LEVEL`로 변경했다.
- 편의 패널 레벨 안내 문구에서 은행을 6단계 줄로 이동했다.
  - `레벨 : 클린하우스 5단계`
  - `공영주차장·편의점·생활안전·은행 6단계`
  - `대형마트·공공기관 9단계`

### 검증
- `js/app_4.568.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.568.css` 중괄호 균형 검사 통과.
- 4.568 파일 내 4.567 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 10:09 KST / Version 4.567 - Restore Square Facility Map Badges

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.567.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.567.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.567.css
- /Users/GHOST/Downloads/realjeju_4.567.html
- /Users/GHOST/Downloads/js/app_4.567.js
- /Users/GHOST/Downloads/css/base_4.567.css

### 수정 내용
- 4.566 기준으로 4.567 버전을 생성했다.
- 4.564~4.566에 남아 있던 지도 시설 마커의 흰색 바탕원 최종 오버라이드 블록을 제거했다.
- 편의점, 은행, 대형마트, 공공기관, 공영주차장 지도 뱃지가 4.532 계열의 컬러 사각 뱃지 방식으로 다시 표시되도록 복구했다.
- 클린하우스 지도 뱃지도 흰 원 없이 컬러 사각 뱃지로 표시되도록 복구했다.
- 클린하우스 기본 색은 `rgba(20, 184, 166, 0.88)`, hover/focus 색은 `rgba(13, 148, 136, 0.94)`로 조정했다.
- 4.565의 클린하우스 5단계 표시와 4.566의 레벨 안내 3줄/오른쪽 정렬은 유지했다.

### 검증
- `js/app_4.567.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.567.css` 중괄호 균형 검사 통과.
- 4.567 파일 내 4.566 및 이전 cache key 참조 잔여 없음 확인.
- 지도 시설 마커 최종 오버라이드에서 흰색 바탕원 규칙 제거 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 10:02 KST / Version 4.566 - Convenience Level Note Line Breaks

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.566.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.566.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.566.css
- /Users/GHOST/Downloads/realjeju_4.566.html
- /Users/GHOST/Downloads/js/app_4.566.js
- /Users/GHOST/Downloads/css/base_4.566.css

### 수정 내용
- 4.565 기준으로 4.566 버전을 생성했다.
- 편의 패널 하단 레벨 안내 문구를 3줄로 분리했다.
  - `레벨 : 클린하우스 5단계`
  - `공영주차장·편의점·생활안전 6단계`
  - `대형마트·은행·공공기관 9단계`
- 해당 안내 문구에 `convenience-facility-level-note` 클래스를 추가해 오른쪽 정렬과 3줄용 줄간격을 명시했다.

### 검증
- `js/app_4.566.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.566.css` 중괄호 균형 검사 통과.
- 4.566 파일 내 4.565 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 09:52 KST / Version 4.565 - Clean House Level 5

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.565.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.565.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.565.css
- /Users/GHOST/Downloads/realjeju_4.565.html
- /Users/GHOST/Downloads/js/app_4.565.js
- /Users/GHOST/Downloads/css/base_4.565.css

### 수정 내용
- 4.564 기준으로 4.565 버전을 생성했다.
- 클린하우스 표시 레벨을 공통 6단계에서 별도 5단계로 분리했다.
- `CLEAN_HOUSE_MAP_VISIBLE_LEVEL = 5`를 추가하고, 클린하우스 렌더 조건에서 해당 값을 사용하도록 변경했다.
- 편의 패널 안내 문구를 `클린하우스 5단계 · 공영주차장·편의점·생활안전 6단계 / 대형마트·은행·공공기관 9단계`로 수정했다.
- 4.564의 지도 뱃지 스타일은 그대로 유지했다.

### 검증
- `js/app_4.565.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.565.css` 중괄호 균형 검사 통과.
- 4.565 파일 내 4.564 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 09:43 KST / Version 4.564 - Square Badges Inside White Map Marker Circles

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.564.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.564.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.564.css
- /Users/GHOST/Downloads/realjeju_4.564.html
- /Users/GHOST/Downloads/js/app_4.564.js
- /Users/GHOST/Downloads/css/base_4.564.css

### 수정 내용
- 4.563 기준으로 4.564 버전을 생성했다.
- 오른쪽 메뉴/왼쪽 패널 아이콘은 건드리지 않고, 지도 위에 표시되는 편의/시설 마커 뱃지만 수정했다.
- 4.563의 “흰 원 안에 컬러 글리프” 방식을 “흰 원 안에 기존 사각 아이콘 뱃지” 방식으로 변경했다.
- 공영주차장, 대형마트, 편의점, 은행, 공공기관, 클린하우스 모두 외부 28px 흰 원형 마커를 유지하고 내부 18px 컬러 사각 뱃지를 표시하도록 했다.
- 내부 사각 뱃지는 기존 카테고리 색상을 유지하고, 아이콘/문자는 흰색으로 표시하도록 했다.

### 검증
- `js/app_4.564.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.564.css` 중괄호 균형 검사 통과.
- 4.564 파일 내 4.563 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 01:02 KST / Version 4.563 - White Circle Map Facility Badges

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.563.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.563.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.563.css
- /Users/GHOST/Downloads/realjeju_4.563.html
- /Users/GHOST/Downloads/js/app_4.563.js
- /Users/GHOST/Downloads/css/base_4.563.css

### 수정 내용
- 4.562 기준으로 4.563 버전을 생성했다.
- 오른쪽 메뉴/왼쪽 패널 아이콘은 건드리지 않고, 지도 위에 표시되는 편의/시설 마커 뱃지만 수정했다.
- 공영주차장, 대형마트, 편의점, 은행, 공공기관, 클린하우스 지도 마커를 기존 28px 크기 유지 + 흰색 원형 배지로 통일했다.
- 실제 아이콘 glyph만 작게 조정했다: 일반 FontAwesome 아이콘 12px, 공영주차장 P 표기 13px.
- 카테고리별 구분색은 배경색이 아니라 아이콘 색과 얇은 테두리 색으로 유지했다.
- 클린하우스 지도 뱃지는 `#0ea5a4` 계열로 적용했다.

### 검증
- `js/app_4.563.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.563.css` 중괄호 균형 검사 통과.
- 4.563 파일 내 4.562 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 01:00 KST / Version 4.562 - Map Tool Panel Resize Reposition

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.562.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.562.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.562.css
- /Users/GHOST/Downloads/realjeju_4.562.html
- /Users/GHOST/Downloads/js/app_4.562.js
- /Users/GHOST/Downloads/css/base_4.562.css

### 수정 내용
- 4.561 기준으로 4.562 버전을 생성했다.
- 브라우저 창 크기를 줄인 상태나 DevTools 도킹 상태에서 열린 지도 도구 패널이, 창을 다시 키운 뒤 예전 fixed 좌표에 남는 문제를 수정했다.
- `repositionOpenMapToolPanels()`를 추가해 지도 종류, 교육, 편의, 개발, 중개, 생활안전/클린하우스 안내 박스 위치를 열린 상태 기준으로 다시 계산하도록 했다.
- `resize` 및 `visualViewport.resize`에서 열린 지도 도구 패널 재배치를 예약하도록 변경했다.
- 기존에 중개 패널만 직접 재배치하던 resize 처리를 공통 재배치 함수로 통합했다.

### 검증
- `js/app_4.562.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.562.css` 중괄호 균형 검사 통과.
- 4.562 파일 내 4.561 및 이전 cache key 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 00:49 KST / Version 4.561 - Separate Guide Boxes

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.561.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.561.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.561.css
- /Users/GHOST/Downloads/realjeju_4.561.html
- /Users/GHOST/Downloads/js/app_4.561.js
- /Users/GHOST/Downloads/css/base_4.561.css

### 수정 내용
- 4.560 기준으로 4.561 버전을 생성했다.
- 생활안전 참고지표와 요일별 배출제 안내를 한 박스에 합치던 `life-safety-clean-house` 모드를 제거했다.
- `#lifeSafetyLegend`는 생활안전 참고지표만 표시하도록 유지했다.
- 별도 DOM 박스 `#cleanHouseGuideLegend`를 추가해 요일별 배출제 안내를 독립된 박스로 표시하도록 변경했다.
- 두 안내가 동시에 켜지면 생활안전 참고지표 박스 아래에 요일별 배출제 박스가 별도로 배치되도록 위치 계산을 분리했다.
- 거리재기 종료 직후 하단 행정구역 매물 수 pill이 바로 다시 표시되도록 툴바 hidden 상태 반영 후 pill을 갱신하게 순서를 조정했다.

### 검증
- `js/app_4.561.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.561.css` 중괄호 균형 검사 통과.
- 4.561 파일 내 4.560 및 이전 cache key 참조 잔여 없음 확인.
- `life-safety-clean-house` 합체 모드 잔여 참조 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 00:38 KST / Version 4.560 - Initialization Order Fix

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.560.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.560.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.560.css
- /Users/GHOST/Downloads/realjeju_4.560.html
- /Users/GHOST/Downloads/js/app_4.560.js
- /Users/GHOST/Downloads/css/base_4.560.css

### 수정 내용
- 4.559 기준으로 4.560 버전을 생성했다.
- `educationFacilityFilterPanel`이 선언되기 전에 `isEducationFacilityFilterPanelOpen()`에서 접근되어 발생하던 초기화 오류를 수정했다.
- `supabaseScriptLoadPromise`가 선언되기 전에 `loadSupabaseScript()`에서 접근되어 방문 통계 표시가 실패하던 초기화 오류를 수정했다.
- 두 변수 모두 최초 호출보다 앞에서 초기화되도록 선언 위치를 조정했다.

### 검증
- `js/app_4.560.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.560.css` 중괄호 균형 검사 통과.
- 4.560 파일 내 4.559 및 이전 cache key 참조 잔여 없음 확인.
- 4.560 파일 내 `gis_map` 잔여 참조 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 00:31 KST / Version 4.559 - Map GIS Path Rename Fix

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.559.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.559.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.559.css
- /Users/GHOST/Documents/REALJEJU/map_gis/
- /Users/GHOST/Downloads/realjeju_4.559.html
- /Users/GHOST/Downloads/js/app_4.559.js
- /Users/GHOST/Downloads/css/base_4.559.css

### 수정 내용
- 4.558 기준으로 4.559 버전을 생성했다.
- `gis_map`에서 `map_gis`로 폴더명을 바꾼 뒤 남아 있던 JS 데이터 경로 3곳을 수정했다.
- 생활안전 참고지표 경로를 `map_gis/life_safety_poly_selected_jeju_dongs.json`으로 변경했다.
- 유치원/어린이집 현황 경로를 각각 `map_gis/kindergarten_status_3.520.json`, `map_gis/daycare_status_3.520.json`으로 변경했다.
- 작업 폴더 서버 기준에서도 404가 나지 않도록 `/Users/GHOST/Documents/REALJEJU/map_gis/` 폴더를 맞춰 넣었다.

### 검증
- `js/app_4.559.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.559.css` 중괄호 균형 검사 통과.
- `map_gis/daycare_status_3.520.json`, `map_gis/kindergarten_status_3.520.json`, `map_gis/life_safety_poly_selected_jeju_dongs.json` JSON 파싱 검사 통과.
- 4.559 파일 내 `gis_map` 잔여 참조 없음 확인.
- Downloads 폴더 복사 완료 및 HTML/JS 원본과 동일성 확인.

## 2026-07-11 00:22 KST / Version 4.558 - Panel Legend And Distance Pill Visibility

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.558.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.558.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.558.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses.json
- /Users/GHOST/Downloads/realjeju_4.558.html
- /Users/GHOST/Downloads/js/app_4.558.js
- /Users/GHOST/Downloads/css/base_4.558.css
- /Users/GHOST/Downloads/data/clean_houses.json

### 수정 내용
- 4.557 기준으로 4.558 버전을 생성했다.
- 생활안전 참고지표 박스와 클린하우스 요일별 배출제 안내가 서로 대체되지 않도록 `life-safety-clean-house` 표시 모드를 추가했다.
- 생활안전 참고지표 박스가 보이는 상태에서 클린하우스도 켜져 있으면, 요일별 배출제 안내가 생활안전 참고지표 아래에 붙어서 보이도록 변경했다.
- 클린하우스만 켜져 있으면 기존처럼 요일별 배출제 안내만 보이게 유지했다.
- 교육, 편의, 개발, 중개 패널이 열려 있을 때는 생활안전/클린하우스 안내 박스를 숨기고, 패널이 닫히면 다시 표시 조건을 계산하도록 공통 패널 열림 상태를 추가했다.
- 거리재기 또는 거리 반경 종료 버튼이 보이는 동안 하단 행정구역 매물 수 pill이 숨겨지도록 JS 조건과 CSS fallback을 함께 추가했다.
- 클린하우스 데이터는 계속 `data/clean_houses.json` 하나만 참조한다.

### 검증
- `js/app_4.558.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.558.css` 중괄호 균형 검사 통과.
- `data/clean_houses.json` JSON 파싱 검사 통과.
- 4.558 파일 내 4.557 및 `clean_houses_4.xxx.json` 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 00:12 KST / Version 4.557 - Clean House Tooltip And Color

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.557.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.557.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.557.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses.json
- /Users/GHOST/Downloads/realjeju_4.557.html
- /Users/GHOST/Downloads/js/app_4.557.js
- /Users/GHOST/Downloads/css/base_4.557.css
- /Users/GHOST/Downloads/data/clean_houses.json

### 수정 내용
- 4.556 기준으로 4.557 버전을 생성했다.
- 클린하우스 마커 색상을 기존 어두운 청록에서 더 밝은 청록 계열로 변경했다.
- 클린하우스 편의 패널 활성 색상도 같은 청록 계열로 맞췄다.
- 클린하우스를 공통 편의시설 툴팁 분기에 포함해 다른 편의 마커와 같은 툴팁 디자인을 쓰도록 했다.
- 클린하우스 툴팁에도 로드뷰 버튼이 표시되도록 공통 `data-convenience-place-roadview` 경로에 연결했다.
- 클린하우스 데이터는 계속 `data/clean_houses.json` 하나만 참조한다.

### 검증
- `js/app_4.557.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.557.css` 중괄호 균형 검사 통과.
- `data/clean_houses.json` JSON 파싱 검사 통과.
- 4.557 파일 내 4.556 및 `clean_houses_4.xxx.json` 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-11 00:07 KST / Version 4.556 - Clean House Marker Bounds Fix

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.556.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.556.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.556.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses.json
- /Users/GHOST/Downloads/realjeju_4.556.html
- /Users/GHOST/Downloads/js/app_4.556.js
- /Users/GHOST/Downloads/css/base_4.556.css
- /Users/GHOST/Downloads/data/clean_houses.json

### 수정 내용
- 4.555 기준으로 4.556 버전을 생성했다.
- 클린하우스 마커가 지도에 안 보이던 원인을 수정했다.
- 원인은 `renderCleanHouseOverlays()`가 카카오 지도 bounds 객체를 넘기는데, `isLatLngInsideBounds()`가 내부 `{swLat, neLat, swLng, neLng}` 객체만 처리해 모든 클린하우스 row가 bounds 밖으로 판정되던 문제였다.
- `isLatLngInsideBounds()`가 카카오 `LatLngBounds` 객체와 내부 bounds 객체를 모두 처리하도록 수정했다.
- 클린하우스 오버레이도 공통 시설 z-index 동기화 목록에 포함했다.
- CSS 최종 시설 마커 컨테이너 규칙에 `clean-house`를 포함해 뱃지 크기/표시 규칙이 빠지지 않게 했다.
- 클린하우스 데이터는 계속 `data/clean_houses.json` 하나만 참조한다.

### 검증
- `js/app_4.556.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.556.css` 중괄호 균형 검사 통과.
- `data/clean_houses.json` JSON 파싱 검사 통과.
- 4.556 파일 내 4.555 및 `clean_houses_4.xxx.json` 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 23:59 KST / Version 4.555 - Clean House Level 6 And Single Data File

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.555.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.555.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.555.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses.json
- /Users/GHOST/Downloads/realjeju_4.555.html
- /Users/GHOST/Downloads/js/app_4.555.js
- /Users/GHOST/Downloads/css/base_4.555.css
- /Users/GHOST/Downloads/data/clean_houses.json

### 수정 내용
- 4.554 기준으로 4.555 버전을 생성했다.
- 클린하우스 데이터 파일은 버전별 중복 파일을 쓰지 않고 `data/clean_houses.json` 하나만 참조하도록 유지했다.
- 클린하우스 표시 레벨을 공영주차장, 편의점, 생활안전과 같은 6단계 기준으로 맞췄다.
- 대형마트, 은행, 공공기관은 기존처럼 9단계 기준을 유지했다.
- 편의 패널 안내 문구를 `공영주차장·편의점·생활안전·클린하우스 6단계 / 대형마트·은행·공공기관 9단계`로 맞췄다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.555 기준으로 동기화했다.

### 검증
- `js/app_4.555.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.555.css` 중괄호 균형 검사 통과.
- `data/clean_houses.json` JSON 파싱 검사 통과.
- 4.555 파일 내 4.554 및 `clean_houses_4.xxx.json` 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 23:50 KST / Version 4.553 - Clean House Marker Visibility Fix

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.553.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.553.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.553.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses_4.553.json
- /Users/GHOST/Downloads/realjeju_4.553.html
- /Users/GHOST/Downloads/js/app_4.553.js
- /Users/GHOST/Downloads/css/base_4.553.css
- /Users/GHOST/Downloads/data/clean_houses_4.553.json

### 수정 내용
- 4.552 기준으로 4.553 버전을 생성했다.
- 클린하우스 데이터 로드가 원격 경로를 먼저 보면서 로컬 실행 시 마커가 안 뜰 수 있던 문제를 수정했다.
- `data/clean_houses_4.553.json`을 로컬 상대 경로로 먼저 읽고, 실패할 때만 원격 경로를 시도하도록 변경했다.
- CSS 하단의 실제 편의 마커 최종 규칙에 `clean-house` 마커를 포함해 지도 뱃지가 확실히 보이게 했다.
- 클린하우스 마커 표시 레벨을 대형마트와 같은 9레벨까지로 조정했다.
- 공영주차장은 기존 6레벨 조건으로 되돌리고, 클린하우스만 9레벨 조건을 사용하게 정리했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.553 기준으로 동기화했다.

### 검증
- `js/app_4.553.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.553.css` 중괄호 균형 검사 통과.
- `data/clean_houses_4.553.json` JSON 파싱 검사 통과.
- 4.553 파일 내 4.552 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 23:41 KST / Version 4.552 - Clean House Convenience Layer

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.552.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.552.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.552.css
- /Users/GHOST/Documents/REALJEJU/data/clean_houses_4.552.json
- /Users/GHOST/Downloads/realjeju_4.552.html
- /Users/GHOST/Downloads/js/app_4.552.js
- /Users/GHOST/Downloads/css/base_4.552.css
- /Users/GHOST/Downloads/data/clean_houses_4.552.json

### 수정 내용
- 4.551 기준으로 4.552 버전을 생성했다.
- 제주시 클린하우스 CSV의 좌표 포함 데이터 1,359건을 `data/clean_houses_4.552.json`으로 변환했다.
- 서귀포시 클린하우스 CSV는 위경도 컬럼이 없어 388건을 `geocodingPending`에 보관했다.
- 편의 패널 제일 마지막, 제일 밑 자리에 `클린하우스` 버튼을 추가했다.
- 클린하우스 선택 시 지도 bounds 안의 클린하우스 마커를 표시하도록 추가했다.
- 클린하우스 선택 상태에서는 기존 `생활안전 참고지표` 박스 위치에 `요일별 배출제 안내`가 표시되도록 연결했다.
- 전체 선택해제, 빈 지도 모드, 지도 idle 렌더링에 클린하우스 레이어 해제/갱신을 연결했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.552 기준으로 동기화했다.

### 검증
- `js/app_4.552.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.552.css` 중괄호 균형 검사 통과.
- `data/clean_houses_4.552.json` JSON 파싱 검사 통과.
- 4.552 파일 내 4.551 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 23:06 KST / Version 4.551 - Restore 4.532 Type Badge Colors

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.551.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.551.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.551.css
- /Users/GHOST/Downloads/realjeju_4.551.html
- /Users/GHOST/Downloads/js/app_4.551.js
- /Users/GHOST/Downloads/css/base_4.551.css

### 수정 내용
- 4.550 기준으로 4.551 버전을 생성했다.
- 우측 상세 정보 패널과 주소/현재위치 매물 목록이 공유하는 `applyTypeBadgeTheme()` 색상을 4.532 기준 색상으로 되돌렸다.
- 아파트, 단독주택/다가구주택, 상가, 토지, 오피스텔/생활형숙박시설 계열이 4.532의 연한 배경색 + 진한 글자색 톤을 다시 사용하도록 맞췄다.
- 주소/현재위치 목록 뱃지는 계속 우측 상세 패널과 같은 `getSummaryTypeBadgeLabel()` 및 `applyTypeBadgeTheme()` 경로를 사용한다.
- CSS 후반 fallback 유형별 규칙도 4.532 색상 톤으로 맞춰 JS 인라인 테마와 어긋나지 않게 정리했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.551 기준으로 동기화했다.

### 검증
- `js/app_4.551.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.551.css` 중괄호 균형 검사 통과.
- 4.551 파일 내 4.550 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:56 KST / Version 4.550 - Shared Type Badge Theme Function

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.550.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.550.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.550.css
- /Users/GHOST/Downloads/realjeju_4.550.html
- /Users/GHOST/Downloads/js/app_4.550.js
- /Users/GHOST/Downloads/css/base_4.550.css

### 수정 내용
- 4.549 기준으로 4.550 버전을 생성했다.
- 오른쪽 상세 정보 패널이 실제로 사용하는 `applyTypeBadgeTheme()` 인라인 테마 함수를 흰 배경 + 유형별 글자색/테두리색 방식으로 변경했다.
- 주소/현재위치 매물 목록 뱃지도 렌더 직후 같은 `applyTypeBadgeTheme()` 함수를 호출하도록 연결했다.
- 주소/현재위치 매물 목록의 유형 라벨 생성 기준을 상세 패널과 같은 `getSummaryTypeBadgeLabel()`로 맞췄다.
- 상세 패널과 주소/현재위치 목록이 CSS뿐 아니라 JS 인라인 테마까지 같은 경로를 타게 해 색상 불일치 가능성을 제거했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.550 기준으로 동기화했다.

### 검증
- `js/app_4.550.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.550.css` 중괄호 균형 검사 통과.
- 4.550 파일 내 4.549 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:47 KST / Version 4.549 - White Outline Property Type Badges

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.549.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.549.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.549.css
- /Users/GHOST/Downloads/realjeju_4.549.html
- /Users/GHOST/Downloads/js/app_4.549.js
- /Users/GHOST/Downloads/css/base_4.549.css

### 수정 내용
- 4.548 기준으로 4.549 버전을 생성했다.
- 우측 상세 패널과 주소/현재위치 매물목록이 공유하는 매물 유형 뱃지를 흰 배경 + 유형별 글자색/테두리색 방식으로 변경했다.
- 아파트는 블루, 단독주택/다가구주택은 오렌지, 상가는 퍼플, 토지는 그린, 사무실은 인디고, 오피스텔/원룸/생활형숙박시설 등은 틸 계열의 글자색과 테두리색으로 구분했다.
- 뒤쪽 공통 뱃지 규칙이 유형별 색상을 덮어쓰지 않도록 최종 유형별 규칙을 CSS 후반부에 추가했다.
- 기존 뱃지 크기/라운드/글자 규격은 우측 상세 패널과 주소/현재위치 목록이 동일하게 유지했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.549 기준으로 동기화했다.

### 검증
- `js/app_4.549.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.549.css` 중괄호 균형 검사 통과.
- 4.549 파일 내 4.548 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:39 KST / Version 4.548 - Distinct Property Type Badge Colors

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.548.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.548.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.548.css
- /Users/GHOST/Downloads/realjeju_4.548.html
- /Users/GHOST/Downloads/js/app_4.548.js
- /Users/GHOST/Downloads/css/base_4.548.css

### 수정 내용
- 4.547 기준으로 4.548 버전을 생성했다.
- 우측 상세 패널과 주소/현재위치 매물목록이 공유하는 매물 유형 뱃지 색상을 더 분명하게 분리했다.
- 아파트는 블루, 단독주택/다가구주택은 오렌지, 상가는 퍼플, 토지는 그린, 사무실은 인디고, 오피스텔/원룸/생활형숙박시설 등은 틸 계열로 구분했다.
- 기존처럼 우측 상세 패널과 주소/현재위치 목록의 뱃지 크기/라운드/글자 규격은 동일하게 유지했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.548 기준으로 동기화했다.

### 검증
- `js/app_4.548.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.548.css` 중괄호 균형 검사 통과.
- 4.548 파일 내 4.547 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:29 KST / Version 4.547 - Map Region Badge Exact Detail Match

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.547.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.547.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.547.css
- /Users/GHOST/Downloads/realjeju_4.547.html
- /Users/GHOST/Downloads/js/app_4.547.js
- /Users/GHOST/Downloads/css/base_4.547.css

### 수정 내용
- 4.546 기준으로 4.547 버전을 생성했다.
- 주소/현재위치 매물목록 유형 뱃지를 우측 상세 패널 최종 규격과 동일하게 맞췄다.
- 상세 패널과 같은 `height: 23px`, `border-radius: 999px`, `font-size: 11px`, `font-weight: 800`, `letter-spacing: -0.1px` 값을 적용했다.
- 주소/현재위치 뱃지의 네모 형태와 큰 글자/굵기 값을 제거하고, 상세 패널처럼 라운드 뱃지로 통일했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.547 기준으로 동기화했다.

### 검증
- `js/app_4.547.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.547.css` 중괄호 균형 검사 통과.
- 4.547 파일 내 4.546 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:25 KST / Version 4.546 - Map Region Badge Detail Style

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.546.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.546.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.546.css
- /Users/GHOST/Downloads/realjeju_4.546.html
- /Users/GHOST/Downloads/js/app_4.546.js
- /Users/GHOST/Downloads/css/base_4.546.css

### 수정 내용
- 4.545 기준으로 4.546 버전을 생성했다.
- 주소/현재위치 매물 목록의 매물 유형 뱃지에 `data-type`을 추가해 우측 상세 패널과 같은 유형별 색상 규칙을 적용했다.
- 주소/현재위치 매물 목록 뱃지 크기를 우측 상세 패널 뱃지와 같은 `height: 24px`, `font-size: 13px`, `font-weight: 900`, 각진 형태로 맞췄다.
- 기존 흰 배경/파란 테두리 단일 디자인을 제거하고 상세 패널 기준의 유형별 배경/글자 색상으로 통일했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.546 기준으로 동기화했다.

### 검증
- `js/app_4.546.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.546.css` 중괄호 균형 검사 통과.
- 4.546 파일 내 4.545 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:15 KST / Version 4.545 - Boundary Listing Cache

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.545.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.545.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.545.css
- /Users/GHOST/Downloads/realjeju_4.545.html
- /Users/GHOST/Downloads/js/app_4.545.js
- /Users/GHOST/Downloads/css/base_4.545.css

### 수정 내용
- 4.544 기준으로 4.545 버전을 생성했다.
- 하단 행정구역 버튼에서 열린 리 단위 매물 목록에 클라이언트 캐시를 추가했다.
- `리 feature + 현재 매물 배열` 기준으로 폴리곤 포함 계산 결과를 재사용해 같은 지역 버튼 반복 클릭/재렌더 시 계산을 줄였다.
- 리 이름의 부모 읍면동 조회 결과를 캐시해 `애월읍(하귀2리)` 같은 주소 라벨 계산을 반복하지 않도록 했다.
- 하단 버튼 매물 수 계산도 같은 경계 목록 캐시를 사용하게 해 버튼 숫자와 목록 필터 계산을 하나로 묶었다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.545 기준으로 동기화했다.

### 검증
- `js/app_4.545.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.545.css` 중괄호 균형 검사 통과.
- 4.545 파일 내 4.544 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 22:05 KST / Version 4.544 - Boundary Pill Ri Listing Filter

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.544.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.544.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.544.css
- /Users/GHOST/Downloads/realjeju_4.544.html
- /Users/GHOST/Downloads/js/app_4.544.js
- /Users/GHOST/Downloads/css/base_4.544.css

### 수정 내용
- 4.543 기준으로 4.544 버전을 생성했다.
- 부동산 홈 하단 행정구역 매물 수 버튼이 가진 실제 행정구역 GeoJSON feature를 상단 주소/현재위치 목록 필터에 연결했다.
- 하단 버튼이 리 단위일 때 상단 목록의 주소 표기를 `제주도 › 제주시 › 애월읍(하귀2리)`처럼 부모 읍면동과 리 이름을 함께 표시하도록 수정했다.
- 하단 리 버튼으로 열린 목록은 주소 문자열 검색이 아니라 해당 리 폴리곤 안에 좌표가 포함된 매물만 표시하도록 분기했다.
- 하단 리 버튼으로 열린 목록의 매물 수는 폴리곤 내부 원본 매물 수 기준으로 표시해 하단 버튼 숫자와 맞췄다.
- 일반 주소/현재위치 버튼을 직접 누르거나 시·군·구/읍면동을 다시 선택하면 리 전용 목록 상태를 해제하고 기존 읍면동 목록 방식으로 돌아가게 했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.544 기준으로 동기화했다.

### 검증
- `js/app_4.544.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.544.css` 중괄호 균형 검사 통과.
- 4.544 파일 내 4.543 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 21:43 KST / Version 4.543 - Bottom Pill Opens Region Filter

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.543.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.543.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.543.css
- /Users/GHOST/Downloads/realjeju_4.543.html
- /Users/GHOST/Downloads/js/app_4.543.js
- /Users/GHOST/Downloads/css/base_4.543.css

### 수정 내용
- 4.542 기준으로 4.543 버전을 생성했다.
- 부동산 홈 하단 행정구역 매물 수 버튼을 클릭/Enter/Space로 열 수 있는 버튼 역할로 변경했다.
- 하단 매물 수 버튼 클릭 시 상단 주소/현재위치 필터 드롭다운(`mapRegionFilterDropdown`)을 열고 기존 읍면동 매물 목록 메뉴를 표시하도록 `openRealjejuMapRegionFilterFromBottomPill()`를 연결했다.
- 하단 버튼에 `cursor:pointer`, `pointer-events:auto`, 포커스 표시를 추가했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.543 기준으로 동기화했다.

### 검증
- `js/app_4.543.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.543.css` 중괄호 균형 검사 통과.
- 4.543 파일 내 4.542 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 21:33 KST / Version 4.542 - Admin Boundary Bottom Pill Height 50

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.542.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.542.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.542.css
- /Users/GHOST/Downloads/realjeju_4.542.html
- /Users/GHOST/Downloads/js/app_4.542.js
- /Users/GHOST/Downloads/css/base_4.542.css

### 수정 내용
- 4.541 기준으로 4.542 버전을 생성했다.
- 부동산 홈 하단 행정구역 매물 수 버튼 `.admin-boundary-bottom-pill` 높이를 `48px`에서 `50px`로 조정했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.542 기준으로 동기화했다.

### 검증
- `js/app_4.542.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.542.css` 중괄호 균형 검사 통과.
- 4.542 파일 내 4.541 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 21:30 KST / Version 4.541 - Footer Company Trade Name Label

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.541.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.541.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.541.css
- /Users/GHOST/Downloads/realjeju_4.541.html
- /Users/GHOST/Downloads/js/app_4.541.js
- /Users/GHOST/Downloads/css/base_4.541.css

### 수정 내용
- 4.540 기준으로 4.541 버전을 생성했다.
- 메인 랜딩/알바/회사소개/약관 공통 하단 푸터의 회사명 앞에 `상호 : ` 문구만 추가했다.
- 회사소개 본문 운영사 정보 등 푸터 외 사업자 정보 표기는 유지했다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.541 기준으로 동기화했다.

### 검증
- `js/app_4.541.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.541.css` 중괄호 균형 검사 통과.
- 4.541 파일 내 4.540 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 21:22 KST / Version 4.540 - Bold Landing Ad Brand Text

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.540.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.540.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.540.css
- /Users/GHOST/Downloads/realjeju_4.540.html
- /Users/GHOST/Downloads/js/app_4.540.js
- /Users/GHOST/Downloads/css/base_4.540.css

### 수정 내용
- 4.539 기준으로 4.540 버전을 생성했다.
- 메인 랜딩 하단 광고 문구의 둘째 줄에서 `리얼제주`만 첫 줄과 같은 굵기로 표시하도록 `main-landing-bottom-ad-bold` 클래스를 추가했다.
- 첫 줄 전용 `strong` 스타일이 둘째 줄 안쪽 강조 텍스트에 블록 스타일로 적용되지 않도록 선택자를 직계 `strong`으로 좁혔다.
- HTML/CSS/JS 파일명 참조, `APP_VERSION`, 하단 버전 다운로드 링크를 4.540 기준으로 동기화했다.

### 검증
- `js/app_4.540.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.540.css` 중괄호 균형 검사 통과.
- 4.540 파일 내 4.539 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 12:28 KST / Version 4.539 - Sync Runtime App Version

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.539.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.539.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.539.css
- /Users/GHOST/Downloads/realjeju_4.539.html
- /Users/GHOST/Downloads/js/app_4.539.js
- /Users/GHOST/Downloads/css/base_4.539.css

### 수정 내용
- 4.538 기준으로 4.539 버전을 생성했다.
- 우측 상단 버전 표시를 렌더링하는 `APP_VERSION` 상수가 `"4.532"`로 남아 있던 문제를 `"4.539"`로 수정했다.
- 하단 고정 버전 다운로드 링크의 `data-version-download`와 `title`도 `realjeju_4.539.html`로 맞췄다.
- HTML/CSS/JS 파일명 참조와 캐시 쿼리 문자열을 4.539 기준으로 동기화했다.

### 검증
- `js/app_4.539.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.539.css` 중괄호 균형 검사 통과.
- 4.539 파일 내 4.532/4.538 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 12:19 KST / Version 4.538 - Close Right Tool Popovers On Navigation

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.538.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.538.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.538.css
- /Users/GHOST/Downloads/realjeju_4.538.html
- /Users/GHOST/Downloads/js/app_4.538.js
- /Users/GHOST/Downloads/css/base_4.538.css

### 수정 내용
- 4.537 기준으로 4.538 버전을 생성했다.
- 부동산 홈 우측 메뉴의 중개/개발/생활/지도 타입 팝오버가 열린 상태에서 알바나 다른 카테고리로 이동하면 화면 위에 남던 문제를 수정했다.
- 전역 카테고리 전환, 알바 페이지 진입, 지도 홈 패널 정리 경로에서 기존 공통 함수 `closeRightMapToolPanels()`를 호출하도록 연결했다.

### 검증
- `js/app_4.538.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.538.css` 중괄호 균형 검사 통과.
- 4.538 파일 내 4.537 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:39 KST / Version 4.537 - Public Part-Time Cards With Login Detail

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.537.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.537.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.537.css
- /Users/GHOST/Downloads/realjeju_4.537.html
- /Users/GHOST/Downloads/js/app_4.537.js
- /Users/GHOST/Downloads/css/base_4.537.css

### 수정 내용
- 4.536 기준으로 4.537 버전을 생성했다.
- 알바 카테고리를 관리자 전용 카테고리에서 제외해 비로그인/일반 이용자도 알바 공고 카드 목록을 볼 수 있게 했다.
- 알바 공고 상세 패널을 열 때는 로그인 여부를 확인하도록 `requirePartTimeDetailLogin()`을 추가했다.
- 비로그인 상태에서 알바 공고 카드를 클릭하거나 키보드로 열면 로그인 안내 후 로그인 모달로 연결되도록 했다.

### 검증
- `js/app_4.537.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.537.css` 중괄호 균형 검사 통과.
- 4.537 파일 내 4.536 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:31 KST / Version 4.536 - Part-Time Company Ellipsis

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.536.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.536.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.536.css
- /Users/GHOST/Downloads/realjeju_4.536.html
- /Users/GHOST/Downloads/js/app_4.536.js
- /Users/GHOST/Downloads/css/base_4.536.css

### 수정 내용
- 4.535 기준으로 4.536 버전을 생성했다.
- 알바 공고 카드의 회사명 `.part-time-card-company`에 한 줄 말줄임표 규칙을 적용했다.
- 회사명이 길어도 줄바꿈하지 않고 카드 폭 안에서 `...`로 잘리도록 `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`를 추가했다.

### 검증
- `js/app_4.536.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.536.css` 중괄호 균형 검사 통과.
- 4.536 파일 내 4.535 참조 잔여 없음 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:24 KST / Version 4.535 - Terms Company Name Cleanup

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.535.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.535.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.535.css
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/realjeju_4.535.html
- /Users/GHOST/Downloads/js/app_4.535.js
- /Users/GHOST/Downloads/css/base_4.535.css
- /Users/GHOST/Downloads/sql/legal_documents_4.343.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.529.sql

### 수정 내용
- 4.534 기준으로 4.535 버전을 생성했다.
- 이용약관/위치기반 서비스 이용약관의 회사명을 `(주)디에이치인베스트먼트`로 재확인하고, 예전 `(주)디에이치홀딩스부동산중개법인` 계열 문구가 남지 않도록 정리했다.
- 서비스 이용약관 제1조 문장을 `(주)디에이치인베스트먼트(이하 "회사"라 함)가 운영하는...`으로 정리했다.
- 위치기반 서비스 이용약관 제1조 문장을 `(주)디에이치인베스트먼트(이하 "회사"라 함)와 리얼제주 위치기반서비스...`로 정리했다.

### 검증
- `js/app_4.535.js` 문법 검사 통과: bundled Node `--check`.
- 4.535 앱 파일 및 관련 SQL에서 기존 회사명, 잘못된 조사, 4.534 참조 잔여 없음 확인.
- `legal_documents_4.343.sql`, `legal_documents_4.529.sql` JSONB 본문 파싱 통과.
- 서비스/위치기반 약관 제1조 본문 직접 파싱 확인.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:18 KST / Version 4.534 - Commerce Report Number Pending

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.534.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.534.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.534.css
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/realjeju_4.534.html
- /Users/GHOST/Downloads/js/app_4.534.js
- /Users/GHOST/Downloads/css/base_4.534.css
- /Users/GHOST/Downloads/sql/legal_documents_4.343.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.529.sql

### 수정 내용
- 4.533 기준으로 4.534 버전을 생성했다.
- 푸터/회사정보의 `통신판매업 신고번호 : 2023-제주노형-0091`을 `통신판매업 신고번호 : 2026-제주노형-발급준비중`으로 변경했다.
- 위치기반 서비스 이용약관의 사업자 정보 내 `통신판매업신고` 값도 같은 문구로 변경했다.

### 검증
- `js/app_4.534.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.534.css` 중괄호 균형 검사 통과.
- 4.534 앱 파일 및 관련 SQL에서 기존 통신판매업 신고번호 `2023-제주노형-0091` 잔여 없음 확인.
- `legal_documents_4.343.sql`, `legal_documents_4.529.sql` JSONB 본문 파싱 통과.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:12 KST / Version 4.533 - Footer Company Information Update

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.533.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.533.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.533.css
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Documents/REALJEJU/sql/remove_schnaufer_broker_badge_3.929.sql
- /Users/GHOST/Downloads/realjeju_4.533.html
- /Users/GHOST/Downloads/js/app_4.533.js
- /Users/GHOST/Downloads/css/base_4.533.css
- /Users/GHOST/Downloads/sql/legal_documents_4.343.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/sql/remove_schnaufer_broker_badge_3.929.sql

### 수정 내용
- 4.532 기준으로 4.533 버전을 생성했다.
- 전체 정적 푸터/회사정보 표기의 운영사를 `(주)디에이치인베스트먼트`로 변경했다.
- `대표이사ㆍ공인중개사 : 김대홍` 표기를 `대표 : 김대홍`으로 변경했다.
- 사업자등록번호를 `534-87-01667`로 변경했다.
- `중개사무소 등록번호 : 50110-2023-00022` 표기를 푸터/회사정보 영역에서 제거했다.
- 회사소개 운영사 정보 문장과 매물관리 규정 내장 문구의 회사명도 같은 운영사명으로 맞췄다.
- SQL 약관의 사업자 정보도 새 사업자등록번호와 대표 표기로 맞췄다.

### 검증
- `js/app_4.533.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.533.css` 중괄호 균형 검사 통과.
- 4.533 앱 파일 및 관련 SQL에서 기존 회사명, 기존 사업자번호, 중개사무소 등록번호, 기존 대표 표기 잔여 없음 확인.
- `legal_documents_4.343.sql`, `legal_documents_4.529.sql` JSONB 본문 파싱 통과.
- Downloads 폴더 복사 완료 및 원본과 `cmp` 동일성 확인.

## 2026-07-10 11:05 KST / SQL Company Name Update

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Documents/REALJEJU/sql/remove_schnaufer_broker_badge_3.929.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.343.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/sql/remove_schnaufer_broker_badge_3.929.sql

### 수정 내용
- SQL 내 `(주)디에이치홀딩스부동산중개법인` 문구를 모두 `(주)디에이치인베스트먼트`로 변경했다.
- 워크스페이스 SQL 기준 총 9건 치환했다.

### 검증
- SQL 전체에서 기존 문구 `(주)디에이치홀딩스부동산중개법인` 잔여 0건 확인.
- 새 문구 `(주)디에이치인베스트먼트` 9건 확인.
- `legal_documents_4.343.sql`, `legal_documents_4.529.sql` JSONB 본문 파싱 통과.
- Downloads `/sql` 복사본과 워크스페이스 원본 `cmp` 동일성 확인.

## 2026-07-10 11:00 KST / SQL Legal Documents - Service Terms Company Name

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.343.sql
- /Users/GHOST/Downloads/sql/legal_documents_4.529.sql

### 수정 내용
- `리얼제주 서비스 이용약관 (Terms of Service)` 제1조 목적의 회사명을 `리얼제주 주식회사`에서 `(주)디에이치홀딩스부동산중개법인`으로 변경했다.
- 문장 조사도 회사명에 맞춰 `운영하는`에서 `운영하는` 문맥의 주어를 `(주)디에이치홀딩스부동산중개법인(이하 "회사"라 함)이`로 정리했다.

### 검증
- `legal_documents_4.343.sql`, `legal_documents_4.529.sql` JSONB 본문 파싱 통과.
- 기존 서비스 약관 회사명 `본 약관은 리얼제주 주식회사` 잔여 0건 확인.
- Downloads `/sql` 복사본과 워크스페이스 원본 `cmp` 동일성 확인.

## 2026-07-10 10:52 KST / Version 4.532 - Match Company Contact Bottom Gap

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.532.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.532.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.532.css
- /Users/GHOST/Downloads/realjeju_4.532.html
- /Users/GHOST/Downloads/js/app_4.532.js
- /Users/GHOST/Downloads/css/base_4.532.css

### 수정 내용
- 4.531 기준으로 4.532 버전을 생성했다.
- 회사소개 페이지 `문의 및 제휴` 섹션 아래쪽 푸터와의 간격이 상단보다 커 보이던 원인인 `.company-full-footer-shell`의 `margin-top: 64px`를 `28px`로 줄였다.
- `문의 및 제휴` 섹션 자체의 상단/하단 내부 여백 `28px`는 그대로 유지했다.

### 검증
- `js/app_4.532.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.532.css` 중괄호 균형 검사 통과.
- 4.532 파일 내 `4.531`/`4531` 잔여 참조 없음 확인.
- Downloads 폴더 복사 완료.

## 2026-07-10 10:48 KST / Version 4.531 - Always Show Realestate Admin Boundary Count Pill

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.531.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.531.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.531.css
- /Users/GHOST/Downloads/realjeju_4.531.html
- /Users/GHOST/Downloads/js/app_4.531.js
- /Users/GHOST/Downloads/css/base_4.531.css

### 수정 내용
- 4.530 기준으로 4.531 버전을 생성했다.
- 부동산 홈에서는 하단 행정구역 매물 수 버튼이 개발 패널의 `행정구역` 옵션과 무관하게 항상 갱신되도록 분리했다.
- `개발 - 행정구역` 옵션은 기존처럼 경계선/반투명 칠 표시만 담당하게 유지했다.
- 지도 이동/확대, 부동산 홈 복귀, 매물 마커 렌더 이후 하단 버튼의 행정구역명/매물 수가 갱신되도록 연결했다.
- 계산 중 별도 문구나 임시 로딩 표시를 추가하지 않았다. 계산 결과가 준비되면 갱신하고, 그 전에는 기존 표시를 유지한다.
- 메인 랜딩, 약관 전체 페이지, 회사소개 전체 페이지, 빈 지도 카테고리에서는 하단 매물 수 버튼을 숨기도록 처리했다.

### 검증
- `js/app_4.531.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.531.css` 중괄호 균형 검사 통과.
- 4.531 파일 내 `4.530`/`4530` 잔여 참조 없음 확인.
- 하단 행정구역 매물 수 버튼 관련 신규 로딩 문구가 없음을 확인했다.
- Downloads 폴더 복사 완료.

## 2026-07-10 10:35 KST / Version 4.530 - Remove Company Contact Divider

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.530.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.530.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.530.css
- /Users/GHOST/Downloads/realjeju_4.530.html
- /Users/GHOST/Downloads/js/app_4.530.js
- /Users/GHOST/Downloads/css/base_4.530.css

### 수정 내용
- 4.529 기준으로 4.530 버전을 생성했다.
- 회사소개 페이지 `문의 및 제휴` 섹션 위쪽 선(`border-top`)을 제거했다.
- `문의 및 제휴` 섹션의 상단/하단 내부 여백을 같은 28px로 맞췄다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.530.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.530.css` 중괄호 균형 검사 통과.
- 4.530 파일 내 `4.529`/`4529` 잔여 참조 없음 확인.
- Downloads 폴더 복사 완료.

## 2026-07-10 10:24 KST / Version 4.529 - Legal Document Links And Location Terms Copy

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.529.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.529.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.529.css
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.343.sql
- /Users/GHOST/Documents/REALJEJU/sql/legal_documents_4.529.sql
- /Users/GHOST/Downloads/realjeju_4.529.html
- /Users/GHOST/Downloads/js/app_4.529.js
- /Users/GHOST/Downloads/css/base_4.529.css

### 수정 내용
- 4.528 기준으로 4.529 버전을 생성했다.
- 위치기반 서비스 이용약관 제1조의 회사명을 `(주)디에이치홀딩스부동산중개법인`으로 수정했다.
- 위치기반 서비스 이용약관 제2조의 `① 리얼제주 회사가 제공하는 위치기반서비스입니다.`를 `① 회사가 제공하는 위치기반서비스입니다.`로 수정했다.
- 매물관리 규정의 법령 근거 4개 항목에서 괄호 URL 노출을 제거하고, 표시 문구는 그대로 두되 URL은 실제 링크로 적용되도록 SQL을 `label/url` 객체 구조로 바꿨다.
- 약관 렌더러가 `label/url` 객체를 실제 `<a>` 링크로 출력하도록 추가했다.
- DB를 못 읽는 경우 사용하는 `listing-policy` 로컬 fallback도 같은 링크 구조로 맞췄다.

### 검증
- `js/app_4.529.js` 문법 검사 통과: bundled Node `--check`.
- `sql/legal_documents_4.343.sql` 내부 `jsonb` 문서 5개 JSON 파싱 통과.
- 4.529 파일 내 `4.528`/`4528` 잔여 참조 없음 확인.
- 이전 위치기반 약관 문구와 괄호 URL 노출 문구가 남아 있지 않음을 확인했다.

## 2026-07-10 10:00 KST / Version 4.528 - Prevent Realestate Active State On Main Landing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.528.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.528.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.528.css
- /Users/GHOST/Downloads/realjeju_4.528.html
- /Users/GHOST/Downloads/js/app_4.528.js
- /Users/GHOST/Downloads/css/base_4.528.css

### 수정 내용
- 4.527 기준으로 4.528 버전을 생성했다.
- `syncGlobalCategoryActive()`가 호출되더라도 `body.main-landing-page-open` 상태에서는 상단 카테고리 활성화를 하지 않고 즉시 `clearGlobalCategoryActive()`로 비우도록 방어 조건을 추가했다.
- 다른 초기화 흐름이 실수로 `부동산`에 `is-active`를 다시 붙여도 메인 랜딩 상태에서는 선택 표시가 보이지 않도록 CSS 방어 규칙을 추가했다.
- 메인 랜딩 초기 HTML에는 `부동산` 버튼의 `is-active`/`aria-current`가 남아 있지 않음을 유지했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.528.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.528.css` 중괄호 균형 검사 통과.
- 4.528 파일 내 `4.527`/`4527` 잔여 참조 없음 확인.
- Downloads 폴더 복사 및 4.528 파일 참조 확인 완료.
- 다운로드 복사본에서 `syncGlobalCategoryActive()`의 `main-landing-page-open` 방어 조건과 CSS 방어 규칙 확인 완료.

## 2026-07-10 09:44 KST / Version 4.527 - Clear Realestate Active State On Landing And Terms

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.527.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.527.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.527.css
- /Users/GHOST/Downloads/realjeju_4.527.html
- /Users/GHOST/Downloads/js/app_4.527.js
- /Users/GHOST/Downloads/css/base_4.527.css

### 수정 내용
- 4.526 기준으로 4.527 버전을 생성했다.
- 메인 랜딩 초기 화면에서 상단 카테고리 `부동산` 버튼에 박혀 있던 `is-active`와 `aria-current="page"`를 제거했다.
- `clearGlobalCategoryActive()`를 추가해 상단 카테고리의 활성 표시와 `aria-current`를 모두 비울 수 있게 했다.
- 메인 랜딩 초기화/재오픈 시 상단 카테고리 활성 표시가 남지 않도록 처리했다.
- 이용약관 전체 페이지를 열 때도 상단 카테고리 활성 표시가 남지 않도록 처리했다.
- 이용약관 전체 페이지가 열린 상태에서는 메인 랜딩처럼 `#topbarMenu`와 내부 필터 드롭다운/메뉴 항목을 숨겨 부동산 필터 `전체`가 보이지 않게 했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.527.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.527.css` 중괄호 균형 검사 통과.
- 4.527 파일 내 `4.526`/`4526` 잔여 참조 없음 확인.
- 4.527 HTML 초기 상태에서 `data-global-category="realestate"` 버튼의 `is-active`/`aria-current` 제거 확인.
- Downloads 폴더 복사 및 4.527 파일 참조 확인 완료.

## 2026-07-10 01:45 KST / Version 4.526 - Match Company Scrollbar Handling To Landing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.526.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.526.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.526.css
- /Users/GHOST/Downloads/realjeju_4.526.html
- /Users/GHOST/Downloads/js/app_4.526.js
- /Users/GHOST/Downloads/css/base_4.526.css

### 수정 내용
- 4.525 기준으로 4.526 버전을 생성했다.
- 메인 랜딩과 같은 방식으로 회사소개 페이지가 열렸을 때 `html`, `body`, `.company-full-page`, `.company-full-body`의 스크롤바 표시를 숨기도록 맞췄다.
- 회사소개 본문 스크롤 동작은 유지하고, 오른쪽에 보이는 스크롤바만 랜딩 페이지처럼 보이지 않게 처리했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.526.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.526.css` 중괄호 균형 검사 통과.
- 4.526 파일 내 `4.525`/`4525` 잔여 참조 없음 확인.
- 4.526 HTML은 `img/company_intro_map_4.505.svg`를 계속 참조하고, `company_intro_map_4.526.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.526 파일 참조 확인 완료.

## 2026-07-10 01:42 KST / Version 4.525 - Force Company Content To Main Landing Width

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.525.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.525.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.525.css
- /Users/GHOST/Downloads/realjeju_4.525.html
- /Users/GHOST/Downloads/js/app_4.525.js
- /Users/GHOST/Downloads/css/base_4.525.css

### 수정 내용
- 4.524 기준으로 4.525 버전을 생성했다.
- 메인 랜딩 실제 폭 기준인 `--realjeju-main-page-width`를 회사소개 본문 폭 변수 `--company-full-content-width`에 직접 연결했다.
- 회사소개 `hero`/`section`에 `width`, `max-width`, `inline-size`, `max-inline-size`를 모두 같은 폭 변수로 고정했다.
- 회사소개 내부 이미지 그림자나 자식 요소가 랜딩 메인 폭 밖으로 시각적으로 튀어나와 보이지 않도록 `overflow-x: clip`을 추가했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.525.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.525.css` 중괄호 균형 검사 통과.
- 4.525 파일 내 `4.524`/`4524` 잔여 참조 없음 확인.
- 4.525 HTML은 `img/company_intro_map_4.505.svg`를 계속 참조하고, `company_intro_map_4.525.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.525 파일 참조 확인 완료.

## 2026-07-10 01:37 KST / Version 4.524 - Bind Company Width To Landing Final Rule

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.524.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.524.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.524.css
- /Users/GHOST/Downloads/realjeju_4.524.html
- /Users/GHOST/Downloads/js/app_4.524.js
- /Users/GHOST/Downloads/css/base_4.524.css

### 수정 내용
- 4.523 기준으로 4.524 버전을 생성했다.
- 메인 랜딩 폭의 최종 기준을 `body.realjeju-side-nav-enabled`의 `--realjeju-main-page-width: min(1120px, calc(100vw - 64px))`와 `body.main-landing-page-open .main-landing-inner` 적용 규칙으로 확인했다.
- 회사소개 콘텐츠 폭을 상속 변수에 기대지 않고 메인 랜딩 최종 폭 계산식과 같은 `min(1120px, calc(100vw - 64px))`로 직접 고정했다.
- 모바일 회사소개 폭 덮어쓰기도 메인 랜딩 모바일 폭과 같은 `min(100% - 28px, 520px)` 기준으로 맞췄다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.524.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.524.css` 중괄호 균형 검사 통과.
- 4.524 HTML의 CSS/JS 참조가 `base_4.524.css`, `app_4.524.js`로 갱신된 것을 확인했다.
- 4.524 파일 내 `4.523`/`4523` 잔여 참조 없음 확인.
- 4.524 HTML은 `img/company_intro_map_4.505.svg`를 계속 참조하고, `company_intro_map_4.524.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.524 파일 참조 확인 완료.

## 2026-07-10 01:29 KST / Version 4.522 - Connect Main Landing Address Search

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.522.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.522.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.522.css
- /Users/GHOST/Downloads/realjeju_4.522.html
- /Users/GHOST/Downloads/js/app_4.522.js
- /Users/GHOST/Downloads/css/base_4.522.css

### 수정 내용
- 4.521 기준으로 4.522 버전을 생성했다.
- 메인 랜딩 검색창에서 주소를 입력하고 검색하면 부동산 홈으로 이동한 뒤 해당 주소 검색을 실행하도록 연결했다.
- 랜딩 검색어를 상단 주소검색 input에 세팅하고 기존 `handleSubAddressSearch()` 흐름을 재사용해 지도 이동과 주소 마커 표시가 되도록 했다.
- 지도/카카오 주소검색 서비스가 준비되기 전이면 짧게 재시도하도록 `runMainLandingAddressSearch()`를 추가했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.522.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.522.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.522 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.522.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.522 파일 참조 확인 완료.

## 2026-07-10 01:25 KST / Version 4.521 - Match Company Width To Main Landing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.521.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.521.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.521.css
- /Users/GHOST/Downloads/realjeju_4.521.html
- /Users/GHOST/Downloads/js/app_4.521.js
- /Users/GHOST/Downloads/css/base_4.521.css

### 수정 내용
- 4.520 기준으로 4.521 버전을 생성했다.
- 회사소개 콘텐츠 폭을 메인 랜딩 폭 변수 `--realjeju-main-page-width`와 동일하게 맞췄다.
- `.company-full-body`의 `--company-full-content-width`를 `var(--realjeju-main-page-width, min(1120px, calc(100vw - 64px)))`로 변경했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.521.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.521.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.521 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.521.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.521 파일 참조 확인 완료.

## 2026-07-10 01:22 KST / Version 4.520 - Add Company Operator Heading Gap

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.520.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.520.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.520.css
- /Users/GHOST/Downloads/realjeju_4.520.html
- /Users/GHOST/Downloads/js/app_4.520.js
- /Users/GHOST/Downloads/css/base_4.520.css

### 수정 내용
- 4.519 기준으로 4.520 버전을 생성했다.
- 회사소개 운영사 정보 박스의 세로 중앙 정렬은 유지했다.
- `운영사 정보` 제목과 소개문 사이 여백을 `18px`로 조정했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.520.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.520.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.520 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.520.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.520 파일 참조 확인 완료.

## 2026-07-10 01:20 KST / Version 4.519 - Center Company Operator Box Content

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.519.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.519.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.519.css
- /Users/GHOST/Downloads/realjeju_4.519.html
- /Users/GHOST/Downloads/js/app_4.519.js
- /Users/GHOST/Downloads/css/base_4.519.css

### 수정 내용
- 4.518 기준으로 4.519 버전을 생성했다.
- 회사소개 운영사 정보 박스 내부 세로 정렬을 `align-items: start`에서 `align-items: center`로 변경했다.
- 운영사 설명문이 오른쪽 정보 목록 높이 기준으로 박스 중앙에 오도록 조정했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.519.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.519.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.519 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.519.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.519 파일 참조 확인 완료.

## 2026-07-10 01:16 KST / Version 4.518 - Update Company Operation Copy

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.518.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.518.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.518.css
- /Users/GHOST/Downloads/realjeju_4.518.html
- /Users/GHOST/Downloads/js/app_4.518.js
- /Users/GHOST/Downloads/css/base_4.518.css

### 수정 내용
- 4.517 기준으로 4.518 버전을 생성했다.
- 회사소개 운영사 정보 소개문을 줄바꿈 구조로 정리했다.
- 운영사 소개문 아래에 `리얼제주는 제주 지역 이용자가 필요한 정보를 / 지도에서 쉽게 찾고 비교할 수 있도록 서비스를 운영합니다.` 문구를 추가했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.518.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.518.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.518 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.518.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.518 파일 참조 확인 완료.

## 2026-07-10 01:14 KST / Version 4.517 - Equalize Company Contact Divider Spacing

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.517.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.517.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.517.css
- /Users/GHOST/Downloads/realjeju_4.517.html
- /Users/GHOST/Downloads/js/app_4.517.js
- /Users/GHOST/Downloads/css/base_4.517.css

### 수정 내용
- 4.516 기준으로 4.517 버전을 생성했다.
- 회사소개 `문의 및 제휴` 구분선 위 여백과 아래 여백을 같은 값으로 맞췄다.
- `.company-full-contact`에 `margin-top: 28px`와 `padding: 28px 0 0`을 적용했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.517.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.517.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.517 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.517.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.517 파일 참조 확인 완료.

## 2026-07-10 01:12 KST / Version 4.516 - Add Company Contact Divider

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.516.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.516.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.516.css
- /Users/GHOST/Downloads/realjeju_4.516.html
- /Users/GHOST/Downloads/js/app_4.516.js
- /Users/GHOST/Downloads/css/base_4.516.css

### 수정 내용
- 4.515 기준으로 4.516 버전을 생성했다.
- 회사소개 `문의 및 제휴` 섹션은 박스 없이 유지했다.
- `문의 및 제휴` 위에 얇은 상단 구분선 `border-top: 1px solid #e5e7eb`을 추가하고 상단 패딩을 `28px`로 정리했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.516.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.516.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.516 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.516.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.516 파일 참조 확인 완료.

## 2026-07-10 01:09 KST / Version 4.515 - Add Company Business Number

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.515.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.515.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.515.css
- /Users/GHOST/Downloads/realjeju_4.515.html
- /Users/GHOST/Downloads/js/app_4.515.js
- /Users/GHOST/Downloads/css/base_4.515.css

### 수정 내용
- 4.514 기준으로 4.515 버전을 생성했다.
- 회사소개 운영사 정보에서 `운영사`와 `대표이사ㆍ공인중개사` 사이에 `사업자번호 203-88-00816`을 추가했다.
- `문의 및 제휴` 섹션은 박스 없이 유지하고, 가운데 정렬에서 왼쪽 정렬로 변경했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.515.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.515.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.515 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.515.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.515 파일 참조 확인 완료.

## 2026-07-10 01:07 KST / Version 4.514 - Unbox Company Contact Section

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.514.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.514.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.514.css
- /Users/GHOST/Downloads/realjeju_4.514.html
- /Users/GHOST/Downloads/js/app_4.514.js
- /Users/GHOST/Downloads/css/base_4.514.css

### 수정 내용
- 4.513 기준으로 4.514 버전을 생성했다.
- 회사소개 하단 `문의 및 제휴` 섹션의 박스형 테두리, 배경, 버튼형 장식을 제거했다.
- `문의 및 제휴`는 운영사 정보 아래에서 가운데 정렬된 짧은 안내 문구와 파란색 고객센터 링크로 보이게 정리했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.514.js` 문법 검사 통과: bundled Node `--check`.
- `css/base_4.514.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.514 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.514.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.514 파일 참조 확인 완료.

## 2026-07-10 01:03 KST / Version 4.513 - Add Company Contact Section

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.513.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.513.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.513.css
- /Users/GHOST/Downloads/realjeju_4.513.html
- /Users/GHOST/Downloads/js/app_4.513.js
- /Users/GHOST/Downloads/css/base_4.513.css

### 수정 내용
- 4.512 기준으로 4.513 버전을 생성했다.
- 회사소개 운영사 정보 아래에 `문의 및 제휴` 섹션을 추가했다.
- 문구는 `리얼제주 서비스 이용, 광고, 제휴 문의는 고객센터로 연락해 주세요.`로 구성했다.
- 고객센터 전화 링크 `tel:0647450531`을 함께 배치했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.513.js` 문법 검사 통과: `node --check`.
- `css/base_4.513.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.513 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.513.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.513 파일 참조 확인 완료.

## 2026-07-10 01:00 KST / Version 4.512 - Reorder Company Intro Sections

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.512.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.512.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.512.css
- /Users/GHOST/Downloads/realjeju_4.512.html
- /Users/GHOST/Downloads/js/app_4.512.js
- /Users/GHOST/Downloads/css/base_4.512.css

### 수정 내용
- 4.511 기준으로 4.512 버전을 생성했다.
- 회사소개 페이지 섹션 순서를 `상단 소개 → Service/Local/Trust 카드 → 짧은 문구/부동산 홈 바로가기 → 운영사 정보 → 푸터` 순서로 재배치했다.
- 짧은 문구와 운영사 정보 사이 여백을 `64px` 기준으로 맞췄다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.512.js` 문법 검사 통과: `node --check`.
- `css/base_4.512.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.512 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.512.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.512 파일 참조 확인 완료.

## 2026-07-10 00:55 KST / Version 4.511 - Shorten Company Operation Copy

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.511.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.511.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.511.css
- /Users/GHOST/Downloads/realjeju_4.511.html
- /Users/GHOST/Downloads/js/app_4.511.js
- /Users/GHOST/Downloads/css/base_4.511.css

### 수정 내용
- 4.510 기준으로 4.511 버전을 생성했다.
- 회사소개 운영 기준 문구를 `제주 생활과 부동산 정보를 / 더 쉽게 연결합니다.`로 단축했다.
- 파란색 `리얼제주 부동산 홈 >` 바로가기 버튼은 유지했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.511.js` 문법 검사 통과: `node --check`.
- `css/base_4.511.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.511 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.511.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.511 파일 참조 확인 완료.

## 2026-07-10 00:51 KST / Version 4.510 - Short Company Operation Copy And Home Link

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.510.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.510.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.510.css
- /Users/GHOST/Downloads/realjeju_4.510.html
- /Users/GHOST/Downloads/js/app_4.510.js
- /Users/GHOST/Downloads/css/base_4.510.css

### 수정 내용
- 4.509 기준으로 4.510 버전을 생성했다.
- 회사소개 운영 기준 문구를 짧은 두 줄 카피로 교체했다.
- 문구를 `제주 생활과 부동산 정보를 / 지도에서 더 쉽게 연결합니다.`로 정리했다.
- 아래에 파란색 `리얼제주 부동산 홈 >` 바로가기 버튼을 추가했다.
- 회사소개 바로가기 버튼 클릭 시 회사소개 화면을 닫고 부동산 홈으로 이동하도록 JS 동작을 연결했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.510.js` 문법 검사 통과: `node --check`.
- `css/base_4.510.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.510 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.510.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.510 파일 참조 확인 완료.

## 2026-07-10 00:37 KST / Version 4.509 - Centered Company Operation Statement

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.509.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.509.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.509.css
- /Users/GHOST/Downloads/realjeju_4.509.html
- /Users/GHOST/Downloads/js/app_4.509.js
- /Users/GHOST/Downloads/css/base_4.509.css

### 수정 내용
- 4.508 기준으로 4.509 버전을 생성했다.
- 회사소개 운영 기준 문구 영역에서 박스 배경/테두리를 제거했다.
- 운영 기준 문구를 가운데 정렬하고, 상단 타이틀과 같은 `32px / 720` 계열로 맞췄다.
- 운영 기준 문구 상단 여백과 하단 푸터 전 여백을 각각 `64px` 기준으로 맞췄다.
- 고객센터 링크는 문구 아래 가운데 정렬 텍스트 링크로 유지했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.509.js` 문법 검사 통과: `node --check`.
- `css/base_4.509.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.509 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.509.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.509 파일 참조 확인 완료.

## 2026-07-10 00:24 KST / Version 4.508 - Company Intro Operation Note

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.508.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.508.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.508.css
- /Users/GHOST/Downloads/realjeju_4.508.html
- /Users/GHOST/Downloads/js/app_4.508.js
- /Users/GHOST/Downloads/css/base_4.508.css

### 수정 내용
- 4.507 기준으로 4.508 버전을 생성했다.
- 회사소개 `운영사 정보` 섹션 아래에 짧은 운영 기준 안내 박스를 추가했다.
- 안내 박스에 고객센터 전화 링크 `tel:0647450531`을 함께 배치했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.

### 검증
- `js/app_4.508.js` 문법 검사 통과: `node --check`.
- `css/base_4.508.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.508 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.508.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.508 파일 참조 확인 완료.

## 2026-07-10 00:20 KST / Version 4.507 - Company Intro Hero Copy Revision

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.507.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.507.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.507.css
- /Users/GHOST/Downloads/realjeju_4.507.html
- /Users/GHOST/Downloads/js/app_4.507.js
- /Users/GHOST/Downloads/css/base_4.507.css

### 수정 내용
- 4.506 기준으로 4.507 버전을 생성했다.
- 회사소개 상단 제목을 `제주의 생활과 부동산 정보를 한 곳에!`로 수정했다.
- 회사소개 설명문을 `지도 중심으로 연결하는` 뒤에서 줄바꿈되도록 수정했다.
- 이미지 내용 변화가 없으므로 새 SVG를 만들지 않고 `img/company_intro_map_4.505.svg`를 계속 참조했다.
- 버전 치환 중 잘못 바뀐 광고문의 전화 링크를 `tel:0647450531`로 바로잡았다.

### 검증
- `js/app_4.507.js` 문법 검사 통과: `node --check`.
- `css/base_4.507.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.507 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.507.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.507 파일 참조 확인 완료.

## 2026-07-10 00:11 KST / Version 4.506 - Move Company Intro Image To img Folder

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.506.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.506.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.506.css
- /Users/GHOST/Documents/REALJEJU/img/company_intro_map_4.505.svg
- /Users/GHOST/Downloads/realjeju_4.506.html
- /Users/GHOST/Downloads/js/app_4.506.js
- /Users/GHOST/Downloads/css/base_4.506.css
- /Users/GHOST/Downloads/img/company_intro_map_4.505.svg

### 수정 내용
- 4.505 기준으로 4.506 버전을 생성했다.
- 회사소개/메인 랜딩 지도 이미지를 `img/company_intro_map_4.505.svg` 경로로 정리했다.
- 이미지 내용 변화가 없으므로 `company_intro_map_4.506.svg`는 만들지 않았다.
- 이후 이미지 내용 변화가 없으면 기존 공용 SVG를 계속 참조한다.

### 검증
- `js/app_4.506.js` 문법 검사 통과: `node --check`.
- `css/base_4.506.css` 중괄호 균형 검사 통과.
- `img/company_intro_map_4.505.svg` XML parse 통과.
- 4.506 HTML은 `img/company_intro_map_4.505.svg`만 참조하고, `company_intro_map_4.506.svg` 파일은 생성하지 않았음을 확인했다.
- Downloads 폴더 복사 및 4.506 파일 참조 확인 완료.

## 2026-07-10 00:07 KST / Version 4.505 - Restore Company Intro Lead

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.505.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.505.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.505.css
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.505.svg
- /Users/GHOST/Downloads/realjeju_4.505.html
- /Users/GHOST/Downloads/js/app_4.505.js
- /Users/GHOST/Downloads/css/base_4.505.css
- /Users/GHOST/Downloads/company_intro_map_4.505.svg

### 수정 내용
- 4.504 기준으로 4.505 버전을 생성했다.
- 회사소개 상단 제목 아래에 누락된 설명문을 다시 추가했다.
- 복구 문구: `리얼제주는 제주 지역의 부동산 매물, 동네업체, 생활 정보, 구인 공고를 지도 중심으로 연결하는 지역 기반 프롭테크 서비스입니다.`

### 검증
- `js/app_4.505.js` 문법 검사 통과: `node --check`.
- `css/base_4.505.css` 중괄호 균형 검사 통과.
- `company_intro_map_4.505.svg` XML parse 통과.
- 4.505 HTML/CSS/JS에서 4.504 및 4504 잔여 참조 없음 확인.
- Downloads 폴더 복사 및 4.505 파일 참조 확인 완료.

## 2026-07-09 23:58 KST / Version 4.504 - Hide Category Post Register Button

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.504.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.504.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.504.css
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.504.svg
- /Users/GHOST/Downloads/realjeju_4.504.html
- /Users/GHOST/Downloads/js/app_4.504.js
- /Users/GHOST/Downloads/css/base_4.504.css
- /Users/GHOST/Downloads/company_intro_map_4.504.svg

### 수정 내용
- 4.503 기준으로 4.504 버전을 생성했다.
- 현재 상단 카테고리를 `body[data-global-category]`에 기록하도록 했다.
- 왼쪽 메뉴의 `+ 게시글 등록` 버튼을 동네업체(`local-business`)와 자동차(`car`) 카테고리에서 숨겼다.
- 다른 카테고리/부동산 홈의 기존 버튼 동작은 유지했다.

### 검증
- `js/app_4.504.js` 문법 검사 통과: `node --check`.
- `css/base_4.504.css` 중괄호 균형 검사 통과.
- `company_intro_map_4.504.svg` XML parse 통과.
- 4.504 HTML/CSS/JS에서 4.503 및 4503 잔여 참조 없음 확인.
- Downloads 폴더 복사 및 4.504 파일 참조 확인 완료.

## 2026-07-09 23:54 KST / Version 4.503 - Company Intro Hero Copy And Map Visual

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.503.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.503.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.503.css
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.503.svg
- /Users/GHOST/Downloads/realjeju_4.503.html
- /Users/GHOST/Downloads/js/app_4.503.js
- /Users/GHOST/Downloads/css/base_4.503.css
- /Users/GHOST/Downloads/company_intro_map_4.503.svg

### 수정 내용
- 4.502 기준으로 4.503 버전을 생성했다.
- 회사소개 상단 문구를 `리얼제주(REALJEJU.APP)` / `제주의 생활과 부동산 정보를 한 곳에 모읍니다.` 두 줄 구조로 정리했다.
- 회사소개 상단의 기존 긴 설명문은 제거했다.
- 운영사 정보 섹션 아래 푸터 전 여백을 상단 여백 기준과 맞춰 `64px`로 키웠다.
- 회사소개 이미지를 지도 UI 느낌의 자체 SVG 이미지로 교체했다.

### 검증
- `js/app_4.503.js` 문법 검사 통과: `node --check`.
- `css/base_4.503.css` 중괄호 균형 검사 통과.
- `company_intro_map_4.503.svg` XML parse 통과.
- 4.503 HTML/CSS/JS에서 4.502 및 4502 잔여 참조 없음 확인.
- Downloads 폴더 복사 및 4.503 파일 참조 확인 완료.

## 2026-07-09 23:50 KST / Version 4.502 - Admin Boundary Pill Count Weight

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.502.html
- /Users/GHOST/Documents/REALJEJU/js/app_4.502.js
- /Users/GHOST/Documents/REALJEJU/css/base_4.502.css
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.502.svg
- /Users/GHOST/Downloads/realjeju_4.502.html
- /Users/GHOST/Downloads/js/app_4.502.js
- /Users/GHOST/Downloads/css/base_4.502.css
- /Users/GHOST/Downloads/company_intro_map_4.502.svg

### 수정 내용
- 4.501 기준으로 4.502 버전을 생성했다.
- 행정구역 하단 중앙 pill에서 `매물` 뒤 숫자만 `font-weight:900`으로 더 진하게 표시했다.
- `매물` 라벨 색상과 기존 pill 크기/위치/테두리 값은 유지했다.

### 검증
- `js/app_4.502.js` 문법 검사 통과: `node --check`.
- `css/base_4.502.css` 중괄호 균형 검사 통과.
- 4.502 HTML/CSS/JS에서 4.501 및 4501 잔여 참조 없음 확인.
- Downloads 폴더 복사 및 4.502 파일 참조 확인 완료.

## 2026-07-09 23:44 KST / Admin Boundary GeoJSON Further Simplification

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/scripts/simplify_admin_boundaries_geojson.js
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_lio.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_lio.geojson

### 수정 내용
- 행정구역 표시용 GeoJSON 단순화 허용값을 한 단계 더 올렸다.
- `jeju_emd.geojson`은 505,372 bytes에서 419,341 bytes로 감소했다.
- `jeju_lio.geojson`은 529,609 bytes에서 428,182 bytes로 감소했다.
- gzip 예상 용량은 `sig` 169,903 bytes, `emd` 119,316 bytes, `lio` 112,711 bytes로 확인했다.

### 트래픽 계산
- 시/읍면동/리 3개 파일을 모두 한 번씩 받는 경우 1명당 raw 약 1.427MB, gzip 약 0.402MB.
- gzip 기준 예상 트래픽: 1만 명 약 4.02GB, 5만 명 약 20.10GB, 10만 명 약 40.19GB, 30만 명 약 120.58GB.

### 검증
- `scripts/simplify_admin_boundaries_geojson.js` 문법 검사 통과: `node --check`.
- `jeju_emd.geojson`, `jeju_lio.geojson` JSON parse 통과.
- feature 수 유지 확인: 읍면동 74개, 리 122개.
- bbox 유지 확인: 제주 경도/위도 범위 정상.

## 2026-07-09 23:35 KST / Admin Boundary GeoJSON Simplification

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/scripts/simplify_admin_boundaries_geojson.js
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_lio.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_lio.geojson

### 수정 내용
- 행정구역 표시용 GeoJSON 용량을 줄이기 위해 Douglas-Peucker 기반 경계 단순화를 적용했다.
- `jeju_emd.geojson`은 2,091,521 bytes에서 505,372 bytes로 감소했다.
- `jeju_lio.geojson`은 2,568,391 bytes에서 529,609 bytes로 감소했다.
- `jeju_sig.geojson`은 용량이 작아 원본 유지했다.

### 검증
- `scripts/simplify_admin_boundaries_geojson.js` 문법 검사 통과: `node --check`.
- `jeju_emd.geojson`, `jeju_lio.geojson` JSON parse 통과.
- feature 수 유지 확인: 읍면동 74개, 리 122개.
- bbox 유지 확인: 제주 경도/위도 범위 정상.
- `localhost:5501/map_admin_boundaries/jeju_emd.geojson`, `localhost:5501/map_admin_boundaries/jeju_lio.geojson` HTTP 200 확인.

## 2026-07-09 23:15 KST / Version 4.501

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.501.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.501.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.501.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.501.svg

### 수정 내용
- 4.500 기준으로 새 배포 버전 4.501 생성.
- 행정구역 6레벨 이하에서 리를 우선 표시하되, 동 지역처럼 리 데이터가 없는 경우 읍면동 경계를 표시하도록 조정했다.
- 하단 중앙 행정구역 pill 버튼 외곽선을 1px 파란선으로 얇게 조정했다.
- 하단 pill 높이를 54px에서 48px로 줄이고, font-size를 18px에서 16px로 줄였다.
- 하단 pill 위치를 기존보다 5px 위로 올렸다.
- 하단 pill의 `매물` 글자는 검정색, 숫자만 파란색으로 분리했다.
- 4.501 파일을 다운로드 폴더에도 복사했다.

### 검증
- `js/app_4.501.js` 문법 검사 통과: `node --check`.
- `css/base_4.501.css` 중괄호 균형 확인 통과.
- `jeju_sig.geojson`, `jeju_emd.geojson`, `jeju_lio.geojson` JSON parse 통과.
- 다운로드 폴더의 `realjeju_4.501.html`이 4.501 CSS/JS를 참조하는 것 확인.
- 4.501 HTML/CSS/JS 안에 4.500 참조 없음.

## 2026-07-09 23:04 KST / Version 4.497

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.497.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.497.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.497.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.497.svg

### 수정 내용
- 4.496 기준으로 새 배포 버전 4.497 생성.
- 행정구역 외곽선을 파란색으로 변경하고, 채움은 파란색 반투명으로 조정했다.
- 지도 레벨 9단계까지 행정구역 표시를 유지하고, 4단계 이하 확대 시 리 경계(`jeju_lio.geojson`)로 전환되도록 복원했다.
- 지도 중앙점 기준으로 읍면동 또는 리 1개만 표시하는 구조를 유지했다.
- 선택된 행정구역 하단에 `지역명`과 `매물 n`을 표시하는 둥근 pill UI를 추가했다.
- 매물 수는 현재 필터 결과(`state.filtered`) 기준으로 선택 경계 안의 좌표를 계산한다.
- 4.497 파일을 다운로드 폴더에도 복사했다.

### 검증
- `js/app_4.497.js` 문법 검사 통과: `node --check`.
- `css/base_4.497.css` 중괄호 균형 확인 통과.
- `jeju_emd.geojson`, `jeju_lio.geojson` JSON parse 통과.
- `localhost:5501/realjeju_4.497.html`, `localhost:5501/map_admin_boundaries/jeju_lio.geojson` HTTP 200 확인.
- 4.497 HTML/CSS/JS 안에 4.496 참조 없음.

## 2026-07-09 23:50 KST / Version 4.496

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.496.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.496.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.496.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.496.svg

### 수정 내용
- 4.495 기준으로 새 배포 버전 4.496 생성.
- 행정구역 레이어를 bounds 내 전체 경계 표시 방식에서 지도 중앙점이 포함된 읍면동 1개만 표시하는 방식으로 변경했다.
- 행정구역 표시 레벨을 6단계에서 9단계까지로 확장했다.
- 리 경계 전환을 제거하고 읍면동 GeoJSON만 사용하도록 정리했다.
- 선택된 읍면동은 빨간 외곽선과 반투명 분홍 채움으로 표시되도록 조정했다.
- 개발 패널 안내 문구를 `지도 레벨 9단계까지 표시 / 지도 중앙 기준 읍면동만 표시`로 변경했다.
- 4.496 파일을 다운로드 폴더에도 복사했다.

### 검증
- `js/app_4.496.js` 문법 검사 통과: `node --check`.
- `css/base_4.496.css` 중괄호 균형 확인 통과.
- `map_admin_boundaries/jeju_emd.geojson` JSON parse 통과.
- 다운로드 폴더의 `realjeju_4.496.html`이 4.496 CSS/JS를 참조하는 것 확인.
- 4.496 HTML/CSS/JS 안에 4.495, 리 경계, 6단계 행정구역 표시 참조 없음.

## 2026-07-09 23:42 KST / Version 4.495

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.495.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.495.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.495.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.495.svg
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_sig.geojson
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Documents/REALJEJU/map_admin_boundaries/jeju_lio.geojson

### 수정 내용
- 4.494 기준으로 새 배포 버전 4.495 생성.
- 개발 패널의 `읍면동` 버튼명을 `행정구역`으로 변경했다.
- `행정구역` 클릭 시 `map_admin_boundaries/jeju_emd.geojson`을 불러와 현재 지도 bounds에 걸리는 행정구역 외곽선을 Kakao Polygon으로 표시하도록 연결했다.
- 지도 레벨 6단계까지 표시하고, 3단계 이하 확대 시 `jeju_lio.geojson` 리 경계로 전환되도록 했다.
- 전체 선택해제 시 행정구역 경계 폴리곤이 지도에서 제거되도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.495로 변경.
- 4.495 파일과 행정구역 GeoJSON을 다운로드 폴더에도 복사했다.

### 검증
- `js/app_4.495.js` 문법 검사 통과: `node --check`.
- `css/base_4.495.css` 중괄호 균형 확인 통과.
- `map_admin_boundaries` GeoJSON 3개 JSON parse 통과.
- `localhost:5501/realjeju_4.495.html`, `localhost:5501/map_admin_boundaries/jeju_emd.geojson` HTTP 200 확인.
- 4.495 HTML/CSS/JS 안에 4.494 참조 없음.

## 2026-07-09 23:36 KST / Admin Boundary GeoJSON

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/scripts/convert_admin_boundaries_geojson.js
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_sig.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_emd.geojson
- /Users/GHOST/Downloads/map_admin_boundaries/jeju_lio.geojson

### 수정 내용
- 다운로드 폴더의 행정구역 SHP 원본에서 제주 시군구, 읍면동, 리 경계를 GeoJSON으로 변환했다.
- KGD2002 Central Belt 2010 좌표를 WGS84 경위도 좌표로 변환했다.
- 시군구 2개, 읍면동 74개, 리 122개 feature를 생성했다.

### 검증
- `scripts/convert_admin_boundaries_geojson.js` 문법 검사 통과: `node --check`.
- 생성된 GeoJSON 3개 JSON parse 통과.
- bbox 확인: 경도 126.14~126.97, 위도 33.11~34.01 범위.

## 2026-07-09 23:06 KST / Version 4.494

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.494.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.494.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.494.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.494.svg

### 수정 내용
- 4.493 기준으로 새 배포 버전 4.494 생성.
- 부동산 홈 오른쪽 메뉴의 `개발` 버튼 패널에 `읍면동` 옵션을 추가했다.
- `읍면동` 옵션은 `fa-draw-polygon` 아이콘과 함께 표시되며, 클릭 시 선택 상태가 토글되도록 했다.
- 개발 패널의 `전체 선택해제` 버튼은 읍면동 선택 상태에 맞춰 활성/비활성 처리되도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.494로 변경.

### 검증
- `js/app_4.494.js` 문법 검사 통과: `node --check`.
- `css/base_4.494.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.494.svg` XML 검사 통과.
- 4.494 HTML/CSS/JS/SVG 안에 4.493 참조 없음.

## 2026-07-09 22:56 KST / Version 4.493

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.493.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.493.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.493.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.493.svg

### 수정 내용
- 4.492 기준으로 새 배포 버전 4.493 생성.
- 회사소개 상단 SVG의 제주도 외곽선을 단순 타원형에서 제주도에 더 가까운 불규칙한 동서 장축 실루엣으로 다시 조정했다.
- 서쪽 둥근 형태, 동쪽으로 좁아지는 끝, 남쪽 해안의 완만한 처짐이 보이도록 섬 path를 재작성했다.
- 새 섬 외곽에 맞춰 내부 도로, 건물 요소, 마커 위치를 다시 조정했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.493으로 변경.

### 검증
- `js/app_4.493.js` 문법 검사 통과: `node --check`.
- `css/base_4.493.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.493.svg` XML 검사 통과.
- 4.493 HTML/CSS/JS/SVG 안에 4.492 참조 없음.

## 2026-07-09 22:47 KST / Version 4.492

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.492.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.492.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.492.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.492.svg

### 수정 내용
- 4.491 기준으로 새 배포 버전 4.492 생성.
- 회사소개 본문 폭 계산을 내부 스크롤 영역 기준 `min(1120px, calc(100% - 64px))`로 변경했다.
- 회사소개 `.company-full-hero`, `.company-full-section`은 새 `--company-full-content-width` 변수를 사용하도록 정리했다.
- 메인 랜딩의 1120px 상한은 맞추되, 회사소개 내부 스크롤바 때문에 `100vw` 기준으로 더 넓어지는 문제를 막았다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.492로 변경.

### 검증
- `js/app_4.492.js` 문법 검사 통과: `node --check`.
- `css/base_4.492.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.492.svg` XML 검사 통과.
- 4.492 HTML/CSS/JS/SVG 안에 4.491 참조 없음.

## 2026-07-09 22:39 KST / Version 4.491

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.491.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.491.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.491.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.491.svg

### 수정 내용
- 4.490 기준으로 새 배포 버전 4.491 생성.
- 회사소개 상단 이미지의 제주도 실루엣을 기존 뭉툭한 형태에서 길게 누운 타원형 제주 형태에 가깝게 다시 제작했다.
- 섬 외곽, 내부 도로, 건물 요소, 마커 위치를 새 실루엣에 맞게 재배치했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.491로 변경.

### 검증
- `js/app_4.491.js` 문법 검사 통과: `node --check`.
- `css/base_4.491.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.491.svg` XML 검사 통과.
- 4.491 HTML/CSS/JS/SVG 안에 4.490 참조 없음.

## 2026-07-09 22:29 KST / Version 4.490

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.490.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.490.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.490.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.490.svg

### 수정 내용
- 4.489 기준으로 새 배포 버전 4.490 생성.
- 회사소개 본문 폭(`.company-full-hero`, `.company-full-section`)을 메인 랜딩 본문과 같은 `--realjeju-main-page-width` 기준으로 변경했다.
- 회사소개 본문 좌우 정렬을 메인 랜딩처럼 `margin-left/right: auto`로 중앙 정렬했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.490으로 변경.

### 검증
- `js/app_4.490.js` 문법 검사 통과: `node --check`.
- `css/base_4.490.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.490.svg` XML 검사 통과.
- 4.490 HTML/CSS/JS/SVG 안에 4.489 참조 없음.

## 2026-07-09 22:21 KST / Version 4.489

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.489.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.489.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.489.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.489.svg

### 수정 내용
- 4.488 기준으로 새 배포 버전 4.489 생성.
- 회사소개 운영 정보 섹션 제목을 `운영사`에서 `운영사 정보`로 변경했다.
- 운영사 설명 문구와 우측 기본 정보 목록은 그대로 유지했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.489로 변경.

### 검증
- `js/app_4.489.js` 문법 검사 통과: `node --check`.
- `css/base_4.489.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.489.svg` XML 검사 통과.
- 4.489 HTML/CSS/JS/SVG 안에 4.488 참조 없음.

## 2026-07-09 22:14 KST / Version 4.488

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.488.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.488.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.488.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.488.svg

### 수정 내용
- 4.487 기준으로 새 배포 버전 4.488 생성.
- 회사소개 Service/Local/Trust 라벨을 작은 파란 알약 스타일에서 검정색 큰 볼드 라벨로 변경했다.
- 라벨은 `22px`, `font-weight: 800`, `#111827`로 조정하고 기존 카드 본문/제목 구조는 유지했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`, 회사소개 이미지 참조를 4.488로 변경.

### 검증
- `js/app_4.488.js` 문법 검사 통과: `node --check`.
- `css/base_4.488.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.488.svg` XML 검사 통과.
- 4.488 HTML/CSS/JS/SVG 안에 4.487 참조 없음.

## 2026-07-09 22:05 KST / Version 4.487

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.487.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.487.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.487.js
- /Users/GHOST/Documents/REALJEJU/company_intro_map_4.487.svg

### 수정 내용
- 4.486 기준으로 새 배포 버전 4.487 생성.
- 회사소개 상단에 제주/지도 기반 서비스 이미지를 추가했다.
- 회사소개 Hero를 텍스트+이미지 레이아웃으로 바꾸고 모바일에서는 1열로 정리했다.
- Service/Local/Trust 카드에 Font Awesome 아이콘을 추가해 텍스트만 있는 느낌을 줄였다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.487로 변경.

### 검증
- `js/app_4.487.js` 문법 검사 통과: `node --check`.
- `css/base_4.487.css` 중괄호 균형 확인 통과.
- `company_intro_map_4.487.svg` XML 검사 통과.
- 4.487 HTML/CSS/JS/SVG 안에 4.486 참조 없음.

## 2026-07-09 21:55 KST / Version 4.486

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.486.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.486.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.486.js

### 수정 내용
- 4.485 기준으로 새 배포 버전 4.486 생성.
- 부동산 홈 중개 표시 패널에서 전체/전문 중개사를 누를 때마다 `renderBrokerOfficeOverlays({ force: true })`로 캐시를 무시하고 다시 조회하던 코드를 제거했다.
- 중개사 전체 목록은 최초 1회 받은 `state.brokerOfficeRows`를 F5 리프레시 전까지 재사용하도록 유지했다.
- 전문 중개사 통계와 전문중개사 선정 횟수 캐시는 5분 TTL 대신, 한 번 로드되면 F5 전까지 재사용하도록 변경했다.
- 전문중개사 선정 횟수 결과가 0건이어도 로드 완료로 보고 반복 재조회하지 않도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.486으로 변경.

### 검증
- `js/app_4.486.js` 문법 검사 통과: `node --check`.
- `css/base_4.486.css` 중괄호 균형 확인 통과.
- 4.486 HTML/CSS/JS 안에 4.485 참조 없음.
- 중개 표시 패널의 `renderBrokerOfficeOverlays({ force: true })` 잔여 호출 없음.

## 2026-07-09 21:45 KST / Version 4.485

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.485.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.485.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.485.js

### 수정 내용
- 4.484 기준으로 새 배포 버전 4.485 생성.
- 회사소개 페이지의 큰 제목, 리드문, 카드 제목, 카드 본문, 운영사 정보 라벨/값의 글자 크기와 굵기를 낮췄다.
- 회사소개 헤더 제목과 닫기 버튼 크기도 한 단계 낮춰 전체 톤이 과하게 두껍고 커 보이지 않도록 정리했다.
- 기존 동네업체 복원 로직과 공통 푸터 규격은 그대로 유지했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.485로 변경.

### 검증
- `js/app_4.485.js` 문법 검사 통과: `node --check`.
- `css/base_4.485.css` 중괄호 균형 확인 통과.
- 4.485 HTML/CSS/JS 안에 4.484 참조 없음.

## 2026-07-09 21:35 KST / Version 4.484

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.484.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.484.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.484.js

### 수정 내용
- 4.483 기준으로 새 배포 버전 4.484 생성.
- 동네업체를 다시 눌렀을 때 편의점/대형마트/중개업소 중 일부 오버레이만 살아 있으면 복원 완료처럼 처리되던 분기를 정리했다.
- 로드 완료 상태에서는 기존 오버레이 재부착 후, 저장해 둔 편의점/대형마트/중개업소 rows로 항상 누락 레이어를 보강 복원하도록 공통화했다.
- 중개업소 복귀 복원은 `renderBrokerOfficeOverlays()`를 거치지 않고 저장 rows에서 오버레이만 직접 재생성하도록 해서 불필요한 재조회 경로를 막았다.
- 동네업체 기본 표시 대상은 편의점, 대형마트, 중개업소로 유지하고 은행은 계속 제외한다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.484로 변경.

### 검증
- `js/app_4.484.js` 문법 검사 통과: `node --check`.
- `css/base_4.484.css` 중괄호 균형 확인 통과.
- 4.484 HTML/CSS/JS 안에 4.483 참조 없음.

## 2026-07-09 21:18 KST / Version 4.483

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.483.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.483.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.483.js

### 수정 내용
- 4.482 기준으로 새 배포 버전 4.483 생성.
- 동네업체 기본 자동 표시 대상에 중개업소를 다시 포함했다.
- 동네업체 진입 시 편의점, 대형마트, 중개업소를 표시하고 은행은 계속 제외하도록 조정했다.
- 다른 메뉴를 갔다가 동네업체로 돌아올 때 중개업소 오버레이도 기존 오버레이 또는 저장된 중개업소 rows로 복원하도록 했다.
- 중개업소만 오버레이가 비어 있는 경우에도 편의점/대형마트 복원 성공에 묻히지 않고 중개업소 복원을 다시 시도하도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.483으로 변경.

### 검증
- `js/app_4.483.js` 문법 검사 통과: `node --check`.
- `css/base_4.483.css` 중괄호 균형 확인 통과.
- 4.483 HTML/CSS/JS 안에 4.482 참조 없음.

## 2026-07-09 20:35 KST / Version 4.482

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.482.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.482.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.482.js

### 수정 내용
- 4.481 기준으로 새 배포 버전 4.482 생성.
- `회사소개` 전체 페이지를 추가했다.
- 상단 더보기 메뉴와 메인/알바/약관 푸터의 `회사소개` 링크가 준비중 모달 대신 회사소개 페이지를 열도록 연결했다.
- 회사소개 페이지에 서비스 소개, 제주 지역 중심 설명, 운영사 정보, 공통 하단 푸터를 배치했다.
- 회사소개 페이지에서 약관 링크를 누르면 회사소개를 닫고 약관 페이지가 열리도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.482로 변경.

### 검증
- `js/app_4.482.js` 문법 검사 통과: `node --check`.
- `css/base_4.482.css` 중괄호 균형 확인 통과.
- 4.482 HTML/CSS/JS 안에 4.481 참조 없음.
- 4.482 HTML/CSS/JS 안에 `회사소개 페이지는 준비중입니다.` 문구 없음.

## 2026-07-09 20:25 KST / Version 4.481

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.481.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.481.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.481.js

### 수정 내용
- 4.480 기준으로 새 배포 버전 4.481 생성.
- 동네업체에서 처음 받아온 편의점/대형마트 row 목록을 `localBusinessAutoRows`에 별도로 보관하도록 했다.
- 다른 네비를 갔다가 동네업체로 돌아왔을 때 오버레이가 사라진 경우, API 검색을 다시 호출하지 않고 저장된 row 목록으로 마커만 재생성하도록 했다.
- 최초 결과가 0개였던 경우도 `localBusinessAutoRowsReady`로 이미 받은 결과로 판단해 반복 호출하지 않도록 했다.
- 은행/중개사사무소는 동네업체 기본 자동 표시에서 계속 제외한다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.481로 변경.

### 검증
- `js/app_4.481.js` 문법 검사 통과: `node --check`.
- `css/base_4.481.css` 중괄호 균형 확인 통과.
- 4.481 HTML/CSS/JS 안에 4.480 참조 없음.

## 2026-07-09 20:24 KST / Version 4.480

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.480.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.480.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.480.js

### 수정 내용
- 4.479 기준으로 새 배포 버전 4.480 생성.
- 다른 네비 메뉴를 갔다가 동네업체로 돌아왔을 때, 기존에 받아둔 편의점/대형마트 오버레이가 화면에 다시 붙지 않는 문제를 보정했다.
- 동네업체 자동 레이어가 이미 로드된 상태에서도 오버레이 복원 실패 시 편의점/대형마트만 다시 렌더하도록 했다.
- 동시 로딩 중 복귀, 지도 `idle` 재렌더에서도 같은 복원 실패 보정이 적용되도록 했다.
- 은행/중개사사무소는 동네업체 기본 자동 표시에서 계속 제외한다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.480으로 변경.

### 검증
- `js/app_4.480.js` 문법 검사 통과: `node --check`.
- `css/base_4.480.css` 중괄호 균형 확인 통과.
- 4.480 HTML/CSS/JS 안에 4.479 참조 없음.

## 2026-07-09 20:12 KST / Version 4.479

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.479.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.479.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.479.js

### 수정 내용
- 4.478 기준으로 새 배포 버전 4.479 생성.
- 동네업체를 누르면 자동 지도 레이어가 편의점과 대형마트만 표시되도록 조정했다.
- 은행 자동 표시는 끄고, 동네업체 복귀 시에도 은행 오버레이가 다시 붙지 않도록 했다.
- `편의점/대형마트만` 조건에 맞춰 중개사사무소 자동 오버레이도 동네업체 기본 표시에서 제외했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.479로 변경.

### 검증
- `js/app_4.479.js` 문법 검사 통과: `node --check`.
- `css/base_4.479.css` 중괄호 균형 확인 통과.
- 4.479 HTML/CSS/JS 안에 4.478 참조 없음.

## 2026-07-09 19:51 KST / Version 4.478

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.478.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.478.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.478.js

### 수정 내용
- 4.477 기준으로 새 배포 버전 4.478 생성.
- 알바와 동네업체를 반복 이동할 때 동네업체 자동 레이어가 편의점/은행/대형마트/중개사무소 요청을 다시 대량 호출하던 흐름을 막았다.
- 동네업체 자동 레이어를 한 번 로드한 뒤에는 카테고리를 떠날 때 오버레이/캐시를 지우지 않고 지도에서만 숨기도록 했다.
- 동네업체로 다시 돌아오면 기존 오버레이를 재부착하고, 검색/DB 조회를 다시 호출하지 않도록 했다.
- 지도 `idle` 재렌더에서도 동네업체 자동 레이어가 이미 로드된 경우 기존 오버레이 복원만 하고 시설 검색 렌더를 건너뛰도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.478로 변경.

### 검증
- `js/app_4.478.js` 문법 검사 통과: `node --check`.
- `css/base_4.478.css` 중괄호 균형 확인 통과.
- 4.478 HTML/CSS/JS 안에 4.477 참조 없음.

## 2026-07-09 19:24 KST / Version 4.477

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.477.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.477.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.477.js

### 수정 내용
- 4.476 기준으로 새 배포 버전 4.477 생성.
- 최근 조회 매물 목록의 제목이 너무 길게 보이지 않도록 `getRecentListCompactTitle()`을 추가했다.
- 최근 조회 제목에서 괄호 설명, `매매`, `임대`, `추천`, `투자`, `전원주택`, `상가혹은`, `단독주택`, `부지` 등 보조 문구 앞에서 끊도록 했다.
- 쉼표가 있는 제목은 핵심 앞부분 1~2개 구간만 표시해 `올레길 10코스 인근`, `서광리,왕복2차선접`처럼 짧게 보이도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.477로 변경.

### 검증
- `js/app_4.477.js` 문법 검사 통과: `node --check`.
- `css/base_4.477.css` 중괄호 균형 확인 통과.
- 요청 예시 4개 제목 축약 결과 확인.
- 4.477 HTML/CSS/JS 안에 4.476 참조 없음.

## 2026-07-09 19:18 KST / Version 4.476

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.476.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.476.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.476.js

### 수정 내용
- 4.475 기준으로 새 배포 버전 4.476 생성.
- 동네업체와 자동차도 중고거래/모임처럼 상단 필터 버튼이 보이지 않도록 했다.
- `REALJEJU_HIDE_FILTER_MENU_GLOBAL_CATEGORIES`에 `local-business`, `car`를 포함해 필터바 숨김 대상을 명시했다.
- 빈 지도 여부와 별개로 필터 메뉴 숨김 여부를 `shouldHideGlobalCategoryFilterMenu()`에서 판단하도록 정리했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.476으로 변경.

### 검증
- `js/app_4.476.js` 문법 검사 통과: `node --check`.
- `css/base_4.476.css` 중괄호 균형 확인 통과.
- 4.476 HTML/CSS/JS 안에 4.475 참조 없음.

## 2026-07-09 19:12 KST / Version 4.475

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.475.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.475.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.475.js

### 수정 내용
- 4.474 기준으로 새 배포 버전 4.475 생성.
- 회원관리의 `최근 로그인` 표시가 로그인 필드만 보던 문제를 보정했다.
- 회원별 `property_listings` 최신 `updated_at/created_at`을 함께 조회해 로그인 날짜와 매물 활동일 중 최신 날짜를 표시하도록 했다.
- 매물이 `agency_id`만 가진 경우에도 `agencies.id -> user_id/email`을 따라가 회원 행에 최신 매물 활동일을 반영하도록 했다.
- 회원관리 캐시가 남아 있어도 목록 로드 시 매물 활동일은 다시 조회해 오늘 업로드가 바로 반영되도록 했다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.475로 변경.

### 검증
- `js/app_4.475.js` 문법 검사 통과: `node --check`.
- `css/base_4.475.css` 중괄호 균형 확인 통과.
- 4.475 HTML/CSS/JS 안에 4.474 참조 없음.

## 2026-07-09 19:06 KST / Version 4.474

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.474.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.474.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.474.js

### 수정 내용
- 4.473 기준으로 새 배포 버전 4.474 생성.
- 중고거래, 모임처럼 아직 기능 필터가 정해지지 않은 빈 지도 카테고리에서는 상단 필터 메뉴가 보이지 않도록 했다.
- 빈 지도 카테고리 진입 시 `global-category-hide-filter-menu` 클래스를 적용하고, 필터 바와 필터 스크롤 영역을 CSS/JS 양쪽에서 숨기도록 정리했다.
- 빈 지도 카테고리에서도 실제 카테고리값으로 필터 렌더 흐름을 타게 해 부동산 필터가 다시 살아나는 경우를 막았다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.474로 변경.

### 검증
- `js/app_4.474.js` 문법 검사 통과: `node --check`.
- `css/base_4.474.css` 중괄호 균형 확인 통과.
- 4.474 HTML/CSS/JS 안에 4.473 참조 없음.

## 2026-07-09 19:03 KST / Version 4.473

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.473.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.473.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.473.js

### 수정 내용
- 4.472 기준으로 새 배포 버전 4.473 생성.
- 동네업체 진입 후 알바 페이지를 갔다가 다시 동네업체를 눌렀을 때 카카오 장소검색/서버 조회가 반복 폭증하지 않도록 캐시를 추가했다.
- 대형마트, 편의점, 은행, 공공기관 장소검색 결과를 지도 범위/줌 기준으로 5분간 재사용하도록 했다.
- 같은 범위에서 검색이 진행 중이면 새 요청을 추가로 만들지 않고 기존 진행 요청을 공유하도록 했다.
- 중개사무소 지도 데이터 조회도 진행 중 요청을 공유해 중복 DB 조회를 막았다.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.473으로 변경.

### 검증
- `js/app_4.473.js` 문법 검사 통과: `node --check`.
- `css/base_4.473.css` 중괄호 균형 확인 통과.
- 4.473 HTML/CSS/JS 안에 4.472 참조 없음.

## 2026-07-09 09:43 KST / Version 4.472

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.472.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.472.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.472.js

### 수정 내용
- 4.471 기준으로 새 배포 버전 4.472 생성.
- 거리뷰 선택 중 지도에 뜨는 일반 선택 마커의 `yAnchor`를 `1.32`로 조정해 손가락/커서에 너무 붙어 보이지 않도록 변경.
- 거리뷰 상세뷰 오른쪽 방향 마커에서 3D처럼 보이게 넣었던 파란/보라 선 계열(`roadview-direction-road-*`)을 전부 제거.
- 상세 방향 마커는 파란 원, 초록 방향 영역, 흰 마커만 남도록 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.472로 변경.

### 검증
- `js/app_4.472.js` 문법 검사 통과: `node --check`.
- `css/base_4.472.css` 중괄호 균형 확인: `5290/5290 OK`.
- 4.472 HTML/CSS/JS 안에 4.471 참조와 `roadview-direction-road-*` 참조 없음.

## 2026-07-09 09:35 KST / Version 4.471

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.471.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.471.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.471.js

### 수정 내용
- 4.470 기준으로 새 배포 버전 4.471 생성.
- 로드뷰 방향 표시를 단일 SVG 좌표계 기준으로 정리.
- 초록 방향 도형과 앞쪽 파란선 계열을 같은 `.roadview-direction-rotor` 그룹에 넣어 같은 기준점 `61,66.1`으로 회전하도록 수정.
- 앞쪽 파란선은 shadow/outer/inner/center 4개 stroke로 구성해 입체감이 나도록 추가.
- 흰 마커는 같은 SVG 안에서 마지막에 그려 항상 위에 보이도록 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.471로 변경.

### 검증
- `js/app_4.471.js` 문법 검사 통과: `node --check`.
- `css/base_4.471.css` 중괄호 균형 확인: `5294/5294 OK`.
- 4.471 HTML/CSS/JS 안에 4.470 참조 없음.

## 2026-07-09 09:27 KST / Version 4.470

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.470.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.470.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.470.js

### 수정 내용
- 4.469 기준으로 새 배포 버전 4.470 생성.
- 초록 방향 도형 path를 파란 원 바깥까지 크게 확장해 회전 각도와 관계없이 원 경계까지 도달하도록 수정.
- 초록 도형은 기존 파란 원 `clipPath` 안에서 잘리므로 원 경계와 틈이 생기지 않도록 정리.
- 마커 꼭지점과 초록 도형 시작점 `61,66.1` 좌표는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.470으로 변경.

### 검증
- `js/app_4.470.js` 문법 검사 통과: `node --check`.
- `css/base_4.470.css` 중괄호 균형 확인: `5292/5292 OK`.
- 4.470 HTML/CSS/JS 안에 4.469 참조 없음.

## 2026-07-09 09:20 KST / Version 4.469

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.469.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.469.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.469.js

### 수정 내용
- 4.468 기준으로 새 배포 버전 4.469 생성.
- 로드뷰 방향 표시의 흰 마커와 초록 방향 도형을 하나의 `122x122` SVG 좌표계 안에서 함께 렌더링하도록 변경.
- 마커 path의 실제 뾰족점과 초록 도형 path 시작점을 둘 다 `61,66.1` 좌표로 맞춰 서로 떨어질 수 없게 수정.
- 초록 도형은 파란 원 clipPath 안에서 잘리도록 유지.
- CustomOverlay `yAnchor`도 같은 마커 꼭지점 좌표 기준 `0.5418`로 조정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.469로 변경.

### 검증
- `js/app_4.469.js` 문법 검사 통과: `node --check`.
- `css/base_4.469.css` 중괄호 균형 확인: `5292/5292 OK`.
- 4.469 HTML/CSS/JS 안에 4.468 참조 없음.

## 2026-07-09 09:12 KST / Version 4.468

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.468.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.468.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.468.js

### 수정 내용
- 4.467 기준으로 새 배포 버전 4.468 생성.
- 초록 방향 표시를 참고 이미지처럼 마커 꼭지점에서 시작하는 둥근 물방울형 부채꼴 SVG path로 변경.
- path 시작점을 `M41 45`로 유지해 마커의 실제 뾰족한 끝 기준과 맞춤.
- 초록 도형에 동일 색상 stroke를 추가해 꼭지점과 곡선 가장자리가 끊겨 보이지 않도록 보강.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.468로 변경.

### 검증
- `js/app_4.468.js` 문법 검사 통과: `node --check`.
- `css/base_4.468.css` 중괄호 균형 확인: `5289/5289 OK`.
- 4.468 HTML/CSS/JS 안에 4.467 참조 없음.

## 2026-07-09 09:05 KST / Version 4.467

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.467.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.467.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.467.js

### 수정 내용
- 4.466 기준으로 새 배포 버전 4.467 생성.
- 마커 박스 바닥이 아니라 SVG path의 실제 아래 꼭지점 기준으로 부채꼴 꼭지점을 재계산.
- 초록 부채꼴 꼭지점과 회전 기준을 원 내부 `41px 45px`로 조정.
- 부채꼴은 파란 원 내부에서 클리핑되는 구조를 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.467로 변경.

### 검증
- `js/app_4.467.js` 문법 검사 통과: `node --check`.
- `css/base_4.467.css` 중괄호 균형 확인: `5289/5289 OK`.
- 4.467 HTML/CSS/JS 안에 4.466 참조 없음.

## 2026-07-09 08:57 KST / Version 4.466

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.466.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.466.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.466.js

### 수정 내용
- 4.465 기준으로 새 배포 버전 4.466 생성.
- 초록 부채꼴 레이어를 파란 원 바깥에서 안쪽으로 이동해 `.roadview-direction-range`의 원형 `overflow:hidden`으로 잘리도록 수정.
- 부채꼴 path 꼭지점 `M41 48`과 회전 기준 `41px 48px`을 유지해 마커 아래 꼭지점과 같은 원 내부 좌표에 고정.
- 부채꼴이 파란 원 경계에 맞지 않던 문제를 원 내부 클리핑 구조로 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.466으로 변경.

### 검증
- `js/app_4.466.js` 문법 검사 통과: `node --check`.
- `css/base_4.466.css` 중괄호 균형 확인: `5289/5289 OK`.
- 4.466 HTML/CSS/JS 안에 4.465 참조 없음.

## 2026-07-09 08:50 KST / Version 4.465

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.465.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.465.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.465.js

### 수정 내용
- 4.464 기준으로 새 배포 버전 4.465 생성.
- 초록 부채꼴 레이어의 원점을 마커 아래 꼭지점 좌표인 `61px, 69px`에 직접 고정.
- SVG를 `left: -41px`, `top: -48px`로 배치해 SVG path 꼭지점 `M41 48`이 실제 레이어 원점 `0,0`과 일치하도록 수정.
- 부채꼴 회전 기준을 `transform-origin: 0 0`으로 변경해 회전 시에도 마커 꼭지점과 부채꼴 꼭지점이 같은 좌표를 유지하도록 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.465로 변경.

### 검증
- `js/app_4.465.js` 문법 검사 통과: `node --check`.
- `css/base_4.465.css` 중괄호 균형 확인: `5289/5289 OK`.
- 4.465 HTML/CSS/JS 안에 4.464 참조 없음.

## 2026-07-09 08:43 KST / Version 4.464

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.464.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.464.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.464.js

### 수정 내용
- 4.463 기준으로 새 배포 버전 4.464 생성.
- 초록 부채꼴을 별도 `.roadview-direction-cone-layer`로 분리해 레이어 자체의 회전 기준을 마커 꼭지점 좌표에 고정.
- 오버레이 기준 마커 끝점 `61px, 69px`에 맞춰 부채꼴 레이어 내부 꼭지점을 `41px, 48px`로 설정.
- SVG path 꼭지점도 `M41 48`로 맞춰 마커 아래 뾰족한 부분과 부채꼴 꼭지점이 같은 화면 좌표에 오도록 수정.
- 방향 마커 안쪽 선 제거 상태는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.464로 변경.

### 검증
- `js/app_4.464.js` 문법 검사 통과: `node --check`.
- `css/base_4.464.css` 중괄호 균형 확인: `5289/5289 OK`.
- 4.464 HTML/CSS/JS 안에 4.463 참조 없음.

## 2026-07-09 08:36 KST / Version 4.463

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.463.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.463.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.463.js

### 수정 내용
- 4.462 기준으로 새 배포 버전 4.463 생성.
- 로드뷰 상세 방향 마커 내부 선을 숨겨 흰색 마커만 보이도록 수정.
- 초록 SVG 부채꼴 꼭지점을 마커 아래 뾰족한 끝점에 닿게 보이도록 `41 47.5`로 조정.
- 부채꼴 회전 기준점도 `41px 47.5px`로 맞춰 회전 시 접점이 흔들리지 않도록 정리.
- 일반 거리뷰 선택 마커의 파란 선은 기존대로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.463으로 변경.

### 검증
- `js/app_4.463.js` 문법 검사 통과: `node --check`.
- `css/base_4.463.css` 중괄호 균형 확인: `5288/5288 OK`.
- 4.463 HTML/CSS/JS 안에 4.462 참조 없음.

## 2026-07-09 08:29 KST / Version 4.462

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.462.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.462.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.462.js

### 수정 내용
- 4.461 기준으로 새 배포 버전 4.462 생성.
- 로드뷰 상세 방향 마커의 과한 3D 눌림 효과를 제거해 핀 형태가 찌그러지지 않도록 복구.
- 방향 마커 내부의 파란 직선을 참고 이미지와 같은 초록 곡선 + 검은 보조 곡선 형태로 변경.
- 일반 거리뷰 선택 마커는 기존 파란 직선 형태를 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.462로 변경.

### 검증
- `js/app_4.462.js` 문법 검사 통과: `node --check`.
- `css/base_4.462.css` 중괄호 균형 확인: `5291/5291 OK`.
- 4.462 HTML/CSS/JS 안에 4.461 참조 없음.

## 2026-07-09 08:23 KST / Version 4.461

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.461.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.461.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.461.js

### 수정 내용
- 4.460 기준으로 새 배포 버전 4.461 생성.
- 로드뷰 상세 방향 마커만 `perspective(96px) rotateX(42deg) scaleY(0.86)`로 눌러 45도 위에서 내려다본 듯한 형태로 조정.
- 마커 끝점이 흔들리지 않도록 `transform-origin: 50% 100%`로 고정.
- 일반 거리뷰 선택 마커와 초록 SVG 부채꼴 구조는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.461로 변경.

### 검증
- `js/app_4.461.js` 문법 검사 통과: `node --check`.
- `css/base_4.461.css` 중괄호 균형 확인: `5287/5287 OK`.
- 4.461 HTML/CSS/JS 안에 4.460 참조 없음.

## 2026-07-09 08:16 KST / Version 4.460

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.460.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.460.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.460.js

### 수정 내용
- 4.459 기준으로 새 배포 버전 4.460 생성.
- 로드뷰 상세뷰 초록 방향 표시를 `conic-gradient`에서 SVG path로 변경해 회전 방향과 무관하게 항상 같은 부채꼴 모양이 유지되도록 수정.
- 초록 부채꼴 회전 기준점을 SVG 내부 마커 끝점 좌표인 `41px 48px`로 고정.
- 카카오 CustomOverlay `yAnchor`를 마커 끝점 기준 계산값인 `0.5656`으로 변경해 원 크기 조정 시 마커 끝점이 계속 어긋나던 문제를 보정.
- 파란 방향 원반 크기 `82px`는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.460으로 변경.

### 검증
- `js/app_4.460.js` 문법 검사 통과: `node --check`.
- `css/base_4.460.css` 중괄호 균형 확인: `5286/5286 OK`.
- 4.460 HTML/CSS/JS 안에 4.459 참조와 `conic-gradient` 없음.

## 2026-07-09 08:08 KST / Version 4.459

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.459.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.459.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.459.js

### 수정 내용
- 4.458 기준으로 새 배포 버전 4.459 생성.
- 로드뷰 상세뷰 파란 방향 원반 크기를 `96px`에서 `82px`로 더 축소.
- 마커 끝점 위치 계산을 반영해 초록 부채꼴 꼭지점을 원 중심 기준 `calc(50% + 7px)`로 고정.
- 초록 부채꼴 폭 `76deg`와 방향 회전 방식은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.459로 변경.

### 검증
- `js/app_4.459.js` 문법 검사 통과: `node --check`.
- `css/base_4.459.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.459 HTML/CSS/JS 안에 4.458 참조 없음.

## 2026-07-09 08:02 KST / Version 4.458

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.458.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.458.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.458.js

### 수정 내용
- 4.457 기준으로 새 배포 버전 4.458 생성.
- 로드뷰 방향 원반 전체 회전을 제거해 초록 부채꼴 꼭지점 좌표가 마커 끝점 기준에서 흔들리지 않도록 수정.
- 초록 부채꼴 방향은 `conic-gradient` 시작 각도에 `--roadview-pan + 307deg`를 적용해 방향만 회전하도록 변경.
- 방향 원반 크기 `96px`, 부채꼴 꼭지점 `50% 49%`, 폭 `76deg`는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.458로 변경.

### 검증
- `js/app_4.458.js` 문법 검사 통과: `node --check`.
- `css/base_4.458.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.458 HTML/CSS/JS 안에 4.457 참조 없음.

## 2026-07-09 07:55 KST / Version 4.457

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.457.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.457.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.457.js

### 수정 내용
- 4.456 기준으로 새 배포 버전 4.457 생성.
- 로드뷰 상세뷰 방향 원반 크기를 `112px`에서 `96px`로 줄여 마커 끝점과 초록 부채꼴이 더 맞아 보이도록 조정.
- 초록 부채꼴 꼭지점(`50% 49%`)과 폭(`76deg`)은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.457로 변경.

### 검증
- `js/app_4.457.js` 문법 검사 통과: `node --check`.
- `css/base_4.457.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.457 HTML/CSS/JS 안에 4.456 참조 없음.

## 2026-07-09 07:49 KST / Version 4.456

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.456.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.456.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.456.js

### 수정 내용
- 4.455 기준으로 새 배포 버전 4.456 생성.
- 로드뷰 상세뷰 초록 부채꼴 꼭지점을 마커 끝점에 더 가깝게 맞추기 위해 기준점을 `50% 49%`로 조정.
- 초록 부채꼴 폭을 `76deg`로 넓혀 너무 좁아 보이던 방향 표시를 보정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.456으로 변경.

### 검증
- `js/app_4.456.js` 문법 검사 통과: `node --check`.
- `css/base_4.456.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.456 HTML/CSS/JS 안에 4.455 참조 없음.

## 2026-07-09 07:42 KST / Version 4.455

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.455.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.455.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.455.js

### 수정 내용
- 4.454 기준으로 새 배포 버전 4.455 생성.
- 로드뷰 상세뷰 초록 부채꼴 꼭지점 기준을 실제 마커 끝점 위치인 `50% 56%`로 재조정.
- 초록 부채꼴 폭을 `58deg`로 줄여 과하게 퍼지는 모양을 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.455로 변경.

### 검증
- `js/app_4.455.js` 문법 검사 통과: `node --check`.
- `css/base_4.455.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.455 HTML/CSS/JS 안에 4.454 참조 없음.

## 2026-07-09 07:36 KST / Version 4.454

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.454.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.454.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.454.js

### 수정 내용
- 4.453 기준으로 새 배포 버전 4.454 생성.
- 로드뷰 상세뷰 초록 부채꼴의 꼭지점 기준을 마커 끝점 쪽으로 이동.
- 초록 부채꼴 중심을 `50% 12%`로 조정하고, 상세뷰 핀 위치를 소폭 위로 조정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.454로 변경.

### 검증
- `js/app_4.454.js` 문법 검사 통과: `node --check`.
- `css/base_4.454.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.454 HTML/CSS/JS 안에 4.453 참조 없음.

## 2026-07-09 07:31 KST / Version 4.453

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.453.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.453.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.453.js

### 수정 내용
- 4.452 기준으로 새 배포 버전 4.453 생성.
- 오른쪽 메뉴 거리뷰 버튼을 OFF 하면 왼쪽 로드뷰 상세 패널도 함께 닫히도록 수정.
- 거리뷰 OFF 시 지도 위 로드뷰 위치 마커와 방향 원반도 함께 사라지도록 수정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.453으로 변경.

### 검증
- `js/app_4.453.js` 문법 검사 통과: `node --check`.
- `css/base_4.453.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.453 HTML/CSS/JS 안에 4.452 참조 없음.

## 2026-07-09 07:25 KST / Version 4.452

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.452.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.452.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.452.js

### 수정 내용
- 4.451 기준으로 새 배포 버전 4.452 생성.
- 로드뷰 상세뷰 방향 원반이 왼쪽 로드뷰 시점과 반대로 보이는 문제를 보정.
- 방향 원반 회전에 `180deg` 보정을 추가해 초록 부채꼴 방향을 반대로 뒤집음.
- 흰색 삼각형 제거와 축소된 거리뷰 핀 마커는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.452로 변경.

### 검증
- `js/app_4.452.js` 문법 검사 통과: `node --check`.
- `css/base_4.452.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.452 HTML/CSS/JS 안에 4.451 참조 없음.

## 2026-07-09 07:20 KST / Version 4.451

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.451.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.451.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.451.js

### 수정 내용
- 4.450 기준으로 새 배포 버전 4.451 생성.
- 로드뷰 상세뷰 방향 원반 안의 흰색 삼각형 화살표 제거.
- 거리뷰 핀 마커를 `50x64`에서 `42x54`로 축소.
- 핀 안의 파란 막대도 축소된 마커에 맞춰 `21x4`로 조정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.451로 변경.

### 검증
- `js/app_4.451.js` 문법 검사 통과: `node --check`.
- `css/base_4.451.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.451 HTML/CSS/JS 안에 4.450 참조 없음.

## 2026-07-09 07:12 KST / Version 4.450

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.450.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.450.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.450.js

### 수정 내용
- 4.449 정상본 기준으로 새 배포 버전 4.450 생성.
- 로드뷰 상세뷰 방향 원반의 초록 부채꼴을 참고 이미지처럼 아래쪽 중심으로 재배치.
- 흰색 삼각형을 초록 부채꼴 가운데에 들어오도록 위치와 형태를 수정.
- 이전에 어긋나 보이던 진행 방향 화살표 배치를 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.450으로 변경.

### 검증
- `js/app_4.450.js` 문법 검사 통과: `node --check`.
- `css/base_4.450.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.450 HTML/CSS/JS 안에 4.449 참조 없음.

## 2026-07-09 07:06 KST / Version 4.449

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.449.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.449.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.449.js

### 수정 내용
- 4.448 기준으로 새 배포 버전 4.449 생성.
- 로드뷰 상세뷰 방향 원반 안의 흰색 삼각형을 초록 부채꼴 가운데 쪽으로 이동.
- 흰색 삼각형을 부채꼴 방향에 맞춰 살짝 회전.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.449로 변경.

### 검증
- `js/app_4.449.js` 문법 검사 통과: `node --check`.
- `css/base_4.449.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.449 HTML/CSS/JS 안에 4.448 참조 없음.

## 2026-07-09 07:01 KST / Version 4.448

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.448.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.448.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.448.js

### 수정 내용
- 4.447 기준으로 새 배포 버전 4.448 생성.
- 로드뷰 상세뷰 진행 방향 배경을 타원형에서 정원형으로 변경.
- 방향 원반 크기를 `112x112`로 통일하고 핀 위치와 오버레이 앵커를 재조정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.448로 변경.

### 검증
- `js/app_4.448.js` 문법 검사 통과: `node --check`.
- `css/base_4.448.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.448 HTML/CSS/JS 안에 4.447 참조 없음.

## 2026-07-09 06:55 KST / Version 4.447

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.447.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.447.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.447.js

### 수정 내용
- 4.446 기준으로 새 배포 버전 4.447 생성.
- 로드뷰 상세뷰 위치 마커에 진행 방향을 알 수 있는 파란 타원형 원반과 초록색 방향 부채꼴을 추가.
- 로드뷰 상세뷰 방향 오버레이에 흰색 방향 화살표를 추가.
- 일반 로드뷰 선택 핀은 유지하고, 로드뷰 상세뷰 위치 표시 오버레이에만 방향 그래픽 적용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.447로 변경.

### 검증
- `js/app_4.447.js` 문법 검사 통과: `node --check`.
- `css/base_4.447.css` 중괄호 균형 확인: `5285/5285 OK`.
- 4.447 HTML/CSS/JS 안에 4.446 참조 없음.

## 2026-07-09 06:47 KST / Version 4.446

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.446.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.446.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.446.js

### 수정 내용
- 4.445 기준으로 새 배포 버전 4.446 생성.
- 거리뷰 마커를 원형과 세모를 따로 붙이는 방식에서 하나의 SVG path 도형으로 변경.
- 흰색 단일 핀 도형, 회색 외곽선, 파란색 가운데 `-` 막대 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.446으로 변경.

### 검증
- `js/app_4.446.js` 문법 검사 통과: `node --check`.
- `css/base_4.446.css` 중괄호 균형 확인: `5280/5280 OK`.
- 4.446 HTML/CSS/JS 안에 4.445 참조 없음.

## 2026-07-09 06:40 KST / Version 4.445

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.445.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.445.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.445.js

### 수정 내용
- 4.444 기준으로 새 배포 버전 4.445 생성.
- 거리뷰 마커 하단 꼬리가 마름모처럼 보이던 부분을 제거.
- 회색 삼각 외곽선과 흰색 안쪽 삼각형으로 참고 이미지에 가까운 원형 핀 포인터 형태로 수정.
- 가운데 파란 `-` 막대는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.445로 변경.

### 검증
- `js/app_4.445.js` 문법 검사 통과: `node --check`.
- `css/base_4.445.css` 중괄호 균형 확인: `5282/5282 OK`.
- 4.445 HTML/CSS/JS 안에 4.444 참조 없음.

## 2026-07-09 06:34 KST / Version 4.444

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.444.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.444.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.444.js

### 수정 내용
- 4.443 기준으로 새 배포 버전 4.444 생성.
- 거리뷰 지도 마커를 흰 원형 핀 + 회색 외곽선 + 하단 포인터 형태로 정리.
- 거리뷰 마커 가운데 `-` 막대를 파란색 `#0067d9` 단색으로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.444로 변경.

### 검증
- `js/app_4.444.js` 문법 검사 통과: `node --check`.
- `css/base_4.444.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.444 HTML/CSS/JS 안에 4.443 참조 없음.

## 2026-07-09 06:26 KST / Version 4.443

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.443.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.443.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.443.js

### 수정 내용
- 4.442 기준으로 새 배포 버전 4.443 생성.
- `중고거래`, `모임` 카테고리는 빈 지도 모드로 고정.
- 빈 지도 진입 시 매물 마커, 편의시설, 대형마트, 은행, 공공기관, 중개사사무소, 교육, 생활안전 레이어 상태를 초기화하고 지도만 보이도록 정리.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.443으로 변경.

### 검증
- `js/app_4.443.js` 문법 검사 통과: `node --check`.
- `css/base_4.443.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.443 HTML/CSS/JS 안에 4.442 참조 없음.

## 2026-07-09 06:18 KST / Version 4.442

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.442.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.442.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.442.js

### 수정 내용
- 4.441 기준으로 새 배포 버전 4.442 생성.
- 동네업체 카테고리 선택 시 매물 마커를 끄고 편의점, 대형마트, 중개사사무소, 은행 레이어만 자동 표시하도록 추가.
- 부동산 카테고리로 돌아오면 동네업체에서 자동으로 켠 레이어를 끄고 매물 마커를 다시 표시하도록 추가.
- 동네업체 카테고리를 관리자 전용 빈 지도 처리 대상에서 제외.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.442로 변경.

### 검증
- `js/app_4.442.js` 문법 검사 통과: `node --check`.
- `css/base_4.442.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.442 HTML/CSS/JS 안에 4.441 참조 없음.

## 2026-07-09 06:08 KST / Version 4.441

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.441.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.441.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.441.js

### 수정 내용
- 4.440 기준으로 새 배포 버전 4.441 생성.
- 메인 랜딩 하단 광고문의 전화번호를 일반 하이픈 문자 `064-745-0531`로 복원.
- 하이픈 전용 `.main-landing-phone-dash` CSS 제거.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.441로 변경.

### 검증
- `js/app_4.441.js` 문법 검사 통과: `node --check`.
- `css/base_4.441.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.441 HTML/CSS/JS 안에 4.440 참조 및 `main-landing-phone-dash` 없음.

## 2026-07-09 06:03 KST / Version 4.440

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.440.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.440.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.440.js

### 수정 내용
- 4.439 기준으로 새 배포 버전 4.440 생성.
- 메인 랜딩 하단 광고문의 전화번호의 하이픈만 `.main-landing-phone-dash`로 감싸 별도 스타일 적용.
- 전화번호 하이픈 크기를 `0.8em`로 줄이고 세로 위치를 미세 조정.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.440으로 변경.

### 검증
- `js/app_4.440.js` 문법 검사 통과: `node --check`.
- `css/base_4.440.css` 중괄호 균형 확인: `5282/5282 OK`.
- 4.440 HTML/CSS/JS 안에 4.439 참조 없음.

## 2026-07-09 05:56 KST / Version 4.439

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.439.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.439.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.439.js

### 수정 내용
- 4.438 기준으로 새 배포 버전 4.439 생성.
- 메인 랜딩 하단 광고 영역의 문구+버튼 묶음을 가운데 정렬하도록 `justify-content: center`로 변경.
- 문구와 버튼 사이 간격을 기존 48px보다 넓은 `72px`로 변경.
- 배너/버튼 색상은 원래 색상 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.439로 변경.

### 검증
- `js/app_4.439.js` 문법 검사 통과: `node --check`.
- `css/base_4.439.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.439 HTML/CSS/JS 안에 4.438 참조 없음.

## 2026-07-09 05:49 KST / Version 4.438

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.438.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.438.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.438.js

### 수정 내용
- 4.437 기준으로 새 배포 버전 4.438 생성.
- 메인 랜딩 하단 광고 영역의 문구와 광고문의 버튼이 너무 멀리 떨어지지 않도록 `justify-content: flex-start`, `gap: 48px`로 변경.
- 배너/버튼 원래 색상은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.438로 변경.

### 검증
- `js/app_4.438.js` 문법 검사 통과: `node --check`.
- `css/base_4.438.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.438 HTML/CSS/JS 안에 4.437 참조 없음.

## 2026-07-09 05:41 KST / Version 4.437

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.437.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.437.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.437.js

### 수정 내용
- 4.436 기준으로 새 배포 버전 4.437 생성.
- 메인 랜딩 하단 광고 배너 배경색을 원래 색 `#0f3b66`으로 복원.
- 광고문의 버튼 배경색을 원래 색 `#ff6b00`으로 복원.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.437로 변경.

### 검증
- `js/app_4.437.js` 문법 검사 통과: `node --check`.
- `css/base_4.437.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.437 HTML/CSS/JS 안에 4.436 참조 없음.

## 2026-07-09 05:34 KST / Version 4.436

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.436.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.436.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.436.js

### 수정 내용
- 4.435 기준으로 새 배포 버전 4.436 생성.
- 메인 랜딩 하단 광고 배너 배경색을 딥 블루 `#123b62`로 변경.
- 광고문의 버튼 배경색을 부드러운 코랄 오렌지 `#ff8a3d`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.436으로 변경.

### 검증
- `js/app_4.436.js` 문법 검사 통과: `node --check`.
- `css/base_4.436.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.436 HTML/CSS/JS 안에 4.435 참조 없음.

## 2026-07-09 05:28 KST / Version 4.435

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.435.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.435.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.435.js

### 수정 내용
- 4.434 기준으로 새 배포 버전 4.435 생성.
- 메인 랜딩 하단 광고 배너 배경색을 원래 색 `#0f3b66`으로 복원.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.435로 변경.

### 검증
- `js/app_4.435.js` 문법 검사 통과: `node --check`.
- `css/base_4.435.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.435 HTML/CSS/JS 안에 4.434 참조 없음.

## 2026-07-09 05:23 KST / Version 4.434

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.434.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.434.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.434.js

### 수정 내용
- 4.433 기준으로 새 배포 버전 4.434 생성.
- `우리동네 한눈에 보기` 카드 색상은 `#2f70ff`로 유지.
- 메인 랜딩 하단 광고 배너만 더 짙은 블루 `#1f55d8`로 변경해 색상 중복감을 줄임.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.434로 변경.

### 검증
- `js/app_4.434.js` 문법 검사 통과: `node --check`.
- `css/base_4.434.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.434 HTML/CSS/JS 안에 4.433 참조 없음.

## 2026-07-09 05:18 KST / Version 4.433

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.433.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.433.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.433.js

### 수정 내용
- 4.432 기준으로 새 배포 버전 4.433 생성.
- 메인 랜딩 하단 광고 배너 배경색을 `우리동네 한눈에 보기` 카드와 같은 블루 `#2f70ff`로 변경.
- 광고문의 버튼/문구/레이아웃은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.433으로 변경.

### 검증
- `js/app_4.433.js` 문법 검사 통과: `node --check`.
- `css/base_4.433.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.433 HTML/CSS/JS 안에 4.432 참조 없음.

## 2026-07-09 05:13 KST / Version 4.432

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.432.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.432.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.432.js

### 수정 내용
- 4.431 기준으로 새 배포 버전 4.432 생성.
- 메인 랜딩 하단 광고 배너 배경색을 기존 네이비 `#0f3b66`에서 짙은 청록 `#0f4f4a`로 변경.
- 광고문의 버튼 주황 포인트와 기존 레이아웃/문구는 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.432로 변경.

### 검증
- `js/app_4.432.js` 문법 검사 통과: `node --check`.
- `css/base_4.432.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.432 HTML/CSS/JS 안에 4.431 참조 없음.

## 2026-07-09 05:08 KST / Version 4.431

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.431.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.431.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.431.js

### 수정 내용
- 4.430 기준으로 새 배포 버전 4.431 생성.
- 알바 페이지 왼쪽 광고 배너를 동일 규격으로 1개 추가해 총 2칸으로 표시.
- 기존 광고 슬롯 flex column/gap 규격을 그대로 사용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.431로 변경.

### 검증
- `js/app_4.431.js` 문법 검사 통과: `node --check`.
- `css/base_4.431.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.431 HTML/CSS/JS 안에 4.430 참조 없음.

## 2026-07-09 05:02 KST / Version 4.430

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.430.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.430.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.430.js

### 수정 내용
- 4.429 기준으로 새 배포 버전 4.430 생성.
- 알바 공고 등록 폼 초기화 시 주소 input 값, 주소 dataset, 상세주소 표시를 비우는 기존 처리에 주소검색 모달 내부 상태 초기화를 추가.
- 알바 주소검색 모달을 열 때 이전 검색어, 이전 검색 결과, 이전 선택 주소가 남지 않도록 초기화.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.430으로 변경.

### 검증
- `js/app_4.430.js` 문법 검사 통과: `node --check`.
- `css/base_4.430.css` 중괄호 균형 확인: `5281/5281 OK`.
- 4.430 HTML/CSS/JS 안에 4.429 참조 없음.

## 2026-07-09 04:49 KST / Version 4.429

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.429.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.429.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.429.js

### 수정 내용
- 4.428 기준으로 새 배포 버전 4.429 생성.
- 알바 페이지 왼쪽 광고배너 폭을 오른쪽 공고 카드 한 칸 폭과 동일하게 계산하도록 변경.
- 알바 페이지 공고 그리드는 기존처럼 한 줄 4개 유지.
- `✅` 상세 내용 렌더링은 기존 `<strong>` 처리 그대로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.429로 변경.

### 검증
- `js/app_4.429.js` 문법 검사 통과: `node --check`.
- `css/base_4.429.css` 중괄호 균형 확인: `5281/5281 OK`.

## 2026-07-09 04:38 KST / Version 4.428

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.428.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.428.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.428.js

### 수정 내용
- 4.427 기준으로 새 배포 버전 4.428 생성.
- 기준점별 푸터 여백을 상단 `40px`, 하단 `60px`로 변경.
- 메인 랜딩은 파란 광고 박스 하단 기준, 이용약관은 회색 내용 영역 하단 기준, 알바는 선 기준을 유지.
- 알바 `--part-time-footer-line-gap`을 `40px`로 변경.
- 세 페이지 푸터 하단 영역을 `60px`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.428로 변경.

### 검증
- `js/app_4.428.js` 문법 검사 통과: `node --check`.
- `css/base_4.428.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.428 HTML/CSS/JS 안에 4.427 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 04:31 KST / Version 4.427

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.427.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.427.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.427.js

### 수정 내용
- 4.426 기준으로 새 배포 버전 4.427 생성.
- 기준점별 푸터 여백을 상단 `50px`, 하단 `80px`로 변경.
- 메인 랜딩은 파란 광고 박스 하단 기준으로 푸터 제목까지 `50px`가 적용되도록 공통 상단값 변경.
- 이용약관은 회색 내용 영역 하단 기준으로 푸터 제목까지 `50px`가 적용되도록 공통 상단값 변경.
- 알바는 푸터 선 기준으로 제목까지 `50px`가 적용되도록 `--part-time-footer-line-gap`을 `50px`로 변경.
- 세 페이지 푸터 하단 영역을 `80px`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.427로 변경.

### 검증
- `js/app_4.427.js` 문법 검사 통과: `node --check`.
- `css/base_4.427.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.427 HTML/CSS/JS 안에 4.426 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 04:24 KST / Version 4.426

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.426.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.426.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.426.js

### 수정 내용
- 4.425 기준으로 새 배포 버전 4.426 생성.
- 메인 랜딩은 파란 광고 박스 하단을 기준으로 푸터 제목까지의 여백을 잡도록 `main-landing-bottom-ad` 하단 margin을 제거.
- 이용약관은 회색 내용 영역 하단을 기준으로 푸터 제목까지의 여백을 잡도록 `terms-full-footer-shell` 상단 padding을 제거.
- 알바는 푸터 선을 다시 표시하고, 선을 기준으로 푸터 제목까지의 여백을 잡도록 알바 푸터 상단 padding을 제거.
- 알바 푸터 선은 `#dfe7f1`, `1px`, `100vw`로 복구.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.426으로 변경.

### 검증
- `js/app_4.426.js` 문법 검사 통과: `node --check`.
- `css/base_4.426.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.426 HTML/CSS/JS 안에 4.425 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 04:13 KST / Version 4.425

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.425.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.425.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.425.js

### 수정 내용
- 4.424 기준으로 새 배포 버전 4.425 생성.
- 메인 랜딩, 이용약관, 알바 페이지 하단 푸터를 하나의 공통 CSS 블록으로 묶음.
- 공통 푸터 상단/하단 값을 `30px`/`40px`로 통일.
- 공통 푸터 폭, 좌우 정렬, 배경, box-sizing 규칙을 같은 블록에서 적용.
- 알바 페이지 푸터의 별도 line/padding 표시가 공통 규격과 다르게 보이지 않도록 footer line을 공통으로 숨김.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.425로 변경.

### 검증
- `js/app_4.425.js` 문법 검사 통과: `node --check`.
- `css/base_4.425.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.425 HTML/CSS/JS 안에 4.424/4.423 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 04:04 KST / Version 4.424

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.424.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.424.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.424.js

### 수정 내용
- 4.423 기준으로 새 배포 버전 4.424 생성.
- 하단 푸터 공통 기준을 상단 `30px`, 하단 `40px`로 변경.
- 메인 랜딩 푸터 상단/하단 값을 `30px`/`40px`로 변경.
- 약관 푸터 데스크톱/모바일 상단/하단 값을 `30px`/`40px`로 변경.
- 알바 푸터는 카드-선 간격 `30px`, 선-제목 간격 `30px`, 하단 영역 `40px`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.424로 변경.

### 검증
- `js/app_4.424.js` 문법 검사 통과: `node --check`.
- `css/base_4.424.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.424 HTML/CSS/JS 안에 4.423/4.422 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:56 KST / Version 4.423

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.423.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.423.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.423.js

### 수정 내용
- 4.422 기준으로 새 배포 버전 4.423 생성.
- 하단 푸터 하단 영역을 메인 랜딩, 이용약관, 알바 페이지 모두 공통 `70px`로 변경.
- 메인 랜딩 푸터 `--realjeju-footer-bottom-gap`을 `70px`로 변경.
- 약관 푸터 데스크톱/모바일 `--realjeju-footer-bottom-gap`을 `70px`로 변경.
- 알바 푸터 하단 `--realjeju-footer-bottom-gap`을 `70px`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.423으로 변경.

### 검증
- `js/app_4.423.js` 문법 검사 통과: `node --check`.
- `css/base_4.423.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.423 HTML/CSS/JS 안에 4.422/4.421 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:50 KST / Version 4.422

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.422.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.422.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.422.js

### 수정 내용
- 4.421 기준으로 새 배포 버전 4.422 생성.
- 하단 푸터 하단 영역을 메인 랜딩, 이용약관, 알바 페이지 모두 공통 `50px`로 맞춤.
- 메인 랜딩 푸터 `--realjeju-footer-bottom-gap`을 `50px`로 변경.
- 약관 푸터 데스크톱/모바일 `--realjeju-footer-bottom-gap`을 `50px`로 변경.
- 알바 푸터 하단 `--realjeju-footer-bottom-gap: 50px` 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.422로 변경.

### 검증
- `js/app_4.422.js` 문법 검사 통과: `node --check`.
- `css/base_4.422.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.422 HTML/CSS/JS 안에 4.421/4.420 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:42 KST / Version 4.420

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.420.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.420.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.420.js

### 수정 내용
- 4.419 기준으로 새 배포 버전 4.420 생성.
- 알바 페이지 마지막 카드/광고 하단에서 푸터 선까지의 위쪽 여백만 10px 추가.
- 알바 푸터 위쪽 여백을 `--part-time-footer-top-gap: 50px`로 설정.
- 선에서 `리얼제주(REALJEJU.APP)` 제목까지의 아래쪽 여백은 `--part-time-footer-line-gap: 40px`로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.420으로 변경.

### 검증
- `js/app_4.420.js` 문법 검사 통과: `node --check`.
- `css/base_4.420.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.420 HTML/CSS/JS 안에 4.419/4.418 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:34 KST / Version 4.419

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.419.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.419.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.419.js

### 수정 내용
- 4.418 기준으로 새 배포 버전 4.419 생성.
- 알바 페이지 푸터 기준을 마지막 공고 카드 하단에서 선까지의 여백과 선에서 `리얼제주(REALJEJU.APP)` 제목까지의 여백이 같도록 정리.
- 알바 푸터 상하 기준값을 `--part-time-footer-line-gap: 40px` 변수로 묶어 같은 값만 쓰도록 변경.
- 알바 상단 세로 광고 제거 상태와 사각 AD 우측 상단 원형 배지 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.419로 변경.

### 검증
- `js/app_4.419.js` 문법 검사 통과: `node --check`.
- `css/base_4.419.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.419 HTML/CSS/JS 안에 4.418/4.417 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:25 KST / Version 4.418

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.418.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.418.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.418.js

### 수정 내용
- 4.417 기준으로 새 배포 버전 4.418 생성.
- 알바 페이지 좌측 광고 영역에서 상단 세로 광고 카드를 제거.
- 기존 하단 4:3 사각 광고가 좌측 광고 영역 최상단으로 올라오도록 마크업 정리.
- 사각 광고 우측 상단에 원형 `AD` 배지를 추가.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.418로 변경.

### 검증
- `js/app_4.418.js` 문법 검사 통과: `node --check`.
- `css/base_4.418.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.418 HTML/CSS/JS 안에 4.417/4.416 참조 없음.
- `/Users/GHOST/Downloads` 복사본 3개 파일 원본과 일치 확인: `cmp`.

## 2026-07-09 03:00 KST / Version 4.416

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.416.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.416.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.416.js

### 수정 내용
- 4.415 기준으로 새 배포 버전 4.416 생성.
- 약관 푸터를 메인 랜딩 원래 하단 푸터 규격으로 복구.
- 약관 푸터 규격:
  - shell `margin-top: 0`
  - shell `padding-top: 18px`
  - footer 상단 패딩 `32px`
  - footer 하단 패딩 `46px`
  - 모바일 shell `padding-top: 14px`
- 메인 랜딩 푸터 원래 규격 유지.
- 알바 푸터 선 아래 값은 변경하지 않음.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.416으로 변경.

### 검증
- `js/app_4.416.js` 문법 검사 통과: `node --check`.
- `css/base_4.416.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.416 HTML/CSS/JS 안에 4.415 참조 없음.

## 2026-07-09 02:52 KST / Version 4.415

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.415.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.415.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.415.js

### 수정 내용
- 4.414 기준으로 새 배포 버전 4.415 생성.
- 메인 랜딩 푸터를 4.407 원래 값으로 복구.
- 메인 랜딩 복구 값:
  - `.main-landing-bottom-ad` 데스크톱 `margin-bottom: 18px`
  - `.main-landing-bottom-ad` 모바일 `margin-bottom: 14px`
  - `.main-landing-footer` `margin-top: 0`
  - `.main-landing-footer` 상단 패딩 `32px`, 하단 패딩 `46px`
- 알바 푸터 선 아래 값은 변경하지 않음.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.415로 변경.

### 검증
- `js/app_4.415.js` 문법 검사 통과: `node --check`.
- `css/base_4.415.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.415 HTML/CSS/JS 안에 4.414/4.413 참조 없음.

## 2026-07-09 02:45 KST / Version 4.413

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.413.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.413.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.413.js

### 수정 내용
- 4.412 기준으로 새 배포 버전 4.413 생성.
- 알바 푸터 선 기준 상하 여백을 같은 값으로 맞춤.
- 알바 푸터 기준:
  - AD 박스 하단에서 선까지: `40px`
  - 선에서 `리얼제주(REALJEJU.APP)` 제목까지: `40px`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.413으로 변경.

### 검증
- `js/app_4.413.js` 문법 검사 통과: `node --check`.
- `css/base_4.413.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.413 HTML/CSS/JS 안에 4.412 참조 없음.

## 2026-07-09 02:39 KST / Version 4.411

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.411.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.411.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.411.js

### 수정 내용
- 4.410 기준으로 새 배포 버전 4.411 생성.
- 알바 푸터의 선 위 여백이 바깥 margin 45px와 내부 padding 45px로 중복되던 구조를 정리.
- 알바 푸터 기준:
  - 위 콘텐츠 끝에서 선까지: `margin-top: var(--realjeju-footer-top-gap, 45px)`
  - 선 위 내부 padding: `0`
  - 선 아래에서 푸터 내용까지: `margin-bottom: var(--realjeju-footer-top-gap, 45px)`
  - 푸터 하단: `var(--realjeju-footer-bottom-gap, 45px)`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.411로 변경.

### 검증
- `js/app_4.411.js` 문법 검사 통과: `node --check`.
- `css/base_4.411.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.411 HTML/CSS/JS 안에 4.410 참조 없음.

## 2026-07-09 02:33 KST / Version 4.410

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.410.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.410.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.410.js

### 수정 내용
- 4.409 기준으로 새 배포 버전 4.410 생성.
- 하단 푸터 자체를 위 콘텐츠에서 상단 여백 45px만큼 띄움.
- 메인 랜딩 푸터, 약관 푸터 shell, 알바 푸터에 `margin-top: var(--realjeju-footer-top-gap, 45px)` 적용.
- 알바 푸터는 기존 선 위/아래/하단 45px 규칙 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.410으로 변경.

### 검증
- `js/app_4.410.js` 문법 검사 통과: `node --check`.
- `css/base_4.410.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.410 HTML/CSS/JS 안에 4.409 참조 없음.

## 2026-07-09 02:28 KST / Version 4.409

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.409.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.409.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.409.js

### 수정 내용
- 4.408 기준으로 새 배포 버전 4.409 생성.
- 알바 페이지 푸터 선 위 여백도 45px로 추가.
- 알바 푸터 여백 기준:
  - 선 위: `var(--realjeju-footer-top-gap, 45px)`
  - 선 아래: `var(--realjeju-footer-top-gap, 45px)`
  - 푸터 하단: `var(--realjeju-footer-bottom-gap, 45px)`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.409로 변경.

### 검증
- `js/app_4.409.js` 문법 검사 통과: `node --check`.
- `css/base_4.409.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.409 HTML/CSS/JS 안에 4.408 참조 없음.

## 2026-07-09 02:23 KST / Version 4.408

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.408.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.408.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.408.js

### 수정 내용
- 4.407 기준으로 새 배포 버전 4.408 생성.
- 푸터 상단/하단 여백 기준을 모두 45px로 통일.
- 공통 푸터 변수 변경:
  - `--realjeju-footer-top-gap: 45px`
  - `--realjeju-footer-bottom-gap: 45px`
- 메인 랜딩 푸터:
  - bottom-ad 아래 추가 여백 제거.
  - 푸터 자체 padding 상단/하단을 45px 기준으로 적용.
- 약관 페이지 푸터:
  - footer shell의 추가 상단 padding 제거.
  - 푸터 자체 padding 상단/하단을 45px 기준으로 적용.
- 알바 페이지 푸터:
  - 선 아래 여백을 45px로 적용.
  - 하단 여백을 45px로 적용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.408로 변경.

### 검증
- `js/app_4.408.js` 문법 검사 통과: `node --check`.
- `css/base_4.408.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.408 HTML/CSS/JS 안에 4.407 참조 없음.

## 2026-07-09 02:16 KST / Version 4.407

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.407.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.407.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.407.js

### 수정 내용
- 4.406 기준으로 새 배포 버전 4.407 생성.
- 알바 페이지 하단 푸터 상단 여백을 선 기준으로 변경.
- 알바 푸터의 선 위 `padding-top`을 제거하고, 선 아래 여백을 메인 랜딩 푸터 상단값과 같은 `var(--realjeju-footer-top-gap, 32px)`로 맞춤.
- 알바 푸터 폭/좌우 정렬은 메인 랜딩 계산식 유지:
  - `width: 100vw`
  - `margin-left/right: calc(50% - 50vw)`
  - 좌우 패딩: `var(--realjeju-main-page-edge)`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.407로 변경.

### 검증
- `js/app_4.407.js` 문법 검사 통과: `node --check`.
- `css/base_4.407.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.407 HTML/CSS/JS 안에 4.406/4.405 참조 없음.

## 2026-07-09 02:10 KST / Version 4.406

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.406.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.406.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.406.js

### 수정 내용
- 4.405 기준으로 새 배포 버전 4.406 생성.
- 알바 페이지 하단 푸터 규격을 메인 랜딩 푸터 소스 계산식에 맞춤.
- 알바 푸터 최종 규칙:
  - `width: 100vw`
  - `margin-left/right: calc(50% - 50vw)`
  - `padding: var(--realjeju-footer-top-gap, 32px) var(--realjeju-main-page-edge) var(--realjeju-footer-bottom-gap, 46px)`
  - `background: #fff`
  - `box-sizing: border-box`
- 알바 푸터 구분선은 요청대로 `width: 100vw` 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.406으로 변경.

### 검증
- `js/app_4.406.js` 문법 검사 통과: `node --check`.
- `css/base_4.406.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.406 HTML/CSS/JS 안에 4.405/4.404 참조 없음.

## 2026-07-09 01:56 KST / Version 4.404

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.404.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.404.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.404.js

### 수정 내용
- 4.403 기준으로 새 배포 버전 4.404 생성.
- 알바 페이지 하단 푸터를 `.part-time-page-inner` 밖으로 이동.
- 알바 푸터를 알바 섹션 직속 독립 풀폭 푸터로 변경.
- `.part-time-page-inner`의 하단 패딩을 0으로 덮어 푸터 아래에 본문 컨테이너 여백이 끼지 않도록 정리.
- 알바 푸터 구조:
  - `width: 100vw`
  - 좌우 내부 여백: `var(--realjeju-main-page-edge)`
  - 상단/하단 내부 여백 동일: `var(--realjeju-footer-top-gap, 32px)`
  - 구분선: `width: 100vw`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.404로 변경.

### 검증
- `js/app_4.404.js` 문법 검사 통과: `node --check`.
- `css/base_4.404.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.404 HTML/CSS/JS 안에 4.403 참조 없음.
- `/Users/GHOST/Downloads`에 4.404 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:54 KST / Version 4.403

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.403.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.403.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.403.js

### 수정 내용
- 4.402 기준으로 새 배포 버전 4.403 생성.
- 알바 페이지가 왼쪽으로 붙어 보이지 않도록 알바 화면 자체에 메인 랜딩과 같은 중앙 폭 계산을 직접 선언.
- `body.part-time-page-open`에 공통 폭 변수 지정:
  - `--realjeju-main-page-width: min(1120px, calc(100vw - 64px))`
  - `--realjeju-main-page-edge: max(32px, calc((100vw - var(--realjeju-main-page-width)) / 2))`
- `.part-time-page-inner`를 위 공통 폭으로 중앙 정렬.
- `.part-time-page-footer` 내부 좌우 패딩도 메인 랜딩과 같은 직접 계산식으로 맞춤.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.403으로 변경.

### 검증
- `js/app_4.403.js` 문법 검사 통과: `node --check`.
- `css/base_4.403.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.403 HTML/CSS/JS 안에 4.402 참조 없음.
- `/Users/GHOST/Downloads`에 4.403 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:52 KST / Version 4.402

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.402.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.402.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.402.js

### 수정 내용
- 4.401 기준으로 새 배포 버전 4.402 생성.
- 알바 페이지 하단 푸터를 메인 랜딩/약관 페이지처럼 공통 폭 구조로 변경.
- 알바 푸터 폭/정렬:
  - `width: 100vw`
  - `margin-left/right: calc(50% - 50vw)`
  - 좌우 내부 여백은 `var(--realjeju-main-page-edge)` 사용.
- 알바 푸터 상단/하단 내부 여백을 같은 값으로 맞춤:
  - `padding-top: var(--realjeju-footer-top-gap, 32px)`
  - `padding-bottom: var(--realjeju-footer-top-gap, 32px)`
- 푸터 구분선은 `display: block`, `width: 100%`로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.402로 변경.

### 검증
- `js/app_4.402.js` 문법 검사 통과: `node --check`.
- `css/base_4.402.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.402 HTML/CSS/JS 안에 4.401 참조 없음.
- `/Users/GHOST/Downloads`에 4.402 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:50 KST / Version 4.400

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.400.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.400.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.400.js

### 수정 내용
- 4.399 기준으로 새 배포 버전 4.400 생성.
- 알바 페이지 목록 하단에 메인 랜딩과 같은 사업자 푸터 추가.
- 푸터 링크 구성 유지:
  - 회사소개
  - 이용약관
  - 개인정보처리방침
  - 위치기반 서비스 이용약관
  - 매물관리 규정
- 알바 4열 그리드와 전체 렌더 로직은 그대로 유지.
- 메인 랜딩 상단바는 그림자 없이 얇은 1px 선 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.400으로 변경.

### 검증
- `js/app_4.400.js` 문법 검사 통과: `node --check`.
- `css/base_4.400.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.400 HTML/CSS/JS 안에 4.399 참조 없음.
- `/Users/GHOST/Downloads`에 4.400 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:48 KST / Version 4.398

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.398.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.398.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.398.js

### 수정 내용
- 4.397 기준으로 새 배포 버전 4.398 생성.
- 알바 목록은 렌더 개수를 제한하지 않고 전체 `jobs.map(...)` 렌더 그대로 유지.
- 알바 카드 그리드만 데스크톱 기준 한 줄 4개로 고정:
  - `body.part-time-page-open .part-time-card-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }`
- 태블릿/모바일은 기존 흐름에 맞춰 2열/1열 유지.
- 메인 랜딩에서 상단 네비 하단 줄이 두꺼워 보이던 원인인 `.global-topbar` 그림자 제거:
  - `box-shadow: none`
  - `border-bottom: 0`
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.398로 변경.

### 검증
- `js/app_4.398.js` 문법 검사 통과: `node --check`.
- `css/base_4.398.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.398 HTML/CSS/JS 안에 4.397 참조 없음.
- 알바 렌더 로직이 `grid.innerHTML = jobs.map(...)` 상태임을 확인.
- `/Users/GHOST/Downloads`에 4.398 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:44 KST / Version 4.397

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.397.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.397.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.397.js

### 수정 내용
- 4.396 작업본을 기준으로 새 배포 버전 4.397 생성.
- 알바 페이지 HTML 핵심 블록을 4.369 소스 그대로 복원.
- 알바 페이지 CSS 핵심 블록을 4.369 소스 그대로 복원.
- 알바 JS 핵심 로직을 4.369 소스 기준으로 복원:
  - 휴지통 버튼/삭제/복원/갱신 흐름
  - 상단 이미지 업로드/미리보기/삭제 흐름
  - 상세주소 표시 흐름
- 약관에서 알바를 눌렀을 때 약관 오버레이가 남는 문제를 막기 위한 `closeRealjejuTermsFullPageForNavigation()` 호출은 유지.
- 약관 본문 하단 여백은 상단 여백과 같은 `42px` 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.397로 변경.

### 검증
- 알바 HTML 핵심 블록 diff 확인: 4.369와 동일.
- 알바 CSS 핵심 블록 diff 확인: 4.369와 동일.
- `js/app_4.397.js` 문법 검사 통과: `node --check`.
- `css/base_4.397.css` 중괄호 균형 확인: `braceBalance=0`.
- 4.397 HTML/CSS/JS 안에 4.396 참조 없음.
- `/Users/GHOST/Downloads`에 4.397 HTML/CSS/JS 복사 완료 및 원본과 `cmp` 일치 확인.

## 2026-07-09 01:38 KST / Version 4.395

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.395.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.395.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.395.js

### 수정 내용
- 4.394의 약관 푸터 `::before` 땜빵 블록 제거.
- 메인 랜딩 소스에서 확인한 정확한 구조만 유지:
  - `body.main-landing-page-open .main-landing-bottom-ad { margin-bottom: 18px; }`
  - `body.main-landing-page-open .main-landing-footer { padding-top: var(--realjeju-footer-top-gap, 32px); padding-bottom: var(--realjeju-footer-bottom-gap, 46px); }`
- 약관 푸터 wrapper `.terms-full-footer-shell` 자체에 `padding-top: 18px`를 주어 메인 랜딩의 bottom-ad margin-bottom 역할을 깔끔하게 적용.
- 약관 푸터 본체는 메인 랜딩과 동일하게 `padding: var(--realjeju-footer-top-gap, 32px) var(--realjeju-main-page-edge) var(--realjeju-footer-bottom-gap, 46px)` 유지.
- 약관 내용 하단 임의 여백은 `padding-bottom: 0`으로 제거.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.395로 변경.

### 검증
- `js/app_4.395.js` 문법 검사 통과: `node --check`
- `css/base_4.395.css` 중괄호 균형 확인: `braceBalance=0`
- 4.395 HTML/CSS/JS 안에 4.394 참조 및 `terms-full-footer-shell::before` 없음.
- `/Users/GHOST/Downloads`에 4.395 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:35 KST / Version 4.394

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.394.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.394.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.394.js

### 수정 내용
- 약관 하단 푸터 상단 여백을 메인 랜딩 소스 구조 기준으로 재수정.
- 메인 랜딩 실제 구조 확인:
  - `realjeju_4.392.html`에서 `.main-landing-bottom-ad` 바로 다음에 `.main-landing-footer`가 위치.
  - `css/base_4.392.css`에서 `body.main-landing-page-open .main-landing-bottom-ad { margin-bottom: 18px; }`
  - `css/base_4.392.css`에서 `body.main-landing-page-open .main-landing-footer { padding-top: var(--realjeju-footer-top-gap, 32px); }`
- 약관에 없는 `bottom-ad margin-bottom 18px`에 해당하는 흰색 풀폭 영역을 `.terms-full-footer-shell::before`로 추가.
- 약관 푸터 자체 padding은 메인 랜딩과 동일하게 `32px / 46px` 유지.
- 약관 내용 하단 회색 여백은 과하게 크지 않게 `18px`로 축소.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.394로 변경.

### 검증
- `js/app_4.394.js` 문법 검사 통과: `node --check`
- `css/base_4.394.css` 중괄호 균형 확인: `braceBalance=0`
- 4.394 HTML/CSS/JS 안에 4.392 참조 없음.
- `/Users/GHOST/Downloads`에 4.394 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:30 KST / Version 4.392

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.392.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.392.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.392.js

### 수정 내용
- 약관 하단 푸터의 보이는 상단 여백이 메인 랜딩보다 작아 보이던 문제 수정.
- 약관 본문 하단 여백을 `42px`에서 `76px`로 확대.
- 약관 푸터 내부 padding은 메인 랜딩 푸터와 동일하게 `top 32px / bottom 46px` 유지.
- 약관 화면의 푸터 이름까지 보이는 상단 여백을 `본문 하단 76px + 푸터 top 32px = 108px` 기준으로 조정.
- 약관 푸터 폭/좌우 정렬 계산(`100vw`, `calc(50% - 50vw)`, `--realjeju-main-page-edge`)은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.392로 변경.

### 검증
- `js/app_4.392.js` 문법 검사 통과: `node --check`
- `css/base_4.392.css` 중괄호 균형 확인: `braceBalance=0`
- 4.392 HTML/CSS/JS 안에 4.391 참조 없음.
- `/Users/GHOST/Downloads`에 4.392 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:28 KST / Version 4.391

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.391.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.391.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.391.js

### 수정 내용
- 약관 내용 하단 여백이 너무 줄어든 문제 수정.
- 약관 본문 하단 여백을 약관 본문 상단 여백과 같은 `42px`로 변경.
- 약관 푸터 내부 상단/하단 여백을 메인 랜딩 푸터와 동일하게 `32px / 46px`로 변경.
- 4.390에서 푸터 상단 padding에 합쳤던 `18px + 32px = 50px` 계산을 제거하고, 메인 랜딩 푸터 자체 padding 값과 동일한 변수식을 사용.
- 약관 푸터 폭/좌우 정렬 계산(`100vw`, `calc(50% - 50vw)`, `--realjeju-main-page-edge`)은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.391로 변경.

### 검증
- `js/app_4.391.js` 문법 검사 통과: `node --check`
- `css/base_4.391.css` 중괄호 균형 확인: `braceBalance=0`
- 4.391 HTML/CSS/JS 안에 4.390 참조 없음.
- `/Users/GHOST/Downloads`에 4.391 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:26 KST / Version 4.390

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.390.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.390.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.390.js

### 수정 내용
- 약관 하단 푸터의 흰색 상단/하단 여백이 메인 랜딩 푸터와 다르게 보이던 문제 재수정.
- 메인 랜딩 소스 기준: `.main-landing-bottom-ad { margin-bottom: 18px; }` + `.main-landing-footer { padding-top: 32px; padding-bottom: 46px; }`
- 따라서 메인 랜딩의 실제 위쪽 흰 여백은 `18px + 32px = 50px`, 아래쪽 흰 여백은 `46px`.
- 약관 푸터 shell의 회색 `margin-top` 방식(`38px`)을 제거하고, 흰 푸터 자체 padding을 `50px ... 46px`로 변경.
- 모바일은 메인 랜딩 기준 `14px + 32px = 46px`에 맞춰 `padding: 46px 24px`로 변경.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.390으로 변경.

### 검증
- `js/app_4.390.js` 문법 검사 통과: `node --check`
- `css/base_4.390.css` 중괄호 균형 확인: `braceBalance=0`
- 4.390 HTML/CSS/JS 안에 4.389 참조 없음.
- `/Users/GHOST/Downloads`에 4.390 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:25 KST / Version 4.389

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.389.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.389.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.389.js

### 수정 내용
- 약관 전체페이지를 보고 있는 상태에서 상단 카테고리의 부동산/알바를 눌러도 약관 페이지만 계속 보이던 문제 수정.
- 원인: 뒤쪽 페이지 라우팅은 실행되지만 `#termsFullPage.open` 오버레이가 닫히지 않아 화면을 계속 덮고 있었음.
- `closeRealjejuTermsFullPageForNavigation()` 헬퍼를 추가해 열린 약관 전체페이지를 라우팅 전에 닫도록 처리.
- 카테고리 전환(`syncGlobalCategoryActive`), 알바 페이지 진입(`openRealjejuPartTimePage`), 부동산 홈 복귀(`realjejuGoHome`)에서 약관 오버레이를 먼저 닫음.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.389로 변경.

### 검증
- `js/app_4.389.js` 문법 검사 통과: `node --check`
- `css/base_4.389.css` 중괄호 균형 확인: `braceBalance=0`
- 4.389 HTML/CSS/JS 안에 4.388 참조 없음.
- `/Users/GHOST/Downloads`에 4.389 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:23 KST / Version 4.388

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.388.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.388.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.388.js

### 수정 내용
- 약관 페이지 하단 푸터의 내부 흰색 영역 상단/하단 여백을 동일하게 맞춤.
- 약관 푸터 데스크톱 padding을 `32px var(--realjeju-main-page-edge) 32px`로 변경.
- 약관 푸터 모바일 padding을 `32px 24px`로 변경.
- 약관 푸터 폭/좌우 정렬 계산(`100vw`, `calc(50% - 50vw)`)은 그대로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.388로 변경.

### 검증
- `js/app_4.388.js` 문법 검사 통과: `node --check`
- `css/base_4.388.css` 중괄호 균형 확인: `braceBalance=0`
- 4.388 HTML/CSS/JS 안에 4.387 참조 없음.
- `/Users/GHOST/Downloads`에 4.388 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:21 KST / Version 4.387

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.387.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.387.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.387.js

### 수정 내용
- 약관 페이지 본문 끝과 하단 푸터 사이 여백을 줄임.
- `.terms-full-body #termsFullContent` 하단 패딩을 `22px`에서 `10px`로 축소.
- `.terms-full-footer-shell` 상단 margin을 데스크톱 `58px`에서 `38px`, 모바일 `34px`에서 `22px`로 축소.
- 약관 푸터의 메인 랜딩 기준 폭 계산(`100vw`, `calc(50% - 50vw)`, `--realjeju-main-page-edge`)은 그대로 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.387로 변경.

### 검증
- `js/app_4.387.js` 문법 검사 통과: `node --check`
- `css/base_4.387.css` 중괄호 균형 확인: `braceBalance=0`
- 4.387 HTML/CSS/JS 안에 4.386 참조 없음.
- `/Users/GHOST/Downloads`에 4.387 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:43 KST / Version 4.386

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.386.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.386.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.386.js

### 수정 내용
- 약관 하단 푸터의 왼쪽 여백이 메인 랜딩 하단 푸터와 다르던 문제 수정.
- 원인: 메인 랜딩 푸터는 `.main-landing-inner` 중앙 컨테이너 안에서 `100vw`로 풀폭 계산하지만, 약관 푸터는 약관 스크롤 영역을 직접 기준으로 계산하고 있었음.
- 약관 푸터를 `.terms-full-footer-shell` 중앙 컨테이너로 감싼 뒤, 그 안에서 메인 랜딩과 동일한 `100vw`, `calc(50% - 50vw)`, `--realjeju-main-page-edge` 계산을 적용.
- 약관 스크롤 영역의 scrollbar 폭 차이로 좌우 기준이 밀리지 않도록 scrollbar를 숨기되 스크롤 동작은 유지.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.386으로 변경.

### 검증
- `js/app_4.386.js` 문법 검사 통과: `node --check`
- `css/base_4.386.css` 중괄호 균형 확인: `braceBalance=0`
- 4.386 HTML/CSS/JS 안에 4.385 참조 없음.
- `/Users/GHOST/Downloads`에 4.386 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:36 KST / Version 4.385

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.385.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.385.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.385.js

### 수정 내용
- 약관 하단 푸터 폭이 메인 랜딩 하단 푸터와 다르게 보이던 문제 재수정.
- 약관 푸터를 메인 랜딩 푸터와 동일하게 `width: 100vw`, `margin-left/right: calc(50% - 50vw)`, `padding: ... var(--realjeju-main-page-edge)` 구조로 변경.
- 모바일에서도 메인 랜딩 푸터와 동일한 `24px` 좌우 패딩 적용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.385로 변경.

### 검증
- `js/app_4.385.js` 문법 검사 통과: `node --check`
- `css/base_4.385.css` 중괄호 균형 확인: `braceBalance=0`
- 4.385 HTML/CSS/JS 안에 4.384 참조 없음.
- `/Users/GHOST/Downloads`에 4.385 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:30 KST / Version 4.384

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.384.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.384.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.384.js

### 수정 내용
- 약관 본문 마지막 줄과 하단 푸터 사이에 한 줄 여백을 추가.
- 매물관리 규정 버튼이 열리지 않던 문제 수정.
- 원인: `data-terms-key="listing-policy"` 버튼은 있었지만 `openTermsFullPage()`에서 사용할 `listing-policy` 소스가 없어 바로 반환되거나 오류 처리되던 상태.
- `legal_documents` DB 조회를 추가하고, DB가 없거나 미반영된 환경에서도 `sql/legal_documents_4.343.sql`의 매물관리 규정 JSON을 로컬 fallback으로 표시하도록 추가.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.384로 변경.

### 검증
- `js/app_4.384.js` 문법 검사 통과: `node --check`
- `css/base_4.384.css` 중괄호 균형 확인: `braceBalance=0`
- 4.384 HTML/CSS/JS 안에 4.383 참조 없음.
- `/Users/GHOST/Downloads`에 4.384 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:22 KST / Version 4.383

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.383.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.383.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.383.js

### 수정 내용
- 약관 하단 푸터가 메인 랜딩보다 넓게 보이던 문제 수정.
- 약관 푸터 박스 자체를 `--realjeju-main-page-width`로 제한해 메인 랜딩 본문 폭과 맞춤.
- 모바일에서도 메인 랜딩 본문 폭과 같은 `min(100% - 28px, 520px)` 기준 적용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.383으로 변경.

### 검증
- `js/app_4.383.js` 문법 검사 통과: `node --check`
- `css/base_4.383.css` 중괄호 균형 확인: `braceBalance=0`
- 4.383 HTML/CSS/JS 안에 4.382 참조 없음.
- `/Users/GHOST/Downloads`에 4.383 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:18 KST / Version 4.382

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.382.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.382.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.382.js

### 수정 내용
- 약관 전체 화면 하단 푸터 아래에 남던 회색 여백 제거.
- 약관 스크롤 영역의 가로 스크롤이 생기지 않도록 `overflow-x: hidden` 적용.
- 약관 푸터 폭을 `100vw` 강제 방식에서 `100%` + 메인 랜딩 edge padding 방식으로 변경해 메인 랜딩 푸터 폭과 맞춤.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.382로 변경.

### 검증
- `js/app_4.382.js` 문법 검사 통과: `node --check`
- `css/base_4.382.css` 중괄호 균형 확인: `braceBalance=0`
- 4.382 HTML/CSS/JS 안에 4.381 참조 없음.
- `/Users/GHOST/Downloads`에 4.382 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:12 KST / Version 4.381

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.381.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.381.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.381.js

### 수정 내용
- 이용약관 전체 화면 하단에 메인 랜딩 푸터와 같은 사업자 정보 푸터를 추가.
- 약관 푸터가 약관 본문 폭에 갇히지 않도록 메인 랜딩 푸터와 같은 `100vw` 폭과 `--realjeju-main-page-edge` 패딩 규칙 적용.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크, `APP_VERSION`을 4.381로 변경.

### 검증
- `js/app_4.381.js` 문법 검사 통과: `node --check`
- 4.381 HTML/CSS/JS 안에 4.380 참조 없음.
- `/Users/GHOST/Downloads`에 4.381 HTML/CSS/JS 복사 완료.

## 2026-07-09 01:05 KST / Version 4.380

### 작업 규칙 기록
- 수정이 발생하면 기존 버전을 덮어쓰지 않고 반드시 새 버전 파일을 생성한다.
- 새 버전 세트는 HTML/CSS/JS를 함께 만들고, 작업공간과 `/Users/GHOST/Downloads` 양쪽에 둔다.
- 이 규칙은 `/Users/GHOST/Documents/REALJEJU/REALJEJU_VERSION_RULE.md`에도 별도로 기록했다.

### 수정 파일
- /Users/GHOST/Documents/REALJEJU/realjeju_4.380.html
- /Users/GHOST/Documents/REALJEJU/css/base_4.380.css
- /Users/GHOST/Documents/REALJEJU/js/app_4.380.js

### 수정 내용
- 4.379의 메인 랜딩/푸터 이식본과 여백 보정 수정분을 기준으로 4.380 새 버전 생성.
- HTML 내부 CSS/JS 링크, 화면 버전 표시, 다운로드 링크를 4.380으로 변경.
- `APP_VERSION`을 4.380으로 변경.
- 4.378 기준 메인 랜딩 최종 여백 규칙을 포함한 상태로 유지.

### 검증
- `js/app_4.380.js` 문법 검사 통과: `node --check`
- `/Users/GHOST/Downloads`에 4.380 HTML/CSS/JS 복사 완료.

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
## 2026-07-11 / 4.590
- 부동산 홈 첫 매물 로드 경로에서 `measureRealjejuPerformance("부동산 매물 로드", ...)` wrapper를 제거하고 4.576처럼 `runLoadProperties()`를 직접 실행하도록 복구.
- 관심매물 상태 동기화 순서도 4.576과 동일하게 `applyFilter()` 전에 `await loadFavoriteListingStateFromServer()`를 수행하도록 되돌림.
- HTML/CSS/JS/SQL 파일명과 내부 버전 표기, 상단 `Ver 4.590`, 캐시 버스터를 4.590 기준으로 동기화.

## 2026-07-11 / 4.589
- 4.588에서 준비한 `get_map_listing_markers()` RPC 최적화 SQL을 4.589 산출물로 승격.
- HTML/CSS/JS/SQL 파일명과 내부 버전 표기, 상단 `Ver 4.589`, 캐시 버스터를 4.589 기준으로 동기화.

## 2026-07-11 / 4.588
- 4.588 HTML이 4.587 앱 스크립트를 로드하던 참조 오류 수정.
- 랜딩에서 동네업체/중고거래/자동차/모임 등 카테고리 클릭 시 버튼 클릭 이벤트에 의존하지 않고 `realjejuGoHome({ category })`로 직접 진입하도록 변경.
- 랜딩 동네업체 클릭 시 기본 부동산 매물이 먼저 보이는 흐름 방지.
- 비활성 문서의 로드뷰 전체화면 해제 예외는 정상 무시하되 콘솔 경고 스택을 남기지 않도록 정리.
- 왼쪽 최근조회 매물 제목을 임의로 3단어/18글자 기준 절단하던 `getRecentListCompactTitle()`을 제거하고, 4.279와 동일하게 원문 제목을 폭 기준으로 맞추는 방식으로 복구.
- 부동산 홈 매물 로딩에서 관심매물 상태 조회를 기다린 뒤 지도/목록을 그리던 병목을 제거하고, 매물은 먼저 렌더링한 뒤 관심 하트 상태만 비동기로 동기화하도록 변경.
- 성능관리 화면에서 부동산 홈 진입 병목을 볼 수 있도록 `부동산 매물 로드` 측정 항목 추가.
- `get_map_listing_markers()` RPC가 `payload`, 주소 비공개값, 좌표, 가격/거래유형 요약까지 한 번에 반환하도록 SQL 패치 추가. 프론트의 `property_listings` 200개 단위 보강 조회를 안전망으로만 남기고, 정상 적용 시 추가 조회가 발생하지 않도록 정리.
- 관리자 페이지 하단 `© REALJEJU.APP` 로고 여백을 공지사항 푸터 기준과 맞춰, 성능관리/매물관리/쿠폰관리 탭에서 상단 100px·하단 48px 규격으로 통일.
- HTML/CSS/JS 버전 표기를 4.588로 동기화.

## 2026-07-11 / 4.587
- 로드뷰 종료 시 문서가 비활성 상태인 경우 `document.exitFullscreen()` 호출을 건너뛰도록 가드 추가.
- 로드뷰 전체화면 버튼의 해제 동작에도 같은 가드를 적용해 `Document not active` 콘솔 오류 방지.
- HTML/CSS/JS 버전 표기와 동적 앱 스크립트 참조를 4.587로 동기화.

## 2026-07-11 / 4.586
- 메인 랜딩 첫 진입에서 `app_4.586.js`를 즉시 로드하지 않도록 변경.
- 랜딩 전용 부트스트랩을 HTML에 추가해서 지도/목록/카테고리/회사소개/약관 클릭 시에만 앱 JS를 동적 로드.
- `?id=`, `?brokerEdit=`, `?agentList=1` 같은 딥링크는 기존 기능 보장을 위해 앱 JS를 즉시 로드.
- HTML/CSS/JS 버전 표기와 참조를 4.586으로 동기화.
- 앱 JS 로드 전에도 상단 전체메뉴를 열 수 있도록 랜딩용 최소 토글 처리 추가.

## 2026-07-11 / 4.585
- 4.584 기준으로 기능 코드는 변경하지 않고 JS 구역 헤더만 복구.
- `9. 인증 / 내정보 / 중개사무소 신청` 헤더를 인증 모달 IIFE 시작 직전에 추가.
- `10. 관리자 페이지 / 운영자 권한` 헤더를 관리자 페이지 단일 진입점 `openAdminPage()` 시작 직전에 정리.
- `11. 중개사 홈` 헤더를 중개사 홈 목록/필터/매물관리 함수 시작 지점 직전에 추가.
- HTML/CSS/JS 버전 표기와 참조를 4.585로 동기화.

## 2026-07-16 / 4.728
- 지도 클러스터에서 연 매물 목록과 스크롤 위치를 브라우저 창 전환 뒤에도 유지하도록 잠금 목록 스냅샷을 추가.
- 지도 패널 접기/펼치기 버튼과 목록·상세 패널의 이동 시간 및 이동 거리를 동일하게 조정.
- 오른쪽 상세 패널 금액 굵기를 왼쪽 매물 목록 금액과 같은 800으로 통일.
- 관리자 중개사무소 신청 목록의 등록번호에서 표시용 `제`, `호`를 제거.

## 2026-07-16 / 4.729
- `/properties`, `/properties/presales`, `/properties/broker` 같은 하위 주소에서도 행정구역·GIS 파일을 사이트 루트 기준으로 불러오도록 경로 계산을 수정.
- `/companies` 등 카테고리 주소를 새로고침할 때 버튼 클릭에 의존하지 않고 해당 화면을 직접 복원하도록 정리.
- `/properties/broker` 새로고침 시 로그인 세션과 프로필 준비를 기다린 뒤 중개사 홈 권한을 확인하도록 수정.
- 중개사 홈 미승인 안내를 `중개사무소(법인/개공) 신청 승인이 완료되어야 중개사 홈을 사용할 수 있습니다.`로 변경.

## 2026-07-16 / 4.730
- 동네업체 지도 자동 레이어에서 편의점·대형마트·은행·클린하우스를 제외하고 중개사 뱃지만 표시하도록 변경.
- `/companies` 직접 접속 또는 새로고침 시 지도가 준비되기 전에 빈 결과를 로드 완료로 저장하던 초기화 순서를 수정.
- 지도 이동·확대·축소 뒤 현재 화면의 중개사 뱃지를 다시 계산해 지역을 바꾸어도 표시가 유지되도록 수정.
- 현재 지도 범위의 중개사 뱃지를 120개로 제한하던 절단을 제거해 좌표가 있는 승인 중개사를 모두 표시하도록 변경.
