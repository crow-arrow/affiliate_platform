import { Layout } from "./components/Layout";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAppSelector } from "./redux/hooks";
import { useLocation } from "react-router-dom";
import { checkIsAuth } from "./redux/features/auth/authSlice";
import { useAuthTenantResolver } from "./hooks/useAuthTenantResolver";

import { AdminDashboard } from "./admin_pages/AdminDashboard";
import { Team } from "./admin_pages/Team";
import { Calendar } from "./pages/Calendar";
import { Invoices } from "./admin_pages/Invoices";
import { AllOrders } from "./admin_pages/AllOrders";
import { LevelSettingsAdmin } from "./admin_pages/LevelSettings";
import { LevelSettingsTest } from "./admin_pages/LevelSettingsTest";

import { Dashboard } from "./pages/Dashboard";
import { DashboardCopy } from "./pages/DashboardCopy";
import { Trips } from "./pages/Trips";
import { CklicksList } from "./pages/CklicksList";
import { Documents } from "./pages/Documents";
import { Settings } from "./pages/Settings";
import { Account } from "./pages/Account";

import { PasswordRecover } from "./pages/PasswordRecover";
import { RequestPasswordReset } from "./pages/RequestPasswordReset";
import { EmailSentMessage } from "./pages/EmailSentMessage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { BusinessSignUpPage } from "./pages/BusinessSignUpPage";
import { CreateWorkspacePage } from "./pages/CreateWorkspacePage";
import { NotFound } from "./pages/NotFound";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./components/protected-routes/ProtectedRoute";
import { SSOCallback } from "./components/verification/SSOCallback";
import { OAuthDone } from "./components/verification/OAuthDone";

import { Toaster } from "@/components/ui/sonner";
import { CropAvatar } from "./components/profile/Avatar";
import {
  isPublicRoute as checkIsPublicRoute,
  isAppRouteWithoutTenant as checkIsAppRouteWithoutTenant,
  extractTenantSlugFromPath,
} from "@/constants/routes";
import { OTPPage } from "./pages/OTPPage";

// Обертка для CropAvatar с дефолтными пропсами
const CropAvatarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <CropAvatar isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

