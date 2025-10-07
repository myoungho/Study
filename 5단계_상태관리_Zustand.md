# 5단계: 상태 관리 (Zustand)

## 목표

전역 상태 관리 라이브러리 Zustand를 사용하여 애플리케이션 상태를 효율적으로 관리

**학습 내용:**

- 전역 상태 관리의 필요성
- Zustand 라이브러리
- Store 생성
- Actions 정의
- Selectors 사용
- 컴포넌트 분리

**환경:**

- Windows 11
- Zustand v4 (최신 버전)

---

## Step 1: 왜 상태 관리가 필요한가?

### 현재 문제점

**Props Drilling (프롭 드릴링):**

```
App (todos, loading, error)
  ├─ Header (전달만 함)
  │   └─ TodoCount (todos 사용)
  ├─ TodoInput (addTodo 필요)
  └─ TodoList (todos, toggleTodo, deleteTodo 필요)
      └─ TodoItem (todo, toggleTodo, deleteTodo 필요)
```

깊이 있는 컴포넌트에 상태를 전달하려면 중간 컴포넌트를 거쳐야 함!

### 해결책: 전역 상태 관리

```
Store (todos, loading, error, actions)
     ↓
모든 컴포넌트가 직접 접근!
```

### C# 개발자를 위한 비교

**C# (Singleton Pattern):**

```csharp
public class TodoStore
{
    private static TodoStore _instance;
    public static TodoStore Instance => _instance ??= new TodoStore();

    public List<Todo> Todos { get; set; }
    public void AddTodo(Todo todo) { ... }
}

// 어디서든 접근
TodoStore.Instance.AddTodo(newTodo);
```

**TypeScript (Zustand):**

```typescript
const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
}));

// 어디서든 접근
const { todos, addTodo } = useTodoStore();
```

---

## Step 2: 상태 관리 라이브러리 비교

### 주요 라이브러리

| 라이브러리 | 크기 | 복잡도 | Boilerplate | 학습 곡선 |
| ---------- | ---- | ------ | ----------- | --------- |
| Redux      | 큼   | 높음   | 많음        | 높음      |
| MobX       | 중간 | 중간   | 중간        | 중간      |
| Zustand    | 작음 | 낮음   | 적음        | 낮음 ✅   |
| Jotai      | 작음 | 낮음   | 적음        | 중간      |
| Recoil     | 중간 | 중간   | 중간        | 중간      |

### Zustand를 선택하는 이유

**장점:**

- ✅ 매우 간단한 API
- ✅ 적은 보일러플레이트
- ✅ TypeScript 완벽 지원
- ✅ React Hooks 기반
- ✅ 작은 번들 크기 (1KB)
- ✅ DevTools 지원

**단점:**

- 대규모 애플리케이션에서는 Redux가 더 나을 수 있음
- 하지만 대부분의 경우 충분함!

---

## Step 3: Zustand 설치

### 3-1. 패키지 설치

터미널에서:

```bash
npm install zustand
```

### 3-2. 설치 확인

`package.json`:

```json
{
  "dependencies": {
    "zustand": "^4.x.x"
  }
}
```

---

## Step 4: Store 생성

### 4-1. store 폴더 생성

프로젝트 구조:

```
src/
├── api/
├── store/
│   └── useTodoStore.ts     ← 새로 생성
├── components/
├── App.tsx
└── ...
```

### 4-2. useTodoStore.ts 작성

**파일:** `src/store/useTodoStore.ts`

```typescript
import { create } from "zustand";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/api/todoApi";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoStore {
  // 상태
  todos: Todo[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  // 초기 상태
  todos: [],
  loading: false,
  error: null,

  // 할 일 목록 가져오기
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTodos();
      set({ todos: data.slice(0, 10), loading: false });
    } catch (error) {
      set({ error: "데이터를 불러오는데 실패했습니다.", loading: false });
    }
  },

  // 할 일 추가
  addTodo: async (title: string) => {
    if (!title.trim()) return;

    set({ loading: true });
    try {
      const newTodo = await createTodo(title);
      const currentTodos = get().todos;
      set({
        todos: [{ ...newTodo, id: Date.now(), title }, ...currentTodos],
        loading: false,
      });
    } catch (error) {
      set({ error: "할 일 추가에 실패했습니다.", loading: false });
    }
  },

  // 완료 상태 변경
  toggleTodo: async (id: number) => {
    const todos = get().todos;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, !todo.completed);
      set({
        todos: todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      });
    } catch (error) {
      set({ error: "상태 변경에 실패했습니다." });
    }
  },

  // 할 일 삭제
  removeTodo: async (id: number) => {
    try {
      await deleteTodo(id);
      const currentTodos = get().todos;
      set({ todos: currentTodos.filter((t) => t.id !== id) });
    } catch (error) {
      set({ error: "삭제에 실패했습니다." });
    }
  },

  // 에러 설정
  setError: (error: string | null) => {
    set({ error });
  },
}));
```

