// src/layouts/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const linkBase =
    'block px-3 py-2 rounded text-gray-200 hover:text-white hover:bg-white/10';
  const linkActive =
    'block px-3 py-2 rounded bg-white/15 text-white font-semibold';

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold">Panel Admin</h2>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            Usuarios
          </NavLink>

          {/* 👇 Renombrado: Gestión de Productos (antes “Gestión de Stock”) */}
          <NavLink
            to="/admin/stock"
            className={({ isActive }) => (isActive ? linkActive : linkBase)}
          >
            Gestión de Productos
          </NavLink>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}