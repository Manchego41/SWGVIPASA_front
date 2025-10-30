// src/components/PurchaseDetailModal.jsx
import React, { useMemo } from "react";
import { FiX, FiUser, FiDollarSign, FiPackage } from "react-icons/fi";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function PurchaseDetailModal({
  open,
  onClose,
  purchase,
  productsById = {},
  productsByName = {},
  currentUserName = "",
}) {
  // Seguridad
  if (!open || !purchase) return null;

  // Normalizar items
  const items = Array.isArray(purchase.items) ? purchase.items : [];

  // Resolver datos por ítem (name, unit, qty, image)
  const resolvedItems = useMemo(() => {
    return items.map((it) => {
      const qty = Number(it.quantity || 0);
      // 1) si viene populate con product objeto
      const productObj = it.product && typeof it.product === "object" ? it.product : null;

      // 2) intentar por id
      const productId =
        (typeof it.product === "string" && it.product) ||
        it.productId ||
        it.product_id ||
        productObj?._id;

      const byId = productId ? productsById[productId] : null;

      // 3) intentar por nombre
      const byName =
        productsByName[(it.name || "").toLowerCase()] ||
        (productObj?.name && productsByName[productObj.name.toLowerCase()]) ||
        null;

      const product = productObj || byId || byName || {};

      const name = it.name || product.name || "Producto";
      const unit = Number(it.price ?? product.price ?? 0);
      const image =
        product.imageUrl ||
        product.imagenUrl ||
        (Array.isArray(product.images) && product.images[0]) ||
        "";

      return {
        name,
        unit,
        qty,
        image,
        lineTotal: unit * qty,
      };
    });
  }, [items, productsById, productsByName]);

  // Totales
  const totalFromItems = resolvedItems.reduce((acc, r) => acc + r.lineTotal, 0);
  const total = Number(
    purchase.total !== undefined && purchase.total !== null
      ? purchase.total
      : totalFromItems
  );
  const subtotal = total / 1.18;
  const igv = total - subtotal;

  // Estado
  const statusLabel =
    purchase.status && purchase.status !== "recorded"
      ? purchase.status
      : "Completado";

  // Fecha
  const createdAt = purchase.createdAt ? new Date(purchase.createdAt) : null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-[61] max-w-4xl w-[96%] mx-auto my-10 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-xl font-semibold">Detalle de Compra</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>

        {/* Fecha y hora como en tu imagen 1 */}
        {createdAt && (
          <div className="px-5 pt-3 text-sm text-gray-600">
            {createdAt.toLocaleDateString()} •{" "}
            {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Tarjetas superiores: Cliente / Total / Estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cliente */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUser /> <span>Cliente</span>
              </div>
              <div className="mt-1 font-medium">
                {currentUserName || purchase?.user?.name || "—"}
              </div>
              <div className="text-xs text-gray-500">
                Orden: #{purchase?.code || String(purchase?._id || "").slice(-6) || "—"}
              </div>
            </div>

            {/* Total */}
            <div className="border rounded-xl p-4 bg-green-50">
              <div className="flex items-center gap-2 text-green-700">
                <FiDollarSign /> <span>Total</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-green-700">
                {money(total)}
              </div>
              <div className="text-xs text-green-700/80">
                {resolvedItems.length} {resolvedItems.length === 1 ? "producto" : "productos"}
              </div>
            </div>

            {/* Estado */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiPackage /> <span>Estado</span>
              </div>
              <div className="mt-1">
                <span className="px-2.5 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Lista de productos con imagen desde MongoDB */}
          <div className="border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b font-medium">
              Productos ({resolvedItems.length})
            </div>
            <div className="divide-y">
              {resolvedItems.map((r, idx) => (
                <div key={idx} className="flex items-center gap-4 px-4 py-3">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-16 h-16 object-contain bg-white rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded" />
                  )}

                  <div className="flex-1">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-gray-600">
                      Cantidad: {r.qty} • Precio: {money(r.unit)} c/u
                    </div>
                  </div>

                  <div className="text-right text-[#004157] font-medium">
                    {money(r.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desglose de Pago */}
          <div className="border rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-gray-600">Subtotal:</div>
              <div className="font-medium">{money(subtotal)}</div>
              <div className="text-gray-600">IGV (18%):</div>
              <div className="font-medium">{money(igv)}</div>
              <div className="text-gray-600">Total:</div>
              <div className="font-bold text-[#004157]">{money(total)}</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}