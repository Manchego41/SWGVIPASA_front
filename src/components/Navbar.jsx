// src/components/Navbar.jsx
import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import CartWidget from './CartWidget';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ocultar el navbar en rutas de admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  // Lee el usuario guardado por el login (si no existe, es null)
  // useMemo para no recalcular en cada render (se vuelve a leer en cada navegación)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  // usar location.key hace que se recalcule cuando navegas
  }, [location.key]);

  const handleLogout = () => {
    try { localStorage.removeItem('token'); } catch {}
    try { localStorage.removeItem('user'); } catch {}
    try { sessionStorage.removeItem('token'); } catch {}
    // avisa al resto de la app (p.ej. al widget) que cerraste sesión
    window.dispatchEvent(new Event('auth:logout'));
    navigate('/login');
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
                  onClick={() => window.dispatchEvent(new Event('auth:login:navigate'))}
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

      {/* Botón flotante + panel del carrito (ahora recibe el user) */}
      <CartWidget user={user} />
    </>
  );
}
