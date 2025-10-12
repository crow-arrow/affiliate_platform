import axios from "axios";
import {
  refreshAccessToken,
  logout,
} from "../redux/features/auth/authSlice.js";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api`,
  withCredentials: true,
});

// Флаг для предотвращения множественных refresh запросов
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - добавляем токен к каждому запросу
instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Функция для настройки interceptors с доступом к store
export const setupInterceptors = (store) => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Если получили 401 и это не повторный запрос
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Не пытаемся обновить токен для этих эндпоинтов
        if (
          originalRequest.url.includes("/auth/sign-in") ||
          originalRequest.url.includes("/auth/sign-up") ||
          originalRequest.url.includes("/auth/refresh-token")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Если уже идет обновление токена, добавляем запрос в очередь
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Пытаемся обновить токен
          const resultAction = await store.dispatch(refreshAccessToken());

          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newToken = resultAction.payload.token;

            // Обновляем токен в оригинальном запросе
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Обрабатываем очередь запросов
            processQueue(null, newToken);

            isRefreshing = false;

            // Повторяем оригинальный запрос с новым токеном
            return instance(originalRequest);
          } else {
            // Если refresh не удался, разлогиниваем пользователя
            processQueue(new Error("Token refresh failed"), null);
            store.dispatch(logout());
            isRefreshing = false;

            // Редирект на страницу логина (если нужно)
            if (window.location.pathname !== "/sign-in") {
              window.location.href = "/sign-in";
            }

            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);

          store.dispatch(logout());

          isRefreshing = false;

          if (window.location.pathname !== "/sign-in") {
            window.location.href = "/sign-in";
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default instance;
