/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoItem } from "@/components/TodoItem";

interface TodoListProps {
  todos: any[];
}

export function TodoList({ todos }: TodoListProps) {
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
