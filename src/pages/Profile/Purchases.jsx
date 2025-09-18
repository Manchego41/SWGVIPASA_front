// src/pages/profile/Purchases.jsx
import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const getToken = () => localStorage.getItem('token'); // ajusta el nombre si usas otro

export default function Purchases() {
  const [orders, setOrders] = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/purchases/mine`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data.message || `HTTP ${r.status}`);
        }
        const data = await r.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'No se pudo cargar el historial');
        setOrders([]);
      }
    })();
  }, []);

  if (orders === null) {
    return <div className="p-6">Cargando historial…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Historial de Compras</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border p-6 text-gray-600 bg-white">
          Aún no hay compras registradas.
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map(o => (
            <li key={o._id} className="rounded-xl border p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="font-medium">Compra #{o._id.slice(-6)}</div>
                <div className="text-sm text-gray-600">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="mt-2 divide-y">
                {o.items.map((it, i) => (
                  <div key={i} className="py-2 flex items-center gap-4">
                    <div className="flex-1">{it.name}</div>
                    <div className="text-sm">x{it.quantity}</div>
                    <div className="font-semibold">
                      S/ {(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-right font-semibold">
                Total: S/ {Number(o.total).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}