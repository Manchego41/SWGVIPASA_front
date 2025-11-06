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

  // Calcular totales
  const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = sales.length;

  // Datos del gráfico
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
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#333",
          marginBottom: "2rem",
          fontWeight: 700,
          fontSize: "1.8rem",
        }}
      >
        📊 Dashboard del Administrador
      </h1>

      {/* Contenedor de totales */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 250px",
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#555",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Total Ventas
          </h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "#4CAF50",
            }}
          >
            S/ {totalSales.toFixed(2)}
          </p>
        </div>

        <div
          style={{
            flex: "1 1 250px",
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#555",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Total Órdenes
          </h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "#2196F3",
            }}
          >
            {totalOrders}
          </p>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              color: "#333",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Historial de Ventas
          </h3>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Evolución diaria de las ventas registradas
          </p>
        </div>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
                labels: { color: "#333" },
              },
            },
            scales: {
              x: {
                ticks: { color: "#555" },
                grid: { color: "rgba(200,200,200,0.1)" },
              },
              y: {
                ticks: { color: "#555" },
                grid: { color: "rgba(200,200,200,0.1)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
