import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home      from './pages/Home';
import Productos from './pages/Productos';
import Contacto  from './pages/Contacto';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Cart      from './pages/Cart';
import Profile   from './pages/Profile';
import AccesoDenegado from './pages/AccesoDenegado';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mt-16"> {/* compensar navbar fijo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto"  element={<Contacto />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;