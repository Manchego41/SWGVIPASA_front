// src/components/ReturnDetailModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";
import API from "../utils/api";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function ReturnDetailModal({ open, onClose, rma }) {
  if (!open || !rma) return null;

  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const handleCancel = async () => {
    if (!window.confirm('¿Cancelar esta solicitud de devolución?')) return;
    try {
      await API.patch(`/returns/${rma._id}/cancel`, {}, auth);
      alert('Devolución cancelada.');
      // cerrar y permitir al padre recargar (si implementa onClose para reload)
      onClose?.({ canceled: true });
    } catch (e) {
      alert(e?.response?.data?.message || 'No se pudo cancelar la devolución.');
    }
  };

  const borderClass = rma.status === 'approved' ? 'border-green-300' :
                      rma.status === 'rejected' ? 'border-red-300' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl border ${borderClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Devolución {rma.code || rma._id}
          </h3>
          <button onClick={() => onClose?.()} className="p-2 rounded hover:bg-slate-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          <div className="text-sm text-gray-600">
            Estado: <b>{rma.status}</b> • Fecha: {new Date(rma.createdAt).toLocaleString()}
          </div>

          <div>
            <div className="font-medium mb-2">Productos</div>
            <div className="space-y-2">
              {(rma.items || []).map((it, idx) => {
                const name = it.product?.name || it.productName || "Producto";
                const price = Number(it.unitPrice || it.product?.price || 0);
                return (
                  <div key={idx} className="flex justify-between items-center border rounded p-3">
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-gray-500">Cantidad: {it.quantity} • Precio unitario: {money(price)}</div>
                    </div>
                    <div className="font-semibold">{money(price * it.quantity)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-medium">Motivo</div>
            <div className="text-sm text-gray-700">{rma.reason}</div>
          </div>

          <div className="text-right font-semibold">
            Estimado total: {money(rma.total)}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex justify-between gap-3">
          <div>
            {rma.status === 'processing' && (
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white" onClick={handleCancel}>
                Cancelar Devolución
              </button>
            )}
          </div>
          <div>
            <button className="px-4 py-2 rounded-lg border" onClick={() => onClose?.()}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}