// src/pages/Productos.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Obtiene la lista de productos del backend
  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProductos(res.data.products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Agrega un producto al carrito (requiere haber iniciado sesión)
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no está logueado, lo mandamos a la página de login
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart/add', { productId });
      alert('✅ Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('❌ No se pudo agregar al carrito');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
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
            <h2 className="text-xl font-semibold mb-2">{prod.name}</h2>
            <p className="text-gray-700 mb-2">{prod.description}</p>
            <p className="text-gray-700 mb-4">Precio: ${prod.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(prod._id)}
              className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;