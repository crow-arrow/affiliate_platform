import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar.jsx';
import { Header } from './Header.jsx';
import Uzbekistan from "../assets/uzbekistan-0017.jpg"

export const AdminLayout = () => {
    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Затемнение через псевдоэлемент */}
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-black before:opacity-70" 
                style={{ backgroundImage: `url(${Uzbekistan})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            </div>

            {/* Контент */}
            <div className="relative z-10">
                <header>
                    <Header />
                </header>

                <div className="flex flex-1 mx-8">
                    <nav className="w-1/5 mt-8 mr-8">
                        <AdminNavbar />
                    </nav>
                    <main className="flex-1 h-[75vh] p-4 my-8 overflow-auto text-white bg-white/30 backdrop-blur-sm rounded-2xl">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};