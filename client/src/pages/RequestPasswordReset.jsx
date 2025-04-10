import { useDispatch, useSelector } from 'react-redux'
import { requestPasswordReset, clearErrors } from '../redux/features/password/resetPasswordSlice'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'

export const RequestPasswordReset = () => {

    console.log('Request Password rendered')
    
    const { status, message, requestResetError } = useSelector((state) => state.password)
    const [ email, setEmail ] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status === 'succeeded' && message) {
            toast.success(message)
            navigate('/login')
        } else if (status === 'failed' && requestResetError) {
            toast.error(requestResetError);
            dispatch(clearErrors());
        }
    }, [status, message, requestResetError, dispatch, navigate])
    
    const loading = status === "loading"

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(requestPasswordReset(email));
    };

    return (
        <div className="flex flex-col flex-1 h-screen bg-gradient-primary justify-center px-6 mx-auto lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to={'/login'} tabIndex={-1}>
                    <img alt="Jinn community" src={logo} className="mx-auto h-20 w-auto" />
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-100">Enter your email to reset the password</h2>
            </div>
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                <form 
                    noValidate
                    onSubmit={handleSubmit}
                    method="POST" 
                    className="space-y-6"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
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
                                tabIndex={1}
                                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            tabIndex={2}
                            className="flex w-full justify-center rounded-3xl bg-accent mt-10 px-3 py-1.5 
                                text-sm font-semibold text-gray-100 shadow-sm hover:bg-accentDark 
                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent 
                                disabled:shadow-inset-2 disabled:bg-accentDark active:scale-90 transition-all"
                        >
                            {loading ? "Loading..." : "Reset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
