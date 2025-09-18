// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react'
import API from '../utils/api'

export default function Profile() {
  const [purchases, setPurchases] = useState([])
  const [search, setSearch]       = useState('')

  // Cargar compras desde tu API
  useEffect(() => {
    async function fetchPurchases() {
      try {
        const { data } = await API.get('/auth/purchases') 
        setPurchases(data)
      } catch (err) {
        console.error('Error al cargar compras', err)
      }
    }
    fetchPurchases()
  }, [])

  // Filtrar por búsqueda
  const filtered = purchases.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-16 bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow p-4 space-y-6">
        <h2 className="text-xl font-semibold mb-2">Mi perfil</h2>
        <img
          src="/avatar.png"
          alt="Avatar usuario"
          className="w-full rounded-lg mb-4"
        />

        <ul className="space-y-2 text-gray-700">
          <li className="hover:text-blue-600 cursor-pointer">Información personal</li>
          <li className="hover:text-blue-600 cursor-pointer">Compras</li>
          <li className="hover:text-blue-600 cursor-pointer">Facturación</li>
          <li className="hover:text-blue-600 cursor-pointer">Devoluciones</li>
          <li className="hover:text-blue-600 cursor-pointer">Configuración</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Compras</h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Lista de compras */}
        <div className="space-y-6">
          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="text-gray-500 text-sm">{p.date}</p>
                  <p
                    className={`font-semibold ${
                      p.status === 'Entregado'
                        ? 'text-green-600'
                        : p.status === 'En camino'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {p.status}
                  </p>
                  <p className="text-gray-700">{p.productName}</p>
                  <p className="text-gray-500 text-sm">
                    {p.quantity} unidades
                  </p>
                </div>
              </div>

              <div className="text-right space-y-2">
                <p className="text-gray-500 text-sm">
                  Código de pedido: <span className="font-mono">{p.orderCode}</span>
                </p>
                <button className="block w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Ver compra
                </button>
                <button className="block w-full bg-blue-100 text-blue-600 py-2 rounded hover:bg-blue-200">
                  Volver a comprar
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500">No hay compras que mostrar.</p>
          )}
        </div>
      </main>
    </div>
)
}