import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AdminDashboard } from './admin_pages/AdminDashboard.jsx'
import { Team } from './admin_pages/Team.jsx'
import { AssignCoupon } from './admin_pages/AssignCoupon.jsx'
import { AssignLevel } from './admin_pages/AssignLevel.jsx'
import { Invoices } from './admin_pages/Invoices.jsx'
import { AllOrders } from './admin_pages/AllOrders.jsx'

import { Dashboard } from './pages/Dashboard'
import { Trips } from './pages/Trips.jsx'
import { Calendar } from './pages/Calendar.jsx'
import { Documents } from './pages/Documents.jsx'
import { Settings } from './pages/Settings.jsx'

import { EmailVerification } from './components/verification/EmailVerification.jsx'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { NotFound } from './pages/NotFound.jsx'
import AdminProtectedRoute from './components/protected-routes/AdminProtectedRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getMe, checkIsAuth } from './redux/features/auth/authSlice.js'
import { Profile } from './pages/Profile.jsx'

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(checkIsAuth)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getMe()).finally(() => setIsLoaded(true))
  }, [dispatch])

  if (!isLoaded) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <Routes>
        {/* Публичные страницы */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        <Route path="/" element={isAuth ? (<AdminProtectedRoute allowedRoles={['Admin', 'Genie']}>
          <Layout />
        </AdminProtectedRoute>
        ) : <Navigate to='/login' /> }>
          <Route index element={<Dashboard />} />
          <Route path="my-account" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Используем защищенные маршруты для админов */}
        <Route path="/admin/*" element={<AdminProtectedRoute allowedRoles={['Admin']}>
          <AdminLayout />
        </AdminProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="assign-coupon" element={<AssignCoupon />} />
          <Route path="assign-level" element={<AssignLevel />} />
          <Route path="calender" element={<Calendar />} />
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
  )
}

export default App