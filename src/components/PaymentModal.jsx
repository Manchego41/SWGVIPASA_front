// src/components/PaymentModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { startMercadoPagoCheckout } from "../utils/payments";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

const getProduct = (it) => it?.product || {};
const getName = (it) => getProduct(it)?.name || it?.name || "Producto";
const getPrice = (it) => Number(getProduct(it)?.price ?? it?.price ?? 0);
const getQty = (it) => Number(it?.quantity ?? it?.qty ?? 1);
const getImage = (it) =>
  getProduct(it)?.imageUrl || it?.imageUrl || it?.image || "";

export default function PaymentModal({
  open,
  onClose,
  items = [],
  subtotal = 0,
  onConfirm, // por si necesitas enganchar lógica extra en el padre
}) {
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) setMethod("");
  }, [open]);

  const count = useMemo(
    () => items.reduce((acc, it) => acc + getQty(it), 0),
    [items]
  );

  if (!open) return null;

  const methods = [
    { id: "visa", label: "Visa", sub: "Pago con tarjeta Visa" },
    { id: "yape", label: "Yape", sub: "Pago rápido con Yape" },
    { id: "plin", label: "Plin", sub: "Pago rápido con Plin" },
    { id: "efectivo", label: "Efectivo", sub: "Pago en efectivo al recibir" },
  ];

  const handleConfirm = async () => {
    if (!method) return;

    try {
      if (method === "visa") {
        // Ir directo a Mercado Pago (sandbox) con los items del carrito:
        await startMercadoPagoCheckout(items);
        return; // la página redirige, no sigue
      }

      // (Opcional) avisa que aún no está implementado
      alert("Este método se implementará luego. Prueba con Visa por ahora.");

      // Si tu padre quiere enterarse del método seleccionado:
      await onConfirm?.(method);
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo iniciar el pago.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-semibold">Finalizar Compra</h3>
              <p className="text-white/80 text-sm">Complete su información de pago</p>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/20 transition" onClick={onClose} aria-label="Cerrar">
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-gray-800">Resumen de compra</h4>
              <div className="space-y-2">
                {items.map((it, idx) => {
                  const qty = getQty(it);
                  const price = getPrice(it);
                  const line = qty * price;
                  return (
                    <div key={it._id || getProduct(it)?._id || idx} className="flex items-center justify-between bg-gray-50 border rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        {getImage(it) ? (
                          <img src={getImage(it)} alt={getName(it)} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-800 line-clamp-1">{getName(it)}</div>
                          <div className="text-xs text-gray-500">{`${qty}x • ${money(price)}`}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">{money(line)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-semibold text-gray-700">Total a pagar</span>
                <span className="text-indigo-600 font-extrabold text-lg">{money(subtotal)}</span>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Seleccione método de pago <span className="text-red-500">*</span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                {methods.map(m => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={[
                        "text-left border rounded-xl p-4 transition shadow-sm",
                        active ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                      ].join(" ")}
                    >
                      <div className="font-semibold text-gray-800">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 pt-0 flex items-center gap-3">
            <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!method}
              className={[
                "flex-1 h-11 rounded-xl font-semibold text-white transition",
                method ? "bg-indigo-600 hover:bg-indigo-700 shadow" : "bg-gray-300 cursor-not-allowed"
              ].join(" ")}
            >
              ✓ Confirmar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
