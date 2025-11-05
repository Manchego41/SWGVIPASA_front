// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

/** Paleta:
 *  Fondo: from-[#0f1431] via-[#12193d] to-[#111827]  (azul/morado oscuro)
 *  Texto neutro: text-slate-200/400
 *  Acento activo: bg-cyan-400 text-slate-900  (respeta tu celeste)
 */

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("uploadToken");
      localStorage.removeItem("user");
    } catch {}
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#7FA2C3] flex">
      {/* Sidebar */}
      <aside
        className={[
          "transition-all duration-200",
          open ? "w-72" : "w-20",
          "text-slate-200",
          "bg-gradient-to-b from-[#0f1431] via-[#12193d] to-[#111827]",
          "shadow-2xl",
        ].join(" ")}
      >
        {/* Contenedor columna para pegar el botón abajo */}
        <div className="h-full flex flex-col">
          {/* Header perfil */}
          <div className="px-5 py-6">
            <button
              onClick={() => setOpen((o) => !o)}
              className="mb-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
              title={open ? "Colapsar" : "Expandir"}
              aria-label={open ? "Colapsar" : "Expandir"}
            >
              <DotsIcon />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/15 ring-2 ring-white/10 flex items-center justify-center">
                {/* avatar */}
                <svg width="28" height="28" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    fill="currentColor"
                    d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5"
                  />
                </svg>
              </div>
              {open && (
                <div>
                  <p className="text-cyan-300 font-extrabold text-xl leading-5">ACCOUNT</p>
                  <p className="text-slate-400 text-sm">Panel Admin</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <nav className="mt-2">
            <SideItem to="/admin" end icon={HomeIcon} label="Dashboard" open={open} />
            <SideItem to="/admin/users" icon={ChatIcon} label="Usuarios" open={open} />
            <SideItem to="/admin/stock" icon={StarIcon} label="Gestión de Productos" open={open} />
          </nav>

          {/* Botón Cerrar sesión (pegado abajo) */}
          <div className="mt-auto px-5 pb-5 pt-4">
            <button
              onClick={handleLogout}
              className="
                w-full inline-flex items-center justify-center gap-2
                rounded-full
                bg-[#ff5f57] hover:bg-[#e8534d] active:bg-[#d44743]
                text-white font-semibold
                py-2.5 px-4
                shadow-lg shadow-[#ff5f57]/30
                focus:outline-none focus:ring-2 focus:ring-[#ff5f57]/40
                transition-colors
              "
              title="Cerrar sesión"
            >
              <FiLogOut className="text-lg" />
              {open && "Cerrar sesión"}
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h1 className="text-slate-800 font-semibold"></h1>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SideItem({ to, label, icon: Icon, open, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group flex items-center",
          open ? "gap-3 px-5" : "justify-center",
          "py-3 mx-3 rounded-xl",
          isActive
            ? "bg-cyan-400 text-slate-900 shadow-[0_6px_20px_-10px_rgba(34,211,238,0.9)]"
            : "text-slate-200 hover:bg-white/10",
        ].join(" ")
      }
    >
      <span className="shrink-0">
        <Icon />
      </span>
      {open && <span className="text-sm font-semibold tracking-wide">{label}</span>}
    </NavLink>
  );
}

/* ====== Iconos SVG inline (sin dependencias) ====== */
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-95">
      <path fill="currentColor" d="M12 3.172L2.343 12H5v8h6v-6h2v6h6v-8h2.657z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-95">
      <path fill="currentColor" d="M4 4h16v12H7l-3 3z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-95">
      <path
        fill="currentColor"
        d="m12 17.27l6.18 3.73l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}
function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-95">
      <path fill="currentColor" d="M3 3h4v18H3zm7 6h4v12h-4zm7-4h4v16h-4z" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-95">
      <path
        fill="currentColor"
        d="m12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8m9 4l-2.1 1.6l.3 2.6l-2.5.9l-1.4 2.2l-2.6-.7L12 22l-1.6-2.1l-2.6.7l-1.4-2.2l-2.5-.9l.3-2.6L2 12l2.1-1.6l-.3-2.6l2.5-.9l1.4-2.2l2.6.7L12 2l1.6 2.1l2.6-.7l1.4 2.2l2.5.9l-.3 2.6z"
      />
    </svg>
  );
}
function DotsIcon() {
  // tres puntos verticales
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-200">
      <path
        fill="currentColor"
        d="M12 6.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m0 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m0 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"
      />
    </svg>
  );
}
