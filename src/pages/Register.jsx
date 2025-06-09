// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: ''
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    if (!form.email.endsWith('@gmail.com')) {
      setMsg('Solo correos @gmail.com permitidos');
      return;
    }
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-[320px] space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Registro de usuario</h2>
        {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre completo"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Usuario"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo (@gmail.com)"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}