import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar.jsx'
import { Header } from './Header.jsx'

export const AdminLayout = () => {
    return (
        <React.Fragment>
            <div className="flex flex-col min-h-screen">
                <header className="h-20 w-full">
                    <Header />
                </header>

                <div className="flex flex-1">
                    <nav className="w-60">
                        <AdminNavbar />
                    </nav>
                    <main className="flex-1 p-4 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}