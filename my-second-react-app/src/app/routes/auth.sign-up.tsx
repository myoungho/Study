import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const SignUpPage = lazy(() =>
  import("@/pages/auth/sign-up-page").then((mod) => ({ default: mod.SignUpPage }))
);

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});
