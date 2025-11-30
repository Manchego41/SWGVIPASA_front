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

  // purchases
  const [purchases, setPurchases]   = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // perfil local
  const [profile, setProfile]       = useState(null);
  const [editing, setEditing]       = useState(false);
  const [form, setForm]             = useState({
    firstName:'', lastName:'', document:'', gender:'', phone:'', birthDate:'', address:'', city:'', zip:'', notes:''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Sidebar active
  const [activeTab, setActiveTab] = useState('compras');

  // detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedForReturn, setSelectedForReturn] = useState(null);

  // fetch purchases
  const fetchPurchases = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get('/purchases/mine', { headers: { Authorization: `Bearer ${token}` }});
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargar compras', err);
      setError(err?.response?.data?.message || 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPurchases();
  }, [token, fetchPurchases]);

  // fetch profile
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingProfile(true);
      setProfileError('');
      const { data } = await API.get('/profile/me', { headers: { Authorization: `Bearer ${token}` }});
      if (data) {
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          document: data.document || '',
          gender: data.gender || '',
          phone: data.phone || '',
          birthDate: data.birthDate ? new Date(data.birthDate).toISOString().slice(0,10) : '',
          address: data.address || '',
          city: data.city || '',
          zip: data.zip || '',
          notes: data.notes || ''
        });
      } else {
        // si backend devuelve null (no existe perfil aún)
        setProfile(null);
        setForm({
          firstName:'', lastName:'', document:'', gender:'', phone:'', birthDate:'', address:'', city:'', zip:'', notes:''
        });
      }
    } catch (e) {
      console.warn('fetchProfile', e);
      setProfileError(e?.response?.data?.message || 'No se pudo cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProfile();
  }, [token, fetchProfile]);

  // open detail
  const openDetail = (p) => { setSelectedPurchase(p); setShowDetail(true); };
  const closeDetail = () => { setSelectedPurchase(null); setShowDetail(false); };

  // open return modal (only if allowed)
  const openReturn = (p) => {
    setSelectedForReturn(p);
    setShowReturnModal(true);
  };
  const closeReturn = () => { setSelectedForReturn(null); setShowReturnModal(false); };

  // filtered purchases
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter(p =>
      (p.items || []).some(it => String(it.name || '').toLowerCase().includes(q))
    );
  }, [purchases, search]);

  // edit handlers
  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setEditing(false);
    // reset form to profile
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        document: profile.document || '',
        gender: profile.gender || '',
        phone: profile.phone || '',
        birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().slice(0,10) : '',
        address: profile.address || '',
        city: profile.city || '',
        zip: profile.zip || '',
        notes: profile.notes || ''
      });
    } else {
      setForm({ firstName:'', lastName:'', document:'', gender:'', phone:'', birthDate:'', address:'', city:'', zip:'', notes:'' });
    }
  };

  const saveProfile = async () => {
    if (!token) return;
    setSavingProfile(true);
    try {
      const payload = { ...form };
      const { data } = await API.patch('/profile/me', payload, { headers: { Authorization: `Bearer ${token}` }});
      // backend devuelve el perfil actualizado
      setProfile(data || null);
      setEditing(false);

      // actualizar localStorage.name si cambió first/last name para que el header muestre el nuevo nombre
      try {
        const cur = JSON.parse(localStorage.getItem('user') || 'null') || {};
        const newName = `${(data?.firstName || '').trim()} ${(data?.lastName || '').trim()}`.trim();
        if (newName) {
          cur.name = newName;
          localStorage.setItem('user', JSON.stringify(cur));
        }
      } catch(e) {
        // no bloquear si fallo localStorage
        console.warn('no se pudo actualizar localStorage', e);
      }

      // refrescar compras por si se necesita (opcional) — no interfiere si no se desea
      // await fetchPurchases();

      alert('Perfil guardado');
    } catch (e) {
      console.error('saveProfile', e);
      alert(e?.response?.data?.message || 'No se pudo guardar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  // helper to detect if purchase was paid in efectivo
  const purchaseIsCash = (p) => {
    const m = (p.method || (p.payment && p.payment.method) || '').toString().toLowerCase();
    return m === 'efectivo' || m === 'cash';
  };

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

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {activeTab === 'info' ? 'Información personal' :
           activeTab === 'devoluciones' ? 'Devoluciones' : 'Compras'}
        </h1>

        {activeTab === 'info' && (
          <div className="bg-white rounded-lg p-6 shadow">
            {loadingProfile ? (
              <div className="text-gray-600">Cargando perfil…</div>
            ) : profileError ? (
              <div className="text-red-600">{profileError}</div>
            ) : !editing ? (
              <div className="flex items-start gap-6">
                {/* Avatar + saludo */}
                <div className="w-44 flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto" />
                  <div className="text-center mt-3 font-medium">{(profile?.firstName || profile?.lastName) ? `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() : (currentUserName || 'Usuario')}</div>
                </div>

                {/* Datos */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">Datos personales</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Nombre</div>
                      <div className="font-medium">{profile?.firstName || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Apellido</div>
                      <div className="font-medium">{profile?.lastName || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{stored?.email || stored?.user?.email || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Documento</div>
                      <div className="font-medium">{profile?.document || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Género</div>
                      <div className="font-medium">{profile?.gender || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Teléfono</div>
                      <div className="font-medium">{profile?.phone || '-'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500">Dirección</div>
                      <div className="font-medium">{profile?.address || '-'}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={startEdit} className="px-4 py-2 bg-indigo-600 text-white rounded">Editar datos</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Editar datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Nombre</label>
                    <input value={form.firstName} onChange={e => setForm(s => ({...s, firstName: e.target.value}))}
                      className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Apellido</label>
                    <input value={form.lastName} onChange={e => setForm(s => ({...s, lastName: e.target.value}))}
                      className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Documento</label>
                    <input value={form.document} onChange={e => setForm(s => ({...s, document: e.target.value}))}
                      className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Teléfono</label>
                    <input value={form.phone} onChange={e => setForm(s => ({...s, phone: e.target.value}))}
                      className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Género</label>
                    <select value={form.gender} onChange={e => setForm(s => ({...s, gender: e.target.value}))} className="w-full border p-2 rounded">
                      <option value="">Selecciona</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Fecha de nacimiento</label>
                    <input type="date" value={form.birthDate} onChange={e => setForm(s => ({...s, birthDate: e.target.value}))} className="w-full border p-2 rounded" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600">Dirección</label>
                    <input value={form.address} onChange={e => setForm(s => ({...s, address: e.target.value}))} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Ciudad</label>
                    <input value={form.city} onChange={e => setForm(s => ({...s, city: e.target.value}))} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Código postal</label>
                    <input value={form.zip} onChange={e => setForm(s => ({...s, zip: e.target.value}))} className="w-full border p-2 rounded" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600">Notas</label>
                    <textarea value={form.notes} onChange={e => setForm(s => ({...s, notes: e.target.value}))} className="w-full border p-2 rounded" rows={3} />
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button disabled={savingProfile} onClick={saveProfile} className="px-4 py-2 bg-green-600 text-white rounded">
                    {savingProfile ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 border rounded">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'devoluciones' && (
          <div className="bg-white rounded-lg p-4 shadow">
            <MisDevoluciones />
          </div>
        )}

        {activeTab === 'compras' && (
          <>
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500">No hay compras que mostrar.</p>
            ) : (
              <div className="space-y-6">
                {filtered.map(p => {
                  const method = (p.method || (p.payment && p.payment.method) || '').toString().toLowerCase();
                  const isCash = method === 'efectivo' || method === 'cash';
                  return (
                    <div key={p._id} className="bg-white rounded-lg p-4 shadow">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Compra #{String(p._id).slice(-6)}</div>
                        <div className="text-gray-500 text-sm">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
                      </div>

                      <div className="mt-3 divide-y">
                        {(p.items || []).map((it, idx) => (
                          <div key={idx} className="py-2 flex justify-between items-center">
                            <div className="flex-1">
                              <div className="font-medium">{it.name}</div>
                              <div className="text-gray-500 text-sm">Cantidad: {it.quantity}</div>
                            </div>
                            <div className="font-semibold">{money(Number(it.price) * Number(it.quantity))}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600">Método de pago: <span className="font-medium">{method || '—'}</span></div>
                        <div className="text-right font-semibold">Total: {money(p.total)}</div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button onClick={() => openDetail(p)} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Ver compra</button>
                        <button
                          onClick={() => openReturn(p)}
                          disabled={isCash}
                          className={`w-full py-2 rounded ${isCash ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          title={isCash ? 'No puede hacer devolución de compras pagadas en efectivo' : 'Hacer devolución'}
                        >
                          Hacer Devolución
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* modals */}
      <PurchaseDetailModal
        open={showDetail}
        onClose={closeDetail}
        purchase={selectedPurchase}
        productsById={{}}
        productsByName={{}}
        currentUserName={currentUserName}
      />

      <ReturnRequestModal
        open={showReturnModal}
        onClose={(res) => {
          closeReturn();
          if (res?.ok) {
            fetchPurchases();
            alert('Devolución solicitada con éxito');
          }
        }}
        purchase={selectedForReturn}
      />
    </div>
  );
}