// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function Cart() {
  // Redirección si no hay token
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  if (!token) return <Navigate to="/login" replace />;

  const headers = { Authorization: `Bearer ${token}` };
  const { items, changeQty, removeItem, subtotal, fetchCart } = useCart();
  const [paying, setPaying] = useState(false);

  const total = useMemo(() => subtotal, [subtotal]);

  const handlePay = async () => {
    try {
      setPaying(true);
      // usa tu endpoint local que guarda purchases (el que ya tenías)
      await API.post("/cart/checkout-local", {}, { headers });
      await fetchCart();
      alert("Compra registrada correctamente.");
    } catch (e) {
      console.error(e);
      alert("Error al registrar la compra");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Mi Carrito</h1>

      {items.length === 0 ? (
        <div>No hay ítems en el carrito.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista */}
          <div className="lg:col-span-8 bg-white rounded shadow border">
            <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b text-sm text-gray-600">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-right">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((it) => {
              const p = it.product || {};
              const unit = Number(p.price || 0);
              const line = unit * it.quantity;
              return (
                <div
                  key={it._id}
                  className="grid grid-cols-12 gap-3 px-4 py-4 border-b items-center"
                >
                  <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/64x64?text=No+img";
                      }}
                    />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <button
                        onClick={() => removeItem(it._id)}
                        className="text-red-600 text-sm inline-flex items-center gap-1 mt-1"
                      >
                        <FiTrash2 /> Quitar
                      </button>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-2 text-right md:text-right">
                    S/ {unit.toFixed(2)}
                  </div>

                  <div className="col-span-6 md:col-span-2 flex justify-center items-center gap-2">
                    <button
                      className="p-1 rounded border hover:bg-gray-50"
                      onClick={() => changeQty(it, -1)}
                    >
                      <FiMinus />
                    </button>
                    <span className="min-w-[24px] text-center">{it.quantity}</span>
                    <button
                      className="p-1 rounded border hover:bg-gray-50"
                      onClick={() => changeQty(it, +1)}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="col-span-12 md:col-span-2 text-right font-semibold">
                    S/ {line.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded shadow border p-4">
              <h2 className="font-semibold text-lg mb-4">Resumen de compra</h2>

              <div className="flex justify-between mb-2 text-sm text-gray-700">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className={`w-full mt-4 py-3 rounded text-white font-semibold ${
                  paying ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {paying ? "Procesando..." : "Pagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}