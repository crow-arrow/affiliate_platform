/**
 * Border токены
 * Радиусы, стили, толщина
 */

export const borderRadius = {
  none: "0",
  sm: "0.125rem",  // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem",  // 6px
  lg: "0.5rem",    // 8px
  xl: "0.75rem",   // 12px
  "2xl": "1rem",   // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const borderWidth = {
  0: "0",
  DEFAULT: "1px",
  2: "2px",
  4: "4px",
  8: "8px",
} as const;

export const borderStyle = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
  none: "none",
} as const;

/**
 * Семантические border значения
 */
export const semanticBorders = {
  // Component borders
  input: {
    width: borderWidth.DEFAULT,
    radius: borderRadius.md,
    style: borderStyle.solid,
  },
  button: {
    width: borderWidth.DEFAULT,
    radius: borderRadius.md,
    style: borderStyle.solid,
  },
  card: {
    width: borderWidth.DEFAULT,
    radius: borderRadius.lg,
    style: borderStyle.solid,
  },
  badge: {
    width: borderWidth.DEFAULT,
    radius: borderRadius.full,
    style: borderStyle.solid,
  },

  // Radius tokens (для использования с CSS переменными)
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
  },
} as const;

