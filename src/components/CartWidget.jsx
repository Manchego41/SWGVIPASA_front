// src/components/CartWidget.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

/** Lee de localStorage, sessionStorage y cookies con varias llaves posibles */
function getFromAllStores(keys) {
  for (const store of [localStorage, sessionStorage]) {
    for (const k of keys) {
      try {
        const v = store.getItem(k);
        if (v != null) return v;
      } catch (_) {}
    }
  }
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
  const raw = getFromAllStores(['user', 'usuario', 'profile']) || null;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function touchesCart(url = '') {
  const u = (url || '').toLowerCase();
  return u.includes('/cart') || u.includes('/carrito') || u.includes('/checkout-local') || u.includes('/checkout');
}

export default function CartWidget() {
  const navigate = useNavigate();

  // -------- auth reactivo (watcher) ----------
  const [authTick, setAuthTick] = useState(0);
  const prevSigRef = useRef('');
  const computeAuthSig = () => {
    const u = getFromAllStores(['user','usuario','profile']) || '';
    const t = getFromAllStores(['token','accessToken','authToken','jwt','jwt_token']) || '';
    return `${t}__${u}`;
  };
  useEffect(() => {
    const bumpIfChanged = () => {
      const sig = computeAuthSig();
      if (sig !== prevSigRef.current) {
        prevSigRef.current = sig;
        setAuthTick(v => v + 1);
      }
    };
    bumpIfChanged();
    const iv = setInterval(bumpIfChanged, 1000);
    const onFocus = () => bumpIfChanged();
    const onVisibility = () => bumpIfChanged();
    const onAuthChanged = () => bumpIfChanged();
    const onStorage = () => bumpIfChanged();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('auth:changed', onAuthChanged);
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(iv);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('auth:changed', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // user/token
  const user = useMemo(() => getUserFromStores(), [authTick]);
  const token =
    getFromAllStores(['token', 'accessToken', 'authToken', 'jwt', 'jwt_token']) ||
    user?.token || user?.accessToken || null;
  const isLogged = !!(token || user?._id || user?.id || user?.email);

  // -------- estado carrito ----------
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [busyItem, setBusyItem] = useState({}); // { [itemId]: boolean }

  useEffect(() => {
    if (!isLogged) setItems([]); // vacía al perder sesión
  }, [isLogged]);

  // interceptores para disparar cart:changed
  useEffect(() => {
    const reqId = API.interceptors.request.use((config) => {
      try {
        const m = (config.method || '').toLowerCase();
        const u = config.url || '';
        if (['post','put','patch','delete'].includes(m) && touchesCart(u)) {
          config.__touchesCart = true;
        }
      } catch (_) {}
      return config;
    });
    const resId = API.interceptors.response.use(
      (res) => {
        try {
          const m = (res.config?.method || '').toLowerCase();
          const u = res.config?.url || '';
          if (res.config?.__touchesCart || (['post','put','patch','delete'].includes(m) && touchesCart(u))) {
            window.dispatchEvent(new Event('cart:changed'));
          }
        } catch (_) {}
        return res;
      },
      (err) => {
        try {
          const m = (err.config?.method || '').toLowerCase();
          const u = err.config?.url || '';
          if (err.config?.__touchesCart || (['post','put','patch','delete'].includes(m) && touchesCart(u))) {
            window.dispatchEvent(new Event('cart:changed'));
          }
        } catch (_) {}
        return Promise.reject(err);
      }
    );
    return () => {
      API.interceptors.request.eject(reqId);
      API.interceptors.response.eject(resId);
    };
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await API.get('/cart', { headers });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[CartWidget] fetchCart error', e?.response || e);
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
    window.refreshCart = fetchCart;
    return () => {
      clearInterval(id);
      window.removeEventListener('cart:changed', onBump);
      if (window.refreshCart === fetchCart) delete window.refreshCart;
    };
  }, [token]);

  const total = items
    .filter(i => i.product && i.product.price != null)
    .reduce((sum, i) => sum + (Number(i.product.price) || 0) * (i.quantity || 0), 0);

  const handleOpen = () => setOpen(v => !v);

  const handleRemove = async (id) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await API.delete(`/cart/${id}`, { headers });
      setItems(prev => prev.filter(i => i._id !== id)); // optimista
      window.dispatchEvent(new Event('cart:changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // 🔢 Cambiar cantidad por unidad (–/+) con update optimista
  const changeQty = async (item, delta) => {
    const id = item._id;
    const current = item.quantity || 0;
    const next = current + delta;

    if (next <= 0) {
      return handleRemove(id);
    }

    // optimista
    setItems(prev => prev.map(it => it._id === id ? { ...it, quantity: next } : it));
    setBusyItem(prev => ({ ...prev, [id]: true }));

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // ⬇️ ajusta a tu API si usa otra ruta o verbo
      await API.patch(`/cart/${id}`, { quantity: next }, { headers });
      // Alternativas:
      // await API.put(`/cart/${id}`, { quantity: next }, { headers });
      // if (delta > 0) await API.post('/cart/add', { productId: item.product._id, quantity: 1 }, { headers });
      // else await API.post('/cart/removeOne', { itemId: id }, { headers });

      window.dispatchEvent(new Event('cart:changed'));
    } catch (e) {
      console.error('qty update failed', e);
      // revertir si falló
      setItems(prev => prev.map(it => it._id === id ? { ...it, quantity: current } : it));
      alert('No se pudo actualizar la cantidad');
    } finally {
      setBusyItem(prev => ({ ...prev, [id]: false }));
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
        window.dispatchEvent(new Event('cart:changed'));
        navigate('/profile');
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
      {/* Botón flotante (derecha) */}
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

      {/* Drawer lateral derecho */}
      <div className={`fixed inset-0 z-[9998] ${open ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
          className={`absolute top-0 right-0 h-full w-[420px] max-w-[92vw] bg-white shadow-2xl rounded-l-2xl overflow-hidden
                      transform transition-transform duration-300 ease-in-out will-change-transform
                      ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h4 className="text-lg font-semibold">Mi carrito</h4>
            <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-gray-100" aria-label="Cerrar">
              ✕
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {!isLogged ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p>Inicia sesión para ver tu carrito.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
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
                {items.map((item) => {
                  const id = item._id;
                  const q = item.quantity || 0;
                  const busy = !!busyItem[id];
                  return (
                    <li key={id} className="border rounded-lg p-2 flex gap-3 items-start">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name || 'Producto'}</p>
                        <p className="text-xs text-gray-500">S/ {(Number(item.product?.price) || 0).toFixed(2)}</p>

                        {/* 🔢 Stepper cantidad */}
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            disabled={busy || q <= 0}
                            onClick={() => changeQty(item, -1)}
                            className={`h-7 w-7 rounded-full border flex items-center justify-center text-lg leading-none ${
                              busy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                            aria-label="Disminuir cantidad"
                            title="Disminuir"
                          >
                            –
                          </button>
                          <span className="min-w-[2.5rem] text-center text-sm font-semibold">{q}</span>
                          <button
                            disabled={busy}
                            onClick={() => changeQty(item, +1)}
                            className={`h-7 w-7 rounded-full border flex items-center justify-center text-lg leading-none ${
                              busy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                            aria-label="Aumentar cantidad"
                            title="Aumentar"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Quitar */}
                      <button
                        onClick={() => handleRemove(id)}
                        className="text-xs bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
                        title="Quitar"
                      >
                        Quitar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-5 py-4 border-t bg-white">
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
                  paying || items.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {paying ? 'Guardando…' : 'Pagar'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

