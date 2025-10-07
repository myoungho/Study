import { useUpdateTodoMutation, useDeleteTodoMutation } from "@/hooks/useTodos";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    completed: boolean;
  };
}

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
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "삭제 중..." : "삭제"}
      </Button>
    </div>
  );
}
