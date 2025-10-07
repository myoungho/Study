import type { TodoEntity } from "@/entities/todo/model/types";
import { cn } from "@/shared/lib/cn";
import { BadgeCheck, Circle } from "lucide-react";

interface TodoCardProps {
  todo: TodoEntity;
  onToggle?: (todo: TodoEntity) => void;
}

export function TodoCard({ todo, onToggle }: TodoCardProps) {
  const isCompleted = todo.completed;

  return (
    <button
      type="button"
      onClick={() => onToggle?.(todo)}
      className={cn(
        "surface-card surface-card-hover flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition",
        isCompleted && "border-primary/70"
      )}
    >
      <span className="mt-0.5 text-primary">
        {isCompleted ? <BadgeCheck size={20} /> : <Circle size={20} />}
      </span>
      <div className="space-y-1">
        <p className="text-base font-medium text-subtle">{todo.title}</p>
        <p className="text-xs text-muted">Todo #{todo.id}</p>
      </div>
    </button>
  );
}
