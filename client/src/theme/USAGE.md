# Руководство по использованию семантических токенов

## Импорт

Все токены доступны из централизованного экспорта:

```typescript
import {
  applyTypography,
  applyColor,
  semanticColors,
  getStatCardClasses,
  getLevelCardClasses,
  StatusBadge,
  spacing,
  // ... и другие
} from "@/theme";
```

## 1. Типографика

### Использование утилиты `applyTypography`

```tsx
import { applyTypography } from "@/theme";

// Заголовки
<h1 className={applyTypography("h1")}>Главный заголовок</h1>
<h2 className={applyTypography("h2")}>Подзаголовок</h2>
<h3 className={applyTypography("h3")}>Заголовок секции</h3>

// Текст
<p className={applyTypography("body")}>Основной текст</p>
<p className={applyTypography("body-sm")}>Мелкий текст</p>
<span className={applyTypography("caption")}>Подпись</span>
<label className={applyTypography("label")}>Метка формы</label>

// С дополнительными классами
<h1 className={applyTypography("h1", "text-primary mb-4")}>
  Заголовок с дополнительными стилями
</h1>
```

### Использование компонентов Typography

```tsx
import { Typography } from "@/theme";

<Typography.h1>Главный заголовок</Typography.h1>
<Typography.h2 className="mb-4">Подзаголовок</Typography.h2>
<Typography.body>Основной текст</Typography.body>
<Typography.caption>Подпись</Typography.caption>
```

## 2. Цвета

### Семантические цвета через утилиту `applyColor`

```tsx
import { applyColor } from "@/theme";

// Кнопки
<button className={applyColor("primary")}>
  Основная кнопка
</button>

<button className={applyColor("destructive")}>
  Опасное действие
</button>

<button className={applyColor("success")}>
  Успешное действие
</button>

// С дополнительными классами
<div className={applyColor("warning", "rounded-lg p-4")}>
  Предупреждение
</div>
```

### Цвета карточек и поверхностей

Теперь `card` расширен свойствами из `sidebar` для переиспользования:

```tsx
// Базовая карточка
<Card className="bg-card text-card-foreground">
  Контент
</Card>

// Карточка с акцентом (hover эффект)
<div className="bg-card-accent text-card-accent-foreground">
  Акцентная карточка
</div>

// Карточка с primary цветом
<div className="bg-card-primary text-card-primary-foreground">
  Primary карточка
</div>

// Карточка с границей
<div className="bg-card border border-card-border">
  Карточка с границей
</div>

// Сайдбар (обратная совместимость)
<div className="bg-sidebar text-sidebar-foreground">
  Сайдбар
</div>
```

### Прямое использование семантических цветов

```tsx
import { semanticColors } from "@/theme";

// В inline стилях
<div style={{
  backgroundColor: semanticColors.primary.bg,
  color: semanticColors.primary.text
}}>
  Контент
</div>

// В className (через CSS переменные)
<div className="bg-primary text-primary-foreground">
  Контент
</div>
```

### Использование цветов из Tailwind (shadcn/ui)

```tsx
// Эти классы автоматически адаптируются к теме
<div className="bg-primary text-primary-foreground">Основной</div>
<div className="bg-secondary text-secondary-foreground">Вторичный</div>
<div className="bg-destructive text-destructive-foreground">Ошибка</div>
<div className="bg-muted text-muted-foreground">Приглушенный</div>
<div className="bg-accent text-accent-foreground">Акцент</div>
<div className="bg-success text-success-foreground">Успех</div>
<div className="bg-warning text-warning-foreground">Предупреждение</div>
<div className="bg-info text-info-foreground">Информация</div>
```

### Расширенные свойства карточек

Теперь `card` расширен свойствами из `sidebar` для переиспользования в карточках и других поверхностях:

```tsx
// Базовая карточка
<Card className="bg-card text-card-foreground">
  Контент
</Card>

// Карточка с акцентом (hover эффект)
<div className="bg-card-accent text-card-accent-foreground hover:bg-card-accent/90">
  Акцентная карточка
</div>

// Карточка с primary цветом
<div className="bg-card-primary text-card-primary-foreground">
  Primary карточка
</div>

// Карточка с границей
<div className="bg-card border border-card-border">
  Карточка с границей
</div>

// Интерактивная карточка с hover
<div className="bg-card hover:bg-card-accent transition-colors">
  Hover карточка
</div>

// Сайдбар (обратная совместимость - можно использовать card)
<div className="bg-sidebar text-sidebar-foreground">
  Сайдбар
</div>
// Или использовать card для сайдбара
<div className="bg-card border-card-border">
  Сайдбар с card цветами
</div>
```

## 3. Отступы (Spacing)

```tsx
import { spacing, semanticSpacing } from "@/theme";

// Использование через Tailwind классы
<div className="p-4">Отступ 16px</div>
<div className="m-8">Внешний отступ 32px</div>
<div className="gap-6">Промежуток 24px</div>

// Доступные значения из spacing:
// xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px
```

## 4. Статусы (Status Badges)

### Использование компонента StatusBadge

