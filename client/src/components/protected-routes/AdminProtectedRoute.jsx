import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth } from '../../redux/features/auth/authSlice'

const AdminProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector(state => state.auth)
  const isAuth = useSelector(checkIsAuth)

  if (!isAuth || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/404-not-found" />
  }

  return children
}

export default AdminProtectedRoute