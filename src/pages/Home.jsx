import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import HeroBanner from '../components/HeroBanner';
import Productos from './Productos';
import Contacto  from './Contacto';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    API.get('/products')
      .then(res => setProductos(res.data.products))
      .catch(console.error);
  }, []);

  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16 scroll-smooth">
      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-100">
        <HeroBanner />
      </section>

      {/* Productos */}
      <section id="productos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h2>
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map(prod => (
              <div
                key={prod._id}
                className="bg-white border rounded-lg p-4 shadow hover:shadow-md flex flex-col"
              >
                {prod.imageUrl && (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-40 object-cover mb-4 rounded"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{prod.name}</h3>
                <p className="text-gray-700 mb-2">{prod.description}</p>
                <p className="text-gray-800 font-bold mb-4">S/ {prod.price.toFixed(2)}</p>
                <button
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) return window.location = '/login';
                    API.post('/cart', { productId: prod._id }, {
                      headers:{ Authorization:`Bearer ${token}` }
                    });
                  }}
                  className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 bg-gray-50">
        <Contacto />
      </section>
    </div>
  );
}