# 3단계: shadcn/ui 적용하기 - 완전 가이드 (Tailwind CSS v4)

## 목표
Todo 앱을 shadcn/ui 컴포넌트로 업그레이드하여 프로페셔널한 UI 만들기

**이 파일은 처음부터 끝까지 모든 명령어와 설정을 포함합니다. 복습 시 이 파일만 보고 따라하면 됩니다.**

---

## 사전 준비 확인

현재 프로젝트 상태:
- ✅ React + TypeScript 프로젝트 생성됨
- ✅ Tailwind CSS v4 설치됨 (`package.json` 확인)
- ✅ 개발 서버 실행 중 (`npm run dev`)

---

## 1단계: Tailwind CSS v4 설정

### 1-1. index.css 수정

**파일 경로:** `src/index.css`

**기존 내용을 모두 삭제하고** 다음 내용으로 교체:

```css
@import "tailwindcss";

/* 기본 스타일 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

**설명:**
- Tailwind v4는 `@import "tailwindcss"` 한 줄이면 충분
- v3의 `@tailwind base/components/utilities`는 필요 없음
- 기본 스타일도 간단하게 리셋

### 1-2. 테스트

브라우저에서 `http://localhost:5173` 확인
- 기존 스타일이 사라지고 깔끔해져야 정상

---

## 2단계: shadcn/ui 설치 및 설정

### 2-1. shadcn/ui 초기화

터미널에서 다음 명령어 실행:

```bash
npx shadcn@latest init
```

### 2-2. 대화형 질문에 답하기

명령어 실행 시 다음과 같은 질문들이 나타납니다:

```
? Which style would you like to use? ›
  New York
❯ Default
```
**선택:** `Default` (엔터)

```
? Which color would you like to use as base color? ›
  Zinc
❯ Slate
  Stone
  Gray
  Neutral
  Red
  ...
```
**선택:** `Slate` (엔터)

```
? Would you like to use CSS variables for colors? ›
❯ yes
  no
```
**선택:** `yes` (엔터)

**CSS 변수를 사용하면:**
- 테마를 쉽게 커스터마이징 가능
- 다크 모드 지원 간편

```
? Are you using a custom tailwind prefix eg. tw-? (Leave blank if not) ›
```
**선택:** 그냥 엔터 (prefix 없음)

```
? Where is your global CSS file? ›
❯ src/index.css
```
**선택:** 엔터 (기본값 사용)

```
? Where is your tailwind.config.js located? ›
❯ tailwind.config.js
```
**선택:** 엔터 (기본값 사용)

**주의:** Tailwind v4는 config 파일이 필요 없지만, shadcn은 자동으로 생성합니다.

```
? Configure the import alias for components? ›
❯ @/components
```
**선택:** 엔터 (기본값 사용)

```
? Configure the import alias for utils? ›
❯ @/lib/utils
```
**선택:** 엔터 (기본값 사용)

```
? Are you using React Server Components? ›
  yes
❯ no
```
**선택:** `no` (엔터) - Vite는 클라이언트 사이드

```
? Write configuration to components.json. Proceed? ›
❯ yes
  no
```
**선택:** `yes` (엔터)

### 2-3. 설치 완료 확인

다음 파일/폴더가 생성되었는지 확인:

```
my-first-react-app/
├── components.json          ← 새로 생성됨
├── src/
│   ├── lib/
│   │   └── utils.ts        ← 새로 생성됨
│   └── components/         ← 새로 생성됨 (비어있음)
```

### 2-4. 발생 가능한 경고

```
Warning: You're using Tailwind CSS v4, but shadcn/ui is designed for v3...
```

**무시하세요!** v4에서도 잘 작동합니다.

---

## 3단계: TypeScript 경로 별칭 설정

shadcn/ui는 `@/components`처럼 경로 별칭을 사용합니다.
TypeScript와 Vite에서 이를 인식하도록 설정해야 합니다.

### 3-1. tsconfig.app.json 수정

**파일 경로:** `tsconfig.app.json`

기존 파일을 열어서 `compilerOptions`에 다음을 추가:

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

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    /* Path Alias - 추가! */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 3-2. vite.config.ts 수정

