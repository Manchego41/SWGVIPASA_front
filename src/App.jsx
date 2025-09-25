// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import ModalVerCompra from './components/ModalVerCompra';

import Home from './pages/Home';
import Productos from './pages/Productos';
import Catalog from './pages/Catalogo.jsx';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AccesoDenegado from './pages/AccesoDenegado';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import UserEditor from './pages/admin/UserEditor';
import ProductEditor from './pages/admin/ProductEditor';
import StockManager from './pages/admin/StockManager';

import SupportWidget from './components/SupportWidget.jsx';
import Catalogo from './pages/Catalogo.jsx';

// Wrapper que aplica estilos distintos si estamos en /admin
function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // Para el sitio normal: pt-16 (debajo del navbar) y fondo claro
  // Para admin: SIN pt-16 aquí (lo maneja AdminLayout) y mismo bg gris
  const wrapperClass = isAdmin
    ? 'min-h-screen bg-gray-100'
    : 'pt-16 min-h-screen bg-gray-50';

  return (
    <>
      <Navbar />
      <div className={wrapperClass}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />

          {/* Protegidas */}
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

          {/* Admin */}
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

            {/* Gestión de Productos */}
            <Route path="stock" element={<StockManager />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
          </Route>
        </Routes>
      </div>

      <SupportWidget />
      <ModalVerCompra />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}