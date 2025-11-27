// src/utils/payments.js
const API_BASE = "http://localhost:5000/api"; // backend

// cartItems: array con { name/title, price, qty/quantity, ... }
export async function startMercadoPagoCheckout(cartItems = []) {
  const items = cartItems?.length
    ? cartItems.map(it => {
        const price = Number(it?.product?.price ?? it.price);
        const qty = Number(it?.quantity ?? it?.qty ?? 1);

        // VALIDACIÓN ESTRICTA – Clave para evitar errores en Mercado Pago
        if (!price || price <= 0) {
          throw new Error("El precio del producto es inválido.");
        }

        if (!qty || qty <= 0) {
          throw new Error("La cantidad del producto es inválida.");
        }

        return {
          title: it?.product?.name || it.name || it.title || "Producto",
          unit_price: price,
          quantity: qty,
          currency_id: "PEN",
        };
      })
    : [
        {
          title: "Productos",
          unit_price: 1,
          quantity: 1,
          currency_id: "PEN",
        },
      ];

  // Hacemos la llamada al backend
  const resp = await fetch(`${API_BASE}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await resp.json();

  if (!resp.ok || (!data.sandbox_init_point && !data.init_point)) {
    throw new Error(data?.message || "No se pudo crear la preferencia");
  }

  // Redirige al checkout de Mercado Pago
  window.location.href = data.sandbox_init_point || data.init_point;
}
