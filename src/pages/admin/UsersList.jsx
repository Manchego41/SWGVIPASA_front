// src/pages/admin/UsersList.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users')
      .then(res => {
        // filtrar solo 'cliente'
        const clientes = res.data.filter(u => u.role === 'cliente');

        // --- IMPORTANTE ---
        // Para desarrollo y pruebas, se muestran datos simulados si no hay clientes o si la API falla.
        // Cuando el backend esté listo y devuelva los usuarios correctamente,
        // ELIMINA o COMENTA el bloque de datos simulados y deja solo:
        // setUsers(clientes);
        // Así se mostrarán los datos reales del backend.
        // ------------------

        if (clientes.length === 0) {
          // Datos simulados si no hay clientes
          setUsers([
            { _id: '1', name: 'Juan Pérez', email: 'juan@correo.com', role: 'cliente' },
            { _id: '2', name: 'Ana Gómez', email: 'ana@correo.com', role: 'cliente' }
          ]);
        } else {
          setUsers(clientes);
        }
      })
      .catch(() => {
        // Si la API falla, mostrar datos simulados
        setUsers([
          { _id: '1', name: 'Juan Pérez', email: 'juan@correo.com', role: 'cliente' },
          { _id: '2', name: 'Ana Gómez', email: 'ana@correo.com', role: 'cliente' }
        ]);
      });
  }, []);

  const handleView = user => {
    window.location.href = `/admin/clients/${user._id}`;
  };

  const handleHistory = user => {
    // Aquí podrías mostrar un modal o redirigir a una página de historial
    alert(`Historial de compras de ${user.name} (ID: ${user._id})`);
  };

  const handleDelete = id => {
    if (!window.confirm('¿Borrar este usuario?')) return;
    API.delete(`/users/${id}`)
      .then(() => setUsers(users.filter(u => u._id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Usuarios (role: cliente)</h2>
      {users.length === 0 ? (
        <p>No hay usuarios cliente registrados.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleView(u)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ver info
                  </button>
                  <button
                    onClick={() => handleHistory(u)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Historial
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}