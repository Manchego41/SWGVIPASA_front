// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import API from '../utils/api';

const CartContext = createContext(null);

function readToken() {
  try {
    const raw = localStorage.getItem('user');
    const t = raw ? JSON.parse(raw)?.token : null;
    return t || localStorage.getItem('token') || null; // fallback legacy
  } catch {
    return localStorage.getItem('token') || null;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState(readToken());

  // Mantener token sincronizado si cambia en otra pestaña
  useEffect(() => {
    const onStorage = () => setToken(readToken());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const fetchCart = async () => {
    if (!readToken()) return; // no intentes si no hay token
    setLoading(true);
    try {
      const { data } = await API.get('/cart');
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch {
      setItems([]); // 401 u otro error → limpiar
    } finally {
      setLoading(false);
    }
  };

  // add 1 unidad (el backend incrementa si ya existe)
  const addItem = async (productId) => {
    if (!readToken()) {
      alert('Inicia sesión para agregar al carrito.');
      return;
    }
    try {
      await API.post('/cart', { productId });
      await fetchCart();
      setDrawerOpen(true);
    } catch (e) {
      console.error('Error agregando al carrito:', e);
      alert('No se pudo agregar al carrito.');
    }
  };

  // eliminar item completo o decrementar 1 (one=true) usando params (fiable)
  const removeItem = async (cartItemId, { one = false } = {}) => {
    try {
      await API.delete(`/cart/${cartItemId}`, {
        params: one ? { one: true } : {},
      });
      await fetchCart();
    } catch (e) {
      console.error('Error eliminando del carrito:', e);
    }
  };

  // Soporta ambas firmas:
  // - changeQty(it, delta)
  // - changeQty({ cartItemId, productId, delta })
  const changeQty = async (arg1, arg2) => {
    let cartItemId, productId, delta;
    if (typeof arg2 === 'number') {
      const it = arg1 || {};
      delta = arg2;
      cartItemId = it?._id;
      productId = it?.product?._id || it?.product;
    } else {
      ({ cartItemId, productId, delta } = arg1 || {});
    }

    if (!delta) return;
    if (delta > 0) {
      return addItem(productId);
    } else {
      // decrementa 1 (si llega a 0 lo elimina en backend)
      return removeItem(cartItemId, { one: true });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]); // cuando tengas token (login), carga el carrito

  const count = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((acc, it) => {
        const p = it.product || {};
        const price = p.price ?? p.precio ?? it.price ?? it.precio ?? 0;
        return acc + (Number(price) || 0) * (it.quantity || 0);
      }, 0),
    [items]
  );

  const value = {
    items,
    loading,
    fetchCart,
    addItem,
    removeItem,
    changeQty,
    count,
    subtotal,
    drawerOpen,
    setDrawerOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}