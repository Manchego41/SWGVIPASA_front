import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleCancel = () => {
    window.location.href = '/login';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías llamar a la API para enviar el correo de recuperación
    setMessage('Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans"
      style={{ backgroundImage: "url('/IPASA%20LOGO.jpeg')" }}
    >
  <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow font-sans">
        <h2 className="text-2xl font-bold mb-4 text-center font-sans">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-sans">
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded text-sm font-sans"
          />
          <div className="flex gap-4 items-center">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded border-2 border-indigo-800 shadow hover:bg-indigo-700 hover:border-indigo-900 text-sm font-sans"
              style={{ minWidth: 0 }}
            >
              Recuperar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded border-2 border-gray-500 font-bold shadow hover:bg-gray-300 hover:border-gray-700 text-sm font-sans"
              style={{ minWidth: 0 }}
            >
              Cancelar
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-green-600 text-center text-sm font-sans">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
