import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password.trim()) {
      setError('Kullanıcı adı ve şifre zorunludur.')
      return
    }

    setLoading(true)
    try {
      const data = await authApi.login(form)
      login(data.token, { username: data.username, fullName: data.fullName })
      // Sync token for axios interceptor
      localStorage.setItem('admin_token', data.token)
      toast.success(`Hoş geldiniz, ${data.username}!`)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      const msg =
        status === 404
          ? 'API adresi bulunamadı. Canlı ortam VITE_API_URL ayarını kontrol edin.'
          : err.response?.data?.message || 'Kullanıcı adı veya şifre hatalı.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-white tracking-widest mb-2">
            YUCESOY
          </h1>
          <p className="text-stone-500 text-sm tracking-widest uppercase">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-6">Giriş Yap</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                            text-red-400 text-sm px-4 py-3 mb-6">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full bg-stone-800 border border-stone-700 text-white text-sm
                             pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500
                             placeholder:text-stone-600 transition-colors"
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-stone-800 border border-stone-700 text-white text-sm
                             pl-10 pr-10 py-3 focus:outline-none focus:border-amber-500
                             placeholder:text-stone-600 transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500
                             hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-amber-500 text-stone-900 font-semibold text-sm
                         uppercase tracking-widest hover:bg-amber-400 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center
                         justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900
                                   rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
            ← Mağazaya Dön
          </a>
        </p>
      </div>
    </div>
  )
}
