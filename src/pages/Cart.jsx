// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

// Helpers del backend
const getCartItemId = (it) => it?._id;
const getProduct = (it) => it?.product || {};
const getPrice = (it) => Number(getProduct(it)?.price ?? it?.price ?? 0);
const getQty = (it) => Number(it?.quantity ?? it?.qty ?? 1);
const getName = (it) => getProduct(it)?.name || it?.name || "Producto";
const getImage = (it) =>
  getProduct(it)?.imageUrl || it?.imageUrl || it?.image || "";

export default function Cart() {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  if (!token) return <Navigate to="/login" replace />;

  const { items, changeQty, removeItem, subtotal } = useCart();

  const [paying, setPaying] = useState(false);

  const total = useMemo(() => subtotal, [subtotal]);

  // --- MERCADO PAGO DIRECTO ---
 const handleMercadoPago = async () => {
  try {
    setPaying(true);

    const payload = {
      items: items.map((it) => ({
        title: getName(it),
        quantity: getQty(it),
        unit_price: getPrice(it),
      }))
    };

    const response = await fetch("http://localhost:5000/api/payments/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point; // redirige a Mercado Pago
    } else {
      alert("Error al generar enlace de pago");
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo procesar el pago");
  } finally {
    setPaying(false);
  }
};


  const handleDec = (it) => changeQty(it, -1);
  const handleInc = (it) => changeQty(it, +1);

  const handleRemove = (it) => {
    const cartItemId = getCartItemId(it);
    if (cartItemId) removeItem(cartItemId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LISTA DE PRODUCTOS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow border">
            <div className="grid grid-cols-12 px-6 py-4 text-sm text-gray-500">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-right">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div>
              {(!items || items.length === 0) && (
                <div className="px-6 py-10 text-gray-500">
                  Tu carrito está vacío.
                </div>
              )}

              {items?.map((it) => {
                const price = getPrice(it);
                const qty = getQty(it);
                const line = price * qty;
                const key = getCartItemId(it) || getProduct(it)?._id || getName(it);

                return (
                  <div key={key} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                    <div className="col-span-6 flex items-center gap-4">
                      {getImage(it) ? (
                        <img
                          src={getImage(it)}
                          alt={getName(it)}
                          className="w-12 h-12 object-contain rounded-md bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-200" />
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{getName(it)}</div>
                        <button
                          onClick={() => handleRemove(it)}
                          className="text-red-600 text-sm mt-1 inline-flex items-center gap-1 hover:underline"
                        >
                          <FiTrash2 /> Quitar
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right text-gray-800">
                      {money(price)}
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="p-2 rounded-full border hover:bg-gray-50"
                          onClick={() => handleDec(it)}
                        >
                          <FiMinus />
                        </button>
                        <span className="w-6 text-center">{qty}</span>
                        <button
                          className="p-2 rounded-full border hover:bg-gray-50"
                          onClick={() => handleInc(it)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right font-semibold text-gray-900">
                      {money(line)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <div>
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de compra</h3>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>

            <div className="flex items-center justify-between text-base font-bold text-gray-900 mb-4">
              <span>Total</span>
              <span className="text-indigo-600">{money(total)}</span>
            </div>

            {/* BOTÓN QUE REDIRIGE A MERCADO PAGO */}
            <button
              disabled={!items?.length || paying}
              onClick={handleMercadoPago}
              className={[
                "w-full h-11 rounded-xl font-semibold text-white transition shadow-sm",
                items?.length && !paying ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
              ].join(" ")}
            >
              {paying ? "Procesando..." : "Proceder al Pago"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {items?.length || 0} producto{(items?.length || 0) !== 1 ? "s" : ""} • {money(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
