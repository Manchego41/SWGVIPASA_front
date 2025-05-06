// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link de React Router para la navegación

const Navbar = () => {
  return (
    <nav className="bg-[#0D5C75] text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <img src="/logo_ipasa.png" alt="IPASA logo" className="h-10 w-10 mr-2" />
          <span className="font-bold text-xl text-[#1DA1F2]">IPASA</span>
        </div>
        <ul className="flex space-x-6 text-sm">
          <li><Link to="/" className="hover:text-[#1DA1F2]">Home</Link></li>
          <li><Link to="/productos" className="hover:text-[#1DA1F2]">Productos</Link></li>
          <li><Link to="/nosotros" className="hover:text-[#1DA1F2]">Nosotros</Link></li>
          <li><Link to="/contacto" className="hover:text-[#1DA1F2]">Contacto</Link></li>
          <li><Link to="/login" className="hover:text-[#1DA1F2]">Iniciar sesión</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;