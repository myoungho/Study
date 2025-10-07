import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/lib/theme-store";
import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggleTheme);

  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggle} aria-label="테마 전환">
      {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  );
}
