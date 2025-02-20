import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AdminDashboard } from './admin_pages/AdminDashboard.jsx'
import { Team } from './admin_pages/Team.jsx'
import { AssignCoupon } from './admin_pages/AssignCoupon.jsx'
import { AssignStatus } from './admin_pages/AssignStatus.jsx'

import { Dashboard } from './pages/Dashboard'
import { Trips } from './pages/Trips.jsx'
import { Calender } from './pages/Calender.jsx'
import { Documents } from './pages/Documents.jsx'
import { Settings } from './pages/Settings.jsx'

import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { NotFound } from './pages/NotFound.jsx'
import AdminProtectedRoute from './components/protected-routes/AdminProtectedRoute'
import UsersProtectedRoute from './components/protected-routes/UsersProtectedRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getMe } from './redux/features/auth/authSlice.js'

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const role = user?.role

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
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="my-account" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="calender" element={<Calender />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* Используем защищенные маршруты для админов */}
        <Route path="/admin/*" element={<AdminProtectedRoute allowedRoles={['Admin']}>
          <AdminLayout />
        </AdminProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="assign-coupon" element={<AssignCoupon />} />
          <Route path="assign-status" element={<AssignStatus />} />
          <Route path="calender" element={<Calender />} />
          <Route path="documents" element={<Documents />} />
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