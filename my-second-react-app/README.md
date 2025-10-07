# my-second-react-app

Vite 7 + React 19로 구성된 최신 SPA 템플릿입니다. TanStack Router의 파일 기반 라우팅, React Query, Zustand, Tailwind CSS 4를 결합해 현재 프론트엔드 커뮤니티에서 선호되는 설계를 반영했습니다. Next.js 대신 Vite를 선택해 빌드 속도와 구성 유연성을 확보했습니다.

## Tech Stack
- ⚛️ **React 19** + **Vite 7**
- 🧭 **TanStack Router (file-based)**
- 📦 **TanStack Query** (React Query) for 서버 상태 & 캐싱
- 🧠 **Zustand + Immer**로 세션/테마/필터 관리
- 🎨 **Tailwind CSS 4** + CSS-first 설정
- 🔔 **Sonner** 토스트 + Router/Query Devtools 통합

## Architecture

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처 원칙을 따릅니다. 이를 통해 각 기능의 독립성을 보장하고, 프로젝트의 유지보수성과 확장성을 극대화합니다.

```
src/
  app/            # 앱 전체 설정, 라우팅, Providers, 전역 스타일
  pages/          # 특정 경로에 해당하는 페이지 컴포넌트
  widgets/        # 여러 기능을 조합한 UI 블록 (e.g., Header, Sidebar)
  features/       # 구체적인 사용자 기능 (e.g., 회원가입, 테마 토글)
  entities/       # 비즈니스 핵심 데이터 모델 (e.g., Todo, User)
  shared/         # 공용 UI 컴포넌트, API 클라이언트, 유틸리티 함수 등
```

## Scripts

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # vite build + 타입 검증
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Highlights

- **Feature-Sliced Design:** FSD 아키텍처를 적용하여, 비즈니스 요구사항과 코드베이스를 명확하게 동기화하고, 변경의 영향 범위를 쉽게 제어할 수 있습니다.
- **File-based Routing:** TanStack Router Vite 플러그인이 `src/app/routes/**/*.tsx` 파일을 기반으로 자동으로 라우트 트리를 생성하여, 라우팅 설정을 직관적으로 관리합니다.
- **Declarative API Fetching:** TanStack Query와 `queryKey` 팩토리를 사용하여, API 데이터를 선언적으로 관리하고 캐싱, 동기화, 서버 상태 업데이트를 자동화합니다.
- **Separation of Concerns:** React Query로 서버 상태를, Zustand로 클라이언트 상태(세션, UI 설정 등)를 명확히 분리하여 상태 관리의 복잡성을 낮췄습니다.
- **Compound Components:** `Card`와 같은 UI 컴포넌트를 컴파운드 컴포넌트 패턴으로 설계하여, 유연하고 재사용 가능한 UI를 구축합니다.

## Next Steps

- TanStack Router의 lazy loading(코드 스플리팅)을 도입하여 초기 로딩 성능을 최적화하세요.
- Storybook을 추가하여 `shared/ui`의 컴포넌트들을 시각적으로 문서화하고 테스트하세요.
- ASP.NET Core 또는 Node.js API와 연계하여 실제 CRUD 및 인증 플로우를 구현해 보세요.