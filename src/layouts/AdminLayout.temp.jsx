// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiStoreLine, RiMenuLine, RiCloseLine, RiLogoutBoxLine } from 'react-icons/ri';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const linkBase =
    'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200';
  const linkActive =
    'flex items-center gap-3 px-4 py-3 rounded-lg bg-white/15 text-white font-semibold shadow-sm';

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
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
        w-72 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        shadow-xl md:shadow-none
      `}>
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <img src="/IPASA LOGO.jpeg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          <h2 className="text-xl font-bold">Panel Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            <RiDashboardLine size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            <RiUserLine size={20} />
            Usuarios
          </NavLink>

          <NavLink
            to="/admin/stock"
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            <RiStoreLine size={20} />
            Gestión de Productos
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RiLogoutBoxLine size={20} />
            Cerrar Sesión
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
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}