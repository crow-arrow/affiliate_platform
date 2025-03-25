import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth, checkRole } from '../redux/features/auth/authSlice'
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded'
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import LogoGoldXS from '../assets/LogoGoldXS.png'

export const Navbar = () => {

  const isAuth = useSelector(checkIsAuth)

  return (
    <div>
    {isAuth && <div className="left-0 top-20 flex flex-col flex-grow-1 px-8 min-h-[calc(100vh-150px)]">
      <nav className="flex flex-1">
        <ul className="flex flex-1 flex-col justify-between gap-y-7 text-gray-200">
          <li>
            <ul className="flex flex-col gap-y-2">
              <li className="flex">
                <NavLink to="../my-account" 
                  className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-3xl hover:bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] hover:backdrop-blur-sm hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                    <RoofingRoundedIcon />
                    Dashboard
                </NavLink>
              </li>
              <li className="flex">
                <NavLink to="../trips" 
                  className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-3xl hover:bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] hover:backdrop-blur-sm hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                    <LuggageOutlinedIcon />
                    Trips
                </NavLink>
              </li>
              <li className="flex">
                <NavLink to="../calendar" 
                  className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-3xl hover:bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] hover:backdrop-blur-sm hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                    <CalendarTodayOutlinedIcon />
                    Calender
                </NavLink>
              </li>
              <li className="flex">
                <NavLink to="../documents" 
                  className={({ isActive }) => `group flex p-2 gap-2 w-full text-s rounded-3xl hover:bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] hover:backdrop-blur-sm hover:text-accent transition-colors ${isActive && 'bg-[linear-gradient(rgba(255,255,255,0.3),transparent)] backdrop-blur-sm text-accent'}`}>
                    <InsertDriveFileOutlinedIcon />
                    Documents
                </NavLink>
              </li>
            </ul>
          </li>
          <li className='px-6'>
            <img width="100" height="50" src={LogoGoldXS} alt="Logo Jinn" />
          </li>
        </ul>

      </nav>
    </div> 
    }
    </div>
  )
}
