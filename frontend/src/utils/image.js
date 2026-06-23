const PLACEHOLDER =
  'https://placehold.co/800x800/f8fafc/94a3b8?text=No+Image+Available&font=roboto'

const API_BASE =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

export const getImage = (url) => {
  if (!url) return PLACEHOLDER
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export const getImageList = (imageUrls, imageUrl) => {
  if (imageUrls?.length) return imageUrls.map(getImage)
  if (imageUrl) return [getImage(imageUrl)]
  return [PLACEHOLDER]
}