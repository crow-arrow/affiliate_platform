import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { Routes, Route} from 'react-router-dom'

import { AdminDashboard } from './admin_pages/AdminDashboard.jsx'
import { Users } from './admin_pages/Users.jsx'
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
import { getMe } from './redux/features/auth/authSlice.js'

function App() {

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const role = user?.role

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <>
      {role === 'Admin' ? (
        <AdminLayout>
          <Routes>
            <Route path='admin' element={<AdminDashboard />} />
            <Route path='admin/users' element={<Users />} />
            <Route path='admin/assign-coupon' element={<AssignCoupon />} />
            <Route path='admin/assign-status' element={<AssignStatus />} />
            <Route path='admin/calender' element={<Calender />} />
            <Route path='admin/documents' element={<Documents />} />
            <Route path='admin/settings' element={<Settings />} />
            <Route path='admin/login' element={<LoginPage />} />
            <Route path='admin/signup' element={<SignUpPage />} />
          </Routes>

          <ToastContainer position='bottom-right' />
        </AdminLayout>
      ) : (
        <Layout>
        <Routes>
          <Route path='/my-account' element={<Dashboard />} />
          <Route path='trips' element={<Trips />} />
          <Route path='calender' element={<Calender />} />
          <Route path='documents' element={<Documents />} />
          <Route path='settings' element={<Settings />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignUpPage />} />
        </Routes>

        <ToastContainer position='bottom-right' />
      </Layout>
      )}
    </>
  )
}

export default App;
