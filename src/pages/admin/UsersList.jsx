// src/pages/admin/UsersList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import API from '../../utils/api';

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
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data);
        setError('');
      } catch (e) {
        console.error('UsersList fetch error:', e?.response || e);
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          'No se pudo cargar la lista';
        const detail = e?.response?.data?.detail;
        setError(detail ? `${msg} (${detail})` : msg);
      } finally {
        setLoad(false);
      }
    })();
  }, [token]);

  const filtered = useMemo(() => {
    let list = rows;
    if (onlyWithPurchases) {
      list = list.filter(u => (u.purchasesCount || 0) > 0);
    }
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(u =>
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s)
    );
  }, [rows, q, onlyWithPurchases]);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios (role: cliente)</h1>

      <div className="mb-3 flex items-center gap-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por nombre o email…"
          className="w-full max-w-sm border rounded px-3 py-2"
        />
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyWithPurchases}
            onChange={e => setOnlyWithPurchases(e.target.checked)}
          />
          Solo con compras
        </label>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-4 text-gray-600">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-gray-600">Sin resultados.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Compras</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-sm">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">{u.purchasesCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}