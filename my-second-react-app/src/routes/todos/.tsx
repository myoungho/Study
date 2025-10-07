import { createFileRoute } from "@tanstack/react-router";
import { TodoDetailPage } from "@/pages/todo-detail";

export const Route = createFileRoute("/todos/$todoId")({
  loader: ({ params }) => ({ todoId: Number(params.todoId) }),
  component: TodoDetailRoute,
});

function TodoDetailRoute() {
  const { todoId } = Route.useLoaderData();
  return <TodoDetailPage todoId={todoId} />;
}
