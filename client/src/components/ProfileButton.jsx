import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, checkRole, logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import avatarLogo from '../assets/avatar.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SafetyDividerOutlinedIcon from '@mui/icons-material/SafetyDividerOutlined'
import {API_URL} from "../config"
import PropTypes from 'prop-types'

export const ProfileButton = ({ isOpen }) => {
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
        <div className='w-full'>
            {isAuth && <div ref={dropdownRef} className="relative w-full">
                <button
                    className="flex p-2 gap-4 group w-52 rounded-3xl justify-start items-center"
                    onClick={toggleDropdown}
                >
                    <img 
                        src={avatar} 
                        alt="Avatar"
                        className="size-8 rounded-full shadow-inset-2 shrink-0"
                    />
                    <div
                        className={`flex items-start transition-all duration-300 ease-in-out transform origin-left ${
                        !isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-12 pointer-events-none'
                        }`}
                    >
                        <div className="text-start">
                            <span className="text-xm block">
                                Hi, {firstName}
                            </span>
                            <span className="text-xs block text-stone-500">
                                {userRole}
                            </span>
                        </div>
                        <div
                            className={`transition-transform ${dropdownOpen ? '-rotate-180' : ''}`}
                        >
                            <ExpandMoreIcon />
                        </div>
                    </div>
                </button>

                {dropdownOpen && (
                    <div className='w-full'>
                        <ul className="absolute max-md:w-screen max-md:-left-4 w-56 overflow-hidden whitespace-nowrap z-10 left-0 top-14 
                                rounded-lg shadow-custom dark:shadow-custom-white dark:bg-primary/30 backdrop-blur-sm text-gray-300"
                        >
                            <li className="w-full bg-opacity-0 bg-white dark:bg-secondary/0 text-gray-500 dark:text-gray-400
                                hover:text-gray-800 dark:hover:text-gray-100 hover:bg-opacity-100 dark:hover:bg-secondary transition-all duration-300"
                            >
                                <Link
                                    to="../settings"
                                    className="flex w-full py-2 pl-4 gap-2 text-left"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <SettingsOutlinedIcon />
                                    Settings
                                </Link>
                            </li>
                            {!isAdminPage && userRole === 'Admin' && (
                            <li className="w-full bg-opacity-0 bg-white dark:bg-secondary/0 text-gray-500 dark:text-gray-400
                                hover:text-gray-800 dark:hover:text-gray-100 hover:bg-opacity-100 dark:hover:bg-secondary transition-all duration-300"
                            >
                                <Link
                                    to="../admin/dashboard"
                                    className="flex w-full py-2 pl-4 gap-2 text-left"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <AdminPanelSettingsOutlinedIcon />
                                    Admin Panel
                                </Link>
                            </li>
                            )}
                            {isAdminPage && userRole === 'Admin' && (
                            <li className="w-full bg-opacity-0 bg-white dark:bg-secondary/0 text-gray-500 dark:text-gray-400
                                hover:text-gray-800 dark:hover:text-gray-100 hover:bg-opacity-100 dark:hover:bg-secondary transition-all duration-300"
                            >
                                <Link
                                    to="../my-account"
                                    className="flex w-full py-2 pl-4 gap-2 text-left"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <SafetyDividerOutlinedIcon />
                                    Genie Panel
                                </Link>
                            </li>
                            )}
                            <li className="w-full bg-opacity-0 bg-white dark:bg-secondary/0 text-gray-500 dark:text-gray-400
                                hover:text-gray-800 dark:hover:text-gray-100 hover:bg-opacity-100 dark:hover:bg-secondary transition-all duration-300"
                            >
                                <button
                                    onClick={logoutHandler}
                                    className="flex w-full py-2 pl-4 gap-2 text-left"
                                >
                                    <PowerSettingsNewOutlinedIcon />
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

ProfileButton.propTypes = {
isOpen: PropTypes.bool.isRequired,
};