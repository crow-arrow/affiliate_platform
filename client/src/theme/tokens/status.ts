/**
 * Токены для статусов
 * Семантические стили для статусов заказов/туров
 */

import { CheckCircle2, XCircle, Clock, AlertCircle, CreditCard, LucideIcon } from "lucide-react";

export type TripStatus =
  | "COMPLETED"
  | "APPROVED"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"
  | "PENDING"
  | "WAIT_FOR_APPROVAL"
  | "DEPOSIT_PAID"
  | "ONLINE_PAID"
  | "RECEIPT_SUBMITTED";

/**
 * Конфигурация статусов с улучшенным контрастом для темной темы
 */
export const statusConfig: Record<
  TripStatus | "default",
  {
    icon: LucideIcon;
    bg: {
      light: string;
      dark: string;
    };
    text: {
      light: string;
      dark: string;
    };
    label: string;
  }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Completed",
  },
  APPROVED: {
    icon: CheckCircle2,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Approved",
  },
  CONFIRMED: {
    icon: CheckCircle2,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Confirmed",
  },
  CANCELLED: {
    icon: XCircle,
    bg: {
      light: "bg-red-100",
      dark: "dark:bg-red-900/30",
    },
    text: {
      light: "text-red-600",
      dark: "dark:text-red-300",
    },
    label: "Cancelled",
  },
  REJECTED: {
    icon: XCircle,
    bg: {
      light: "bg-muted",
      dark: "dark:bg-secondary",
    },
    text: {
      light: "text-foreground",
      dark: "dark:text-foreground",
    },
    label: "Rejected",
  },
  PENDING: {
    icon: Clock,
    bg: {
      light: "bg-orange-100",
      dark: "dark:bg-orange-900/30",
    },
    text: {
      light: "text-orange-800",
      dark: "dark:text-orange-300",
    },
    label: "Pending",
  },
  WAIT_FOR_APPROVAL: {
    icon: AlertCircle,
    bg: {
      light: "bg-blue-100",
      dark: "dark:bg-blue-900/30",
    },
    text: {
      light: "text-blue-800",
      dark: "dark:text-blue-300",
    },
    label: "Wait for Approval",
  },
  ONLINE_PAID: {
    icon: CreditCard,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Online Paid",
  },
  DEPOSIT_PAID: {
    icon: CreditCard,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Deposit Paid",
  },
  RECEIPT_SUBMITTED: {
    icon: CreditCard,
    bg: {
      light: "bg-green-100",
      dark: "dark:bg-green-900/30",
    },
    text: {
      light: "text-green-800",
      dark: "dark:text-green-300",
    },
    label: "Receipt Submitted",
  },
  default: {
    icon: Clock,
    bg: {
      light: "bg-primary",
      dark: "dark:bg-secondary",
    },
    text: {
      light: "text-primary-foreground",
      dark: "dark:text-foreground",
    },
    label: "Unknown",
  },
};

/**
 * Получает конфигурацию статуса
 */
export const getStatusConfig = (status: string): typeof statusConfig.default => {
  const upperStatus = status.toUpperCase() as TripStatus;
  return statusConfig[upperStatus] || statusConfig.default;
};

/**
 * Получает классы для статуса
 */
export const getStatusClasses = (status: string) => {
  const config = getStatusConfig(status);
  return {
    container: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg.light} ${config.bg.dark} ${config.text.light} ${config.text.dark}`,
    icon: "w-3 h-3 mr-1",
  };
};

/** Вкладка для фильтра: value, label, status (или массив статусов для группировки). */
export type OrderTabItem = {
  value: string;
  label: string;
  status: string | string[] | null;
};

/** Группированные вкладки: Approved (APPROVED, CONFIRMED), Pending (PENDING, WAIT_FOR_APPROVAL), Paid, Rejected/Cancelled. */
export function getGroupedOrderTabs(options?: {
  allLabel?: string;
  allValue?: string;
}): OrderTabItem[] {
  const { allLabel = "All", allValue = "outline" } = options ?? {};
  return [
    { value: allValue, label: allLabel, status: null },
    { value: "COMPLETED", label: "Completed", status: "COMPLETED" },
    {
      value: "approved",
      label: "Approved",
      status: ["APPROVED", "CONFIRMED"],
    },
    {
      value: "pending",
      label: "Pending",
      status: ["PENDING", "WAIT_FOR_APPROVAL"],
    },
    {
      value: "paid",
      label: "Paid",
      status: ["ONLINE_PAID", "DEPOSIT_PAID", "RECEIPT_SUBMITTED"],
    },
    {
      value: "rejected",
      label: "Rejected / Cancelled",
      status: ["REJECTED", "CANCELLED"],
    },
  ];
}
