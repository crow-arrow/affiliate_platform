import { useLocation } from "react-router-dom";
import { getBreadcrumbLabel } from "@/config/breadcrumb-config";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
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

    // Строим путь по сегментам
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

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
