import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, logout, clearErrors } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const SignUpPage = () => {

  console.log('SignupPage rendered')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { status, message, errors } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === "succeeded") 
      toast(message)
      dispatch(logout())
  }, [status, message, errors, dispatch, navigate])

  const loading = status === "loading"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    try {
      await dispatch(registerUser({
        email,
        username: email,
        phone,
        first_name: firstName,
        last_name: lastName,
        password,
      })).unwrap()
      setEmail('')
      setPhone('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setConfirmPassword('')

      navigate('/sent-message')
    } catch (errors) {
      if (errors && Array.isArray(errors) && errors.length > 0) {

        toast.error(errors[0].message || "Unknown error");
        dispatch(clearErrors());
      }
    }
  }

  return (
    <div className="flex h-screen bg-gradient-primary flex-1 flex-col justify-center px-6 mx-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Jinn community" src={logo} className="mx-auto h-20 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-100">Join our community!</h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form noValidate onSubmit={handleSubmit} className="space-y-2">
          {[{ label: 'Email', type: 'email', placeholder: 'exemple@jinn-travel.com', value: email, setValue: setEmail },
            { label: 'Phone Number', type: 'phone', placeholder: '+49 (151) 290-175-33', value: phone, setValue: setPhone },
            { label: 'First Name', type: 'text', placeholder: 'Will', value: firstName, setValue: setFirstName },
            { label: 'Last Name', type: 'text', placeholder: 'Smith', value: lastName, setValue: setLastName },
            { label: 'Password', type: 'password', placeholder: '*********', value: password, setValue: setPassword },
            { label: 'Confirm Password', type: 'password', placeholder: '*********', value: confirmPassword, setValue: setConfirmPassword }]
            .map(({ label, type, placeholder, value, setValue }, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-100">{label}</label>
                <div className="mt-2">
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    required
                    tabIndex={1}
                    className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 
                       placeholder:text-gray-400 focus:outline-2 focus:outline-accent sm:text-sm"
                  />
                </div>
              </div>
            ))}
          <div>
            <button 
              type="submit" 
              disabled={loading} 
              tabIndex={2}
              className="flex w-full justify-center rounded-full bg-accent mt-10 px-3 py-1.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-90 transition-all"
            >
              {loading ? "Loading..." : "Sign up"}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-100">
          Already have an account?{' '}
          <Link to='/login' className="font-semibold text-accent hover:text-accentDark transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  )
}
