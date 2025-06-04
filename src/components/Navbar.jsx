// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Título */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              SWGVIPASA
            </Link>
          </div>
          {/* Enlaces de navegación */}
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Productos
            </Link>
            <Link
              to="/contacto"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contacto
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Carrito
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;