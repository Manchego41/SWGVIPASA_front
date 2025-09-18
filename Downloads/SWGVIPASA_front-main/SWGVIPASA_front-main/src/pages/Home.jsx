// src/pages/Home.jsx (o donde esté tu listado de productos)
import React, { useEffect, useState } from 'react';
import { useNavigate }                from 'react-router-dom';
import API                            from '../utils/api';
import HeroBanner                     from '../components/HeroBanner';
import Contacto                       from './Contacto';

export default function Home() {
  const [productos, setProductos] = useState([]); 
  const [search, setSearch]       = useState('');
  const navigate                   = useNavigate();

  useEffect(() => {
    API.get('/products')
      .then(res => {
        const lista = Array.isArray(res.data) ? res.data : res.data.products;
        setProductos(lista);
      })
      .catch(console.error);
  }, []);

  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = prod => {
    // 1) Recuperamos el objeto 'user' que guardamos al hacer login
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    const token  = stored?.token;

    // 2) Si no hay token, vamos al login
    if (!token) {
      return navigate('/login');
    }

    // 3) Si hay, añadimos al carrito
    API.post(
      '/cart',
      { productId: prod._id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        alert('Producto agregado al carrito 👍');
      })
      .catch(err => {
        console.error(err);
        alert('Error al añadir al carrito');
      });
  };

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
                <p className="text-gray-800 font-bold mb-4">
                  S/ {prod.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(prod)}
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