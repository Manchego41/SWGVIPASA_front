// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../utils/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const token = stored?.token;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchCart = async () => {
    if (!token) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get("/cart", { headers: authHeaders });
      // Filtra ítems con product válido
      setItems(Array.isArray(data) ? data.filter(i => i.product) : []);
    } catch (e) {
      console.error("Error cargando carrito:", e);
    } finally {
      setLoading(false);
    }
  };

  // add 1 (backend ya incrementa si existe)
  const addItem = async (productId) => {
    if (!token) {
      alert("Inicia sesión para agregar al carrito.");
      return;
    }
    try {
      await API.post("/cart", { productId }, { headers: authHeaders });
      await fetchCart();
      setDrawerOpen(true);
    } catch (e) {
      console.error("Error agregando al carrito:", e);
      alert("No se pudo agregar al carrito.");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await API.delete(`/cart/${cartItemId}`, { headers: authHeaders });
      setItems(prev => prev.filter(i => i._id !== cartItemId));
    } catch (e) {
      console.error("Error quitando item:", e);
    }
  };

  // Cambiar cantidad (+1 / -1). Para -1, si queda 0 lo quitamos
  const changeQty = async (cartItem, delta) => {
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      await removeItem(cartItem._id);
      return;
    }
    try {
      // Simplemente repetimos add o hacemos remove y add; si tienes endpoint PUT, úsalo aquí
      await API.post("/cart", { productId: cartItem.product._id }, { headers: authHeaders });
      if (delta < 0) {
        // “bajar” a fuerza bruta: quitamos y reinsertamos newQty veces
        // para no hacer bucles de red: recarga completa
        await fetchCart();
      } else {
        await fetchCart();
      }
    } catch (e) {
      console.error("Error cambiando cantidad:", e);
    }
  };

  const count = useMemo(() => items.reduce((s, it) => s + (it.quantity || 0), 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.product?.price || 0) * (it.quantity || 0)), 0),
    [items]
  );

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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