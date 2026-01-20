# 시스템 설정 화면 (System Settings) 개발 요구사항

## 1. 개요

시스템 전반의 공통 코드(사용자 등급, 소속, 그룹)와 등급별 접근/실행 권한을 통합 관리하는 화면이다.
**Admin(최고 관리자) 계정**만 접근 가능하며, 설정된 데이터는 `localStorage`에 영구 저장되어 시스템 전체에 반영된다.
(단, 개발 시에는 Global Simulator를 통해 Admin 권한으로 전환하여 접근 테스트 가능)

## 2. 접근 경로

- **URI**: `./settings.html`
- **사이드바 메뉴**: `Setting`
- **아이콘**: `<i class="bi bi-gear-fill"></i>`

## 3. 화면 구성 및 탭(Tab) 구조

3개의 탭으로 구성되어 있다.

### 3.1 메뉴 접근 권한 (Menu Permissions)

각 사용자 등급(Level)별로 접근 가능한 메뉴를 Checkbox로 설정한다.

- **테이블 컬럼**:
  - `Level (등급)`: 행 헤더.
  - `Dashboard`, `Agents`, `Agent Group`, `Action History`, `Members`: 각 메뉴별 접근 허용 여부.
- **System Reserved**:
  - **Admin**: 모든 메뉴 접근권한이 `True`로 고정되며 수정 불가(Disabled).
- **저장**: [변경사항 저장] 버튼 클릭 시 `dp_admin_menu_perms` 키로 로컬 스토리지에 저장.

### 3.2 Agent 실행 권한 (Agent Permissions)

각 사용자 등급(Level)별로 에이전트 제어 및 조회 권한을 설정한다.

- **테이블 컬럼**:
  - `View (조회)`: 목록 조회 가능 여부.
  - `Edit (수정)`: 설정 수정 가능 여부.
  - `Action (시작/중지)`: Start/Stop/Restart 제어 가능 여부.
  - `Bulk Action (일괄실행)`: 일괄 제어 기능 사용 가능 여부.
  - `PROD Action`: **운영계(PROD)** 서버에 대한 제어 권한 여부. (위험/중요)
- **저장**: [변경사항 저장] 버튼 클릭 시 `dp_admin_agent_perms` 키로 로컬 스토리지에 저장.

### 3.3 회원 정보 옵션 (User Info Options)

사용자 관리(User Form/List)에서 사용되는 공통 코드를 관리한다. (동적 추가/삭제)

- **구성 요소 (3개 카드)**:
  1. **사용자 등급 (Level) 관리**: 예) Admin, Master, Content, Report 등.
      - *Level 추가 시 권한 설정 탭에도 자동으로 행이 추가됨.*
  2. **소속 (Department) 관리**: 예) Tech1실, Tech2실 등.
  3. **계정 그룹 (Group) 관리**: 예) PD, SO, QA 등.
- **기능**:
  - **추가**: 버튼 클릭 -> Prompt 입력 -> 리스트 추가.
  - **삭제**: 리스트 아이템 우측 [x] 버튼 -> Confirm -> 삭제. (단, `Admin` 등급은 삭제 불가)
- **데이터 Sync**: 변경 즉시 `dp_admin_options` 키로 로컬 스토리지에 저장 및 반영.

## 4. 데이터 로직 (Settings Logic)

`js/settings.js`를 통해 로컬 스토리지 기반으로 동작한다.

### 4.1 스토리지 키 (Storage Keys)

- `dp_admin_menu_perms`: 메뉴 접근 권한 객체.
- `dp_admin_agent_perms`: 에이전트 제어 권한 객체.
- `dp_admin_options`: 공통 코드(Levels, Depts, Groups) 배열 객체.

### 4.2 기본값 (Defaults) - 초기 구동 시 로드

| 등급 | Menu Perms | Agent Perms |
| :--- | :--- | :--- |
| **Admin** | All(O) | All(O) |
| **Master** | All(O) | PROD제외 All(O) |
| **Content**| User/Group(X) | View/Action(O), Edit/Bulk/PROD(X) |
| **Report** | User/Group(X) | View(O), 나머지(X) |

### 4.3 마이그레이션 로직

- **TopAdmin -> Admin**: 기존 `TopAdmin` 데이터를 `Admin`으로 자동 이관 및 명칭 변경.
- **Admin Group 제거**: `Group` 옵션에 `Admin`이 포함되어 있을 경우 시스템 예약어 보호를 위해 자동 제거.
