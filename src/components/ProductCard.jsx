import React from 'react';
import { FiShoppingCart, FiTag } from 'react-icons/fi';
import { useRouter } from 'next/router';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const hasDiscount = product.isOnSale && product.discount && 
    new Date(product.discount.startDate) <= new Date() && 
    new Date(product.discount.endDate) >= new Date();

  const calculateDiscountPrice = () => {
    if (!hasDiscount) return product.price;
    
    switch (product.discount.discountType) {
      case 'percentage':
        return product.price - (product.price * product.discount.value / 100);
      case 'fixed':
        return product.price - product.discount.value;
      default:
        return product.price;
    }
  };

  const discountPrice = calculateDiscountPrice();
  const discountPercentage = hasDiscount && product.discount.discountType === 'percentage' 
    ? product.discount.value 
    : Math.round(((product.price - discountPrice) / product.price) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Badge de descuento */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
            <FiTag size={14} />
            <span>-{discountPercentage}%</span>
          </div>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        {/* Precios */}
        <div className="flex items-center space-x-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-green-600">
                S/ {discountPrice.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                S/ {product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              S/ {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Información de descuento */}
        {hasDiscount && product.discount.description && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
            <p className="text-yellow-800 text-xs font-medium">
              🎉 {product.discount.description}
            </p>
            {product.discount.endDate && (
              <p className="text-yellow-600 text-xs mt-1">
                Válido hasta: {new Date(product.discount.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Stock y acciones */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.countInStock > 0 ? `${product.countInStock} disponibles` : 'Agotado'}
          </span>

          <button
            onClick={() => router.push(`/products/${product._id}`)}
            disabled={product.countInStock === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <FiShoppingCart size={16} />
            <span>Ver Detalles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;