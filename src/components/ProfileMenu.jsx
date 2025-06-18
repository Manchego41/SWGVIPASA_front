// src/components/ProfileMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="focus:outline-none flex items-center space-x-1"
      >
        <span className="font-medium text-gray-700">{user.name}</span>
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => setOpen(false)}
          >
            Mi perfil
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}