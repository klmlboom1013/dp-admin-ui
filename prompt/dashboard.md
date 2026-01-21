# 대시보드 화면 (Dashboard) 개발 요구사항

## 1. 개요

관리자 시스템의 메인 홈 화면으로, 전체 에이전트의 상태 요약과 최근 이력을 한눈에 파악할 수 있는 기능을 제공한다.

## 2. 접근 경로

- **URI**: `./dashboard.html`
- **사이드바 메뉴**: `Monitoring` > `Dashboard`
  - **아이콘**: `<i class="bi bi-speedometer2"></i>`
  - **링크**: `js/sidebar.js`에서 정의됨.

## 3. 화면 구성

대시보드는 크게 세 가지 섹션(Agent Group, Agents, Action History)으로 구성되며, 설정에 따라 노출 여부와 순서가 변경된다.

### 3.1 상태 요약 카드 (Summary Cards)

상단에 위치하며, 전체 에이전트의 운영 현황을 색상과 숫자로 직관적으로 표시한다.
총 4개의 카드가 가로로 배치된다.

| 카드 명칭 | 색상 (Bootstrap Class) | 의미 |
| :--- | :--- | :--- |
| **Total Agents** | Blue (`bg-primary`) | 전체 등록된 에이전트 수 |
| **Running** | Green (`bg-success`) | 현재 정상 실행 중인 에이전트 수 |
| **Stopped** | Red (`bg-danger`) | 정지된 에이전트 수 |
| **In Progress** | Yellow (`bg-warning`) | 시작/정지/재시작/배포 등 상태 변경이 진행 중인 수 |

- **디자인 상세**:
  - 각 카드는 `text-white`, `shadow-sm` 스타일 적용.
  - 숫자는 `fs-2` (Font Size 2)로 강조.

### 3.2. 에이전트 그룹 (Agent Group)

- **위치**: Agent List 상단 (Default Order 1)
- **구성 요소**:
  - **Header**: "Agent Group"
  - **테이블**:
    - **Name**: 그룹 이름 (클릭 시 `agent-group-details.html`로 이동)
    - **Group**: 그룹 코드 (Badge)
    - **Description**: 그룹 설명
    - **Agent Count**: 소속 에이전트 수
- **기능**:
  - 설정을 통해 표시 개수(Count) 제한 가능.
  - 클릭 시 해당 그룹 상세 페이지로 이동.

### 3.3. 에이전트 목록 (Agents)

- **위치**: 대시보드 중단 (History 위)
- **구성 요소**:
  - **Header**: "Agents"
  - **테이블**:
    - **Name**: 에이전트 호스트명 (예: Pay-WAS-01), 서버 타입 배지 (DEV, STG, PROD)
    - **Group**: 에이전트 그룹 (PD, SO 등). 배지 형태.
    - **Status**: 상태 배지 (RUNNING, STOPPED, STOPPING, STARTING)
    - **IP Address**: IP 주소 및 포트
    - **Last Update**: 마지막 통신 시간 YYYY-MM-DD HH:MM
    - **Action**: 콘솔 이동 버튼 (Terminal Icon) - `agent-details.html`로 이동

### 3.4. 최근 에이전트 이력 (Action History)

- **위치**: 대시보드 하단
- **구성 요소**:
  - **Header**: "Action History"
  - **테이블**: Recent 5개 이력 표시
    - **Name**: 에이전트 호스트명 + 서버 타입 배지 (DEV, STG, PROD)
    - **Group**: 에이전트 그룹 (배지)
    - **Action**: 수행 동작 (START, STOP, RESTART)
    - **Result**: 성공/실패 여부 (아이콘 + 텍스트)
    - **IP Address**: IP 주소 및 포트
    - **Time**: 수행 시간 YYYY-MM-DD HH:MM:SS
    - **User**: 수행자 이름

## 4. 대시보드 표시 설정 (Display Options)

`settings.html`에서 설정한 값(`dp_admin_dashboard_options`)에 따라 대시보드 레이아웃이 동적으로 변경된다.

- **표시 여부 (Show)**: 각 섹션(Agent Group, Agents, Action History)의 노출 여부 제어.
- **개수 제한 (Count)**: 테이블에 표시되는 행(Row)의 최대 개수 제어 (더보기 없이 잘림).
- **순서 (Order)**: 섹션 간의 상하 배치 순서 제어.

## 5. 레이아웃 특이사항

- **스크롤바 제어**: `body`의 높이를 `100vh`로 고정하고 `overflow: hidden`을 적용하여, 컨텐츠 영역 내부에서만 스크롤이 발생하도록 제한한다. (이중 스크롤바 방지)
