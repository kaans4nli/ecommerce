import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Sync token to localStorage for axios interceptor
        if (state?.token) {
          localStorage.setItem('admin_token', state.token)
        }
      }
    }
  )
)