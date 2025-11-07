// src/utils/payments.js
const API_BASE = "http://localhost:5000/api"; // backend

// cartItems: array con { name/title, price, qty/quantity, ... }
export async function startMercadoPagoCheckout(cartItems = []) {
  const items = cartItems?.length
    ? cartItems.map(it => ({
        title: it?.product?.name || it.name || it.title || "Producto",
        unit_price: Number(it?.product?.price ?? it.price ?? 0) || 0,
        quantity: Number(it?.quantity ?? it?.qty ?? 1) || 1,
        currency_id: "PEN",
      }))
    : [{ title: "Productos", unit_price: 1, quantity: 1, currency_id: "PEN" }];

  const resp = await fetch(`${API_BASE}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await resp.json();
  if (!resp.ok || (!data.sandbox_init_point && !data.init_point)) {
    throw new Error(data?.message || "No se pudo crear la preferencia");
  }

  window.location.href = data.sandbox_init_point || data.init_point;
}


