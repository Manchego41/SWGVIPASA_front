// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // No mostrar en rutas de admin
  if (location.pathname.startsWith('/admin')) return null;

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Logout: borrar datos y llevar a login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="fixed w-full bg-white shadow z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold">IPASA</NavLink>
        <ul className="flex space-x-6 items-center">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>

          {!user && (
            <li>
              <NavLink to="/login">Iniciar sesión / Registrarse</NavLink>
            </li>
          )}

          {user && user.role !== 'administrador' && (
            <>
              <li><NavLink to="/cart">Carrito</NavLink></li>
              <li>
                <ProfileMenu user={user} onLogout={handleLogout} />
              </li>
            </>
          )}

          {user && user.role === 'administrador' && (
            <li><NavLink to="/admin">Panel Admin</NavLink></li>
          )}
        </ul>
      </nav>
    </header>
  );
}