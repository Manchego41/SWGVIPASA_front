// src/pages/Profile.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import API from '../utils/api';
import PurchaseDetailModal from '../components/PurchaseDetailModal';
import ReturnRequestModal from '../components/ReturnRequestModal';
import MisDevoluciones from "./Profile/MisDevoluciones";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;
  const currentUserName =
    stored?.name ||
    stored?.user?.name ||
    stored?.username ||
    stored?.email ||
    "";

  const [purchases, setPurchases]   = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Sidebar "activo": info | compras | devoluciones
  const [activeTab, setActiveTab]   = useState('compras');

  // Modal de detalle
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Modal de devolución
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedForReturn, setSelectedForReturn] = useState(null);

  // Catálogo para imágenes (Mongo -> imageUrl)
  const [productsById, setProductsById] = useState({});
  const [productsByName, setProductsByName] = useState({});

  // Abre / cierra detalle
  const openDetail  = (p) => { setSelectedPurchase(p); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setSelectedPurchase(null); };

  // Abre / cierra modal de devolución
  const openReturn = (p) => {
    setSelectedForReturn(p);
    setShowReturnModal(true);
  };
  const closeReturn = () => {
    setShowReturnModal(false);
    setSelectedForReturn(null);
  };

  // Cargar compras desde tu API: /api/purchases/mine
  const fetchPurchases = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
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
  }, [token]);

  useEffect(() => {
    if (token) fetchPurchases();
  }, [token, fetchPurchases]);

  // Cargar catálogo para tener imageUrl (ajusta el endpoint si tu back usa otro)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await API.get('/products');
        if (Array.isArray(data)) {
          const byId = {};
          const byName = {};
          for (const p of data) {
            if (p?._id) byId[p._id] = p;
            if (p?.name) byName[p.name.toLowerCase()] = p;
          }
          setProductsById(byId);
          setProductsByName(byName);
        }
      } catch (e) {
        // No bloquea: si falla, solo no habrá imágenes mapeadas
        console.warn('No se pudo cargar el catálogo para imágenes', e?.message);
      }
    }
    fetchProducts();
  }, []);

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
      <aside className="w-full md:w-1/4 bg-white shadow p-4 space-y-6 md:sticky md:top-16 h-max">
        <h2 className="text-xl font-semibold mb-2">Mi perfil</h2>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'info' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
          >
            Información personal
          </button>
          <button
            onClick={() => setActiveTab('compras')}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'compras' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
          >
            Compras
          </button>
          <button
            onClick={() => setActiveTab('devoluciones')}
            className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'devoluciones' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
          >
            Devoluciones
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {activeTab === 'info' ? 'Información personal' :
           activeTab === 'devoluciones' ? 'Devoluciones' : 'Compras'}
        </h1>

        {/* Placeholders simples en otras pestañas */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg p-4 shadow text-gray-600">
            (Aquí puedes mostrar/editar tus datos personales)
          </div>
        )}

        {activeTab === 'devoluciones' && (
          <div className="bg-white rounded-lg p-4 shadow">
            <MisDevoluciones />
          </div>
        )}

        {activeTab === 'compras' && (
          <>
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
                    className="bg-white rounded-lg p-4 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        Compra #{String(p._id).slice(-6)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}
                      </div>
                    </div>

                    {/* Items (resumen) */}
                    <div className="mt-3 divide-y">
                      {(p.items || []).map((it, idx) => (
                        <div
                          key={idx}
                          className="py-2 flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{it.name}</div>
                            <div className="text-gray-500 text-sm">
                              Cantidad: {it.quantity}
                            </div>
                          </div>
                          <div className="font-semibold">
                            {money(Number(it.price) * Number(it.quantity))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-3 text-right font-semibold">
                      Total: {money(p.total)}
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openDetail(p)}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        Ver compra
                      </button>
                      <button
                        onClick={() => openReturn(p)}
                        className="w-full bg-blue-100 text-blue-600 py-2 rounded hover:bg-blue-200"
                      >
                        Hacer Devolución
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL de detalle con imágenes desde MongoDB + "Completado" + Desglose */}
      <PurchaseDetailModal
        open={showDetail}
        onClose={closeDetail}
        purchase={selectedPurchase}
        productsById={productsById}
        productsByName={productsByName}
        currentUserName={currentUserName}
      />

      {/* Modal para solicitar devolución */}
      <ReturnRequestModal
        open={showReturnModal}
        onClose={(res) => {
          // close modal y si la creación fue exitosa, refrescar compras
          closeReturn();
          if (res?.ok) {
            // refetch compras para reflejar la nueva devolución
            fetchPurchases();
            // opcional: mostrar mensaje / toast (aquí solo console)
            console.log('Devolución solicitada con éxito');
          }
        }}
        purchase={selectedForReturn}
      />
    </div>
  );
}