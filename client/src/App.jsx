import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { Routes, Route, Navigate } from "react-router-dom";

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
import { NotFound } from "./pages/NotFound.jsx";
import AdminProtectedRoute from "./components/protected-routes/AdminProtectedRoute";
import { OAuthCallback } from "./components/verification/OAuthCallback.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { checkIsAuth } from "./redux/features/auth/authSlice.js";
import { CropAvatar } from "./components/Avatar.jsx";

function App() {
  const isAuth = useSelector(checkIsAuth);
  const { user } = useSelector((state) => state.auth);
  const emailVerified = user?.emailVerified === true;
  const showAppLayout = isAuth && user && emailVerified;

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
        <Route path="/auth/callback" element={<OAuthCallback />} />

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

      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
