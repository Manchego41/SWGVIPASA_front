// src/components/ReturnRequestModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import API from "../utils/api";
import { FiX } from "react-icons/fi";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

// Normaliza distintos formatos de item de purchase
function normalizeItem(it) {
  // purchase item _id (subdocument id dentro de la compra)
  const purchaseItemId = it._id || it.itemId || it.purchaseItemId || null;

  // product id si el item referencia product
  const productId =
    it.productId ||
    it.product ||
    (it.product && it.product._id) ||
    null;

  const productName =
    it.name ||
    (it.product && it.product.name) ||
    it.title ||
    "Producto";

  const unitPrice = Number(it.price ?? it.unitPrice ?? (it.product && it.product.price) ?? 0);
  const maxQty = Number(it.quantity ?? it.qty ?? it.count ?? 0);

  return { purchaseItemId, productId, productName, unitPrice, maxQty };
}

export default function ReturnRequestModal({ open, onClose, purchase }) {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const [items, setItems] = useState([]); // { purchaseItemId, productId, productName, unitPrice, maxQty, selected, qty }
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Inicializa estado cuando cambia purchase/open
  useEffect(() => {
    if (!open || !purchase) return;
    const arr = (purchase.items || []).map((it) => {
      const base = normalizeItem(it);
      return { ...base, selected: false, qty: 0 };
    });
    setItems(arr);
    setReason("");
    setError("");
  }, [open, purchase]);

  const estimated = useMemo(
    () =>
      items.reduce(
        (acc, it) => (it.selected ? acc + Number(it.qty || 0) * Number(it.unitPrice || 0) : acc),
        0
      ),
    [items]
  );

  const toggleItem = (idx) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? {
              ...it,
              selected: !it.selected,
              qty: !it.selected && it.qty === 0 ? 1 : it.qty,
            }
          : it
      )
    );
  };

  const changeQty = (idx, val) => {
    let n = Number(val || 0);
    if (Number.isNaN(n)) n = 0;
    if (n < 0) n = 0;
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, qty: Math.min(n, it.maxQty) } : it
      )
    );
  };

  const submit = async () => {
    setError("");
    // Enviamos líneas con purchaseItemId (si existe), productId y productName por compatibilidad
    const chosen = items
      .filter((it) => it.selected && Number(it.qty) > 0)
      .map((it) => ({
        purchaseItemId: it.purchaseItemId || null,
        productId: it.productId || null,
        productName: it.productName || '',
        quantity: Number(it.qty || 0),
        unitPrice: Number(it.unitPrice || 0),
      }));

    if (chosen.length === 0) {
      setError("Selecciona al menos un producto y una cantidad mayor a 0.");
      return;
    }
    if (!reason.trim()) {
      setError("Indica el motivo de la devolución.");
      return;
    }

    const payload = {
      purchaseId: purchase?._id || purchase?.id,
      items: chosen,
      reason: reason.trim(),
    };

    // Debug rapido: ver estructura en consola
    // Retirar o comentar cuando ya verifiques que funciona.
    console.log("RETURN payload:", JSON.stringify(payload, null, 2));

    try {
      setSubmitting(true);
      await API.post("/returns", payload, auth);
      // cierra y notifica éxito al padre
      onClose?.({ ok: true });
    } catch (e) {
      console.error("Return submit error:", e?.response?.data || e);
      setError(
        e?.response?.data?.message ||
          "No se pudo registrar la solicitud de devolución."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Solicitar Devolución
          </h3>
          <button
            onClick={() => onClose?.()}
            className="p-2 rounded hover:bg-slate-100"
            title="Cerrar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          {/* Items */}
          {(items || []).map((it, idx) => (
            <div
              key={`${it.purchaseItemId || it.productId || it.productName}-${idx}`}
              className="border rounded-xl px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1.5 h-4 w-4 accent-blue-600"
                  checked={it.selected}
                  onChange={() => toggleItem(idx)}
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800">
                    {it.productName}
                  </div>
                  <div className="text-sm text-slate-600">
                    Cantidad comprada: {it.maxQty} • Precio unitario:{" "}
                    {money(it.unitPrice)}
                  </div>
                </div>
                <div className="w-36">
                  <label className="text-xs text-slate-500 block mb-1">
                    Cantidad a devolver:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={it.maxQty}
                    value={it.qty}
                    disabled={!it.selected}
                    onChange={(e) => changeQty(idx, e.target.value)}
                    className={`w-full border rounded-lg px-2 py-1.5 text-right ${
                      it.selected
                        ? "bg-white border-slate-300"
                        : "bg-slate-100 border-slate-200 cursor-not-allowed"
                    }`}
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Máximo: {it.maxQty}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Motivo de la devolución <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo…"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Estimado */}
          <div className="text-sm text-slate-700">
            Estimado: <span className="font-semibold">{money(estimated)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            onClick={() => onClose?.()}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Enviando…" : "Solicitar Devolución"}
          </button>
        </div>
      </div>
    </div>
  );
}