# 10단계: 배포 (Vercel)

## 목표
완성된 Todo 앱을 Vercel에 배포하여 실제 인터넷에 공개

**학습 내용:**
- 프로덕션 빌드
- 환경 변수 설정
- Vercel 배포
- 자동 배포 (CI/CD)
- 커스텀 도메인 (선택)
- 성능 최적화

---

## Step 1: 프로덕션 빌드 준비

### 1-1. package.json 확인

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### 1-2. 로컬 빌드 테스트

```bash
npm run build
```

**결과:**
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── ...
```

### 1-3. 빌드 미리보기

```bash
npm run preview
```

브라우저에서 `http://localhost:4173` 확인

---

## Step 2: 환경 변수 설정

### 2-1. .env 파일 생성

**파일:** `.env` (루트 폴더)

```env
VITE_API_URL=https://jsonplaceholder.typicode.com
VITE_APP_NAME=Todo App
```

**주의:** Vite는 `VITE_` 접두사가 필요합니다!

### 2-2. 환경 변수 사용

**파일:** `src/api/axios.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});
```

### 2-3. TypeScript 타입 정의

**파일:** `src/vite-env.d.ts` (수정)

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 2-4. .gitignore 확인

```.gitignore
# 환경 변수
.env
.env.local
.env.production

# 빌드 결과
dist
```

---

## Step 3: Vercel 회원가입

### 3-1. Vercel 가입

1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 가입 (추천)
4. 이메일 인증

### 3-2. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

```bash
vercel login
```

---

## Step 4: GitHub 저장소 준비

### 4-1. README.md 작성

**파일:** `README.md`

```markdown
# Todo App

React + TypeScript로 만든 현대적인 할 일 관리 앱

## 🚀 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Zustand (상태 관리)
- TanStack Query (서버 상태)
- React Router (라우팅)
- React Hook Form + Zod (폼 관리)

## ✨ 주요 기능

- 할 일 추가/수정/삭제
- 완료 상태 관리
- API 연동 (JSONPlaceholder)
- 사용자 인증 (JWT)
- 다중 페이지 라우팅
- 반응형 디자인

## 🛠️ 설치 및 실행

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
\`\`\`

## 📝 환경 변수

\`.env\` 파일을 생성하고 다음을 추가:

\`\`\`
VITE_API_URL=https://jsonplaceholder.typicode.com
VITE_APP_NAME=Todo App
\`\`\`

## 🚀 배포

Vercel에 배포됨: [여기에 URL 추가]

## 📄 라이선스

MIT
```

### 4-2. Git 커밋 및 푸시

```bash
git add .
git commit -m "프로덕션 배포 준비"
git push origin main
```

---

## Step 5: Vercel 배포

### 5-1. Vercel 대시보드에서 배포

1. Vercel 대시보드 접속
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 import
4. 저장소 선택 (my-first-react-app)
5. "Import" 클릭

### 5-2. 프로젝트 설정

**Framework Preset:** Vite (자동 감지)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

### 5-3. 환경 변수 추가

**Environment Variables:**
- Key: `VITE_API_URL`
- Value: `https://jsonplaceholder.typicode.com`

"Add" 클릭

### 5-4. 배포 시작

"Deploy" 버튼 클릭

**배포 진행:**
```
1. Building...
2. Deploying...
3. Ready!
```

### 5-5. 배포 완료

배포 완료 후 URL 확인:
```
https://your-app-name.vercel.app
```

---

## Step 6: 자동 배포 설정 (CI/CD)

### 6-1. 자동 배포 확인

Vercel은 기본적으로 자동 배포 활성화:
- main 브랜치에 push → 자동 배포
- PR 생성 → 미리보기 배포
- 커밋마다 고유 URL

### 6-2. 배포 히스토리 확인

Vercel 대시보드:
- Deployments 탭
- 모든 배포 기록 확인
- 롤백 가능

### 6-3. Git 워크플로우

```bash
# 기능 개발
git checkout -b feature/new-feature
# 작업...
git commit -m "새 기능 추가"
git push origin feature/new-feature

# PR 생성 → Vercel이 미리보기 배포
# 머지 → 자동으로 프로덕션 배포
```

---

## Step 7: 커스텀 도메인 (선택사항)

### 7-1. 도메인 구매

- Namecheap, GoDaddy 등에서 구매
- 예: `my-todo-app.com`

### 7-2. Vercel에 도메인 추가

1. Vercel 프로젝트 → Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력
4. DNS 설정 안내 확인

### 7-3. DNS 설정

도메인 등록 업체에서:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 7-4. SSL 인증서

