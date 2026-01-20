# 로그인 페이지 개발 요구사항

## 1. 개요

관리자 시스템의 진입점인 로그인 페이지를 구현한다.
심플하고 직관적인 UI를 제공하며, 회원가입 신청 기능을 포함한다.

## 2. 기술 스택

- **HTML5**
- **CSS3**: Bootstrap 5 (CDN), Custom CSS (Embedded)
- **JavaScript**: Vanilla JS (Embedded)
- **Icons**: Bootstrap Icons (CDN)

## 3. 파일 구조

- 루트 디렉토리에 `login.html` 단일 파일로 구성
- CSS와 JS는 `login.html` 내부에 포함 (Embedded)

## 4. UI/UX 디자인

- **배경**: 전체 화면 어두운 배경 (`#212529`)
- **컨테이너**: 화면 정중앙에 위치한 카드 형태의 백색 컨테이너 (`max-width: 400px`)
- **브랜딩**: 상단에 로켓 아이콘과 함께 "Deploy Sys" 로고 표시 (`#0d6efd`)
- **입력 스타일**: Bootstrap의 `Floating Labels` 스타일 적용
- **전환 효과**: 로그인 폼과 회원가입 폼 간의 전환은 JavaScript를 통해 `display` 속성을 제어하여 즉각적으로 처리

## 5. 기능 요구사항

### 5.1 로그인 (Login)

- **입력 필드**:
  - 아이디 (User ID)
  - 비밀번호 (Password)
  - *참고: 로그인 상태 유지 체크박스는 제거됨*
- **동작**:
  - 입력 값 유효성 검사 (HTML5 `required`).
  - 로그인 버튼 클릭 시 `handleLogin` 함수 호출.
  - 아이디/비밀번호 입력 확인 후 성공 시 `./dashboard.html`로 이동.
  - 실패 시 알림 모달 표시.
- **링크**:
  - "회원가입 신청" 클릭 시 회원가입 폼으로 전환.

### 5.2 회원가입 신청 (Sign Up)

- **기본 상태**: 숨김 처리 (`display: none`).
- **입력 필드**:
  - **소속 (Org)**: `input` + `datalist` 조합 (예: Tech1실, Tech2실, Tech실).
  - **팀 (Team)**: 텍스트 입력.
  - **이름 (Name)**: 텍스트 입력.
  - **직급 (Rank)**: Select 박스 (매니저, 팀장, 팀장 이상 등).
  - **사용 만료 (Usage Expiry)**:
    - **년도**: 현재 년도부터 2099년까지 동적 생성 (`initDateSelectors`).
    - **월**: 선택된 년도에 따라 동적 생성 (`updateMonthOptions`). 현재 년도 선택 시 현재 월부터 표시.
  - **전화번호**: Tel 입력.
  - **이메일**: Email 입력.
- **동작**:
  - "신청하기" 버튼 클릭 시 `handleSignup` 함수 호출.
  - **날짜 계산**: 선택된 년/월의 **마지막 날**을 계산하여 만료일(YYYY-MM-DD) 생성.
  - 신청 완료 시 **성공 모달(Success Modal)** 표시.
    - 모달 내용: 신청 소속 및 만료 기간 표시.
  - "취소" 버튼 클릭 시 로그인 폼으로 복귀.

### 5.3 모달 (Modals)

- **성공 모달 (Success Modal)**:
  - 초록색 헤더, 성공 아이콘.
  - 신청 완료 메시지와 요약 정보 표시.
  - 닫기/확인 버튼 클릭 시 로그인 화면으로 복귀.
- **알림 모달 (Alert Modal)**:
  - 붉은색 헤더, 경고 아이콘.
  - 시스템 알림 메시지 표시.

## 6. 주요 로직 (JavaScript)

- `toggleView(view)`: 'login' 또는 'signup' 인자에 따라 폼 가시성 토글.
- `initDateSelectors()`: 사용 만료 년도 옵션 초기화.
- `updateMonthOptions()`: 년도 변경 시 월 옵션 갱신 (현재 년도인 경우 과거 월 선택 불가 처리).
- `handleLogin(event)`: 로그인 처리 시뮬레이션.
- `handleSignup(event)`: 회원가입 처리 시뮬레이션 및 날짜 계산 로직.

## 7. 기타

- 모바일 반응형 지원 (Bootstrap Grid 활용).
- 폼 유효성 검사는 브라우저 기본 기능 활용.
