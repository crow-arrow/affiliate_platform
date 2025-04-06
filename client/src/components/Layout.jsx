import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { Header } from './Header.jsx'

export const Layout = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-primary before:absolute before:inset-0"
      ></div>

      {/* Content */}
      <div className="relative z-10 flex h-full text-gray-200">
        {/* Sticky Navbar */}
        <aside className="w-60 sticky top-0 self-start mx-8 mb-4 box-border text-gray-400">
          <Navbar />
        </aside>

        <div className="flex flex-col flex-1">

          {/* Sticky Header */}
          <header className="sticky h-20 top-0 z-20">
            <Header />
          </header>

          {/* Scrollable Main Section */}
          <main className="flex-1 overflow-auto mx-8 my-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}