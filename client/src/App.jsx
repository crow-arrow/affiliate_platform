import { Layout } from './components/Layout'
import { Routes, Route} from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='my-account' element={<Dashboard />} />
        <Route path='my-admin' element={<AdminDashboard />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='signup' element={<SignUpPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
