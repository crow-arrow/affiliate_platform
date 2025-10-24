export const formatCurrency = (value: number | string, currency = "€") =>
  `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}${currency}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatNumberWithCommas = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const formatPercentage = (value: number | string) =>
  `${Number(value).toFixed(2)}%`;
export const formatLevel = (level: number) => `Level ${level}`;
export const formatPhoneNumber = (phone: string) => {
  // Пример форматирования: +1 (123) 456-7890
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};
export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
export const formatShortDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
