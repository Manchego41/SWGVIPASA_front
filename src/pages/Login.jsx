// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' };

export default function Login() {
  const [tab, setTab]     = useState('login');       // 'login' | 'register'
  const [form, setForm]   = useState(INITIAL);
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/login', {
        email:    form.email,
        password: form.password,
      });
      localStorage.setItem(
        'user',
        JSON.stringify({
          token: data.token,
          role:  data.role,
          name:  data.name,
        })
      );
      if (data.role === 'administrador') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const submitRegister = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await API.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      setTab('login');
      setForm(INITIAL);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/IPASA%20LOGO.jpeg')" }}
    >
      <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow">
        {/* Tabs */}
        <div className="flex border-b-2">
          <button
            className={`flex-1 py-2 ${
              tab === 'login' ? 'border-b-2 border-blue-600' : ''
            }`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 ${
              tab === 'register' ? 'border-b-2 border-blue-600' : ''
            }`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={submitLogin} className="space-y-4 mt-4">
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="space-y-4 mt-4">
            <input
              name="name"
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
}