import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  if (role !== 'administrador') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl text-red-600 font-bold">⛔ Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D5C75] text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">IPASA Admin</h1>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:text-yellow-400">Usuarios</a>
          <a href="#" className="hover:text-yellow-400">Productos</a>
          <a href="#" className="hover:text-yellow-400">Promociones</a>
          <a href="#" className="hover:text-yellow-400">Reportes</a>
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Gestionar Usuarios</h3>
            <p className="text-gray-600">Crea, edita y asigna roles a los usuarios.</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-600 mb-2">Gestión de Productos</h3>
            <p className="text-gray-600">Administra el catálogo de productos.</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 border-l-4 border-yellow-500">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Promociones</h3>
            <p className="text-gray-600">Activa campañas y descuentos especiales.</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">Reportes</h3>
            <p className="text-gray-600">Visualiza estadísticas del sistema.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;