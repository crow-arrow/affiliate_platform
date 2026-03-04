/**
 * Генерация CSS переменных из токенов
 * Используется в global.css
 */

import { hslColors } from "./tokens/colors";
import { borderRadius } from "./tokens/borders";

/**
 * Генерирует CSS переменные для светлой темы
 */
export const generateLightThemeVariables = () => {
  const vars: Record<string, string> = {
    // Base
    "--background": hslColors.background.light,
    "--foreground": hslColors.foreground.light,

    // Card
    "--card": hslColors.card.light,
    "--card-foreground": hslColors["card-foreground"].light,

    // Popover
    "--popover": hslColors.popover.light,
    "--popover-foreground": hslColors["popover-foreground"].light,

    // Primary
    "--primary": hslColors.primary.light,
    "--primary-foreground": hslColors["primary-foreground"].light,

    // Secondary
    "--secondary": hslColors.secondary.light,
    "--secondary-foreground": hslColors["secondary-foreground"].light,

    // Muted
    "--muted": hslColors.muted.light,
    "--muted-foreground": hslColors["muted-foreground"].light,

    // Accent
    "--accent": hslColors.accent.light,
    "--accent-foreground": hslColors["accent-foreground"].light,

    // Destructive
    "--destructive": hslColors.destructive.light,
    "--destructive-foreground": hslColors["destructive-foreground"].light,

    // Border & Input
    "--border": hslColors.border.light,
    "--input": hslColors.input.light,
    "--ring": hslColors.ring.light,

    // Radius
    "--radius": borderRadius.lg,

    // Sidebar (oklch для лучшей поддержки)
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.205 0 0)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",

    // Level colors: defined in global.css (oklch) as single source of truth

    // Chart colors
    "--chart-1": "12 76% 61%",
    "--chart-2": "173 58% 39%",
    "--chart-3": "197 37% 24%",
    "--chart-4": "43 74% 66%",
    "--chart-5": "27 87% 67%",
  };

  return vars;
};

/**
 * Генерирует CSS переменные для темной темы
 */
export const generateDarkThemeVariables = () => {
  const vars: Record<string, string> = {
    // Base
    "--background": hslColors.background.dark,
    "--foreground": hslColors.foreground.dark,

    // Card
    "--card": hslColors.card.dark,
    "--card-foreground": hslColors["card-foreground"].dark,

    // Popover
    "--popover": hslColors.popover.dark,
    "--popover-foreground": hslColors["popover-foreground"].dark,

    // Primary
    "--primary": hslColors.primary.dark,
    "--primary-foreground": hslColors["primary-foreground"].dark,

    // Secondary
    "--secondary": hslColors.secondary.dark,
    "--secondary-foreground": hslColors["secondary-foreground"].dark,

    // Muted
    "--muted": hslColors.muted.dark,
    "--muted-foreground": hslColors["muted-foreground"].dark,

    // Accent
    "--accent": hslColors.accent.dark,
    "--accent-foreground": hslColors["accent-foreground"].dark,

    // Destructive
    "--destructive": hslColors.destructive.dark,
    "--destructive-foreground": hslColors["destructive-foreground"].dark,

    // Border & Input
    "--border": hslColors.border.dark,
    "--input": hslColors.input.dark,
    "--ring": hslColors.ring.dark,

    // Radius (тот же)
    "--radius": borderRadius.lg,

    // Sidebar (oklch для темной темы)
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.488 0.243 264.376)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.439 0 0)",

    // Level colors: defined in global.css .dark (oklch)

    // Chart colors (dark mode)
    "--chart-1": "220 70% 50%",
    "--chart-2": "160 60% 45%",
    "--chart-3": "30 80% 55%",
    "--chart-4": "280 65% 60%",
    "--chart-5": "340 75% 55%",
  };

  return vars;
};
