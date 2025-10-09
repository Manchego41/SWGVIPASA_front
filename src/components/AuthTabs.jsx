// src/components/AuthTabs.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/api'

export default function AuthTabs() {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const navigate = useNavigate()

  // --- LOGIN ---
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginMsg, setLoginMsg] = useState('')

  // --- REGISTER ---
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    terms: false,
  })
  const [regMsg, setRegMsg] = useState('')

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target
    setRegForm({ ...regForm, [name]: type === 'checkbox' ? checked : value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginMsg('')

    try {
      // Backend devuelve: { token, role, name }
      const { data } = await API.post('/auth/login', loginForm)

      // 🔧 Guardamos en "user" el token (lo que espera tu CartContext: user.token)
      const user = { token: data.token, role: data.role, name: data.name }
      localStorage.setItem('user', JSON.stringify(user))

      // (Opcional) limpiamos un posible token suelto legacy
      localStorage.removeItem('token')

      navigate('/')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Error al iniciar sesión'
      setLoginMsg(msg)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegMsg('')

    if (!regForm.terms) {
      setRegMsg('Debes aceptar los términos y condiciones.')
      return
    }
    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.password) {
      setRegMsg('Completa todos los campos.')
      return
    }
    if (regForm.password !== regForm.repeatPassword) {
      setRegMsg('Las contraseñas no coinciden.')
      return
    }

    try {
      await API.post('/auth/register', {
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
      })

      // Éxito: llevar al login y prellenar correo
      setTab('login')
      setLoginMsg('Registro exitoso. Inicia sesión.')
      setLoginForm({ email: regForm.email, password: '' })
      setRegForm({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        terms: false,
      })
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Error al registrarse'
      setRegMsg(msg)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow">
      {/* Tabs */}
      <div className="flex border-b-2">
        <button
          className={`flex-1 py-2 text-center ${
            tab === 'login'
              ? 'border-b-2 border-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setTab('login')}
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            tab === 'register'
              ? 'border-b-2 border-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setTab('register')}
        >
          Registrarse
        </button>
      </div>

      {/* LOGIN */}
      {tab === 'login' && (
        <form className="space-y-4 mt-6" onSubmit={handleLogin}>
          {loginMsg && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {loginMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="w-full border p-2 rounded"
              placeholder="correo@dominio.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="w-full border p-2 rounded"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
          <div className="text-right">
            <Link className="text-sm text-blue-600 underline" to="/forgot">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      )}

      {/* REGISTER */}
      {tab === 'register' && (
        <form className="space-y-4 mt-6" onSubmit={handleRegister}>
          {regMsg && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {regMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={regForm.name}
              onChange={handleRegisterChange}
              className="w-full border p-2 rounded"
              placeholder="Nombre completo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={regForm.email}
              onChange={handleRegisterChange}
              className="w-full border p-2 rounded"
              placeholder="correo@dominio.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={regForm.password}
              onChange={handleRegisterChange}
              className="w-full border p-2 rounded"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={regForm.repeatPassword}
              onChange={handleRegisterChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="terms"
              checked={regForm.terms}
              onChange={handleRegisterChange}
            />
            <span className="text-sm">
              He leído y acepto los{' '}
              <Link to="/terminos" className="text-blue-600 underline">
                términos y condiciones
              </Link>
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Registrarse
          </button>
        </form>
      )}
    </div>
  )
}