/**
 * Примеры использования дизайн-токенов
 * Этот файл можно удалить после изучения примеров
 */

import { applyTypography, Typography } from "./utils/typography";
import { applyColor, getColorValue } from "./utils/colors";
import { semanticColors, colorClasses } from "./semantic/colors";
import { spacing, semanticSpacing } from "./tokens/spacing";

// ============================================
// Пример 1: Использование типографики
// ============================================

export function TypographyExample() {
  return (
    <div className="space-y-4">
      {/* Вариант 1: Утилита applyTypography */}
      <h1 className={applyTypography("h1")}>Заголовок H1</h1>
      <p className={applyTypography("body", "text-muted-foreground")}>
        Основной текст с дополнительными классами
      </p>

      {/* Вариант 2: Готовые компоненты */}
      <Typography.h2>Заголовок H2</Typography.h2>
      <Typography.body className="text-muted-foreground">Основной текст</Typography.body>
      <Typography.caption>Подпись</Typography.caption>

      {/* Вариант 3: Прямые Tailwind классы (рекомендуется для shadcn) */}
      <h3 className="text-2xl font-semibold tracking-tight">Заголовок H3</h3>
      <p className="text-base font-normal text-muted-foreground">Основной текст</p>
    </div>
  );
}

// ============================================
// Пример 2: Использование цветов
// ============================================

export function ColorsExample() {
  return (
    <div className="space-y-4">
      {/* Вариант 1: Утилита applyColor */}
      <button className={applyColor("primary")}>Primary Button</button>
      <button className={applyColor("destructive", "rounded-lg px-4 py-2")}>
        Destructive Button
      </button>

      {/* Вариант 2: Tailwind классы (рекомендуется для shadcn) */}
      <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2">
        Primary Button
      </button>
      <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2">
        Destructive Button
      </button>

      {/* Вариант 3: CSS переменные через style */}
      <div
        style={{
          backgroundColor: getColorValue("primary", "bg"),
          color: getColorValue("primary", "text"),
        }}
      >
        Использование CSS переменных
      </div>
    </div>
  );
}

// ============================================
// Пример 3: Использование spacing
// ============================================

export function SpacingExample() {
  return (
    <div className="space-y-4">
      {/* Использование семантических spacing */}
      <div className="p-md">Padding medium (16px)</div>
      <div className="gap-6">Gap large (24px)</div>
      <div className="mt-section">Margin top section (48px)</div>

      {/* Или прямые значения из токенов */}
      <div className="p-4">Padding 4 (16px)</div>
      <div className="gap-6">Gap 6 (24px)</div>
    </div>
  );
}

// ============================================
// Пример 4: Комбинированное использование
// ============================================

export function CombinedExample() {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
      <Typography.h3 className="mb-4">Заголовок карточки</Typography.h3>
      <Typography.body className="text-muted-foreground mb-6">
        Описание карточки с использованием семантических токенов
      </Typography.body>
      <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2">
        Действие
      </button>
    </div>
  );
}

// ============================================
// Пример 5: Использование в компоненте
// ============================================

interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "primary" | "destructive";
}

export function Card({ title, children, variant = "default" }: CardProps) {
  const variantClasses = {
    default: "bg-card text-card-foreground border-border",
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        rounded-lg
        p-6
        shadow-md
        border
      `}
    >
      <Typography.h4 className="mb-4">{title}</Typography.h4>
      <Typography.body>{children}</Typography.body>
    </div>
  );
}
