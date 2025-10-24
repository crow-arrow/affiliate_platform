import axios from "axios";
import { refreshAccessToken, logout } from "../redux/features/auth/authSlice";
import type { StoreType } from "@/redux/store";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api`,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];
let interceptorsSet = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

export const cancelFailedQueue = () => {
  failedQueue.forEach(({ reject }) => reject(new Error("Request cancelled")));
  failedQueue = [];
  isRefreshing = false;
};

const isAuthRoute = (url?: string): boolean => {
  return ["/auth/sign-in", "/auth/sign-up", "/auth/refresh-token"].some(
    (path) => url?.includes(path)
  );
};

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

export const setupInterceptors = (store: StoreType) => {
  if (interceptorsSet) return;
  interceptorsSet = true;

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthRoute(originalRequest.url)
      ) {
        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const resultAction = await store.dispatch(refreshAccessToken());

          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newToken = resultAction.payload.token;

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);

            return instance(originalRequest);
          } else {
            processQueue(new Error("Token refresh failed"), null);
            cancelFailedQueue();
            store.dispatch(logout());
            if (window.location.pathname !== "/sign-in") {
              window.location.href = "/sign-in";
            }
            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          cancelFailedQueue();
          store.dispatch(logout());
          if (window.location.pathname !== "/sign-in") {
            window.location.href = "/sign-in";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default instance;
