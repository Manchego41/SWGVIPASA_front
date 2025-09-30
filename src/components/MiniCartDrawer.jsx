// src/components/MiniCartDrawer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from "react-icons/fi";

export default function MiniCartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    subtotal,
    removeItem,
    changeQty,
    drawerOpen,
    setDrawerOpen,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[60] ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] shadow-2xl transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-blue-600" />
            <h3 className="font-semibold text-lg">Mi carrito</h3>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>

        <div className="h-[calc(100%-160px)] overflow-y-auto p-4">
          {loading && <div className="text-gray-500">Cargando…</div>}

          {!loading && items.length === 0 && (
            <div className="text-gray-500 text-center mt-10">
              Tu carrito está vacío
            </div>
          )}

          {!loading &&
            items.map((it) => (
              <div
                key={it._id}
                className="flex gap-3 py-3 border-b items-center"
              >
                <img
                  src={it.product?.imageUrl}
                  alt={it.product?.name}
                  className="w-16 h-16 object-cover rounded bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/64x64?text=No+img";
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{it.product?.name}</div>
                  <div className="text-xs text-gray-500">
                    S/ {Number(it.product?.price || 0).toFixed(2)}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      className="p-1 rounded border hover:bg-gray-50"
                      onClick={() => changeQty(it, -1)}
                    >
                      <FiMinus />
                    </button>
                    <span className="min-w-[24px] text-center text-sm">
                      {it.quantity}
                    </span>
                    <button
                      className="p-1 rounded border hover:bg-gray-50"
                      onClick={() => changeQty(it, +1)}
                    >
                      <FiPlus />
                    </button>
                    <button
                      className="p-1 rounded border hover:bg-red-50 text-red-600 ml-2"
                      title="Quitar"
                      onClick={() => removeItem(it._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="font-semibold text-sm">
                  S/ {(Number(it.product?.price || 0) * it.quantity).toFixed(2)}
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">
              S/ {subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => {
              setDrawerOpen(false);
              navigate("/cart");
            }}
            className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            IR AL CARRITO
          </button>
        </div>
      </aside>
    </>
  );
}