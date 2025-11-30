// src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import API from '../utils/api';

/**
 * ProfileForm
 * - initialProfile: objeto (puede ser null)
 * - token: string
 * - onSaved: callback(profile) cuando la petición PATCH devuelva el perfil actualizado
 *
 * Este componente muestra el botón "Editar datos" y el formulario inline para editar.
 */
export default function ProfileForm({ initialProfile = null, token, onSaved = () => {} }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    document: '',
    gender: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    zip: '',
    notes: ''
  });

  useEffect(() => {
    if (initialProfile) {
      setForm({
        firstName: initialProfile.firstName || '',
        lastName: initialProfile.lastName || '',
        document: initialProfile.document || '',
        gender: initialProfile.gender || '',
        phone: initialProfile.phone || '',
        birthDate: initialProfile.birthDate ? new Date(initialProfile.birthDate).toISOString().slice(0,10) : '',
        address: initialProfile.address || '',
        city: initialProfile.city || '',
        zip: initialProfile.zip || '',
        notes: initialProfile.notes || ''
      });
    } else {
      // si no hay perfil, iniciar vacío (el usuario puede crear)
      setForm(f => ({ ...f }));
    }
  }, [initialProfile]);

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const saveProfile = async () => {
    if (!token) {
      setMsg('No autenticado');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        // solo enviar los campos editables (patch)
        firstName: form.firstName,
        lastName: form.lastName,
        document: form.document,
        gender: form.gender,
        phone: form.phone,
        birthDate: form.birthDate || null,
        address: form.address,
        city: form.city,
        zip: form.zip,
        notes: form.notes
      };
      const res = await API.patch('/profile/me', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaving(false);
      setEditing(false);
      setMsg('Guardado correctamente');
      onSaved(res.data || null);
    } catch (err) {
      console.error('saveProfile', err);
      setSaving(false);
      setMsg(err?.response?.data?.message || 'Error guardando perfil');
    }
  };

  if (!editing) {
    return (
      <div>
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Editar datos
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-50 border rounded p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Nombre</label>
          <input value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Apellido</label>
          <input value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="text-xs text-gray-500">Documento</label>
          <input value={form.document} onChange={e => handleChange('document', e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Teléfono</label>
          <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="text-xs text-gray-500">Género</label>
          <select value={form.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full border p-2 rounded">
            <option value="">Selecciona</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Fecha de nacimiento</label>
          <input type="date" value={form.birthDate} onChange={e => handleChange('birthDate', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-gray-500">Dirección</label>
          <input value={form.address} onChange={e => handleChange('address', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="text-xs text-gray-500">Ciudad</label>
          <input value={form.city} onChange={e => handleChange('city', e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Código postal</label>
          <input value={form.zip} onChange={e => handleChange('zip', e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-gray-500">Notas</label>
          <textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)} className="w-full border p-2 rounded" rows={3} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={() => { setEditing(false); setMsg(''); }} className="px-3 py-2 border rounded">
          Cancelar
        </button>
        {msg && <div className="text-sm text-gray-600 ml-4">{msg}</div>}
      </div>
    </div>
  );
}