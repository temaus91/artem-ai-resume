import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "artem-resume-theme";

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Theme still applies for the current page even when storage is unavailable.
  }
};

const readTheme = (): Theme => {
  const current = document.documentElement.dataset.theme;
  return current === "light" ? "light" : "dark";
};

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const isLight = theme === "light";

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme = isLight ? "dark" : "light";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/75 text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground active:scale-[0.98]",
        className
      )}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
