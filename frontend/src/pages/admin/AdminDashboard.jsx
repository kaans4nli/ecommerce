import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tags, TrendingUp, Plus, ArrowRight, Activity } from 'lucide-react'
import { authApi } from '../../api/auth'
import { productApi } from '../../api/products'
import { categoryApi } from '../../api/categories'
import { getImage } from '../../utils/image'

function StatCard({ title, value, icon: Icon, color, to, loading }) {
  return (
    <Link to={to} className="card p-6 flex items-center gap-5 hover:shadow-md transition-shadow group">
      <div className={`w-14 h-14 flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">{title}</p>
        {loading
          ? <div className="h-8 w-16 skeleton" />
          : <p className="text-3xl font-display font-bold text-stone-900">{value ?? '—'}</p>
        }
      </div>
      <ArrowRight size={18} className="text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

function QuickAction({ to, icon: Icon, label, sub }) {
  return (
    <Link to={to} className="card p-5 hover:shadow-md transition-shadow group flex items-center gap-4">
      <div className="w-10 h-10 bg-stone-100 group-hover:bg-stone-900 flex items-center justify-center transition-colors">
        <Icon size={18} className="text-stone-600 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="font-medium text-stone-800 text-sm group-hover:text-stone-600 transition-colors">{label}</p>
        <p className="text-xs text-stone-400">{sub}</p>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      authApi.getDashboard(),
      productApi.getAll({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'desc' }),
      categoryApi.getAll(),
    ]).then(([dashData, productPage, cats]) => {
      setStats(dashData)
      setRecentProducts(productPage.content || [])
      setCategories(cats)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-400 text-sm mt-1">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Toplam Ürün"
          value={stats?.totalProducts}
          icon={Package}
          color="bg-blue-50 text-blue-600"
          to="/admin/products"
          loading={loading}
        />
        <StatCard
          title="Aktif Ürün"
          value={stats?.activeProducts}
          icon={Activity}
          color="bg-green-50 text-green-600"
          to="/admin/products?active=true"
          loading={loading}
        />
        <StatCard
          title="Kategori"
          value={stats?.totalCategories}
          icon={Tags}
          color="bg-amber-50 text-amber-600"
          to="/admin/categories"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-display font-semibold text-stone-800">Son Eklenen Ürünler</h2>
            <Link to="/admin/products" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
              Tümünü Gör →
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-14 skeleton shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 skeleton w-2/3" />
                    <div className="h-3 skeleton w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={32} className="text-stone-200 mx-auto mb-3" />
              <p className="text-stone-400 text-sm">Henüz ürün yok</p>
              <Link to="/admin/products" className="btn-primary mt-4 text-xs py-2 px-4 inline-flex">
                <Plus size={14} /> Ürün Ekle
              </Link>
            </div>
          ) : (
            <ul>
              {recentProducts.map((p, i) => (
                <li
                  key={p.id}
                  className={`flex items-center gap-4 px-6 py-3 hover:bg-stone-50 transition-colors
                    ${i < recentProducts.length - 1 ? 'border-b border-stone-50' : ''}`}
                >
                  <div className="w-12 h-14 bg-stone-100 shrink-0 overflow-hidden">
                    {p.imageUrl && (
                      <img src={getImage(p.imageUrl)}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm truncate">{p.name}</p>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {p.categoryName || 'Kategorisiz'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-stone-900 text-sm">₺{Number(p.price).toFixed(2)}</p>
                    <span className={`text-[11px] font-medium ${p.isActive ? 'text-green-600' : 'text-stone-400'}`}>
                      {p.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-display font-semibold text-stone-800">Hızlı İşlemler</h2>
            </div>
            <div className="p-4 space-y-2">
              <QuickAction to="/admin/products" icon={Plus} label="Yeni Ürün Ekle" sub="Ürün kataloğuna ekle" />
              <QuickAction to="/admin/categories" icon={Tags} label="Kategori Yönet" sub="Kategori ekle / düzenle" />
            </div>
          </div>

          {/* Categories */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-display font-semibold text-stone-800">Kategoriler</h2>
            </div>
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 skeleton" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-stone-50">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-stone-700">{cat.name}</span>
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5">
                      {cat.productCount ?? 0} ürün
                    </span>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="px-6 py-4 text-sm text-stone-400 text-center">
                    Kategori yok
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}