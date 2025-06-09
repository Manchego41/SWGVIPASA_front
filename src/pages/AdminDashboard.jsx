import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Panel Admin</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Cerrar Sesión
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-xl mb-4">Bienvenido, {name} (Administrador)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4 hover:shadow-lg">
            <h3 className="font-semibold mb-2">Usuarios</h3>
            <p>Administrar cuentas de usuarios</p>
          </div>
          <div className="bg-white shadow rounded p-4 hover:shadow-lg">
            <h3 className="font-semibold mb-2">Productos</h3>
            <p>Ver y editar productos</p>
          </div>
          <div className="bg-white shadow rounded p-4 hover:shadow-lg">
            <h3 className="font-semibold mb-2">Reportes</h3>
            <p>Visualizar reportes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;