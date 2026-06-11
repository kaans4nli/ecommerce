import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message
    const data = error.response?.data?.data

    if (status === 400) {
      // Validation errors from backend
      if (typeof data === 'object' && data !== null) {
        const errorMessages = Object.values(data).join(', ')
        toast.error(errorMessages || message || 'Lütfen girişi kontrol edin')
      } else {
        toast.error(message || 'Geçersiz istek')
      }
    } else if (status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    } else if (status === 403) {
      toast.error('Bu işlem için yetkiniz bulunmuyor')
    } else if (status === 404) {
      // handled in components
    } else if (status >= 500) {
      toast.error('Sunucu hatası. Lütfen tekrar deneyin.')
    }

    return Promise.reject(error)
  }
)

export default api