// src/components/HeroBanner.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroBanner({ productos = [] }) {
  const navigate = useNavigate();

  // Si no hay productos, mostrar banner por defecto
  if (!productos || productos.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-[#004157] to-[#00AEEF] text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bienvenidos a IPASA
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            Repuestos automotrices de calidad, atención confiable y una experiencia de compra sencilla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-white text-[#004157] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Ver Catálogo
              <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#004157] transition-colors"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Función para agregar al carrito
  const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.token) {
      navigate('/login');
      return;
    }

    try {
      await API.post(
        '/cart',
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('No se pudo agregar al carrito');
    }
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false 
        }}
        loop={true}
        speed={800}
        className="h-[600px] w-full"
      >
        {productos.slice(0, 6).map((producto, index) => (
          <SwiperSlide key={producto._id || index}>
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 65, 87, 0.7), rgba(0, 174, 239, 0.5)), url(${producto.imageUrl || '/placeholder-hero.jpg'})`
              }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto px-4 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Información del producto */}
                    <div className="text-white">
                      <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                        {producto.name}
                      </h2>
                      <p className="text-lg sm:text-xl mb-6 opacity-90 line-clamp-3">
                        {producto.description || 'Producto de alta calidad para tu vehículo'}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold">
                          S/ {Number(producto.price || 0).toFixed(2)}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          Stock: {producto.countInStock || 0}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleAddToCart(producto._id)}
                          className="bg-white text-[#004157] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart className="w-5 h-5" />
                          Agregar al Carrito
                        </button>
                        <button
                          onClick={() => navigate('/catalogo')}
                          className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#004157] transition-colors"
                        >
                          Ver Más Productos
                        </button>
                      </div>
                    </div>

                    {/* Imagen del producto (opcional) */}
                    {producto.imageUrl && (
                      <div className="hidden lg:flex justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <img
                            src={producto.imageUrl}
                            alt={producto.name}
                            className="w-80 h-80 object-contain rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Estilos personalizados para Swiper */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #00AEEF;
          opacity: 1;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}