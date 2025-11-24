// src/pages/Home.jsx
import React from 'react';
import HeroBanner from '../components/HeroBanner';

export default function Home() {
  // Ruta local del hero (imagen que subiste). Si prefieres ponerla en /public usa '/IPASA%20LOGO.jpeg'
  const heroImg = '/mnt/data/3290012e-ed72-4593-bac6-d3e4e5ddadf4.png';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero (componente existente). Si tu HeroBanner soporta props para imagen, pásala;
          si no, el componente seguirá mostrando lo que ya hacía. */}
      <section className="bg-transparent pt-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Si tu HeroBanner acepta prop 'background', le paso la imagen; si no lo acepta,
              el componente seguirá igual y la imagen queda disponible */}
          <HeroBanner backgroundImage={heroImg} />
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
              ¿Tienes alguna consulta? Envíanos un mensaje y te responderemos a la brevedad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulario (izquierda) */}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: conectarlo a tu end-point de contacto si existe
                  alert('Gracias por escribirnos. ¡Pronto nos pondremos en contacto!');
                  e.currentTarget.reset();
                }}
              >
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mensaje</label>
                  <textarea
                    name="message"
                    rows="5"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
                    placeholder="Escribe tu mensaje aquí…"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00AEEF] text-white font-medium hover:bg-opacity-90"
                  >
                    Enviar
                  </button>
                </div>
              </form>

              {/* Tarjetas de contacto (derecha) */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Oficina Principal</p>
                  <p className="font-medium text-gray-800">Av. República de Panamá 4085 - Surquillo</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Almacenes</p>
                  <p className="font-medium text-gray-800">Calle Costa Azul s/n - Chorrillos</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Planta</p>
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
                  <p className="font-medium text-gray-800">
                    <a href="https://www.grupovega.com" target="_blank" rel="noreferrer" className="text-sky-600">
                      www.grupovega.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa (iframe) */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Ubicación de la Oficina Principal</h3>
              <div className="w-full h-[420px] rounded-lg overflow-hidden shadow-lg">
                {/* Usamos query 'q=' para evitar el pb inválido si no tienes API key */}
                <iframe
                  title="Ubicación de la Oficina Principal"
                  src="https://www.google.com/maps?q=Av.+Rep%C3%BAblica+de+Panam%C3%A1+4085+Surquillo&output=embed"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}