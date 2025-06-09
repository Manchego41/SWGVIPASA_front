import React from 'react';
import { useNavigate } from 'react-router-dom';

const VendedorDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Panel Vendedor</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Cerrar Sesión
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-xl mb-4">Bienvenido, {name} (Vendedor)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-4 hover:shadow-lg">
            <h3 className="font-semibold mb-2">Mis Productos</h3>
            <p>Ver y actualizar mis productos</p>
          </div>
          <div className="bg-white shadow rounded p-4 hover:shadow-lg">
            <h3 className="font-semibold mb-2">Órdenes</h3>
            <p>Revisar órdenes pendientes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendedorDashboard;