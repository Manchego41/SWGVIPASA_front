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
        setUsers(clientes);
      })
      .catch(console.error);
  }, []);

  const handleView = user => {
    alert(`ID: ${user._id}\nNombre: ${user.name}\nEmail: ${user.email}`);
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