# TanStack Query 실무 온보딩 가이드

## 초급: ASP.NET Core HttpClient + 메모리 캐시와 비교
- **useQuery = HttpClient + IMemoryCache**: 데이터 요청, 캐싱, 만료를 자동으로 처리합니다.
- **QueryClient = MemoryCache 인스턴스**: 앱 전체 캐시 정책을 정의.
- **Mutation = HttpClient POST/PUT/DELETE**: 서버 상태를 변경하고, 캐시를 무효화합니다.

### 실습 1: 기본 쿼리 작성
```tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { z } from "zod";
import { todoSchema } from "@/types/todo";

export function useTodosQuery() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.get("/todos");
      return z.array(todoSchema).parse(response.data);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
```
- ASP.NET Core에서 `MemoryCache.GetOrCreateAsync`로 TTL을 지정하던 패턴과 유사합니다.

### 실습 2: 컴포넌트 적용
```tsx
function TodosPage() {
  const { data, isLoading, isError, refetch, error } = useTodosQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorAlert message={(error as Error).message} onRetry={refetch} />;

  return <TodoList todos={data ?? []} />;
}
```
- Razor Page에서 `TryGetValue` 실패 시 오류 페이지를 반환하던 흐름을 React 컴포넌트로 표현합니다.

## 중급: Mutation과 옵티미스틱 업데이트
### useMutation 기본형
```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string }) => api.post("/todos", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```
- ASP.NET Core에서 커맨드 핸들러 실행 후 캐시 무효화(`MemoryCache.Remove`)를 호출하던 패턴과 동일합니다.

### 옵티미스틱 업데이트
```ts
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      api.patch(`/todos/${id}`, { completed }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) =>
          todo.id === variables.id ? { ...todo, completed: variables.completed } : todo
        ) ?? []
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```
- ASP.NET Core CQRS에서 커맨드 실패 시 이벤트 소싱 상태를 롤백하던 방식과 유사한 흐름입니다.

## 고급: Prefetch, Suspense, Devtools
- **Prefetch**: Razor Page `OnGetAsync`에서 데이터를 미리 로드하듯 `queryClient.prefetchQuery`를 사용.
- **Suspense 모드**: WPF에서 비동기 데이터 로딩 중 `BusyIndicator`를 보여주는 패턴을 자동화.
- **Devtools**: EF Core `EnableSensitiveDataLogging`처럼 쿼리 상태를 시각적으로 확인.

```tsx
await queryClient.prefetchQuery({
  queryKey: ["todos", id],
  queryFn: () => api.get(`/todos/${id}`).then((res) => res.data),
});
```

## 실무 체크리스트
- [ ] 서버 데이터는 React Query로 관리하고, Zustand에는 UI 상태만 보관.
- [ ] `queryKey`는 `[도메인, 파라미터]` 형태로 일관성 있게 작성.
- [ ] 에러 객체를 사용자 친화적인 메시지로 변환 후 알림.
- [ ] Devtools를 개발 모드에서만 활성화 (`<ReactQueryDevtools initialIsOpen={false} />`).

## 프로젝트 숙제
1. Todos 목록을 React Query 기반으로 전환, Zustand엔 `selectedTodoId` 등만 유지.
2. Todo 생성/수정/삭제 Mutation을 작성하고 옵티미스틱 업데이트 적용.
3. 로그인 후에만 데이터 패치되도록 `enabled: isAuthenticated` 옵션 사용.

## 참고 자료
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [ASP.NET Core Caching Basics](https://learn.microsoft.com/aspnet/core/performance/caching/memory)
- [React Query + Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)
