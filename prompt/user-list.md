# 사용자 관리 화면 (User Members) 개발 요구사항

## 1. 개요

시스템에 등록된 사용자(Members) 목록을 조회하고, 상태 관리(가입 승인, 삭제) 및 정보 수정을 수행하는 화면이다.
사용자의 등급(Level)과 그룹(Group)에 따라 조회 범위와 제어 권한이 다르게 적용된다.

## 2. 접근 경로

- **URI**: `./user-list.html`
- **사이드바 메뉴**: `Members` (단, Context에 따라 메뉴명이나 접근 권한이 달라질 수 있음)
- **아이콘**: `<i class="bi bi-people-fill"></i>`

## 3. 화면 구성

### 3.1 헤더 및 Context 시뮬레이터

- **Title**: `<i class="bi bi-people-fill"></i> Members`
  - **[권한 제어]**: 헤더의 **Global Context Simulator** 설정에 따름. (`admin`, `master`, `user` 등)
    - `System Admin (Super)`: 전체 권한, 전체 목록 조회.
    - `홍길동 (Master/PD)`: 본인 그룹(`PD`) 관리자 권한.
- **초기 로드**: URL 파라미터 `id`를 기반으로 `users` 배열에서 데이터를 찾아 폼을 채운다.
- **권한 연동**: 헤더의 `Global Simulator` 변경 시 `currentUser`가 갱신되며, 이에 맞춰 UI(필드 활성화 여부 등)가 즉시 반응해야 한다.
- **예외 처리**: 잘못된 ID로 접근 시 Alert 표시 후 목록으로 리다이렉트.

### 3.2 검색 필터 (Filter By)

권한에 따라 노출되는 필드가 다른 카드 형태의 검색 섹션이다.

- **Layout**: "FILTER BY" 라벨이 있는 카드 컨테이너.
- **필드 구성**:
  1. **Name**: 텍스트 입력 (이름 또는 ID 검색).
  2. **Status**: Select Box (ALL, NORMAL, PENDING_SIGNUP, PENDING_DELETE).
  3. **Level**: Select Box (ALL, Admin, Master, Content, Report).
     - **[Admin Only]**: Admin 권한일 때만 표시됨.
  4. **Group**: Select Box (ALL, PD, SO, etc.).
     - **[Admin Only]**: Admin 권한일 때만 표시됨.

- **권한별 노출 로직 (Filter Visibility)**:
  - **Admin**: 전체 필드 표시 (Name, Status, Level, Group).
  - **Master**: `Name`, `Status`만 표시 (Level, Group 숨김).
  - **Content / Report**: 필터 섹션 전체 숨김 (`display: none`).

- **기능**:
  - `Search`: 입력된 조건과 현재 권한(Data Scope)을 AND 조합하여 테이블 필터링.
  - `Reset`: 입력값 초기화 및 전체 목록(권한 내) 재조회.

### 3.3 사용자 목록 테이블

- **컨테이너**: `card shadow-sm`.
- **컬럼 구성**:
  1. **이름 (Name)**: 사용자명 (Bold) + ID(이메일 형태, Text-muted).
  2. **소속 / 팀**: 부서명 (Dept) + 팀명 (Team).
  3. **직급**: Rank (예: 팀장, 매니저).
  4. **상태 (Status)**: 사용자 상태 뱃지. (상세 로직 후술)
  5. **계정 등급 (Level)**: `Admin`, `Master`, `Content`, `Report` 등급 뱃지.
  6. **계정 그룹 (Group)**: `PD`, `SO`, `QA` 등 소속 그룹 뱃지.
  7. **사용 만료일**: YYYY-MM-DD 포맷.
  8. **Actions**: 수정/삭제 버튼 그룹.

## 4. 권한 및 노출 로직 (Permissions)

사용자의 `Level`에 따라 테이블에 표시되는 데이터 범위와 가능한 액션이 엄격히 제어된다.

### 4.1 데이터 조회 범위 (Visibility)

- **Admin (System Admin)**: 전체 사용자 목록 조회.
- **Master (Group Admin)**: 본인과 **동일한 그룹(Group)**에 속한 사용자 목록 조회.
- **Content / Report (General User)**: **본인(Self)**의 정보만 조회.

### 4.2 상태 변경 및 배지 (Status Badge)

상태에 따라 표시되는 뱃지와 클릭 이벤트(Admin 전용)가 다르다.

| 상태 (Status) | 뱃지 스타일 | Admin 동작 (Click) | 비고 |
| :--- | :--- | :--- | :--- |
| **NORMAL** | `bg-success` (정상) | 없음 | 정상 활동 중인 계정 |
| **PENDING_SIGNUP** | `bg-warning` (가입대기) | **가입 승인 Confirm** -> `NORMAL`로 변경 | 클릭 시 커서 포인터 및 툴팁 제공 |
| **PENDING_DELETE** | `bg-danger` (삭제대기) | **삭제 승인 Confirm** -> 영구 삭제 | 클릭 시 커서 포인터 및 툴팁 제공 |

> **[Self Action] 삭제 요청 취소**:
> 본인의 상태가 `PENDING_DELETE`인 경우, 뱃지를 클릭하여 `NORMAL` 상태로 즉시 원복(취소)할 수 있다. (Confirm 모달 표시)

### 4.3 Action 버튼 권한 (Edit / Delete)

각 행(Row)의 우측 Action 버튼 활성화 조건:

1. **Admin**: 모든 사용자에 대해 수정/삭제 가능.
2. **Self**: 본인 계정은 언제나 수정/삭제(요청) 가능.
3. **Master**: 본인과 **동일한 그룹** 사용자에 대해 제어 가능.
4. **Content/Report**: 타인 계정 제어 불가 (본인만 가능).

*권한이 없는 경우 버튼이 `disabled` 처리되고 투명도가 낮아짐. 단, `PENDING_SIGNUP` 상태인 경우 **Edit 버튼은 숨김 처리**된다.*

### 4.4 삭제 프로세스 (Delete Logic)

삭제 버튼 클릭 시 사용자의 등급에 따라 동작이 갈린다.

- **Admin**:
  - 즉시 **영구 삭제** 확인 모달 표시.
  - 확인 시 리스트에서 즉시 제거 (`splice`).
- **Non-Admin (Master/Users)**:
  - **삭제 요청** 확인 모달 표시.
  - 확인 시 상태(Status)가 `PENDING_DELETE`로 변경됨 (관리자 승인 대기).

> **[PENDING_SIGNUP] 가입 요청 취소**:
> 상태가 `PENDING_SIGNUP`인 경우, Delete 버튼은 **즉시 삭제(가입 취소)** 기능으로 동작한다. (정보 영구 삭제 경고 모달 표시)

## 5. 데이터 연동 (Mock)

- `users` 배열을 사용하여 인메모리 데이터를 관리한다.
- `renderTable()` 함수가 `currentUser`의 권한을 확인하여 필터링된 목록을 다시 그린다.
- `handleStatusAction`, `handleDeleteClick` 등의 함수로 상태 변경과 삭제 로직을 시뮬레이션한다.
