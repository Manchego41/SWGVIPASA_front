// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiStoreLine, RiMenuLine, RiCloseLine, RiLogoutBoxLine } from 'react-icons/ri';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const linkBase =
    'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 transition-all duration-200 hover:bg-sky-600 hover:text-white focus:bg-sky-700 focus:text-white';
  const linkActive =
    'flex items-center gap-3 px-4 py-3 rounded-lg bg-sky-700 text-white font-semibold shadow-sm relative';

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
  <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Toggle Button - Visible solo en móvil */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
      >
        {isSidebarOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
      </button>

      {/* Sidebar con transición suave */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 flex flex-col
        bg-gradient-to-b from-sky-900 via-slate-900 to-slate-800 text-white
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        shadow-2xl md:shadow-none border-r border-slate-800
        h-screen max-h-screen
      `}>
        <div className="px-8 pt-8 pb-6 flex flex-col items-center gap-2 border-b border-slate-800">
          <img src="/descarga-removebg-preview.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105" />
          <h2 className="text-2xl font-extrabold tracking-wide text-sky-300 drop-shadow mb-1 ">  Camila da miedo</h2>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${isActive ? linkActive : linkBase} group`
            }
          >
            {/* Franja de color para el activo */}
            <RiDashboardLine size={22} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium tracking-wide">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${isActive ? linkActive : linkBase} group`
            }
          >
            {({ isActive }) => isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-sky-400 shadow-md" />
            )}
            <RiUserLine size={22} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium tracking-wide">Usuarios</span>
          </NavLink>

          <NavLink
            to="/admin/stock"
            className={({ isActive }) =>
              `${isActive ? linkActive : linkBase} group`
            }
          >
            {({ isActive }) => isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-sky-400 shadow-md" />
            )}
            <RiStoreLine size={22} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium tracking-wide">Gestión de Productos</span>
          </NavLink>
        </nav>

        <div className="px-6 pb-6 pt-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-base font-semibold"
          >
            <RiLogoutBoxLine size={22} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar el sidebar en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto h-screen max-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}