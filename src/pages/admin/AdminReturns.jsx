// src/pages/admin/AdminReturns.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

const fmtMoney = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

const STATUS_LABEL = {
  processing: 'EN PROCESO',
  approved: 'ACEPTADO',
  rejected: 'RECHAZADO',
  completed: 'COMPLETADO',
  canceled: 'CANCELADO'
};

export default function AdminReturns() {
  const authUser = JSON.parse(localStorage.getItem('user') || 'null');
  const auth = authUser?.token ? { headers: { Authorization: `Bearer ${authUser.token}` } } : {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgById, setMsgById] = useState({});
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const r = await API.get('/returns', auth);
      setRows(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'No se pudo listar devoluciones.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const setStatus = async (id, status) => {
    try {
      // si la RMA actual está cancelada, el backend rechazará; aquí optimizamos deshabilitando botones
      const target = rows.find(x => x._id === id);
      if (target && target.status === 'canceled') {
        return alert('Esta solicitud fue cancelada por el cliente y no puede ser modificada.');
      }

      await API.patch(`/returns/${id}/status`, { status }, auth);
      // refrescar lista
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const sendMessage = async (id) => {
    const message = (msgById[id] || '').trim();
    if (!message) return alert('Escribe un mensaje antes de enviar.');
    try {
      await API.post(`/returns/${id}/message`, { message }, auth);
      setMsgById(prev => ({ ...prev, [id]: '' }));
      alert('Mensaje enviado');
    } catch (e) {
      alert(e?.response?.data?.message || 'Error enviando mensaje');
    }
  };

  if (loading) return <div className="p-4">Cargando…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-2xl font-semibold">Devoluciones</h1>
      {rows.map(r => {
        const borderClass = r.status === 'approved' ? 'border-green-300' :
                            r.status === 'rejected' ? 'border-red-300' :
                            r.status === 'canceled' ? 'border-gray-300 opacity-80' : 'border-gray-200';

        const isCanceled = r.status === 'canceled';

        return (
          <div key={r._id} className={`border rounded p-3 bg-white ${borderClass}`}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <div className="font-medium">{r.code || r._id}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Cliente: {r.user?.name} ({r.user?.email}) • Estimado: {fmtMoney(r.total || 0)} • Estado: <b>{STATUS_LABEL[r.status] || r.status}</b>
                </div>

                <div className="mt-3 text-sm">
                  {(r.items || []).map((it, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="text-sm">{it.productName || (it.product && it.product.name) || 'Producto'}</div>
                      <div className="text-xs text-gray-500">• {it.quantity} x {fmtMoney(it.unitPrice)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* resumen derecho */}
              <div className="text-sm text-right ml-4">
                {(r.items || []).map((it, i) => (
                  <div key={i}>{it.quantity} x {fmtMoney(it.unitPrice)}</div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* ADMIN: solo 3 botones permitidos; deshabilitados si la RMA está cancelada */}
              {['processing','approved','rejected'].map(s => (
                <button
                  key={s}
                  disabled={isCanceled}
                  className={`px-3 py-1 border rounded ${r.status === s ? 'bg-gray-100' : ''} ${isCanceled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => setStatus(r._id, s)}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Mensaje para el cliente…"
                value={msgById[r._id] || ''}
                onChange={(e) => setMsgById(prev => ({ ...prev, [r._id]: e.target.value }))}
                disabled={false}
              />
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => sendMessage(r._id)}>
                Enviar correo
              </button>
            </div>
          </div>
        );
      })}
      {rows.length === 0 && <div className="text-gray-600">Sin solicitudes.</div>}
    </div>
  );
}