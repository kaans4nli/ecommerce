import api from './axios'

export const supplyRequestApi = {
  create: (data) =>
    api.post('/admin/supply-requests', data).then(r => r.data.data),

  getByStatus: (status) =>
    api.get('/admin/supply-requests', {
      params: { status }
    }).then(r => r.data.data),

  updateStatus: (id, status) =>
    api.patch(`/admin/supply-requests/${id}/status`, { status })
      .then(r => r.data.data),

  delete: (id) =>
    api.delete(`/admin/supply-requests/${id}`)
      .then(r => r.data),
}