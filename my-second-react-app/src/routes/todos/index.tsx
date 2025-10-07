import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const TodosPage = lazy(() =>
  import("@/pages/todos").then((mod) => ({ default: mod.TodosPage }))
);

export const Route = createFileRoute("/todos/")({
  component: TodosPage,
});
