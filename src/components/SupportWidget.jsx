// src/components/SupportWidget.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'ipasa_chat_history_v1';

function now() {
  return new Date().toISOString();
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

/**
 * Reglas sencillas por intención/keywords.
 * Más adelante puedes reemplazar answerWithAI() por una llamada real a tu backend de IA.
 */
function ruleBasedAnswer(q) {
  const text = q.toLowerCase();

  // Intenciones simples
  if (/(hola|buenas|buenos días|buenas tardes|buenas noches)/.test(text)) {
    return '¡Hola! Soy el asistente virtual de IPASA. ¿En qué puedo ayudarte hoy?';
  }

  if (/catalogo|catálogo|productos|ver productos/.test(text)) {
    return 'Puedes ver nuestro catálogo actualizado aquí: “Catálogo” en el menú superior. También puedes usar la búsqueda para filtrar por nombre o descripción.';
  }

  if (/precio|cuánto cuesta|coste/.test(text)) {
    return 'Los precios están visibles en cada tarjeta de producto dentro del Catálogo. Si tienes un producto específico en mente, dime su nombre y verifico información adicional.';
  }

  if (/stock|disponible|disponibilidad/.test(text)) {
    return 'La disponibilidad aparece como “Disponible” o “Agotado” en cada producto del Catálogo. ¿Cuál producto te interesa?';
  }

  if (/pago|metod|mercado\s?pago|tarjeta|efectivo/.test(text)) {
    return 'Actualmente el flujo de pago está deshabilitado para pruebas. Aun así, puedes agregar productos al carrito y se registrarán en tu historial de compras para validación.';
  }

  if (/env[ií]o|delivery|recojo|tienda/.test(text)) {
    return 'Hacemos envíos a nivel nacional y también puedes coordinar recojo en tienda. Indícame tu ciudad para darte tiempos estimados.';
  }

  if (/devoluci[oó]n|cambio|garant[ií]a/.test(text)) {
    return 'Aceptamos devoluciones dentro de los 7 días naturales si el producto está sin uso y en su empaque original. Escríbenos a ventas@ipasa.com con tu número de pedido.';
  }

  if (/contacto|tel[eé]fono|whatsapp|email|correo/.test(text)) {
    return 'Puedes escribirnos a ventas@ipasa.com o llamarnos al +51 999 888 777 de Lunes a Viernes 9:00–18:00.';
  }

  if (/horario|atenci[oó]n|abren|cierran/.test(text)) {
    return 'Nuestro horario es de Lunes a Viernes 9:00–18:00.';
  }

  if (/pedido|orden|c[oó]digo/.test(text)) {
    return 'Si ya hiciste un pedido, revisa “Mi perfil → Compras” para ver el historial. Si me das el código, intento ayudarte con más detalles.';
  }

  // fallback
  return 'Puedo ayudarte con catálogo, precios, stock, envíos, devoluciones y contacto. ¿Qué necesitas saber?';
}

/** Simulación de IA (aquí puedes conectar tu backend en el futuro). */
async function answerWithAI(userMessage) {
  // Simula "pensando…"
  await new Promise((r) => setTimeout(r, 600));
  return ruleBasedAnswer(userMessage);
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => loadHistory());
  const viewportRef = useRef(null);

  // Mensaje de bienvenida solo si no hay historial
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text:
          '¡Hola! Soy el asistente virtual de IPASA. ¿En qué te puedo ayudar? ' +
          'Puedo responder preguntas sobre el catálogo, stock, precios, envíos y devoluciones.',
        time: now(),
      };
      setMessages([welcome]);
    }
  }, []); // eslint-disable-line

  // Persistir historial
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Auto-scroll al final
  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending]
  );

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text.trim(),
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const replyText = await answerWithAI(text.trim());
      const botMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: replyText,
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Lo siento, hubo un problema al responder. Inténtalo nuevamente.',
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    '¿Cuál es el horario de atención?',
    '¿Cómo veo el catálogo?',
    '¿Hacen envíos?',
    '¿Cómo gestiono una devolución?',
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        aria-label="Abrir soporte"
      >
        {/* ícono chat */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Panel / Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* ventana */}
          <div className="relative w-full sm:max-w-md sm:rounded-2xl bg-white shadow-2xl sm:mx-4 max-h-[90vh] flex flex-col">
            {/* header */}
            <div className="px-4 py-3 border-b flex items-center justify-between bg-blue-600 text-white rounded-t-2xl sm:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold leading-none">Soporte IPASA</p>
                  <p className="text-xs opacity-90">Asistente virtual</p>
                </div>
              </div>
              <button
                className="p-1 hover:bg-white/10 rounded"
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* cuerpo */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1" ref={viewportRef}>
              {/* sugerencias rápidas */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickPrompts.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* mensajes */}
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    title={new Date(m.time).toLocaleString()}
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

            {/* input */}
            <form
              className="p-3 sm:p-4 border-t flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (canSend) sendMessage(input);
              }}
            >
              <input
                className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escribe tu consulta…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!canSend}
                className={`px-4 py-2 rounded-xl text-white ${
                  canSend ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
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
}