```tsx
import { StatusBadge } from "@/components/ui/status-badge";

// Базовое использование
<StatusBadge status="COMPLETED" />
<StatusBadge status="PENDING" />
<StatusBadge status="CANCEL" />
<StatusBadge status="WAIT_FOR_APPROVAL" />

// Без иконки
<StatusBadge status="COMPLETED" showIcon={false} />

// Компактный вариант
<StatusBadge status="PENDING" variant="compact" />

// С дополнительными классами
<StatusBadge status="COMPLETED" className="ml-2" />
```

### Прямое использование токенов статусов

```tsx
import { getStatusConfig, getStatusClasses } from "@/theme";

const status = "COMPLETED";
const config = getStatusConfig(status);
const Icon = config.icon;

<span className={getStatusClasses(status).container}>
  <Icon className={getStatusClasses(status).icon} />
  {config.label}
</span>;
```

## 5. Градиенты для карточек

### Статистические карточки

```tsx
import { getStatCardClasses } from "@/theme";

// Карточка заказов
<Card className={`relative overflow-hidden ${getStatCardClasses("orders").card}`}>
  <CardHeader>
    <CardTitle className={getStatCardClasses("orders").title}>Total Orders</CardTitle>
  </CardHeader>
  <CardContent>
    <div className={getStatCardClasses("orders").text}>{count}</div>
  </CardContent>
</Card>;

// Доступные типы: "orders", "sales", "commission", "clicks"
```

### Карточки уровней

```tsx
import { getLevelCardClasses } from "@/theme";

// Карточка уровня
<div className={`relative overflow-hidden ${getLevelCardClasses("GOLD").card}`}>
  <h3 className={getLevelCardClasses("GOLD").title}>Gold Level</h3>
  <p className={getLevelCardClasses("GOLD").description}>Описание уровня</p>
</div>;

// Доступные уровни: "BRONZE", "SILVER", "GOLD", "PLATINUM"
```

## 6. Тени (Shadows)

```tsx
import { shadows, semanticShadows } from "@/theme";

// Использование через Tailwind
<div className="shadow-sm">Маленькая тень</div>
<div className="shadow-md">Средняя тень</div>
<div className="shadow-lg">Большая тень</div>
<div className="shadow-xl">Очень большая тень</div>
```

## 7. Скругления (Border Radius)

```tsx
// Использование через Tailwind
<div className="rounded-sm">Маленькое скругление</div>
<div className="rounded-md">Среднее скругление</div>
<div className="rounded-lg">Большое скругление</div>
<div className="rounded-full">Полное скругление</div>
```

## 8. Анимации

```tsx
// Использование через Tailwind
<div className="transition-all duration-300 ease-in-out">
  Плавный переход
</div>

<div className="animate-fade-in">
  Анимация появления
</div>
```

## Полный пример компонента

````tsx
import { applyTypography, getStatCardClasses, StatusBadge, applyColor } from "@/theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TripCard({ trip }) {
  return (
    <Card className="p-6 hover:bg-card-accent transition-colors">
      <CardHeader>
        <CardTitle className={applyTypography("h3")}>{trip.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className={applyTypography("body", "text-muted-foreground mb-4")}>{trip.description}</p>

        <div className="flex items-center justify-between">
          <StatusBadge status={trip.status} />

          <button className={applyColor("primary", "px-4 py-2 rounded-md")}>Подробнее</button>
        </div>
      </CardContent>
    </Card>
  );
}

### Пример использования расширенных свойств card

```tsx
// Карточка с акцентом при наведении
<Card className="bg-card hover:bg-card-accent border-card-border transition-colors">
  <CardHeader>
    <CardTitle className="text-card-foreground">Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-card-foreground/80">Контент карточки</p>
  </CardContent>
</Card>

// Панель с primary цветом
<div className="bg-card-primary text-card-primary-foreground p-4 rounded-lg">
  Primary панель
</div>

// Интерактивный элемент с акцентом
<button className="bg-card hover:bg-card-accent text-card-foreground hover:text-card-accent-foreground px-4 py-2 rounded-md transition-colors">
  Кнопка
</button>
````

````

## Пример использования в Dashboard

```tsx
import { getStatCardClasses, applyTypography, StatusBadge } from "@/theme";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Статистические карточки */}
      <Card className={`relative overflow-hidden ${getStatCardClasses("orders").card}`}>
        <CardHeader>
          <CardTitle className={applyTypography("label", getStatCardClasses("orders").title)}>
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={applyTypography("h3", getStatCardClasses("orders").title)}>42</div>
        </CardContent>
      </Card>

      {/* Таблица с статусами */}
      <Table>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell>{trip.id}</TableCell>
              <TableCell>
                <StatusBadge status={trip.orderStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
````

## Лучшие практики

1. **Всегда используйте семантические токены** вместо хардкодных значений
2. **Используйте `applyTypography`** для типографики вместо прямых классов
3. **Используйте `StatusBadge`** для отображения статусов
4. **Используйте `getStatCardClasses` и `getLevelCardClasses`** для карточек
5. **Комбинируйте семантические токены** с дополнительными Tailwind классами через `cn()`

## Совместимость с shadcn/ui

Все семантические токены полностью совместимы с shadcn/ui компонентами:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { applyTypography } from "@/theme";

<Card>
  <CardHeader>
    <CardTitle className={applyTypography("h2")}>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Кнопка</Button>
  </CardContent>
</Card>;
```
