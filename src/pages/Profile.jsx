import React, { useState, useEffect } from 'react'
import API from '../utils/api'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('compras')
  const [purchases, setPurchases] = useState([])
  const [search, setSearch] = useState('')
  
  // Datos del usuario
  const [user, setUser] = useState({ nombre: '', email: '' })
  const [loading, setLoading] = useState(false)

  // Cargar perfil
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get('/users/me')
        setUser({ nombre: data.nombre, email: data.email })
      } catch (err) {
        console.error('Error al cargar perfil', err)
      }
    }
    fetchUser()
  }, [])

  // Cargar compras
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

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const { data } = await API.put('/users/me', user)
      setUser({ nombre: data.nombre, email: data.email })
      alert('Perfil actualizado con éxito ✅')
    } catch (err) {
      console.error('Error al actualizar', err)
      alert('Error al actualizar perfil ❌')
    } finally {
      setLoading(false)
    }
  }

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
          <li
            onClick={() => setActiveTab('info')}
            className={`cursor-pointer ${activeTab === 'info' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
          >
            Información personal
          </li>
          <li
            onClick={() => setActiveTab('compras')}
            className={`cursor-pointer ${activeTab === 'compras' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
          >
            Compras
          </li>
          <li
            onClick={() => setActiveTab('facturacion')}
            className={`cursor-pointer ${activeTab === 'facturacion' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
          >
            Facturación
          </li>
          <li
            onClick={() => setActiveTab('entrega')}
            className={`cursor-pointer ${activeTab === 'entrega' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
          >
            Punto de entrega
          </li>
          <li
            onClick={() => setActiveTab('config')}
            className={`cursor-pointer ${activeTab === 'config' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
          >
            Configuración
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Información personal */}
        {activeTab === 'info' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Información personal</h1>
            <div className="space-y-4 max-w-md">
              <input
                type="text"
                name="nombre"
                value={user.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full px-4 py-2 border rounded"
              />
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}

        {/* Compras */}
        {activeTab === 'compras' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Compras</h1>
            <input
              type="text"
              placeholder="Buscar"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-6">
              {filtered.map(p => (
                <div key={p.id} className="bg-white rounded-lg p-4 shadow flex justify-between items-center">
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
          </div>
        )}

        {/* Facturación */}
        {activeTab === 'facturacion' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Facturación</h1>
            <p className="text-gray-600">Aquí podrás gestionar tus facturas, datos de pago y comprobantes.</p>
            {/* TODO: Agregar lógica de facturación */}
          </div>
        )}

        {/* Punto de entrega */}
        {activeTab === 'entrega' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Punto de entrega</h1>
            <p className="text-gray-600">Configura direcciones de envío y puntos de entrega frecuentes.</p>
            {/* TODO: Agregar lógica de direcciones */}
          </div>
        )}

        {/* Configuración */}
        {activeTab === 'config' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Configuración</h1>
            <p className="text-gray-600">Opciones de seguridad, notificaciones y preferencias de cuenta.</p>
            {/* TODO: Agregar lógica de configuración */}
          </div>
        )}
      </main>
    </div>
  )
}