import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario de localStorage
  useEffect(() => {
    const u = localStorage.getItem('user');
    setUser(u ? JSON.parse(u) : null);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-20">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          IPASA
        </Link>

        {/* Menú */}
        <div className="flex items-center space-x-6">
          <a href="#home"      className="text-gray-700 hover:text-gray-900">Inicio</a>
          <a href="#productos" className="text-gray-700 hover:text-gray-900">Productos</a>
          <a href="#contacto"  className="text-gray-700 hover:text-gray-900">Contacto</a>

          {user ? (
            <ProfileMenu user={user} onLogout={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}/>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-gray-900">
              Inicia sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}