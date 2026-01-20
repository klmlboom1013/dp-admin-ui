# 헤더 및 레이아웃 (Global Header & Layout) 개발 요구사항

## 1. 개요

모든 페이지에서 공통으로 사용되는 상단 헤더(Navigation Bar) 및 레이아웃에 대한 정의다.
`js/header.js`를 통해 동적으로 로드되며, 시스템 전반의 네비게이션과 **개발용 권한 시뮬레이터(Context Simulator)** 기능을 제공한다.

## 2. 화면 구성

### 2.1 로고 및 브랜드

- **좌측 상단**: `<i class="bi bi-rocket-takeoff-fill"></i> Deploy System`
- **링크**: 클릭 시 `dashboard.html`로 이동.

### 2.2 Global Context Simulator (Dev/Test Only)

개발 및 테스트 편의를 위해 **현재 로그인한 사용자의 역할을 동적으로 변경**할 수 있는 기능을 헤더에 전역으로 배치한다.

- **위치**: 우측 상단 유저 정보 좌측.
- **표시 조건**: 모든 페이지에서 항상 표시 (또는 config로 제어 가능).
- **구성 요소**:
  - 라벨: `Simulator:` (small, mute)
  - Select Box:
    - `System Admin (Super)`: 관리자 권한.
    - `홍길동 (Master/PD)`: PD 그룹 관리자.
    - `김철수 (Content/SO)`: SO 그룹 일반 사용자.
    - `이영희 (Report/PD)`: PD 그룹 일반 사용자.
- **동작 방식**:
  - 옵션 변경 시 `currentUser` 정보를 갱신하고, 현재 페이지의 `updatePermissions()` 또는 `renderTable()` 등의 갱신 함수를 트리거한다.
  - 이를 위해 Global Event (`contextChanged`) 또는 공통 함수 호출 체계를 사용해야 한다.

### 2.3 사용자 정보 영역

- **표시 내용**: `Name (ID)` 또는 `Name (Level)`.
- **로그아웃 버튼**: 클릭 시 로그인 페이지로 이동.

## 3. 기능 요구사항

1. **동적 로딩**: `header.js` 실행 시 `<div id="header-container">`에 즉시 렌더링.
2. **이벤트 전파**: 시뮬레이터 변경 시 각 페이지가 이를 감지하고 UI를 즉시 갱신해야 한다. (새로고침 없이)
3. **상태 유지**: 페이지 이동 후에도 선택된 시뮬레이터 상태(Context)가 유지되어야 한다. (`localStorage` 또는 `sessionStorage` 활용 권장)
