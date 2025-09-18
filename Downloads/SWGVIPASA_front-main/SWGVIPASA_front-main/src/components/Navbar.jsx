import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import ProfileMenu from './ProfileMenu'; ← Mantén comentado por ahora

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // No mostrar en rutas de admin
  if (location.pathname.startsWith('/admin')) return null;

  // ✅ SOLO localStorage, NO useContext
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Logout: borrar datos y llevar a login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="fixed w-full z-10 bg-[#004157]">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/descarga-removebg-preview.png"
            alt="IPASA Logo"
            className="h-8 w-auto"
          />
          <span className="text-[#00AEEF] text-xl font-bold">IPASA</span>
        </div>

        {/* Links */}
        <ul className="flex space-x-6 items-center">
          <li>
            <NavLink to="/" className="text-white hover:text-[#00AEEF]">
              Home
            </NavLink>
          </li>

          <li>
            <a href="#productos" className="text-white hover:text-[#00AEEF]">
              Productos
            </a>
          </li>

          <li>
            <a href="#contacto" className="text-white hover:text-[#00AEEF]">
              Contáctenos
            </a>
          </li>

          {!user && (
            <li>
              <NavLink
                to="/login"
                className="px-4 py-2 bg-[#00AEEF] text-white rounded"
              >
                Iniciar sesión
              </NavLink>
            </li>
          )}

          {user && user.role !== 'administrador' && (
            <>
              <li>
                <NavLink
                  to="/cart"
                  className="text-white hover:text-[#00AEEF]"
                >
                  Carrito
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-[#00AEEF]"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}

          {user && user.role === 'administrador' && (
            <li>
              <NavLink
                to="/admin"
                className="text-white hover:text-[#00AEEF]"
              >
                Panel Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}