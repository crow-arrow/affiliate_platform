import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
import AutoModeIcon from "@mui/icons-material/AutoMode";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const getPosition = () => {
    switch (theme) {
      case "light":
        return "translate-x-0";
      case "dark":
        return "translate-x-8 rotate-90";
      case "system":
        return "translate-x-16 rotate-180";
      default:
        return "translate-x-0";
    }
  };

  return (
    <div className="relative flex items-center bg-background shadow-inset-2 dark:bg-secondary rounded-lg">
      <div
        className={`absolute inset-0 w-8 h-8 border border-border bg-secondary rounded-lg transition-transform duration-300 ${getPosition()}`}
      />
      <button
        onClick={() => setTheme("light")}
        className="relative z-10 w-8 h-8 p-2 flex items-center justify-center text-foreground"
      >
        <Sun />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className="relative z-10 w-8 h-8 p-2 flex items-center justify-center text-foreground"
      >
        <Moon />
      </button>
      <button
        onClick={() => setTheme("system")}
        className="relative z-10 w-8 h-8 p-2 flex items-center justify-center text-foreground"
      >
        <AutoModeIcon fontSize="small" />
      </button>
    </div>
  );
};
