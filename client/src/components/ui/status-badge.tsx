/**
 * Переиспользуемый компонент для отображения статусов
 * Использует семантические токены из theme
 */

import { getStatusConfig, getStatusClasses, type TripStatus } from "@/theme/tokens/status";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * Компонент для отображения статуса заказа/тура
 *
 * @example
 * <StatusBadge status="COMPLETED" />
 * <StatusBadge status="PENDING" showIcon={true} />
 */
export function StatusBadge({
  status,
  showIcon = true,
  className,
  variant = "default",
}: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const classes = getStatusClasses(status);

  // Форматируем текст статуса
  const displayText =
    status === config.label
      ? config.label
      : status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  const paddingClass = variant === "compact" ? "px-2 py-0.5" : "px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium ${paddingClass} ${config.bg.light} ${config.bg.dark} ${config.text.light} ${config.text.dark} ${className ?? ""}`}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {displayText}
    </span>
  );
}

/**
 * Утилита для получения только иконки статуса
 */
export function StatusIcon({ status, className }: { status: string; className?: string }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return <Icon className={`w-3 h-3 ${className ?? ""}`} />;
}
