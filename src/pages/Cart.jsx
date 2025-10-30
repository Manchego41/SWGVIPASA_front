// src/pages/Cart.jsx - VERSIÓN CON PAGO SIMULADO
import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2, FiCreditCard } from "react-icons/fi";
import PaymentModal from '../components/PaymentModal';

export default function Cart() {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;
  if (!token) return <Navigate to="/login" replace />;

  const { items, changeQty, removeItem, subtotal, fetchCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const total = useMemo(() => subtotal, [subtotal]);

  // Pago simulado - NUEVA FUNCIÓN
  const handleSimulatedPayment = () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('✅ Pago exitoso:', paymentData);
    // Recargar carrito
    fetchCart();
    // Opcional: mostrar mensaje de éxito
    alert('✅ ¡Compra realizada exitosamente!');
  };

  // Pago local (opcional) - mantener por si acaso
  const handlePayLocal = async () => {
    try {
      await API.post("/cart/checkout-local");
      await fetchCart();
      alert("✅ Compra registrada correctamente.");
    } catch (error) {
      console.error('❌ Error en pago local:', error);
      alert("❌ Error al registrar la compra");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Carrito vacío</h2>
              <p className="text-gray-500 mb-6">Agrega algunos productos para continuar</p>
              <button 
                onClick={() => window.location.href = '/catalogo'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ir al catálogo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
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
                      className="grid grid-cols-12 gap-4 px-6 py-4 border-b items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/64x64?text=No+img";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                          <button
                            onClick={() => removeItem(it._id)}
                            className="text-red-600 text-sm inline-flex items-center gap-1 mt-1 hover:text-red-700 transition-colors"
                          >
                            <FiTrash2 size={14} />
                            Quitar
                          </button>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 text-right font-medium text-gray-900">
                        S/ {unit.toFixed(2)}
                      </div>

                      <div className="col-span-6 md:col-span-2 flex justify-center items-center gap-2">
                        <button
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                          onClick={() => changeQty(it, -1)}
                          disabled={it.quantity <= 1}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="min-w-[32px] text-center font-medium text-gray-900">
                          {it.quantity}
                        </span>
                        <button
                          className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                          onClick={() => changeQty(it, +1)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <div className="col-span-12 md:col-span-2 text-right font-semibold text-gray-900">
                        S/ {line.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumen de compra */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de compra</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botón principal: Pago Simulado */}
                <button
                  onClick={handleSimulatedPayment}
                  className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                >
                  <FiCreditCard size={20} />
                  Proceder al Pago
                </button>

                

                <div className="mt-4 text-xs text-gray-500 text-center">
                  {items.length} producto{items.length !== 1 ? 's' : ''} • S/ {total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de pago simulado */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartItems={items}
        total={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}