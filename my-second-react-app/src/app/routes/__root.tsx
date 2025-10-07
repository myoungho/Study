import { createRootRouteWithContext } from "@tanstack/react-router";
import type { RouterContext } from "@/app/router-context";
import { AppProviders } from "@/app/providers";
import { AppShell } from "@/widgets/layout";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
