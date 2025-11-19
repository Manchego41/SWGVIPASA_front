// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AccesoDenegado from "./pages/AccesoDenegado";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import UserEditor from "./pages/admin/UserEditor";
import ProductsList from "./pages/admin/ProductsList";
import ProductEditor from "./pages/admin/ProductEditor";
import StockManager from "./pages/admin/StockManager";
import AdminReturns from "./pages/admin/AdminReturns"; // ← NUEVO

import { CartProvider } from "./context/CartContext";
import MiniCartDrawer from "./components/MiniCartDrawer";
import Catalogo from "./pages/Catalogo";
import SupportWidget from "./components/SupportWidget";

function AppInner() {
  const location = useLocation();

  // Visible en páginas públicas; oculto en /admin y /login
  const hideOn = [/^\/admin\b/, /^\/login\b/];
  const showSupport = !hideOn.some((rx) => rx.test(location.pathname));

  return (
    <>
      <Navbar />
      <MiniCartDrawer />

      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />

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

          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={["administrador"]}>
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
            <Route path="returns" element={<AdminReturns />} /> {/* ← NUEVO */}
          </Route>
        </Routes>
      </div>

      {showSupport && <SupportWidget />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;