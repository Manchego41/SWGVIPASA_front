// src/pages/Home.jsx
import React from 'react';
import HeroBanner from '../components/HeroBanner';

export default function Home() {
  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Carrusel de productos (reemplaza el antiguo "Bienvenidos a IPASA") */}
      <section className="bg-transparent">
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <HeroBanner />
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
                  <p className="text-sm text-gray-500 font-semibold">Oficina Principal</p>
                  <p className="font-medium text-gray-800">Av. Republica de Panama 4085 - Surquillo</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-semibold">Almacenes</p>
                  <p className="font-medium text-gray-800">Calle Costa Azul s/n - Chorrillos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-semibold">Planta</p>
                  <p className="font-medium text-gray-800">Av. Manuel F Vega #151 - Chincha</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-medium text-gray-800">scliente@grupovega.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-800">(511) 213-7900</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Website</p>
                  <a href="http://www.grupovega.com" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
                    www.grupovega.com
                  </a>
                </div>
              </div>

              {/* Mapa de Google */}
              <div className="mt-8 md:col-span-2">
                <h3 className="text-xl font-semibold text-[#004157] mb-4">Ubicación de la Oficina Principal</h3>
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.357771407121!2d-77.02126362570654!3d-12.111355243983682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7e8de664ea5%3A0x5c7f326148da89a3!2sAv.%20Rep%C3%BAblica%20de%20Panam%C3%A1%204085%2C%20Surquillo%2015047!5e0!3m2!1ses!2spe!4v1699125397844!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de la Oficina Principal"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}