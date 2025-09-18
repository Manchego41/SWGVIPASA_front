// src/services/promocionesService.js
import api from '../utils/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');
  
  if (!token) {
    console.error('❌ No hay token - Redirigiendo a login');
    window.location.href = '/login';
    return {};
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Función para limpiar los datos antes de enviarlos
const cleanPromotionData = (promocionData) => {
  const cleanedData = { ...promocionData };
  
  // Si el código está vacío, null o undefined, lo eliminamos
  if (!cleanedData.codigo || cleanedData.codigo.trim() === '') {
    delete cleanedData.codigo;
  }
  
  // Asegurar que los arrays estén correctos
  if (cleanedData.productosAplicables && Array.isArray(cleanedData.productosAplicables)) {
    cleanedData.productosAplicables = cleanedData.productosAplicables.filter(p => p && p.trim() !== '');
  }
  
  return cleanedData;
};

export const promocionesService = {
  // Obtener todas las promociones (admin)
  getAll: async () => {
    try {
      console.log('📡 Intentando obtener promociones...');
      const response = await api.get('/promociones', getAuthHeaders());
      console.log('✅ Promociones obtenidas correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo promociones:', error.response?.data || error.message);
      throw error;
    }
  },

  // Crear nueva promoción (CORREGIDO)
  create: async (promocionData) => {
    try {
      // Limpiar los datos antes de enviar
      const cleanedData = cleanPromotionData(promocionData);
      console.log('📡 Creando nueva promoción:', cleanedData);
      
      const response = await api.post('/promociones', cleanedData, getAuthHeaders());
      console.log('✅ Promoción creada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error creando promoción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar promoción (CORREGIDO)
  update: async (id, promocionData) => {
    try {
      // Limpiar los datos antes de enviar
      const cleanedData = cleanPromotionData(promocionData);
      console.log('📡 Actualizando promoción:', id, cleanedData);
      
      const response = await api.put(`/promociones/${id}`, cleanedData, getAuthHeaders());
      console.log('✅ Promoción actualizada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando promoción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Eliminar promoción
  delete: async (id) => {
    try {
      console.log('📡 Eliminando promoción:', id);
      const response = await api.delete(`/promociones/${id}`, getAuthHeaders());
      console.log('✅ Promoción eliminada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando promoción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener promociones activas (pública)
  getActive: async () => {
    try {
      console.log('📡 Obteniendo promociones activas...');
      const response = await api.get('/promociones/activas');
      console.log('✅ Promociones activas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo promociones activas:', error.response?.data || error.message);
      throw error;
    }
  },

  // Validar código (pública)
  validateCode: async (codigo) => {
    try {
      console.log('📡 Validando código:', codigo);
      const response = await api.get(`/promociones/validar/${codigo}`);
      console.log('✅ Código validado');
      return response.data;
    } catch (error) {
      console.error('❌ Error validando código:', error.response?.data || error.message);
      throw error;
    }
  }
};