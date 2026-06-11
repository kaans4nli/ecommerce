import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Edit,
  Trash2,
  Image,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { productApi } from '../../api/products'
import { categoryApi } from '../../api/categories'
import { getImage } from '../../utils/image'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()

  const activeOnly =
    searchParams.get('active') === 'true'

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
  })

  // [{ file, preview }]
  const [images, setImages] = useState([])

  useEffect(() => {
    loadData(search)
  }, [search])

  const loadData = async (searchQuery = '') => {
    setLoading(true)

    try {
      const [productsData, categoriesData] = await Promise.all([
        searchQuery.trim()
          ? productApi.searchProducts(searchQuery)
          : productApi.getAllAdmin({
            page: 0,
            size: 100,
            active: activeOnly
          }),

        categoryApi.getAll(),
      ])

      setProducts(productsData.content || [])
      setCategories(categoriesData || [])
    } catch (err) {
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      isActive: true,
      isFeatured: false,
    })

    setImages([])
    setEditingId(null)
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id)

      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        categoryId: product.categoryId?.toString() || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      })

      // mevcut resimleri doldur
      const existingImages = []

      if (product.images?.length) {
        product.images.forEach((img) => {
          existingImages.push({
            id: img.id,
            file: null,
            preview: getImage(img.imageUrl),
            existing: true,
          })
        })
      } else if (product.imageUrl) {
        existingImages.push({
          file: null,
          preview: getImage(product.imageUrl),
          existing: true,
        })
      }

      setImages(existingImages)
    } else {
      resetForm()
    }

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  // SINGLE IMAGE ADD
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [
      ...prev,
      ...newImages,
    ])

    e.target.value = ''
  }

  const removeImage = async (index) => {
    const image = images[index]

    try {
      // backendden sil
      if (image.existing && image.id) {
        await productApi.deleteImage(image.id)
      }

      setImages((prev) =>
        prev.filter((_, i) => i !== index)
      )

      toast.success('Resim silindi')
    } catch (err) {
      toast.error('Resim silinemedi')
    }
  }

  const moveImageLeft = (index) => {
    if (index === 0) return

    const updated = [...images]

      ;[updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ]

    setImages(updated)
  }

  const moveImageRight = (index) => {
    if (index === images.length - 1) return

    const updated = [...images]

      ;[updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ]

    setImages(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.price) {
      toast.error('Ürün adı ve fiyat zorunlu')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice
          ? parseFloat(form.originalPrice)
          : null,
        categoryId: form.categoryId
          ? parseInt(form.categoryId)
          : null,
      }

      let productId

      if (editingId) {
        await productApi.update(editingId, payload)
        productId = editingId
        toast.success('Ürün güncellendi')
      } else {
        const created = await productApi.create(payload)
        productId = created.id
        toast.success('Ürün oluşturuldu')
      }

      const newFiles = images
        .filter((img) => img.file)
        .map((img) => img.file)

      if (newFiles.length > 0) {
        await productApi.uploadImages(productId, newFiles)

        toast.success(`${newFiles.length} resim yüklendi`)
      }

      const existingImages = images.filter(img => img.id)

      if (existingImages.length > 0) {

        const orderPayload = existingImages.map((img, index) => ({
          imageId: img.id,
          displayOrder: index,
        }))

        await productApi.updateImageOrders(
          productId,
          orderPayload
        )
      }

      handleCloseModal()
      await loadData()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        (editingId
          ? 'Ürün güncellenemedi'
          : 'Ürün oluşturulamadı')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)

    try {
      await productApi.delete(id)

      toast.success('Ürün silindi')

      setDeleteConfirm(null)

      await loadData()
    } catch (err) {
      toast.error('Ürün silinemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Ürün Yönetimi
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="flex-1 sm:w-64 px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-sm font-medium"
            >
              Temizle
            </button>
          )}

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-amber-500 text-stone-900 px-4 py-2 font-semibold hover:bg-amber-400 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Yeni Ürün</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading && !isModalOpen ? (
        <div className="text-center py-8 text-stone-500">
          Yükleniyor...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-stone-500">
          Ürün bulunamadı
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Ürün
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  Kategori
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  Fiyat
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  Durum
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  İşlem
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-stone-200 hover:bg-stone-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img
                          src={getImage(product.imageUrl)}
                          alt={product.name}
                          className="w-10 h-10 object-cover"
                        />
                      )}

                      <div>
                        <p className="font-medium text-stone-900">
                          {product.name}
                        </p>

                        {product.isFeatured && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1">
                            Öne Çıkan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-stone-600">
                    {product.categoryName || '-'}
                  </td>

                  <td className="px-4 py-3 font-semibold text-stone-900">
                    ₺{product.price}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 ${product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between bg-stone-50 border-b border-stone-200 px-6 py-4">
              <h2 className="text-xl font-bold text-stone-900">
                {editingId
                  ? 'Ürünü Düzenle'
                  : 'Yeni Ürün'}
              </h2>

              <button
                onClick={handleCloseModal}
                className="text-stone-500 hover:text-stone-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Ürün Adı *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ürün adı"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Açıklama
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  placeholder="Ürün açıklaması"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-900 mb-1">
                    Fiyat *
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-900 mb-1">
                    Orijinal Fiyat
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Kategori
                </label>

                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">
                    Kategori seç
                  </option>

                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  <div className="flex items-center gap-2">
                    <Image size={16} />
                    Ürün Resimleri
                  </div>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                />

                <p className="text-xs text-stone-500 mt-2">
                  Resimleri tek tek ekleyebilirsiniz.
                  Sıralamayı oklarla değiştirebilirsiniz.
                </p>

                {/* Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="border border-stone-200 p-2"
                      >
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-full h-36 object-cover"
                        />

                        <div className="mt-2 text-xs text-stone-600 truncate">
                          {img.file?.name || 'Mevcut Resim'}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                moveImageLeft(idx)
                              }
                              className="p-1 border border-stone-300 hover:bg-stone-100"
                            >
                              <ChevronLeft size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveImageRight(idx)
                              }
                              className="p-1 border border-stone-300 hover:bg-stone-100"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(idx)
                            }
                            className="p-1 border border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="mt-2 text-[11px] text-stone-500">
                          Sıra: {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />

                  <span className="text-sm text-stone-900">
                    Aktif
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />

                  <span className="text-sm text-stone-900">
                    Öne Çıkan
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 text-stone-900 py-2 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {editingId
                    ? 'Güncelle'
                    : 'Oluştur'}
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="flex-1 bg-stone-200 text-stone-900 py-2 font-semibold hover:bg-stone-300 disabled:opacity-50 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle
                size={24}
                className="text-red-600"
              />

              <h2 className="text-lg font-bold text-stone-900">
                Ürünü Sil
              </h2>
            </div>

            <p className="text-stone-600 mb-6">
              Bu ürünü silmek istediğinize emin
              misiniz?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleDelete(deleteConfirm)
                }
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Sil
              </button>

              <button
                onClick={() =>
                  setDeleteConfirm(null)
                }
                disabled={loading}
                className="flex-1 bg-stone-200 text-stone-900 py-2 font-semibold hover:bg-stone-300 disabled:opacity-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}