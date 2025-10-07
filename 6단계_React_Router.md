# 6단계: React Router (페이지 라우팅)

## 목표
단일 페이지 앱(SPA)에서 다중 페이지 앱으로 확장하여 네비게이션 구현

**학습 내용:**
- React Router v6 설치 및 설정
- 라우트 정의
- 네비게이션 컴포넌트
- URL 파라미터
- Protected Routes
- 404 페이지

---

## Step 1: React Router 설치

### 1-1. 패키지 설치

```bash
npm install react-router-dom
```

### 1-2. 설치 확인

`package.json`:
```json
{
  "dependencies": {
    "react-router-dom": "^6.x.x"
  }
}
```

---

## Step 2: 폴더 구조 개선

### 2-1. pages 폴더 생성

```
src/
├── pages/
│   ├── HomePage.tsx           ← 새로 생성
│   ├── TodosPage.tsx          ← 새로 생성
│   ├── TodoDetailPage.tsx     ← 새로 생성
│   ├── AboutPage.tsx          ← 새로 생성
│   ├── LoginPage.tsx          ← 새로 생성
│   └── NotFoundPage.tsx       ← 새로 생성
├── components/
│   ├── layout/
│   │   ├── Header.tsx         ← 새로 생성
│   │   └── Layout.tsx         ← 새로 생성
│   └── ...
└── App.tsx
```

---

## Step 3: Layout 컴포넌트 생성

### 3-1. Header.tsx

**파일:** `src/components/layout/Header.tsx`

```tsx
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Todo App
          </Link>

          {/* 네비게이션 */}
          <nav className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              홈
            </NavLink>
            <NavLink
              to="/todos"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              할 일
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              소개
            </NavLink>
          </nav>

          {/* 로그인 버튼 */}
          <Link to="/login">
            <Button>로그인</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

### 3-2. Layout.tsx

**파일:** `src/components/layout/Layout.tsx`

```tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

**설명:**
- `<Outlet />`: 자식 라우트가 렌더링될 위치

---

## Step 4: 페이지 컴포넌트 생성

### 4-1. HomePage.tsx

