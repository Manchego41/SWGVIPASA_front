// src/pages/Login.jsx
import React, { useState } from 'react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const handleToggle = () => setIsRegistering(!isRegistering);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/IPASA%20LOGO.jpeg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-80">
        <div className="flex justify-center mb-4">
          <img src="/descarga-removebg-preview.png" alt="IPASA Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}
        </h2>

        {!isRegistering ? (
          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Usuario"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">
              Iniciar Sesión
            </button>
            <p className="text-center">
              ¿No tienes cuenta?{' '}
              <button type="button" className="text-blue-500 underline" onClick={handleToggle}>
                Regístrate
              </button>
            </p>
          </form>
        ) : (
          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nombre Completo"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nombre de Usuario"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="">Seleccionar Cargo</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">
              Registrarse
            </button>
            <p className="text-center">
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="text-blue-500 underline" onClick={handleToggle}>
                Inicia Sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;