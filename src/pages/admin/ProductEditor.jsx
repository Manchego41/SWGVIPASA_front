// src/pages/admin/ProductEditor.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';

const EMPTY = { name: '', price: 0, countInStock: 0, description: '', imageUrl: '' };

export default function ProductEditor() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!isNew) {
        try {
          const { data } = await API.get(`/products/${id}`);
          setForm({
            name: data.name ?? '',
            price: data.price ?? 0,
            countInStock: data.countInStock ?? 0,
            description: data.description ?? '',
            imageUrl: data.imageUrl ?? '',
          });
        } catch {
          setError('No se pudo cargar el producto');
        }
      }
    };
    load();
  }, [id, isNew]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const payload = {
    name: form.name,
    price: Number(form.price),
    countInStock: Number(form.countInStock),
    description: form.description,
    imageUrl: (form.imageUrl || '').trim(), // ⬅️ enviar imagen
  };

  try {
    if (isNew) {
      await API.post('/products', payload);
    } else {
      await API.put(`/products/${id}`, payload);
    }
    nav('/admin/products');
  } catch (e) {
    console.error(e);
    setError('Error guardando el producto (¿token/rol admin?)');
  }
};


  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">{isNew ? 'Nuevo producto' : 'Editar producto'}</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input className="w-full border p-2 rounded"
                 value={form.name}
                 onChange={e => setForm({ ...form, name: e.target.value })}
                 required />
        </div>
        <div>
          <label className="block mb-1">Precio (S/.)</label>
          <input type="number" step="0.01" className="w-full border p-2 rounded"
                 value={form.price}
                 onChange={e => setForm({ ...form, price: e.target.value })}
                 required />
        </div>
        <div>
          <label className="block mb-1">Stock</label>
          <input type="number" className="w-full border p-2 rounded"
                 value={form.countInStock}
                 onChange={e => setForm({ ...form, countInStock: e.target.value })}
                 required />
        </div>
        
        <div>
          <label className="block mb-1">URL de imagen</label>
          <input
                 className="w-full border p-2 rounded"
                 placeholder="https://sitio.com/imagen.jpg"
                 value={form.imageUrl}
                 onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea rows={4} className="w-full border p-2 rounded"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}/>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {isNew ? 'Crear' : 'Actualizar'}
          </button>
          <button type="button" onClick={() => nav('/admin/products')}
                  className="px-4 py-2 bg-gray-200 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
