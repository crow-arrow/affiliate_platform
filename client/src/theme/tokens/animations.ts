/**
 * Animation токены
 * Длительности, easing функции, keyframes
 */

export const duration = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
  slowest: "1000ms",
} as const;

export const easing = {
  linear: "linear",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

export const delay = {
  0: "0ms",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1000: "1000ms",
} as const;

/**
 * Keyframes для анимаций
 */
export const keyframes = {
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  fadeOut: {
    "0%": { opacity: "1" },
    "100%": { opacity: "0" },
  },
  slideIn: {
    from: { transform: "translateY(-10px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" },
  },
  slideOut: {
    from: { transform: "translateY(0)", opacity: "1" },
    to: { transform: "translateY(-10px)", opacity: "0" },
  },
  scaleIn: {
    "0%": { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
  scaleOut: {
    "0%": { transform: "scale(1)", opacity: "1" },
    "100%": { transform: "scale(0.95)", opacity: "0" },
  },
  spin: {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  pulse: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0.5" },
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
    },
    "50%": {
      transform: "translateY(0)",
      animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
} as const;

/**
 * Семантические animation значения
 */
export const semanticAnimations = {
  // Transitions
  transition: {
    fast: `${duration.fast} ${easing["ease-out"]}`,
    normal: `${duration.normal} ${easing["ease-out"]}`,
    slow: `${duration.slow} ${easing["ease-out"]}`,
  },

  // Component animations
  modal: {
    enter: `${duration.normal} ${easing["ease-out"]}`,
    exit: `${duration.fast} ${easing["ease-in"]}`,
  },
  dropdown: {
    enter: `${duration.fast} ${easing["ease-out"]}`,
    exit: `${duration.fast} ${easing["ease-in"]}`,
  },
  tooltip: {
    enter: `${duration.fast} ${easing["ease-out"]}`,
    exit: `${duration.fast} ${easing["ease-in"]}`,
  },
} as const;

