// import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth, checkRole } from '../redux/features/auth/authSlice'
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded'
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import LogoGoldXS from '../assets/LogoGoldXS.png'
import {ProfileButton} from './ProfileButton'

export const AdminNavbar = () => {
    const isAuth = useSelector(checkIsAuth)
    const userRole = useSelector(checkRole)

    if (!isAuth || userRole !== 'Admin') {
        return null
    }

    return (
        <div>
            {isAuth && <div className="flex flex-col flex-grow-1">
                <header className='flex h-20 items-center'>
                    <ProfileButton />
                </header>
                <ul className="flex flex-1 flex-col w-full justify-between pt-4 gap-y-7 min-h-[calc(100vh-112px)]">
                    <li>
                    <ul className="flex flex-col gap-y-2">
                        <li className="flex">
                        <NavLink to="../admin/dashboard" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <RoofingRoundedIcon />
                            Dashboard
                        </NavLink>
                        </li>
                        <li className="flex">
                        <NavLink to="../admin/team" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <Groups3OutlinedIcon />
                            Team
                        </NavLink>
                        </li>
                        <li className="flex">
                        <NavLink to="../admin/orders" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <CalendarTodayOutlinedIcon />
                            Orders
                        </NavLink>
                        </li>
                        <li className="flex">
                        <NavLink to="../admin/calendar" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <CalendarTodayOutlinedIcon />
                            Calender
                        </NavLink>
                        </li>
                        <li className="flex">
                        <NavLink to="../admin/assign-coupon" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <LocalActivityOutlinedIcon />
                            Assign Coupon
                        </NavLink>
                        </li>
                        <li className="flex">
                        <NavLink to="../admin/invoices" 
                            className={({ isActive }) => `group flex px-4 py-2 gap-2 w-full items-center text-lg rounded-lg hover:bg-gradient-blur hover:backdrop-blur-sm hover:text-accentAqua transition-colors ${isActive && 'bg-gradient-blur backdrop-blur-sm text-accentAqua'}`}>
                            <ReceiptOutlinedIcon />
                            Invoices
                        </NavLink>
                        </li>
                    </ul>
                    </li>
                    <li className='justify-self-start'>
                    <img width="100" height="50" src={LogoGoldXS} alt="Logo Jinn" />
                    </li>
                </ul>
            </div> 
            }
        </div>
    )
}
