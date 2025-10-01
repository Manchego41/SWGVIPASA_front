// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import CartWidget from './CartWidget';
import API from '../utils/api';

// util interno
function readUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ocultar el navbar en rutas de admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  // Estado de usuario reactivo: cambia en navegación y en eventos de auth
  const [user, setUser] = useState(() => readUser());

  useEffect(() => { setUser(readUser()); }, [location.key]);
  useEffect(() => {
    const onAuthChanged = () => setUser(readUser());
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  const handleLogout = () => {
    try {
      // 1) limpiar storages
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // 2) limpiar cookie (si la usas)
      document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax';

      // 3) quitar header por defecto del cliente
      delete API.defaults.headers.common.Authorization;

      // 4) notificar al resto de la app (CartWidget, etc.)
      window.dispatchEvent(new Event('auth:changed'));
      window.dispatchEvent(new Event('cart:changed'));
      if (window.refreshCart) window.refreshCart();
    } catch (e) {
      console.error('Error en logout:', e);
    } finally {
      // 5) navegar al login
      navigate('/login');
    }
  };

  return (
    <>
      <header className="fixed w-full z-40" style={{ backgroundColor: '#004157' }}>
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/descarga-removebg-preview.png" alt="IPASA Logo" className="h-8 w-auto" />
            <span className="text-[#00AEEF] text-xl font-bold">IPASA</span>
          </div>

          {/* Links superiores */}
          <ul className="flex space-x-6 items-center">
            <li>
              <NavLink to="/" end className="text-white hover:text-[#00AEEF]">
                Home
              </NavLink>
            </li>
            <li>
              <a href="#productos" className="text-white hover:text-[#00AEEF]">
                Productos
              </a>
            </li>
            <li>
              <a href="#catalogo" className="text-white hover:text-[#00AEEF]">
                Catálogo
              </a>
            </li>
            <li>
              <a href="#contacto" className="text-white hover:text-[#00AEEF]">
                Contáctenos
              </a>
            </li>

            {!user ? (
              <li>
                <NavLink
                  to="/login"
                  className="px-4 py-2 bg-[#00AEEF] text-white rounded hover:bg-opacity-90"
                  onClick={() => window.dispatchEvent(new Event('auth:changed'))}
                >
                  Iniciar sesión
                </NavLink>
              </li>
            ) : (
              <>
                {user.role === 'administrador' ? (
                  <li>
                    <NavLink to="/admin" className="text-white hover:text-[#00AEEF]">
                      Panel Admin
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <ProfileMenu user={user} onLogout={handleLogout} />
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Botón flotante + panel del carrito */}
      <CartWidget user={user} />
    </>
  );
}