**주요 개념:**

**create 함수:**

- Zustand store를 생성
- `(set, get) => ({...})` 패턴

**set 함수:**

- 상태를 업데이트
- `set({ todos: newTodos })` - 전체 교체
- `set((state) => ({ todos: [...state.todos, newTodo] }))` - 현재 상태 사용

**get 함수:**

- 현재 상태를 읽기
- `const todos = get().todos`

### C# 비교

**TypeScript (Zustand):**

```typescript
export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  addTodo: async (title) => {
    const newTodo = await createTodo(title);
    const current = get().todos;
    set({ todos: [newTodo, ...current] });
  },
}));
```

**C#:**

```csharp
public class TodoStore
{
    private List<Todo> _todos = new List<Todo>();
    public IReadOnlyList<Todo> Todos => _todos;

    public event Action StateChanged;

    public async Task AddTodo(string title)
    {
        var newTodo = await CreateTodo(title);
        _todos.Insert(0, newTodo);
        StateChanged?.Invoke();
    }
}
```

---

## Step 5: App.tsx 리팩토링

### 5-1. Import 수정

**기존:**

```typescript
import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todoApi";
```

**수정 후:**

```typescript
import { useEffect } from "react";
import { useTodoStore } from "./store/useTodoStore";
```

### 5-2. 상태 제거 및 Store 사용

**기존:**

