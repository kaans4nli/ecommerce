import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import { productApi } from '../api/products'
import { categoryApi } from '../api/categories'

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'En Yeni' },
  { value: 'price,asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price,desc', label: 'Fiyat: Yükseğe Düşüğe' },
  { value: 'name,asc', label: 'İsim: A-Z' },
]

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestRef = useRef(0)

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('createdAt,desc')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const featured = searchParams.get('featured') === 'true'
  const discounted = searchParams.get('discounted') === 'true'

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => { })
  }, [])

  const fetchProducts = useCallback(async () => {
    const requestId = ++requestRef.current
    setLoading(true)

    try {
      const [sortBy, sortDir] = sort.split(',')

      if (featured) {
        const data = await productApi.getFeatured({ sortBy, sortDir })

        if (requestId !== requestRef.current) return

        setProducts(data)
        setTotalPages(1)
        setTotalElements(data.length)
        return
      }

      if (discounted) {
        const data = await productApi.getDiscounted({ sortBy, sortDir })

        if (requestId !== requestRef.current) return

        setProducts(data)
        setTotalPages(1)
        setTotalElements(data.length)
        return
      }

      const data = await productApi.getAll({
        page,
        size: 12,
        sortBy,
        sortDir,
        categoryId: selectedCategory || undefined,
        search: search || undefined,
      })

      if (requestId !== requestRef.current) return

      setProducts(prev =>
        page === 0
          ? data.content
          : [...prev, ...data.content]
      )

      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)

    } finally {
      if (requestId === requestRef.current) {
        setLoading(false)
      }
    }
  }, [page, sort, selectedCategory, search, featured, discounted])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleCategoryChange = (catId) => {
    if (catId === selectedCategory) return

    setSelectedCategory(catId)
    setPage(0)
    setProducts([])
  }

  const handleSortChange = (val) => {
    setSort(val)
    setPage(0)
    setProducts([])
  }

  const handleSearchClear = () => {
    setSort('createdAt,desc')
    setSelectedCategory(null)
    setSearch('')
    setPage(0)
    setProducts([])
    setSearchParams({})
  }

  const handleLoadMore = () => setPage(p => p + 1)

  const hasActiveFilter = selectedCategory || search || featured || discounted || sort !== 'createdAt,desc'

  return (
    <div className="container-custom py-10">
      {/* Hero strip */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-3">
          {discounted
            ? 'İndirimli Ürünler'
            : featured
              ? 'Öne Çıkanlar'
              : search
                ? `"${search}" araması`
                : 'Koleksiyon'}
        </h1>
        <p className="text-stone-400 text-sm">
          {loading ? '...' : `${totalElements} ürün`}
        </p>
      </div>

      {/* Filters */}
      {!featured && !discounted && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex gap-2 flex-wrap flex-1">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-colors
              ${!selectedCategory
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
            >
              Tümü
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-colors
                ${selectedCategory === cat.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort + clear */}
          <div className="flex items-center gap-3 shrink-0">
            {hasActiveFilter && (
              <button onClick={handleSearchClear} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900">
                <X size={14} /> Filtreyi Temizle
              </button>
            )}
            <div className="relative">
              <select
                value={sort}
                onChange={e => handleSortChange(e.target.value)}
                className="input-field py-2 pr-8 appearance-none cursor-pointer text-xs"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading && page === 0 ? (
        <SkeletonGrid count={12} />
      ) : products.length === 0 ? (
        <EmptyState type={search ? 'search' : 'products'} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load more */}
          {page < totalPages - 1 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-outline min-w-[200px]"
              >
                {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}