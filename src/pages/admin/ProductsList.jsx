// src/pages/admin/ProductsList.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // si aún no tienes endpoint real, puedes poner aquí un array fijo
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err);
        // fallback a productos ficticios
        setProducts([
          { _id: '1', name: 'Producto A', price: 10.0 },
          { _id: '2', name: 'Producto B', price: 20.0 },
          { _id: '3', name: 'Producto C', price: 15.5 },
        ]);
      });
  }, []);

  const handleView = p => {
    alert(`ID: ${p._id}\nNombre: ${p.name}\nPrecio: S/ ${p.price.toFixed(2)}`);
  };

  const handleDelete = id => {
    if (!window.confirm('¿Borrar este producto?')) return;
    API.delete(`/products/${id}`)
      .then(() => setProducts(products.filter(p => p._id !== id)))
      .catch(err => {
        console.error(err);
        // si es ficticio, simplemente lo quitamos
        setProducts(products.filter(p => p._id !== id));
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p._id}
            className="bg-white border rounded-lg p-4 shadow flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
            <p className="text-gray-800 font-bold mb-4">
              S/ {p.price.toFixed(2)}
            </p>
            <div className="mt-auto space-x-2">
              <button
                onClick={() => handleView(p)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ver info
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}