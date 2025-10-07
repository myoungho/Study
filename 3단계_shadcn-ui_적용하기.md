# 3단계: shadcn/ui 적용하기

## 목표
Todo 앱을 shadcn/ui 컴포넌트로 업그레이드하여 프로페셔널한 UI 만들기

---

## shadcn/ui란?

### 특징
- **Copy-Paste 방식**: 컴포넌트를 직접 프로젝트에 복사
- **완전한 커스터마이징 가능**: 코드가 내 프로젝트에 있어서 자유롭게 수정
- **Tailwind CSS 기반**: 유틸리티 클래스로 스타일링
- **Radix UI 기반**: 접근성 좋은 Headless UI
- **TypeScript 지원**: 타입 안정성

### 왜 인기있나?
- Material-UI, Ant Design과 달리 **무겁지 않음**
- npm 패키지가 아니라 **내 코드가 됨**
- 최신 트렌드: Vercel, Next.js 공식 추천

---

## 1단계: Tailwind CSS 설치

### Tailwind CSS란?

유틸리티 클래스 기반 CSS 프레임워크

**기존 CSS:**
```css
.button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border-radius: 5px;
}
```

**Tailwind CSS:**
```jsx
<button className="px-5 py-2.5 bg-blue-500 text-white rounded">
  버튼
</button>
```

### C# 개발자를 위한 비교
- Bootstrap과 유사하지만 더 세밀한 제어
- 인라인 스타일처럼 보이지만 실제로는 최적화된 CSS 생성

### 실습

터미널에서 다음 명령어를 **순서대로** 실행하세요:

```bash
# 1. Tailwind CSS 및 관련 패키지 설치
npm install -D tailwindcss postcss autoprefixer

# 2. Tailwind 설정 파일 생성
npx tailwindcss init -p
```

실행 후 프로젝트에 다음 파일들이 생성됩니다:
- `tailwind.config.js`
- `postcss.config.js`

---

## 2단계: Tailwind 설정

### tailwind.config.js 수정

`tailwind.config.js` 파일을 열고 다음과 같이 수정하세요:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**설명:**
- `content`: Tailwind가 스캔할 파일 경로
- 이 파일들에서 사용된 클래스만 최종 CSS에 포함 (번들 크기 최적화)

### src/index.css 수정

`src/index.css` 파일을 열고 **맨 위에** Tailwind 지시문을 추가하세요:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 기존 스타일은 아래에 유지 */
```

**테스트:**
개발 서버가 실행 중이면 자동으로 새로고침됩니다.
Tailwind가 제대로 적용되었는지 확인하려면 `App.tsx`에서 간단히 테스트:

```tsx
<h1 className="text-3xl font-bold text-blue-500">나의 Todo 앱</h1>
```

파란색 큰 글씨가 나타나면 성공!

---

## 3단계: shadcn/ui 설치

### 실습

터미널에서 다음 명령어를 실행하세요:

```bash
npx shadcn@latest init
```

**대화형 설정이 나타납니다. 다음과 같이 선택하세요:**

```
√ Preflight and global CSS variables. » Yes
√ Default CSS variables. » Slate
√ CSS variables for theming. » Yes
√ Import alias for components. » @/components
√ Import alias for utils. » @/lib/utils
√ React Server Components. » No
√ Write components to. » src/components
```

**설명:**
- `Slate`: 색상 테마 (회색 계열)
- `@/components`: import 경로 별칭 (C#의 using alias와 유사)
- `src/components`: 컴포넌트가 저장될 폴더

설치가 완료되면 다음 파일/폴더가 생성됩니다:
- `src/components/` (폴더)
- `src/lib/utils.ts`
- `components.json`

---

## 4단계: 필요한 컴포넌트 설치

### 실습

Todo 앱에 사용할 shadcn/ui 컴포넌트들을 설치하세요:

```bash
# 버튼 컴포넌트
npx shadcn@latest add button

# 입력창 컴포넌트
npx shadcn@latest add input

# 체크박스 컴포넌트
npx shadcn@latest add checkbox

