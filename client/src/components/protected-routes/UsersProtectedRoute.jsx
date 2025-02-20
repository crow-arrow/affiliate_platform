// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth } from '../../redux/features/auth/authSlice'


const UsersProtectedRoute = ({ element, ...rest }) => {
  const { user } = useSelector(state => state.auth)
  const isAuth = useSelector(checkIsAuth)
  

  // Если пользователь не авторизован
  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return <Route {...rest} element={element} />
}

export default UsersProtectedRoute