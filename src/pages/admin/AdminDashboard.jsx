import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function AdminDashboard() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/purchases");
        const data = await res.json();
        console.log("📦 Purchases fetched:", data);
        setSales(data);
      } catch (error) {
        console.error("❌ Error fetching purchases:", error);
      }
    };

    fetchSales();
  }, []);

  // 🔹 Calcular totales
  const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = sales.length; // cantidad de órdenes

  // 🔹 Datos para el gráfico
  const chartData = {
    labels: sales.map((s) =>
      s.createdAt
        ? new Date(s.createdAt).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Sin fecha"
    ),
    datasets: [
      {
        label: "Ventas (S/)",
        data: sales.map((s) => s.total || 0),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard del Administrador</h1>

      {/* Totales */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
          <h3>Total Ventas</h3>
          <p>S/ {totalSales.toFixed(2)}</p>
        </div>
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
          <h3>Total Órdenes</h3>
          <p>{totalOrders}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <h3>Historial de Ventas</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}
