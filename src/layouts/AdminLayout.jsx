// src/layouts/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiStar, FiInbox, FiLogOut } from 'react-icons/fi';

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    try { localStorage.removeItem('user'); }
    finally { navigate('/login'); }
  };

  const base  = 'flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition';
  const active= 'flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-600 text-white';

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-[#0b1736] text-white p-4 space-y-4">
        <div className="flex items-center gap-3 p-2">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20" />
          </div>
          <div>
            <div className="text-cyan-300 font-extrabold tracking-wide leading-5">ACCOUNT</div>
            <div className="text-white/70 text-sm">Panel Admin</div>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          <NavLink to="/admin" end className={({isActive}) => isActive ? active : base}>
            <FiHome className="text-lg" /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? active : base}>
            <FiUsers className="text-lg" /> <span>Usuarios</span>
          </NavLink>
          <NavLink to="/admin/stock" className={({isActive}) => isActive ? active : base}>
            <FiStar className="text-lg" /> <span>Gestión de Productos</span>
          </NavLink>
          <NavLink to="/admin/returns" className={({isActive}) => isActive ? active : base}>
            <FiInbox className="text-lg" /> <span>Devoluciones</span>
          </NavLink>
        </nav>

        <div className="pt-2 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition"
          >
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}