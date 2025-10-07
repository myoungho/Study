# 3단계: shadcn/ui 완전 가이드 (Tailwind CSS v4)

## 목표
Todo 앱을 shadcn/ui 컴포넌트로 업그레이드하여 프로페셔널한 UI 만들기

**이 파일은 실제 설치 과정을 모두 기록한 완전한 가이드입니다. 복습 시 이 파일만 보고 따라하면 됩니다.**

---

## 사전 확인

### 현재 프로젝트 상태
- ✅ React + TypeScript 프로젝트 생성됨
- ✅ Tailwind CSS v4.1.14 설치됨
- ✅ 개발 서버 실행 중 (`npm run dev`)

### package.json 확인
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.14",
    "@tailwindcss/cli": "^4.1.14",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6"
  }
}
```

---

## 1단계: TypeScript 경로 별칭 설정 (중요!)

shadcn/ui는 `@/components` 같은 경로 별칭을 사용합니다.
**반드시 먼저 설정**해야 shadcn CLI가 정상 작동합니다.

### 문제 상황
```
✖ Failed to read tsconfig.json. Make sure your project has a valid tsconfig.json
```

**원인:** shadcn/ui CLI가 `@` 경로 별칭을 tsconfig에서 못 찾음

### 해결 방법

Vite + TypeScript는 설정이 여러 파일로 분리되어 있습니다:
- `tsconfig.json` (루트 설정)
- `tsconfig.app.json` (앱 설정)
- `tsconfig.node.json` (Node 설정)

**두 곳 모두 수정**해야 합니다!

### 1-1. tsconfig.json 수정

**파일 경로:** `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**추가한 부분:**
```json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### 1-2. tsconfig.app.json 수정

**파일 경로:** `tsconfig.app.json`

기존 `compilerOptions`에 다음을 추가:

```json
{
  "compilerOptions": {
    // ... 기존 설정들
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**전체 예시:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 1-3. vite.config.ts 수정

**파일 경로:** `vite.config.ts`

Vite는 tsconfig의 paths만으로는 부족하고, 빌드러가 이해하도록 `resolve.alias`도 설정해야 합니다.

**기존:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**수정 후:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**설명:**
- `path` 모듈 import 추가
- `resolve.alias` 설정 추가
- `@/components/ui/button` → `src/components/ui/button`으로 해석됨

---

## 2단계: Tailwind CSS v4 기본 설정

### 2-1. src/index.css 수정

**파일 경로:** `src/index.css`

Tailwind v4는 `@import` 방식을 사용합니다.

```css
@import "tailwindcss";

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

**v3와의 차이:**
```css
/* v3 (구버전) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (신버전) - 훨씬 간단! */
@import "tailwindcss";
```

### 2-2. tailwind.config.js 불필요

v4에서는 기본적으로 설정 파일이 필요 없습니다!
만약 있다면 삭제해도 됩니다. (shadcn이 생성할 수도 있지만 비워둬도 됨)

---

## 3단계: shadcn/ui 초기화

### 3-1. shadcn/ui init 실행

터미널에서 다음 명령어 실행:

```bash
npx shadcn@latest init
```

### 3-2. 대화형 질문에 답하기

#### Q1: 스타일 선택
```
? Which style would you like to use? ›
❯ New York
  Default
```
**선택:** `New York` (위쪽 화살표 + 엔터)

**차이점:**
- New York: 더 모던하고 미니멀한 디자인
- Default: 클래식한 디자인

#### Q2: 베이스 컬러
```
? Which color would you like to use as base color? ›
  Zinc
  Slate
  Stone
  Gray
❯ Neutral
  Red
  ...
```
**선택:** `Neutral` (엔터)

**설명:**
- 회색 계열 색상 팔레트
- Neutral = 중립적인 회색

#### Q3: CSS 변수 사용
```
? Would you like to use CSS variables for colors? ›
❯ yes
  no
```
**선택:** `yes` (엔터)

**이유:**
- 테마를 쉽게 커스터마이징 가능
- 다크 모드 지원 간편

#### Q4: Tailwind prefix
```
? Are you using a custom tailwind prefix eg. tw-? (Leave blank if not) ›
```
**선택:** 그냥 엔터 (prefix 없음)

#### Q5: Global CSS 파일 위치
```
? Where is your global CSS file? ›
❯ src/index.css
```
**선택:** 엔터 (기본값 사용)

#### Q6: Tailwind config 위치
```
? Where is your tailwind.config.js located? ›
❯ (leave blank if not exists)
```
**선택:** 그냥 엔터 (v4는 config 파일 불필요)

**메시지:**
```
✔ Found Tailwind CSS v4. Using @import instead.
```
이건 정상! v4를 인식했다는 뜻입니다.

#### Q7: Components import alias
```
? Configure the import alias for components? ›
❯ @/components
```
**선택:** 엔터 (기본값 사용)

#### Q8: Utils import alias
```
? Configure the import alias for utils? ›
❯ @/lib/utils
```
**선택:** 엔터 (기본값 사용)

#### Q9: React Server Components
```
? Are you using React Server Components? ›
  yes
❯ no
```
**선택:** `no` (엔터) - Vite는 클라이언트 사이드

#### Q10: 설정 저장 확인
```
? Write configuration to components.json. Proceed? ›
❯ yes
  no
```
**선택:** `yes` (엔터)

### 3-3. 설치 진행

```
✔ Writing components.json.
✔ Installing dependencies.
✔ Created src/lib/utils.ts
```

### 3-4. 설치 완료 확인

다음 파일/폴더가 생성되었는지 확인:

```
my-first-react-app/
├── components.json          ← 새로 생성됨
├── src/
│   ├── lib/
│   │   └── utils.ts        ← 새로 생성됨
│   └── components/         ← 폴더만 생성됨 (비어있음)
```

### 3-5. components.json 내용

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 3-6. package.json 변경사항

자동으로 다음 패키지들이 설치됩니다:

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.545.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "tw-animate-css": "^1.4.0"
  }
}
```

**설명:**
- `class-variance-authority`: variant 스타일 관리
- `clsx`: className 조건부 결합
- `lucide-react`: 아이콘 라이브러리
- `tailwind-merge`: Tailwind 클래스 병합
- `tw-animate-css`: 애니메이션

---

## 4단계: index.css 업데이트

shadcn/ui init이 자동으로 `src/index.css`를 업데이트합니다.

### 4-1. 업데이트된 index.css

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* shadcn/ui CSS 변수 */
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* 다크 모드 변수 */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

/* Tailwind v4 테마 */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* 베이스 스타일 */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**주요 포인트:**
- `@import "tw-animate-css"`: 애니메이션 지원
- `@custom-variant dark`: 다크 모드 variant
- `@theme inline`: Tailwind v4 테마 정의
- `oklch()`: 최신 CSS 색상 공간 (더 정확한 색상)

---

## 5단계: 개발 서버 재시작

설정 파일을 수정했으므로 개발 서버를 재시작해야 합니다.

터미널에서:
1. `Ctrl + C` (서버 중지)
2. `npm run dev` (서버 재시작)

---

## 6단계: shadcn/ui 컴포넌트 설치

이제 필요한 UI 컴포넌트들을 설치합니다.

### 6-1. Button 컴포넌트

```bash
npx shadcn@latest add button
```

**설치 과정:**
```
✔ Checking registry...
✔ Installing dependencies...
✔ Created src/components/ui/button.tsx
```

### 6-2. Input 컴포넌트

```bash
npx shadcn@latest add input
```

**생성:** `src/components/ui/input.tsx`

### 6-3. Checkbox 컴포넌트

```bash
npx shadcn@latest add checkbox
```

**추가 의존성 자동 설치:**
```
✔ Installing @radix-ui/react-checkbox...
```

**생성:** `src/components/ui/checkbox.tsx`

### 6-4. Card 컴포넌트

```bash
npx shadcn@latest add card
```

**생성:** `src/components/ui/card.tsx`

### 6-5. 설치 확인

`src/components/ui/` 폴더에 다음 파일들이 생성되었는지 확인:

```
src/
└── components/
    └── ui/
        ├── button.tsx       ← 버튼 컴포넌트
        ├── input.tsx        ← 입력창 컴포넌트
        ├── checkbox.tsx     ← 체크박스 컴포넌트
        └── card.tsx         ← 카드 컴포넌트
```

**중요:** 이 파일들은 일반 React 컴포넌트입니다!
- npm 패키지가 아닌 프로젝트 코드
- 직접 수정 가능
- 완전한 커스터마이징 가능
- 이것이 shadcn/ui의 핵심 철학!

---

## 7단계: App.tsx를 shadcn/ui로 리팩토링

### 7-1. 전체 코드 교체

`src/App.tsx` 파일을 다음 코드로 **완전히 교체**:

```tsx
import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TodoItem {
  id: number;
  text: string;
  isCompleted: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const addTodo = () => {
    if (inputText.trim() === "") return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              나의 Todo 앱
            </CardTitle>
            <CardDescription className="text-center">
              할 일을 추가하고 관리해보세요
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 입력 카드 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="할 일을 입력하세요"
                className="flex-1"
              />
              <Button onClick={addTodo}>추가</Button>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {todos.length}
                </p>
                <p className="text-sm text-gray-600">전체</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {todos.filter((todo) => todo.isCompleted).length}
                </p>
                <p className="text-sm text-gray-600">완료</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {todos.filter((todo) => !todo.isCompleted).length}
                </p>
                <p className="text-sm text-gray-600">미완료</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todo 목록 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>할 일 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                할 일이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={todo.isCompleted}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <span
                        className={`${
                          todo.isCompleted
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
```

### 7-2. 주요 변경사항

#### 1. Import 문
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, ... } from "@/components/ui/card";
```
- `@/`는 `src/`를 의미
- 경로 별칭 사용

#### 2. 인라인 스타일 → Tailwind + shadcn

**Before:**
```tsx
<button
  style={{
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  추가
</button>
```

**After:**
```tsx
<Button>추가</Button>
```

#### 3. Button Props
```tsx
<Button variant="destructive" size="sm">
  삭제
</Button>
```
- `variant`: default, destructive, outline, ghost, link
- `size`: default, sm, lg, icon

#### 4. Card 구조
```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

#### 5. Checkbox 사용
```tsx
<Checkbox
  checked={todo.isCompleted}
  onCheckedChange={() => toggleTodo(todo.id)}
/>
```
- `onCheckedChange`: 클릭 이벤트 핸들러
- Radix UI 기반이라 접근성 좋음

---

## 8단계: 최종 테스트

### 8-1. 브라우저 확인

`http://localhost:5173` 접속

**확인 사항:**
- ✨ 그라데이션 배경 (파란색 → 보라색)
- 📦 깔끔한 카드 레이아웃
- 🎨 통일된 디자인 시스템
- 🖱️ 버튼 호버 효과 (부드러운 애니메이션)
- ✅ 체크박스 체크 애니메이션
- 🗑️ 빨간색 삭제 버튼
- 🔄 전환 효과 (transition)

### 8-2. 기능 테스트

1. **할 일 추가**
   - 입력창에 "장보기" 입력
   - 추가 버튼 클릭 또는 엔터
   - 목록에 추가되는지 확인
   - 통계 업데이트 확인

2. **체크박스**
   - 체크박스 클릭
   - 텍스트에 취소선 생기는지 확인
   - 완료 개수 증가 확인
   - 미완료 개수 감소 확인

3. **삭제**
   - 삭제 버튼 클릭
   - 부드러운 애니메이션과 함께 사라지는지
   - 통계 업데이트 확인

4. **반응형**
   - 브라우저 창 크기 조절
   - 모바일 화면에서도 잘 보이는지 확인

---

## 문제 해결

### 문제 1: `Cannot find module '@/components/ui/button'`

**원인:** 경로 별칭 설정이 안 됨

**해결:**
1. `tsconfig.json`에 `baseUrl`과 `paths` 추가
2. `tsconfig.app.json`에도 동일하게 추가
3. `vite.config.ts`에 `alias` 설정 추가
4. 개발 서버 재시작: `Ctrl+C` → `npm run dev`

### 문제 2: 스타일이 적용 안 됨

**원인:** Tailwind CSS가 로드되지 않음

**해결:**
1. `src/index.css`에 `@import "tailwindcss"` 확인
2. shadcn CSS 변수 추가 확인
3. 브라우저 캐시 삭제 (`Ctrl+Shift+R`)
4. 개발 서버 재시작

### 문제 3: Checkbox가 클릭 안 됨

**원인:** `@radix-ui/react-checkbox` 미설치

**해결:**
```bash
npm install @radix-ui/react-checkbox
```

### 문제 4: TypeScript 에러

**에러:**
```
Cannot find module '@/lib/utils' or its corresponding type declarations
```

**해결:**
```bash
npx shadcn@latest init
```
다시 실행해서 `src/lib/utils.ts` 생성

### 문제 5: shadcn init 실패

**에러:**
```
✖ Failed to read tsconfig.json
```

**해결:**
1단계의 TypeScript 경로 별칭 설정을 다시 확인
- `tsconfig.json`
- `tsconfig.app.json`
둘 다 수정했는지 확인!

---

## Tailwind CSS 클래스 치트시트

### 레이아웃
```
flex                 Flexbox
grid                 Grid
block                Block
hidden               숨김

items-center         수직 중앙
justify-between      양 끝 정렬
gap-2                간격 0.5rem
gap-4                간격 1rem
```

### 간격
```
p-4                  padding 1rem
px-4                 padding-left/right 1rem
py-4                 padding-top/bottom 1rem
pt-6                 padding-top 1.5rem
m-4                  margin 1rem
mb-6                 margin-bottom 1.5rem
space-y-2            자식 요소 세로 간격
```

### 크기
```
w-full               width 100%
h-screen             height 100vh
max-w-2xl            max-width 42rem
min-h-screen         min-height 100vh
```

### 색상
```
bg-blue-50           매우 연한 파란색
bg-blue-600          진한 파란색
text-gray-900        거의 검은색 텍스트
text-gray-500        중간 회색 텍스트
border-gray-200      연한 회색 테두리
```

### 텍스트
```
text-sm              작은 글씨 (0.875rem)
text-xl              큰 글씨 (1.25rem)
text-2xl             매우 큰 글씨 (1.5rem)
text-3xl             초대형 글씨 (1.875rem)
font-bold            굵게
text-center          중앙 정렬
line-through         취소선
```

### 효과
```
rounded-lg           둥근 모서리
shadow-md            그림자
hover:shadow-lg      호버 시 큰 그림자
transition-shadow    부드러운 전환
```

### 그라데이션
```
bg-gradient-to-r     좌 → 우
bg-gradient-to-br    좌상 → 우하
from-blue-50         시작 색
to-indigo-100        끝 색
```

---

## C# 개발자를 위한 비교

### Import vs Using

**TypeScript:**
```tsx
import { Button } from "@/components/ui/button"
```

**C#:**
```csharp
using MyProject.Components.UI;
```

### Props vs Properties

**TypeScript:**
```tsx
<Button variant="destructive" size="sm">
  삭제
</Button>
```

**C# (WPF/XAML):**
```xml
<Button Style="{StaticResource DestructiveButton}"
        Size="Small">
  삭제
</Button>
```

### Tailwind vs CSS Classes

**TypeScript (Tailwind):**
```tsx
<div className="flex items-center gap-3">
```

**C# (Blazor):**
```csharp
<div class="flex items-center gap-3">
```

---

## 추가 학습 자료

### 공식 문서
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com
- **Vite:** https://vitejs.dev

### 다른 shadcn 컴포넌트 살펴보기

```bash
# 모달
npx shadcn@latest add dialog

# 드롭다운
npx shadcn@latest add select

# 뱃지
npx shadcn@latest add badge

# 알림
npx shadcn@latest add alert

# 폼
npx shadcn@latest add form

# 테이블
npx shadcn@latest add table

# 탭
npx shadcn@latest add tabs

# 토스트 알림
npx shadcn@latest add toast
```

### 유용한 도구
- **Tailwind 색상 팔레트:** https://tailwindcss.com/docs/customizing-colors
- **shadcn 테마 생성기:** https://ui.shadcn.com/themes
- **Tailwind 플레이그라운드:** https://play.tailwindcss.com

---

## 다음 단계

3단계를 완료했다면 **4단계: API 연동**으로 진행합니다.

4단계에서 배울 내용:
- fetch/axios로 REST API 호출
- JSONPlaceholder 또는 실제 백엔드 API 연동
- 로딩 상태 관리 (Loading Spinner)
- 에러 핸들링
- async/await 패턴
- useEffect Hook 사용

---

## 실습 체크리스트

완료한 항목에 체크:

**설정:**
- [ ] `tsconfig.json`에 경로 별칭 추가
- [ ] `tsconfig.app.json`에 경로 별칭 추가
- [ ] `vite.config.ts`에 alias 설정
- [ ] `src/index.css`에 `@import "tailwindcss"` 추가

**shadcn/ui 설치:**
- [ ] `npx shadcn@latest init` 실행
- [ ] 모든 질문에 답변 완료
- [ ] `components.json` 파일 생성 확인
- [ ] `src/lib/utils.ts` 파일 생성 확인

**컴포넌트 설치:**
- [ ] Button 컴포넌트 설치
- [ ] Input 컴포넌트 설치
- [ ] Checkbox 컴포넌트 설치
- [ ] Card 컴포넌트 설치
- [ ] `src/components/ui/` 폴더에 파일들 확인

**코드 작성:**
- [ ] `App.tsx` 코드 교체
- [ ] 개발 서버 재시작
- [ ] 브라우저에서 새 디자인 확인

**테스트:**
- [ ] 할 일 추가 기능
- [ ] 체크박스 기능
- [ ] 삭제 기능
- [ ] 통계 업데이트
- [ ] 반응형 확인

---

**작성일:** 2025-10-07
**Tailwind 버전:** v4.1.14
**shadcn/ui 스타일:** New York
**소요 시간:** 2-3시간
**난이도:** ⭐⭐⭐☆☆

**이 파일 하나로 처음부터 끝까지 shadcn/ui 설치 및 적용을 완료할 수 있습니다!**
