// src/pages/Profile.jsx
import React, { useState, useEffect, useMemo } from 'react';
import API from '../utils/api';
import ModalVerCompra from '../components/ModalVerCompra';

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;

  const [purchases, setPurchases] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Cargar compras desde tu API: /api/purchases/mine
  useEffect(() => {
    async function fetchPurchases() {
      try {
        setLoading(true);
        const { data } = await API.get('/purchases/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // data es un arreglo de compras: { _id, createdAt, items: [{name, price, quantity}], total }
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar compras', err);
        const msg = err?.response?.data?.message || 'No se pudo cargar el historial';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchPurchases();
  }, [token]);

  // Filtrar por búsqueda (por nombre de producto dentro de cada compra)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter(p =>
      (p.items || []).some(it => String(it.name || '').toLowerCase().includes(q))
    );
  }, [purchases, search]);

  return (
    <div className="pt-16 bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow p-4 space-y-6">
        <h2 className="text-xl font-semibold mb-2">Mi perfil</h2>
        <img
          src="/avatar.png"
          alt="Avatar usuario"
          className="w-full rounded-lg mb-4"
        />

        <ul className="space-y-2 text-gray-700">
          <li className="hover:text-blue-600 cursor-pointer">Información personal</li>
          <li className="text-blue-600 font-semibold cursor-default">Compras</li>
          <li className="hover:text-blue-600 cursor-pointer">Devoluciones</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Compras</h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por producto…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading ? (
          <div className="text-gray-600">Cargando historial…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No hay compras que mostrar.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map(p => (
              <div
                key={p._id}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">
                      Compra #{String(p._id).slice(-6).toUpperCase()}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ''}
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {p.status === 'recorded' ? 'Registrada' : 'Completada'}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-4">
                  {(p.items || []).slice(0, 3).map((it, idx) => (
                    <div
                      key={idx}
                      className="py-2 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-gray-500 text-sm">
                          Cantidad: {it.quantity} × S/ {Number(it.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold">
                        S/ {(Number(it.price) * Number(it.quantity)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {(p.items || []).length > 3 && (
                    <div className="text-center text-blue-600 text-sm mt-2">
                      +{(p.items || []).length - 3} productos más...
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-900">
                    Total: S/ {Number(p.total).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(p.items || []).length} producto{(p.items || []).length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedPurchase(p._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Ver compra
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Hacer Devolución
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Ver Compra */}
        <ModalVerCompra 
          purchaseId={selectedPurchase}
          isOpen={!!selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      </main>
    </div>
  );
}