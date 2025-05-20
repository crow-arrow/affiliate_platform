import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth, checkRole } from '../redux/features/auth/authSlice'
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded'
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined'
import AirplanemodeActiveOutlinedIcon from '@mui/icons-material/AirplanemodeActiveOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import LastPageIcon from '@mui/icons-material/LastPage';
import LogoGoldXS from '../assets/LogoGoldXS.png'
import {ProfileButton} from './ProfileButton'
import PropTypes from 'prop-types'

export const AdminNavbar = ({ isOpen, setIsOpen }) => {
    const isAuth = useSelector(checkIsAuth)
    const userRole = useSelector(checkRole)

    if (!isAuth || userRole !== 'Admin') {
        return null
    }

    const openNav = () => {
        setIsOpen(!isOpen)
    }

    const navLinks = [
        {
            to: '../admin/dashboard',
            label: 'Dashboard',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Dashboard</div>,
            icon: <RoofingRoundedIcon className='m-1' />,
        },
        {
            to: '../admin/team',
            label: 'Team',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Team</div>,
            icon: <Groups3OutlinedIcon className='m-1' />,
        },
        {
            to: '../admin/orders',
            label: 'Orders',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Orders</div>,
            icon: <AirplanemodeActiveOutlinedIcon className='m-1' />,
        },
        {
            to: '../admin/calendar',
            label: 'Calendar',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Calendar</div>,
            icon: <CalendarTodayOutlinedIcon className='m-1 p-0.5' />,
        },
        {
            to: '../admin/assign-coupon',
            label: 'Assign Coupon',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Assign Coupon</div>,
            icon: <LocalActivityOutlinedIcon className='m-1' />,
        },
        {
            to: '../admin/invoices',
            label: 'Invoices',
            tooltip: <div className='sidebar-tooltip group-hover:scale-100'>Invoices</div>,
            icon: <ReceiptOutlinedIcon className='m-1' />,
        },
    ]

    return (
        <div>
            {isAuth && <div className="flex flex-col flex-grow-1">
                <header className='flex relative group/header w-full h-20 items-center'>
                    <ProfileButton isOpen={!isOpen} />
                    <button type="button" 
                        className="max-md:hidden group/button transition-all duration-500 opacity-0 group-hover/header:opacity-100 z-50 inline-flex items-center justify-end mx-1 text-sm text-gray-500"
                        onClick={openNav}
                    >
                        <LastPageIcon className={`transition-all duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                        <div className='open-button-tooltip pointer-events-none group-hover/button:tooltip-show'>{isOpen ? "Shrink sidebar" : "Expand sidebar"}</div>
                    </button>
                </header>
                <nav>
                    <ul className="flex flex-1 flex-col w-full justify-between pt-4 gap-y-7 min-h-[calc(100vh-112px)]">
                        <li>
                            <ul className="flex flex-col gap-y-2">
                                {navLinks.map(({ to, label, tooltip, icon }) => (
                                    <li key={to} className="flex">
                                        <NavLink 
                                            to={to}
                                            className={({ isActive }) =>
                                                `flex group gap-2 w-full items-center text-lg rounded-lg
                                                hover:bg-white dark:hover:bg-secondary
                                                transition-colors duration-300
                                                ${isActive && 'bg-white dark:bg-secondary'}`
                                            }
                                        >
                                            {({ isActive }) => (
                                            <>
                                                <div
                                                    className={`
                                                        m-2 rounded-md group-hover:bg-primaryLite dark:group-hover:bg-primary 
                                                        transition-colors duration-300 group-hover:text-gray-800 dark:group-hover:text-gray-100
                                                        ${isActive && 'bg-primaryLite dark:bg-primary text-gray-800 dark:text-gray-100'}`}
                                                    >
                                                    {icon}
                                                </div>
                                                <span
                                                    className={`
                                                        inline-block origin-left whitespace-nowrap group-hover:text-gray-800 dark:group-hover:text-gray-100 
                                                        transition-all duration-300 ease-in-out ${isActive && 'text-gray-800 dark:text-gray-100'}
                                                        ${isOpen
                                                        ? 'opacity-100 scale-100 translate-x-0'
                                                        : 'opacity-0 scale-50 -translate-x-12 pointer-events-none'
                                                        }
                                                    `}
                                                >
                                                    {label}
                                                </span>
                                                {!isOpen && tooltip}
                                            </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                                
                            </ul>
                        </li>
                        <li className='justify-self-start'>
                            <img width="100" height="50" src={LogoGoldXS} alt="Logo Jinn" />
                        </li>
                    </ul>
                </nav>
            </div> 
            }
        </div>
    )
}

AdminNavbar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
}