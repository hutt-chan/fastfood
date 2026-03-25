import api from './api.js';
export const getInventory    = ()     => api.get('/warehouse/inventory');
export const importStock     = (data) => api.post('/warehouse/import',  data);
export const exportStock     = (data) => api.post('/warehouse/export',  data);
export const getLowStock     = ()     => api.get('/warehouse/low-stock');
export const createStocktake = (data) => api.post('/warehouse/stocktake', data);
export const getReport       = (p)    => api.get(`/warehouse/report?${new URLSearchParams(p)}`);
export const createPurchaseReq= (d)   => api.post('/warehouse/purchase-request', d);
