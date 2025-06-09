// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsgError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

      if (user.role === 'administrador') {
        navigate('/admin/dashboard');
      } else if (user.role === 'vendedor') {
        navigate('/vendedor/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Credenciales inválidas';
      setMsgError(message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form className="bg-white p-6 rounded shadow-md w-[320px]" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        {msgError && <p className="text-red-500 mb-2">{msgError}</p>}
        <label className="block mb-2">
          <span className="text-gray-700">Correo electrónico</span>
          <input
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Contraseña</span>
          <input
            type="password"
            className="mt-1 block w-full border-gray-300 rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;