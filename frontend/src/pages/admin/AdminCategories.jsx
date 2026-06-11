import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react'
import { categoryApi } from '../../api/categories'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryApi.getAll()
      setCategories(data || [])
    } catch (err) {
      toast.error('Kategoriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category.id)
      setForm({
        name: category.name,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
      })
    } else {
      setEditingId(null)
      setForm({
        name: '',
        description: '',
        imageUrl: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Kategori adı zorunludur')
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await categoryApi.update(editingId, form)
        toast.success('Kategori güncellendi')
      } else {
        await categoryApi.create(form)
        toast.success('Kategori oluşturuldu')
      }

      handleCloseModal()
      loadCategories()
    } catch (err) {
      const msg = err.response?.data?.message || (editingId ? 'Kategori güncellenemedi' : 'Kategori oluşturulamadı')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      await categoryApi.delete(id)
      toast.success('Kategori silindi')
      setDeleteConfirm(null)
      loadCategories()
    } catch (err) {
      toast.error('Kategori silinemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-stone-900">Kategori Yönetimi</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-amber-500 text-stone-900 px-4 py-2 font-semibold hover:bg-amber-400 transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus size={20} /> <span className="hidden sm:inline">Yeni Kategori</span>
          <span className="sm:hidden">Ekle</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading && !isModalOpen ? (
        <div className="text-center py-8 text-stone-500">Yükleniyor...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 mb-4">Kategori bulunamadı</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-4 py-2 font-semibold hover:bg-amber-400 transition-colors"
          >
            <Plus size={18} /> İlk Kategoriyi Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="w-full h-32 bg-stone-100 overflow-hidden flex items-center justify-center">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="text-stone-300 text-sm">Görsel yok</div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg truncate">{category.name}</h3>
                  {category.description && (
                    <p className="text-stone-600 text-sm mt-1 line-clamp-2">{category.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 transition-colors text-sm font-medium"
                  >
                    <Edit size={16} /> Düzenle
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-2 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full">
            <div className="flex items-center justify-between bg-stone-50 border-b border-stone-200 px-6 py-4">
              <h2 className="text-xl font-bold text-stone-900">
                {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
              </h2>
              <button onClick={handleCloseModal} className="text-stone-500 hover:text-stone-900">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">Kategori Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kategori adı"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Kategori açıklaması"
                  rows="3"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">Görsel URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-stone-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 text-stone-900 py-2 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {editingId ? 'Güncelle' : 'Oluştur'}
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h2 className="text-lg font-bold text-stone-900">Kategoriyi Sil</h2>
            </div>
            <p className="text-stone-600 mb-6">Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Sil
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
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
