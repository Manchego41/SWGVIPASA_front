// src/pages/Productos.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const productos = [
  { id: 1, nombre: 'Portón', precio: 1699, imagen: 'https://prosafetyperu.com/wp-content/uploads/2022/06/a2004dc1afb22fbd9933c9ca75ca4fb1-300x188.jpg' },
  { id: 2, nombre: 'Lamina', precio: 2099, imagen: 'https://aceroscrea.com/wp-content/uploads/2025/03/hero-lamina-de-acero.png' },
  { id: 3, nombre: 'Tubos', precio: 899, imagen: 'https://tectul.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTQ3NzY5LCJwdXIiOiJibG9iX2lkIn19--f36b3127f623b41b7f5410d64f6f7103227e7924/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fZml0IjpbODAwLDgwMF19LCJwdXIiOiJ2YXJpYXRpb24ifX0=--1420d7fd3d20057726f0ef3c0043db24ca0403be/PERFILERIA%20ESTRUCTURAL%20INOXIDABLE.jpg?locale=es' },
];

const Productos = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                <p className="text-gray-700">S/ {producto.precio}</p>
                <Link
                  to={`/productos/${producto.id}`}
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Productos;