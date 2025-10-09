// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' };

export default function Login() {
  const [tab, setTab]     = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState(INITIAL);
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  const bgUrl = `/IPASA%20LOGO.jpeg`; // está en /public

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Backend devuelve: { token, role, name }
      const { data } = await API.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      const user = { token: data.token, role: data.role, name: data.name };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('token'); // limpiar legacy

      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Completa todos los campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setTab('login');
      setForm({ ...INITIAL, email: form.email });
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur p-6 rounded-lg shadow">
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 py-2 ${tab === 'login' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setTab('login')}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 ${tab === 'register' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setTab('register')}
            type="button"
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
        )}

        {/* LOGIN */}
        {tab === 'login' && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="correo@dominio.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Entrar
            </button>
          </form>
        )}

        {/* REGISTER */}
        {tab === 'register' && (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="correo@dominio.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Repite la contraseña</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
}