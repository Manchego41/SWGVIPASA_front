// src/pages/Productos.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Productos = () => {
  return (
    <div>
      <Navbar />
      <section className="text-center mt-12">
        <h1 className="text-3xl font-bold">Nuestros Productos</h1>
        <p className="mt-4 text-lg">Descubre la variedad de productos que ofrecemos</p>
      </section>
    </div>
  );
};

export default Productos;