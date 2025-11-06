// src/pages/admin/UsersList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import API from '../../utils/api';
import { FiSearch } from 'react-icons/fi';

export default function UsersList() {
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const token  = stored?.token;

  const [rows, setRows]     = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState('');
  const [q, setQ]           = useState('');
  const [onlyWithPurchases, setOnlyWithPurchases] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoad(true);
        const res = await API.get('/users/clients-with-count', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data);
        setError('');
      } catch (e) {
        console.error('UsersList fetch error:', e?.response || e);
        const msg = e?.response?.data?.message || e?.message || 'No se pudo cargar la lista';
        setError(msg);
      } finally {
        setLoad(false);
      }
    })();
  }, [token]);

  const filtered = useMemo(() => {
    let list = rows;
    if (onlyWithPurchases) list = list.filter(u => (u.purchasesCount || 0) > 0);
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(u =>
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s)
    );
  }, [rows, q, onlyWithPurchases]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Usuarios (role: cliente)</h1>

      <div className="bg-white rounded-2xl shadow border p-4 mb-2 flex items-center gap-4">
        <div className="relative w-full max-w-lg">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full h-10 pl-9 pr-3 border rounded-xl"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyWithPurchases}
            onChange={e => setOnlyWithPurchases(e.target.checked)}
          />
          Solo con compras
        </label>
      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {loading ? (
          <div className="p-4 text-slate-600">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-slate-600">Sin resultados.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Compras</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs">
                      {u.role || 'cliente'}
                    </span>
                  </td>
                  <td className="p-3">{u.purchasesCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}