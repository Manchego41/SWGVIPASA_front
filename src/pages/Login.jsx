// src/pages/Login.jsx
import React, { useState } from 'react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Estado para cambiar entre Iniciar sesión y Registrarse

  const handleToggle = () => {
    setIsRegistering(!isRegistering); // Cambia el estado
  };

  return (
    // Aquí es donde se coloca el fondo de pantalla
    <div 
      className="flex justify-center items-center min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk5TJmNK7j4Gt1zB-7AIEuKjvyjtT9Ek1YoA&s')" }} // Asegúrate de cambiar la ruta de la imagen a la que prefieras
    >
      <div className="bg-white p-8 rounded-md shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-6">{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>

        {/* Formulario de Login */}
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
            <div className="mb-4 text-center">
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Iniciar Sesión</button>
            </div>
            <div className="text-center">
              <button type="button" className="text-blue-500" onClick={handleToggle}>¿No tienes cuenta? Regístrate</button>
            </div>
          </form>
        ) : (
          // Formulario de Registro
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
            <div className="mb-4 text-center">
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Registrar</button>
            </div>
            <div className="text-center">
              <button type="button" className="text-blue-500" onClick={handleToggle}>¿Ya tienes cuenta? Inicia sesión</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;