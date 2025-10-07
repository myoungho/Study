import "sonner/dist/styles.css";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { TopNav } from "@/widgets/navigation/top-nav";

const Fallback = () => (
  <div className="p-6 text-sm text-muted">콘텐츠를 불러오는 중...</div>
);

export function AppShell() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <div className="app-bg min-h-screen">
      <TopNav />
      <main className="pb-16">
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
