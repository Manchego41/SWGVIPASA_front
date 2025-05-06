// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#0D5C75] text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LOGO + IPASA como enlace */}
        <Link to="/" className="flex items-center">
          <img src="/descarga-removebg-preview.png" alt="IPASA Logo" className="h-10 w-10 mr-2" />
          <span className="font-bold text-xl text-[#1DA1F2]">IPASA</span>
        </Link>

        <ul className="flex space-x-6 text-sm items-center">
          <li><Link to="/" className="hover:text-[#1DA1F2]">Home</Link></li>
          <li><Link to="/productos" className="hover:text-[#1DA1F2]">Productos</Link></li>
          <li><Link to="/nosotros" className="hover:text-[#1DA1F2]">Nosotros</Link></li>
          <li><Link to="/contacto" className="hover:text-[#1DA1F2]">Contáctenos</Link></li>
          <li>
            <Link
              to="/login"
              className="bg-[#1DA1F2] text-white px-4 py-2 rounded hover:bg-[#0B8DD2] transition"
            >
              Iniciar sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;