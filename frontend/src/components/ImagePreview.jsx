import { useEffect, useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImagePreview({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [currentIndex, onClose])

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button')) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (e.target.closest('button')) return
    touchCurrentX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const dx = touchStartX.current - touchCurrentX.current
    if (Math.abs(dx) > 50) {
      if (dx > 0) handleNext()
      else handlePrev()
    }
    touchStartX.current = 0
    touchCurrentX.current = 0
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Main Image */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt="Preview"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
