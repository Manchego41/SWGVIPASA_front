import React, { useState } from "react";
import { FiX, FiCreditCard, FiSmartphone, FiPhoneIncoming, FiDollarSign } from "react-icons/fi";

const PaymentModal = ({ isOpen, onClose, cartItems = [], total = 0, onPaymentSuccess }) => {
  if (!isOpen) return null;

  // estado UI
  const [method, setMethod] = useState("visa"); // 'visa' | 'yape' | 'plin' | 'efectivo'
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  // descuentos y fee (puedes ajustar reglas)
  const subtotal = cartItems.reduce((acc, it) => {
    const p = it.product || {};
    return acc + Number(p.price || 0) * Number(it.quantity || 0);
  }, 0);

  const discount = coupon.trim().toUpperCase() === "VIPASA5" ? subtotal * 0.05 : 0;
  const fee = method === "visa" ? Math.round(subtotal * 0.029 * 100) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discount + fee);

  // para Yape/Plin
  const [transactionId, setTransactionId] = useState("");
  const [voucher, setVoucher] = useState(null);

  const handleVoucher = (e) => {
    const file = e.target.files?.[0] || null;
    setVoucher(file);
  };

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(grandTotal.toFixed(2));
      alert("Monto copiado");
    } catch {}
  };

  const handleConfirm = async () => {
    // validaciones sencillas
    if (!buyer.name || !buyer.email) {
      alert("Completa tu nombre y correo.");
      return;
    }
    if (method === "visa") {
      // aquí solo simulamos; luego se cambia por tokenización real
    }

    setLoading(true);
    try {
      // SIMULADO: aquí podrías llamar a tu backend si quisieras
      // await API.post("/cart/checkout-local") etc.
      const payload = {
        method,
        buyer,
        coupon: coupon || undefined,
        totals: { subtotal, discount, fee, total: grandTotal },
        items: cartItems,
        extra:
          method === "visa"
            ? { /* numero/exp/cvv se integrarían con pasarela (SDK) */ }
            : method === "yape" || method === "plin"
            ? { transactionId, voucherName: voucher?.name || null }
            : method === "efectivo"
            ? {}
            : {},
      };

      // Notificamos al padre (Cart.jsx)
      onPaymentSuccess?.(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* modal */}
      <div
        className="fixed z-50 inset-0 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <div className="text-2xl">🛍️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Finalizar compra</h3>
              <p className="text-xs opacity-90">Completa tu información de pago</p>
            </div>
            <div className="text-right font-semibold">
              S/ {grandTotal.toFixed(2)}
            </div>
            <button
              className="ml-2 p-1 rounded hover:bg-white/10"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* body */}
          <div className="grid md:grid-cols-3 gap-4 p-5">
            {/* Columna izquierda: resumen + método + formulario según método */}
            <div className="md:col-span-2 space-y-4">
              {/* Resumen */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-semibold mb-2">Resumen</h4>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {cartItems.map((it) => {
                    const p = it.product || {};
                    const line = Number(p.price || 0) * Number(it.quantity || 0);
                    return (
                      <div key={it._id} className="flex justify-between text-sm">
                        <span>
                          {it.quantity}× {p.name}
                        </span>
                        <span>S/ {line.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Métodos */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-semibold mb-3">Método de pago</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setMethod("visa")}
                    className={`flex items-center justify-center gap-2 border rounded-lg py-2 text-sm ${
                      method === "visa"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiCreditCard /> Visa
                  </button>
                  <button
                    onClick={() => setMethod("yape")}
                    className={`flex items-center justify-center gap-2 border rounded-lg py-2 text-sm ${
                      method === "yape"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiSmartphone /> Yape
                  </button>
                  <button
                    onClick={() => setMethod("plin")}
                    className={`flex items-center justify-center gap-2 border rounded-lg py-2 text-sm ${
                      method === "plin"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiPhoneIncoming /> Plin
                  </button>
                  <button
                    onClick={() => setMethod("efectivo")}
                    className={`flex items-center justify-center gap-2 border rounded-lg py-2 text-sm ${
                      method === "efectivo"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiDollarSign /> Efectivo
                  </button>
                </div>

                {/* Sección dinámica por método */}
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {method === "visa" && (
                    <>
                      {/* Aquí solo maqueta para tarjeta – luego se reemplaza por SDK */}
                      <input
                        className="border rounded-lg p-2"
                        placeholder="Número de tarjeta (simulado)"
                      />
                      <input
                        className="border rounded-lg p-2"
                        placeholder="MM/AA (simulado)"
                      />
                      <input
                        className="border rounded-lg p-2"
                        placeholder="CVV (simulado)"
                      />
                      <p className="text-xs text-gray-500 sm:col-span-2">
                        * Estos campos son de demostración. Luego integramos tokenización real.
                      </p>
                    </>
                  )}

                  {(method === "yape" || method === "plin") && (
                    <>
                      <div className="sm:col-span-2">
                        <div className="h-36 border-2 border-dashed rounded-lg flex items-center justify-center bg-white">
                          QR {method.toUpperCase()} (demo)
                        </div>
                        <button
                          type="button"
                          onClick={copyAmount}
                          className="mt-2 text-xs text-indigo-600 hover:underline"
                        >
                          Copiar monto: S/ {grandTotal.toFixed(2)}
                        </button>
                      </div>
                      <input
                        className="border rounded-lg p-2"
                        placeholder="ID de transacción (opcional)"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                      <input
                        type="file"
                        className="border rounded-lg p-2"
                        onChange={handleVoucher}
                      />
                      <p className="text-xs text-gray-500 sm:col-span-2">
                        Sube el comprobante o ingresa el ID para acelerar la verificación.
                      </p>
                    </>
                  )}

                  {method === "efectivo" && (
                    <p className="text-sm text-gray-600 sm:col-span-2">
                      Pagas al recibir. (Opcional: pedir “¿con cuánto pagas?” para calcular vuelto).
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: datos comprador + cupón + totales */}
            <div className="space-y-4">
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-semibold mb-3">Datos del comprador</h4>
                <div className="space-y-2">
                  <input
                    className="w-full border rounded-lg p-2"
                    placeholder="Nombre completo"
                    value={buyer.name}
                    onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                  />
                  <input
                    className="w-full border rounded-lg p-2"
                    placeholder="Correo electrónico"
                    value={buyer.email}
                    onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                  />
                  <input
                    className="w-full border rounded-lg p-2"
                    placeholder="Cupón (opcional, p.ej. VIPASA5)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-semibold mb-3">Resumen de pago</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>- S/ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  {fee > 0 && (
                    <div className="flex justify-between">
                      <span>Comisión (Visa)</span>
                      <span>S/ {fee.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>S/ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex justify-end gap-2 px-5 py-4 border-t bg-white">
            <button
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 disabled:opacity-60"
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? "Procesando…" : "Confirmar pago"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
