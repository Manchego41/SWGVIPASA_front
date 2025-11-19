// src/pages/MisDevoluciones.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function MisDevoluciones({ user }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    API.get('/returns/mine', { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => setRows(r.data || []))
      .catch(() => setRows([]));
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Mis Devoluciones</h1>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r._id} className="border rounded p-3">
            <div className="font-medium">{r.code || r._id}</div>
            <div className="text-sm text-gray-600">
              Estado: <b>{r.status}</b> • Total: S/ {Number(r.total||0).toFixed(2)} • {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="text-gray-600">No tienes solicitudes.</div>}
      </div>
    </div>
  );
}