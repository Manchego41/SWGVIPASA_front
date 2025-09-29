// src/components/DevolucionModal.jsx
import React, { useState, useEffect } from 'react';

const DevolucionModal = ({ compra, isOpen, onClose, onDevolucionSuccess }) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && compra) {
      setProductosSeleccionados([]);
      setMotivo('');
    }
  }, [isOpen, compra]);

  const handleProductoSelect = (productoId, productoNombre, cantidadMaxima) => {
    setProductosSeleccionados(prev => {
      const existe = prev.find(p => p.productoId === productoId);
      if (existe) {
        return prev.filter(p => p.productoId !== productoId);
      } else {
        return [...prev, { 
          productoId, 
          productoNombre,
          cantidad: 1, 
          cantidadMaxima 
        }];
      }
    });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;
    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.productoId === productoId 
          ? { ...p, cantidad: Math.min(nuevaCantidad, p.cantidadMaxima) }
          : p
      )
    );
  };

  const handleSubmit = async () => {
    if (productosSeleccionados.length === 0) {
      alert('Selecciona al menos un producto para devolver');
      return;
    }
    if (!motivo.trim()) {
      alert('Por favor ingresa el motivo de la devolución');
      return;
    }

    setLoading(true);
    // Simulación de envío al backend
    setTimeout(() => {
      alert('✅ Solicitud de devolución enviada correctamente');
      setLoading(false);
      onDevolucionSuccess();
      onClose();
    }, 1500);
  };

  if (!isOpen || !compra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Solicitar Devolución</h2>
              <p className="text-red-100 text-lg mt-1">
                Compra #{compra._id.slice(-6).toUpperCase()}
              </p>
              <p className="text-red-200 text-sm mt-2">
                📅 {compra.createdAt ? new Date(compra.createdAt).toLocaleDateString('es-PE') : ''}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-200 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {/* Productos */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🛍️ Selecciona los productos a devolver
            </h3>
            <div className="space-y-4">
              {compra.items.map((item, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-red-300 transition-all bg-white">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="flex items-center h-6">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-500 border-2 border-gray-300"
                        checked={productosSeleccionados.some(p => p.productoId === item.product.toString())}
                        onChange={() => handleProductoSelect(
                          item.product.toString(),
                          item.name,
                          item.quantity
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">{item.name}</div>
                      <div className="text-gray-600 mt-2 space-y-1">
                        <div>📦 Cantidad comprada: <span className="font-semibold">{item.quantity}</span></div>
                        <div>💰 Precio unitario: <span className="font-semibold">S/ {item.price}</span></div>
                        <div>🎯 Subtotal: <span className="font-semibold text-green-600">S/ {(item.price * item.quantity).toFixed(2)}</span></div>
                      </div>
                    </div>
                  </label>
                  
                  {productosSeleccionados.some(p => p.productoId === item.product.toString()) && (
                    <div className="ml-9 mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <label className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                        <span>🔢 Cantidad a devolver:</span>
                        <input 
                          type="number" 
                          min="1" 
                          max={item.quantity}
                          className="w-24 px-3 py-2 border-2 border-red-300 rounded-lg text-center font-bold text-red-600 focus:outline-none focus:border-red-500"
                          value={productosSeleccionados.find(p => p.productoId === item.product.toString())?.cantidad || 1}
                          onChange={(e) => actualizarCantidad(item.product.toString(), parseInt(e.target.value) || 1)}
                        />
                        <span className="text-gray-500 text-sm">
                          Máximo: {item.quantity}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Motivo */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📝 Motivo de la devolución *
            </label>
            <textarea 
              placeholder="Describe detalladamente el motivo de tu solicitud de devolución..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 resize-vertical text-lg transition-all"
            />
          </div>

          {/* Resumen */}
          {productosSeleccionados.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-yellow-800 text-lg mb-3 flex items-center gap-2">
                📋 Resumen de devolución
              </h4>
              <ul className="space-y-2">
                {productosSeleccionados.map(item => (
                  <li key={item.productoId} className="flex justify-between items-center text-yellow-700">
                    <span>• {item.productoNombre}</span>
                    <span className="font-bold">Cantidad: {item.cantidad}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            ⚠️ Las devoluciones están sujetas a términos y condiciones
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || productosSeleccionados.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  🔄 Solicitar Devolución
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevolucionModal;