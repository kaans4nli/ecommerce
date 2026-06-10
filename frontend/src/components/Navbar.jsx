import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useFavoriteStore } from '../store/favoriteStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const cartCount = useCartStore(s => s.getTotalItems())
  const favCount = useFavoriteStore(s => s.items.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 
        ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="font-display text-2xl font-bold tracking-widest text-stone-900">
              YUCESOY
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 
                                     tracking-wide transition-colors">
                Koleksiyon
              </Link>
              <Link to="/?featured=true" className="text-sm font-medium text-stone-600 hover:text-stone-900 
                                                     tracking-wide transition-colors">
                Öne Çıkanlar
              </Link>
              <Link
                to="/?discounted=true" className="text-sm font-medium text-stone-600 hover:text-stone-900 
                tracking-wide transition-colors"
              >
                İndirim
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost p-2 rounded-none"
                aria-label="Ara"
              >
                <Search size={20} />
              </button>

              <Link to="/favorites" className="btn-ghost p-2 rounded-none relative">
                <Heart size={20} />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white 
                                   text-[10px] font-bold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="btn-ghost p-2 rounded-none relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white 
                                   text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="border-t border-stone-100 py-3 animate-fade-in">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field flex-1 py-2"
                />
                <button type="submit" className="btn-primary py-2 px-4">
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white animate-fade-in">
            <nav className="container-custom py-4 flex flex-col gap-3">
              <Link to="/" className="text-sm font-medium text-stone-700 py-2 border-b border-stone-50">
                Koleksiyon
              </Link>
              <Link to="/?featured=true" className="text-sm font-medium text-stone-700 py-2 border-b border-stone-50">
                Öne Çıkanlar
              </Link>
              <Link to="/?discounted=true" className="text-sm font-medium text-stone-700 py-2 border-b border-stone-50">
                İndirim
              </Link>
              <Link to="/favorites" className="text-sm font-medium text-stone-700 py-2 border-b border-stone-50 flex justify-between">
                Favoriler {favCount > 0 && <span className="text-amber-600">{favCount}</span>}
              </Link>
              <Link to="/cart" className="text-sm font-medium text-stone-700 py-2 flex justify-between">
                Sepet {cartCount > 0 && <span className="text-stone-900 font-bold">{cartCount}</span>}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}