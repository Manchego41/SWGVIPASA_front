// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import PaymentModal from "../components/PaymentModal";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

// Normalizadores para sobrevivir al zoológico de estructuras
const getId = (it) =>
  it?.product?._id || it?.productId || it?._id || it?.id;

const getName = (it) =>
  it?.name || it?.product?.name || "Producto";

const getPrice = (it) =>
  Number(it?.price ?? it?.product?.price ?? 0);

const getQty = (it) =>
  Number(it?.qty ?? it?.quantity ?? 1);

const getImage = (it) =>
  it?.imageUrl || it?.image || it?.product?.imageUrl || it?.product?.image || "";

export default function Cart() {
  // Redirección si no hay token
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  if (!token) return <Navigate to="/login" replace />;

  const headers = { Authorization: `Bearer ${token}` };
  const { items, changeQty, removeItem, subtotal, fetchCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState(false);

  // Cálculo robusto del total
  const total = useMemo(
    () =>
      (items || []).reduce((acc, it) => acc + getQty(it) * getPrice(it), 0),
    [items]
  );

  const handleConfirmPayment = async (method) => {
    try {
      setPaying(true);
      await API.post(
        "/cart/checkout-local",
        { method },
        { headers }
      );
      await fetchCart();
      setShowModal(false);
      alert(`Compra registrada correctamente. Método: ${method.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "No se pudo registrar la compra. Revisa la consola.");
    } finally {
      setPaying(false);
    }
  };

  const handleDec = (it) => {
    const id = getId(it);
    const next = Math.max(1, getQty(it) - 1);
    changeQty(id, next);
  };

  const handleInc = (it) => {
    const id = getId(it);
    const next = getQty(it) + 1;
    changeQty(id, next);
  };

  const handleRemove = (it) => {
    const id = getId(it);
    removeItem(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
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
                const id = getId(it);
                const qty = getQty(it);
                const price = getPrice(it);
                const line = qty * price;

                return (
                  <div key={id} className="grid grid-cols-12 items-center px-6 py-4 border-t">
                    <div className="col-span-6 flex items-center gap-4">
                      {getImage(it) ? (
                        <img src={getImage(it)} alt={getName(it)} className="w-12 h-12 object-contain rounded-md bg-white" />
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
                        <button className="p-2 rounded-full border hover:bg-gray-50" onClick={() => handleDec(it)}>
                          <FiMinus />
                        </button>
                        <span className="w-6 text-center">{qty}</span>
                        <button className="p-2 rounded-full border hover:bg-gray-50" onClick={() => handleInc(it)}>
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

        {/* Resumen de compra */}
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

            <button
              disabled={!items?.length || paying}
              onClick={() => setShowModal(true)}
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

      {/* Modal de pago */}
      <PaymentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        items={items}
        subtotal={total}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}