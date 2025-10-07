import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useThemeStore } from "@/shared/lib/theme-store";

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useThemeStore((state) => state.theme);
  const hydrate = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    body.classList.remove("light", "dark");
    body.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
