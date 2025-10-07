import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((mod) => ({ default: mod.NotFoundPage }))
);

export const Route = createFileRoute("/__not-found")({
  component: NotFoundPage,
});
