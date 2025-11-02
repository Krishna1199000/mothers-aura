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
    if (theme === "dark") return <Moon className="h-5 w-5" />;
    // default to light
    return <Sun className="h-5 w-5" />;
  };

  return (
    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleCycle} aria-label="Toggle theme">
      <EffectiveIcon />
    </Button>
  );
}
