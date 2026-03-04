/**
 * Spacing токены
 * Используются для отступов, размеров и т.д.
 */

export const spacing = {
  // Base spacing scale (4px grid)
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem",  // 8px
  3: "0.75rem", // 12px
  4: "1rem",    // 16px
  5: "1.25rem", // 20px
  6: "1.5rem",  // 24px
  8: "2rem",    // 32px
  10: "2.5rem", // 40px
  12: "3rem",   // 48px
  16: "4rem",   // 64px
  20: "5rem",   // 80px
  24: "6rem",   // 96px
  32: "8rem",   // 128px
  40: "10rem",  // 160px
  48: "12rem",  // 192px
  56: "14rem",  // 224px
  64: "16rem",  // 256px
} as const;

/**
 * Семантические spacing значения
 */
export const semanticSpacing = {
  // Component spacing
  xs: spacing[1],   // 4px
  sm: spacing[2],   // 8px
  md: spacing[4],   // 16px
  lg: spacing[6],   // 24px
  xl: spacing[8],   // 32px
  "2xl": spacing[12], // 48px
  "3xl": spacing[16], // 64px

  // Layout spacing
  container: {
    padding: spacing[4],      // 16px
    paddingMobile: spacing[4], // 16px
    paddingDesktop: spacing[6], // 24px
    maxWidth: "1280px",
  },

  // Section spacing
  section: {
    gap: spacing[12], // 48px
    gapMobile: spacing[8], // 32px
  },

  // Card spacing
  card: {
    padding: spacing[6], // 24px
    paddingMobile: spacing[4], // 16px
    gap: spacing[4], // 16px
  },

  // Form spacing
  form: {
    gap: spacing[6], // 24px
    fieldGap: spacing[4], // 16px
    labelGap: spacing[2], // 8px
  },
} as const;

