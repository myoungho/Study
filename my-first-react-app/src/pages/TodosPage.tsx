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
