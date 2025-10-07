import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const SignInPage = lazy(() =>
  import("@/pages/auth").then((mod) => ({ default: mod.SignInPage }))
);

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});
