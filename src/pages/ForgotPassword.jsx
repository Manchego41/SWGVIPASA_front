import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (error) {
      setMsg(error.response?.data?.message || 'Error al enviar correo');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Recuperar Contraseña</h2>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Enviar enlace
        </button>
        {msg && <p className="mt-4 text-sm text-center text-gray-700">{msg}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;