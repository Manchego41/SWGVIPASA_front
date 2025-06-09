// src/pages/Contacto.jsx
import React from 'react';

export default function Contacto() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Contáctanos</h2>
      <div className="max-w-lg mx-auto space-y-4 text-gray-700">
        <p><strong>Teléfono:</strong> +51 123 456 789</p>
        <p><strong>Correo:</strong> servicio.ipasa@gmail.com</p>
        <p><strong>Ubicación:</strong> Av. Ejemplo 123, Lima, Perú</p>
        <p><strong>Horario de atención:</strong> Lun–Vie 9:00–18:00</p>
      </div>
    </div>
  );
}