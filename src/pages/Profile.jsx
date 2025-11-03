// src/pages/Profile.jsx
import React, { useState, useEffect, useMemo } from 'react';
import API from '../utils/api';
import PurchaseDetailModal from '../components/PurchaseDetailModal';

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

  // Catálogo para imágenes (Mongo -> imageUrl)
  const [productsById, setProductsById] = useState({});
  const [productsByName, setProductsByName] = useState({});

  const openDetail  = (p) => { setSelectedPurchase(p); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setSelectedPurchase(null); };

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
          <ReturnsSection
            token={token}
            purchases={purchases}
            openPurchaseDetail={openDetail}
            productsById={productsById}
            productsByName={productsByName}
          />
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
                        onClick={() => setActiveTab('devoluciones')}
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
    </div>
  );
}

/* =========================================================
   Sección de Devoluciones (UI + lógica)
   Endpoints asumidos (ajusta según tu back):
   - GET  /returns/mine               -> lista de devoluciones del usuario
   - POST /returns                    -> crear solicitud (FormData si hay imágenes)
   - PATCH /returns/:id/cancel        -> cancelar (opcional)
   Estados ejemplo: pending | approved | rejected | picked_up | refunded
   Campos ejemplo de retorno: {
     _id, createdAt, status, reason, details, quantity, images: [url],
     purchaseId, item: { name, productId }, history: [{status,date,note}]
   }
========================================================= */
function ReturnsSection({ token, purchases, openPurchaseDetail }) {
  // list & loading
  const [returns, setReturns] = useState([]);
  const [retLoading, setRetLoading] = useState(true);
  const [retError, setRetError] = useState('');

  // form
  const [selPurchaseId, setSelPurchaseId] = useState('');
  const [selItemIndex, setSelItemIndex]   = useState('');
  const [qty, setQty]                     = useState(1);
  const [reason, setReason]               = useState('');
  const [details, setDetails]             = useState('');
  const [files, setFiles]                 = useState([]);
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState('');

  const selectedPurchase = useMemo(
    () => purchases.find(p => String(p._id) === String(selPurchaseId)),
    [purchases, selPurchaseId]
  );

  const itemsOfSelected = selectedPurchase?.items || [];
  const selectedItem = useMemo(
    () => (selItemIndex !== '' ? itemsOfSelected[Number(selItemIndex)] : null),
    [itemsOfSelected, selItemIndex]
  );

  useEffect(() => {
    async function fetchReturns() {
      try {
        setRetLoading(true);
        const { data } = await API.get('/returns/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReturns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar devoluciones', err);
        const msg = err?.response?.data?.message || 'No se pudo cargar devoluciones';
        setRetError(msg);
      } finally {
        setRetLoading(false);
      }
    }
    if (token) fetchReturns();
  }, [token]);

  // helpers
  const resetForm = () => {
    setSelPurchaseId('');
    setSelItemIndex('');
    setQty(1);
    setReason('');
    setDetails('');
    setFiles([]);
  };

  const canSubmit =
    selPurchaseId &&
    selItemIndex !== '' &&
    qty > 0 &&
    qty <= (selectedItem?.quantity || 0) &&
    reason.trim().length >= 3 &&
    !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      // Construimos FormData para permitir imágenes opcionales
      const fd = new FormData();
      fd.append('purchaseId', selPurchaseId);
      fd.append('itemIndex', String(selItemIndex)); // o envía productId si prefieres
      fd.append('quantity', String(qty));
      fd.append('reason', reason);
      fd.append('details', details);

      // hasta 3 imágenes
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        fd.append('images', files[i]);
      }

      const { data } = await API.post('/returns', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refrescar listado local
      setReturns(prev => [data, ...prev]);
      resetForm();
      setToast('Solicitud de devolución creada correctamente.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Error al crear devolución', err);
      const msg = err?.response?.data?.message || 'No se pudo crear la devolución';
      setToast(msg);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelReturn(id) {
    try {
      await API.patch(`/returns/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReturns(prev =>
        prev.map(r => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      console.error('No se pudo cancelar', err);
      setToast('No se pudo cancelar la solicitud.');
      setTimeout(() => setToast(''), 3000);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      {/* (Aquí irá el flujo de devoluciones) —> Reemplazado por UI */}
      {/* Crear nueva solicitud */}
      <h2 className="text-lg font-semibold">Solicitar devolución</h2>
      <p className="text-sm text-gray-500 mb-4">
        Selecciona la compra y el producto a devolver. Adjunta fotos si aplica.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compra */}
        <div>
          <label className="block text-sm font-medium mb-1">Compra</label>
          <select
            value={selPurchaseId}
            onChange={e => { setSelPurchaseId(e.target.value); setSelItemIndex(''); setQty(1); }}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">— Selecciona una compra —</option>
            {purchases.map(p => (
              <option key={p._id} value={p._id}>
                #{String(p._id).slice(-6)} — {new Date(p.createdAt).toLocaleDateString()} — {money(p.total)}
              </option>
            ))}
          </select>
          {selectedPurchase && (
            <button
              type="button"
              onClick={() => openPurchaseDetail(selectedPurchase)}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              Ver detalle de la compra
            </button>
          )}
        </div>

        {/* Item */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Producto</label>
            <select
              value={selItemIndex}
              onChange={e => { setSelItemIndex(e.target.value); setQty(1); }}
              disabled={!selectedPurchase}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">— Selecciona un producto —</option>
              {(itemsOfSelected || []).map((it, idx) => (
                <option key={idx} value={idx}>
                  {it.name} — cant. comprada: {it.quantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              max={selectedItem?.quantity || 1}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              disabled={!selectedItem}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Motivo */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Motivo</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">— Selecciona un motivo —</option>
              <option value="defectuoso">Producto defectuoso</option>
              <option value="incompleto">Pedido incompleto</option>
              <option value="equivocado">Producto equivocado</option>
              <option value="no_satisfecho">No satisface expectativas</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fotos (opcional, hasta 3)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Detalles (opcional)</label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Describe el problema…"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-4 py-2 rounded text-white ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {submitting ? 'Enviando…' : 'Crear solicitud'}
          </button>
          {toast && <span className="text-sm text-gray-700">{toast}</span>}
        </div>
      </form>

      {/* Listado de mis devoluciones */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Mis devoluciones</h3>

        {retLoading ? (
          <div className="text-gray-600 mt-3">Cargando…</div>
        ) : retError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 mt-3">{retError}</div>
        ) : returns.length === 0 ? (
          <p className="text-gray-500 mt-3">Aún no tienes solicitudes de devolución.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {returns.map((r) => (
              <div key={r._id} className="border rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">
                    Devolución #{String(r._id).slice(-6)}
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <div><span className="font-medium">Fecha:</span> {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</div>
                  <div><span className="font-medium">Compra:</span> #{String(r.purchaseId || '').slice(-6)}</div>
                  <div><span className="font-medium">Producto:</span> {r?.item?.name || '—'} — Cantidad: {r.quantity}</div>
                  {r.reason && <div><span className="font-medium">Motivo:</span> {humanizeReason(r.reason)}</div>}
                  {r.details && <div className="mt-1"><span className="font-medium">Detalles:</span> {r.details}</div>}
                </div>

                {/* mini-timeline */}
                <div className="mt-3">
                  <Timeline history={r.history} current={r.status} />
                </div>

                {/* imágenes */}
                {Array.isArray(r.images) && r.images.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {r.images.map((url, i) => (
                      <img
                        key={i}
                        alt={`evidencia-${i}`}
                        src={url}
                        className="h-16 w-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}

                {/* Acciones de la tarjeta */}
                <div className="mt-4 flex gap-3">
                  {['pending'].includes(r.status) && (
                    <button
                      onClick={() => cancelReturn(r._id)}
                      className="px-3 py-2 rounded border text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Cancelar solicitud
                    </button>
                  )}
                  {r.purchase && (
                    <button
                      onClick={() => openPurchaseDetail(r.purchase)}
                      className="px-3 py-2 rounded border text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Ver compra
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    pending:   { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    approved:  { label: 'Aprobada',   cls: 'bg-green-100 text-green-800 border-green-200' },
    rejected:  { label: 'Rechazada',  cls: 'bg-red-100 text-red-800 border-red-200' },
    picked_up: { label: 'Recogida',   cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    refunded:  { label: 'Reembolsada',cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    cancelled: { label: 'Cancelada',  cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  }[status] || { label: status, cls: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`text-xs border px-2 py-1 rounded-full ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function Timeline({ history = [], current }) {
  // Ordenamos por fecha asc y añadimos el estado actual si no está
  const steps = [
    { key: 'pending',   label: 'Pendiente' },
    { key: 'approved',  label: 'Aprobada' },
    { key: 'picked_up', label: 'Recogida' },
    { key: 'refunded',  label: 'Reembolsada' },
  ];
  const doneKeys = new Set(history.map(h => h.status));
  if (current && !doneKeys.has(current)) doneKeys.add(current);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {steps.map((s, i) => {
        const done = doneKeys.has(s.key);
        return (
          <div key={s.key} className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${done ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <span className={`ml-2 text-sm ${done ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="mx-3 h-px w-8 bg-gray-300" />}
          </div>
        );
      })}
    </div>
  );
}

function humanizeReason(r) {
  const map = {
    defectuoso: 'Producto defectuoso',
    incompleto: 'Pedido incompleto',
    equivocado: 'Producto equivocado',
    no_satisfecho: 'No satisface expectativas',
    otro: 'Otro',
  };
  return map[r] || r;
}
