import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { productApi } from '../api/products'
import { useCartStore } from '../store/cartStore'
import { useFavoriteStore } from '../store/favoriteStore'
import { getImageList, getImage } from '../utils/image'
import ImagePreview from '../components/ImagePreview'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)

  const addItem = useCartStore(s => s.addItem)
  const { toggle, isFavorite } = useFavoriteStore()
  const favorited = product ? isFavorite(product.id) : false

  useEffect(() => {
    setLoading(true)
    productApi.getById(id)
      .then(setProduct)
      .catch(() => toast.error('Ürün bulunamadı'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [product?.id])

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} sepete eklendi`)
  }

  const images =
    product?.images?.length
      ? product.images.map(img => getImage(img.imageUrl))
      : getImageList(null, product?.imageUrl)

  const nextImage = () => {
    setCurrentImageIndex((i) => (i + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)
  }

  const handleTouchStart = (e) => {
    const x = e.touches[0].clientX
    touchStartX.current = x
    touchCurrentX.current = x
  }

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const dx = touchStartX.current - touchCurrentX.current
    if (Math.abs(dx) > 50) {
      if (dx > 0) nextImage()
      else prevImage()
    }
    touchStartX.current = 0
    touchCurrentX.current = 0
  }

  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  if (loading) {
    return (
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-4 py-4">
            <div className="h-6 skeleton w-2/3" />
            <div className="h-10 skeleton w-3/4" />
            <div className="h-4 skeleton w-1/4" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container-custom py-10 animate-fade-in">
      {/* Breadcrumb */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 mb-8 transition-colors">
        <ChevronLeft size={16} />
        Koleksiyona Dön
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="relative group" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover animate-fade-in cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setPreviewOpen(true)}
          />
          {discount && (
            <span className="absolute top-4 left-4 badge-sale text-sm px-3 py-1.5">
              -{discount}% İndirim
            </span>
          )}

          {/* Mobile Preview Button */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="absolute top-4 right-4 md:hidden bg-white/90 hover:bg-white text-stone-900 p-2.5 rounded-full transition-all shadow-lg"
            title="Büyütüp Görüntüle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col py-4">
          {product.categoryName && (
            <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-3">
              {product.categoryName}
            </p>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">
              ₺{Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-stone-400 line-through mb-0.5">
                ₺{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} className="btn-primary flex-1 py-4">
              <ShoppingBag size={18} />
              Sepete Ekle
            </button>
            <button
              onClick={() => {
                toggle(product)
                toast.success(favorited ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
              }}
              className={`w-14 h-14 border flex items-center justify-center transition-colors
                    ${favorited
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-stone-200 text-stone-600 hover:border-stone-900 hover:bg-stone-900 hover:text-white'}`}
            >
              <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>



          {/* Divider info */}
          <div className="mt-8 pt-8 border-t border-stone-100 space-y-2">
            <p className="text-xs text-stone-400">
              📦 Sipariş için Instagram üzerinden iletişime geçin
            </p>
            <p className="text-xs text-stone-400">
              ↩️ İade ve değişim için 14 gün süreniz var
            </p>
          </div>
        </div>
      </div>

      {previewOpen && (
        <ImagePreview
          images={images}
          initialIndex={currentImageIndex}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}