import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, checkRole, logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import avatarLogo from '../assets/avatar.png'
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined'
import {API_URL} from "../config"

export const ProfileButton = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null)

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return() => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[])

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = useSelector(checkIsAuth)
    const userRole = useSelector(checkRole)
    const firstName = useSelector((state) => state.auth.user?.first_name)
    const currentUser = useSelector((state) => state.auth.user)
    const avatar = currentUser.avatarUrl ? `${API_URL}${currentUser.avatarUrl}` : avatarLogo
    const isAdminPage = location.pathname.startsWith("/admin");

    const logoutHandler = async () => {
        
        dispatch(logout())
        window.localStorage.removeItem('token')
        toast('You are out');
        
        await new Promise(resolve => setTimeout(resolve, 0))
        navigate('/login');
    }

    return (
        <div>
            {isAuth && <div className="relative" ref={dropdownRef}>
                <button
                    className="flex min-w-40 gap-4 rounded-3xl justify-between items-center"
                    onClick={toggleDropdown}
                >
                    <img 
                        src={avatar} 
                        alt="Avatar"
                        className="size-8 rounded-full shadow-inset-2 shrink-0"
                    />
                    <div className="text-start">
                        <span className="text-xm block">
                            Hi, {firstName}
                        </span>
                        <span className="text-xs block text-stone-500">
                            {userRole}
                        </span>
                    </div>
                    <UnfoldMoreOutlinedIcon />
                </button>

                {dropdownOpen && (
                    <div>
                        <ul className="absolute w-auto overflow-hidden whitespace-nowrap z-10 left-0 top-12 
                                rounded-xl shadow-custom-white bg-gradient-blur backdrop-blur-sm"
                        >
                            <li className="w-full px-4 py-2
                                hover:text-accentBlue hover:bg-gradient-blur hover:backdrop-blur-sm transition-colors"
                            >
                                <Link
                                    to="../settings"
                                    className="flex w-full px-8 text-left"
                                >
                                    Settings
                                </Link>
                            </li>
                            {!isAdminPage && userRole === 'Admin' && (
                            <li className="
                                w-full px-4 py-2
                                hover:text-accentBlue hover:bg-gradient-blur hover:backdrop-blur-sm transition-colors"
                            >
                                <Link
                                    to="../admin/dashboard"
                                    className="flex w-full px-8 text-left"
                                >
                                    Admin Panel
                                </Link>
                            </li>
                            )}
                            {isAdminPage && userRole === 'Admin' && (
                            <li className="w-full px-4 py-2
                                hover:text-accentBlue hover:bg-gradient-blur hover:backdrop-blur-sm transition-colors"
                            >
                                <Link
                                    to="../my-account"
                                    className="flex w-full px-8 text-left"
                                >
                                    Genie Panel
                                </Link>
                            </li>
                            )}
                            <li className="w-full px-4 py-2
                                hover:text-accentBlue hover:bg-gradient-blur hover:backdrop-blur-sm transition-colors"
                            >
                                <button
                                    onClick={logoutHandler}
                                    className="flex w-full px-8 text-left"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            }
        </div>
    )
}