// Компонент для tenant-scoped маршрутов с правильной обработкой загрузки
const TenantScopedRouteElement = () => {
  const { isLoading, isAuth: isAuthFromHook, user, tenant, tenantStatus } = useAuthTenantResolver();
  const isAuth = useAppSelector(checkIsAuth);
  const emailVerified = user?.emailVerified === true;
  const effectiveIsAuth = isAuthFromHook || isAuth;

  // КРИТИЧЕСКИ ВАЖНО: для tenant-scoped маршрутов показываем loader во время загрузки
  // НЕ редиректим на /sign-in пока идет загрузка, так как это может быть перезагрузка страницы
  // Также проверяем наличие токена - если есть токен, значит пользователь может быть авторизован
  const hasToken = !!window.localStorage.getItem("token");
  const shouldWaitForAuth = isLoading || (hasToken && !user);

  if (shouldWaitForAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (effectiveIsAuth && user) {
    // Пользователь авторизован - проверяем email verification
    if (emailVerified) {
      return (
        <ProtectedRoute allowedRoles={["ADMIN", "PARTNER"]}>
          <Layout />
        </ProtectedRoute>
      );
    } else {
      return <Navigate to="/email-verification" />;
    }
  }

  // Пользователь не авторизован - редиректим на sign-in
  // Но только если загрузка завершена и токена нет
  return <Navigate to="/sign-in" />;
};

// Компонент для админ tenant-scoped маршрутов с правильной обработкой загрузки
const AdminTenantScopedRouteElement = () => {
  const { isLoading, isAuth: isAuthFromHook, user, tenant, tenantStatus } = useAuthTenantResolver();
  const isAuth = useAppSelector(checkIsAuth);
  const emailVerified = user?.emailVerified === true;
  const effectiveIsAuth = isAuthFromHook || isAuth;

  // КРИТИЧЕСКИ ВАЖНО: для tenant-scoped маршрутов показываем loader во время загрузки
  // НЕ редиректим на /sign-in пока идет загрузка, так как это может быть перезагрузка страницы
  // Также проверяем наличие токена - если есть токен, значит пользователь может быть авторизован
  const hasToken = !!window.localStorage.getItem("token");
  const shouldWaitForAuth = isLoading || (hasToken && !user);

  if (shouldWaitForAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (effectiveIsAuth && user) {
    // Пользователь авторизован - проверяем email verification и роль ADMIN
    if (emailVerified) {
      return (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout />
        </ProtectedRoute>
      );
    } else {
      return <Navigate to="/email-verification" />;
    }
  }

  // Пользователь не авторизован - редиректим на sign-in
  // Но только если загрузка завершена и токена нет
  return <Navigate to="/sign-in" />;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Используем централизованный хук для авторизации и tenant
  const { isLoading, isAuth: isAuthFromHook, user, tenant, tenantStatus } = useAuthTenantResolver();
  const isAuth = useAppSelector(checkIsAuth);
  const emailVerified = user?.emailVerified === true;
  const showAppLayout = isAuth && user && emailVerified;

  // Используем isAuth из хука, так как он более актуальный
  const effectiveIsAuth = isAuthFromHook || isAuth;

  // Флаг для предотвращения повторных редиректов
  const hasRedirectedRef = useRef(false);

  // Получаем resolvedOnce из Redux для проверок (tenantStatus уже есть в хуке)
  const { resolvedOnce } = useAppSelector((s) => (s as any).tenant || { resolvedOnce: false });

  // Используем централизованные функции для проверки маршрутов
  // Мемоизируем для предотвращения лишних перерендериваний
  const tenantSlugInPath = useMemo(
    () => extractTenantSlugFromPath(location.pathname),
    [location.pathname]
  );
  const isTenantScopedRoute = tenantSlugInPath !== null;
  const isPublicRoute = useMemo(() => checkIsPublicRoute(location.pathname), [location.pathname]);
  const isAppRouteWithoutTenant = useMemo(
    () => checkIsAppRouteWithoutTenant(location.pathname),
    [location.pathname]
  );

  // Мемоизируем search params для предотвращения лишних перерендериваний
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // 0. КРИТИЧЕСКАЯ ЗАЩИТА: не выполняем никаких редиректов для tenant-scoped маршрутов
  // Этот эффект должен срабатывать ПЕРВЫМ при каждом изменении пути
  // Приоритет: tenant-scoped маршруты > все остальное
  // ВАЖНО: этот эффект должен быть СИНХРОННЫМ (без зависимостей от асинхронных состояний)
  // Выполняется при КАЖДОМ изменении location.pathname СРАЗУ, до всех остальных эффектов
  // ИСПРАВЛЕНИЕ: также сбрасываем флаг при переходе с tenant-scoped на другой маршрут
  useEffect(() => {
    // Проверяем напрямую из location.pathname, без использования мемоизированного значения
    const slugInPath = extractTenantSlugFromPath(location.pathname);
    if (slugInPath) {
      // Сбрасываем флаг редиректа для tenant-scoped маршрутов
      // Это критически важно для предотвращения редиректов при перезагрузке
      hasRedirectedRef.current = false;
    }
  }, [location.pathname]); // Зависим только от pathname, чтобы сработать СРАЗУ при любом изменении пути

  // 1. Редирект: app route без tenant slug → tenant-scoped маршрут или 404
  useEffect(() => {
    // НЕ обрабатываем tenant-scoped маршруты в этом эффекте - они обрабатываются роутером
    if (isTenantScopedRoute) {
      return;
    }

    if (
      isLoading ||
      hasRedirectedRef.current ||
      !effectiveIsAuth ||
      !user ||
      !isAppRouteWithoutTenant
    ) {
      return;
    }

    // Если tenant доступен - редиректим на tenant-scoped маршрут
    if (tenant?.slug) {
      hasRedirectedRef.current = true;
      const currentPath = location.pathname;
      const newPath = `/${tenant.slug}${currentPath}`;
      navigate(newPath, { replace: true });
      return;
    }

    // Проверяем возможность резолвить tenant из URL
    const host = window.location.host.toLowerCase();
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

    // Не используем tenantSlugInPath, так как это уже проверено выше
    const slugFromQuery = searchParams.get("tenant") || searchParams.get("slug");
    const slugFromSubdomain =
      !isLocal && host.includes(".") && host.split(".").length >= 3
        ? host.split(":")[0].split(".")[0]
        : null;

    const canResolveTenantFromUrl = slugFromQuery || slugFromSubdomain;

    // Если нет способа резолвить tenant из URL и резолв завершен - 404
    if (!canResolveTenantFromUrl && (tenantStatus === "idle" || tenantStatus === "failed")) {
      hasRedirectedRef.current = true;
      navigate("/404-not-found", { replace: true });
      return;
    }

    // Если есть способ резолвить, но резолв завершился неудачно - 404
    if (canResolveTenantFromUrl && tenantStatus === "failed") {
      hasRedirectedRef.current = true;
      navigate("/404-not-found", { replace: true });
      return;
    }

    // Если резолв еще в процессе - ждем
    if (canResolveTenantFromUrl && !tenant && tenantStatus !== "failed") {
      const timeoutId = setTimeout(() => {
        if (!tenant && (tenantStatus === "failed" || (tenantStatus === "idle" && resolvedOnce))) {
          hasRedirectedRef.current = true;
          navigate("/404-not-found", { replace: true });
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    effectiveIsAuth,
    user?.id,
    isAppRouteWithoutTenant,
    isTenantScopedRoute,
    tenant?.slug,
    tenantStatus,
    resolvedOnce,
    location.pathname,
    navigate,
    searchParams,
  ]);

  // 2. Редирект: авторизованные пользователи на публичных страницах (кроме HomePage) → HomePage
  // ВАЖНО: Этот эффект НЕ должен срабатывать для tenant-scoped маршрутов
  useEffect(() => {
    // КРИТИЧЕСКИ ВАЖНО: СНАЧАЛА проверяем tenant-scoped маршруты напрямую из pathname
    // Не полагаемся на мемоизированное значение, чтобы быть уверенными
    // Эта проверка должна быть ПЕРВОЙ и выполняться СИНХРОННО
    const slugInPath = extractTenantSlugFromPath(location.pathname);
    if (slugInPath) {
      // Это tenant-scoped маршрут - НИКОГДА не редиректим на HomePage
      // НЕ проверяем tenant?.slug здесь, так как при перезагрузке tenant еще может быть null
      // а slug уже есть в URL, значит это валидный tenant-scoped маршрут
      // Сбрасываем флаг редиректа, чтобы предотвратить любые редиректы
      hasRedirectedRef.current = false;
      return;
    }

    // Для НЕ tenant-scoped маршрутов продолжаем проверки

    // Не редиректим если:
    // - еще загружается авторизация (ждем завершения загрузки)
    // - уже был редирект
    // - пользователь не авторизован (не редиректим неавторизованных на HomePage)
    // - это не публичный маршрут (публичные маршруты обрабатываются здесь)
    if (isLoading || hasRedirectedRef.current || !effectiveIsAuth || !user || !isPublicRoute) {
      return;
    }

    // HomePage доступен всем, не редиректим
    if (location.pathname === "/") {
      return;
    }

    // Редиректим на HomePage только если пользователь действительно на публичной странице
    // И только если это НЕ tenant-scoped маршрут (проверено выше)
    hasRedirectedRef.current = true;
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, effectiveIsAuth, user?.id, isPublicRoute, location.pathname, navigate]);

  // КРИТИЧЕСКАЯ ПРОВЕРКА: Если это tenant-scoped маршрут - НЕ показываем loader
  // и НЕ выполняем никаких редиректов, даже во время загрузки
  // Это позволяет пользователю оставаться на странице при перезагрузке
  const shouldShowLoader = isLoading && !isTenantScopedRoute;

  if (shouldShowLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {import.meta.env.VITE_SHOW_DEV_BANNER === "true" && (
        <div className="bg-yellow-500 text-black p-2 text-center">
          🛠 You are in development environment
        </div>
      )}
      <Routes>
        {/* Публичные страницы */}
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/business-sign-up" element={<BusinessSignUpPage />} />
        <Route path="/create-workspace" element={<CreateWorkspacePage />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<PasswordRecover />} />
        <Route path="/request-reset" element={<RequestPasswordReset />} />
        <Route path="/email-verification" element={<EmailSentMessage />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
        <Route path="/oauth-done" element={<OAuthDone />} />

        {/*Test pages*/}
        <Route path="/test/*">
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<DashboardCopy />} />
        </Route>

        {/* Homepage - выбор workspace */}
        <Route path="/" element={<HomePage />} />

        {/* Tenant-scoped routes: /:tenantSlug/... */}
        <Route path="/:tenantSlug" element={<TenantScopedRouteElement />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="clicks-list" element={<CklicksList />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/account" element={<Account />} />
          <Route path="crop-avatar" element={<CropAvatarWrapper />} />
        </Route>

        {/* Tenant-scoped admin routes: /:tenantSlug/admin/... */}
        <Route path="/:tenantSlug/admin" element={<AdminTenantScopedRouteElement />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/level-settings" element={<LevelSettingsAdmin />} />
          <Route path="settings/level-settings-test" element={<LevelSettingsTest />} />
        </Route>

        {/* Это маршрут для страницы 404 */}
        <Route path="/404-not-found" element={<NotFound />} />

        {/* Редирект на 404 для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/404-not-found" />} />
      </Routes>

      <Toaster position="top-center" />
      {/* <ToastContainer position="bottom-right" /> */}
    </>
  );
}

export default App;
