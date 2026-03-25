import api from './api.js';
export const getBranchOrders   = ()          => api.get('/branch/orders');
export const getBranchMenu     = ()          => api.get('/branch/menu');
export const updateOrderStatus = (id, status)=> api.patch(`/orders/${id}/status`, { status });
export const assignDelivery    = (id, emp_id)=> api.patch(`/branch/orders/${id}/assign-delivery`, { delivery_person_id: emp_id });
export const getDeliveryStaff  = ()          => api.get('/branch/staff');
export const getRevenue        = (params)    => api.get(`/branch/revenue?${new URLSearchParams(params)}`);

