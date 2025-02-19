import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { Header } from './Header.jsx'

export const Layout = () => {
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen">
        {/* Фиксированный Header */}
        <header className="h-20 w-full">
          <Header />
        </header>

        <div className="flex flex-1">
          {/* Фиксированная боковая панель */}
          <nav className="w-60">
            <Navbar />
          </nav>

          {/* Основной контент */}
          <main className="flex-1 p-4 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </React.Fragment>
  )
}
