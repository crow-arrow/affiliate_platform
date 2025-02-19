import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIsAuth, checkRole } from '../redux/features/auth/authSlice'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Icon, Box, IconButton } from '@mui/material'

export const Sidebar = () => {
  return (
    <div>Sidebar</div>
  )
}
