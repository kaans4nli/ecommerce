import api from './axios'

export const categoryApi = {
  getAll: () =>
    api.get('/categories').then(r => r.data.data),

  getById: (id) =>
    api.get(`/categories/${id}`).then(r => r.data.data),

  // Admin
  create: (data) =>
    api.post('/admin/categories', data).then(r => r.data.data),

  update: (id, data) =>
    api.put(`/admin/categories/${id}`, data).then(r => r.data.data),

  delete: (id) =>
    api.delete(`/admin/categories/${id}`).then(r => r.data),
}