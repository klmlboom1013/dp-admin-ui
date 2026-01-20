# 에이전트 상세/제어 화면 (Agent Console) 개발 요구사항

## 1. 개요

선택한 에이전트의 상세 정보를 확인하고, 서비스를 직접 제어(Start/Stop/Restart)하며, 실시간 로그를 모니터링하는 콘솔 화면이다.

## 2. 접근 경로

- **URI**: `./agent-details.html`
- **진입점**: `agent-list.html` 테이블의 **Action** 컬럼 내 `Console` 버튼 클릭.
- **파라미터**: `id`, `name`, `ip`, `port`, `serverType` 등을 쿼리 스트링으로 전달받음.

## 3. 화면 구성

### 3.1 헤더 영역 (Top Bar)

- **Go Back 버튼**: 좌측 화살표 아이콘. 목록 화면(`agent-list.html`)으로 복귀. `from=group` 파라미터가 있을 경우 그룹 상세 화면으로 이동.
- **Agent Info**:
  - **이름**: 에이전트 명 (예: Pay-WAS-01).
  - **Server Type 뱃지**: 이름 옆에 표시 (DEV: Gray, STG: Green, PROD: Blue).
  - **IP/Port**: 하단에 작게 표시 (예: 192.168.0.10:8080).
- **Status Badge**: 우측 상단에 현재 상태 표시 (Running, Stopped 등).
- **설정 수정 버튼**: 우측 상단 `설정 수정` 버튼 클릭 시 `agent-form.html`로 이동 (현재 에이전트 정보를 쿼리 파라미터로 전달).

### 3.2 제어 패널 (Control Panel) Card

좌측 하단에 위치하며 서비스 제어 기능을 제공한다.

- **Service Control**:
  - **Start (구동)**: `btn-success`. 실행되지 않은 상태일 때 활성화.
  - **Stop (중지)**: `btn-danger`. 실행 중일 때 활성화.
  - **Restart (재기동)**: `btn-warning`. 실행 중일 때 활성화.
- **Health Check & Status**:
  - **Actuator Health**: 헬스 체크 URL 표시 (예: `.../actuator/health`).
  - **Status Badge**: HTTP 상태 코드 표시 (예: `UP (200 OK)`).

### 3.3 로그 콘솔 (Real-time Log Viewer) Card

하단 전체 영역을 차지하며 실시간 로그를 표시한다.

- **Header**:
  - 제목: "Real-time Log Viewer"
  - 로그 경로: 파일 경로 표시 (예: `/usr/local/tomcat/logs/catalina.out`).
  - **Clear 버튼**: 로그 화면 초기화.
  - **Auto Scroll 스위치**: 새로운 로그 추가 시 자동 최하단 스크롤 여부 제어.
- **Console Body**:
  - 검은 배경에 텍스트가 흐르는 터미널 스타일.
  - 로그 레벨별 색상 구분 (INFO: White/Gray, WARN: Yellow, ERROR: Red).

## 4. 주요 기능 및 로직

### 4.1 서비스 제어 로직 (Service Actions)

- **액션 실행 흐름**:
  1. 버튼 클릭 시 `handleAction('ACTION_NAME')` 호출.
  2. **Safety Check**:
     - **PROD 환경**: `serverType === 'PROD'`일 경우, 안전 확인 모달(`showProdSafetyConfirm`) 호출. "PROD" 텍스트 입력 후 확인 시에만 실행.
     - **그 외 환경**: `Stop` 및 `Restart` 액션 시 일반 Confirm 모달 호출.
  3. **명령 전송 시뮬레이션 (`sendCommand`)**:
     - 로그 콘솔에 "Command initiated..." 로그 출력.
     - `setTimeout`을 사용하여 단계별 로그 출력 (실행 -> PID 생성 -> 완료).

### 4.2 로그 시뮬레이션

- **초기 로드**: 페이지 진입 시 Connection Pool 초기화 등의 더미 로그 출력.
- **주기적 로그**: `setInterval`을 사용하여 랜덤한 Health Check, Connection Timeout 로그 등을 생성하여 실제 운영 중인 느낌을 줌.

### 4.3 수정 화면 연동

- [설정 수정] 버튼 클릭 시 현재 보고 있는 에이전트의 모든 정보를 쿼리 스트링(`?id=...&name=...&ip=...&serverType=...`)으로 구성하여 `agent-form.html`로 전달.
