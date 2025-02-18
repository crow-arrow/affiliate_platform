import React from 'react'
import { AdminNavbar } from './AdminNavbar.jsx'
import { Header } from './Header.jsx'

export const AdminLayout = ({ children }) => {
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
                {children}
            </main>
            </div>
        </div>
        </React.Fragment>
    )
}
