// src/components/AuthTabs.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/api'

export default function AuthTabs() {
  const [tab, setTab] = useState('login')
  const navigate = useNavigate()

  // Login state
  const [loginForm, setLoginForm] = useState({ email:'', password:'' })
  const [loginMsg, setLoginMsg] = useState('')

  // Register state
  const [regForm, setRegForm] = useState({
    name:'', email:'', password:'', repeatPassword:'', terms:false
  })
  const [regMsg, setRegMsg] = useState('')

  // Handlers
  const handleLogin = async e => {
    e.preventDefault()
    setLoginMsg('')
    try {
      const { data } = await API.post('/auth/login', loginForm)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setLoginMsg(err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setRegMsg('')
    const { name, email, password, repeatPassword, terms } = regForm

    if (!terms) {
      setRegMsg('Debes aceptar los términos y condiciones')
      return
    }
    if (password !== repeatPassword) {
      setRegMsg('Las contraseñas no coinciden')
      return
    }
    try {
      await API.post('/auth/register', { name, email, password })
      setTab('login')
      setLoginMsg('¡Registro exitoso! Ingresa para continuar.')
    } catch (err) {
      setRegMsg(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 py-2 text-center ${tab==='login' ? 'border-b-2 border-blue-600 font-semibold':''}`}
          onClick={()=>setTab('login')}
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 py-2 text-center ${tab==='register' ? 'border-b-2 border-blue-600 font-semibold':''}`}
          onClick={()=>setTab('register')}
        >
          Registrarse
        </button>
      </div>

      {tab==='login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          {loginMsg && <p className="text-red-500 text-sm">{loginMsg}</p>}
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={e=>setLoginForm({...loginForm,[e.target.name]:e.target.value})}
            placeholder="Correo electrónico"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={e=>setLoginForm({...loginForm,[e.target.name]:e.target.value})}
            placeholder="Contraseña"
            required
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Entrar
          </button>
          <p className="text-center text-sm">
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={()=>setTab('register')} className="text-blue-600">
              Regístrate
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          {regMsg && <p className="text-red-500 text-sm">{regMsg}</p>}
          <input
            type="text"
            name="name"
            value={regForm.name}
            onChange={e=>setRegForm({...regForm,[e.target.name]:e.target.value})}
            placeholder="Nombre completo"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={regForm.email}
            onChange={e=>setRegForm({...regForm,[e.target.name]:e.target.value})}
            placeholder="Correo electrónico (@gmail.com)"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={regForm.password}
            onChange={e=>setRegForm({...regForm,[e.target.name]:e.target.value})}
            placeholder="Contraseña"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="repeatPassword"
            value={regForm.repeatPassword}
            onChange={e=>setRegForm({...regForm,[e.target.name]:e.target.value})}
            placeholder="Repita contraseña"
            required
            className="w-full border p-2 rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="terms"
              checked={regForm.terms}
              onChange={e=>setRegForm({...regForm,terms:e.target.checked})}
              required
            />
            <span className="text-sm">
              He leído y acepto los{' '}
              <Link to="/terminos" className="text-blue-600 underline">
                términos y condiciones
              </Link>
            </span>
          </label>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Registrarse
          </button>
        </form>
      )}
    </div>
  )
}