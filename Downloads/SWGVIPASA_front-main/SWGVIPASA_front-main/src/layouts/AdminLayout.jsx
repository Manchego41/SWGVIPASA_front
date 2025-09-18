// src/layouts/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    nav('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? 'text-blue-400' : 'hover:text-blue-300'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? 'text-blue-400' : 'hover:text-blue-300'
              }
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive ? 'text-blue-400' : 'hover:text-blue-300'
              }
            >
              Productos
            </NavLink>
            {/* ✅ Nuevo enlace para gestionar promociones */}
            <NavLink
              to="/admin/promotions"
              className={({ isActive }) =>
                isActive ? 'text-blue-400' : 'hover:text-blue-300'
              }
            >
              Promociones
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-6"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
