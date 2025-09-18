// src/services/productosService.js
import api from '../utils/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const productosService = {
  getAll: async () => {
    try {
      const response = await api.get('/products', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },
};
