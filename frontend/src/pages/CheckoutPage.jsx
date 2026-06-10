import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, ShoppingBag, ChevronLeft } from 'lucide-react'
import { FaInstagram } from "react-icons/fa"
import { useCartStore } from '../store/cartStore'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'

const INSTAGRAM_USERNAME = import.meta.env.INSTAGRAM_USERNAME || 'yucesoy_canta_ve_taki_dunyasi'

export default function CheckoutPage() {
  const { items, getTotalPrice, getOrderMessage, clearCart } = useCartStore()
  const [copied, setCopied] = useState(false)

  if (items.length === 0) return (
    <div className="container-custom">
      <EmptyState type="cart" />
    </div>
  )

  const orderMessage = getOrderMessage()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage)
      setCopied(true)
      toast.success('Mesaj kopyalandı!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Kopyalama başarısız')
    }
  }

  const handleInstagram = () => {
    const encoded = encodeURIComponent(orderMessage)
    window.open(
      `https://www.instagram.com/direct/new/?text=${encoded}`,
      '_blank'
    )
  }

  const handleInstagramProfile = () => {
    window.open(`https://instagram.com/${INSTAGRAM_USERNAME}`, '_blank')
  }

  return (
    <div className="container-custom py-10 animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 mb-8 transition-colors">
        <ChevronLeft size={16} />
        Sepete Dön
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-3">
        Siparişi Tamamla
      </h1>
      <p className="text-stone-400 text-sm mb-10">
        Sipariş mesajını kopyalayın ve Instagram üzerinden bize gönderin.<br />
        Mağazadan teslim ya da kargo seçenekleri için iletişime geçebilirsiniz.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Order summary */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-6">Sepet Özeti</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-stone-100">
                <img
                  src={item.imageUrl || ''}
                  alt={item.name}
                  className="w-16 h-20 object-cover bg-stone-100"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="flex-1">
                  <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                  <p className="text-stone-400 text-xs mt-1">Adet: {item.quantity}</p>
                </div>
                <div className="text-right min-w-[110px]">
                  <p className="font-semibold text-sm text-stone-900">
                    ₺{(item.price * item.quantity).toFixed(2)}
                  </p>

                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs text-stone-400 line-through mt-0.5">
                      ₺{(item.originalPrice * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 p-4 flex justify-between items-center">
            <span className="font-semibold">Toplam Tutar</span>
            <span className="font-display text-2xl font-bold text-stone-900">
              ₺{getTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right — Message */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-6">Sipariş Mesajı</h2>

          <div className="relative">
            <textarea
              readOnly
              value={orderMessage}
              rows={Math.min(12, items.length + 4)}
              className="input-field w-full resize-none font-body text-sm leading-relaxed bg-stone-50"
            />
          </div>

          <p className="text-xs text-stone-400 mt-2 mb-6">
            Bu mesajı kopyalayıp Instagram'dan bize gönderin.
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className={`btn-primary w-full py-4 transition-all ${copied ? 'bg-green-600 hover:bg-green-600' : ''}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Kopyalandı!' : 'Mesajı Kopyala'}
            </button>

            <button
              onClick={handleInstagramProfile}
              className="w-full py-4 px-4 flex items-center justify-center gap-3 
                         bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
                         text-white text-sm font-semibold tracking-wide
                         hover:opacity-90 transition-opacity active:scale-95"
            >
              <FaInstagram size={18} />
              Instagram'dan Yaz (@{INSTAGRAM_USERNAME})
            </button>

            <button
              onClick={clearCart}
              className="btn-ghost w-full py-3 text-stone-400 hover:text-stone-600 justify-center text-xs"
            >
              Siparişi İptal Et / Sepeti Temizle
            </button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Nasıl sipariş veririm?</strong><br />
              1. "Mesajı Kopyala" butonuna tıklayın<br />
              2. Instagram hesabımıza gidin<br />
              3. Mesaj gönderin ve sipariş detaylarını iletin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}