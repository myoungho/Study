/* eslint-disable @typescript-eslint/no-explicit-any */
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
