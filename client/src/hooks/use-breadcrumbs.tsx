import { useLocation } from "react-router-dom";
import { getBreadcrumbLabel } from "@/config/breadcrumb-config";
import { extractTenantSlugFromPath } from "@/constants/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface UseBreadcrumbsOptions {
  /**
   * Tenant slug для скрытия из breadcrumbs.
   * Если не указан, будет извлечен из пути автоматически.
   * Можно использовать useAuthTenantResolver().tenant?.slug для более надежного получения
   */
  tenantSlug?: string | null;
}

export const useBreadcrumbs = (options?: UseBreadcrumbsOptions): BreadcrumbItem[] => {
  const location = useLocation();
  const pathname = location.pathname;

  // Определяем breadcrumbs на основе текущего пути
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Всегда добавляем "Главная" как первый элемент
    breadcrumbs.push({
      label: "",
      href: "/",
    });

    // Определяем tenant slug: приоритет у переданного параметра, затем из пути
    const tenantSlug = options?.tenantSlug ?? extractTenantSlugFromPath(pathname);

    // Строим путь по сегментам
    let currentPath = "";

    segments.forEach((segment, index) => {
      // Строим полный путь (включая tenant slug) для href
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Пропускаем tenant slug (первый сегмент, если он является tenant slug) только в отображении
      if (index === 0 && tenantSlug && segment === tenantSlug) {
        return; // Пропускаем этот сегмент в breadcrumbs, но путь уже построен
      }

      // Определяем название для сегмента
      let label = segment;

      // Если сегмент - это ID (число), показываем его как есть
      if (/^\d+$/.test(segment)) {
        label = `#${segment}`;
      } else {
        // Используем централизованную конфигурацию
        label = getBreadcrumbLabel(segment);

        // Если лейбл пустой (скрытый сегмент), пропускаем
        if (!label) {
          return;
        }
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  };

  return getBreadcrumbs();
};
