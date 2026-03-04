/**
 * Shadow токены
 * Тени для elevation и depth
 */

export const shadows = {
  // Base shadows
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",

  // Custom shadows (из вашего tailwind.config)
  custom: "-4px -4px 12px hsla(0, 0%, 100%, .05), 4px 4px 12px rgba(0, 0, 0, 0.8)",
  "inset-custom":
    "inset -22px -14px 14px 2px hsla(0, 0%, 100%, .015), inset 8px 4px 20px 12px rgba(0, 0, 0, .8)",
  "inset-2": "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
  "custom-white": "-4px -4px 12px hsla(0, 0%, 100%, .05), 4px 4px 12px rgba(255, 255, 255, 0.8)",
  "inset-white": "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
} as const;

/**
 * Семантические shadow значения
 */
export const semanticShadows = {
  // Elevation levels
  elevation: {
    0: shadows.none,
    1: shadows.sm,
    2: shadows.DEFAULT,
    3: shadows.md,
    4: shadows.lg,
    5: shadows.xl,
    6: shadows["2xl"],
  },

  // Component shadows
  card: shadows.md,
  dropdown: shadows.lg,
  modal: shadows["2xl"],
  tooltip: shadows.md,

  // Interactive shadows
  focus: "0 0 0 3px hsl(var(--ring))",
  "focus-ring": "0 0 0 2px hsl(var(--ring))",
} as const;
