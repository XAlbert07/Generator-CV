import * as React from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "cv-pro-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function readStoredTheme(): Theme | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "dark" || value === "light" ? value : undefined;
  } catch {
    return undefined;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  // Helps native form controls match the theme.
  root.style.colorScheme = theme;
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => readStoredTheme() ?? getSystemTheme());

  // Apply + persist
  React.useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Follow OS changes only if user never explicitly chose a theme.
  React.useEffect(() => {
    if (readStoredTheme()) return;

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const onChange = () => setThemeState(media.matches ? "dark" : "light");

    // Safari fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMedia = media as any;
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (anyMedia.addListener) anyMedia.addListener(onChange);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onChange);
      else if (anyMedia.removeListener) anyMedia.removeListener(onChange);
    };
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (t) => setThemeState(t),
      toggleTheme: () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export const themeStorageKey = THEME_STORAGE_KEY;

