# Использование семантических spacing классов

## Доступные классы

Все семантические spacing классы работают для всех утилит Tailwind:

### Gap (отступы между элементами)

Используйте числовые значения Tailwind:

- `gap-1` - 4px
- `gap-2` - 8px
- `gap-4` - 16px
- `gap-6` - 24px
- `gap-8` - 32px
- `gap-12` - 48px
- `gap-16` - 64px

### Padding (внутренние отступы)

- `p-xs` - 4px
- `p-sm` - 8px
- `p-md` - 16px
- `p-lg` - 24px
- `p-xl` - 32px
- `p-2xl` - 48px
- `p-3xl` - 64px

Также доступны варианты:

- `px-xs`, `py-xs`, `pt-xs`, `pb-xs`, `pl-xs`, `pr-xs` и т.д.

### Margin (внешние отступы)

- `m-xs` - 4px
- `m-sm` - 8px
- `m-md` - 16px
- `m-lg` - 24px
- `m-xl` - 32px
- `m-2xl` - 48px
- `m-3xl` - 64px

Также доступны варианты:

- `mx-xs`, `my-xs`, `mt-xs`, `mb-xs`, `ml-xs`, `mr-xs` и т.д.

### Space (отступы между дочерними элементами)

- `space-x-xs`, `space-y-xs` - 4px
- `space-x-sm`, `space-y-sm` - 8px
- `space-x-md`, `space-y-md` - 16px
- `space-x-lg`, `space-y-lg` - 24px
- `space-x-xl`, `space-y-xl` - 32px
- `space-x-2xl`, `space-y-2xl` - 48px
- `space-x-3xl`, `space-y-3xl` - 64px

## Примеры использования

```tsx
// Gap между элементами
<div className="flex gap-4">
  <div>Элемент 1</div>
  <div>Элемент 2</div>
</div>

// Padding внутри элемента
<div className="p-lg">
  Контент
</div>

// Margin снаружи элемента
<div className="m-md">
  Элемент с отступом
</div>

// Комбинированное использование
<div className="flex flex-col gap-4 p-lg m-sm">
  <div>Элемент 1</div>
  <div>Элемент 2</div>
</div>
```

## Важно

⚠️ **НЕ используйте** `spacing-*` - это не валидные классы Tailwind!
✅ **Используйте** `gap-*` с числовыми значениями (gap-1, gap-2, gap-4 и т.д.)
✅ **Используйте** `p-*`, `m-*`, `space-*` с семантическими значениями
