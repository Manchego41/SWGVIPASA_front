// src/components/HeroBanner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import API from "../utils/api";
import { useCart } from "../context/CartContext";

function pick(valA, ...alts) {
  if (valA !== undefined && valA !== null) return valA;
  for (const v of alts) if (v !== undefined && v !== null) return v;
  return undefined;
}

export default function HeroBanner() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const timerRef = useRef(null);

  // Trae productos y mapea campos comunes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await API.get("/products");
        if (!mounted) return;

        const mapped = (Array.isArray(data) ? data : data?.items || [])
          .slice(0, 5)
          .map((p) => {
            const id    = pick(p._id, p.id);
            const name  = pick(p.name, p.nombre, "Producto");
            const desc  = pick(p.description, p.descripcion, "Encuentra calidad al mejor precio.");
            const price = Number(p.price ?? p.precio ?? 0);
            const stock = pick(p.stock, p.existencia, p.cantidad, 0);
            const img   = pick(
              p.imageUrl,
              p.imagenUrl,
              Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
              "https://via.placeholder.com/1200x600?text=Sin+imagen"
            );
            return { id, name, desc, price, stock, img };
          });

        setSlides(mapped);
      } catch (e) {
        console.error("HeroBanner: error trayendo productos", e);
        // Fallback simple
        setSlides([
          {
            id: "demo-1",
            name: "Batería Automotriz (ROCKET)",
            desc: "Batería libre de mantenimiento. Alta capacidad de arranque.",
            price: 300,
            stock: 15,
            img: "https://via.placeholder.com/1200x600.png?text=Bateria+ROCKET",
          },
        ]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-avance
  useEffect(() => {
    if (hover || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [hover, slides]);

  const go = (next) => {
    if (!slides.length) return;
    setIdx((i) => (i + next + slides.length) % slides.length);
  };

  const current = useMemo(() => slides[idx] || null, [slides, idx]);

  if (!current) {
    return <div className="w-full h-[420px] md:h-[520px] bg-gray-100 animate-pulse rounded-xl" />;
  }

  return (
    <section
      className="relative w-full rounded-xl overflow-hidden mb-10 shadow"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Fondo */}
      <div
        className="h-[420px] md:h-[520px] w-full bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0,48,62,0.55), rgba(0,48,62,0.55)), url('${current.img}')`,
        }}
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 grid grid-cols-12 gap-6">
          {/* Texto */}
          <div className="col-span-12 md:col-span-7 text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow">
              {current.name}
            </h2>
            <p className="mt-3 md:mt-4 text-white/90 text-lg md:text-xl max-w-2xl">
              {current.desc}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="text-2xl md:text-3xl font-bold">
                S/ {current.price.toFixed(2)}
              </div>
              {Number(current.stock) > 0 && (
                <span className="px-3 py-1 rounded-full text-sm bg-emerald-600/90">
                  Stock: {current.stock}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => current.id && addItem(current.id)}
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-semibold shadow"
              >
                <FiShoppingCart /> Agregar al Carrito
              </button>
              <button
                onClick={() => navigate("/catalogo")}
                className="inline-flex items-center justify-center gap-2 border border-white/80 text-white hover:bg-white/10 px-5 py-2.5 rounded-lg font-semibold"
              >
                Ver Más Productos
              </button>
            </div>
          </div>

          {/* Imagen en tarjeta (desktop) */}
          <div className="col-span-12 md:col-span-5">
            <div className="hidden md:flex justify-center">
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-5">
                <img
                  src={current.img}
                  alt={current.name}
                  className="w-[380px] h-[240px] object-contain rounded-xl bg-white"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/380x240?text=Sin+imagen";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flechas */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-teal-700 rounded-full w-10 h-10 grid place-items-center shadow"
          >
            <FiChevronLeft />
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-teal-700 rounded-full w-10 h-10 grid place-items-center shadow"
          >
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}