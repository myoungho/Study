import "sonner/dist/styles.css";
import { Outlet } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { TopNav } from "@/widgets/navigation/top-nav";

type RouterDevtoolsModule = typeof import("@tanstack/react-router-devtools");
type RouterDevtoolsProps = Parameters<RouterDevtoolsModule["TanStackRouterDevtools"]>[0];

const isDev = import.meta.env.DEV;
let LazyRouterDevtools: React.ComponentType<RouterDevtoolsProps> | null = null;

if (isDev) {
  LazyRouterDevtools = lazy(() =>
    import("@tanstack/react-router-devtools").then((mod) => ({
      default: mod.TanStackRouterDevtools,
    }))
  );
}

const Fallback = () => (
  <div className="px-6 py-8 text-sm text-muted">콘텐츠를 불러오는 중...</div>
);

export function AppShell() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <div className="app-bg min-h-screen transition-colors duration-200 ease-out">
      <TopNav />
      <main className="pb-16">
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
      {isDev && LazyRouterDevtools && (
        <Suspense fallback={null}>
          <LazyRouterDevtools position="bottom-right" />
        </Suspense>
      )}
    </div>
  );
}
