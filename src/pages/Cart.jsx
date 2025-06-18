// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../utils/api';

export default function Cart() {
  // 1) Redirección sin parpadeo si no hay token
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Estados
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 3) Fetch del carrito
  useEffect(() => {
    API.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [token]);

  // 4) Manejadores de estados
  if (loading) {
    return <div className="pt-16 p-6">Cargando carrito…</div>;
  }
  if (error) {
    return (
      <div className="pt-16 p-6 text-red-600">
        Error al cargar el carrito: {error.response?.data?.message || error.message}
      </div>
    );
  }

  // 5) Filtrar solo ítems con producto poblado para evitar crash
  const validItems = items.filter(item => item.product && item.product.price != null);

  // 6) Calcular total
  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 7) Quitar ítems del carrito
  const handleRemove = id => {
    if (!window.confirm('¿Quitar este producto del carrito?')) return;
    API.delete(`/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setItems(items.filter(i => i._id !== id)))
      .catch(console.error);
  };

  return (
    <div className="pt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>

      {validItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table className="w-full mb-6 bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Subtotal</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {validItems.map(item => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">S/ {item.product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    S/ {(item.product.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-xl font-semibold">
            Total a pagar: S/ {total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}