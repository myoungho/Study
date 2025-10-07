# 8단계: TanStack Query (서버 상태 관리)

## 목표
서버 데이터를 효율적으로 관리하고 캐싱, 자동 리페치 구현

**학습 내용:**
- TanStack Query (React Query) 설치
- QueryClient 설정
- useQuery (데이터 조회)
- useMutation (데이터 변경)
- 캐싱 전략
- Optimistic Updates
- Query Invalidation

---

## Step 1: TanStack Query 설치

### 1-1. 패키지 설치

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

### 1-2. 설치 확인

`package.json`:
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x.x",
    "@tanstack/react-query-devtools": "^5.x.x"
  }
}
```

---

## Step 2: QueryClient 설정

### 2-1. main.tsx 수정

**파일:** `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.tsx";

// QueryClient 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10,   // 10분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
```

**주요 옵션:**
- `staleTime`: 데이터가 "신선한" 상태로 유지되는 시간
- `gcTime`: 캐시에서 데이터가 제거되기까지의 시간
- `retry`: 실패 시 재시도 횟수
- `refetchOnWindowFocus`: 창 포커스 시 자동 리페치

---

## Step 3: Custom Hooks 생성

### 3-1. hooks 폴더 생성

```
src/
├── hooks/
│   └── useTodos.ts       ← 새로 생성
```

### 3-2. useTodos.ts

**파일:** `src/hooks/useTodos.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/api/todoApi";

// Query Keys
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

// useQuery: 할 일 목록 조회
export function useTodosQuery() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      const data = await getTodos();
      return data.slice(0, 10); // 처음 10개만
    },
  });
}

// useQuery: 할 일 상세 조회
export function useTodoQuery(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: async () => {
      const todos = await getTodos();
      return todos.find((todo) => todo.id === id);
    },
    enabled: !!id, // id가 있을 때만 실행
  });
}

// useMutation: 할 일 추가
export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createTodo(title),
    onSuccess: () => {
      // 성공 시 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

// useMutation: 할 일 완료 상태 변경
export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTodo(id, completed),
    // Optimistic Update
    onMutate: async ({ id, completed }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // 이전 데이터 백업
      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      // 낙관적 업데이트
      queryClient.setQueryData(todoKeys.lists(), (old: any) =>
        old?.map((todo: any) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );

      // 롤백을 위한 데이터 반환
      return { previousTodos };
    },
    // 에러 시 롤백
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
    },
    // 완료 후 갱신
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

// useMutation: 할 일 삭제
export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    // Optimistic Update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });
      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      queryClient.setQueryData(todoKeys.lists(), (old: any) =>
        old?.filter((todo: any) => todo.id !== id)
      );

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}
```

**주요 개념:**

**Query Keys:**
- 쿼리를 식별하는 고유 키
- 캐시 관리에 사용
- 계층적 구조로 관리

**useQuery:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
});
```

**useMutation:**
```typescript
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    // 성공 시 처리
  },
});
```

**Optimistic Update:**
- 서버 응답 전에 UI 먼저 업데이트
- 빠른 사용자 경험
- 에러 시 롤백

---

## Step 4: TodosPage 리팩토링

### 4-1. TodosPage.tsx 수정

**파일:** `src/pages/TodosPage.tsx`

```tsx
import { TodoHeader } from "@/components/TodoHeader";
import { TodoInput } from "@/components/TodoInput";
import { TodoStats } from "@/components/TodoStats";
import { TodoList } from "@/components/TodoList";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useTodosQuery } from "@/hooks/useTodos";

export function TodosPage() {
  const { data: todos = [], isLoading, error } = useTodosQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorAlert />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TodoHeader />
      <TodoInput />
      <TodoStats todos={todos} />
      <TodoList todos={todos} />
    </div>
  );
}
```

### 4-2. TodoInput 수정