Vercel이 자동으로 SSL 인증서 발급 (무료)
- Let's Encrypt 사용
- HTTPS 자동 적용

---

## Step 8: 성능 최적화

### 8-1. 이미지 최적화

**방법 1: Lazy Loading**
```tsx
<img src="..." loading="lazy" alt="..." />
```

**방법 2: 최적화된 이미지 사용**
- WebP 포맷
- 적절한 크기

### 8-2. 코드 스플리팅

**React.lazy:**
```tsx
import { lazy, Suspense } from 'react';

const TodosPage = lazy(() => import('./pages/TodosPage'));

<Suspense fallback={<div>Loading...</div>}>
  <TodosPage />
</Suspense>
```

### 8-3. Bundle 분석

```bash
npm install -D rollup-plugin-visualizer
```

**vite.config.ts:**
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ],
});
```

```bash
npm run build
```

### 8-4. Lighthouse 점수 확인

Chrome DevTools:
1. F12 → Lighthouse 탭
2. "Generate report" 클릭
3. 점수 확인 (90+ 목표)

---

## Step 9: 모니터링 및 분석

### 9-1. Vercel Analytics

Vercel 대시보드:
- Analytics 탭
- 방문자 통계
- 페이지 성능

### 9-2. 에러 모니터링 (선택사항)

**Sentry 설치:**
```bash
npm install @sentry/react
```

**초기화:**
```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## Step 10: 배포 체크리스트

### 배포 전

- [ ] 로컬 빌드 테스트 (`npm run build`)
- [ ] 빌드 미리보기 (`npm run preview`)
- [ ] 모든 기능 테스트
- [ ] 환경 변수 확인
- [ ] .gitignore 확인
- [ ] README.md 작성
- [ ] Git 커밋 및 푸시

### 배포 중

- [ ] Vercel 프로젝트 생성
- [ ] 빌드 설정 확인
- [ ] 환경 변수 추가
- [ ] 배포 시작

### 배포 후

- [ ] 배포 URL 확인
- [ ] 모든 페이지 테스트
- [ ] 모바일 반응형 확인
- [ ] Lighthouse 점수 확인
- [ ] 에러 없는지 확인
- [ ] README에 URL 추가

---

## 문제 해결

### 문제 1: 빌드 실패

**증상:**
```
Error: Module not found
```

**해결:**
1. 로컬에서 `npm run build` 테스트
2. 의존성 확인 (`package.json`)
3. Import 경로 확인

### 문제 2: 404 에러 (SPA)

**증상:**
- `/todos` 직접 접속 시 404

**해결:**
Vercel은 자동으로 SPA 라우팅 처리
만약 안 되면 `vercel.json` 생성:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 문제 3: 환경 변수 적용 안 됨

**해결:**
1. Vercel 대시보드에서 환경 변수 확인
2. 재배포 (Redeploy)
3. `VITE_` 접두사 확인

---

## Vercel CLI 사용 (선택사항)

### 로컬에서 배포

```bash
# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수 설정

```bash
vercel env add VITE_API_URL
```

### 로그 확인

```bash
vercel logs
```

---

## C# 개발자를 위한 비교

### Azure vs Vercel

**Azure App Service:**
```bash
az webapp up --name my-app --resource-group my-rg
```

**Vercel:**
```bash
vercel
```

훨씬 간단!

---

## 다음 학습 주제

10단계를 완료했다면 축하합니다! 🎉

**추가 학습 주제:**
- Next.js (SSR, SSG)
- PWA (Progressive Web App)
- Testing (Jest, React Testing Library)
- E2E Testing (Playwright, Cypress)
- GraphQL
- Monorepo (Nx, Turborepo)
- Micro Frontends

---

## 최종 완성 체크리스트

**기술 스택:**
- [x] React 19 + TypeScript
- [x] Vite
- [x] Tailwind CSS v4
- [x] shadcn/ui
- [x] Zustand
- [x] TanStack Query
- [x] React Router
- [x] React Hook Form + Zod
- [x] 인증 시스템
- [x] Vercel 배포

**기능:**
- [x] Todo CRUD
- [x] API 연동
- [x] 로딩/에러 처리
- [x] 다중 페이지
- [x] 사용자 인증
- [x] 반응형 디자인
- [x] 프로덕션 배포

**완성도:**
- [x] 프로젝트 구조 체계적
- [x] 코드 품질 양호
- [x] 사용자 경험 우수
- [x] 성능 최적화
- [x] 보안 고려
- [x] 문서화 완료

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐☆☆☆
**소요 시간:** 1-2시간

**축하합니다! 프론트엔드 개발 학습 여정을 완주하셨습니다! 🎊**
