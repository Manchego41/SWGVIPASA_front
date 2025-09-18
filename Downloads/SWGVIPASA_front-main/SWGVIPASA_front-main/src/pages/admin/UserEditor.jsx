import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ role: '' });

  useEffect(() => {
    axios.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.user).token}` }
    })
    .then(res => setForm({ role: res.data.role }))
    .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`/api/users/${id}/role`, form, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.user).token}` }
    })
    .then(() => nav('/admin/users'))
    .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Editar Rol de Usuario</h2>
      <label className="block mb-2">Rol:</label>
      <select
        value={form.role}
        onChange={e => setForm({ role: e.target.value })}
        className="w-full border p-2 mb-4"
      >
        <option value="cliente">Cliente</option>
        <option value="vendedor">Vendedor</option>
        <option value="administrador">Administrador</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Guardar
      </button>
    </form>
  );
}