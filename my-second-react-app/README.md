# my-second-react-app

Vite 7 + React 19로 구성된 최신 SPA 템플릿입니다. TanStack Router의 파일 기반 라우팅, React Query, Zustand, Tailwind CSS 4를 결합해 현재 프론트엔드 커뮤니티에서 선호되는 설계를 반영했습니다. Next.js 대신 Vite를 선택해 빌드 속도와 구성 유연성을 확보했습니다.

## Tech Stack
- ⚛️ **React 19** + **Vite 7**
- 🧭 **TanStack Router (file-based)**
- 📦 **TanStack Query** (React Query) for 서버 상태 & 캐싱
- 🧠 **Zustand + Immer**로 세션/테마/필터 관리
- 🎨 **Tailwind CSS 4** + CSS-first 설정 (@theme, @source)
- 🔔 **Sonner** 토스트 + Router/Query Devtools 통합

## Project Structure
`
src/
  app/            # 라우터 컨텍스트, Providers, QueryClient
  entities/       # Todo domain 최소 단위 (types, API, hooks, UI)
  features/       # todo 생성/필터, theme toggle 등 도메인 행위
  pages/          # 라우트별 화면 컴포넌트
  routes/         # TanStack Router 파일 기반 라우팅
  shared/         # 공용 config, UI primitives, axios client 등
  widgets/        # AppShell, 네비게이션 등 상위 레이아웃
`

## Scripts
`ash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # vite build + 타입 검증
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
`

## Highlights
- TanStack Router Vite 플러그인으로 src/routes/*.tsx 파일에 라우트를 선언하고 자동으로 트리를 생성합니다.
- Tailwind CSS 4의 CSS-first 접근(@import "tailwindcss";, @theme) 덕분에 추가 플러그인 없이 통일된 디자인 토큰을 사용합니다.
- React Query + Zustand 조합으로 서버/클라이언트 상태를 명확히 분리했습니다.
- ASP.NET Core와 연동 시 shared/api/http-client.ts의 baseURL을 백엔드 주소로 교체하면 바로 BFF 형태로 사용할 수 있습니다.

## Next Steps
- TanStack Router의 lazy route(코드 스플리팅) 도입으로 번들 크기를 줄이세요.
- Storybook / Vitest / Playwright를 추가해 UI와 기능 테스트를 자동화하세요.
- 팀 브랜드에 맞는 Tailwind 토큰을 src/index.css의 @theme 섹션에 확장하세요.
- ASP.NET Core 또는 Node API와 연계해 실제 CRUD/인증 플로우를 구현해 보세요.
