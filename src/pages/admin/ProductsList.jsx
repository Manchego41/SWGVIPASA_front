// src/pages/admin/ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';

export default function ProductsList() {

  console.log('*** PRODUCTS LIST ACTUAL ***');

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudo cargar la lista de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await API.delete(`/products/${id}`);
    await load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Productos (ADMIN NUEVO)</h1>
        <button
          onClick={() => nav('/admin/products/new')}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + Agregar producto
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">S/ {Number(p.price).toFixed(2)}</p>
            <p className="text-sm mt-1">
              <span className="font-medium">Stock:</span> {p.countInStock ?? 0}
            </p>

            <div className="flex gap-2 mt-3">
              <Link
                to={`/admin/products/${p._id}`}
                className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700 text-sm"
              >
                Ver / Editar
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}

        {!loading && !products.length && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No hay productos
          </div>
        )}
      </div>
    </div>
  );
}
