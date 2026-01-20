# 에이전트 관리 화면 (Agents Management) 개발 요구사항

## 1. 개요

등록된 모든 에이전트의 목록을 조회하고, 검색(필터링) 및 상태 제어(Start/Stop/Restart)를 수행하는 핵심 관리 페이지이다.

## 2. 접근 경로

- **URI**: `./agent-list.html`
- **사이드바 메뉴**: `Management` > `Agents`
  - **아이콘**: `<i class="bi bi-hdd-rack"></i>`

## 3. 화면 구성

### 3.1 헤더 & 신규 등록 버튼

- **타이틀**: "Agents" (아이콘 포함).
- **신규 등록 버튼**: 우측 상단 배치. `agent-form.html`로 이동.

### 3.2 검색 필터 (Advanced Search Filter)

복합 조건을 사용하여 에이전트를 검색할 수 있는 폼 제공.

- **필드 구성**:
  1. **Name**: 텍스트 입력 (예: Pay-WAS).
  2. **Server Type**: Select Box (ALL, DEV, STG, PROD).
  3. **IP Address**: 텍스트 입력 (부분 일치).
  4. **Group (Admin Only)**: Select Box (ALL, PD, SO).
      - *Admin 권한인 경우에만 표시됨.*
  5. **Status**: Select Box (ALL, RUNNING, STOPPED, STARTING, STOPPING).
  6. **Last Update Range**: 시작일(Date) ~ 종료일(Date).
- **기능**:
  - `Search` 버튼: 필터 적용 (클라이언트 사이드 필터링 구현).
  - `Reset` 버튼: 초기화.

### 3.3 에이전트 목록 테이블

- **컬럼 구성**:
  1. **Checkbox**: 다중 선택용 (Bulk Action).
  2. **Name**: 에이전트 명 + 서버 타입 뱃지(DEV/STG/PROD) + 설명(Description).
  3. **Group**: 소속 그룹 뱃지 (예: PD, SO).
  4. **IP Address**: IP:Port 형식.
  5. **Status**: 상태 뱃지 (Color Code 적용).
  6. **Last Update**: 마지막 상태 변경 시간.
  7. **Actions**: 개별 제어 버튼 그룹.
      - **Console**: 터미널 아이콘 (`agent-details.html` 이동).
      - **Edit**: 연필 아이콘 (`agent-form.html` 이동).
      - **Delete**: 휴지통 아이콘 (삭제 확인 모달 호출).

### 3.4 Bulk Action Toolbar (Floating)

- **노출 조건**: 테이블에서 1개 이상의 행(Row)을 선택했을 때 하단에 고정(`position-fixed`)되어 나타남.
- **구성 요소**:
  - **Selected Count**: 선택된 개수 표시.
  - **Execution Mode**:
    - **Sequential (순차)**: 하나씩 순차 실행 (기본값).
    - **Parallel (동시)**: 동시에 병렬 실행.
  - **Action Buttons**:
    - `Start` (Green), `Stop` (Red), `Restart` (Yellow).
  - **Close Button**: 선택 해제.

## 4. 주요 기능 및 로직

### 4.1 다중 선택 제약 사항 (Multi-select Logic)

- **상태 일치 제약**: 서로 다른 상태(Status)를 가진 에이전트는 동시에 선택할 수 없다.
  - 예: RUNNING 상태인 에이전트를 선택한 후, STOPPED 상태인 에이전트를 선택하려 하면 경고 모달 표시.
- **불가 상태**: STARTING, STOPPING (중간 상태)인 에이전트는 선택 및 제어 불가 (Checkbox Disabled).

### 4.2 안전 장치 (Safety Checks)

- **PROD 감지**: 선택된 에이전트 중 **PROD(운영)** 서버가 포함된 경우, 단순 확인창 대신 **안전 확인 모달(Safety Confirm Modal)**을 띄운다.
  - 사용자가 "PROD"라는 텍스트를 직접 입력해야 실행 버튼이 활성화됨.
- **일반 확인**: PROD가 없는 경우 일반 `showConfirm` 모달 사용.

### 4.3 UI/UX 디테일

- **Row Click**:
  - 기본 클릭: 해당 행의 체크박스 토글 (버튼/링크 클릭 제외).
  - **Ctrl + Click**: 다중 선택 (기존 선택 유지한 채 추가/해제).
  - **Shift + Click**: 범위 선택 (마지막 선택된 행부터 현재 행까지 일괄 선택).
- **Status Colors**:
  - RUNNING: Success (Green)
  - STOPPED: Danger (Red)
  - STARTING/STOPPING: Info/Warning (Blue/Yellow with Opacity)
- **Toast 알림**: 작업 수행 결과 및 오류 메시지는 우측 하단 Toast 메시지로 표시.

## 5. 데이터 연동 (Mock)

- **초기 로드**: Mock 데이터를 로드하여 테이블에 표시한다.
- **권한 처리 (Context)**: 헤더의 **Global Context Simulator** 값이 변경되면, `currentUser`를 갱신하고 테이블을 다시 렌더링하여 권한(필터, 버튼 등)을 적용해야 한다.
- **상태 관리**: 체크박스 선택 상태는 권한 변경 시 초기화된다.
- **Action Simulation**: 실제 서버 통신 대신 `setTimeout`을 사용하여 순차/병렬 실행을 시각적으로 시뮬레이션한다.
