import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const TodoDetailPage = lazy(() =>
  import("@/pages/todo-detail").then((mod) => ({ default: mod.TodoDetailPage }))
);

export const Route = createFileRoute("/todos/$todoId")({
  loader: ({ params }) => ({ todoId: Number(params.todoId) }),
  component: TodoDetailWrapper,
});

function TodoDetailWrapper() {
  const { todoId } = Route.useLoaderData();
  return <TodoDetailPage todoId={todoId} />;
}
