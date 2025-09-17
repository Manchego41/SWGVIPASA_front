// src/pages/admin/Reports.jsx
import React from "react";

export default function Reports() {
  // Datos simulados (más adelante los traerás del backend)
  const data = [
    {
      id: 1,
      titulo: "Usuarios activos",
      valor: 128,
      descripcion: "Cantidad de usuarios que iniciaron sesión en los últimos 30 días",
    },
    {
      id: 2,
      titulo: "Productos en catálogo",
      valor: 57,
      descripcion: "Total de productos publicados en la tienda",
    },
    {
      id: 3,
      titulo: "Ventas del mes",
      valor: 342,
      descripcion: "Transacciones confirmadas en el último mes",
    },
    {
      id: 4,
      titulo: "Ingresos estimados",
      valor: "$12,450",
      descripcion: "Monto total aproximado generado este mes",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Reportes del sistema</h1>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">Reporte</th>
              <th className="py-3 px-6">Valor</th>
              <th className="py-3 px-6">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reporte, index) => (
              <tr
                key={reporte.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-4 px-6 font-medium">{reporte.titulo}</td>
                <td className="py-4 px-6 text-blue-600 font-bold">
                  {reporte.valor}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {reporte.descripcion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Nota: estos datos son de ejemplo y se actualizarán automáticamente cuando
        el backend esté conectado.
      </p>
    </div>
  );
}