// src/components/PaymentModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { FiX } from "react-icons/fi";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

/* Helpers para leer el shape de tu backend / items */
const getProduct = (it) => it?.product || {};
const getName = (it) => getProduct(it)?.name || it?.name || "Producto";
const getPrice = (it) => Number(getProduct(it)?.price ?? it?.price ?? 0);
const getQty = (it) => Number(it?.quantity ?? it?.qty ?? 1);
const getImage = (it) =>
  getProduct(it)?.imageUrl || it?.imageUrl || it?.image || "";

const INITIAL_TEST_CARDS = [
  { id: "card-1", label: "Visa - 4111 1111 1111 1111", number: "4111 1111 1111 1111", name: "Cliente Test", expiry: "12/29", cvv: "123" },
  { id: "card-2", label: "BCP - 5454 5454 5454 5454", number: "5454 5454 5454 5454", name: "Cliente Test", expiry: "11/27", cvv: "321" },
];

export default function PaymentModal({ open, onClose, items = [], subtotal = 0, onConfirm }) {
  const [step, setStep] = useState("select"); // select | form | processing | voucher_ready | success
  const [method, setMethod] = useState("");
  const [cards, setCards] = useState(INITIAL_TEST_CARDS);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || null);
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [mobileInput, setMobileInput] = useState("");
  const [msg, setMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [voucherUrl, setVoucherUrl] = useState(null);
  const [voucherData, setVoucherData] = useState(null);

  useEffect(() => {
    if (!open) {
      resetAll();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (cards.length && !selectedCardId) setSelectedCardId(cards[0].id);
  }, [cards, selectedCardId]);

  const count = useMemo(() => items.reduce((acc, it) => acc + getQty(it), 0), [items]);

  const methods = [
    { id: "visa", label: "Visa", sub: "Pago con tarjeta Visa" },
    { id: "bcp", label: "BCP (Tarjeta)", sub: "Pago con tarjeta BCP" },
    { id: "yape", label: "Yape", sub: "Pago rápido con Yape" },
    { id: "plin", label: "Plin", sub: "Pago rápido con Plin" },
    { id: "efectivo", label: "Efectivo", sub: "Pagar en efectivo en tienda (comprobante con QR)" },
  ];

  function resetAll() {
    setStep("select");
    setMethod("");
    setSelectedCardId(cards[0]?.id || null);
    setCardForm({ number: "", name: "", expiry: "", cvv: "" });
    setMobileInput("");
    setMsg("");
    setProcessing(false);
    setVoucherUrl(null);
    setVoucherData(null);
  }

  const startMethod = (m) => {
    setMethod(m);
    setStep("form");
    setMsg("");
  };

  const goBack = () => {
    setStep("select");
    setMethod("");
    setMsg("");
  };

  const addCard = () => {
    if (!cardForm.number || !cardForm.name) {
      setMsg("Completa número y nombre de la tarjeta.");
      return;
    }
    const id = `card-${Date.now()}`;
    const label = `${cardForm.name} - ${String(cardForm.number).slice(-4)}`;
    const newCard = { id, label, ...cardForm };
    setCards((s) => [newCard, ...s]);
    setSelectedCardId(id);
    setCardForm({ number: "", name: "", expiry: "", cvv: "" });
    setMsg("Tarjeta agregada (simulación).");
  };

  const simulateDelay = (min = 900, extra = 700) =>
    new Promise((r) => setTimeout(r, min + Math.random() * extra));

  // Genera comprobante HTML con QR (Google Charts) y lo guarda en voucherUrl
  const generateVoucher = async () => {
    const voucher = {
      id: `VCH-${Date.now()}`,
      total: subtotal,
      items: items.map((it) => ({ name: getName(it), qty: getQty(it), price: getPrice(it) })),
      note: "Pago en tienda - presentar comprobante",
    };
    const payloadStr = JSON.stringify(voucher);
    const qr = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(payloadStr)}`;
    const html = `
      <html><head><meta charset="utf-8"><title>Comprobante ${voucher.id}</title></head>
      <body style="font-family:Arial, Helvetica, sans-serif; padding:20px;">
        <h2>Comprobante de Pago - IPASA</h2>
        <p><strong>ID:</strong> ${voucher.id}</p>
        <p><strong>Total:</strong> ${money(voucher.total)}</p>
        <p><strong>Nota:</strong> ${voucher.note}</p>
        <h3>Items</h3>
        <ul>
          ${voucher.items.map(it => `<li>${it.qty} x ${it.name} — ${money(it.price)}</li>`).join("")}
        </ul>
        <div style="margin-top:20px;">
          <img src="${qr}" alt="QR" />
          <p style="font-size:12px;color:#666">Presente este código en caja para pagar en efectivo.</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setVoucherUrl(url);
    setVoucherData(voucher);
  };

  // Simulación principal: diferencia para EFECTIVO (no llamar onConfirm automáticamente)
  const simulate = async (payload = {}) => {
    setProcessing(true);
    setStep("processing");
    setMsg("");
    await simulateDelay();

    if (method === "efectivo") {
      // Generar comprobante y mostrarlo, pero NO registrar la compra aun
      await generateVoucher();
      setProcessing(false);
      setStep("voucher_ready"); // nuevo estado: voucher listo para abrir/descargar y luego confirmar
      setMsg("Comprobante generado. Descárgalo o ábrelo y luego confirma el pago en tienda.");
      return;
    }

    // Otros métodos: simulación y enviar al backend inmediatamente
    setProcessing(false);
    setStep("success");
    try {
      await onConfirm?.(method);
    } catch (e) {
      console.error("onConfirm error:", e);
    }
  };

  const handleCardPay = () => {
    const card = cards.find((c) => c.id === selectedCardId);
    if (!card) {
      setMsg("Selecciona o agrega una tarjeta de simulación.");
      return;
    }
    setMsg("");
    simulate({ method: "card", cardLabel: card.label });
  };

  const handleMobilePay = () => {
    if (!mobileInput || mobileInput.trim().length < 4) {
      setMsg("Ingresa un número/alias válido para simular.");
      return;
    }
    setMsg("");
    simulate({ method });
  };

  const handleCashFlowConfirm = async () => {
    // El usuario ya vio/descargó el voucher y ahora confirma que efectivamente pagará en tienda.
    setProcessing(true);
    // opcional: podrías enviar voucherData al backend antes de confirmar (no lo hago por defecto)
    try {
      await simulateDelay(200, 300); // pequeña pausa
      await onConfirm?.(method); // registrar compra / limpiar carrito desde Cart.jsx
      setStep("success");
      setMsg("");
    } catch (e) {
      console.error("onConfirm error:", e);
      setMsg("Error registrando la compra. Revisa la consola.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadVoucher = () => {
    if (!voucherUrl) return;
    const a = document.createElement("a");
    a.href = voucherUrl;
    a.download = `voucher-${Date.now()}.html`;
    a.click();
  };

  // Si no está abierto, no render
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Finalizar Compra</h3>
              <div className="text-sm text-white/90">Complete su información de pago</div>
            </div>
            <div className="flex items-center gap-2">
              {step !== "select" && step !== "processing" && (
                <button onClick={goBack} className="px-3 py-1 rounded border border-white/20 bg-white/10 text-white">Atrás</button>
              )}
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition" aria-label="Cerrar">
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 max-h-[72vh] overflow-auto">
            {/* resumen */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Resumen de compra</h4>
              <div className="space-y-2 mt-2">
                {items.map((it, idx) => {
                  const qty = getQty(it);
                  const price = getPrice(it);
                  const line = qty * price;
                  const key = it._id || idx;
                  return (
                    <div key={key} className="flex items-center justify-between bg-gray-50 border rounded-xl p-3">
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
              <div className="flex items-center justify-between pt-3 border-t mt-3">
                <span className="font-semibold text-gray-700">Total a pagar</span>
                <span className="text-indigo-600 font-extrabold text-lg">{money(subtotal)}</span>
              </div>
            </div>

            {/* Select */}
            {step === "select" && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Seleccione método de pago</p>
                <div className="grid grid-cols-2 gap-3">
                  {methods.map((m) => (
                    <button key={m.id} onClick={() => startMethod(m.id)} className="p-4 border rounded-xl text-left hover:shadow transition bg-white">
                      <div className="font-semibold text-gray-800">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            {step === "form" && method && (
              <>
                <div className="mb-3">
                  <div className="text-sm text-gray-600">Método: <span className="font-medium text-gray-800">{method.toUpperCase()}</span></div>
                </div>

                {/* Tarjetas */}
                {(method === "visa" || method === "bcp") && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Selecciona una tarjeta o agrega una.</div>
                    <div className="space-y-2">
                      {cards.map((c) => (
                        <label key={c.id} className={`flex items-center gap-3 p-3 border rounded ${selectedCardId === c.id ? "ring-2 ring-indigo-200" : ""}`}>
                          <input type="radio" name="card" checked={selectedCardId === c.id} onChange={() => setSelectedCardId(c.id)} />
                          <div>
                            <div className="font-medium">{c.label}</div>
                            <div className="text-xs text-gray-500">{c.number} • {c.expiry}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-2 p-3 border rounded">
                      <div className="text-sm text-gray-600 mb-2">Agregar tarjeta</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input placeholder="Número" value={cardForm.number} onChange={(e) => setCardForm((s) => ({ ...s, number: e.target.value }))} className="border p-2 rounded" />
                        <input placeholder="Nombre en tarjeta" value={cardForm.name} onChange={(e) => setCardForm((s) => ({ ...s, name: e.target.value }))} className="border p-2 rounded" />
                        <input placeholder="MM/AA" value={cardForm.expiry} onChange={(e) => setCardForm((s) => ({ ...s, expiry: e.target.value }))} className="border p-2 rounded" />
                        <input placeholder="CVV" value={cardForm.cvv} onChange={(e) => setCardForm((s) => ({ ...s, cvv: e.target.value }))} className="border p-2 rounded" />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={addCard} className="px-3 py-1 bg-sky-600 text-white rounded">Agregar</button>
                        <button type="button" onClick={handleCardPay} className="px-3 py-1 bg-indigo-600 text-white rounded">Pagar {money(subtotal)}</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yape / Plin */}
                {(method === "yape" || method === "plin") && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Introduce número (ej: 999123456)</div>
                    <input value={mobileInput} onChange={(e) => setMobileInput(e.target.value)} className="w-full border p-2 rounded" placeholder="Número o alias" />
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleMobilePay} className="px-3 py-1 bg-indigo-600 text-white rounded"> {money(subtotal)}</button>
                      <button onClick={() => simulate({ method })} className="px-3 py-1 border rounded"></button>
                    </div>
                  </div>
                )}

                {/* Efectivo */}
                {method === "efectivo" && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Se generará un comprobante (QR) que deberás presentar en la tienda para pagar en efectivo. Luego confirma la compra.</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => simulate({ method })} className="px-3 py-1 bg-indigo-600 text-white rounded">Generar comprobante</button>
                    </div>
                  </div>
                )}

                {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
              </>
            )}

            {step === "processing" && (
              <div className="text-center py-8">
                <div className="inline-block p-6 bg-slate-50 rounded-lg">
                  <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-14 h-14 mx-auto mb-4" />
                  <div className="text-sm text-gray-600">Procesando pago... por favor espera</div>
                </div>
              </div>
            )}

            {/* voucher_ready: generado para EFECTIVO. NO se llamó aun onConfirm */}
            {step === "voucher_ready" && voucherUrl && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
                  <div className="font-medium text-yellow-800">Comprobante generado</div>
                  <div className="text-sm text-gray-600">Descarga o abre el comprobante y preséntalo en la tienda para pagar en efectivo. Cuando hayas pagado, confirma aquí para finalizar la compra.</div>
                </div>

                <div className="flex gap-2">
                  <a href={voucherUrl} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Abrir comprobante</a>
                  <button onClick={downloadVoucher} className="px-3 py-1 bg-sky-600 text-white rounded">Descargar comprobante</button>
                  <button onClick={handleCashFlowConfirm} className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded">Confirmar pago en tienda</button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded border border-green-100">
                  <div className="font-medium text-green-800">GRACIAS POR SU COMPRA</div>
                  <div className="text-sm text-gray-600">Tu pago se registró.</div>
                </div>
                <div className="text-right">
                  <button onClick={() => { onClose?.(); resetAll(); }} className="px-4 py-2 bg-slate-100 rounded">Cerrar</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 pt-0 flex items-center gap-3">
            <div className="flex-1 text-sm text-gray-500">
              {count} producto{count !== 1 ? "s" : ""} • {money(subtotal)}
            </div>

            {step !== "processing" && step !== "success" && (
              <>
                <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium">Cancelar</button>

                {step === "select" ? (
                  <button onClick={() => { if (!method) { setMsg("Selecciona un método primero."); return;} setStep("form"); }} className="flex-1 h-11 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Continuar</button>
                ) : (
                  <button
                    onClick={() => {
                      // fallback: los botones específicos repiten la acción
                      if (method === "efectivo") return; // la confirmación para efectivo está en voucher_ready
                      if (method === "visa" || method === "bcp") return handleCardPay();
                      if (method === "yape" || method === "plin") return handleMobilePay();
                    }}
                    className="flex-1 h-11 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    ✓ Confirmar Pago
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}