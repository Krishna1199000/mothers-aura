"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Cycle order: system -> light -> dark -> system ...
  const handleCycle = () => {
    // Resolve current theme (if theme is 'system', consider as system)
    const current = theme ?? "system";
    if (current === "system") {
      setTheme("light");
    } else if (current === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  // Pick icon by effective/current theme
  const EffectiveIcon = () => {
    // Show explicit System icon when user-selected theme is 'system'
    if (theme === "system") {
      return (
        <span role="img" aria-label="system" className="text-[1.2rem] leading-none">
          🖥️
        </span>
      );
    }
    if (theme === "dark") return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    // default to light
    return <Sun className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCycle} aria-label="Toggle theme">
      <EffectiveIcon />
    </Button>
  );
}
