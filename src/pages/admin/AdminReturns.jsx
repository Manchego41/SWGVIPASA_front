// src/pages/admin/AdminReturns.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function AdminReturns() {
  const authUser = JSON.parse(localStorage.getItem('user') || 'null');
  const auth = authUser?.token ? { headers: { Authorization: `Bearer ${authUser.token}` } } : {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const r = await API.get('/returns', auth);
      setRows(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'No se pudo listar');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const setStatus = async (id, status) => {
    try {
      await API.patch(`/returns/${id}/status`, { status }, auth);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Error actualizando estado');
    }
  };

  const sendMessage = async (id) => {
    if (!msg.trim()) return;
    try {
      await API.post(`/returns/${id}/message`, { message: msg.trim() }, auth);
      setMsg('');
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
      {rows.map(r => (
        <div key={r._id} className="border rounded p-3 bg-white">
          <div className="font-medium">{r.code || r._id}</div>
          <div className="text-sm text-gray-600">
            Cliente: {r.user?.name} ({r.user?.email}) • Estimado: S/ {Number(r.total||0).toFixed(2)} • Estado: <b>{r.status}</b>
          </div>

          <div className="mt-2">
            {(r.items || []).map((it, i) => {
              const prodName = it.product?.name || it.productName || 'Producto';
              const price = Number(it.unitPrice ?? it.product?.price ?? 0);
              return (
                <div key={i} className="flex justify-between items-center text-sm py-1 border-b last:border-b-0">
                  <div>{prodName}</div>
                  <div className="text-right">
                    {it.quantity} x S/ {price.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {['processing','approved','rejected','completed','canceled'].map(s => (
              <button key={s} className="px-3 py-1 border rounded" onClick={() => setStatus(r._id, s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Mensaje para el cliente…"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => sendMessage(r._id)}>
              Enviar correo
            </button>
          </div>
        </div>
      ))}
      {rows.length === 0 && <div className="text-gray-600">Sin solicitudes.</div>}
    </div>
  );
}