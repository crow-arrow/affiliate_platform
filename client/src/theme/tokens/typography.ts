/**
 * Типографические токены
 * Шрифты, размеры, веса, высоты строк
 */

export const fontFamily = {
  sans: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ].join(", "),
  mono: [
    "ui-monospace",
    "SFMono-Regular",
    '"SF Mono"',
    "Menlo",
    "Consolas",
    '"Liberation Mono"',
    "monospace",
  ].join(", "),
} as const;

export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
  sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
  base: ["1rem", { lineHeight: "1.5rem" }], // 16px
  lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
  xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
  "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
  "5xl": ["3rem", { lineHeight: "1" }], // 48px
  "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
  "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
  "8xl": ["6rem", { lineHeight: "1" }], // 96px
  "9xl": ["8rem", { lineHeight: "1" }], // 128px
} as const;

export const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

/**
 * Семантические типографические стили
 */
export const textStyles = {
  // Headings
  h1: {
    fontSize: fontSize["3xl"][0],
    lineHeight: fontSize["3xl"][1].lineHeight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize["2xl"][0],
    lineHeight: fontSize["2xl"][1].lineHeight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize.xl[0],
    lineHeight: fontSize.xl[1].lineHeight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontSize: fontSize.lg[0],
    lineHeight: fontSize.lg[1].lineHeight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.base[0],
    lineHeight: fontSize.base[1].lineHeight,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Body text
  body: {
    fontSize: fontSize.base[0],
    lineHeight: fontSize.base[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  "body-sm": {
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  "body-lg": {
    fontSize: fontSize.lg[0],
    lineHeight: fontSize.lg[1].lineHeight,
    fontWeight: fontWeight.normal,
  },

  // Labels
  label: {
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.medium,
  },
  "label-sm": {
    fontSize: fontSize.xs[0],
    lineHeight: fontSize.xs[1].lineHeight,
    fontWeight: fontWeight.medium,
  },

  // Captions
  caption: {
    fontSize: fontSize.xs[0],
    lineHeight: fontSize.xs[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
} as const;
