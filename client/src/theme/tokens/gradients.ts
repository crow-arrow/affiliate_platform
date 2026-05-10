/**
 * Градиентные токены
 * Семантические градиенты для использования в компонентах
 */

/**
 * Карточки статистики Dashboard: цвета в global.css (--stat-*), здесь только структура Tailwind.
 */
const STAT_CARD_CLASSES = {
  orders: {
    card: "bg-gradient-to-br from-(--stat-orders-g-from) to-(--stat-orders-g-to) border border-(--stat-orders-border)",
    title: "text-(--stat-orders-title)",
    value: "text-(--stat-orders-value)",
    description: "text-(--stat-orders-description)",
    icon: "text-(--stat-orders-icon)",
    accent: "bg-(--stat-orders-accent)",
  },
  sales: {
    card: "bg-gradient-to-br from-(--stat-sales-g-from) to-(--stat-sales-g-to) border border-(--stat-sales-border)",
    title: "text-(--stat-sales-title)",
    value: "text-(--stat-sales-value)",
    description: "text-(--stat-sales-description)",
    icon: "text-(--stat-sales-icon)",
    accent: "bg-(--stat-sales-accent)",
  },
  commission: {
    card: "bg-gradient-to-br from-(--stat-commission-g-from) to-(--stat-commission-g-to) border border-(--stat-commission-border)",
    title: "text-(--stat-commission-title)",
    value: "text-(--stat-commission-value)",
    description: "text-(--stat-commission-description)",
    icon: "text-(--stat-commission-icon)",
    accent: "bg-(--stat-commission-accent)",
  },
  clicks: {
    card: "bg-gradient-to-br from-(--stat-clicks-g-from) to-(--stat-clicks-g-to) border border-(--stat-clicks-border)",
    title: "text-(--stat-clicks-title)",
    value: "text-(--stat-clicks-value)",
    description: "text-(--stat-clicks-description)",
    icon: "text-(--stat-clicks-icon)",
    accent: "bg-(--stat-clicks-accent)",
  },
} as const;

export type StatCardType = keyof typeof STAT_CARD_CLASSES;

/**
 * Градиенты для уровней партнеров
 */
export const levelGradients = {
  bronze: {
    light: "bg-gradient-to-br from-orange-50 to-amber-100",
    dark: "dark:from-orange-950 dark:to-amber-900",
    border: {
      light: "border-orange-200",
      dark: "dark:border-orange-800",
    },
    text: {
      icon: {
        light: "text-orange-600",
        dark: "dark:text-orange-400",
      },
      title: {
        light: "text-orange-700",
        dark: "dark:text-orange-300",
      },
      description: {
        light: "text-orange-700",
        dark: "dark:text-orange-300",
      },
    },
    accent: {
      light: "bg-orange-200",
      dark: "dark:bg-orange-800",
    },
  },
  silver: {
    light: "bg-gradient-to-br from-muted to-card",
    dark: "dark:from-card dark:to-muted",
    border: {
      light: "border-border",
      dark: "dark:border-border",
    },
    text: {
      icon: {
        light: "text-muted-foreground",
        dark: "dark:text-muted-foreground",
      },
      title: {
        light: "text-foreground",
        dark: "dark:text-foreground",
      },
      description: {
        light: "text-muted-foreground",
        dark: "dark:text-muted-foreground",
      },
    },
    accent: {
      light: "bg-muted",
      dark: "dark:bg-secondary",
    },
  },
  gold: {
    light: "bg-gradient-to-br from-[#f4e6d7] to-[#cbaf87]",
    dark: "dark:from-[#8b6f47] dark:to-[#6b5b3a]",
    border: {
      light: "border-[#cbaf87]",
      dark: "dark:border-[#8b6f47]",
    },
    text: {
      icon: {
        light: "text-[#8b6f47]",
        dark: "dark:text-[#f4e6d7]",
      },
      title: {
        light: "text-[#6b5b3a]",
        dark: "dark:text-[#f4e6d7]",
      },
      description: {
        light: "text-[#8b6f47]",
        dark: "dark:text-[#f4e6d7]",
      },
    },
    accent: {
      light: "bg-[#cbaf87]",
      dark: "dark:bg-[#8b6f47]",
    },
  },
  platinum: {
    light: "bg-gradient-to-br from-muted to-card",
    dark: "dark:from-card dark:to-muted",
    border: {
      light: "border-border",
      dark: "dark:border-border",
    },
    text: {
      icon: {
        light: "text-muted-foreground",
        dark: "dark:text-muted-foreground",
      },
      title: {
        light: "text-foreground",
        dark: "dark:text-foreground",
      },
      description: {
        light: "text-muted-foreground",
        dark: "dark:text-muted-foreground",
      },
    },
    accent: {
      light: "bg-muted",
      dark: "dark:bg-secondary",
    },
  },
} as const;

/**
 * Утилиты для получения полных классов градиентов
 */
export const getStatCardClasses = (type: StatCardType) => STAT_CARD_CLASSES[type];

export const getLevelCardClasses = (level: keyof typeof levelGradients) => {
  const gradient = levelGradients[level];
  return {
    card: `${gradient.light} ${gradient.dark} ${gradient.border.light} ${gradient.border.dark}`,
    icon: `${gradient.text.icon.light} ${gradient.text.icon.dark}`,
    title: `${gradient.text.title.light} ${gradient.text.title.dark}`,
    description: `${gradient.text.description.light} ${gradient.text.description.dark}`,
    accent: `${gradient.accent.light} ${gradient.accent.dark}`,
  };
};

