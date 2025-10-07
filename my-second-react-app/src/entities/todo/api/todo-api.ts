import { httpClient } from "@/shared/api/http-client";
import type { TodoEntity } from "@/entities/todo/model/types";

export async function fetchTodos() {
  const response = await httpClient.get<TodoEntity[]>("/todos");
  return response.data.slice(0, 20);
}

export async function fetchTodoById(id: number) {
  const response = await httpClient.get<TodoEntity>(`/todos/${id}`);
  return response.data;
}

export async function createTodo(payload: { title: string }) {
  const response = await httpClient.post<TodoEntity>("/todos", {
    title: payload.title,
    completed: false,
    userId: 1,
  });

  return response.data;
}

export async function toggleTodo(payload: { id: number; completed: boolean }) {
  const response = await httpClient.patch<TodoEntity>(`/todos/${payload.id}` , {
    completed: payload.completed,
  });

  return response.data;
}
