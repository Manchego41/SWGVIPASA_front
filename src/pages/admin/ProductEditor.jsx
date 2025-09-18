// src/pages/admin/ProductEditor.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';

export default function ProductEditor() {
  const navigate = useNavigate();
  const { id } = useParams(); // 'new' o un ObjectId
  const isNew = !id || id === 'new';

  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token = stored?.token;

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar producto si es edición
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const p = res.data;
        setForm({
          name: p.name ?? '',
          price: p.price ?? '',
          stock: p.stock ?? '',
          description: p.description ?? '',
          image: p.image ?? '',
        });
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || 'No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        image: form.image,
      };
      if (isNew) {
        await API.post('/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.put(`/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // volver a la gestión
      navigate('/admin/stock');
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isNew ? 'Agregar Producto' : 'Editar Producto'}
      </h1>

      {loading ? (
        <div className="text-gray-600">Cargando…</div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="bg-white rounded shadow p-4 max-w-2xl space-y-4"
        >
          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={onChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={onChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {saving ? 'Guardando…' : isNew ? 'Crear' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/stock')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}