import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Click } from "./clicksSlice";

// 🔹 Базовый селектор
const selectClicksState = (state: RootState) => state.clicks;

// 🔹 Все клики
export const selectAllClicks = createSelector([selectClicksState], (state) => state.clicks);

// 🔹 Статус загрузки кликов
export const selectClicksStatus = createSelector([selectClicksState], (state) => state.status);

// 🔹 Ошибка загрузки
export const selectClicksError = createSelector([selectClicksState], (state) => state.error);

// 🔹 Количество кликов
export const selectClicksCount = createSelector([selectAllClicks], (clicks) => clicks.length);

// 🔹 Клики по определённому типу (например, "signup", "landing", ...)
export const selectClicksByType = (type: string) =>
  createSelector([selectAllClicks], (clicks) => clicks.filter((click) => click.type === type));

// 🔹 Клики по устройству (например, "mobile", "desktop")
export const selectClicksByDevice = (device: string) =>
  createSelector([selectAllClicks], (clicks) =>
    clicks.filter((click) => click.device_type === device)
  );

// 🔹 Клики по дате (например, за сегодня)
export const selectClicksAfterDate = (date: Date) =>
  createSelector([selectAllClicks], (clicks) =>
    clicks.filter((click) => new Date(click.timestamp) > date)
  );

// 🔹 Уникальные IP-адреса
export const selectUniqueIpCount = createSelector([selectAllClicks], (clicks) => {
  const uniqueIps = new Set(clicks.map((click) => click.ip_address));
  return uniqueIps.size;
});

// 🔹 Список всех user-agent'ов (например, для аналитики браузеров)
export const selectUserAgents = createSelector([selectAllClicks], (clicks) =>
  Array.from(new Set(clicks.map((click) => click.user_agent || "Unknown")))
);

export const selectClicksLastNDays = (days: number) =>
  createSelector([selectAllClicks], (clicks) => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);

    return clicks.filter((click) => new Date(click.timestamp) >= cutoff);
  });
