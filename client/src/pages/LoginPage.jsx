import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, checkIsAuth } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { status, user, errors } = useSelector((state) => state.auth)
  const isAuth = useSelector(checkIsAuth)
  const role = user?.role
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (status) toast(status);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err.message))
    }
    if (isAuth && user) {
      if (role === 'Admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/my-account')
      }
    }
  }, [status, errors, isAuth, user, navigate])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      await dispatch(loginUser({
        email,
        password,
      }))

    } catch (error) {
      toast.error('Error during login:', error.response?.data || error.message)
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 mx-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Jinn comunity"
          src={logo}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form 
          noValidate
          onSubmit={handleSubmit}
          method="POST" 
          className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-accent hover:text-accentDark">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full justify-center rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?{' '}
          <Link to='/signup' className="font-semibold text-accent hover:text-accentDark">
            SignUp now
          </Link>
        </p>
      </div>
    </div>
  )
}
