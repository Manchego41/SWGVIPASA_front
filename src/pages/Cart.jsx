// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../utils/api';

export default function Cart() {
  // 1) Redirección si no hay token
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Estados
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying]   = useState(false);

  // 3) Cargar carrito
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await API.get('/cart', { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  // 4) Filtrar ítems válidos
  const validItems = items.filter(item => item.product && item.product.price != null);

  // 5) Calcular total
  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 6) Quitar ítems del carrito
  const handleRemove = id => {
    if (!window.confirm('¿Quitar este producto del carrito?')) return;
    API.delete(`/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setItems(prev => prev.filter(i => i._id !== id)))
      .catch(console.error);
  };

  // 7) Registrar compra SIN pago real (checkout-local)
  const handleCheckout = async () => {
    try {
      setPaying(true);
      const res = await API.post(
        '/cart/checkout-local',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status >= 200 && res.status < 300) {
        // Éxito: historial creado y carrito vaciado en el back
        alert('✅ Compra guardada en tu historial.');
        // Redirigir al perfil (categoría Compras)
        window.location.href = '/profile';
        return;
      }
      alert('No se pudo registrar la compra');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al registrar la compra';
      alert(msg);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : validItems.length === 0 ? (
        <div>No hay ítems en el carrito.</div>
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
          <div className="text-right mt-4">
            <button
              onClick={handleCheckout}
              disabled={paying}
              className={`px-4 py-2 rounded text-white ${paying ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {paying ? 'Guardando…' : 'Pagar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}