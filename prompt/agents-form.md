# 에이전트 등록/수정 화면 (Agent Form) 개발 요구사항

## 1. 개요

신규 에이전트를 등록하거나 기존 에이전트의 정보를 수정하는 입력 폼 페이지이다.
사용자의 권한(Admin vs 일반 사용자)에 따라 일부 필드(Owner Group)의 입력 방식이 달라진다.

## 2. 접근 경로

- **URI**: `./agent-form.html`
- **진입점**:
  - **신규 등록**: `agent-list.html` > 우측 상단 `신규 Agent 등록` 버튼.
  - **수정**: `agent-list.html` > 각 행의 Action `Edit` 버튼 (쿼리 스트링으로 데이터 전달).

## 3. 화면 구성

### 3.1 헤더 영역

- **Go Back 버튼**: 좌측 화살표 아이콘(`<i class="bi bi-arrow-left">`) 클릭 시 이전 목록 페이지로 이동.
- **Title**:
  - 기본: "Agent Registration"
  - 수정 모드 시: "Agent 수정" (URL에 `name` 파라미터 존재 시 자동 변경).

### 3.2 입력 폼 (Form Fields)

입력 항목은 크게 3가지 섹션으로 구분된다.

#### 3.2.1 기본 정보 (Basic Info)

- **Agent Name** `(Required)`: 에이전트 식별명 (예: Pay-WAS-01).
- **Owner Group** `(Required)`: 에이전트 소속 그룹.
  - **Admin 권한**: `Select Box`로 전체 그룹 중 선택 가능 (`mockGroups` 활용).
  - **Non-Admin 권한**: 로그인한 사용자의 그룹으로 고정되며 `Read-only` 처리됨.
- **Description**: 서비스 용도 설명.
- **Host IP** `(Required)`: 서버 IP 주소 (예: 192.168.0.1).
- **Server Type**: 서버 환경 (DEV / STG / PROD).
- **Service Port**: 서비스 포트 번호 (예: 8080).

#### 3.2.2 스크립트 설정 (Commands)

- **구동 스크립트 경로 (Start Script)** `(Required)`
  - 시작 명령을 수행할 쉘 스크립트 절대 경로.
  - 예: `/usr/local/server/bin/start.sh`
- **중지 스크립트 경로 (Stop Script)** `(Required)`
  - 중지 명령을 수행할 쉘 스크립트 절대 경로.
  - 예: `/usr/local/server/bin/stop.sh`

#### 3.2.3 모니터링 설정 (Monitoring)

- **로그 파일 경로 (Log File Path)** `(Required)`
  - 모니터링 대상 메인 로그 파일의 절대 경로.
  - 예: `/usr/local/server/logs/catalina.out`
- **Health Check Actuator URL**
  - 상태 체크를 위한 API URL.
  - 예: `http://localhost:8080/actuator/health`

### 3.3 하단 액션 버튼

- **취소**: `agent-list.html`로 이동.
- **저장**: 폼 제출 (현재는 `preventDeafult` 후 목록으로 이동 처리).

## 4. 주요 기능 및 로직

### 4.1 사용자 권한 시뮬레이션 (User Context Simulator)

- **Top Navbar**에 위치한 `Simulator` 셀렉터를 통해 로그인한 사용자의 권한을 변경 테스트 가능.
- **Admin (Admin)**: 모든 그룹 선택 가능.
- **User (Master/Content/Report)**: 본인 소속 그룹으로 Owner Group 고정 (수정 불가).

### 4.2 수정 모드 (Edit Mode)

- URL 쿼리 파라미터(`name`, `desc`, `ip`, `port`, `serverType`, `group`)를 통해 데이터를 전달받음.
- 페이지 로드 시 해당 파라미터 값이 폼 필드에 자동으로 바인딩됨.
- `from=group` 파라미터 존재 시 뒤로가기 버튼 동작이 브라우저 히스토리 기반으로 변경됨.

## 5. 데이터 연동 (Mock)

- **Groups**: PD, SO, QA, OP, Common (하드코딩된 Mock 데이터).
- **Users**: Admin(System), Master(PD), Report(SO) 등 역할별 사용자 정의.
