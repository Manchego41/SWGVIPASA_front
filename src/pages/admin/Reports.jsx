// src/pages/admin/Reportes.jsx
import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function Reportes() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/reports/summary")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("Error cargando reportes:", err);
        // fallback si la API no responde
        setReports([
          {
            id: "fake1",
            titulo: "Usuarios Registrados",
            valor: 10,
            descripcion: "Ejemplo de fallback: usuarios ficticioS",
          },
          {
            id: "fake2",
            titulo: "Productos Disponibles",
            valor: 5,
            descripcion: "Ejemplo de fallback: productos ficticios",
          },
        ]);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reportes del Sistema</h1>
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Reporte</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r.id}>
                <td className="py-2 px-4 border-b">{r.titulo}</td>
                <td className="py-2 px-4 border-b">{r.valor}</td>
                <td className="py-2 px-4 border-b">{r.descripcion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-2 px-4 text-center text-gray-500">
                No hay reportes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
