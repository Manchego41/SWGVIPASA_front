import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="fixed w-full bg-white shadow z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between">
        <NavLink to="/" className="text-xl font-bold">IPASA</NavLink>
        <ul className="flex space-x-6">
          <li><NavLink to="/"      end>Home</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/contacto" >Contacto</NavLink></li>

          {!user && (
            <li>
              <NavLink to="/login">Iniciar sesión / Registrarse</NavLink>
            </li>
          )}

          {user && user.role !== 'administrador' && (
            <>
              <li><NavLink to="/cart">Carrito</NavLink></li>
              <li><NavLink to="/profile">{user.name}</NavLink></li>
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