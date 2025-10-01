import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log('✅ Productos.jsx actualizado cargado');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProductos(res.data.products);

      const cantidadesIniciales = {};
      res.data.products.forEach((prod) => {
        cantidadesIniciales[prod._id] = 1;
      });
      setCantidades(cantidadesIniciales);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleAddToCart = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    await API.post('/cart/add', {
      productId,
      quantity: cantidades[productId] || 1,
    });

    // 🔔 Notificar al widget del carrito:
    window.dispatchEvent(new Event('cart:changed'));
    // (opcional)
    if (window.refreshCart) window.refreshCart();

    alert('✅ Producto agregado al carrito');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('❌ No se pudo agregar al carrito');
  }
};


  const handleChangeCantidad = (productId, nuevaCantidad, stock) => {
    let cantidad = parseInt(nuevaCantidad);
    if (isNaN(cantidad)) cantidad = 1;
    if (cantidad < 1) cantidad = 1;
    if (cantidad > stock) cantidad = stock;

    setCantidades((prev) => ({
      ...prev,
      [productId]: cantidad,
    }));
  };

  const aumentar = (productId, stock) => {
    setCantidades((prev) => {
      const actual = prev[productId] || 1;
      const nueva = Math.min(actual + 1, stock);
      return { ...prev, [productId]: nueva };
    });
  };

  const disminuir = (productId) => {
    setCantidades((prev) => {
      const actual = prev[productId] || 1;
      const nueva = Math.max(actual - 1, 1);
      return { ...prev, [productId]: nueva };
    });
  };

  // Si aún no cargan los productos, mostrar mensaje de carga
  if (!productos.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Cargando productos...</h2>
        <p className="text-gray-500">Verifica que el backend esté en funcionamiento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <div
            key={prod._id}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md flex flex-col"
          >
            {prod.imageUrl && (
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{prod.name}</h2>
            <p className="text-gray-700 mb-2">{prod.description}</p>
            <p className="text-gray-700 mb-2 font-semibold">S/ {prod.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-3">Stock disponible: {prod.countInStock}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={() => disminuir(prod._id)}
                  className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={prod.countInStock}
                  value={cantidades[prod._id] || 1}
                  onChange={(e) =>
                    handleChangeCantidad(prod._id, e.target.value, prod.countInStock)
                  }
                  className="w-14 text-center border-t border-b border-gray-300"
                />
                <button
                  onClick={() => aumentar(prod._id, prod.countInStock)}
                  className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(prod._id)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;