import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const Header = () => {

    const isAuth = useSelector(checkIsAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('token')
        toast('You are out')
        navigate('/login')
    }

    return (
        <div>
            {isAuth && <div className="fixed right-0 top-0 inline-flex w-full pl-60 h-20 justify-between bg-white">
                <header className="flex w-full border-b justify-between items-center py-4 px-4 gap-x-8">
                <label className="relative block w-full">
                    <span className="sr-only">Search</span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="7" stroke="#33363F" strokeWidth="2"/>
                    <path d="M20 20L17 17" stroke="#33363F" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    </span>
                    <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm" placeholder="Search for anything..." type="text" name="search"/>
                </label>
                <div className="flex items-center justify-between gap-x-4">
                    <span className="inset-y-0 left-0 flex items-center pl-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 9.34142C8.5 8.23327 7.02611 7.93954 6.63508 8.97641C5.6892 11.4845 5 13.7283 5 14.9413C5 18.8073 8.13401 21.9413 12 21.9413C15.866 21.9413 19 18.8073 19 14.9413C19 13.638 18.2045 11.1451 17.1498 8.41279C15.7836 4.87332 15.1005 3.10358 14.2573 3.00826C13.9874 2.97776 13.6931 3.0326 13.4523 3.15822C12.7 3.55079 12.7 5.481 12.7 9.34142C12.7 10.5012 11.7598 11.4414 10.6 11.4414C9.4402 11.4414 8.5 10.5012 8.5 9.34142Z" stroke="#7E869E" strokeOpacity="0.25"/>
                    <path d="M5 15C5 18.866 8.13401 22 12 22C15.866 22 19 18.866 19 15" stroke="#222222" strokeLinecap="round"/>
                    </svg>
                    </span>
                    <span className='text-3xl text-gray-400'>￨</span>
                    <button 
                        onClick={logoutHandler} 
                        className="
                            px-4 py-2 rounded-md text-white bg-accent 
                            hover:bg-accentDark hover:text-white"
                        >
                        Logout
                    </button>
                </div>
                </header>
            </div>
            }
        </div>
    )
}