// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <section className="text-center mt-12">
        <h1 className="text-4xl font-bold">Bienvenidos a IPASA Ecommerce</h1>
        <p className="mt-4 text-lg">Encuentra los mejores productos al alcance de tu mano</p>
      </section>
    </div>
  );
};

export default Home;