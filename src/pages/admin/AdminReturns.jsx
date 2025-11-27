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
      await API.patch(`/returns/${id}/status`, { status }, auth);
      // refrescar lista
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al cambiar estado');
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
                            r.status === 'canceled' ? 'border-gray-300' : 'border-gray-200';

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

                {/* Mostrar motivo de devolución (mensaje del cliente) */}
                <div className="mt-3">
                  <div className="text-sm font-medium">Motivo del cliente</div>
                  <div className="text-sm text-gray-700 mt-1">{r.reason || '—'}</div>
                </div>

                {/* Mostrar notas internas del admin si existen */}
                {Array.isArray(r.adminNote) && r.adminNote.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium">Notas internas</div>
                    <div className="text-sm text-gray-700 mt-1">
                      {r.adminNote.map((n, idx) => (
                        <div key={idx} className="mb-1">
                          <div className="text-xs text-gray-500">{new Date(n.at).toLocaleString()}</div>
                          <div>{n.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* resumen derecho */}
              <div className="text-sm text-right ml-4">
                {(r.items || []).map((it, i) => (
                  <div key={i}>{it.quantity} x {fmtMoney(it.unitPrice)}</div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* ADMIN: solo 3 botones permitidos. Si está cancelado no permitir cambios. */}
              {['processing','approved','rejected'].map(s => (
                <button
                  key={s}
                  className={`px-3 py-1 border rounded ${r.status === s ? 'bg-gray-100' : ''} ${r.status === 'canceled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => r.status !== 'canceled' && setStatus(r._id, s)}
                  disabled={r.status === 'canceled'}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

          </div>
        );
      })}
      {rows.length === 0 && <div className="text-gray-600">Sin solicitudes.</div>}
    </div>
  );
}