import { Link } from "react-router-dom";
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
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        <Link to={`/todos/${todo.id}`} className="flex-1">
          <span
            className={`hover:text-blue-600 transition-colors cursor-pointer ${
              todo.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {todo.title}
          </span>
        </Link>
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
