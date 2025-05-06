// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de importar los estilos de Tailwind
import App from './App'; // Importa el componente principal

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);