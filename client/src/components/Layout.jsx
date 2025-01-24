import React from 'react'
import { Navbar } from './Navbar.jsx'
import { Header } from './Header.jsx'

export const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="w-screen">
        <Header />
        <Navbar />
        {children}
      </div>
    </React.Fragment>
  )
}
