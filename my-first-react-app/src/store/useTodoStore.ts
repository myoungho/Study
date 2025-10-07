/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/api/todoApi";
import { devtools } from "zustand/middleware";

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

export const useTodoStore = create<TodoStore>()(
  devtools((set, get) => ({
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
  }))
);
