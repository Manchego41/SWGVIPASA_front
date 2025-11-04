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
      <h1 className="text-3xl font-extrabold text-slate-900">Usuarios (role: cliente)</h1>

    <div className="mb-4 flex items-center gap-4">
  {/* === Buscador estilo pill con ícono === */}
  <div className="relative w-full max-w-md">
    {/* ícono */}
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
      <svg
        className="h-5 w-5 text-white/85"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>

    {/* input */}
    <input
      value={q}
      onChange={e => setQ(e.target.value)}
      placeholder="Busqueda...."
      className="
        w-full pl-11 pr-4 py-2.5 rounded-full
        text-white placeholder-white/70
        bg-gradient-to-b from-[#0F1A3A]/95 to-[#0B1327]/95
        border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
        focus:outline-none focus:ring-2 focus:ring-blue-400/40

      "
    />
  </div>

  {/* checkbox permanece igual, solo leve ajuste de color para el fondo actual */}
  <label className="inline-flex items-center gap-2 text-sm text-slate-900">
    <input
      type="checkbox"
      checked={onlyWithPurchases}
      onChange={e => setOnlyWithPurchases(e.target.checked)}
      className="h-4 w-4 accent-blue-600"
    />
    Solo con compras
  </label>
</div>

{/* Contenedor con borde, sombra y esquinas redondeadas */}
    <div className="overflow-x-auto rounded-2xl shadow-sm border border-slate-200/80 bg-white/90">
      {loading ? (
        <div className="p-4 text-gray-600">Cargando…</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-gray-600">Sin resultados.</div>
      ) : (
        <table className="min-w-full text-left">
          <thead className="text-white">
  <tr className="bg-gradient-to-b from-[#0F1A3A] to-[#0B1327]">
    <th className="px-4 py-3 font-semibold tracking-wide rounded-l-xl">Nombre</th>
    <th className="px-4 py-3 font-semibold tracking-wide">Email</th>
    <th className="px-4 py-3 font-semibold tracking-wide">Rol</th>
    <th className="px-4 py-3 font-semibold tracking-wide rounded-r-xl">Compras</th>
  </tr>
</thead>


          <tbody className="text-slate-900">
            {filtered.map((u) => (
              <tr
                key={u._id}
                className="
                  odd:bg-white even:bg-slate-50
                  border-t border-slate-200/80
                  hover:bg-white transition
                "
              >
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