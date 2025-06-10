import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="focus:outline-none">
        {/* Puedes sustituir por un SVG */}
        <img src="/profile-icon.svg" alt="Perfil" className="h-8 w-8 rounded-full"/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
          <p className="px-4 py-2 border-b text-gray-700">Hola, {user.name}</p>
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