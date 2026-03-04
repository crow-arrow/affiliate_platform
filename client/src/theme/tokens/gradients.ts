/**
 * Градиентные токены
 * Семантические градиенты для использования в компонентах
 */

/**
 * Градиенты для карточек статистики
 */
export const statCardGradients = {
  orders: {
    light: "bg-gradient-to-br from-blue-50 to-indigo-100",
    dark: "dark:from-blue-950 dark:to-indigo-900",
    border: {
      light: "border-blue-200",
      dark: "dark:border-blue-800",
    },
    text: {
      title: {
        light: "text-blue-700",
        dark: "dark:text-blue-300",
      },
      value: {
        light: "text-blue-900",
        dark: "dark:text-blue-100",
      },
      description: {
        light: "text-blue-600",
        dark: "dark:text-blue-400",
      },
    },
    icon: {
      light: "text-blue-600",
      dark: "dark:text-blue-400",
    },
    accent: {
      light: "bg-blue-200",
      dark: "dark:bg-blue-800",
    },
  },
  sales: {
    light: "bg-gradient-to-br from-green-50 to-emerald-100",
    dark: "dark:from-green-950 dark:to-emerald-900",
    border: {
      light: "border-green-200",
      dark: "dark:border-green-800",
    },
    text: {
      title: {
        light: "text-green-700",
        dark: "dark:text-green-300",
      },
      value: {
        light: "text-green-900",
        dark: "dark:text-green-100",
      },
      description: {
        light: "text-green-600",
        dark: "dark:text-green-400",
      },
    },
    icon: {
      light: "text-green-600",
      dark: "dark:text-green-400",
    },
    accent: {
      light: "bg-green-200",
      dark: "dark:bg-green-800",
    },
  },
  commission: {
    light: "bg-gradient-to-br from-purple-50 to-violet-100",
    dark: "dark:from-purple-950 dark:to-violet-900",
    border: {
      light: "border-purple-200",
      dark: "dark:border-purple-800",
    },
    text: {
      title: {
        light: "text-purple-700",
        dark: "dark:text-purple-300",
      },
      value: {
        light: "text-purple-900",
        dark: "dark:text-purple-100",
      },
      description: {
        light: "text-purple-600",
        dark: "dark:text-purple-400",
      },
    },
    icon: {
      light: "text-purple-600",
      dark: "dark:text-purple-400",
    },
    accent: {
      light: "bg-purple-200",
      dark: "dark:bg-purple-800",
    },
  },
  clicks: {
    light: "bg-gradient-to-br from-orange-50 to-amber-100",
    dark: "dark:from-orange-950 dark:to-amber-900",
    border: {
      light: "border-orange-200",
      dark: "dark:border-orange-800",
    },
    text: {
      title: {
        light: "text-orange-700",
        dark: "dark:text-orange-300",
      },
      value: {
        light: "text-orange-900",
        dark: "dark:text-orange-100",
      },
      description: {
        light: "text-orange-600",
        dark: "dark:text-orange-400",
      },
    },
    icon: {
      light: "text-orange-600",
      dark: "dark:text-orange-400",
    },
    accent: {
      light: "bg-orange-200",
      dark: "dark:bg-orange-800",
    },
  },
} as const;

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
export const getStatCardClasses = (type: keyof typeof statCardGradients) => {
  const gradient = statCardGradients[type];
  return {
    card: `${gradient.light} ${gradient.dark} ${gradient.border.light} ${gradient.border.dark}`,
    title: `${gradient.text.title.light} ${gradient.text.title.dark}`,
    value: `${gradient.text.value.light} ${gradient.text.value.dark}`,
    description: `${gradient.text.description.light} ${gradient.text.description.dark}`,
    icon: `${gradient.icon.light} ${gradient.icon.dark}`,
    accent: `${gradient.accent.light} ${gradient.accent.dark}`,
  };
};

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

