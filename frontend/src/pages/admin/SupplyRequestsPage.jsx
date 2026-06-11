import { useEffect, useState } from 'react'
import { supplyRequestApi } from '../../api/supplyRequests'
import { productApi } from '../../api/products'
import { X } from 'lucide-react'

export default function SupplyRequestsPage() {

    const [activeTab, setActiveTab] = useState('PENDING')
    const [requests, setRequests] = useState([])
    const [products, setProducts] = useState([])

    // form state
    const [name, setName] = useState('')
    const [items, setItems] = useState([])

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)

    const [productQuery, setProductQuery] = useState('')
    const [productResults, setProductResults] = useState([])
    const [productLoading, setProductLoading] = useState(false)
    const [isProductSelected, setIsProductSelected] = useState(false)

    useEffect(() => {
        loadRequests()
        productApi.getAll({ page: 0, size: 100 })
            .then(res => setProducts(res.content))
    }, [activeTab])

    useEffect(() => {
        if (!productQuery || isProductSelected) {
            setProductResults([])
            return
        }

        const timeout = setTimeout(async () => {
            setProductLoading(true)

            try {
                const data = await productApi.searchProducts(productQuery)
                setProductResults(data.content)
            } finally {
                setProductLoading(false)
            }

        }, 300)

        return () => clearTimeout(timeout)
    }, [productQuery, isProductSelected])

    const loadRequests = async () => {
        const data = await supplyRequestApi.getByStatus(activeTab)
        setRequests(data)
    }

    const addItem = () => {
        if (!selectedProduct) return

        const exists = items.find(i => i.productId === selectedProduct.id)
        if (exists) return

        setItems(prev => [
            ...prev,
            {
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                quantity
            }
        ])

        setSelectedProduct(null)
        setProductQuery('')
        setQuantity(1)
    }

    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    const createRequest = async () => {
        if (!name || items.length === 0) return

        await supplyRequestApi.create({
            name,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            }))
        })

        setName('')
        setItems([])
        loadRequests()
    }

    const markCompleted = async (id) => {
        await supplyRequestApi.updateStatus(id, 'COMPLETED')
        loadRequests()
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-stone-900">
                    Tedarik İstekleri
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('PENDING')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors
          ${activeTab === 'PENDING'
                            ? 'border-amber-500 text-stone-900'
                            : 'border-transparent text-stone-500 hover:text-stone-900'
                        }`}
                >
                    Bekleyen
                </button>

                <button
                    onClick={() => setActiveTab('COMPLETED')}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors
          ${activeTab === 'COMPLETED'
                            ? 'border-amber-500 text-stone-900'
                            : 'border-transparent text-stone-500 hover:text-stone-900'
                        }`}
                >
                    Tamamlanan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                {/* CREATE FORM */}
                <div className="bg-white border border-stone-200 p-6 space-y-4">

                    <h2 className="text-lg font-bold text-stone-900">
                        Yeni İstek Oluştur
                    </h2>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-stone-900 mb-1">
                            İstek Adı
                        </label>
                        <input
                            className="input-field w-full"
                            placeholder="Örn: Ocak Stok Talebi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Product Search */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-stone-900 mb-1">
                            Ürün Ara (ID / İsim)
                        </label>

                        <input
                            className="input-field w-full"
                            placeholder="Ürün ara..."
                            value={productQuery}
                            onChange={(e) => {
                                setProductQuery(e.target.value)
                                setIsProductSelected(false)
                            }}
                        />

                        {/* dropdown */}
                        {productQuery && (
                            <div className="absolute z-20 bg-white border border-stone-200 w-full mt-1 max-h-60 overflow-auto shadow-lg">

                                {productLoading && (
                                    <div className="p-2 text-sm text-stone-500">
                                        Aranıyor...
                                    </div>
                                )}

                                {productResults.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            setSelectedProduct(p)
                                            setProductQuery(p.name)
                                            setProductResults([])
                                            setIsProductSelected(true)
                                        }}
                                        className="p-2 hover:bg-stone-50 cursor-pointer flex justify-between"
                                    >
                                        <span className="text-stone-900">{p.name}</span>
                                        <span className="text-xs text-stone-500">#{p.id}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quantity + Add */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                        <div className="flex-1 sm:flex-none">
                            <label className="block text-sm font-medium text-stone-900 mb-1">
                                Adet
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="input-field w-full sm:w-24"
                                min={1}
                            />
                        </div>

                        <button
                            onClick={addItem}
                            className="h-10 px-4 bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors text-sm sm:text-base"
                        >
                            Ekle
                        </button>
                    </div>

                    {/* Selected Items */}
                    <div className="space-y-2 pt-2">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border border-stone-200 px-3 py-2 bg-stone-50"
                            >
                                <span className="text-sm text-stone-900">
                                    #{item.productId} - {item.productName} <span className="text-stone-500">x{item.quantity}</span>
                                </span>

                                <button
                                    onClick={() => removeItem(i)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Save */}
                    <button
                        onClick={createRequest}
                        className="w-full bg-stone-900 text-white py-2 font-semibold hover:bg-stone-800 transition-colors"
                    >
                        Kaydet
                    </button>
                </div>

                {/* LIST */}
                <div className="space-y-4">

                    <h2 className="text-lg font-bold text-stone-900">
                        {activeTab === 'PENDING' ? 'Bekleyen İstekler' : 'Tamamlanan İstekler'}
                    </h2>

                    {requests.length === 0 ? (
                        <div className="text-center py-10 text-stone-500 border border-stone-200 bg-white">
                            İstek bulunamadı
                        </div>
                    ) : (
                        requests.map(req => (
                            <div
                                key={req.id}
                                className="border border-stone-200 bg-white p-4 space-y-2"
                            >

                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-stone-900">
                                        {req.name}
                                    </h3>

                                    {req.status === 'PENDING' && (
                                        <button
                                            onClick={() => markCompleted(req.id)}
                                            className="text-xs px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200"
                                        >
                                            Tamamla
                                        </button>
                                    )}
                                </div>

                                <div className="text-sm text-stone-600 space-y-1">
                                    {req.items.map(i => (
                                        <div key={i.id}>
                                            #{i.productId} - {i.productName} <span className="text-stone-400">x{i.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}