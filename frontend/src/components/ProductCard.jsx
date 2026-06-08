import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useFavoriteStore } from '../store/favoriteStore'
import { getImage } from '../utils/image'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)
  const { toggle, isFavorite } = useFavoriteStore()
  const favorited = isFavorite(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} sepete eklendi`)
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    toggle(product)
    toast.success(favorited ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/products/${product.id}`} className="group block animate-fade-in">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
          <img
            src={getImage(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="badge-sale text-xs px-2 py-1">
                -{discount}%
              </span>
            )}
            {product.isFeatured && !discount && (
              <span className="badge-new text-xs px-2 py-1">
                Öne Çıkan
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 
                          translate-x-10 group-hover:translate-x-0 
                          transition-transform duration-300">
            <button
              onClick={handleFavorite}
              className={`w-9 h-9 flex items-center justify-center shadow-sm transition-colors
                ${favorited
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-900 hover:text-white'}`}
              aria-label="Favorilere ekle"
            >
              <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 
                          translate-y-full group-hover:translate-y-0
                          transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-stone-900 text-white text-xs font-semibold 
                         tracking-widest uppercase flex items-center justify-center gap-2
                         hover:bg-amber-500 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag size={14} />
              Sepete Ekle
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.categoryName && (
            <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-1">
              {product.categoryName}
            </p>
          )}
          <h3 className="font-medium text-stone-800 text-sm leading-snug mb-2 
                         group-hover:text-stone-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">
              ₺{Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-stone-400 line-through text-sm">
                ₺{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}