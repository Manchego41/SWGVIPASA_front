// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from './pages/Home';
import Productos from './pages/Productos';
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
import GestionarPromociones from './pages/admin/GestionarPromociones';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar global */}
      <Navbar />

      {/* Espacio para header fijo */}
      <div className="pt-16">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Rutas protegidas */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Rutas de administrador */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['administrador']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {/* Subrutas de Admin */}
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserEditor />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="promotions" element={<GestionarPromociones />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
