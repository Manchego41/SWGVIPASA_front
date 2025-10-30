// src/pages/PaymentResult.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiClock, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');
  const statusParam = searchParams.get('status');

  useEffect(() => {
    // Determinar el estado basado en la URL o el parámetro
    const path = window.location.pathname;
    
    if (path.includes('/success')) {
      setStatus('success');
    } else if (path.includes('/failure')) {
      setStatus('failure');
    } else if (path.includes('/pending')) {
      setStatus('pending');
    } else {
      setStatus(statusParam || 'unknown');
    }

    // Log para debugging
    console.log('Payment Result:', {
      path,
      paymentId,
      preferenceId,
      status: statusParam
    });
  }, [statusParam, paymentId, preferenceId]);

  const renderContent = () => {
    switch (status) {
      case 'success':
      case 'approved':
        return (
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu compra ha sido procesada correctamente y recibirás un correo de confirmación.
            </p>
            {paymentId && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">ID de pago</p>
                <p className="text-sm font-mono text-gray-700">{paymentId}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/profile/purchases')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <FiShoppingBag />
                Ver mis compras
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Seguir comprando
                <FiArrowRight />
              </button>
            </div>
          </div>
        );

      case 'failure':
      case 'rejected':
        return (
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <FiXCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pago rechazado
            </h1>
            <p className="text-gray-600 mb-6">
              No pudimos procesar tu pago. Por favor, verifica tus datos e intenta nuevamente.
            </p>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <p className="text-sm text-yellow-800">
                <strong>Posibles causas:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                <li>Fondos insuficientes</li>
                <li>Datos incorrectos de la tarjeta</li>
                <li>Límite de compra excedido</li>
                <li>Problema con el banco emisor</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Reintentar pago
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Volver a productos
              </button>
            </div>
          </div>
        );

      case 'pending':
      case 'in_process':
        return (
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100">
              <FiClock className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pago pendiente
            </h1>
            <p className="text-gray-600 mb-6">
              Tu pago está siendo procesado. Te notificaremos por correo cuando se complete.
            </p>
            {paymentId && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">ID de pago</p>
                <p className="text-sm font-mono text-gray-700">{paymentId}</p>
              </div>
            )}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm text-blue-800">
                <strong>¿Qué sigue?</strong>
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Algunos métodos de pago requieren confirmación adicional. 
                Recibirás una notificación cuando tu pago sea aprobado.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/profile/purchases')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Ver mis compras
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Procesando resultado...
            </h1>
            <p className="text-gray-600">
              Por favor espera un momento
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
}