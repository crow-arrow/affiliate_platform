import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkIsAuth, getMe } from "@/redux/features/auth/authSlice";
import { resolveTenant } from "@/redux/features/tenant/tenantSlice";
import { isPublicRoute as checkIsPublicRoute, extractTenantSlugFromPath } from "@/constants/routes";

type AuthStatus = "idle" | "checking" | "done";

interface UseAuthTenantResolverResult {
  isLoading: boolean;
  isAuth: boolean;
  user: any | null;
  tenant: any | null;
  error: string | null;
  tenantStatus: string;
}

/**
 * Централизованный хук для авторизации и резолвинга tenant
 * Объединяет getMe() и resolveTenant() с автоматическими редиректами
 */
export function useAuthTenantResolver(): UseAuthTenantResolverResult {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = useAppSelector(checkIsAuth);
  const { user } = useAppSelector((state) => state.auth);
  const {
    current: currentTenant,
    status: tenantStatus,
    resolvedOnce,
  } = useAppSelector(
    (s) => (s as any).tenant || { current: null, status: "idle", resolvedOnce: false }
  );

  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // --- 1. Проверка авторизации (token + getMe)
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      setAuthStatus("done");
      return;
    }

    if (isAuth && user) {
      setAuthStatus("done");
      return;
    }

    if (authStatus === "checking") return;

    setAuthStatus("checking");
    dispatch(getMe())
      .unwrap()
      .then(() => {
        setAuthStatus("done");
        setError(null);
      })
      .catch((error: any) => {
        setAuthStatus("done");

        const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;
        const isNetworkError = !error?.response;

        if (isAuthError && !isNetworkError) {
          // Токен невалиден — очищаем
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refreshToken");
          setError("Unauthorized");
        } else {
          console.warn("Network/CORS error — keeping user logged in:", error?.message);
          setError(null);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // только при монтировании

  // --- 2. Резолвинг tenant из URL
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    // Если tenant уже резолвлен или резолвится - не делаем повторный запрос
    if (tenantStatus === "loading" || tenantStatus === "succeeded") {
      return;
    }

    // Если уже был резолв, но currentTenant есть - не резолвим повторно
    if (resolvedOnce && currentTenant) {
      return;
    }

    const host = window.location.host.toLowerCase();
    const pathname = location.pathname;
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

    let slug: string | undefined = undefined;

    // Priority 1: path (dev mode)
    if (isLocal) slug = extractTenantSlugFromPath(pathname) || undefined;

    // Priority 2: query params
    if (!slug) slug = searchParams.get("tenant") || searchParams.get("slug") || undefined;

    // Priority 3: subdomain (prod)
    if (!slug && host.includes(".") && !isLocal) {
      const parts = host.split(":")[0].split(".");
      if (parts.length >= 3) slug = parts[0];
    }

    // Резолвим tenant из URL, даже если resolvedOnce = false (при перезагрузке)
    // Это позволяет восстановить tenant из URL после перезагрузки страницы
    if (slug) {
      dispatch(resolveTenant({ slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, searchParams, dispatch, tenantStatus, currentTenant]);

  // --- 3. Редирект на /sign-in для неавторизованных
  useEffect(() => {
    if (hasRedirected || authStatus !== "done") return;

    const token = window.localStorage.getItem("token");
    const isPublicRoute = checkIsPublicRoute(location.pathname);

    // СНАЧАЛА проверяем tenant-scoped маршруты - их НИКОГДА не редиректим на sign-in
    const tenantSlugInPath = extractTenantSlugFromPath(location.pathname);
    const isTenantScopedRoute = tenantSlugInPath !== null;

    if (isTenantScopedRoute) {
      // Для tenant-scoped маршрутов не делаем редиректов - они обрабатываются в App.tsx
      return;
    }

    // Редиректим только если нет токена и не публичный маршрут
    if (!token && !isPublicRoute) {
      setHasRedirected(true);
      navigate("/sign-in", { replace: true });
    }
  }, [authStatus, location.pathname, navigate, hasRedirected]);

  // --- 4. Редирект на 404, если tenant не найден (только для tenant-scoped маршрутов)
  useEffect(() => {
    if (tenantStatus === "failed" && !hasRedirected) {
      const tenantSlugInPath = extractTenantSlugFromPath(location.pathname);
      // Редиректим на 404 только если мы на tenant-scoped маршруте
      if (tenantSlugInPath) {
        setHasRedirected(true);
        navigate("/404-not-found", { replace: true });
      }
    }
  }, [tenantStatus, location.pathname, navigate, hasRedirected]);

  // --- Итоговое состояние загрузки
  const isLoading = authStatus === "checking" || tenantStatus === "loading";

  return {
    isLoading,
    isAuth,
    user: isAuth ? user : null,
    tenant: currentTenant,
    error,
    tenantStatus,
  };
}
