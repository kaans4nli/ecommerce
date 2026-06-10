import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavoriteStore } from '../store/favoriteStore'
import { useCartStore } from '../store/cartStore'
import EmptyState from '../components/EmptyState'
import { getImage } from '../utils/image'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const { items, remove } = useFavoriteStore()
  const addItem = useCartStore(s => s.addItem)

  if (items.length === 0) {
    return (
      <div className="container-custom">
        <EmptyState type="favorites" />
      </div>
    )
  }

  return (
    <div className="container-custom py-10 animate-fade-in">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900">
            Favorilerim
          </h1>
          <p className="text-stone-400 text-sm mt-1">{items.length} ürün</p>
        </div>
        <button
          onClick={() => {
            useFavoriteStore.getState().clear()
            toast.success('Favoriler temizlendi')
          }}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors"
        >
          Tümünü Kaldır
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map(product => (
          <div key={product.id} className="card overflow-hidden group animate-fade-in">
            {/* Image */}
            <Link to={`/products/${product.id}`} className="block relative overflow-hidden bg-stone-100 aspect-[3/4]">
              <img
                src={getImage(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={e => {
                  e.preventDefault()
                  remove(product.id)
                  toast.success('Favorilerden çıkarıldı')
                }}
                className="absolute top-3 right-3 w-9 h-9 bg-white text-stone-400
                           hover:bg-red-500 hover:text-white flex items-center justify-center
                           shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Favorilerden kaldır"
              >
                <Trash2 size={15} />
              </button>
            </Link>

            {/* Info */}
            <div className="p-4">
              {product.categoryName && (
                <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-1">
                  {product.categoryName}
                </p>
              )}
              <Link to={`/products/${product.id}`}>
                <h3 className="font-medium text-stone-800 text-sm leading-snug mb-2 hover:text-stone-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">
                      ₺{Number(product.price).toFixed(2)}
                    </span>

                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-stone-400 line-through">
                        ₺{Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem(product)
                    toast.success('Sepete eklendi')
                  }}
                  className="sm:w-auto w-full text-xs font-semibold uppercase tracking-wide px-3 py-2 bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-900 transition-all"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}