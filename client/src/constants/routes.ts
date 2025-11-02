/**
 * Централизованные константы маршрутов
 */

// Публичные маршруты (не требуют tenant slug)
export const PUBLIC_ROUTES = [
  "sign-in",
  "sign-up",
  "business-sign-up",
  "verify-email",
  "reset-password",
  "request-reset",
  "email-verification",
  "sso-callback",
  "oauth-done",
  "404-not-found",
  "test",
] as const;

// Стандартные пути приложения (требуют tenant slug)
export const APP_ROUTES = [
  "overview",
  "trips",
  "clicks-list",
  "documents",
  "settings",
  "crop-avatar",
  "admin",
] as const;

/**
 * Получает tenant slug из текущего URL пути
 * @param pathname - текущий pathname из location
 * @returns tenant slug или null
 */
export const extractTenantSlugFromPath = (pathname: string): string | null => {
  if (!pathname) return null;

  const pathParts = pathname.split("/").filter(Boolean);
  if (pathParts.length === 0) return null;

  const first = pathParts[0];

  // Проверяем, что это не публичный и не app-маршрут
  const isPublic = PUBLIC_ROUTES.includes(first as any);
  const isApp = APP_ROUTES.includes(first as any);
  const isSpecial = ["404-not-found", "oauth-done", "sso-callback"].includes(first);

  if (!isPublic && !isApp && !isSpecial) {
    return first;
  }

  return null;
};

/**
 * Проверяет, является ли путь публичным маршрутом
 */
export const isPublicRoute = (pathname: string): boolean => {
  const isHomePage = pathname === "/";
  return isHomePage || PUBLIC_ROUTES.some((route) => pathname.startsWith(`/${route}`));
};

/**
 * Проверяет, является ли путь маршрутом приложения без tenant slug
 */
export const isAppRouteWithoutTenant = (pathname: string): boolean => {
  const pathParts = pathname.split("/").filter(Boolean);
  return (
    pathParts.length > 0 && APP_ROUTES.includes(pathParts[0] as any) && !isPublicRoute(pathname)
  );
};

/**
 * Добавляет tenant slug к пути
 * @param path - путь (может быть относительным или абсолютным)
 * @param tenantSlug - slug tenant'а
 * @returns полный путь с tenant slug
 */
export const addTenantSlugToPath = (path: string, tenantSlug: string | null): string => {
  if (!tenantSlug) {
    return path;
  }

  // Если путь начинается с /test, возвращаем как есть (публичный маршрут)
  if (path.startsWith("/test")) {
    return path;
  }

  // Если путь уже содержит tenant slug (начинается с / и не является ни публичным, ни путем приложения), возвращаем как есть
  if (path.startsWith("/")) {
    const parts = path.split("/").filter(Boolean);
    if (
      parts.length > 0 &&
      !PUBLIC_ROUTES.includes(parts[0] as any) &&
      !APP_ROUTES.includes(parts[0] as any)
    ) {
      // Уже содержит tenant slug (например, /jinn-travel/settings/account)
      return path;
    }
  }

  // Добавляем tenant slug к относительному пути
  return `/${tenantSlug}${path.startsWith("/") ? path : `/${path}`}`;
};
