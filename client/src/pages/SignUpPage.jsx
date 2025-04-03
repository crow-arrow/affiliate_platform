import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, getMe, checkIsAuth } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { status, user, errors } = useSelector((state) => state.auth)
  const isAuth = useSelector(checkIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (status) toast(status)
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err.message));
    }
    if (isAuth && user?.role) navigate('/verify-email/:token')
  }, [status, errors, isAuth, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    try {
      const resultAction = await dispatch(registerUser({
        email,
        username: email,
        phone,
        first_name: firstName,
        last_name: lastName,
        password,
      }))

      if (registerUser.fulfilled.match(resultAction)) {
        await dispatch(getMe())
        setEmail('')
        setPhone('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message)
      toast.error("Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 mx-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Jinn community" src={logo} className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">Join our community!</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {[{ label: 'Email', type: 'email', placeholder: 'exemple@jinn-travel.com', value: email, setValue: setEmail },
            { label: 'Phone Number', type: 'phone', placeholder: '+49 (151) 290-175-33', value: phone, setValue: setPhone },
            { label: 'First Name', type: 'text', placeholder: 'Will', value: firstName, setValue: setFirstName },
            { label: 'Last Name', type: 'text', placeholder: 'Smith', value: lastName, setValue: setLastName },
            { label: 'Password', type: 'password', placeholder: '*********', value: password, setValue: setPassword },
            { label: 'Confirm Password', type: 'password', placeholder: '*********', value: confirmPassword, setValue: setConfirmPassword }]
            .map(({ label, type, placeholder, value, setValue }, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-900">{label}</label>
                <div className="mt-2">
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    required
                    className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-accent sm:text-sm"
                  />
                </div>
              </div>
            ))}
          <div>
            <button type="submit" disabled={status === "loading"} className="w-full rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark active:scale-90 transition-all">
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to='/login' className="font-semibold text-accent hover:text-accentDark transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  )
}
