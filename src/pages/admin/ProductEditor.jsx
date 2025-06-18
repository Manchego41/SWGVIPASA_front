import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState({
    name: '',
    price: 0,
    countInStock: 0,
    description: '',
  });

  useEffect(() => {
    if (!isNew) {
      axios.get(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.user).token}` }
      })
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
    }
  }, [id, isNew]);

  const handleSubmit = e => {
    e.preventDefault();
    const method = isNew ? axios.post : axios.put;
    const url = isNew ? '/api/products' : `/api/products/${id}`;
    method(url, form, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.user).token}` }
    })
    .then(() => nav('/admin/products'))
    .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {isNew ? 'Crear Producto' : 'Editar Producto'}
      </h2>
      {['name','price','countInStock','description'].map(field => (
        <div key={field} className="mb-3">
          <label className="block mb-1 capitalize">{field}:</label>
          {field !== 'description' ? (
            <input
              type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              className="w-full border p-2"
            />
          ) : (
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2"
            />
          )}
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {isNew ? 'Crear' : 'Actualizar'}
      </button>
    </form>
  );
}