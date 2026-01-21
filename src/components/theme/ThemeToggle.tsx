import { Moon, Sun } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function ThemeToggle({ className, variant = "ghost", size = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={toggleTheme}
          className={cn("text-muted-foreground hover:text-foreground", className)}
          aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end">
        {isDark ? "Mode clair" : "Mode sombre"}
      </TooltipContent>
    </Tooltip>
  );
}