**파일:** `src/components/TodoInput.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTodoMutation } from "@/hooks/useTodos";
// ... imports

export function TodoInput() {
  const createMutation = useCreateTodoMutation();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = async (data: CreateTodoInput) => {
    await createMutation.mutateAsync(data.title);
    form.reset();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... form fields */}
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "추가 중..." : "추가"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

### 4-3. TodoStats 수정

**파일:** `src/components/TodoStats.tsx`

Props로 todos 받도록 수정:

```tsx
interface TodoStatsProps {
  todos: any[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  // ... rest
}
```

### 4-4. TodoList 수정

**파일:** `src/components/TodoList.tsx`

```tsx
interface TodoListProps {
  todos: any[];
}

export function TodoList({ todos }: TodoListProps) {
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}
```

### 4-5. TodoItem 수정

**파일:** `src/components/TodoItem.tsx`

```tsx
import { useUpdateTodoMutation, useDeleteTodoMutation } from "@/hooks/useTodos";
// ... imports

export function TodoItem({ todo }: TodoItemProps) {
  const updateMutation = useUpdateTodoMutation();
  const deleteMutation = useDeleteTodoMutation();

  const handleToggle = () => {
    updateMutation.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(todo.id);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={updateMutation.isPending}
        />
        <Link to={`/todos/${todo.id}`} className="flex-1">
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
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "삭제 중..." : "삭제"}
      </Button>
    </div>
  );
}
```

---

## Step 5: Zustand와 TanStack Query 비교

### 5-1. 언제 무엇을 사용할까?

**TanStack Query (서버 상태):**
- ✅ API 데이터 조회
- ✅ 캐싱이 필요한 경우
- ✅ 자동 리페치
- ✅ Optimistic Updates

**Zustand (클라이언트 상태):**
- ✅ UI 상태 (모달 열림/닫힘)
- ✅ 사용자 설정
- ✅ 로컬 상태
- ✅ 인증 상태

### 5-2. 함께 사용하기

```typescript
// Zustand: UI 상태
const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// TanStack Query: 서버 데이터
const { data } = useTodosQuery();
```

---

## Step 6: 무한 스크롤 (선택사항)

### 6-1. useInfiniteQuery

```typescript
export function useInfiniteTodosQuery() {
  return useInfiniteQuery({
    queryKey: todoKeys.lists(),
    queryFn: async ({ pageParam = 0 }) => {
      const todos = await getTodos();
      const start = pageParam * 10;
      const end = start + 10;
      return {
        data: todos.slice(start, end),
        nextCursor: end < todos.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}
```

### 6-2. 사용

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteTodosQuery();

// 더 보기 버튼
<Button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetchingNextPage}
>
  {isFetchingNextPage ? "로딩 중..." : "더 보기"}
</Button>
```

---

## Step 7: DevTools 사용

### 7-1. DevTools 열기

브라우저에서:
1. 개발 서버 실행
2. 왼쪽 하단 TanStack Query 아이콘 클릭
3. 실시간 쿼리 상태 확인

### 7-2. 확인 사항

- **Queries**: 현재 활성화된 쿼리
- **Mutations**: 진행 중인 변경 작업
- **Query Explorer**: 캐시된 데이터 확인
- **Actions**: 쿼리 수동 실행/무효화

---

## 핵심 개념 정리

### 1. Query States

- **fresh**: staleTime 내의 신선한 데이터
- **stale**: staleTime이 지난 오래된 데이터
- **fetching**: 현재 가져오는 중
- **paused**: 네트워크 연결 없음
- **inactive**: 사용되지 않는 쿼리

### 2. Query Lifecycle

```
1. Mount → Query 실행
2. 데이터 반환 → fresh 상태
3. staleTime 경과 → stale 상태
4. 다시 사용 시 → 백그라운드 리페치
5. gcTime 경과 → 캐시에서 제거
```

### 3. Optimistic Updates Flow

```
1. onMutate: 즉시 UI 업데이트 (낙관적)
2. mutationFn: 실제 API 호출
3. onSuccess: 성공 시 처리
4. onError: 실패 시 롤백
5. onSettled: 완료 후 갱신
```

---

## C# 개발자를 위한 비교

### Entity Framework vs TanStack Query

**Entity Framework (캐싱):**
```csharp
var todos = await _context.Todos
    .AsNoTracking()
    .ToListAsync();
```

**TanStack Query (캐싱):**
```typescript
const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: getTodos,
  staleTime: 5 * 60 * 1000, // 5분 캐싱
});
```

---

## 체크리스트

- [ ] TanStack Query 설치
- [ ] QueryClient 설정
- [ ] DevTools 설정
- [ ] useTodos Hook 생성
- [ ] TodosPage 리팩토링
- [ ] 모든 컴포넌트 수정
- [ ] Optimistic Updates 테스트
- [ ] 캐싱 동작 확인
- [ ] DevTools로 쿼리 상태 확인

---

## 다음 단계

8단계를 완료했다면 **9단계: 인증 (Authentication)**으로 진행합니다.

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐⭐☆
**소요 시간:** 3-4시간
