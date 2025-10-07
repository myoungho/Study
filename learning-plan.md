**학습 순서 제안**
- **React + TypeScript 기초 복습**: 컴포넌트, 훅, 상태/props 흐름과 기본 TS 타입 사용법을 React 문서 → TypeScript Handbook 순으로 빠르게 훑으세요.
- **Vite · 프로젝트 구조 이해**: `npm create vite@latest`로 간단한 샘플을 만들어 보고, 환경 변수/빌드 흐름을 실습합니다. 현재 저장소 구조와 비교하면서 디렉터리 패턴을 익히세요.

**핵심 기술별 학습 가이드**
- **상태 관리 (Zustand)**: 공식 문서 튜토리얼로 store 생성·`persist`·`devtools` 미들웨어를 직접 구현합니다. Todo 예제를 따라 하면서 액션/선택자 패턴을 몸에 익히세요.
- **React Router 7**: 라우트 구성, 레이아웃, 보호된 라우트 패턴을 문서의 “Basic/Advanced Guides” 섹션으로 학습하고, 현재 앱처럼 중첩+ProtectedRoute를 구현해 보세요.
- **Form & Validation (React Hook Form + Zod)**: 로그인/회원가입 폼을 분해해 `useForm`, `resolver` 사용법을 실습합니다. API 호출과 연동되는 비동기 검증까지 확장해 보세요.
- **데이터 패칭 (TanStack Query / Axios)**: 현재 프로젝트는 JSONPlaceholder를 사용합니다. QueryClient 설정, 뮤테이션/쿼리 훅을 샘플 작성 후, `useTodoStore` 일부를 Query로 대체하는 연습을 해보면 이해가 쉽습니다.
- **UI & 스타일 (Tailwind CSS 4 + shadcn/ui)**: Tailwind 기초 유틸리티 클래스와 최신 v4 변경점을 학습하세요. shadcn/ui를 설치해 Button/Card 등을 커스터마이징하며 디자인 시스템 감을 익힙니다.

**추천 학습 플로우**
1. 각 기술의 공식 문서/빠른 시작(Quick Start) 먼저 읽기.
2. 현재 저장소에서 해당 기술이 쓰인 파일을 열어 실제 예제를 분석.
3. 복습을 위해 작은 클론 프로젝트를 만들어, 같은 기능(로그인·Todo·라우팅)을 최소한으로 재구현.
4. 기능별로 실습 노트를 남기고, 궁금한 점은 Issues/블로그에 정리.

**추가 팁**
- C# 백엔드 지식과 연결: Axios 요청을 ASP.NET Core API로 대체해 보며 CORS, JWT, DTO 변환을 직접 다뤄보세요.
- 학습 로그 남기기: 각 기술을 실습한 뒤 느낀 점/문제 해결 과정을 레포 루트의 번호 매긴 노트처럼 기록하면 복습에 도움이 됩니다.
- 궁금한 주제가 생기면 알려 주세요. 필요한 부분을 더 깊게 정리해 드릴 수 있습니다.
