// Централизованная конфигурация для breadcrumbs
export const BREADCRUMB_LABELS: Record<string, string> = {
  // Основные страницы
  "my-account": "Dashboard",
  trips: "Trips",
  "clicks-list": "Clicks list",
  documents: "Documents",
  settings: "Settings",

  // Админ панель
  admin: "Admin panel",
  dashboard: "Dashboard",
  team: "Team",
  orders: "Orders",
  calendar: "Calendar",
  invoices: "Invoices",

  // Профиль и настройки
  profile: "Profile",
  account: "Account",
  notifications: "Notifications",
  billing: "Billing",
  security: "Security",
  preferences: "Preferences",
  "crop-avatar": "Edit Avatar",

  // Поддержка
  help: "Help",
  support: "Support",
  feedback: "Feedback",

  // Ошибки
  "404-not-found": "Page Not Found",

  // Тестовые страницы
  test: "Test",
  tests: "Tests",
};

// Специальные конфигурации для разных ролей
export const ROLE_BREADCRUMB_CONFIGS = {
  admin: {
    admin: "Admin Panel",
    dashboard: "Admin Dashboard",
    team: "Team Management",
    orders: "Order Management",
    calendar: "Admin Calendar",
    invoices: "Invoice Management",
  },
  genie: {
    "my-account": "Genie Dashboard",
    trips: "My Trips",
    "clicks-list": "My Clicks",
    documents: "My Documents",
  },
  user: {
    "my-account": "User Dashboard",
    trips: "Available Trips",
    "clicks-list": "Click History",
    documents: "Documents",
  },
};

// Конфигурация для скрытия определенных сегментов
export const HIDDEN_BREADCRUMB_SEGMENTS = [
  "api", // Скрыть API роуты
  "internal", // Скрыть внутренние роуты
  "temp", // Скрыть временные роуты
];

// Функция для получения лейбла с учетом роли пользователя
export const getBreadcrumbLabel = (
  segment: string,
  userRole?: string
): string => {
  // Проверяем, нужно ли скрыть этот сегмент
  if (HIDDEN_BREADCRUMB_SEGMENTS.includes(segment)) {
    return "";
  }

  // Если есть роль, проверяем специальную конфигурацию
  if (
    userRole &&
    ROLE_BREADCRUMB_CONFIGS[userRole as keyof typeof ROLE_BREADCRUMB_CONFIGS]
  ) {
    const roleConfig =
      ROLE_BREADCRUMB_CONFIGS[userRole as keyof typeof ROLE_BREADCRUMB_CONFIGS];
    if (segment in roleConfig) {
      return roleConfig[segment as keyof typeof roleConfig];
    }
  }

  // Возвращаем стандартный лейбл
  return (
    BREADCRUMB_LABELS[segment] ||
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
};
