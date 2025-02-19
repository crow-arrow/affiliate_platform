import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { Routes, Route } from 'react-router-dom'

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
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getMe, logout } from './redux/features/auth/authSlice.js'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const role = user?.role

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <>
      <Routes>
        {role === 'Admin' ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="assign-coupon" element={<AssignCoupon />} />
            <Route path="assign-status" element={<AssignStatus />} />
            <Route path="calender" element={<Calender />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        ) : (
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
        )}
      </Routes>

      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App;