// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import SupportWidget from './components/SupportWidget';   // ⬅️ agregado

import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AccesoDenegado from './pages/AccesoDenegado';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import UserEditor from './pages/admin/UserEditor';
import ProductsList from './pages/admin/ProductsList';
import ProductEditor from './pages/admin/ProductEditor';
import StockManager from './pages/admin/StockManager';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="pt-16">
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/productos" element={<Navigate to="/catalogo" replace />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />

          {/* privadas */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* admin */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserEditor />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="stock" element={<StockManager />} />
          </Route>
        </Routes>
      </div>

      {/* Botón / Chatbot flotante */}
      <SupportWidget />
    </BrowserRouter>
  );
}

export default App;