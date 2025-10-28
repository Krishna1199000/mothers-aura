"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Cycle order: light -> dark -> light ...
  const handleCycle = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // Pick icon by current theme
  const EffectiveIcon = () => {
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
