// src/pages/Catalogo.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiDollarSign,
  FiX,
  FiGrid,
  FiInfo,
  FiAward,
} from "react-icons/fi";

const PAGE_SIZE = 12;
const SORTS = [
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "name_desc", label: "Nombre (Z-A)" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
];

// Helpers de sesión
const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const getUser = () => {
  const raw = localStorage.getItem("user");
  const u = safeParse(raw);
  if (!u && raw) localStorage.removeItem("user");
  return u;
};

export default function Catalogo() {
  const navigate = useNavigate();

  // Estados principales
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [page, setPage] = useState(1);

  // UI: feedback al agregar
  const [adding, setAdding] = useState(null); // productId que se está agregando

  // Cargar productos
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    API.get("/products")
      .then((res) => {
        if (!mounted) return;
        const productosData = res.data?.products ?? res.data;
        setAll(Array.isArray(productosData) ? productosData : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err.response?.data?.message ||
            "Error al cargar el catálogo. Verifica la conexión."
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Filtrado + ordenamiento
  const processed = useMemo(() => {
    let list = [...all];

    // Búsqueda
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Rango de precios
    const minVal = min === "" ? -Infinity : Number(min);
    const maxVal = max === "" ? Infinity : Number(max);
    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= minVal && price <= maxVal;
    });

    // Disponibilidad
    if (availability === "available")
      list = list.filter((p) => (p.countInStock ?? 0) > 0);
    if (availability === "out")
      list = list.filter((p) => (p.countInStock ?? 0) <= 0);

    // Orden
    list.sort((a, b) => {
      if (sort === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sort === "name_desc") return (b.name || "").localeCompare(a.name || "");
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      return 0;
    });

    return list;
  }, [all, search, min, max, availability, sort]);

  // Paginación
  const pages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, page]);

  // Reiniciar a página 1 cuando cambian filtros
  useEffect(() => {
    setPage(1);
  }, [search, min, max, availability, sort]);

  const resetFilters = () => {
    setSearch("");
    setMin("");
    setMax("");
    setAvailability("");
    setSort("name_asc");
  };

  // Agregar al carrito (vía API actual que ya usas)
  const addToCart = async (productId) => {
    const user = getUser();
    if (!user?.token) return navigate("/login");

    try {
      setAdding(productId);
      await API.post(
        "/cart",
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Producto agregado al carrito");
    } catch (e) {
      console.error(e);
      alert("No se pudo agregar al carrito");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <FiAward className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Catálogo de Productos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra exclusiva selección de productos de alta calidad
          </p>
        </div>

        {/* Buscador + botón filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Buscar productos por nombre o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
          >
            <FiFilter className="h-5 w-5" />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Filtros de Búsqueda
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors duration-200"
              >
                <FiX className="h-4 w-4" />
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rango de precios */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                  <FiDollarSign className="h-4 w-4 text-blue-500" />
                  Rango de precios
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Mínimo (S/)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="0"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Máximo (S/)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="1000"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Disponibilidad */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                  <FiBox className="h-4 w-4 text-blue-500" />
                  Disponibilidad
                </h3>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Todos los productos</option>
                  <option value="available">En stock</option>
                  <option value="out">Agotados</option>
                </select>
              </div>

              {/* Ordenar */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                  <FiFilter className="h-4 w-4 text-blue-500" />
                  Ordenar por
                </h3>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Info de resultados */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
          <p className="text-gray-700 text-lg font-medium">
            <span className="text-blue-600">{paged.length}</span> de{" "}
            <span className="text-blue-600">{processed.length}</span> productos
            encontrados
          </p>

          {processed.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              <FiInfo className="h-4 w-4" />
              <span>Catálogo de visualización</span>
            </div>
          )}
        </div>

        {/* Estado de carga (skeleton) */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="status"
          >
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-7 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && processed.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiGrid className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {all.length === 0 ? "Catálogo vacío" : "No se encontraron resultados"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {all.length === 0
                ? "No hay productos disponibles en este momento."
                : "Intenta ajustar tus filtros de búsqueda."}
            </p>
            {all.length > 0 && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && processed.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paged.map((prod) => {
                const inStock = (prod.countInStock ?? 0) > 0;
                return (
                  <div
                    key={prod._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 group"
                  >
                    {/* Imagen */}
                    <div className="relative overflow-hidden">
                      <img
                        src={prod.imageUrl || "/placeholder.png"}
                        alt={prod.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inStock
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {inStock ? "Disponible" : "Agotado"}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {prod.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {prod.description || "Sin descripción disponible"}
                      </p>

                      {/* Precio PEQUEÑO debajo de la descripción */}
                      <div className="text-[#0B2B3C] font-semibold">
                        <span className="text-base">
                          S/ {Number(prod.price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          <FiBox className="inline-block -mt-0.5 mr-1" />
                          {(prod.countInStock ?? 0)} und.
                        </span>
                      </div>

                      {/* Botón debajo del precio */}
                      <button
                        disabled={!inStock || adding === prod._id}
                        onClick={() => addToCart(prod._id)}
                        className={`mt-4 w-full rounded-lg py-2.5 text-white font-medium ${
                          !inStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : adding === prod._id
                            ? "bg-blue-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {!inStock
                          ? "Sin stock"
                          : adding === prod._id
                          ? "Agregando…"
                          : "Agregar al carrito"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {pages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  Página <span className="font-medium">{page}</span> de{" "}
                  <span className="font-medium">{pages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      let pageNum;
                      if (pages <= 5) pageNum = i + 1;
                      else if (page <= 3) pageNum = i + 1;
                      else if (page >= pages - 2) pageNum = pages - 4 + i;
                      else pageNum = page - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border transition-colors duration-200 ${
                            page === pageNum
                              ? "border-blue-600 bg-blue-600 text-white shadow-md"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pages > 5 && page < pages - 2 && (
                      <span className="px-2 text-gray-500">…</span>
                    )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Siguiente
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}