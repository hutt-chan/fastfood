import api from './api.js';

export const getCategories = () => api.get('/menu/categories');
export const getProducts   = (params = {}) => api.get('/menu/products', params);