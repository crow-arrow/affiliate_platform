import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useBreadcrumbs, BreadcrumbItem as BreadcrumbItemType } from "@/hooks/use-breadcrumbs";
import { ChevronRight, Home } from "lucide-react";

interface DynamicBreadcrumbProps {
  className?: string;
  showHomeIcon?: boolean;
  maxItems?: number;
  customBreadcrumbs?: BreadcrumbItemType[];
  hideOnMobile?: boolean;
}

export const DynamicBreadcrumb = ({
  className = "",
  showHomeIcon = true,
  maxItems = 5,
  customBreadcrumbs,
  hideOnMobile = true,
}: DynamicBreadcrumbProps) => {
  const defaultBreadcrumbs = useBreadcrumbs();
  const breadcrumbs = customBreadcrumbs || defaultBreadcrumbs;

  // Ограничиваем количество элементов
  const displayBreadcrumbs = breadcrumbs.slice(-maxItems);

  const breadcrumbContent = (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {displayBreadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.label} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator className="hidden md:block">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {breadcrumb.isActive ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {showHomeIcon && index === 0 && <Home className="h-4 w-4" />}
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to={breadcrumb.href || "#"}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {showHomeIcon && index === 0 && <Home className="h-4 w-4" />}
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );

  // Скрываем breadcrumbs на мобильных устройствах если hideOnMobile = true
  if (hideOnMobile) {
    return <div className="hidden md:block">{breadcrumbContent}</div>;
  }

  return breadcrumbContent;
};
