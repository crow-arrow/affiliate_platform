import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { checkIsAuth, getMe } from "./redux/features/auth/authSlice";

import { AdminDashboard } from "./admin_pages/AdminDashboard.jsx";
import { Team } from "./admin_pages/Team.jsx";
import { Calendar } from "./pages/Calendar.jsx";
import { Invoices } from "./admin_pages/Invoices.jsx";
import { AllOrders } from "./admin_pages/AllOrders.jsx";

import { Dashboard } from "./pages/Dashboard";
import { Trips } from "./pages/Trips.jsx";
import { CklicksList } from "./pages/CklicksList.jsx";
import { Documents } from "./pages/Documents.jsx";
import { Settings } from "./pages/Settings.jsx";

import { EmailVerification } from "./components/verification/EmailVerification.jsx";
import { PasswordRecover } from "./pages/PasswordRecover.jsx";
import { RequestPasswordReset } from "./pages/RequestPasswordReset.jsx";
import { EmailSentMessage } from "./pages/EmailSentMessage.jsx";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { NotFound } from "./pages/NotFound";
import AdminProtectedRoute from "./components/protected-routes/AdminProtectedRoute";
import { SSOCallback } from "./components/verification/SSOCallback";
import { OAuthDone } from "./components/verification/OAuthDone";
import { SignIn } from "@clerk/clerk-react";

import { Toaster } from "@/components/ui/sonner";
import { CropAvatar } from "./components/Avatar.jsx";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector(checkIsAuth);
  const { user } = useSelector((state) => state.auth);
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
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          // Токен невалиден - очищаем
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refreshToken");
        })
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [dispatch, isPublicRoute]);

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
        <Route
          path="/sign-in"
          element={<SignIn routing="path" path="/sign-in" />}
        />

        <Route
          path="/"
          element={
            showAppLayout ? (
              <AdminProtectedRoute allowedRoles={["Admin", "Genie"]}>
                <Layout />
              </AdminProtectedRoute>
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
          <Route path="crop-avatar" element={<CropAvatar />} />
        </Route>

        {/* Используем защищенные маршруты для админов */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute allowedRoles={["Admin"]}>
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
