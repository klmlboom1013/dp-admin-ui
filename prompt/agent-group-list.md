# 에이전트 그룹 관리 화면 (Agent Group List) 개발 요구사항

## 1. 개요

논리적으로 에이전트를 그룹핑하여 관리(조회, 생성, 삭제)하는 리스트 화면이다.
사용자는 이름으로 그룹을 검색하거나, 특정 그룹을 선택하여 상세 관리 화면으로 이동할 수 있다.

## 2. 접근 경로

- **URI**: `./agent-group-list.html`
- **사이드바 메뉴**: `Management` > `Agent Group`

## 3. 화면 구성

### 3.1 헤더 및 기능 영역

- **Title**: `<i class="bi bi-collection"></i> Agent Group`
- **Agent 그룹 생성 버튼**: 우측 상단 `btn-primary`. 클릭 시 `agent-group-details.html` (신규 생성 모드)로 이동.
- **검색 및 필터 (Filter Section)**:
  - **Layout**: "FILTER BY" 타이틀이 있는 카드 형태(`card shadow-sm`)의 섹션.
  - **Group Name 검색**:
    - Label: `Group Name`
    - Input: 텍스트 입력 필드 (`id="groupSearchInput"`).
    - 동작: `Enter` 키 입력 시 검색 실행.
  - **Group 필터 (Admin Only)**:
    - Label: `Group (Admin Only)`
    - Select Box: 그룹 코드(`PD`, `SO` 등) 선택 (`id="filterGroup"`).
    - 표시 조건: `currentUser.level === 'Admin'` 일 때만 표시됨.
    - 동작: 옵션 변경 시 즉시 필터링 실행 (`onchange`).
  - **컨트롤 버튼 (우측 정렬)**:
    - **Reset**: `<i class="bi bi-arrow-counterclockwise"></i> Reset` 버튼. 클릭 시 입력값 초기화 및 전체 목록 표시 (`resetFilter()`).
    - **Search**: `<i class="bi bi-search"></i> Search` 버튼. 클릭 시 필터링 실행 (`filterGroups()`).

### 3.2 그룹 리스트 테이블

카드형 컨테이너(`card shadow-sm`) 내부에 테이블을 배치한다.

- **컬럼 구성**:
  1. **Group Name**: 그룹 식별 명칭 (예: Payment-Group). 굵은 글씨 강조.
  2. **Group**: 그룹 코드 뱃지 (예: `PD`, `SO`). (`badge rounded-pill text-bg-secondary`)
  3. **Description**: 그룹 설명 (예: Payment Related Agents).
  4. **Agent Count**: 그룹에 소속된 에이전트 수 뱃지 (예: `4 Agents`). (`badge bg-primary`)
  5. **Actions**: 관리 동작 버튼. (우측 정렬)

- **행(Row) 인터랙션**:
  - `cursor: pointer` 스타일 적용.
  - **클릭 시**: 상세 화면 `agent-group-details.html?id=...`로 이동.

- **Action 버튼**:
  - **Delete Group**: 휴지통 아이콘 버튼 (`btn-outline-danger`).
    - 클릭 시 `event.stopPropagation()`으로 행 클릭 이벤트 방지.
    - **Confirm 모달**: "정말 그룹을 삭제하시겠습니까?" (삭제 시 에이전트는 삭제되지 않음 명시).
    - **삭제 처리**: 확인 시 해당 행(Row)을 DOM에서 제거하고 성공 Toast 메시지 출력.

## 4. 데이터 로직 (Mock)

- **초기 데이터**: HTML에 하드코딩된 예제 데이터 (G-001 Payment-Group, G-002 Order-Group).
- **리스트 표시 권한 (필터링)**:
  - **일반 User**: 로그인한 계정의 **그룹(Group)**과 일치하는 Agent Group 만 리스트에 표시한다.
  - **Admin**: 권한 제어 없이 **전체 Agent Group 리스트**를 표시한다.
- **검색 로직 (filterGroups)**:
  - **조건 결합**: `Group Name` 입력값(부분 일치) AND `Group` 선택값(정확 일치) 조건을 모두 만족하는 행만 표시.
  - **공백 처리**: 텍스트 비교 시 `.trim()`을 사용하여 공백으로 인한 매칭 오류를 방지.
- **초기화 로직 (resetFilter)**:
  - 검색 입력창과 그룹 선택 박스의 값을 공백(`''`)으로 초기화.
  - 필터링 함수를 재호출하여 전체 목록을 다시 표시.

## 5. UI 가이드라인

- **반응형**: 기본 Bootstrap 테이블 스타일 (`table-hover`).
- **일관성**: 헤더, 사이드바는 공통 `history.js`, `sidebar.js`를 사용.
