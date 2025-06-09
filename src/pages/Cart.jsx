// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Obtiene el carrito del usuario
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await API.get('/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
  };

  // Remover un producto del carrito
  const handleRemove = async (productId) => {
    try {
      await API.post('/cart/remove', { productId });
      fetchCart();
    } catch (error) {
      console.error('Error al remover del carrito:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cart) {
    return <p className="text-center mt-10">Cargando carrito…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Tu Carrito</h1>
      {cart.items.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="flex items-center border p-4 rounded bg-white shadow"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover mr-4 rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-700">Precio: ${product.price.toFixed(2)}</p>
                <p className="text-gray-700">Cantidad: {quantity}</p>
              </div>
              <button
                onClick={() => handleRemove(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-2xl font-bold">
              Total: $
              {cart.items
                .reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;