**파일:** `src/pages/HomePage.tsx`

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function HomePage() {
  const todos = useTodoStore((state) => state.todos);
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="space-y-8">
      {/* 환영 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            할 일 관리 앱에 오신 것을 환영합니다!
          </CardTitle>
          <CardDescription className="text-lg">
            효율적으로 할 일을 관리하고 생산성을 높이세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button size="lg">시작하기 →</Button>
          </Link>
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-600">
              {total}
            </CardTitle>
            <CardDescription>전체 할 일</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-600">
              {completed}
            </CardTitle>
            <CardDescription>완료된 할 일</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-orange-600">
              {pending}
            </CardTitle>
            <CardDescription>남은 할 일</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ 간편한 관리</CardTitle>
            <CardDescription>
              할 일을 쉽게 추가하고 관리할 수 있습니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔄 실시간 동기화</CardTitle>
            <CardDescription>
              API를 통해 데이터를 실시간으로 동기화합니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 통계 제공</CardTitle>
            <CardDescription>
              진행 상황을 한눈에 확인할 수 있습니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎨 아름다운 UI</CardTitle>
            <CardDescription>
              shadcn/ui로 만든 세련된 디자인
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
```

### 4-2. TodosPage.tsx

**파일:** `src/pages/TodosPage.tsx`

```tsx
import { useEffect } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoHeader } from "@/components/TodoHeader";
import { TodoInput } from "@/components/TodoInput";
import { TodoStats } from "@/components/TodoStats";
import { TodoList } from "@/components/TodoList";
import { ErrorAlert } from "@/components/ErrorAlert";

export function TodosPage() {
  const { loading, todos, fetchTodos } = useTodoStore();

  useEffect(() => {
    if (todos.length === 0) {
      fetchTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TodoHeader />
      <ErrorAlert />
      <TodoInput />
      <TodoStats />
      <TodoList />
    </div>
  );
}
```

### 4-3. TodoDetailPage.tsx

**파일:** `src/pages/TodoDetailPage.tsx`

```tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTodoStore } from "@/store/useTodoStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todos, toggleTodo, removeTodo } = useTodoStore();

  const todo = todos.find((t) => t.id === Number(id));

  if (!todo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>할 일을 찾을 수 없습니다</CardTitle>
          <CardDescription>존재하지 않는 할 일입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async () => {
    await removeTodo(todo.id);
    navigate("/todos");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">할 일 상세</CardTitle>
          <CardDescription>ID: {todo.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 내용 */}
          <div>
            <h3 className="font-semibold mb-2">내용</h3>
            <p className="text-lg">{todo.title}</p>
          </div>

          {/* 완료 상태 */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="completed"
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            <label htmlFor="completed" className="cursor-pointer">
              {todo.completed ? "완료됨 ✅" : "미완료"}
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Link to="/todos">
              <Button variant="outline">← 목록으로</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4-4. AboutPage.tsx

**파일:** `src/pages/AboutPage.tsx`

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Todo 앱 소개</CardTitle>
          <CardDescription>React + TypeScript로 만든 현대적인 할 일 관리 앱</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">🚀 기술 스택</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Tailwind CSS v4</li>
              <li>shadcn/ui</li>
              <li>Zustand (상태 관리)</li>
              <li>Axios (HTTP)</li>
              <li>React Router (라우팅)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">✨ 주요 기능</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>할 일 추가/수정/삭제</li>
              <li>완료 상태 관리</li>
              <li>API 연동 (JSONPlaceholder)</li>
              <li>로딩/에러 처리</li>
              <li>반응형 디자인</li>
              <li>다중 페이지 라우팅</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">👨‍💻 개발자</h3>
            <p>C# 백엔드 개발자의 프론트엔드 학습 프로젝트</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4-5. LoginPage.tsx (준비)

**파일:** `src/pages/LoginPage.tsx`

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>9단계에서 구현 예정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <Input type="email" placeholder="your@email.com" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <Button className="w-full" disabled>
            로그인 (준비 중)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4-6. NotFoundPage.tsx

**파일:** `src/pages/NotFoundPage.tsx`

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-6xl text-center">404</CardTitle>
          <CardDescription className="text-center text-lg">
            페이지를 찾을 수 없습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">요청하신 페이지가 존재하지 않습니다.</p>
          <Link to="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 5: App.tsx 라우터 설정

### 5-1. App.tsx 전체 수정

**파일:** `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { TodosPage } from "./pages/TodosPage";
import { TodoDetailPage } from "./pages/TodoDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout을 사용하는 라우트 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/:id" element={<TodoDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**주요 개념:**

**BrowserRouter:**
- HTML5 History API 사용
- 깔끔한 URL (/#/ 없음)

**Routes & Route:**
- 라우트 정의
- `path`: URL 경로
- `element`: 렌더링할 컴포넌트

**중첩 라우트:**
```tsx
<Route path="/" element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="todos" element={<TodosPage />} />
</Route>
```
- Layout의 `<Outlet />`에 자식 라우트가 렌더링됨

**동적 라우트:**
```tsx
<Route path="todos/:id" element={<TodoDetailPage />} />
```
- `:id`는 URL 파라미터
- `useParams()` Hook으로 접근

---

## Step 6: TodoList에 링크 추가

### 6-1. TodoItem.tsx 수정

**파일:** `src/components/TodoItem.tsx`

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/store/useTodoStore";

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    completed: boolean;
  };
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo } = useTodoStore();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        <Link
          to={`/todos/${todo.id}`}
          className="flex-1"
        >
          <span
            className={`hover:text-blue-600 transition-colors cursor-pointer ${
              todo.completed
                ? "line-through text-gray-400"
                : "text-gray-900"
            }`}
          >
            {todo.title}
          </span>
        </Link>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => removeTodo(todo.id)}
      >
        삭제
      </Button>
    </div>
  );
}
```

---

## Step 7: 테스트

### 7-1. 개발 서버 시작

```bash
npm run dev
```

### 7-2. 테스트 항목

1. **네비게이션**
   - Header의 링크 클릭
   - 현재 페이지 하이라이트 확인

2. **페이지 이동**
   - `/` - 홈 페이지
   - `/todos` - Todo 목록
   - `/todos/1` - Todo 상세
   - `/about` - 소개 페이지
   - `/login` - 로그인 페이지

3. **Todo 클릭**
   - Todo 제목 클릭
   - 상세 페이지로 이동
   - 뒤로 가기

4. **404 페이지**
   - `/nonexistent` 접속
   - 404 페이지 표시

5. **브라우저 뒤로/앞으로 가기**
   - 정상 작동 확인

---

## 핵심 개념 정리

### 1. BrowserRouter vs HashRouter

**BrowserRouter (추천):**
```
https://example.com/todos
https://example.com/about
```

**HashRouter:**
```
https://example.com/#/todos
https://example.com/#/about
```

### 2. Link vs NavLink

**Link:**
```tsx
<Link to="/todos">할 일</Link>
```

**NavLink (활성 상태 스타일):**
```tsx
<NavLink
  to="/todos"
  className={({ isActive }) =>
    isActive ? "text-blue-600" : "text-gray-600"
  }
>
  할 일
</NavLink>
```

### 3. useParams

```tsx
const { id } = useParams<{ id: string }>();
const todo = todos.find(t => t.id === Number(id));
```

### 4. useNavigate

```tsx
const navigate = useNavigate();
navigate("/todos"); // 프로그래밍 방식 이동
navigate(-1); // 뒤로 가기
```

---

## C# 개발자를 위한 비교

### ASP.NET Core MVC vs React Router

**ASP.NET Core:**
```csharp
[Route("todos")]
public class TodoController : Controller
{
    [HttpGet]
    public IActionResult Index() => View();

    [HttpGet("{id}")]
    public IActionResult Details(int id) => View();
}
```

**React Router:**
```tsx
<Route path="todos" element={<TodosPage />} />
<Route path="todos/:id" element={<TodoDetailPage />} />
```

---

## 체크리스트

- [ ] React Router 설치
- [ ] Layout 컴포넌트 생성
- [ ] Header 컴포넌트 생성
- [ ] 6개 페이지 생성
- [ ] App.tsx 라우터 설정
- [ ] TodoItem 링크 추가
- [ ] 모든 페이지 테스트
- [ ] 네비게이션 테스트
- [ ] 404 페이지 테스트

---

## 다음 단계

6단계를 완료했다면 **7단계: React Hook Form + Zod**로 진행합니다.

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐☆☆
**소요 시간:** 2-3시간
