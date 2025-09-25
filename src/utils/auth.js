// src/utils/auth.js
export function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem('user');
  const user = safeParse(raw);
  // si estaba corrupto, lo limpiamos para no volver a fallar
  if (!user && raw) localStorage.removeItem('user');
  return user;
}

export function setStoredUser(userObj) {
  if (!userObj) {
    localStorage.removeItem('user');
    return;
  }
  localStorage.setItem('user', JSON.stringify(userObj));
}

export function getToken() {
  return getStoredUser()?.token || null;
}

export function logout() {
  localStorage.removeItem('user');
  sessionStorage.clear();
}