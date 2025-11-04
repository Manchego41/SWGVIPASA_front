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
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } else {
        await API.put(`/products/${id}`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      navigate('/admin/stock');
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6 md:p-8">
      {loading ? (
        <div className="text-gray-700">Cargando…</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white/95 rounded-3xl border border-white/50 shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {isNew ? 'Agregar producto' : 'Editar producto'}
            </h1>
            <button
              type="button"
              onClick={() => navigate('/admin/stock')}
              className="h-10 w-10 grid place-items-center rounded-full bg-black/5 hover:bg-black/10"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29l-1.41 1.42L10.59 13.4l-6.3 6.3L2.88 18.3l6.3-6.29l-6.3-6.3L4.3 4.29l6.3 6.3l6.3-6.3z"/>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {/* Form – misma información, nuevo diseño */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Nombre del producto"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 bg-white focus:ring-2 focus:ring-slate-900/10 outline-none"
              />
            </div>

            {/* Precio y Stock (segmentado) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Precio */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Precio de venta <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-2xl overflow-hidden border border-black/10 bg-white">
                  <div className="px-4 py-3 flex items-center gap-2 border-r border-black/10">
                    <span className="text-slate-700">S/</span>
                    <span className="text-slate-400 select-none">⏷</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    required
                    className="flex-1 px-4 py-3 outline-none"
                    placeholder="0.00"
                  />
                  <div className="hidden md:flex items-center gap-2 px-4 py-3 text-sm text-slate-600 border-l border-black/10">
                    <span>Con impuestos</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                </div>
                <button type="button" className="mt-1.5 text-sm text-slate-500 hover:text-slate-700">
                  Ver detalle
                </button>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={onChange}
                  required
                  placeholder="0"
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                placeholder="Escribe una descripción…"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium mb-2">Imagen (URL)</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={onChange}
                placeholder="https://…"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Footer acciones */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/stock')}
                className="rounded-2xl px-5 py-2.5 bg-black/5 hover:bg-black/10 text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)] disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

