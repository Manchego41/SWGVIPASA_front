// src/components/SupportWidget.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "ipasa_chat_history_v1";
const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id_${Math.random().toString(36).slice(2)}`;
const now = () => new Date().toISOString();

function safeLoadHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function safeSaveHistory(messages) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
}

function ruleBasedAnswer(q) {
  const text = q.toLowerCase();
  if (/(hola|buenas|buenos días|buenas tardes|buenas noches)/.test(text))
    return "¡Hola! Soy el asistente virtual de IPASA. ¿En qué puedo ayudarte hoy?";
  if (/catalogo|catálogo|productos|ver productos/.test(text))
    return "Ve a “Catálogo” en el menú. También puedes buscar por nombre o descripción.";
  if (/precio|cuánto cuesta|coste/.test(text))
    return "Los precios están en cada tarjeta del catálogo. Dime el producto y te doy más info.";
  if (/stock|disponible|disponibilidad/.test(text))
    return "Verás “Disponible” o “Agotado” en cada producto. ¿Cuál te interesa?";
  if (/pago|metod|mercado\s?pago|tarjeta|efectivo/.test(text))
    return "El pago está en modo pruebas. Usa el carrito para validaciones.";
  if (/env[ií]o|delivery|recojo|tienda/.test(text))
    return "Envíos a nivel nacional y recojo en tienda. Dime tu ciudad para tiempos.";
  if (/devoluci[oó]n|cambio|garant[ií]a/.test(text))
    return "Devoluciones en 7 días (sin uso, con empaque). Escríbenos a ventas@ipasa.com.";
  if (/contacto|tel[eé]fono|whatsapp|email|correo/.test(text))
    return "ventas@ipasa.com — +51 999 888 777 (Lun–Vie 9:00–18:00).";
  if (/horario|atenci[oó]n|abren|cierran/.test(text))
    return "Atención: Lunes a Viernes, 9:00–18:00.";
  if (/pedido|orden|c[oó]digo/.test(text))
    return "Revisa “Mi perfil → Compras”. Si me pasas tu código de pedido, te ayudo.";
  return "Puedo ayudarte con catálogo, precios, stock, envíos, devoluciones y contacto. ¿Qué necesitas saber?";
}
async function answerWithAI(userMessage) {
  await new Promise((r) => setTimeout(r, 600));
  return ruleBasedAnswer(userMessage);
}

function usePortal(id = "ipasa-support-root") {
  const [portalEl, setPortalEl] = useState(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, [id]);
  return portalEl;
}

export default function SupportWidget() {
  const portalEl = usePortal();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const viewportRef = useRef(null);

  useEffect(() => {
    const hist = safeLoadHistory();
    if (hist.length) setMessages(hist);
    else setMessages([{
      id: uid(),
      role: "assistant",
      text: "¡Hola! Soy el asistente virtual de IPASA. ¿En qué te puedo ayudar? Respondo sobre catálogo, stock, precios, envíos y devoluciones.",
      time: now(),
    }]);
  }, []);
  useEffect(() => { safeSaveHistory(messages); }, [messages]);
  useEffect(() => { const el = viewportRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: uid(), role: "user", text: text.trim(), time: now() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setSending(true);
    try {
      const replyText = await answerWithAI(text.trim());
      setMessages((p) => [...p, { id: uid(), role: "assistant", text: replyText, time: now() }]);
    } catch {
      setMessages((p) => [...p, { id: uid(), role: "assistant", text: "Ups, hubo un problema. Intenta de nuevo.", time: now() }]);
    } finally { setSending(false); }
  };

  if (!portalEl) return null;

  const chatUI = (
    <>
      {/* Botón flotante — abajo izquierda */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir soporte"
        style={{
          position: "fixed", left: 24, bottom: 24, zIndex: 2147483647,
          height: 56, width: 56, borderRadius: 9999,
          boxShadow: "0 10px 25px rgba(0,0,0,.15)",
          background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}
        className="fixed bottom-6 left-6 z-[1000] h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
        </svg>
      </button>

      {/* Overlay + Ventana centrada EXACTA y más grande */}
      {open && (
        <div className="fixed inset-0 z-[1100]" style={{ position: "fixed", inset: 0, zIndex: 2147483600 }}>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30"
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }}
          />
          {/* Ventana */}
          <div
            className="bg-white rounded-2xl shadow-2xl flex flex-col"
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",   // 👈 centro exacto
              width: "min(92vw, 800px)",            // más ancho
              height: "min(78vh, 680px)",           // más alto
              boxShadow: "0 20px 45px rgba(0,0,0,.28)"
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between bg-blue-600 text-white rounded-t-2xl"
              style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold leading-none">Soporte IPASA</p>
                  <p className="text-xs opacity-90">Asistente virtual</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="p-1 hover:bg-white/10 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo */}
            <div className="p-4 overflow-y-auto flex-1" ref={viewportRef}>
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {["¿Cuál es el horario de atención?", "¿Cómo veo el catálogo?", "¿Hacen envíos?", "¿Cómo gestiono una devolución?"].map((q) => (
                    <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    title={new Date(m.time).toLocaleString()}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] shadow ${
                      m.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}

                {sending && (
                  <div className="bg-gray-100 text-gray-600 rounded-2xl px-3 py-2 text-sm inline-flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:.15s]"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:.3s]"></span>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              className="p-4 border-t flex items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); if (canSend) sendMessage(input); }}
            >
              <input
                placeholder="Escribe tu consulta…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-xl px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!canSend}
                className={`px-4 py-2.5 rounded-xl text-white text-[15px] ${
                  canSend ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(chatUI, portalEl);
}