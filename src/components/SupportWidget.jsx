// src/components/SupportWidget.jsx
import { useState, useRef, useEffect } from "react";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "agent", text: "¿En qué te puedo ayudar?" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Botón flotante redondo */}
      <button
        aria-label="Contactar soporte técnico"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none"
      >
        {/* Ícono headset */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h2v-6H7V10a5 5 0 0 1 10 0v2h-2v6h2a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8z"/>
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full sm:max-w-md bg-white rounded-2xl shadow-xl mx-2 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Soporte Técnico</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">✕</button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`${m.role === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"} px-3 py-2 rounded-2xl max-w-[85%]`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Escribe tu mensaje…"
                  className="resize-none w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={send} className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}