**파일 경로:** `vite.config.ts`

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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**설명:**
- `path` 모듈 import 추가
- `resolve.alias` 설정 추가
- `@/components/ui/button` → `src/components/ui/button`으로 해석됨

### 3-3. 개발 서버 재시작

설정 파일을 수정했으므로 개발 서버를 재시작해야 합니다.

터미널에서:
1. `Ctrl + C` (서버 중지)
2. `npm run dev` (서버 재시작)

---

## 4단계: shadcn/ui 컴포넌트 설치

### 4-1. Button 컴포넌트 설치

```bash
npx shadcn@latest add button
```

**설치 과정:**
```
✔ Checking registry...
✔ Installing dependencies...
✔ Created src/components/ui/button.tsx
```

**생성된 파일:** `src/components/ui/button.tsx`

### 4-2. Input 컴포넌트 설치

```bash
npx shadcn@latest add input
```

**생성된 파일:** `src/components/ui/input.tsx`

### 4-3. Checkbox 컴포넌트 설치

```bash
npx shadcn@latest add checkbox
```

**설치 시 추가 의존성 설치:**
```
✔ Installing @radix-ui/react-checkbox...
```

**생성된 파일:** `src/components/ui/checkbox.tsx`

### 4-4. Card 컴포넌트 설치

```bash
npx shadcn@latest add card
```

**생성된 파일:** `src/components/ui/card.tsx`

### 4-5. 설치 확인

`src/components/ui/` 폴더에 다음 파일들이 있는지 확인:

```
src/
└── components/
    └── ui/
        ├── button.tsx
        ├── input.tsx
        ├── checkbox.tsx
        └── card.tsx
```

**중요:** 이 파일들은 일반 React 컴포넌트입니다!
- 직접 수정 가능
- npm 패키지가 아님
- 프로젝트 코드의 일부

---

## 5단계: index.css에 shadcn 스타일 추가

### 5-1. src/index.css 최종 수정

`src/index.css` 파일을 다음과 같이 수정:

```css
@import "tailwindcss";

/* shadcn/ui CSS 변수 */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
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
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
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

**설명:**
- CSS 변수로 테마 색상 정의
- shadcn/ui 컴포넌트가 이 변수들을 사용
- 나중에 변수 값만 바꾸면 전체 테마 변경 가능

---

## 6단계: App.tsx를 shadcn/ui로 리팩토링

### 6-1. 전체 코드 교체

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

### 6-2. 주요 변경사항

**1. Import 문**
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, ... } from "@/components/ui/card";
```
- `@/`는 `src/`를 의미
- shadcn/ui 컴포넌트 사용

**2. 인라인 스타일 → Tailwind 클래스**

**Before:**
```tsx
<button
  style={{
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
```

**After:**
```tsx
<Button>추가</Button>
```

훨씬 간결!

**3. Card 컴포넌트 구조**
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

**4. Button variant**
```tsx
<Button variant="destructive" size="sm">
  삭제
</Button>
```
- `variant`: default, destructive, outline, ghost 등
- `size`: default, sm, lg, icon

---

## 7단계: App.css 정리 (선택사항)

`src/App.css` 파일은 더 이상 필요 없습니다.

**옵션 1: 파일 삭제**
- `src/App.css` 삭제
- `App.tsx`에서 `import './App.css'` 제거

**옵션 2: 빈 파일로 유지**
- 파일은 그대로 두고 내용만 삭제
- import 문은 유지

---

## 8단계: 최종 테스트

### 8-1. 브라우저에서 확인

`http://localhost:5173` 접속

**확인 사항:**
- ✨ 그라데이션 배경 (파란색 → 보라색)
- 📦 깔끔한 카드 레이아웃
- 🎨 통일된 디자인
- 🖱️ 버튼 호버 효과
- ✅ 체크박스 애니메이션
- 🗑️ 빨간 삭제 버튼

### 8-2. 기능 테스트

1. **할 일 추가**
   - 입력창에 텍스트 입력
   - 추가 버튼 클릭 또는 엔터
   - 목록에 추가되는지 확인

2. **체크박스**
   - 체크박스 클릭
   - 텍스트에 취소선 생기는지 확인
   - 통계 업데이트 확인

3. **삭제**
   - 삭제 버튼 클릭
   - 항목이 사라지는지 확인

