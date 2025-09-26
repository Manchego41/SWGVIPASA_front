// src/components/CartWidget.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

/** Lee de localStorage, sessionStorage y cookies con varias llaves posibles */
function getFromAllStores(keys) {
  // 1) storages
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      try {
        const v = store.getItem(k);
        if (v != null) return v;
      } catch (_) {}
    }
  }
  // 2) cookies
  try {
    const cookies = document.cookie || '';
    for (const k of keys) {
      const re = new RegExp(`(?:^|;\\s*)${k}=([^;]+)`);
      const m = cookies.match(re);
      if (m) return decodeURIComponent(m[1]);
    }
  } catch (_) {}
  return null;
}

function getUserFromStores() {
  const raw =
    getFromAllStores(['user', 'usuario', 'profile']) ||
    null;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function CartWidget() {
  const navigate = useNavigate();

  // --- Detección amplia de sesión ---
  const user = useMemo(() => getUserFromStores(), []);
  const token =
    getFromAllStores(['token', 'accessToken', 'authToken', 'jwt', 'jwt_token']) ||
    user?.token ||
    user?.accessToken ||
    null;

  // Consideramos sesión si hay token, o si hay user con algún identificador,
  // o si hay una cookie “token” (ya la cubre getFromAllStores arriba).
  const isLogged = !!(
    token ||
    user?._id ||
    user?.id ||
    user?.email
  );

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  // Logs para depurar (puedes quitarlos)
  useEffect(() => {
    console.log('[CartWidget] token?', !!token, 'user?', !!user, 'isLogged?', isLogged);
  }, [token, user, isLogged]);

  // Escucha cambios en /cart hechos desde cualquier parte del sitio
  useEffect(() => {
    const resId = API.interceptors.response.use(
      (res) => {
        try {
          const m = (res.config?.method || '').toLowerCase();
          const u = res.config?.url || '';
          if (u.includes('/cart') && ['post', 'delete', 'put', 'patch'].includes(m)) {
            window.dispatchEvent(new Event('cart:changed'));
          }
        } catch (_) {}
        return res;
      },
      (err) => Promise.reject(err)
    );
    return () => API.interceptors.response.eject(resId);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Si hay token lo enviamos; si no, probamos igual (por si usas cookie HttpOnly)
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await API.get('/cart', { headers });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[CartWidget] fetchCart error', e?.response || e);
      // si 401, mantenemos items vacíos
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const id = setInterval(fetchCart, 8000);
    const onBump = () => fetchCart();
    window.addEventListener('cart:changed', onBump);
    return () => {
      clearInterval(id);
      window.removeEventListener('cart:changed', onBump);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const total = items
    .filter(i => i.product && i.product.price != null)
    .reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // <<< CAMBIO CLAVE: NO redirigimos al login al abrir >>>
  const handleOpen = () => setOpen(v => !v);

  const handleRemove = async (id) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await API.delete(`/cart/${id}`, { headers });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    if (!isLogged) {
      navigate('/login');
      return;
    }
    try {
      setPaying(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await API.post('/cart/checkout-local', {}, { headers });
      if (res.status >= 200 && res.status < 300) {
        alert('✅ Compra guardada.');
        setItems([]);
        setOpen(false);
        navigate('/profile'); // ajusta si tu historial está en otra ruta
      } else {
        alert('No se pudo registrar la compra');
      }
    } catch (e) {
      console.error(e);
      alert('Error procesando el pago');
    } finally {
      setPaying(false);
    }
  };

  const count = items.reduce((n, i) => n + (i.quantity || 0), 0);

  return (
    <>
      {/* Botón flotante (encima del soporte) */}
      <button
        aria-label="Abrir mini-carrito"
        onClick={handleOpen}
        className="fixed bottom-28 right-6 z-[9999] h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700"
        title="Carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 .001 4A2 2 0 0 0 17 18zM7.334 6h12.08a1 1 0 0 1 .98 1.197l-1.2 6A1 1 0 0 1 18.22 14H9.112a1 1 0 0 1-.977-.783L6.28 3H3a1 1 0 1 1 0-2h4a1 1 0 0 1 .977.783L8.39 6z"/>
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
            {count}
          </span>
        )}
      </button>

      {/* Drawer lateral */}
      {open && (
        <div className="fixed inset-0 z-[9998]">
          <div className="absolute inset-0 bg-black/25" onClick={() => setOpen(false)} />
          <div className="absolute right-6 bottom-28 w-[320px] max-h-[65vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h4 className="font-semibold">Mi carrito</h4>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">✕</button>
            </div>

            <div className="p-3 overflow-y-auto flex-1">
              {!isLogged ? (
                <div className="text-sm text-gray-700 space-y-2">
                  <p>Inicia sesión para ver tu carrito.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded bg-blue-600 text-white px-3 py-1 text-sm hover:bg-blue-700"
                  >
                    Ir a iniciar sesión
                  </button>
                </div>
              ) : loading ? (
                <p className="text-sm text-gray-500">Cargando…</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item._id} className="border rounded-lg p-2 flex gap-2 items-start">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name || 'Producto'}</p>
                        <p className="text-xs text-gray-500">
                          Cant: {item.quantity} · S/ {(item.product?.price ?? 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-xs bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
                        title="Quitar"
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-4 py-3 border-t bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (isLogged ? navigate('/cart') : navigate('/login'))}
                  className="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Ver carrito
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={paying || items.length === 0}
                  className={`flex-1 rounded-xl text-white px-3 py-2 text-sm ${
                    paying || items.length === 0
                      ? 'bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {paying ? 'Guardando…' : 'Pagar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


