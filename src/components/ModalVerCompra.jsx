// src/components/ModalVerCompra.jsx
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FiX, FiShoppingCart, FiCreditCard, FiCalendar, FiPackage, FiUser, FiMapPin, FiDollarSign, FiBox } from 'react-icons/fi';

const ModalVerCompra = ({ purchaseId, isOpen, onClose }) => {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productImages, setProductImages] = useState({}); // Para almacenar imágenes

  useEffect(() => {
    if (isOpen && purchaseId) {
      fetchPurchaseDetails();
    } else {
      setPurchase(null);
      setError('');
      setProductImages({});
    }
  }, [isOpen, purchaseId]);

  // Función para obtener imágenes de productos
  const fetchProductImages = async (productIds) => {
    try {
      const images = {};
      for (const productId of productIds) {
        try {
          // Intenta obtener la imagen del producto desde tu API
          const response = await API.get(`/products/${productId}`);
          if (response.data.imageUrl) {
            images[productId] = response.data.imageUrl;
          }
        } catch (error) {
          console.log(`No se pudo cargar imagen para producto ${productId}`);
        }
      }
      setProductImages(images);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    }
  };

  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      const token = stored?.token;

      const { data } = await API.get(`/purchases/${purchaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPurchase(data);
      
      // Intentar cargar imágenes de los productos
      const productIds = data.items.map(item => item.product).filter(id => id);
      if (productIds.length > 0) {
        fetchProductImages(productIds);
      }
    } catch (err) {
      console.error('Error al cargar compra:', err);
      setError(err.response?.data?.message || 'No se pudo cargar la compra');
    } finally {
      setLoading(false);
    }
  };

  // Cálculo de IGV (18%)
  const calculateTaxes = (total) => {
    const subtotal = total / 1.18;
    const igv = total - subtotal;
    return { 
      subtotal: subtotal.toFixed(2), 
      igv: igv.toFixed(2)
    };
  };

  if (!isOpen) return null;

  const taxes = purchase ? calculateTaxes(purchase.total) : { subtotal: '0.00', igv: '0.00' };
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header limpio y profesional */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detalle de Compra</h2>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <FiCalendar className="h-4 w-4" />
                <span className="text-sm">
                  {purchase ? new Date(purchase.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Cargando...'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando detalles de la compra...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <FiX className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={onClose}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : purchase ? (
            <div className="space-y-6">
              {/* Información de la orden */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Cliente</span>
                  </div>
                  <p className="text-sm text-gray-700">{userInfo.name || 'No disponible'}</p>
                  <p className="text-xs text-gray-600">Orden: #{purchase._id.slice(-8).toUpperCase()}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Total</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">S/ {Number(purchase.total).toFixed(2)}</p>
                  <p className="text-xs text-gray-600">{purchase.items.length} productos</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBox className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Estado</span>
                  </div>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {purchase.status === 'recorded' ? 'Completada' : purchase.status}
                  </span>
                </div>
              </div>

              {/* Lista de productos - CON IMÁGENES REALES */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <FiShoppingCart className="h-5 w-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Productos ({purchase.items.length})</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {purchase.items.map((item, index) => {
                    const productImage = productImages[item.product];
                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          {/* IMAGEN REAL del producto */}
                          <div className="flex-shrink-0">
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=📦";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
                                <FiPackage className="h-6 w-6 text-blue-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                              <span>Cantidad: {item.quantity}</span>
                              <span>•</span>
                              <span>Precio: S/ {Number(item.price).toFixed(2)} c/u</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              S/ {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Subtotal</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desglose de pago */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Desglose de Pago</h3>
                <div className="space-y-3 max-w-xs ml-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">S/ {taxes.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IGV (18%):</span>
                    <span className="font-medium">S/ {taxes.igv}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">S/ {Number(purchase.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer simple */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerCompra;