import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tags, ClipboardList, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Ürünler', icon: Package },
  { to: '/admin/categories', label: 'Kategoriler', icon: Tags },
  { to: '/admin/supply-requests', label: 'İstekler', icon: ClipboardList },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Çıkış yapıldı')
    navigate('/admin/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-stone-900 text-white">
      <div className="p-6 border-b border-stone-800">
        <Link to="/" className="font-display text-xl font-bold tracking-widest">YUCESOY</Link>
        <p className="text-xs text-stone-500 mt-1">Admin Paneli</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                ${active
                  ? 'bg-amber-500 text-stone-900'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-stone-500">Giriş yapıldı</p>
          <p className="text-sm font-medium text-stone-300">{user?.username || 'Admin'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium 
                     text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-stone-600">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-lg">Admin</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}