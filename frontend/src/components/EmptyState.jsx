import { ShoppingBag, Heart, Search, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const configs = {
  cart: {
    icon: ShoppingBag,
    title: 'Sepetiniz boş',
    description: 'Beğendiğiniz ürünleri sepete ekleyin.',
    actionLabel: 'Alışverişe Başla',
    actionTo: '/',
  },
  favorites: {
    icon: Heart,
    title: 'Favori ürününüz yok',
    description: 'Beğendiğiniz ürünleri favorilere ekleyin.',
    actionLabel: 'Ürünleri Keşfet',
    actionTo: '/',
  },
  search: {
    icon: Search,
    title: 'Sonuç bulunamadı',
    description: 'Farklı bir arama terimi deneyin.',
    actionLabel: 'Tüm Ürünler',
    actionTo: '/',
  },
  products: {
    icon: Package,
    title: 'Henüz ürün yok',
    description: 'Bu kategoride henüz ürün bulunmuyor.',
    actionLabel: 'Tüm Ürünler',
    actionTo: '/',
  },
}

export default function EmptyState({ type = 'products', className = '' }) {
  const { icon: Icon, title, description, actionLabel, actionTo } = configs[type] || configs.products

  return (
    <div className={`flex flex-col items-center justify-center py-24 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-stone-100 flex items-center justify-center mb-6">
        <Icon size={28} className="text-stone-400" />
      </div>
      <h3 className="font-display text-xl font-medium text-stone-700 mb-2">{title}</h3>
      <p className="text-sm text-stone-400 mb-8 max-w-xs">{description}</p>
      <Link to={actionTo} className="btn-primary">
        {actionLabel}
      </Link>
    </div>
  )
}