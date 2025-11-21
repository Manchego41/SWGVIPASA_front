// src/pages/Profile/MisDevoluciones.jsx
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import ReturnDetailModal from "../../components/ReturnDetailModal";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const STATUS_LABEL = { processing: 'EN PROCESO', approved: 'ACEPTADO', rejected: 'RECHAZADO', canceled: 'CANCELADO' };

export default function MisDevoluciones() {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/returns/mine", auth);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudieron cargar devoluciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar esta solicitud de devolución? Esta acción no se puede deshacer.')) return;
    try {
      await API.patch(`/returns/${id}/cancel`, {}, auth);
      await load();
      alert('Devolución cancelada.');
    } catch (e) {
      alert(e?.response?.data?.message || 'No se pudo cancelar la devolución.');
    }
  };

  if (loading) return <div className="text-gray-600">Cargando devoluciones…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (rows.length === 0) return <p className="text-gray-500 text-center">No tienes devoluciones registradas.</p>;

  return (
    <div className="space-y-6">
      {rows.map((r) => {
        const borderClass = r.status === 'approved' ? 'border-green-300' :
                            r.status === 'rejected' ? 'border-red-300' : 'border-gray-200';
        return (
          <div key={r._id} className={`bg-white rounded-lg shadow p-4 border ${borderClass}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{r.code || `RMA-${String(r._id).slice(-6)}`}</div>
                <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-500">{STATUS_LABEL[r.status] || r.status}</div>
            </div>

            <div className="text-sm text-gray-600 mt-1">
              Estimado: {money(r.total)}
            </div>

            <div className="mt-3 space-y-2">
              {(r.items || []).map((it, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <div>
                    <div className="font-medium">{it.product?.name || it.productName}</div>
                    <div className="text-sm text-gray-500">{it.quantity} × {money(it.unitPrice)}</div>
                  </div>
                  <div className="font-semibold">{money(it.quantity * it.unitPrice)}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Motivo: {r.reason}
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => { setSelected(r); setShowDetail(true); }}
                >
                  Ver detalle
                </button>
              </div>
              <div>
                {r.status === 'processing' && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleCancel(r._id)}
                  >
                    Cancelar Devolución
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <ReturnDetailModal
        open={showDetail}
        onClose={() => { setShowDetail(false); setSelected(null); load(); }}
        rma={selected}
      />
    </div>
  );
}