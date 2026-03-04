/**
 * Централизованный экспорт всех дизайн-токенов
 *
 * Использование:
 * import { colors, spacing, typography } from '@/theme'
 */

// Базовые токены
export * from "./tokens/colors";
export * from "./tokens/spacing";
export * from "./tokens/typography";
export * from "./tokens/shadows";
export * from "./tokens/borders";
export * from "./tokens/animations";
export * from "./tokens/gradients";
export * from "./tokens/status";

// Семантические токены
export * from "./semantic/colors";
export * from "./semantic/typography";

// Утилиты
export * from "./utils/typography";
export * from "./utils/colors";

// CSS переменные
export * from "./css-variables";

// Re-export для удобства
export { baseColors as colors } from "./tokens/colors";
export { spacing, semanticSpacing } from "./tokens/spacing";
export { fontSize, fontWeight, textStyles, fontFamily } from "./tokens/typography";
export { shadows, semanticShadows } from "./tokens/shadows";
export { borderRadius, semanticBorders, borderWidth } from "./tokens/borders";
export { duration, easing, keyframes, semanticAnimations, delay } from "./tokens/animations";
export {
  statCardGradients,
  levelGradients,
  getStatCardClasses,
  getLevelCardClasses,
} from "./tokens/gradients";
export { statusConfig, getStatusConfig, getStatusClasses, type TripStatus } from "./tokens/status";
export { semanticColors, colorClasses } from "./semantic/colors";
export {
  typographyClasses,
  getTypographyClass,
  type TypographyVariant,
} from "./semantic/typography";
export { applyTypography, Typography } from "./utils/typography";
export { applyColor, getColorValue } from "./utils/colors";
