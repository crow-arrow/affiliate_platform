/**
 * Семантические цветовые токены
 * Используются в компонентах для семантического значения
 */

import { hslColors } from "../tokens/colors";

/**
 * Семантические цвета для использования в компонентах
 * Эти цвета автоматически адаптируются к светлой/темной теме
 */
export const semanticColors = {
  // Primary actions
  primary: {
    bg: "hsl(var(--primary))",
    text: "hsl(var(--primary-foreground))",
    hover: "hsl(var(--primary) / 0.9)",
    active: "hsl(var(--primary) / 0.8)",
  },

  // Secondary actions
  secondary: {
    bg: "hsl(var(--secondary))",
    text: "hsl(var(--secondary-foreground))",
    hover: "hsl(var(--secondary) / 0.9)",
    active: "hsl(var(--secondary) / 0.8)",
  },

  // Accent
  accent: {
    bg: "hsl(var(--accent))",
    text: "hsl(var(--accent-foreground))",
    hover: "hsl(var(--accent) / 0.9)",
    active: "hsl(var(--accent) / 0.8)",
  },

  // Destructive actions
  destructive: {
    bg: "hsl(var(--destructive))",
    text: "hsl(var(--destructive-foreground))",
    hover: "hsl(var(--destructive) / 0.9)",
    active: "hsl(var(--destructive) / 0.8)",
  },

  // Success
  success: {
    bg: "hsl(142, 76%, 36%)",
    text: "hsl(0, 0%, 98%)",
    hover: "hsl(142, 76%, 32%)",
    active: "hsl(142, 76%, 28%)",
  },

  // Warning
  warning: {
    bg: "hsl(38, 92%, 50%)",
    text: "hsl(0, 0%, 98%)",
    hover: "hsl(38, 92%, 45%)",
    active: "hsl(38, 92%, 40%)",
  },

  // Info
  info: {
    bg: "hsl(217, 91%, 60%)",
    text: "hsl(0, 0%, 98%)",
    hover: "hsl(217, 91%, 55%)",
    active: "hsl(217, 91%, 50%)",
  },

  // Backgrounds
  background: {
    DEFAULT: "hsl(var(--background))",
    muted: "hsl(var(--muted))",
    card: "hsl(var(--card))",
    popover: "hsl(var(--popover))",
  },

  // Text
  text: {
    DEFAULT: "hsl(var(--foreground))",
    muted: "hsl(var(--muted-foreground))",
    inverse: "hsl(var(--background))",
  },

  // Borders
  border: {
    DEFAULT: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },

  // Level colors (--bronze etc. are oklch in global.css)
  level: {
    bronze: {
      bg: "var(--bronze)",
      text: "var(--bronze-foreground)",
    },
    silver: {
      bg: "var(--silver)",
      text: "var(--silver-foreground)",
    },
    gold: {
      bg: "var(--gold)",
      text: "var(--gold-foreground)",
    },
    platinum: {
      bg: "var(--platinum)",
      text: "var(--platinum-foreground)",
    },
  },
} as const;

/**
 * Tailwind классы для семантических цветов
 * Используются в компонентах через className
 */
export const colorClasses = {
  primary: {
    bg: "bg-primary",
    text: "text-primary-foreground",
    hover: "hover:bg-primary/90",
    active: "active:bg-primary/80",
  },
  secondary: {
    bg: "bg-secondary",
    text: "text-secondary-foreground",
    hover: "hover:bg-secondary/90",
    active: "active:bg-secondary/80",
  },
  destructive: {
    bg: "bg-destructive",
    text: "text-destructive-foreground",
    hover: "hover:bg-destructive/90",
    active: "active:bg-destructive/80",
  },
  success: {
    bg: "bg-green-600",
    text: "text-white",
    hover: "hover:bg-green-700",
    active: "active:bg-green-800",
  },
  warning: {
    bg: "bg-yellow-500",
    text: "text-white",
    hover: "hover:bg-yellow-600",
    active: "active:bg-yellow-700",
  },
  info: {
    bg: "bg-blue-600",
    text: "text-white",
    hover: "hover:bg-blue-700",
    active: "active:bg-blue-800",
  },
} as const;

