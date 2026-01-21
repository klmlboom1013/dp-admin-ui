# 에이전트 그룹 상세/관리 화면 (Agent Group Details) 개발 요구사항

## 1. 개요

선택한 에이전트 그룹의 메타 정보를 수정하고, 해당 그룹에 소속된 에이전트들을 관리(추가/삭제)하며, 그룹 단위의 일괄 제어(Bulk Action) 기능을 제공하는 화면이다.

## 2. 접근 경로

- **URI**: `./agent-group-details.html`
- **진입점**:
  1. `agent-group-list.html`에서 그룹 클릭 (상세 조회/수정 모드).
  2. `agent-group-list.html`에서 [그룹 생성] 버튼 클릭 (신규 생성 모드).
- **파라미터**: `id` (그룹 ID), `name` (그룹명), `desc` (설명) 등.

## 3. 화면 구성

### 3.1 헤더 영역

- **Title**: Agent Group Details
- **목록으로 버튼**: `agent-group-list.html`로 이동.
- **Simulator (User Context)**: `js/header.js`에 의해 헤더 우측에 표시됨 (Admin, Master, Report 전환).

### 3.2 그룹 정보 (Group Info) Card

- **상태 모드 (View vs Edit)**:
  - **View Mode**: 모든 필드 Disabled. [Edit] 버튼 표시.
  - **Edit Mode**: 필드 활성화. [Save], [Cancel] 버튼 표시. 신규 생성 시 기본적으로 Edit Mode로 시작.
- **필드 구성**:
  - **Group Name**: 텍스트 입력.
  - **Owner Group**:
    - **Admin**: 전체 그룹 목록(`mockGroups`) 중 선택 가능한 Select Box. (신규 생성 시에도 선택 가능)
    - **User**: 본인이 속한 그룹(`currentUser.group`)이 Read-only로 표시됨. (신규 생성 시 자동 할당되며 수정 불가)
  - **Description**: 상세 설명 입력.

### 3.3 소속 에이전트 목록 (Attached Agents)

- **헤더**: [Agent 추가] 버튼 (Edit Mode에서만 표시).
- **테이블 구성**:
  - **Checkbox**: 일괄 선택용. Transient Status(STARTING/STOPPING)인 경우 Disabled.
  - **Name**: 에이전트 명.
  - **Group**: 소속 그룹 뱃지.
  - **IP Address**: IP 주소.
  - **Status**: 상태 뱃지.
  - **Last Update**: 마지막 통신 시간 (YYYY-MM-DD HH:MM).
  - **Actions**:
    - **Console**: `agent-details.html`로 이동 (`from=group` 파라미터 포함).
    - **Edit**: `agent-form.html`로 이동.
    - **Remove**: 그룹에서 제외 (삭제 아님). Edit Mode에서만 활성화.

### 3.4 일괄 제어 툴바 (Bulk Action Toolbar)

- **표시 조건**: 에이전트 목록에서 1개 이상의 행을 선택할 경우 하단에 Floating Bar 형태로 표시.
- **Execution Mode**:
  - **순차 (Sequential)**: 에이전트를 하나씩 순차적으로 제어 (딜레이 적용).
  - **동시 (Parallel)**: 모든 에이전트에 동시 명령 전송.
- **Action Buttons**: Start, Stop, Restart.

### 3.5 모달 (Modals)

- **Agent 추가 모달**:
  - 추가 가능한 에이전트 목록을 체크박스 리스트로 제공.
  - **[필수]** 목록 필터링 조건:
    - **일반 User**: 본인의 **계정 그룹**과 동일한 Agent만 표시.
    - **Admin**: **현재 선택된 Owner Group**에 해당하는 Agent만 표시. (Owner Group 변경 시 리스트도 변경되어야 함)
- **Confirm 모달**: 그룹 삭제, 에이전트 제외, Bulk Action 실행 전 확인.
- **PROD Safety Modal**: Bulk Action 대상 중 **PROD** 서버가 포함된 경우, 안전 확인 텍스트 입력 요구.

## 4. 주요 기능 및 로직

### 4.1 다중 선택 제약 사항 (Multi-select Logic)

- **상태 일치 제약**: 서로 다른 상태(Status)를 가진 에이전트는 동시에 선택할 수 없다. (예: RUNNING과 STOPPED 혼합 선택 불가)
- **불가 상태**: STARTING, STOPPING (중간 상태)인 에이전트는 선택 및 제어 불가 (Checkbox Disabled).

### 4.2 Mock Data & Simulation

- **권한 시뮬레이션**: 헤더의 Global Simulator 변경 시 `currentUser` 정보가 갱신되며, 상세 화면의 조회 권한 및 편집 가능 여부가 즉시 반영된다.
- **Processing State**: 일괄 제어 실행 중에는 모든 버튼(Edit, 목록 체크박스 등)을 비활성화(`disabled`) 처리.

### 4.3 데이터 로직

- **신규 생성**: URL 파라미터 없이 진입 시 `isNewGroup = true`. 빈 폼 + Edit Mode로 시작.
- **저장/취소**: Mock 데이터 로직으로 처리하며, 실제 저장되지 않으므로 Toast 메시지로 피드백 제공.
