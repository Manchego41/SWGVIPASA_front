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
// import Contacto removed on purpose earlier — contact is now inside Home
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
import AdminReturns from "./pages/admin/AdminReturns";

import { CartProvider } from "./context/CartContext";
import MiniCartDrawer from "./components/MiniCartDrawer";
import Catalogo from "./pages/Catalogo";
import SupportWidget from "./components/SupportWidget";

function AppInner() {
  const location = useLocation();

  // Rutas en las que queremos OCULTAR la barra pública (Navbar) y el padding superior:
  // - /admin (todo lo que empiece por /admin)
  // - /login
  // Si necesitas añadir otras rutas (ej: /register) agrégalas aquí.
  const hideOn = [/^\/admin\b/, /^\/login\b/];

  // Si alguna regex coincide, ocultamos Navbar + MiniCart + padding superior + SupportWidget
  const hideLayout = hideOn.some((rx) => rx.test(location.pathname));
  const showNavbar = !hideLayout;
  const showMiniCart = !hideLayout;
  const showSupport = !hideLayout;

  return (
    <>
      {showNavbar && <Navbar />}
      {showMiniCart && <MiniCartDrawer />}

      {/* Solo añadimos el padding-top cuando el Navbar está visible */}
      <div className={showNavbar ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          {/* La ruta /contacto fue removida (contacto integrado en Home) */}
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
            <Route path="returns" element={<AdminReturns />} />
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