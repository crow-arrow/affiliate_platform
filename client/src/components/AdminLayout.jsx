import { Outlet } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar.jsx";
import { Header } from "./Header.jsx";
import { useState, useEffect } from "react";

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    // Функция для обработки изменения ширины экрана
    const handleResize = () => {
      if (mediaQuery.matches) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Добавляем слушатель на изменение размера экрана
    mediaQuery.addEventListener("change", handleResize);

    // Вызываем обработку сразу при монтировании компонента
    handleResize();

    // Очистка при размонтировании компонента
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden px-4 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-primaryLite dark:bg-primary before:absolute before:inset-0 transition-colors duration-500"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full text-gray-800 dark:text-gray-200">
        {/* Sticky Navbar */}
        <aside
          className={`sticky top-0 z-20 self-start mr-8 mb-4 box-border text-gray-500 transition-[width] duration-300 ${
            isOpen ? "w-64" : "w-12"
          }`}
        >
          <AdminNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
        </aside>
        <div className="flex flex-col flex-1 transition-[width] duration-300">
          {/* Sticky Header */}
          <header className="sticky h-20 top-0 z-20">
            <Header />
          </header>
          {/* Scrollable Main Section */}
          <main className="flex-1 w-full overflow-auto my-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
