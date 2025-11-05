// src/pages/admin/StockManager.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

export default function StockManager() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token = stored?.token;

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get('/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        // adapta si tu API devuelve {data:{docs:[]}} u otro formato
        const data = Array.isArray(res.data) ? res.data : res.data?.products || res.data?.docs || [];
        setProducts(data);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || 'No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const goNew = () => navigate('/admin/products/new');
  const goEdit = (id) => navigate(`/admin/products/${id}`);

  return (
    <section className="p-6">
      {/* Encabezado con botón “Agregar Producto” */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Gestión de Productos</h1>
        <button
          onClick={goNew}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Agregar Producto
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-transparent">
        {loading ? (
          <div className="p-4 text-gray-600">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <table className="min-w-full text-left border-separate border-spacing-0">
            <thead className="text-white">
  <tr className="bg-gradient-to-b from-[#0F1A3A] to-[#0B1327]">
    <th className="px-4 py-3 font-semibold tracking-wide rounded-l-xl">ID</th>
    <th className="px-4 py-3 font-semibold tracking-wide">Producto</th>
    <th className="px-4 py-3 font-semibold tracking-wide">Precio Unitario</th>
    <th className="px-4 py-3 font-semibold tracking-wide">Stock</th>
    <th className="px-4 py-3 font-semibold tracking-wide rounded-r-xl">Acciones</th>
  </tr>
</thead>

            <tbody>
              {products.map((p, idx) => (
                <tr key={p._id || idx} className="border-t odd:bg-white even:bg-slate-50 hover:bg-white transition
    hover:bg-white
    border-t border-slate-200/80
    transition">
                  <td className="px-4 py-2">
                    {p._id ? String(p._id).slice(-6) : idx + 1}
                  </td>
                  <td className="px-4 py-2">{p.name || p.nombre}</td>
                  <td className="px-4 py-2">
                    S/ {Number(p.price ?? p.precio ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{p.stock ?? p.quantity ?? 0}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => goEdit(p._id)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}