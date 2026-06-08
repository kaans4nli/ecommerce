const PLACEHOLDER =
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800'

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