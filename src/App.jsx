// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';     // si aún lo usas
import Cart from './pages/Cart';
import AccesoDenegado from './pages/AccesoDenegado';
import AdminDashboard from './pages/AdminDashboard';
import VendedorDashboard from './pages/VendedorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mt-6">
        <Routes>
          {/* SPA principal */}
          <Route path="/" element={<Home />} />

          {/* Opcionales rutas directas */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto"  element={<Contacto />} />

          {/* Carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Auth */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/vendedor/dashboard" element={<VendedorDashboard />} />

          {/* Catch-all: vuelve a Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;