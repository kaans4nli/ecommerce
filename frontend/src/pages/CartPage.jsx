import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import EmptyState from '../components/EmptyState'
import { getImage } from '../utils/image'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) return (
    <div className="container-custom">
      <EmptyState type="cart" />
    </div>
  )

  return (
    <div className="container-custom py-10 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-10">
        Sepetim <span className="text-stone-400 text-2xl">({getTotalItems()} ürün)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/products/${item.id}`}>
                <img
                  src={getImage(item.imageUrl)}
                  alt={item.name}
                  className="w-24 h-32 object-cover shrink-0"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    {item.categoryName && (
                      <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-1">
                        {item.categoryName}
                      </p>
                    )}
                    <Link to={`/products/${item.id}`} className="font-medium text-stone-800 hover:text-stone-600 transition-colors">
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.id)
                      toast.success('Ürün sepetten çıkarıldı')
                    }}
                    className="text-stone-300 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-stone-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-stone-50"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-stone-50"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-semibold text-stone-900">
                    ₺{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-6">
              Sipariş Özeti
            </h2>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-stone-800 line-clamp-1">
                      {item.name}
                    </p>

                    <p className="text-stone-400 text-xs mt-1">
                      {item.quantity} adet
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-medium text-stone-900">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </p>

                    {item.originalPrice &&
                      item.originalPrice > item.price && (
                        <p className="text-xs text-stone-400 line-through mt-0.5">
                          ₺{(item.originalPrice * item.quantity).toFixed(2)}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">
                  Toplam
                </span>

                <span className="text-2xl font-bold text-stone-900">
                  ₺{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full py-4"
            >
              Siparişi Tamamla
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/"
              className="btn-ghost w-full mt-3 justify-center py-3"
            >
              <ShoppingBag size={16} />
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}