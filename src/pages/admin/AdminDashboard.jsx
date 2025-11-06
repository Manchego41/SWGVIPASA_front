// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar,
} from 'recharts';

const fmtMoney = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

function monthRange(d = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  return {
    from: new Date(Date.UTC(y, m, 1, 0, 0, 0)).toISOString(),
    to:   new Date(Date.UTC(y, m + 1, 1, 0, 0, 0)).toISOString(),
  };
}

function sepToNowRange() {
  const now = new Date();
  const y = now.getFullYear();
  const from = new Date(Date.UTC(y, 8, 1, 0, 0, 0)); // 8 = setiembre
  const to   = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0));
  return { from: from.toISOString(), to: to.toISOString() };
}

export default function AdminDashboard() {
  const [sum, setSum] = useState({ sales: 0, purchases: 0, users: 0 });
  const [series, setSeries] = useState({ salesMonthly: [], usersMonthly: [], purchases: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // KPIs
        const { from: kFrom, to: kTo } = monthRange();
        const [summaryRes, usersCountRes] = await Promise.all([
          API.get('/reports/summary', { params: { from: kFrom, to: kTo } }).catch(() => ({ data: { sales: 0, purchases: 0, users: 0 } })),
          API.get('/reports/users/count').catch(() => ({ data: { total: 0 } })),
        ]);

        setSum({
          sales: Number(summaryRes?.data?.sales || 0),
          purchases: Number(summaryRes?.data?.purchases || 0),
          users: Number(usersCountRes?.data?.total ?? 0),
        });

        // Series (Set → ahora)
        const { from, to } = sepToNowRange();
        const [salesMonthlyRes, usersMonthlyRes] = await Promise.all([
          API.get('/reports/sales/monthly', { params: { from, to } }).catch(() => ({ data: [] })),
          API.get('/reports/users/monthly', { params: { from, to } }).catch(() => ({ data: [] })),
        ]);

        const sm = (Array.isArray(salesMonthlyRes.data) ? salesMonthlyRes.data : []).map(r => ({
          label: r.month || r.short, value: Number(r.value || 0),
        }));
        const um = (Array.isArray(usersMonthlyRes.data) ? usersMonthlyRes.data : []).map(r => ({
          label: r.month || r.short, value: Number(r.value || 0),
        }));

        setSeries({ salesMonthly: sm, usersMonthly: um, purchases: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow border">
          <div className="text-sm text-slate-500">Total ventas</div>
          <div className="text-2xl font-bold text-slate-900">{fmtMoney(sum.sales)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow border">
          <div className="text-sm text-slate-500">Total compras</div>
          <div className="text-2xl font-bold text-slate-900">{fmtMoney(sum.purchases)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow border">
          <div className="text-sm text-slate-500">Usuarios</div>
          <div className="text-2xl font-bold text-slate-900">{sum.users}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow border">
          <div className="text-sm text-slate-500 mb-2">ventas en s/ (mensual)</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series.salesMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v) => fmtMoney(v)} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Ventas" stroke="#0ea5e9" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow border">
          <div className="text-sm text-slate-500 mb-2">compras en s/</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series.purchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v) => fmtMoney(v)} />
                <Legend />
                <Bar dataKey="value" name="Compras" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow border lg:col-span-2">
          <div className="text-sm text-slate-500 mb-2">altas de usuarios (mensual)</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series.usersMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Usuarios" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500">Cargando…</div>}
    </div>
  );
}