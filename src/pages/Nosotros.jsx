// src/pages/Nosotros.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Nosotros = () => {
  return (
    <div>
      <Navbar />
      <section className="text-center mt-12">
        <h1 className="text-3xl font-bold">¿Quiénes somos?</h1>
        <p className="mt-4 text-lg">Conoce más sobre nuestra historia y misión</p>
      </section>
    </div>
  );
};

export default Nosotros;