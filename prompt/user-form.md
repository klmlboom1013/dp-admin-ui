# 사용자 정보 수정 화면 (User Edit Form) 개발 요구사항

## 1. 개요

특정 사용자의 상세 정보를 조회하고 수정하는 화면이다.
기본 정보(이름, 부서 등)와 보안 정보(비밀번호), 그리고 관리자 전용 필드(등급, 권한 그룹, 상태)로 구성된다.
접속한 사용자의 권한(User Context)에 따라 수정 가능한 필드가 동적으로 제어된다.

## 2. 접근 경로

- **URI**: `./user-form.html`
- **파라미터**: `id` (수정할 사용자 ID).
- **진입점**: `user-list.html`의 [수정] 버튼.

## 3. 화면 구성

### 3.1 헤더 영역

- **Title**: Edit Member Info
- **Back Button**: `<i class="bi bi-arrow-left"></i>` (클릭 시 `user-list.html`로 이동).
- **Context Simulator**: 헤더의 Global Simulator를 사용하여 권한 테스트 가능.

### 3.2 입력 폼 (Form Fields)

크게 세 가지 섹션으로 구분된다.

#### 1) 기본 정보 (Basic Info)

- **아이디 (ID)**: Readonly. 수정 불가. (필수)
- **이름 (Name)**: 텍스트 입력. (필수)
- **이메일 (Email)**: 이메일 형식.
- **휴대폰 번호 (Phone)**: 전화번호 형식.
- **비밀번호 변경**: Password 타입. 변경 시에만 입력.
- **비밀번호 확인**: Password 타입.
- **소속 (Department)**: 텍스트 입력 (Datalist `deptOptions` 제공: Tech1실, Tech2실 등).
- **팀 (Team)**: 텍스트 입력.
- **직급 (Rank)**: Select Box (매니저, 팀장, 팀장이상).
- **사용 만료일**: Date Picker.

#### 2) 권한 정보 (Permission Info)

- **계정 등급 (Level)**: Select Box (Content, Report, Master).
  - *Admin 권한 전용 필드.*
- **계정 그룹 (Group)**: Select Box (PD, SO 등).
  - *Admin 권한 전용 필드.*

#### 3) 계정 상태 (Status)

- **계정 상태**: Select Box (정상, 가입대기, 삭제대기, 중지).
  - *Admin 권한 전용 필드.*

### 3.3 하단 액션 버튼

- **취소**: 목록 화면으로 복귀.
- **저장**: 입력된 정보 저장 (Mock 처리).

## 4. 주요 기능 및 로직

### 4.1 권한 제어 (Permission Logic)

로그인한 사용자(`currentUser`)와 수정 대상 사용자(`targetUser`)의 관계에 따라 필드 비활성화(Disabled) 규칙이 적용된다.

1. **관리 권한 필드 (Level, Group, Status)**
    - **수정 가능**: `currentUser.level === 'Admin'`
    - **수정 불가**: 그 외 모든 사용자 (Readonly/Disabled 상태).

2. **비밀번호 변경 (Password Fields)**
    - **수정 가능**: `currentUser.level === 'Admin'` OR `currentUser.id === targetUser.id` (본인)
    - **수정 불가**: `Master` 등급이 타인의 정보를 수정할 때, 또는 권한이 없는 경우 (Placeholder에 "권한이 없습니다" 표시).

3. **일반 정보 (이름, 부서 등)**
    - **Admin**: 모든 사용자의 정보 수정 가능.
    - **Master**: 본인과 **동일한 그룹**에 속한 `Content`, `Report` 등급 사용자의 정보 수정 가능 (단, 비밀번호 제외).
    - **Self**: 본인의 정보 수정 가능.

### 4.2 데이터 로직 (Mock)

- **초기 로드**: URL 파라미터 `id`를 기반으로 `users` 배열에서 데이터를 찾아 폼을 채운다.
- **예외 처리**: 잘못된 ID로 접근 시 Alert 표시 후 목록으로 리다이렉트.
- **저장 처리**: `handleSave()` 함수 호출 시 성공 Toast 메시지를 띄우고 목록으로 이동한다 (실제 데이터 갱신은 Mock 변수상태 유지 or 로컬스토리지 연동 없이 UI 흐름만 시뮬레이션).
