const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  account_type: 'user' | 'company'
  user_id: string | null
  company_id: string | null
  expires_at: string
}

export interface UserCreate {
  name: string
  lastnames: string
  email: string
  password: string
}

export interface UserResponse {
  id: string
  name: string
  lastnames: string
  email: string
  is_active: boolean
  created_at: string
}

export interface CompanyCreate {
  name: string
  email: string
  password: string
}

export interface CompanyResponse {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
}

export interface ApiError {
  detail: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (data: LoginRequest) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerUser: (data: UserCreate) =>
    request<UserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerCompany: (data: CompanyCreate) =>
    request<CompanyResponse>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
