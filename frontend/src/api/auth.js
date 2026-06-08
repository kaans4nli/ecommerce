import api from './axios'

export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials).then(r => r.data.data),

  getDashboard: () =>
    api.get('/admin/dashboard').then(r => r.data.data),

  me: () =>
    api.get('/auth/me').then(r => r.data.data),
}