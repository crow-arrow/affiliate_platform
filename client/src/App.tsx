import { Layout } from "./components/Layout";
import { TestLayout } from "./components/layout-test";
import { AdminLayout } from "./components/AdminLayout";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { useLocation } from "react-router-dom";
import { checkIsAuth, getMe } from "./redux/features/auth/authSlice";

import { AdminDashboard } from "./admin_pages/AdminDashboard";
import { Team } from "./admin_pages/Team";
import { Calendar } from "./pages/Calendar";
import { Invoices } from "./admin_pages/Invoices";
import { AllOrders } from "./admin_pages/AllOrders";

import { Dashboard } from "./pages/Dashboard";
import { DashboardCopy } from "./pages/DashboardCopy";
import { Trips } from "./pages/Trips";
import { CklicksList } from "./pages/CklicksList";
import { Documents } from "./pages/Documents";
import { Settings } from "./pages/Settings";
import { Account } from "./pages/Account";

import { EmailVerification } from "./components/verification/EmailVerification";
import { PasswordRecover } from "./pages/PasswordRecover";
import { RequestPasswordReset } from "./pages/RequestPasswordReset";
import { EmailSentMessage } from "./pages/EmailSentMessage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { NotFound } from "./pages/NotFound";
import AdminProtectedRoute from "./components/protected-routes/AdminProtectedRoute";
import { SSOCallback } from "./components/verification/SSOCallback";
import { OAuthDone } from "./components/verification/OAuthDone";

import { Toaster } from "@/components/ui/sonner";
import { CropAvatar } from "./components/Avatar";

// Обертка для CropAvatar с дефолтными пропсами
const CropAvatarWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <CropAvatar isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAppSelector(checkIsAuth);
  const { user } = useAppSelector((state) => state.auth);
  const emailVerified = user?.emailVerified === true;
  const showAppLayout = isAuth && user && emailVerified;
  const [isLoaded, setIsLoaded] = useState(false);

  // Роуты где НЕ нужно проверять авторизацию
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/reset-password",
    "/request-reset",
    "/email-verification",
    "/sso-callback",
    "/oauth-done",
    "/404-not-found",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    // Если пользователь уже авторизован и заходит на публичные страницы, редиректим на главную
    if (isAuth && user && isPublicRoute && isLoaded) {
      navigate("/", { replace: true });
      return;
    }

    if (!isAuth && !isPublicRoute && isLoaded) {
      navigate("/sign-in", { replace: true });
    }

    if (isPublicRoute) {
      setIsLoaded(true);
      return;
    }

    const token = window.localStorage.getItem("token");

    if (token) {
      dispatch(getMe())
        .unwrap()
        .catch((error: any) => {
          console.error("Failed to fetch user:", error);
          // Токен невалиден - очищаем
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refreshToken");
        })
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [dispatch, isPublicRoute, isAuth, user?.id]);

  if (!isLoaded && !isPublicRoute) {
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
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/reset-password/:token" element={<PasswordRecover />} />
        <Route path="/request-reset" element={<RequestPasswordReset />} />
        <Route path="/email-verification" element={<EmailSentMessage />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
        <Route path="/oauth-done" element={<OAuthDone />} />

        {/*Test pages*/}
        <Route path="/test/*">
          <Route index element={<Dashboard />} />
          <Route path="my-account" element={<DashboardCopy />} />
        </Route>

        <Route
          path="/"
          element={
            showAppLayout ? (
              emailVerified ? (
                <AdminProtectedRoute allowedRoles={["ADMIN", "GENIE"]}>
                  <TestLayout />
                </AdminProtectedRoute>
              ) : (
                <Navigate to="/email-verification" />
              )
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="my-account" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="clicks-list" element={<CklicksList />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/account" element={<Account />} />
          <Route path="crop-avatar" element={<CropAvatarWrapper />} />
        </Route>

        {/* Используем защищенные маршруты для админов */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<Settings />} />
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
