import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse } from './auth.api'

interface AuthState {
  token: string | null
  accountType: 'user' | 'company' | null
  userId: string | null
  companyId: string | null
  expiresAt: string | null

  setAuth: (data: LoginResponse) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      accountType: null,
      userId: null,
      companyId: null,
      expiresAt: null,

      setAuth: (data) =>
        set({
          token: data.access_token,
          accountType: data.account_type,
          userId: data.user_id,
          companyId: data.company_id,
          expiresAt: data.expires_at,
        }),

      logout: () =>
        set({
          token: null,
          accountType: null,
          userId: null,
          companyId: null,
          expiresAt: null,
        }),

      isAuthenticated: () => {
        const { token, expiresAt } = get()
        if (!token || !expiresAt) return false
        return new Date(expiresAt) > new Date()
      },
    }),
    {
      name: 'viz3d-auth',
    }
  )
)
