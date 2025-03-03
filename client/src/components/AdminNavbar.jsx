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
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

export const AdminNavbar = () => {
    const isAuth = useSelector(checkIsAuth)
    const userRole = useSelector(checkRole)
    const first_name = useSelector((state) => state.auth.user?.first_name)

    if (!isAuth || userRole !== 'Admin') {
        return null
    }

    return (
        <div className="left-0 top-20 flex flex-col flex-grow-1 w-60 px-8 pb-4 min-h-[calc(100vh-80px)]">
            <button
                className="flex w-full px-2 py-2 my-2 rounded-md justify-between items-center"
            >
                <img 
                    src="https://api.dicebear.com/9.x/notionists/svg" 
                    alt="Avatar"
                    className="size-8 rounded shrink-0 shadow"
                />
                <div className="text-start">
                    <span className="text-m block text-stone-500">
                        {userRole}
                    </span>
                    <span className="text-xs text-black block">
                        Hi, {first_name}
                    </span>
                </div>
                <UnfoldMoreOutlinedIcon />
            </button>
            <nav className='flex flex-1'>
                
                <ul className='flex flex-1 flex-col justify-between gap-y-7'>
                    <li>
                        <ul className="flex flex-col gap-y-2">
                            <li className='flex'>
                                <NavLink to="../admin/dashboard" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <RoofingRoundedIcon />
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/team" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <Groups3OutlinedIcon />
                                    Team
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/orders" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <Groups3OutlinedIcon />
                                    Orders
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/calender" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <CalendarTodayOutlinedIcon />
                                    Calender
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/assign-coupon" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <LocalActivityOutlinedIcon />
                                    Add Coupon
                                </NavLink>
                            </li>
                            <li className='flex'>
                                <NavLink to="../admin/assign-level" 
                                className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                                    <ReceiptOutlinedIcon />
                                    Invoices
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='flex mt-auto'>
                        <NavLink to="../admin/settings" 
                        className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-md hover:bg-white hover:text-accent transition-colors ${isActive && 'bg-white text-accent'}`}>
                            <TuneRoundedIcon />
                            Settings
                        </NavLink>
                    </li>
                </ul>

            </nav>
        </div>
    )
}
