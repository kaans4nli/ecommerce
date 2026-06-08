import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.find(i => i.id === product.id)
        if (exists) {
          set({ items: get().items.filter(i => i.id !== product.id) })
        } else {
          set({ items: [...get().items, product] })
        }
      },

      isFavorite: (id) => get().items.some(i => i.id === id),

      remove: (id) =>
        set({ items: get().items.filter(i => i.id !== id) }),

      clear: () => set({ items: [] }),
    }),
    { name: 'favorites-storage' }
  )
)