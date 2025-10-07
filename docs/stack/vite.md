# Vite 실무 온보딩 가이드

## 초급: ASP.NET Core 개발자 관점의 개념 정리
- **Vite dev server = `dotnet watch` + HMR**: 파일 저장 시 전체 빌드 없이 바뀐 모듈만 다시 로드합니다.
- **Vite build = MSBuild Release 빌드**: 최종 번들을 Rollup으로 생성해 배포 준비.
- **환경 변수 = appsettings.json**: `.env` 파일과 실행 모드(`development`, `production`)로 구성.

### 실습 1: 개발 서버 체험
```bash
npm install
npm run dev
```
- 콘솔에 출력된 `Local: http://localhost:5173` 접속 → Razor Pages 개발 시 `dotnet watch run`과 유사한 워크플로.

### 실습 2: 빌드/미리보기
```bash
npm run build
npm run preview
```
- `dist/` 폴더가 ASP.NET Core의 `publish` 폴더와 동일한 개념. 정적 호스팅 서버에서 그대로 사용 가능합니다.

## 중급: 구성 파일과 환경 관리
### vite.config.ts 해부
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  define: {
    __APP_ENV__: JSON.stringify(mode),
    __API_BASE__: JSON.stringify(process.env.VITE_API_URL),
  },
}));
```
- ASP.NET Core의 `Program.cs`에서 서비스를 등록하듯, 여기서 플러그인/별칭/전역 상수를 설정합니다.

### 환경 파일 구조
```
.env
.env.development
.env.production
```
- Razor에서 `ASPNETCORE_ENVIRONMENT`로 분기하듯, Vite는 `import.meta.env.MODE`를 활용합니다.

## 고급: 배포와 확장 전략
- **프록시 설정**: 개발 중 CORS를 피하기 위해 `server.proxy`로 ASP.NET Core 백엔드에 요청을 터널링합니다.
```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
},
```
- **코드 스플리팅**: Razor Areas처럼 `manualChunks`로 번들을 나눠 초기 로드를 최적화.
- **CI/CD 연동**: GitHub Actions에서 `npm ci && npm run build` 실행 → ASP.NET Core `dotnet publish` 단계와 나란히 구성.

## 실무 체크리스트
- [ ] 새 별칭 추가 시 `tsconfig.json`의 `paths`와 동기화.
- [ ] `.env` 변경 후 서버 재시작으로 값 반영 확인.
- [ ] 빌드 산출물(`dist/`)은 Git에 커밋하지 않음.
- [ ] `npm run preview`로 배포 상황을 미리 검증.

## 프로젝트 숙제
1. `VITE_APP_NAME` 변수를 추가하고 `src/App.tsx` 헤더에 표기.
2. ASP.NET Core 백엔드가 7001 포트에서 동작한다고 가정, 프록시 설정으로 통신 구성.
3. Rollup `manualChunks`를 이용해 React 관련 라이브러리를 `vendor` 청크로 분리하고 Lighthouse로 성능 비교.

## 참고 자료
- [Vite 공식 문서](https://vitejs.dev/guide/) — Razor 개발자가 매우 빠르게 적응 가능.
- [ASP.NET Core + Vite 템플릿](https://learn.microsoft.com/aspnet/core/spa/) — Microsoft 샘플.
- [Rollup Introduction](https://rollupjs.org/introduction/) — 번들링 최적화 이해를 위한 자료.
