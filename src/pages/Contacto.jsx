// src/pages/Contacto.jsx
import React, { useState } from 'react';

const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, mensaje });
    setEnviado(true);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white border rounded-lg p-6 shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Contáctanos</h1>
      {enviado ? (
        <p className="text-green-600 text-center">
          ¡Gracias por tu mensaje! Nos pondremos en contacto pronto.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              className="w-full border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mensaje</label>
            <textarea
              className="w-full border-gray-300 rounded-md p-2"
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enviar Mensaje
          </button>
        </form>
      )}
    </div>
  );
};

export default Contacto;