# 카드 컴포넌트
npx shadcn@latest add card
```

**각 명령어를 실행할 때마다:**
- `src/components/ui/` 폴더에 컴포넌트 파일이 생성됨
- 예: `button.tsx`, `input.tsx`, `checkbox.tsx`, `card.tsx`

**중요:**
- 이 파일들은 **npm 패키지가 아닌 내 프로젝트 파일**
- 언제든지 수정 가능
- 이것이 shadcn/ui의 핵심 철학!

---

## 5단계: App.tsx를 shadcn/ui로 리팩토링

### 기존 코드와 비교

**기존 (인라인 스타일):**
```tsx
<button
  onClick={addTodo}
  style={{
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  추가
</button>
```

**shadcn/ui (Tailwind 클래스):**
```tsx
<Button onClick={addTodo}>
  추가
</Button>
```

훨씬 간결하고 일관성 있는 디자인!

### 실습: App.tsx 전체 수정

`src/App.tsx` 파일을 다음과 같이 수정하세요:

```tsx
import { useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TodoItem {
  id: number
  text: string
  isCompleted: boolean
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState<string>('')

  const addTodo = () => {
    if (inputText.trim() === '') return
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText,
      isCompleted: false,
    }
    setTodos([...todos, newTodo])
    setInputText('')
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

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
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="할 일을 입력하세요"
                className="flex-1"
              />
              <Button onClick={addTodo}>
                추가
              </Button>
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
                            ? 'line-through text-gray-400'
                            : 'text-gray-900'
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
  )
}

export default App
```

---

## 6단계: 주요 변경사항 설명

### 1. Import 문
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
```

**C# 비교:**
```csharp
using MyProject.Components.UI;
```

`@/`는 `src/`의 별칭입니다.

### 2. Tailwind 클래스

**레이아웃:**
```tsx
className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
```
- `min-h-screen`: 최소 높이 100vh
- `bg-gradient-to-br`: 그라데이션 (왼쪽 위 → 오른쪽 아래)
- `from-blue-50 to-indigo-100`: 색상
- `p-8`: padding 2rem

**그리드:**
```tsx
className="grid grid-cols-3 gap-4"
```
- `grid`: CSS Grid
- `grid-cols-3`: 3개 열
- `gap-4`: 간격 1rem

**Flexbox:**
```tsx
className="flex items-center gap-3"
```
- `flex`: Flexbox
- `items-center`: 수직 중앙 정렬
- `gap-3`: 간격 0.75rem

### 3. shadcn/ui 컴포넌트 Props

**Button:**
```tsx
<Button variant="destructive" size="sm">
  삭제
</Button>
```
- `variant`: 스타일 변형 (default, destructive, outline, ghost)
- `size`: 크기 (default, sm, lg, icon)

**Card:**
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

구조화된 레이아웃 제공

### 4. 조건부 클래스
```tsx
className={`${
  todo.isCompleted
    ? 'line-through text-gray-400'
    : 'text-gray-900'
}`}
```

**C# 비교:**
```csharp
var className = todo.IsCompleted
  ? "line-through text-gray-400"
  : "text-gray-900";
```

---

## 7단계: 결과 확인

### 테스트

브라우저에서 `http://localhost:5173`을 확인하세요.

**변경사항:**
- ✨ 그라데이션 배경
- 📦 카드 레이아웃
- 🎨 일관된 디자인
- 🖱️ 호버 효과
- 📱 반응형 레이아웃 (자동!)

---

## Tailwind CSS 주요 클래스 정리

### 간격 (Spacing)
```
p-4      padding: 1rem
px-4     padding-left, padding-right: 1rem
py-4     padding-top, padding-bottom: 1rem
m-4      margin: 1rem
gap-4    gap: 1rem (Flexbox/Grid)
```

### 색상 (Colors)
```
bg-blue-500        배경색
text-gray-900      텍스트 색
border-red-300     테두리 색

숫자가 클수록 진함 (50~900)
```

### 레이아웃 (Layout)
```
flex               display: flex
grid               display: grid
block              display: block
hidden             display: none

items-center       align-items: center
justify-between    justify-content: space-between
```

### 크기 (Sizing)
```
w-full             width: 100%
h-screen           height: 100vh
max-w-2xl          max-width: 42rem
min-h-screen       min-height: 100vh
```

### 텍스트 (Typography)
```
text-sm            font-size: 0.875rem
text-xl            font-size: 1.25rem
text-3xl           font-size: 1.875rem
font-bold          font-weight: 700
text-center        text-align: center
```

### 테두리 (Border)
```
border             border: 1px solid
rounded            border-radius: 0.25rem
rounded-lg         border-radius: 0.5rem
rounded-full       border-radius: 9999px
```

### 효과 (Effects)
```
shadow             box-shadow (작음)
shadow-md          box-shadow (중간)
shadow-lg          box-shadow (큼)
hover:shadow-lg    호버 시 그림자
transition-shadow  transition: box-shadow
```

---

## C# 개발자를 위한 Tailwind 이해

### 클래스명 패턴

**prefix-value 형식:**
```
p-4        padding: 1rem (4 * 0.25rem)
text-lg    font-size: large
bg-blue    background: blue
```

**responsive prefix:**
```
sm:text-lg     640px 이상에서 적용
md:text-xl     768px 이상에서 적용
lg:text-2xl    1024px 이상에서 적용
```

**state prefix:**
```
hover:bg-blue-500    호버 시
focus:ring-2         포커스 시
active:scale-95      클릭 시
```

### 조합 예시
```tsx
<button className="
  px-4 py-2              /* 간격 */
  bg-blue-500            /* 배경색 */
  text-white             /* 텍스트 색 */
  rounded-lg             /* 둥근 모서리 */
  hover:bg-blue-600      /* 호버 시 진한 파란색 */
  active:scale-95        /* 클릭 시 살짝 축소 */
  transition-all         /* 부드러운 전환 */
">
  버튼
</button>
```

---

## shadcn/ui 컴포넌트 커스터마이징

### 컴포넌트 파일 직접 수정

`src/components/ui/button.tsx` 파일을 열면:
- 일반 React 컴포넌트
- 자유롭게 수정 가능
- variants를 추가하거나 스타일 변경 가능

**예: 새로운 variant 추가**
```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // 새로운 variant 추가
        success: "bg-green-500 text-white hover:bg-green-600",
      },
      // ...
    }
  }
)
```

사용:
```tsx
<Button variant="success">성공</Button>
```

---

## 실습 체크리스트

- [ ] Tailwind CSS 설치 완료
- [ ] tailwind.config.js 설정 완료
- [ ] index.css에 Tailwind 지시문 추가
- [ ] shadcn/ui 초기화 완료
- [ ] Button, Input, Checkbox, Card 컴포넌트 설치
- [ ] App.tsx를 shadcn/ui로 리팩토링
- [ ] 브라우저에서 새로운 디자인 확인
- [ ] Tailwind 클래스 이해

---

## 추가 학습 리소스

### Tailwind CSS
- 공식 문서: https://tailwindcss.com/docs
- 검색 기능이 매우 좋음
- 클래스명 모르면 바로 검색!

### shadcn/ui
- 공식 문서: https://ui.shadcn.com
- 모든 컴포넌트 예제와 코드 제공
- 다른 컴포넌트들도 구경해보세요:
  - Dialog (모달)
  - Select (드롭다운)
  - Tabs (탭)
  - Form (폼)
  - Table (테이블)

---

## 다음 단계

3단계를 완료했다면 **4단계: API 연동**으로 진행합니다.

4단계에서는:
- fetch/axios로 REST API 호출
- JSONPlaceholder API 사용
- 로딩 상태 관리
- 에러 핸들링
- async/await 사용

---

## 추가 실습 과제 (선택)

더 연습하고 싶다면:

1. **다크 모드 추가**
   - shadcn/ui는 다크 모드 기본 지원
   - 테마 전환 버튼 추가

2. **다른 컴포넌트 사용해보기**
   - Dialog로 삭제 확인 모달
   - Select로 필터 드롭다운
   - Badge로 우선순위 표시

3. **애니메이션 추가**
   - Todo 추가/삭제 시 애니메이션
   - framer-motion 라이브러리 사용

4. **레이아웃 개선**
   - 사이드바 추가
   - 여러 Todo 리스트 관리
   - 드래그 앤 드롭으로 순서 변경

---

**작성일**: 2025-10-07
**소요 시간**: 2-3시간
**난이도**: ⭐⭐⭐☆☆