```typescript
const [todos, setTodos] = useState<TodoItem[]>([]);
const [inputText, setInputText] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

**수정 후:**

```typescript
const {
  todos,
  loading,
  error,
  fetchTodos,
  addTodo,
  toggleTodo,
  removeTodo,
  setError,
} = useTodoStore();
const [inputText, setInputText] = useState<string>("");
```

**설명:**

- `todos`, `loading`, `error`는 이제 store에서 가져옴
- `inputText`는 로컬 상태로 유지 (입력창은 전역 상태 불필요)

### 5-3. useEffect 수정

**기존:**

```typescript
useEffect(() => {
  fetchTodos();
}, []);
```

**수정 후:**

```typescript
useEffect(() => {
  fetchTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

**또는 더 나은 방법:**

```typescript
useEffect(() => {
  useTodoStore.getState().fetchTodos();
}, []);
```

### 5-4. 함수들 제거

**기존:**

```typescript
const fetchTodos = async () => { ... };
const addTodo = async () => { ... };
const toggleTodo = async (id: number) => { ... };
const handleDeleteTodo = async (id: number) => { ... };
```

**수정 후:**

```typescript
// 모두 제거! Store에 있음
// 단, addTodo는 inputText를 처리해야 하므로 래퍼 함수 필요
const handleAddTodo = async () => {
  await addTodo(inputText);
  setInputText("");
};
```

### 5-5. 전체 App.tsx 코드

```typescript
import { useEffect, useState } from "react";
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
import { useTodoStore } from "./store/useTodoStore";

function App() {
  const {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    setError,
  } = useTodoStore();

  const [inputText, setInputText] = useState<string>("");

  // 초기 데이터 로드
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 할 일 추가
  const handleAddTodo = async () => {
    await addTodo(inputText);
    setInputText("");
  };

  // 로딩 중
  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
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
              Zustand 상태 관리 버전
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 입력 카드 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                placeholder="할 일을 입력하세요"
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleAddTodo} disabled={loading}>
                {loading ? "추가 중..." : "추가"}
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
                  {todos.filter((todo) => todo.completed).length}
                </p>
                <p className="text-sm text-gray-600">완료</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {todos.filter((todo) => !todo.completed).length}
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
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <span
                        className={`${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTodo(todo.id)}
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

## Step 6: 컴포넌트 분리 (선택사항)

이제 상태 관리가 전역화되었으므로, 컴포넌트를 분리하기 쉬워졌습니다!

### 6-1. 폴더 구조

```
src/
├── components/
│   ├── TodoHeader.tsx       ← 새로 생성
│   ├── TodoInput.tsx        ← 새로 생성
│   ├── TodoStats.tsx        ← 새로 생성
│   ├── TodoList.tsx         ← 새로 생성
│   ├── TodoItem.tsx         ← 새로 생성
│   ├── ErrorAlert.tsx       ← 새로 생성
│   └── ui/
├── store/
├── api/
└── App.tsx
```

### 6-2. TodoHeader.tsx

```typescript
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TodoHeader() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          나의 Todo 앱
        </CardTitle>
        <CardDescription className="text-center">
          Zustand 상태 관리 버전
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
```

### 6-3. TodoInput.tsx

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function TodoInput() {
  const { loading, addTodo } = useTodoStore();
  const [inputText, setInputText] = useState("");

  const handleAddTodo = async () => {
    await addTodo(inputText);
    setInputText("");
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            placeholder="할 일을 입력하세요"
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={handleAddTodo} disabled={loading}>
            {loading ? "추가 중..." : "추가"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6-4. TodoStats.tsx

```typescript
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function TodoStats() {
  const todos = useTodoStore((state) => state.todos);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{total}</p>
            <p className="text-sm text-gray-600">전체</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-sm text-gray-600">완료</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{pending}</p>
            <p className="text-sm text-gray-600">미완료</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**주목:** `useTodoStore((state) => state.todos)`

- Selector를 사용하여 필요한 상태만 구독
- 성능 최적화!

### 6-5. TodoList.tsx

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoItem } from "@/components/TodoItem";

export function TodoList() {
  const todos = useTodoStore((state) => state.todos);

  return (
    <Card>
      <CardHeader>
        <CardTitle>할 일 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">할 일이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 6-6. TodoItem.tsx

```typescript
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
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        <span
          className={`${
            todo.completed ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {todo.title}
        </span>
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

### 6-7. ErrorAlert.tsx

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function ErrorAlert() {
  const { error, setError } = useTodoStore();

  if (!error) return null;

  return (
    <Card className="mb-6 border-red-300 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <p className="text-red-700">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            닫기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6-8. App.tsx (컴포넌트 분리 버전)

```typescript
import { useEffect } from "react";
import "./App.css";
import { useTodoStore } from "./store/useTodoStore";
import { TodoHeader } from "./components/TodoHeader";
import { TodoInput } from "./components/TodoInput";
import { TodoStats } from "./components/TodoStats";
import { TodoList } from "./components/TodoList";
import { ErrorAlert } from "./components/ErrorAlert";

function App() {
  const { loading, todos, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 중
  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <TodoHeader />
        <ErrorAlert />
        <TodoInput />
        <TodoStats />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
```

**훨씬 깔끔해졌습니다!**

---

## Step 7: Zustand DevTools (선택사항)

### 7-1. DevTools 미들웨어 추가

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useTodoStore = create<TodoStore>()(
  devtools(
    (set, get) => ({
      // ... 기존 코드
    }),
    { name: "TodoStore" }
  )
);
```

### 7-2. 브라우저에서 확인

1. Redux DevTools 확장 프로그램 설치
2. F12 개발자 도구 열기
3. Redux 탭 선택
4. 상태 변화 실시간 확인!

---

## Step 8: 테스트

### 8-1. 기본 기능

1. **초기 로드**

   - 스피너 표시
   - 데이터 로드

2. **추가**

   - 할 일 추가
   - 목록 업데이트

3. **완료**

   - 체크박스 클릭
   - 상태 변경

4. **삭제**
   - 삭제 버튼
   - 목록에서 제거

### 8-2. 컴포넌트 분리 테스트 (선택사항)

1. **독립성 확인**

   - 각 컴포넌트가 독립적으로 store 접근
   - Props drilling 없음

2. **성능 확인**
   - 불필요한 리렌더링 없음
   - Selector 사용 효과 확인

---

## 문제 해결

### 문제 1: ESLint 경고

**증상:**

```
React Hook useEffect has a missing dependency: 'fetchTodos'
```

**해결:**

```typescript
useEffect(() => {
  fetchTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### 문제 2: 타입 에러

**증상:**

```
Property 'xxx' does not exist on type 'TodoStore'
```

**해결:**

- Interface에 해당 속성 추가
- Store 정의 확인

---

## 핵심 개념 정리

### 1. Store 생성

```typescript
const useStore = create((set, get) => ({
  // 상태
  count: 0,
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### 2. Store 사용

```typescript
// 전체 상태
const { count, increment } = useStore();

// Selector (성능 최적화)
const count = useStore((state) => state.count);
```

### 3. 비동기 Actions

```typescript
fetchData: async () => {
  set({ loading: true });
  try {
    const data = await api.getData();
    set({ data, loading: false });
  } catch (error) {
    set({ error, loading: false });
  }
};
```

---

## 체크리스트

**필수:**

- [ ] Zustand 설치
- [ ] useTodoStore.ts 생성
- [ ] Interface 정의
- [ ] Actions 구현
- [ ] App.tsx 리팩토링
- [ ] 모든 기능 테스트

**선택사항:**

- [ ] 컴포넌트 분리
- [ ] Selector 사용
- [ ] DevTools 설정
- [ ] 성능 최적화

---

## 다음 단계

5단계를 완료했다면 프론트엔드 기초는 완성!

**추가 학습 주제:**

- React Router (페이지 라우팅)
- React Hook Form (폼 관리)
- TanStack Query (서버 상태 관리)
- 인증/인가
- 배포

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐⭐☆
**소요 시간:** 2-3시간
