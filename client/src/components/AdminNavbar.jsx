import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth, checkRole } from '../redux/features/auth/authSlice'
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded'
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'

export const AdminNavbar = () => {
    const isAuth = useSelector(checkIsAuth)
    const userRole = useSelector(checkRole)

    if (!isAuth || userRole !== 'Admin') {
        return null
    }

    return (
        <div className="left-0 top-20 flex flex-col flex-grow-1 px-8 min-h-[calc(100vh-150px)]">
            <nav className='flex flex-1'>
                <ul className='flex flex-1 flex-col justify-between gap-y-7 text-gray-200'>
                    <li>
                        <ul className="flex flex-col gap-y-2">
                            <li className='flex'>
                                <NavLink to="../admin/dashboard" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <RoofingRoundedIcon />
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/team" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <Groups3OutlinedIcon />
                                    Team
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/orders" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <Groups3OutlinedIcon />
                                    Orders
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/calender" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <CalendarTodayOutlinedIcon />
                                    Calender
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/assign-coupon" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <LocalActivityOutlinedIcon />
                                    Add Coupon
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/assign-level" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                                    <ReceiptOutlinedIcon />
                                    Invoices
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='flex mt-auto'>
                        <NavLink to="../admin/settings" 
                        className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                            <TuneRoundedIcon />
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
