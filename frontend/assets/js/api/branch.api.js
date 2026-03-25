import api from './api.js';
export const getBranchOrders   = ()          => api.get('/branch/orders');
export const getBranchMenu     = ()          => api.get('/branch/menu');
export const addMenuItem       = (data)      => api.post('/branch/menu', data);
export const updateMenuItem    = (id, data)  => api.put(`/branch/menu/${id}`, data);
export const deleteMenuItem    = (id)        => api.delete(`/branch/menu/${id}`);
export const updateOrderStatus = (id, status)=> api.patch(`/branch/orders/${id}/status`, { status });
export const rejectOrder       = (id, reason) => api.patch(`/branch/orders/${id}/reject`, { reason });
export const assignDelivery    = (id, emp_id)=> api.patch(`/branch/orders/${id}/assign-delivery`, { delivery_person_id: emp_id });
export const getDeliveryStaff  = ()          => api.get('/branch/staff');
export const createStaff       = (data)      => api.post('/branch/staff', data);
export const updateStaff       = (id, data)  => api.patch(`/branch/staff/${id}`, data);
export const disableStaff      = (id)        => api.delete(`/branch/staff/${id}`);
export const getRevenue        = (params)    => api.get(`/branch/revenue?${new URLSearchParams(params)}`);

