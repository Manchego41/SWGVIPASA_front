// src/pages/Profile.jsx
import React, { useState, useEffect, useMemo } from 'react';
import API from '../utils/api';
import DevolucionModal from '../components/DevolucionModal';

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;

  const [purchases, setPurchases] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  
  // Estados para el modal de devolución
  const [isDevolucionOpen, setIsDevolucionOpen] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  // Cargar compras desde tu API: /api/purchases/mine
  useEffect(() => {
    async function fetchPurchases() {
      try {
        setLoading(true);
        const { data } = await API.get('/purchases/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
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

  // Función para abrir el modal de devolución
  const handleDevolucionClick = (compra) => {
    setCompraSeleccionada(compra);
    setIsDevolucionOpen(true);
  };

  // Función para refrescar compras después de devolución
  const handleDevolucionSuccess = () => {
    // Recargar las compras
    async function reloadPurchases() {
      try {
        const { data } = await API.get('/purchases/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al recargar compras', err);
      }
    }
    if (token) reloadPurchases();
  };

  // Filtrar por búsqueda
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter(p =>
      (p.items || []).some(it => String(it.name || '').toLowerCase().includes(q))
    );
  }, [purchases, search]);

  return (
    <div className="pt-16 bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-center">
          <img
            src="/avatar.png"
            alt="Avatar usuario"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100"
          />
          <h2 className="text-xl font-bold text-gray-800">Mi Perfil</h2>
          <p className="text-gray-600 text-sm">Bienvenido de vuelta</p>
        </div>

        <nav className="space-y-3">
          <div className="p-3 rounded-lg hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            📝 Información personal
          </div>
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600 font-semibold cursor-default">
            🛒 Mis Compras
          </div>
          <div className="p-3 rounded-lg hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
            🔄 Devoluciones
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
              <p className="text-gray-600">Historial de todas tus compras realizadas</p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                🔍
              </div>
              <input
                type="text"
                placeholder="Buscar por producto…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">No hay compras que mostrar</p>
              <p className="text-gray-400">Realiza tu primera compra para verla aquí</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map(p => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-lg text-gray-900">
                        Compra #{String(p._id).slice(-6).toUpperCase()}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-2">
                        <span>📅</span>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Completada
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Productos adquiridos:</h3>
                    <div className="space-y-3">
                      {(p.items || []).map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{it.name}</div>
                            <div className="text-gray-500 text-sm">
                              Cantidad: {it.quantity} × S/ {Number(it.price).toFixed(2)}
                            </div>
                          </div>
                          <div className="font-bold text-green-600">
                            S/ {(Number(it.price) * Number(it.quantity)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total y acciones */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="font-bold text-lg text-gray-900">
                      Total: S/ {Number(p.total).toFixed(2)}
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        📄 Ver detalles
                      </button>
                      <button 
                        onClick={() => handleDevolucionClick(p)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-sm"
                      >
                        🔄 Hacer Devolución
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Devolución */}
        <DevolucionModal
          compra={compraSeleccionada}
          isOpen={isDevolucionOpen}
          onClose={() => setIsDevolucionOpen(false)}
          onDevolucionSuccess={handleDevolucionSuccess}
        />
      </main>
    </div>
  );
}