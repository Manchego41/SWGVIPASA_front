// src/components/Navbar.jsx
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count, setDrawerOpen } = useCart();

  if (location.pathname.startsWith("/admin")) return null;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed w-full z-10 bg-[#004157]">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
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
            <NavLink to="/" end className="text-white hover:text-[#00AEEF]">
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/catalogo" end className="text-white hover:text-[#00AEEF]">
              Catálogo
            </NavLink>
          </li>

          {/* Botón Carrito (abre drawer) */}
          <li>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-white hover:text-[#00AEEF] flex items-center gap-2"
            >
              <FiShoppingCart className="text-lg" />
              <span>Carrito</span>
              {count > 0 && (
                <span className="absolute -right-3 -top-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          </li>

          {!user && (
            <li>
              <NavLink
                to="/login"
                className="px-4 py-2 bg-[#00AEEF] text-white rounded hover:bg-opacity-90"
              >
                Iniciar sesión
              </NavLink>
            </li>
          )}

          {user && user.role !== "administrador" && (
            <li>
              <ProfileMenu user={user} onLogout={handleLogout} />
            </li>
          )}

          {user && user.role === "administrador" && (
            <li>
              <NavLink to="/admin" className="text-white hover:text-[#00AEEF]">
                Panel Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}