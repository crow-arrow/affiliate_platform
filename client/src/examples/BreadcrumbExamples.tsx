import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import {
  useCustomBreadcrumbs,
  useAdminBreadcrumbs,
} from "@/hooks/use-custom-breadcrumbs";
import { BreadcrumbItem } from "@/hooks/use-breadcrumbs";

// Пример 1: Стандартные breadcrumbs
export const StandardBreadcrumbExample = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Standard Breadcrumbs</h3>
      <DynamicBreadcrumb />
    </div>
  );
};

// Пример 2: Breadcrumbs с кастомными настройками
export const CustomBreadcrumbExample = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Custom Breadcrumbs</h3>
      <DynamicBreadcrumb showHomeIcon={true} maxItems={3} className="text-sm" />
    </div>
  );
};

// Пример 3: Админ breadcrumbs
export const AdminBreadcrumbExample = () => {
  const adminBreadcrumbs = useAdminBreadcrumbs();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Admin Breadcrumbs</h3>
      <DynamicBreadcrumb
        customBreadcrumbs={adminBreadcrumbs}
        showHomeIcon={false}
      />
    </div>
  );
};

// Пример 4: Полностью кастомные breadcrumbs
export const FullyCustomBreadcrumbExample = () => {
  const customBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Electronics", href: "/catalog/electronics" },
    { label: "Smartphones", href: "/catalog/electronics/smartphones" },
    { label: "iPhone 15 Pro", isActive: true },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Fully Custom Breadcrumbs</h3>
      <DynamicBreadcrumb
        customBreadcrumbs={customBreadcrumbs}
        showHomeIcon={true}
        maxItems={5}
      />
    </div>
  );
};

// Пример 5: Breadcrumbs для разных ролей пользователей
export const RoleBasedBreadcrumbExample = () => {
  const userRole = "admin"; // Это должно приходить из контекста/Redux

  const getBreadcrumbsForRole = (role: string): BreadcrumbItem[] => {
    switch (role) {
      case "admin":
        return [
          { label: "Главная", href: "/" },
          { label: "Админ панель", href: "/admin" },
          { label: "Управление", isActive: true },
        ];
      case "genie":
        return [
          { label: "Home", href: "/" },
          { label: "My Account", href: "/my-account" },
          { label: "Profile", isActive: true },
        ];
      default:
        return [
          { label: "Home", href: "/" },
          { label: "Current page", isActive: true },
        ];
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Breadcrumbs by role</h3>
      <DynamicBreadcrumb
        customBreadcrumbs={getBreadcrumbsForRole(userRole)}
        showHomeIcon={true}
      />
    </div>
  );
};
