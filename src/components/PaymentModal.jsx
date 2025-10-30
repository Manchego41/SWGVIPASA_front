import React, { useState } from 'react';
import { 
  FiX, 
  FiCreditCard, 
  FiSmartphone, 
  FiDollarSign, 
  FiCheck, 
  FiUser, 
  FiMail,
  FiShoppingBag,
  FiPhone,
  FiLock,
  FiCalendar
} from 'react-icons/fi';
import API from '../utils/api';

const PaymentModal = ({ isOpen, onClose, cartItems, total, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    payment_method: '',
    customer_name: '',
    customer_email: '',
    // Campos específicos de cada método
    card_number: '',
    expiry_date: '',
    cvv: '',
    card_holder: '',
    phone_number: '',
    confirmation_code: '',
    pin: '',
    payment_on_delivery: false
  });
  const [processing, setProcessing] = useState(false);
  const [selectedStep, setSelectedStep] = useState(1);

  const paymentMethods = [
    { 
      value: 'tarjeta_visa', 
      label: 'Visa', 
      icon: FiCreditCard,
      color: 'from-blue-500 to-blue-600',
      description: 'Pago con tarjeta Visa',
      fields: [
        { 
          name: 'card_number', 
          label: 'Número de tarjeta', 
          type: 'text', 
          placeholder: '1234 5678 9012 3456',
          icon: FiCreditCard,
          maxLength: 19
        },
        { 
          name: 'expiry_date', 
          label: 'Fecha vencimiento', 
          type: 'text', 
          placeholder: 'MM/AA',
          icon: FiCalendar,
          maxLength: 5
        },
        { 
          name: 'cvv', 
          label: 'CVV', 
          type: 'text', 
          placeholder: '123',
          icon: FiLock,
          maxLength: 3
        },
        { 
          name: 'card_holder', 
          label: 'Titular de la tarjeta', 
          type: 'text', 
          placeholder: 'Como aparece en la tarjeta',
          icon: FiUser
        }
      ]
    },
    { 
      value: 'yape', 
      label: 'Yape', 
      icon: FiSmartphone,
      color: 'from-purple-500 to-purple-600',
      description: 'Pago rápido con Yape',
      fields: [
        { 
          name: 'phone_number', 
          label: 'Número de celular', 
          type: 'tel', 
          placeholder: '987 654 321',
          icon: FiPhone
        },
        { 
          name: 'confirmation_code', 
          label: 'Código de confirmación', 
          type: 'text', 
          placeholder: 'Código de 6 dígitos de la app',
          icon: FiLock,
          maxLength: 6
        }
      ]
    },
    { 
      value: 'plin', 
      label: 'Plin', 
      icon: FiSmartphone,
      color: 'from-green-500 to-green-600',
      description: 'Pago rápido con Plin',
      fields: [
        { 
          name: 'phone_number', 
          label: 'Número de celular', 
          type: 'tel', 
          placeholder: '987 654 321',
          icon: FiPhone
        },
        { 
          name: 'pin', 
          label: 'PIN de seguridad', 
          type: 'password', 
          placeholder: 'Tu PIN de 4 dígitos',
          icon: FiLock,
          maxLength: 4
        }
      ]
    },
    { 
      value: 'efectivo', 
      label: 'Efectivo', 
      icon: FiDollarSign,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Pago en efectivo al recibir',
      fields: [
        { 
          name: 'payment_on_delivery', 
          label: 'Confirmar pago', 
          type: 'checkbox', 
          text: 'Acepto pagar en efectivo al momento de recibir el producto. El monto a pagar es S/ ' + total.toFixed(2)
        }
      ]
    }
  ];

  const handleInputChange = (field, value) => {
    // Formatear número de tarjeta
    if (field === 'card_number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // Formatear fecha de vencimiento
    if (field === 'expiry_date') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedMethod = () => {
    return paymentMethods.find(method => method.value === formData.payment_method);
  };

  const validateForm = () => {
    const method = getSelectedMethod();
    
    if (!formData.payment_method || !formData.customer_name || !formData.customer_email) {
      return 'Por favor completa todos los campos requeridos';
    }

    // Validar campos específicos del método
    if (method && method.fields) {
      for (let field of method.fields) {
        if (field.type !== 'checkbox' && !formData[field.name]) {
          return `Por favor completa el campo: ${field.label}`;
        }
        if (field.type === 'checkbox' && !formData[field.name]) {
          return 'Debes aceptar las condiciones de pago en efectivo';
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      setProcessing(true);
      
      const paymentData = {
        ...formData,
        items: cartItems,
        total: total,
        transaction_amount: total
      };
      
      const response = await API.post('/simulated-payments/create', paymentData);
      
      setTimeout(() => {
        alert('✅ Pago registrado exitosamente');
        onPaymentSuccess(response.data.payment);
        onClose();
        // Reset form
        setFormData({
          payment_method: '',
          customer_name: '',
          customer_email: '',
          card_number: '',
          expiry_date: '',
          cvv: '',
          card_holder: '',
          phone_number: '',
          confirmation_code: '',
          pin: '',
          payment_on_delivery: false
        });
        setSelectedStep(1);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error en pago simulado:', error);
      alert('Error al procesar el pago: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const selectedMethod = getSelectedMethod();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full my-8 transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <FiShoppingBag size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Compra</h2>
                <p className="text-blue-100 text-sm">Complete su información de pago</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Contenido desplazable */}
        <div className="max-h-[calc(80vh-200px)] overflow-y-auto">
          {/* Resumen de compra */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
              <FiShoppingBag className="mr-2 text-blue-600" />
              Resumen de compra
            </h3>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{item.quantity}x</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">S/ {item.product?.price?.toFixed(2)} c/u</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800 whitespace-nowrap">
                    S/ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-800">Total a pagar</span>
              <span className="text-2xl font-bold text-blue-600">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Métodos de pago */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-4 text-gray-700">
                Seleccione método de pago *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.payment_method === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({...prev, payment_method: method.value}));
                        setSelectedStep(2);
                      }}
                      className={`p-3 border-2 rounded-xl text-center transition-all duration-200 h-24 flex flex-col items-center justify-center ${
                        isSelected
                          ? `border-blue-500 bg-gradient-to-r ${method.color} text-white shadow-lg transform scale-105`
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} size={20} />
                      <span className={`text-xs font-semibold block ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                        {method.label}
                      </span>
                      <span className={`text-xs mt-1 block ${isSelected ? 'text-blue-100' : 'text-gray-500'} leading-tight`}>
                        {method.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Información del cliente */}
            {formData.payment_method && (
              <div className="space-y-4 animate-fadeIn">
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <FiUser className="inline mr-2 text-blue-600" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                  <FiUser className="absolute left-4 top-12 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <FiMail className="inline mr-2 text-blue-600" />
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange('customer_email', e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="tu@email.com"
                    required
                  />
                  <FiMail className="absolute left-4 top-12 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Campos específicos del método de pago */}
                {selectedMethod && selectedMethod.fields && (
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Información de pago</h4>
                    {selectedMethod.fields.map((field, index) => (
                      <div key={index} className="relative">
                        {field.type === 'checkbox' ? (
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={formData[field.name]}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              required
                            />
                            <span className="text-sm text-gray-700">{field.text}</span>
                          </label>
                        ) : (
                          <>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              {field.icon && React.createElement(field.icon, { className: "inline mr-2 text-blue-600" })}
                              {field.label} *
                            </label>
                            <input
                              type={field.type}
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder={field.placeholder}
                              maxLength={field.maxLength}
                              required
                            />
                            {field.icon && React.createElement(field.icon, { 
                              className: "absolute left-4 top-12 transform -translate-y-1/2 text-gray-400" 
                            })}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Resumen del método seleccionado */}
                {selectedMethod && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedMethod.color} text-white`}>
                        {React.createElement(selectedMethod.icon, { size: 18 })}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Método seleccionado: {selectedMethod.label}</p>
                        <p className="text-sm text-gray-600">{selectedMethod.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Botones de acción */}
        <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 rounded-b-3xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={processing || !formData.payment_method}
              onClick={handleSubmit}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Confirmar Pago
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;