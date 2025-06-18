// src/components/HeroBanner.jsx
import React from 'react';

export default function HeroBanner() {
  return (
    <div className="text-center p-8">
      <h1 className="text-5xl font-extrabold mb-4">¡Bienvenidos a IPASA!</h1>
      <p className="text-lg mb-6">
        Tu tienda online de confianza. Calidad, variedad y entrega rápida.
      </p>
      <a
        href="#productos"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ver Productos
      </a>
    </div>
  );
}