4. **통계**
   - 전체/완료/미완료 숫자 정확한지 확인

---

## 문제 해결

### 문제 1: `Cannot find module '@/components/ui/button'`

**원인:** 경로 별칭 설정이 안 됨

**해결:**
1. `tsconfig.app.json`에 `baseUrl`과 `paths` 확인
2. `vite.config.ts`에 `alias` 설정 확인
3. 개발 서버 재시작: `Ctrl+C` 후 `npm run dev`

### 문제 2: 스타일이 적용 안 됨

**원인:** Tailwind CSS가 로드되지 않음

**해결:**
1. `src/index.css`에 `@import "tailwindcss"` 확인
2. shadcn CSS 변수 추가 확인
3. 브라우저 캐시 삭제 (`Ctrl+Shift+R`)

### 문제 3: Checkbox가 클릭 안 됨

**원인:** `@radix-ui/react-checkbox` 미설치

**해결:**
```bash
npm install @radix-ui/react-checkbox
```

### 문제 4: Button 스타일이 이상함

**원인:** CSS 변수 충돌

**해결:**
1. `src/index.css`의 CSS 변수 다시 확인
2. 특히 `--primary`, `--destructive` 값 확인

---

## Tailwind CSS 클래스 치트시트

### 레이아웃
```
flex                 Flexbox
grid                 Grid
block                Block
inline-block         Inline-block
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
m-4                  margin 1rem
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
bg-blue-500          배경 파란색
text-gray-900        텍스트 진한 회색
border-red-300       테두리 빨간색
```

### 텍스트
```
text-sm              작은 글씨
text-xl              큰 글씨
text-3xl             매우 큰 글씨
font-bold            굵게
text-center          중앙 정렬
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

### className vs Class

**TypeScript (Tailwind):**
```tsx
<div className="flex items-center gap-3">
```

**C# (HTML Helper):**
```csharp
@Html.Div(new { @class = "flex items-center gap-3" })
```

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

- [ ] Tailwind CSS v4 설치 확인
- [ ] `src/index.css`에 `@import "tailwindcss"` 추가
- [ ] `npx shadcn@latest init` 실행 및 설정 완료
- [ ] `components.json` 파일 생성 확인
- [ ] `tsconfig.app.json`에 경로 별칭 추가
- [ ] `vite.config.ts`에 alias 설정 추가
- [ ] 개발 서버 재시작
- [ ] Button, Input, Checkbox, Card 컴포넌트 설치
- [ ] `src/components/ui/` 폴더에 파일 생성 확인
- [ ] `src/index.css`에 shadcn CSS 변수 추가
- [ ] `App.tsx` 코드 교체
- [ ] 브라우저에서 새 디자인 확인
- [ ] 모든 기능 테스트 (추가/체크/삭제)
- [ ] Tailwind 클래스 이해

---

## 추가 학습 과제 (선택)

더 공부하고 싶다면:

### 1. 다크 모드 추가
- shadcn/ui는 다크 모드 기본 지원
- `next-themes` 라이브러리 사용
- 토글 버튼 추가

### 2. 다른 shadcn 컴포넌트 사용
```bash
npx shadcn@latest add dialog     # 모달
npx shadcn@latest add select     # 드롭다운
npx shadcn@latest add badge      # 뱃지
npx shadcn@latest add alert      # 알림
```

### 3. 폼 유효성 검사
```bash
npx shadcn@latest add form
npm install react-hook-form zod
```
- 입력 유효성 검사
- 에러 메시지 표시

### 4. 애니메이션 추가
```bash
npm install framer-motion
```
- Todo 추가/삭제 애니메이션
- 부드러운 전환 효과

---

## 참고 자료

### 공식 문서
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com

### 유용한 링크
- **Tailwind 색상 팔레트:** https://tailwindcss.com/docs/customizing-colors
- **shadcn 테마 생성기:** https://ui.shadcn.com/themes
- **Tailwind 플레이그라운드:** https://play.tailwindcss.com

---

**작성일:** 2025-10-07
**Tailwind 버전:** v4.1.14
**소요 시간:** 2-3시간
**난이도:** ⭐⭐⭐☆☆

**이 파일 하나로 처음부터 끝까지 shadcn/ui 설치 및 적용을 완료할 수 있습니다!**
