// src/pages/admin/ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const shortId = (id) => String(id || '').slice(0,6) || '-';

export default function ProductsList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setRows(data);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>

      <div className="bg-white rounded-2xl shadow border">
        <div className="flex items-center justify-end p-4">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="h-10 px-4 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            Agregar Producto
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-2xl overflow-hidden border">
            {loading ? (
              <div className="p-4 text-slate-600">Cargando…</div>
            ) : rows.length === 0 ? (
              <div className="p-4 text-slate-600">Sin productos.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  {/*
                    FORZAMOS el color con style inline como respaldo: el inline-style
                    tiene prioridad sobre clases que puedan reaparecer por otros scripts/CSS.
                  */}
                  <thead style={{ backgroundColor: '#0b3359', color: '#ffffff' }}>
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-left">Precio Unitario</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((p, i) => (
                      <tr key={p._id} className={i % 2 ? 'bg-gray-50' : ''}>
                        <td className="p-3 font-mono">{shortId(p._id)}</td>
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{money(p.price)}</td>
                        <td className="p-3">{p.countInStock ?? p.stock ?? 0}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/admin/products/${p._id}`)}
                            className="px-3 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}