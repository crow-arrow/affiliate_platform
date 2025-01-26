import { Layout } from './components/Layout'
import { Routes, Route} from 'react-router-dom'

import { Dashboard } from './pages/Dashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getMe } from './redux/features/auth/authSlice.js'

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <Layout>
      <Routes>
        <Route path='/my-account' element={<Dashboard />} />
        <Route path='my-admin' element={<AdminDashboard />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='signup' element={<SignUpPage />} />
      </Routes>

      <ToastContainer position='bottom-right' />
    </Layout>
  );
}

export default App;
