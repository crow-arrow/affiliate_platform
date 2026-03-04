/**
 * Базовые цветовые токены
 * Используются для создания семантических токенов
 */

export const baseColors = {
  // Neutral colors
  white: "#ffffff",
  black: "#000000",

  // Gray scale
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Brand colors (можно настроить под ваш бренд)
  brand: {
    primary: "#0b2e33",
    secondary: "#4f7c82",
    accent: "#A9DFD8",
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Level colors
  level: {
    bronze: {
      light: "#ba7552",
      DEFAULT: "#8c5607",
      dark: "#654321",
      text: "rgb(101,67,33)",
    },
    silver: {
      light: "#bbbbbb",
      DEFAULT: "#909090",
      dark: "#606060",
      text: "#404040",
    },
    gold: {
      light: "#fef1a2",
      DEFAULT: "#a55d07",
      dark: "#785205",
      text: "rgb(120,50,5)",
    },
    platinum: {
      light: "#e5e5e5",
      DEFAULT: "#bfbfbf",
      dark: "#808080",
      text: "#404040",
    },
  },
} as const;

/**
 * HSL значения для использования с CSS переменными
 * Формат: "hue saturation lightness"
 */
export const hslColors = {
  // Base
  background: {
    light: "0 0% 100%",
    dark: "0 0% 3.9%",
  },
  foreground: {
    light: "0 0% 3.9%",
    dark: "0 0% 98%",
  },

  // Primary
  primary: {
    light: "0 0% 9%",
    dark: "0 0% 98%",
  },
  "primary-foreground": {
    light: "0 0% 98%",
    dark: "0 0% 9%",
  },

  // Secondary
  secondary: {
    light: "0 0% 96.1%",
    dark: "0 0% 14.9%",
  },
  "secondary-foreground": {
    light: "0 0% 9%",
    dark: "0 0% 98%",
  },

  // Muted
  muted: {
    light: "0 0% 96.1%",
    dark: "0 0% 14.9%",
  },
  "muted-foreground": {
    light: "0 0% 45.1%",
    dark: "0 0% 63.9%",
  },

  // Accent
  accent: {
    light: "0 0% 96.1%",
    dark: "0 0% 14.9%",
  },
  "accent-foreground": {
    light: "0 0% 9%",
    dark: "0 0% 98%",
  },

  // Destructive
  destructive: {
    light: "0 84.2% 60.2%",
    dark: "0 62.8% 30.6%",
  },
  "destructive-foreground": {
    light: "0 0% 98%",
    dark: "0 0% 98%",
  },

  // Border & Input
  border: {
    light: "0 0% 89.8%",
    dark: "0 0% 14.9%",
  },
  input: {
    light: "0 0% 89.8%",
    dark: "0 0% 14.9%",
  },
  ring: {
    light: "0 0% 3.9%",
    dark: "0 0% 83.1%",
  },

  // Card
  card: {
    light: "0 0% 100%",
    dark: "0 0% 3.9%",
  },
  "card-foreground": {
    light: "0 0% 3.9%",
    dark: "0 0% 98%",
  },

  // Popover
  popover: {
    light: "0 0% 100%",
    dark: "0 0% 3.9%",
  },
  "popover-foreground": {
    light: "0 0% 3.9%",
    dark: "0 0% 98%",
  },

  // Level colors
  bronze: {
    light: "30 60% 50%",
    dark: "30 60% 40%",
  },
  "bronze-foreground": {
    light: "30 100% 15%",
    dark: "15 75% 28%",
  },
  silver: {
    light: "0 0% 70%",
    dark: "0 0% 60%",
  },
  "silver-foreground": {
    light: "0 0% 25%",
    dark: "0 0% 90%",
  },
  gold: {
    light: "40 80% 55%",
    dark: "40 80% 45%",
  },
  "gold-foreground": {
    light: "40 100% 15%",
    dark: "40 100% 90%",
  },
  platinum: {
    light: "0 0% 75%",
    dark: "0 0% 65%",
  },
  "platinum-foreground": {
    light: "0 0% 25%",
    dark: "0 0% 90%",
  },
} as const;
