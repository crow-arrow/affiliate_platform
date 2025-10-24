import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AutoModeIcon from "@mui/icons-material/AutoMode";

import { useTheme } from "@/components/theme-provider";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
    setTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const prefersDark = mediaQuery.matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const getPosition = () => {
    switch (theme) {
      case "light":
        return "translate-x-0";
      case "dark":
        return "translate-x-10 rotate-90";
      case "system":
        return "translate-x-20 rotate-180";
      default:
        return "translate-x-0";
    }
  };

  return (
    <div className="relative flex items-center bg-white shadow-inset-2 dark:bg-secondary rounded-lg">
      <div
        className={`absolute inset-0 w-10 h-10 border border-gray-400 bg-primaryLite dark:bg-primary rounded-lg transition-transform duration-300 ${getPosition()}`}
      />
      <button
        onClick={() => setTheme("light")}
        className="relative z-10 w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100"
      >
        <LightModeIcon fontSize="small" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className="relative z-10 w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100"
      >
        <DarkModeIcon fontSize="small" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className="relative z-10 w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100"
      >
        <AutoModeIcon fontSize="small" />
      </button>
    </div>
  );
};
