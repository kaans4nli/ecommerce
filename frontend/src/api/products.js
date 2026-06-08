import api from './axios'

export const productApi = {
  getAll: (params = {}) =>
    api.get('/products', { params }).then(r => r.data.data),

  getById: (id) =>
    api.get(`/products/${id}`).then(r => r.data.data),

  getFeatured: (params = {}) =>
    api.get('/products/featured', { params }).then(r => r.data.data),

  getDiscounted: (params = {}) =>
    api.get('/products/discounted', { params }).then(r => r.data.data),

  searchProducts: (query) =>
    api.get('/products/search', {
      params: {
        query,
        page: 0,
        size: 10
      }
    }).then(r => r.data.data),

  // Admin
  getAllAdmin: (params = {}) =>
    api.get('/admin/products', { params })
      .then(r => r.data.data),

  create: (data) =>
    api.post('/admin/products', data).then(r => r.data.data),

  update: (id, data) =>
    api.put(`/admin/products/${id}`, data).then(r => r.data.data),

  delete: (id) =>
    api.delete(`/admin/products/${id}`).then(r => r.data),

  uploadImage: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/admin/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data.data)
  },

  uploadImages: (id, files) => {
    const formData = new FormData()
    files.forEach((file, idx) => {
      formData.append('files', file)
    })
    return api.post(`/admin/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data.data)
  },

  updateImageOrders: (id, data) =>
    api.put(`/admin/products/${id}/images/order`, data)
      .then(r => r.data.data),

  deleteImage: async (imageId) => {
    const response = await api.delete(
      `/admin/products/images/${imageId}`
    )

    return response.data.data
  },
}