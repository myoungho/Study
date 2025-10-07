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
