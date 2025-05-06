// src/pages/Contacto.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Contacto = () => {
  return (
    <div>
      <Navbar />
      <section className="text-center mt-12">
        <h1 className="text-3xl font-bold">Contáctanos</h1>
        <p className="mt-4 text-lg">Estamos aquí para ayudarte. Envíanos un mensaje.</p>
      </section>
    </div>
  );
};

export default Contacto;