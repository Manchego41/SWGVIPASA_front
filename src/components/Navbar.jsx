// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow z-10">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">IPASA</Link>

        {/* Enlaces de sección y auth */}
        <div className="flex space-x-6">
          <a href="#home"      className="text-gray-700 hover:text-gray-900">Inicio</a>
          <a href="#productos" className="text-gray-700 hover:text-gray-900">Productos</a>
          <a href="#contacto"  className="text-gray-700 hover:text-gray-900">Contacto</a>
          <Link to="/cart"     className="text-gray-700 hover:text-gray-900">Carrito</Link>
          <Link to="/login"    className="text-gray-700 hover:text-gray-900">Inicia sesión</Link>
        </div>
      </div>
    </nav>
  );
}