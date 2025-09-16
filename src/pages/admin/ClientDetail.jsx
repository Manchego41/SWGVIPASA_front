import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del cliente
    API.get(`/users/${id}`)
      .then(res => setClient(res.data))
      .catch(console.error);
    // Obtener historial de compras
    API.get(`/users/${id}/orders`)
      .then(res => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (!client) return <div className="p-8">Cliente no encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-8">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Volver</button>
      <h2 className="text-2xl font-bold mb-2">Detalle del Cliente</h2>
      <p><strong>Nombre:</strong> {client.name}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>ID:</strong> {client._id}</p>
      <hr className="my-4" />
      <h3 className="text-xl font-semibold mb-2">Historial de compras</h3>
      {history.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <ul className="list-disc pl-6">
          {history.map(order => (
            <li key={order._id}>
              <span className="font-bold">{order.date}:</span> {order.items.length} productos - Total: ${order.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
