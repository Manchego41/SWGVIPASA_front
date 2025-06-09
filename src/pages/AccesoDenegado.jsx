import React from 'react';
import { Link } from 'react-router-dom';

const AccesoDenegado = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
    <p className="mb-6">No tienes permisos para ver esta página.</p>
    <Link to="/" className="text-blue-600 hover:underline">
      Volver al inicio
    </Link>
  </div>
);

export default AccesoDenegado;