import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, getMe, checkIsAuth } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const SignUpPage = () => {

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { status, user } = useSelector((state) => state.auth)
  const isAuth = useSelector(checkIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (status) {
      toast(status)
    }
    if (isAuth && user?.role) {
      navigate('/my-account')
    }
  }, [status, isAuth, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      await dispatch(registerUser({
        email,
        username: email,
        phone,
        first_name,
        last_name,
        password,
      }))
      await dispatch(getMe())
      setEmail('')
      setPhone('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message)
      alert("Registration failed. Please try again.")
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
          Join our community!
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form 
          onSubmit={handleSubmit}
          method="POST" 
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="phone"
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
              First Name
            </label>
            <div className="mt-2">
              <input
                id="first-name"
                name="first-name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="last-name"
                name="last-name"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
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
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full rounded-3xl bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full justify-center rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{' '}
          <Link to='/login' className="font-semibold text-accent hover:text-accentDark">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
