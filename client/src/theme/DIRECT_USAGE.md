# Прямое использование семантических классов

Теперь вы можете использовать семантические классы напрямую, без `cn()` и `applyTypography()`!

## Типографика

Вместо:

```tsx
<h1 className={applyTypography("h2")}>Заголовок</h1>
<p className={applyTypography("body-sm", "text-muted-foreground")}>Текст</p>
```

Используйте:

```tsx
<h1 className="typography-h2">Заголовок</h1>
<p className="typography-body-sm text-muted-foreground">Текст</p>
```

### Доступные классы типографики:

- `.typography-h1` - Главный заголовок
- `.typography-h2` - Заголовок второго уровня
- `.typography-h3` - Заголовок третьего уровня
- `.typography-h4` - Заголовок четвертого уровня
- `.typography-h5` - Заголовок пятого уровня
- `.typography-h6` - Заголовок шестого уровня
- `.typography-body` - Основной текст
- `.typography-body-sm` - Мелкий текст
- `.typography-body-lg` - Крупный текст
- `.typography-label` - Метка формы
- `.typography-label-sm` - Маленькая метка
- `.typography-caption` - Подпись
- `.typography-lead` - Вводный текст
- `.typography-large` - Крупный текст
- `.typography-small` - Мелкий текст
- `.typography-muted` - Приглушенный текст

## Цвета

Используйте стандартные Tailwind классы:

```tsx
<div className="bg-primary text-primary-foreground">Основной</div>
<div className="bg-card text-card-foreground">Карточка</div>
<div className="bg-sidebar text-sidebar-foreground">Сайдбар</div>
```

## Spacing

Используйте семантические spacing классы:

```tsx
<div className="gap-4 p-lg">Контейнер</div>
<div className="gap-2 p-md">Элемент</div>
```

### Доступные spacing классы:

**Gap (используйте числовые значения):**

- `gap-1` - 4px
- `gap-2` - 8px
- `gap-4` - 16px
- `gap-6` - 24px
- `gap-8` - 32px
- `gap-12` - 48px
- `gap-16` - 64px

**Padding/Margin (семантические значения):**

- `p-xs`, `m-xs` - 4px
- `p-sm`, `m-sm` - 8px
- `p-md`, `m-md` - 16px
- `p-lg`, `m-lg` - 24px
- `p-xl`, `m-xl` - 32px
- `p-2xl`, `m-2xl` - 48px
- `p-3xl`, `m-3xl` - 64px

## Примеры

### Форма

```tsx
<form className="flex flex-col gap-6">
  <h1 className="typography-h2">Заголовок</h1>
  <p className="typography-body-sm text-muted-foreground">Описание</p>
  <div className="grid gap-4">
    <input className="..." />
  </div>
</form>
```

### Кнопка

```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Нажми меня</button>
```

### Карточка

```tsx
<div className="bg-card text-card-foreground border border-card-border p-lg rounded-lg">
  Содержимое карточки
</div>
```

## Преимущества

✅ Чистый код - без `cn()` и функций
✅ Все классы в одном месте
✅ Автодополнение в IDE
✅ Семантика сохраняется
✅ Легко читать и поддерживать
