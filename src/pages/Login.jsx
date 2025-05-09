import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setMsg('');

      if (res.data.role === 'administrador') {
        navigate('/admin');
      } else if (res.data.role === 'vendedor') {
        navigate('/vendedor');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {msg && <p className="mb-4 text-sm text-red-600 text-center">{msg}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;