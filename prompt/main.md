# 메인 화면 (레이아웃) 개발 요구사항

## 1. 개요

로그인 후 진입하는 메인 화면(대시보드 및 각 기능 페이지)의 공통 레이아웃을 정의한다.
상단 **헤더**, 좌측 **사이드바**, 그리고 중앙의 **메인 뷰어(Content Area)**로 구성된다.

## 2. 기술 스택

- **HTML5**
- **CSS3**: Bootstrap 5 (CDN), Custom CSS (css/layout.css)
- **JavaScript**: Vanilla JS (js/sidebar.js, js/common.js)
- **Icons**: Bootstrap Icons (CDN)

## 3. 레이아웃 구조

화면은 크게 세 가지 영역으로 분할된다.

1. **Header (Navbar)**: 상단 고정 네비게이션 바.
2. **Sidebar**: 좌측 고정 메뉴 바 (250px).
3. **Content Area (Viewer)**: 우측 가변 컨텐츠 영역.

---

### 3.1 Header (Top Navigation)

- **위치**: 상단 고정 (`sticky-top`).
- **스타일**: Dark Theme (`bg-dark`, `text-white`), 하단 경계선 (`border-bottom`).
- **구성 요소**:
  - **좌측**: 로고 아이콘 + 서비스 명 ("Deploy System"). 클릭 시 대시보드로 이동.
  - **우측**: 사용자 정보 표시 및 로그아웃 버튼.
    - 예: "Admin (김관리)" 텍스트 + "Logout" 버튼 (Outline 스타일).

### 3.2 Sidebar (Navigation)

- **위치**: 좌측 고정, 세로형 배치.
- **크기**: 너비 고정 250px, 최소 높이 100vh.
- **스타일**: Dark Theme (`#212529`), 메뉴 구분선(`hr`) 포함.
- **구현 방식**: `js/sidebar.js`를 통해 동적으로 DOM에 주입 (모든 페이지 공통 적용).
- **메뉴 구조**:
  - **Monitoring**:
    - Dashboard (대시보드)
  - **Management**:
    - Agents (에이전트 목록)
    - Agent Group (에이전트 그룹 관리)
    - Action History (이력 조회)
  - **System**:
    - Members (사용자 관리)
    - Setting (설정 - *Admin 권한 전용*)
- **기능**:
  - 현재 보고 있는 페이지에 해당하는 메뉴 자동 하이라이트 (Active 상태).

### 3.3 Main Content Area (Viewer)

- **위치**: 사이드바 우측, 나머지 공간 모두 차지 (`flex-grow: 1`).
- **스타일**: 밝은 회색 배경 (`#f8f9fa`), 내부 Padding (30px).
- **역할**: 각 페이지별 핵심 컨텐츠(대시보드 카드, 데이터 테이블, 입력 폼 등)가 렌더링되는 영역.

---

## 4. 주요 파일 및 역할

- **`dashboard.html`**: 레이아웃 구현의 기준이 되는 파일.
- **`css/layout.css`**: 공통 레이아웃, 사이드바, 카드 호버 효과 등 스타일 정의.
- **`js/sidebar.js`**:
  - 사이드바 HTML 템플릿 정의.
  - `loadSidebar()`: `<div id="sidebar-container">` 영역에 메뉴 렌더링.
  - `highlightActiveLink()`: URL 기반 메뉴 활성화 처리.
- **`js/common.js`**: 공통 모달(알림, 확인) 및 유틸리티 함수.

## 5. UI 가이드라인

- **반응형**: Bootstrap Grid 시스템을 활용하되, 사이드바는 데스크탑 기준 고정형으로 설계.
- **일관성**: 모든 서브 페이지는 동일한 Header와 Sidebar 구조를 유지해야 함.
