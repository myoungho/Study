# 3단계: shadcn/ui 완전 가이드 (Tailwind CSS v4)

## 소개

이 가이드는 실제 설치 과정에서 발생한 모든 문제와 해결 방법을 포함합니다.
각 단계를 순서대로 따라하면 처음부터 끝까지 성공적으로 설치할 수 있습니다.

**환경:**
- Windows 11
- Node.js v22.18.0
- npm 10.9.3
- Vite + React + TypeScript
- Tailwind CSS v4.1.14

---

## Step 1: TypeScript 경로 별칭 설정

### 왜 필요한가?
shadcn/ui는 `@/components/ui/button` 같은 경로 별칭을 사용합니다.
이 설정 없이 `npx shadcn@latest init`을 실행하면 오류가 발생합니다.

### 1-1. tsconfig.json 수정

**파일:** `tsconfig.json`

**기존 내용:**
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**수정 후:**
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

### 1-2. tsconfig.app.json 수정

**파일:** `tsconfig.app.json`

기존 `compilerOptions`에 다음을 **추가**:

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

### 1-3. vite.config.ts 수정

**파일:** `vite.config.ts`

**기존 내용:**
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
- `resolve.alias` 설정으로 `@/` → `src/` 매핑

---

## Step 2: shadcn/ui 초기화

### 2-1. shadcn init 실행

터미널에서:
```bash
npx shadcn@latest init
```

### 2-2. 대화형 질문 답변

#### Q1: 스타일 선택
```
? Which style would you like to use?
❯ New York
  Default
```
**답변:** `New York` 선택 (화살표 위 + 엔터)

#### Q2: 베이스 컬러
```
? Which color would you like to use as base color?
  Zinc
  Slate
  Stone
  Gray
❯ Neutral
```
**답변:** `Neutral` 선택 (엔터)

#### Q3: CSS 변수 사용
```
? Would you like to use CSS variables for colors?
❯ yes
  no
```
**답변:** `yes` (엔터)

#### Q4: Tailwind prefix
```
? Are you using a custom tailwind prefix eg. tw-? (Leave blank if not)
```
**답변:** 그냥 엔터 (빈칸)

#### Q5: Global CSS 파일
```
? Where is your global CSS file?
❯ src/index.css
```
**답변:** 엔터 (기본값)

#### Q6: Tailwind config
```
? Where is your tailwind.config.js located?
❯ (leave blank if not exists)
```
**답변:** 그냥 엔터

**메시지:**
```
✔ Found Tailwind CSS v4. Using @import instead.
```
이건 정상! v4를 인식했다는 뜻입니다.

#### Q7: Components alias
```
? Configure the import alias for components?
❯ @/components
```
**답변:** 엔터

#### Q8: Utils alias
```
? Configure the import alias for utils?
❯ @/lib/utils
```
**답변:** 엔터

#### Q9: React Server Components
```
? Are you using React Server Components?
  yes
❯ no
```
**답변:** `no` (엔터)

#### Q10: 설정 저장
```
? Write configuration to components.json. Proceed?
❯ yes
  no
```
**답변:** `yes` (엔터)

### 2-3. 설치 완료 확인

다음 파일들이 생성되었는지 확인:
```
my-first-react-app/
├── components.json          ← 새로 생성됨
├── src/
│   ├── lib/
│   │   └── utils.ts        ← 새로 생성됨
│   ├── components/         ← 폴더만 생성됨 (비어있음)
│   └── index.css           ← 자동으로 업데이트됨
```

### 2-4. package.json 변경사항

자동으로 설치된 패키지:
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

---

## Step 3: Tailwind PostCSS 플러그인 설치 (중요!)

### 문제 상황
Tailwind v4에서는 PostCSS 플러그인이 별도 패키지로 분리되었습니다.
이 단계를 건너뛰면 **Tailwind CSS가 전혀 작동하지 않습니다!**

### 3-1. @tailwindcss/postcss 설치

터미널에서:
```bash
npm install -D @tailwindcss/postcss
```

### 3-2. vite.config.ts 업데이트

**파일:** `vite.config.ts`

**현재 상태:**
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

**수정 후:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
```

**추가된 부분:**
- `import tailwindcss from "@tailwindcss/postcss";`
- `css: { postcss: { plugins: [tailwindcss()] } }`

---

## Step 4: index.css 수정

### 4-1. index.css 전체 교체

**파일:** `src/index.css`

shadcn init이 자동으로 CSS 변수를 추가했지만, 일부 설정이 문제를 일으킬 수 있습니다.
다음 내용으로 **완전히 교체**:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**주요 포인트:**
- HSL 색상 값 사용 (oklch 대신)
- `@theme inline`으로 Tailwind v4 테마 정의
- `@layer base`로 기본 스타일 적용

---

## Step 5: App.css 비우기

### 문제 상황
기본 `App.css`에는 `#root { text-align: center; }` 같은 스타일이 있어서
레이아웃이 깨집니다.

### 5-1. App.css 수정

**파일:** `src/App.css`

**내용을 전부 삭제하고:**
```css
/* App.css - shadcn/ui 사용으로 비움 */
```

---

## Step 6: shadcn/ui 컴포넌트 설치

### 6-1. Button 컴포넌트

```bash
npx shadcn@latest add button
```

**결과:**
```
✔ Checking registry...
✔ Installing dependencies...
✔ Created src/components/ui/button.tsx
```

### 6-2. Input 컴포넌트

```bash
npx shadcn@latest add input
```

**결과:**
```
✔ Created src/components/ui/input.tsx
```

### 6-3. Checkbox 컴포넌트

```bash
npx shadcn@latest add checkbox
```

**결과:**
```
✔ Installing @radix-ui/react-checkbox...
✔ Created src/components/ui/checkbox.tsx
```

