import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-[#0D5C75] text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <img src="/descarga-removebg-preview.png" alt="IPASA Logo" className="h-10 w-10 mr-2" />
          <span className="font-bold text-xl text-[#1DA1F2]">IPASA</span>
        </Link>

        <ul className="flex space-x-6 text-sm items-center">
          <li><Link to="/" className="hover:text-[#1DA1F2]">Home</Link></li>
          <li><Link to="/productos" className="hover:text-[#1DA1F2]">Productos</Link></li>
          <li><Link to="/nosotros" className="hover:text-[#1DA1F2]">Nosotros</Link></li>
          <li><Link to="/contacto" className="hover:text-[#1DA1F2]">Contáctenos</Link></li>

          {role === 'administrador' && (
            <li>
              <Link to="/admin/dashboard" className="hover:text-yellow-400 font-semibold">
                Panel Admin
              </Link>
            </li>
          )}

          {token ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-[#1DA1F2] text-white px-4 py-2 rounded hover:bg-[#0B8DD2] transition"
              >
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;