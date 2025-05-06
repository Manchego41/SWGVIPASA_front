// src/pages/DetalleProducto.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const productos = [
  { id: 1, nombre: 'Portón', precio: 1699, imagen: '/descarga-removebg-preview.png', alto: '85 cm', ancho: '60 cm', profundidad: '65 cm' },
  { id: 2, nombre: 'Lamina', precio: 2099, imagen: '/descarga-removebg-preview.png', alto: '170 cm', ancho: '70 cm', profundidad: '60 cm' },
  { id: 3, nombre: 'Tubos', precio: 899, imagen: '/descarga-removebg-preview.png', alto: '95 cm', ancho: '60 cm', profundidad: '60 cm' },
];

const DetalleProducto = () => {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === parseInt(id));

  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        {/* BOTÓN ATRÁS */}
        <Link
          to="/productos"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Atrás
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <img src={producto.imagen} alt={producto.nombre} className="w-full md:w-1/2 object-cover rounded shadow" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
            <p className="text-2xl text-red-500 font-semibold mb-4">S/ {producto.precio}</p>
            <h2 className="text-lg font-bold mb-2">Características destacadas</h2>
            <ul className="list-disc ml-6 text-gray-700 mb-4">
              <li>Alto: {producto.alto}</li>
              <li>Ancho: {producto.ancho}</li>
              <li>Profundidad: {producto.profundidad}</li>
            </ul>
            <p className="text-gray-600">Este producto cuenta con la mejor tecnología para tu hogar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;