### 6-4. Card 컴포넌트

```bash
npx shadcn@latest add card
```

**결과:**
```
✔ Created src/components/ui/card.tsx
```

### 6-5. 설치 확인

```
src/
└── components/
    └── ui/
        ├── button.tsx
        ├── input.tsx
        ├── checkbox.tsx
        └── card.tsx
```

**중요:**
- 이 파일들은 npm 패키지가 아닌 **프로젝트 코드**입니다
- 언제든지 수정 가능
- shadcn/ui의 핵심 철학!

---

## Step 7: App.tsx 작성

### 7-1. 전체 코드

**파일:** `src/App.tsx`

기존 내용을 다음으로 **완전히 교체**:

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

---

## Step 8: 개발 서버 재시작

### 8-1. 캐시 삭제 (선택사항)

문제가 있을 경우:
```bash
# PowerShell에서
Remove-Item -Recurse -Force node_modules/.vite
```

### 8-2. 서버 재시작

터미널에서:
```bash
# Ctrl + C로 서버 중지
npm run dev
```

### 8-3. 브라우저 강력 새로고침

브라우저에서:
- `Ctrl + Shift + R` (Windows)
- 또는 `Ctrl + F5`

---

## Step 9: 최종 확인

### 브라우저에서 확인할 것들

1. **배경**
   - ✨ 파란색 → 보라색 그라데이션

2. **카드 레이아웃**
   - 📦 4개의 카드 (헤더, 입력, 통계, 목록)
   - 그림자와 둥근 모서리

3. **기능 테스트**
   - ✅ 할 일 추가 (버튼 또는 엔터)
   - ✅ 체크박스 클릭 (완료 처리)
   - ✅ 삭제 버튼 (빨간색)
   - ✅ 통계 업데이트

4. **반응형**
   - 📱 창 크기 조절 시 자동 조정

---

## 문제 해결

### 문제 1: Tailwind CSS가 작동 안 함

**증상:**
- 배경색이 흰색
- 카드에 스타일 없음
- 체크박스 안 보임

**해결:**
1. `@tailwindcss/postcss` 설치 확인
   ```bash
   npm install -D @tailwindcss/postcss
   ```

2. `vite.config.ts`에 PostCSS 설정 확인
   ```typescript
   css: {
     postcss: {
       plugins: [tailwindcss()],
     },
   }
   ```

3. 개발 서버 재시작

### 문제 2: 경로 별칭 에러

**증상:**
```
Cannot find module '@/components/ui/button'
```

**해결:**
1. `tsconfig.json`과 `tsconfig.app.json` 둘 다 수정
2. `vite.config.ts`에 alias 설정
3. 개발 서버 재시작

### 문제 3: 레이아웃이 이상함

**증상:**
- 모든 요소가 가운데 정렬
- 카드가 세로로 배치

**해결:**
1. `App.css` 내용 삭제
2. `index.css`의 `:root` 스타일 확인

### 문제 4: index.css가 로드 안 됨

**증상:**
- 브라우저 Network 탭에 `index.css` 없음
- content.css만 로드됨

**해결:**
1. Vite 캐시 삭제
   ```bash
   Remove-Item -Recurse -Force node_modules/.vite
   ```

2. 서버 재시작

---

## 핵심 체크리스트

설치 완료를 위한 필수 항목:

- [ ] **Step 1:** TypeScript 경로 별칭 (tsconfig.json, tsconfig.app.json, vite.config.ts)
- [ ] **Step 2:** shadcn init 완료 (components.json 생성)
- [ ] **Step 3:** @tailwindcss/postcss 설치 및 vite.config.ts 설정
- [ ] **Step 4:** index.css 수정 (CSS 변수)
- [ ] **Step 5:** App.css 비우기
- [ ] **Step 6:** 4개 컴포넌트 설치 (button, input, checkbox, card)
- [ ] **Step 7:** App.tsx 작성
- [ ] **Step 8:** 개발 서버 재시작
- [ ] **Step 9:** 브라우저 확인

---

## 주요 명령어 요약

```bash
# shadcn 초기화
npx shadcn@latest init

# PostCSS 플러그인 설치 (필수!)
npm install -D @tailwindcss/postcss

# 컴포넌트 설치
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add checkbox
npx shadcn@latest add card

# 캐시 삭제 (문제 발생 시)
Remove-Item -Recurse -Force node_modules/.vite

# 서버 재시작
npm run dev
```

---

## C# 개발자를 위한 참고사항

### 경로 별칭
**TypeScript:**
```typescript
import { Button } from "@/components/ui/button"
```

**C#:**
```csharp
using MyProject.Components.UI;
```

### Props
**TypeScript:**
```tsx
<Button variant="destructive" size="sm">삭제</Button>
```

**C# (WPF):**
```xml
<Button Style="{StaticResource DestructiveButton}" Size="Small">삭제</Button>
```

### CSS 변수
**Tailwind:**
```css
:root {
  --primary: 222.2 47.4% 11.2%;
}
```

**C# (XAML):**
```xml
<SolidColorBrush x:Key="Primary" Color="#1a1a1a"/>
```

---

## 다음 단계

3단계 완료 후 **4단계: API 연동**으로 진행합니다.

4단계에서 배울 내용:
- fetch/axios로 REST API 호출
- 로딩 상태 관리
- 에러 핸들링
- async/await 패턴
- useEffect Hook

---

**작성일:** 2025-10-07
**테스트 환경:** Windows 11, Node.js v22.18.0
**Tailwind CSS:** v4.1.14
**shadcn/ui 스타일:** New York
**소요 시간:** 2-3시간
**난이도:** ⭐⭐⭐☆☆

**이 가이드는 실제 설치 과정에서 발생한 모든 문제를 해결한 완전한 버전입니다!**
