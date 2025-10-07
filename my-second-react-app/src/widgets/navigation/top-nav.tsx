import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { ThemeToggle } from "@/features/theme/toggle";
import { Button } from "@/shared/ui/button";
import { appConfig } from "@/shared/config/env";

const links = [
  { to: "/", label: "대시보드" },
  { to: "/todos", label: "업무 목록" },
];

export function TopNav() {
  const routerState = useRouterState();
  const activePath = routerState.location.pathname;
  const { user, status, signOut } = useAuthStore();

  const initials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user?.name]);

  return (
    <header className="nav-surface sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            {appConfig.appName}
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  activePath === link.to
                    ? "text-primary"
                    : "transition hover:text-subtle"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted md:inline">{user.name}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--card-hover-bg)] text-xs font-semibold text-primary">
                {initials}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth/sign-in">로그인</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
