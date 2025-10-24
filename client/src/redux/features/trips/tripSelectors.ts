import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Trip } from "@/redux/features/trips/tripSlice";

// Базовый селектор (raw доступ)
const selectTripsState = (state: RootState) => state.trips;

// 📌 Получить все поездки
export const selectAllTrips = createSelector(
  [selectTripsState],
  (tripsState) => tripsState.trips
);

// 📌 Получить статус загрузки
export const selectTripStatus = createSelector(
  [selectTripsState],
  (tripsState) => tripsState.status
);

// 📌 Получить ошибку
export const selectTripError = createSelector(
  [selectTripsState],
  (tripsState) => tripsState.error
);

// 📌 Получить только предстоящие поездки
export const selectUpcomingTrips = createSelector([selectAllTrips], (trips) =>
  trips.filter((trip) => {
    const tripDate = new Date(trip.date);
    const now = new Date();
    return tripDate > now;
  })
);

// 📌 Получить количество поездок
export const selectTripsCount = createSelector(
  [selectAllTrips],
  (trips) => trips.length
);
