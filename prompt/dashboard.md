# 대시보드 화면 (Dashboard) 개발 요구사항

## 1. 개요

관리자 시스템의 메인 홈 화면으로, 전체 에이전트의 상태 요약과 최근 이력을 한눈에 파악할 수 있는 기능을 제공한다.

## 2. 접근 경로

- **URI**: `./dashboard.html`
- **사이드바 메뉴**: `Monitoring` > `Dashboard`
  - **아이콘**: `<i class="bi bi-speedometer2"></i>`
  - **링크**: `js/sidebar.js`에서 정의됨.

## 3. 화면 구성

대시보드는 크게 두 가지 섹션으로 구성된다.

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

### 3.2. 에이전트 목록 (Agent List)

- **위치**: 대시보드 중단 (History 위)
- **구성 요소**:
  - **Header**: "Agent List"
  - **테이블**:
    - **Name**: 에이전트 호스트명 (예: Pay-WAS-01), 서버 타입 배지 (DEV, STG, PROD)
    - **Group**: 에이전트 그룹 (PD, SO 등). 배지 형태.
    - **Status**: 상태 배지 (RUNNING, STOPPED, STOPPING, STARTING)
    - **IP Address**: IP 주소 및 포트
    - **Last Update**: 마지막 통신 시간 YYYY-MM-DD HH:MM
    - **Action**: 콘솔 이동 버튼 (Terminal Icon) - `agent-details.html`로 이동

### 3.3. 최근 에이전트 이력 (Agent Action History)

- **위치**: 대시보드 하단
- **구성 요소**:
  - **Header**: "Agent Action History"
  - **테이블**: Recent 5개 이력 표시
    - **Name**: 에이전트 호스트명 + 서버 타입 배지 (DEV, STG, PROD)
    - **Group**: 에이전트 그룹 (배지)
    - **Action**: 수행 동작 (START, STOP, RESTART)
    - **Result**: 성공/실패 여부 (아이콘 + 텍스트)
    - **IP Address**: IP 주소 및 포트
    - **Time**: 수행 시간 YYYY-MM-DD HH:MM:SS
    - **User**: 수행자 이름
