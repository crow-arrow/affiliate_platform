import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar.jsx'
import { Header } from './Header.jsx'

export const AdminLayout = () => {
    return (
        <React.Fragment>
            <div className="flex flex-col min-h-screen bg-background">
                <header>
                    <Header />
                </header>

                <div className="flex flex-1">
                    <nav className="w-60">
                        <AdminNavbar />
                    </nav>
                    <main className="flex-1 h-[75vh] p-4 m-8 overflow-auto bg-white rounded-2xl">
                        <Outlet />
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}