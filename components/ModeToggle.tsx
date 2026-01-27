"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle order: light -> dark -> light ...
  const handleCycle = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // During SSR/first render, avoid branching on theme to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={handleCycle}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

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
