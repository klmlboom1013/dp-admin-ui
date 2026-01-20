# 이력 조회 화면 (Action History) 개발 요구사항

## 1. 개요

에이전트 제어(Start, Stop, Restart) 및 상태 변경에 대한 모든 작업 이력을 조회하는 화면이다.
사용자는 다양한 조건(에이전트명, IP, 결과 등)으로 이력을 검색할 수 있으며, 각 작업에 대한 상세 로그를 모달로 확인할 수 있다.

## 2. 접근 경로

- **URI**: `./history.html`
- **사이드바 메뉴**: `History` > `Action History`
- **아이콘**: `<i class="bi bi-clock-history"></i>`

## 3. 화면 구성

### 3.1 검색 필터 (Search Filter)

카드 형태의 컨테이너에 배치된 검색 폼이다.

- **필드 구성**:
  1. **Agent Name**: 텍스트 입력 (부분 일치).
  2. **Server Type**: Select Box (ALL, DEV, STG, PROD).
     - **Name** 컬럼에 포함된 Server Type 배지 텍스트로 필터링한다.
  3. **Group (Admin Only)**: Select Box (ALL, PD, SO, QA, OP, COMMON).
     - **[권한 제어]**: **Admin 계정**만 이 필드를 볼 수 있으며, 다른 그룹을 선택하여 검색할 수 있다.
     - **일반 User**: 이 필드는 숨겨지며(`display: none`), 본인 그룹의 이력만 조회된다.
  4. **IP Address**: 텍스트 입력 (부분 일치).
  5. **User Name**: 작업을 수행한 사용자명 검색.
  6. **Action**: Select Box (ALL, START, STOP, RESTART).
  7. **Result**: Select Box (ALL, SUCCESS, FAILED, PROCESSING).
  8. **Time Range**: 시작일(Date) ~ 종료일(Date) 선택.

- **Action Buttons**:
  - `Reset`: 초기화 버튼.
  - `Search`: 검색 실행 버튼.

### 3.2 이력 리스트 테이블 (History List)

검색 결과가 표시되는 테이블이다.

- **컬럼 구성**:
  1. **Name**: 에이전트 호스트명 + Server Type 배지 (DEV, STG, PROD) (Bold 처리).
  2. **Group**: 소속 그룹 뱃지 (예: PD, SO).
  3. **IP Address**: IP:Port.
  4. **Action**: 수행한 작업 종류 뱃지.
     - `START` (Green), `STOP` (Red), `RESTART` (Yellow).
  5. **Result**: 작업 결과 텍스트 + 아이콘.
     - `Success` (Green Check), `Failed` (Red X), `Processing` (Yellow Spinner).
  6. **Time**: 작업 일시 (YYYY-MM-DD HH:mm:ss).
  7. **User**: 작업을 수행한 사용자명.
  8. **Details**: 로그 확인 버튼 (`View Log`).

### 3.3 상세 로그 모달 (Log Viewer Modal)

- **Trigger**: 리스트의 `View Log` 버튼 클릭 시 호출.
- **Header**: `[Action] AgentName (IP)` 형식의 타이틀 표시.
- **Content**:
  - 검은색 배경(`bg-black`)에 녹색 글씨(`text-success`)로 터미널 스타일 연출.
  - `generateMockLog(action, time, name, ip)` 함수를 통해 작업 유형별 가상의 로그 데이터를 생성하여 표시한다.
  - **로그 유형**:
    - **START/RESTART**: 프로세스 중지, 설정 로드, 포트 바인딩, 헬스 체크 성공 과정.
    - **STOP**: 연결 종료(Draining), 프로세스 종료 과정.
    - **HEALTH_CHECK**: CPU, 메모리, 디스크 상태 점검 로그.

## 4. 데이터 및 권한 로직

### 4.1 초기 데이터 및 mock

- **Mock Data**: HTML에 하드코딩된 테이블 행(tr)을 사용한다.
- **데이터 필터링**: 클라이언트 사이드 스크립트(`filterHistory`)에서 DOM 요소를 숨기거나 표시하는 방식으로 구현한다.

### 4.2 사용자 권한 (User Context)

- **Admin**:
  - **Group 필터**: 표시됨.
  - **데이터 범위**: 전체 그룹의 이력을 조회 및 검색 가능하다.
- **General User**:
  - **Group 필터**: 숨겨짐 (CSS `display: none`).
  - **데이터 범위**: 본인이 소속된 그룹의 에이전트 이력만 표시되어야 한다.
  - *헤더의 Global Simulator 변경에 따라 즉시 반영됨.*
