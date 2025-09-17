import React, { useState, useEffect } from 'react';

const StockManager = () => {
  // Datos de ejemplo (simulados)
  const [products, setProducts] = useState([
    { id: 1, name: 'Muelles Elefante', stock: 15, price: 105.00 },
    { id: 2, name: 'Focos y Luces Automotrices', stock: 8, price: 25.00 },
    { id: 3, name: 'Cruceta Universal', stock: 22, price: 129.00 },
    { id: 4, name: 'Cilindro Maestro de Embrague', stock: 5, price: 250.00 },
    { id: 5, name: 'Válvulas de Motor (ROCHY)', stock: 18, price: 35.00 }
  ]);

  const [editingStock, setEditingStock] = useState({});

  const handleStockChange = (productId, newStock) => {
    setEditingStock(prev => ({
      ...prev,
      [productId]: parseInt(newStock) || 0
    }));
  };

  const updateStock = (productId) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, stock: editingStock[productId] }
        : product
    );
    
    setProducts(updatedProducts);
    
    // Limpiar edición
    setEditingStock(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });

    alert(`Stock actualizado para producto ID: ${productId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Stock</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock Actual</th>
              <th className="px-4 py-2 border">Nuevo Stock</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{product.id}</td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">S/ {product.price.toFixed(2)}</td>
                <td className="px-4 py-2 border">{product.stock}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={editingStock[product.id] ?? product.stock}
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                    min="0"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => updateStock(product.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManager;