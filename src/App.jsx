// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AccesoDenegado from './pages/AccesoDenegado';
import AdminDashboard from './pages/AdminDashboard';
import VendedorDashboard from './pages/VendedorDashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Contenido principal: las rutas se renderizan debajo del Nav */}
      <div className="mt-6">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/cart" element={
            <PrivateRoute allowedRoles={['administrador','vendedor','cliente']}>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Rutas protegidas */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['administrador']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendedor/dashboard"
            element={
              <PrivateRoute allowedRoles={['vendedor']}>
                <VendedorDashboard />
              </PrivateRoute>
            }
          />

          {/* Ruta comodín: cualquier URL no definida redirige a Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;