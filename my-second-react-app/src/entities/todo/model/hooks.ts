import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { todoQueryKeys } from "./query-keys";
import { createTodo, fetchTodoById, fetchTodos, toggleTodo } from "@/entities/todo/api/todo-api";
import type { TodoEntity } from "@/entities/todo/model/types";

export function useTodosQuery() {
  return useQuery<TodoEntity[]>({
    queryKey: todoQueryKeys.all(),
    queryFn: fetchTodos,
  });
}

export function useTodoQuery(id: number) {
  return useQuery<TodoEntity>({
    queryKey: todoQueryKeys.byId(id),
    queryFn: () => fetchTodoById(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation<TodoEntity, Error, { title: string }>({
    mutationFn: createTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all() });
      toast.success("새로운 업무가 추가되었어요");
    },
    onError: (error) => {
      toast.error(error.message ?? "업무 추가에 실패했습니다");
    },
  });
}

export function useToggleTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation<TodoEntity, Error, { id: number; completed: boolean }, { previous: TodoEntity[] | undefined }>({
    mutationFn: toggleTodo,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.all() });

      const previous = queryClient.getQueryData<TodoEntity[]>(todoQueryKeys.all());

      queryClient.setQueryData<TodoEntity[]>(todoQueryKeys.all(), (old) =>
        old?.map((todo) =>
          todo.id === variables.id ? { ...todo, completed: variables.completed } : todo
        ) ?? []
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(todoQueryKeys.all(), context.previous);
      }
      toast.error("업데이트에 실패했습니다");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all() });
    },
  });
}
