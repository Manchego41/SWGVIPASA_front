// src/pages/Home.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero: Bienvenidos */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#004157]">
            Bienvenidos a IPASA
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Repuestos automotrices de calidad, atención confiable y una
            experiencia de compra de calidad.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <NavLink
              to="/catalogo"
              className="px-6 py-3 rounded-lg bg-[#00AEEF] text-white font-medium hover:bg-opacity-90"
            >
              Ver Catálogo
            </NavLink>
            <a
              href="#contacto"
              className="px-6 py-3 rounded-lg border border-[#00AEEF] text-[#00AEEF] font-medium hover:bg-blue-50"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#004157] mb-2">
              Contáctanos
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Tienes alguna consulta? Envíanos un mensaje y te responderemos a la
              brevedad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Gracias por escribirnos. ¡Pronto nos pondremos en contacto!');
                  e.currentTarget.reset();
                }}
              >
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mensaje</label>
                  <textarea
                    rows="4"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00AEEF] text-white font-medium hover:bg-opacity-90"
                >
                  Enviar
                </button>
              </form>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-medium text-gray-800">ventas@ipasa.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-800">+51 922 402 449</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Horario</p>
                  <p className="font-medium text-gray-800">
                    Lun a Vie: 9:00 – 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}