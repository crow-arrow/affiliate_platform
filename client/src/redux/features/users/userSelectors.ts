import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Trip, User } from "./userSlice";

// 🔸 Базовый доступ к user state
const selectUserState = (state: RootState) => state.user;

// 🔹 Все пользователи (для админки)
export const selectAllUsers = createSelector([selectUserState], (state) => state.users);

export const selectUserById = (userId: string) =>
  createSelector([selectAllUsers], (users) => users.find((user) => String(user.id) === userId));

// 🔹 Аватар текущего пользователя
export const selectUserAvatar = createSelector(
  [selectUserState],
  (state) => state.currentUser.avatarUrl
);

// 🔹 Поездки текущего пользователя
export const selectUserTrips = createSelector([selectUserState], (state) => state.trips);

// 🔹 Последние 3 поездки
export const selectUserLastThreeTrips = createSelector([selectUserTrips], (trips) =>
  trips
    .slice()
    .sort((a, b) => {
      const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
      const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3)
    .reverse()
);

// 🔹 Все поездки в будущем
export const selectUserUpcomingTrips = createSelector([selectUserTrips], (trips) => {
  const now = new Date();
  return trips.filter((trip) => {
    if (!trip.bookingDate) return false;
    const bookingDate = new Date(trip.bookingDate);
    return !isNaN(bookingDate.getTime()) && bookingDate > now;
  });
});

// 🔹 Общая сумма всех заказов пользователя (€)
export const selectUserTotalRevenue = createSelector([selectUserTrips], (trips) =>
  trips.reduce((sum, trip) => {
    const price = parseFloat(trip.totalPrice || "0");
    return sum + (isNaN(price) ? 0 : price);
  }, 0)
);

// 🔹 Общее количество поездок
export const selectUserTripsCount = createSelector([selectUserTrips], (trips) => trips.length);

// 🔹 Статусы загрузки
export const selectAvatarStatus = createSelector([selectUserState], (state) => state.avatarStatus);

export const selectUsersStatus = createSelector([selectUserState], (state) => state.usersStatus);

export const selectTripsStatus = createSelector([selectUserState], (state) => state.tripsStatus);

// 🔹 Ошибки
export const selectAvatarError = createSelector([selectUserState], (state) => state.avatarError);

export const selectUsersError = createSelector([selectUserState], (state) => state.usersError);

export const selectTripsError = createSelector([selectUserState], (state) => state.tripsError);

export const selectUserMessage = createSelector([selectUserState], (state) => state.message);
