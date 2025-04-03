import { useDispatch, useSelector } from 'react-redux'
import { requestPasswordReset } from '../redux/features/password/resetPasswordSlice'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'

export const RequestPasswordReset = () => {

    const { status, message, error } = useSelector((state) => state.password)
    const [ email, setEmail ] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status === 'succeeded' && message) {
            toast.success(message)
            navigate('/login')
        } else if (status === 'failed' && error)
            toast.error(error)
    }, [status, message, error, navigate])

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(requestPasswordReset(email))
    }

    return (
        <div className="flex h-screen flex-1 flex-col justify-center px-6 mx-auto lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to={'/login'}>
                    <img alt="Jinn community" src={logo} className="mx-auto h-10 w-auto" />
                </Link>
                <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">Type your email to reset your password</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form 
                    noValidate
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
                            onChange={handleEmailChange}
                            required
                            placeholder='exemple@jinn-travel.com'
                            className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                        />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="flex w-full justify-center rounded-3xl bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accentDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-90 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
