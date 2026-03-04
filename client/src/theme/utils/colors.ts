/**
 * Утилиты для работы с цветами
 * Помогают применять семантические цвета в компонентах
 */

import { colorClasses, semanticColors } from "../semantic/colors";
import { cn } from "@/lib/utils";

/**
 * Применяет семантические цветовые классы
 *
 * @example
 * <button className={applyColor("primary")}>Кнопка</button>
 * <div className={applyColor("destructive", "hover:opacity-90")}>Ошибка</div>
 */
export const applyColor = (
  variant: keyof typeof colorClasses,
  additionalClasses?: string
): string => {
  const classes = colorClasses[variant];
  return cn(classes.bg, classes.text, classes.hover, additionalClasses);
};

/**
 * Получает CSS значение семантического цвета
 *
 * @example
 * style={{ backgroundColor: getColorValue("primary", "bg") }}
 */
export const getColorValue = (
  variant: keyof typeof semanticColors,
  property: "bg" | "text" | "hover" | "active" = "bg"
): string => {
  const color = semanticColors[variant];
  if (typeof color === "object" && property in color) {
    return color[property as keyof typeof color] as string;
  }
  return color as string;
};

