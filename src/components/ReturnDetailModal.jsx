// src/components/ReturnDetailModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function ReturnDetailModal({ open, onClose, rma }) {
  if (!open || !rma) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Devolución {rma.code || rma._id}
          </h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-slate-100">
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
        <div className="px-5 py-4 border-t flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}