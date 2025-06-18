import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [msg, setMsg]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    API.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setForm({
        name: res.data.name,
        email: res.data.email
      }))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.email.endsWith('@gmail.com')) {
      setMsg('Correo debe terminar en @gmail.com');
      return;
    }
    API.put('/users/me', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => setMsg('Perfil actualizado correctamente'))
      .catch(err => setMsg(err.response?.data?.message || 'Error'));
  };

  return (
    <div className="flex justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-[320px] space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>
        {msg && <p className="text-green-600 text-center">{msg}</p>}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre completo"
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo (@gmail.com)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Actualizar perfil
        </button>
      </form>
    </div>
  );
}