import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    API.get('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setItems(res.data.items))
      .catch(console.error);
  }, [navigate]);

  const remove = productId => {
    API.delete(`/cart/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setItems(res.data.items));
  };

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Mi carrito</h2>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {items.map(i => (
            <div
              key={i.product._id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={i.product.imageUrl}
                  alt={i.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg">{i.product.name}</h3>
                  <p>Cantidad: {i.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  S/ {(i.product.price * i.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => remove(i.product._id)}
                  className="text-red-600 hover:underline mt-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4">
            <p className="text-xl font-bold">
              Total: S/ {total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}