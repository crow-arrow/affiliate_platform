# Design System - Theme Tokens

Централизованная система дизайн-токенов для проекта. Совместима с shadcn/ui и Tailwind CSS.

## Структура

```
theme/
├── tokens/          # Базовые токены (примитивы)
│   ├── colors.ts   # Цветовые токены
│   ├── spacing.ts  # Отступы и размеры
│   ├── typography.ts # Шрифты и типографика
│   ├── shadows.ts  # Тени
│   ├── borders.ts  # Границы и радиусы
│   └── animations.ts # Анимации
├── semantic/       # Семантические токены
│   ├── colors.ts  # Семантические цвета (primary, secondary, etc.)
│   └── typography.ts # Семантические типографические стили
├── utils/          # Утилиты для работы с токенами
│   ├── typography.ts # Утилиты для типографики
│   └── colors.ts  # Утилиты для цветов
├── css-variables.ts # Генерация CSS переменных
└── index.ts        # Централизованный экспорт
```

## Использование

### Импорт токенов

```typescript
import { colors, spacing, typography, semanticColors } from "@/theme";
```

### Использование в компонентах

#### Типографика

```tsx
import { applyTypography, Typography } from '@/theme/utils/typography';

// Вариант 1: Утилита
<h1 className={applyTypography("h1")}>Заголовок</h1>
<p className={applyTypography("body", "text-muted-foreground")}>Текст</p>

// Вариант 2: Готовые компоненты
<Typography.h1>Заголовок</Typography.h1>
<Typography.body className="text-muted-foreground">Текст</Typography.body>

// Вариант 3: Tailwind классы
<h1 className="text-4xl font-bold tracking-tight">Заголовок</h1>
```

#### Цвета

```tsx
import { applyColor, getColorValue } from '@/theme/utils/colors';

// Вариант 1: Утилита
<button className={applyColor("primary")}>Кнопка</button>

// Вариант 2: Tailwind классы (рекомендуется)
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Кнопка
</button>

// Вариант 3: CSS переменные
<div style={{ backgroundColor: getColorValue("primary", "bg") }}>
  Контент
</div>
```

#### Spacing

```tsx
// Используйте семантические значения для padding/margin
<div className="p-md"> // 16px
<div className="gap-6"> // 24px (используйте числовые значения для gap)
<div className="mt-section"> // 48px
```

### Семантические цвета

Все цвета автоматически адаптируются к светлой/темной теме:

- `primary` - Основные действия
- `secondary` - Вторичные действия
- `accent` - Акценты
- `destructive` - Деструктивные действия (удаление, ошибки)
- `success` - Успешные действия
- `warning` - Предупреждения
- `info` - Информация

### Семантическая типографика

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Заголовки
- `body`, `body-sm`, `body-lg` - Основной текст
- `label`, `label-sm` - Метки
- `caption` - Подписи

## Интеграция с shadcn/ui

Все токены полностью совместимы с shadcn/ui:

- CSS переменные используются в `global.css`
- Tailwind config расширен токенами
- Компоненты shadcn автоматически используют токены через CSS переменные

## Best Practices

1. **Используйте семантические токены** вместо прямых значений
2. **Не хардкодьте цвета** - используйте `bg-primary` вместо `bg-[#0b2e33]`
3. **Используйте типографические утилиты** для консистентности
4. **Расширяйте токены** в `theme/tokens/` при необходимости
5. **Добавляйте новые семантические значения** в `theme/semantic/`

## Примеры

### Создание компонента с токенами

```tsx
import { applyTypography } from "@/theme/utils/typography";
import { cn } from "@/lib/utils";

export function Card({ title, children, className }) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-lg p-6", className)}>
      <h3 className={applyTypography("h3", "mb-4")}>{title}</h3>
      <div className={applyTypography("body")}>{children}</div>
    </div>
  );
}
```

### Кастомизация цветов

Для изменения цветов отредактируйте `theme/tokens/colors.ts`:

```typescript
export const baseColors = {
  brand: {
    primary: "#ваш-цвет",
    secondary: "#ваш-цвет",
  },
};
```

Затем обновите CSS переменные в `global.css` или используйте функции из `css-variables.ts`.
