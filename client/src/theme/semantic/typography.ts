/**
 * Семантические типографические стили
 * Готовые классы для использования в компонентах
 */

import { textStyles, fontSize, fontWeight } from "../tokens/typography";

/**
 * Tailwind классы для типографики с семантическими цветами
 */
export const typographyClasses = {
  // Headings - используют foreground цвет по умолчанию
  h1: "text-3xl font-bold tracking-tight text-foreground",
  h2: "text-2xl font-bold tracking-tight text-foreground",
  h3: "text-xl font-semibold tracking-tight text-foreground",
  h4: "text-lg font-semibold text-foreground",
  h5: "text-base font-medium text-foreground",
  h6: "text-sm font-medium text-foreground",

  // Body - используют foreground цвет по умолчанию
  body: "text-base font-normal text-foreground",
  "body-sm": "text-sm font-normal text-foreground",
  "body-lg": "text-lg font-normal text-foreground",

  // Labels - используют foreground цвет по умолчанию
  label: "text-sm font-medium text-foreground",
  "label-sm": "text-xs font-medium text-foreground",

  // Captions - используют muted-foreground цвет по умолчанию
  caption: "text-xs font-normal text-muted-foreground",

  // Special
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold text-foreground",
  small: "text-sm font-medium leading-none text-foreground",
  muted: "text-sm text-muted-foreground",
} as const;

/**
 * TypeScript типы для типографики
 */
export type TypographyVariant = keyof typeof typographyClasses;

/**
 * Утилита для получения типографических классов
 */
export const getTypographyClass = (variant: TypographyVariant): string => {
  return typographyClasses[variant] || typographyClasses.body;
};
