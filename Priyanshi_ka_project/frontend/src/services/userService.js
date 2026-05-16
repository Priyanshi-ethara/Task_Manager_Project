import api from './api';

export const listUsers = (params) => api.get('/users', { params }).then((r) => r.data);
export const getUser = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const updateRole = (id, role) =>
  api.put(`/users/${id}/role`, { role }).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);
