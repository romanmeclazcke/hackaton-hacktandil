import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { authApi } from './auth.api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)

  const isCompany = params.get('type') === 'company'

  const [form, setForm] = useState({
    name: '',
    lastnames: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      if (isCompany) {
        await authApi.registerCompany({ name: form.name, email: form.email, password: form.password })
      } else {
        await authApi.registerUser({ name: form.name, lastnames: form.lastnames, email: form.email, password: form.password })
      }
      // Auto-login after register
      const loginData = await authApi.login({ email: form.email, password: form.password })
      setAuth(loginData)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px] top-[-100px] right-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px] bottom-[-100px] left-[-100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Viz<span className="gradient-text">3D</span></span>
          </a>

          {/* Type toggle */}
          <div className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/3 p-1">
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isCompany ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Usuario
            </Link>
            <Link
              to="/register?type=company"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isCompany ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Empresa
            </Link>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white">
            {isCompany ? 'Crear cuenta empresa' : 'Crear cuenta'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isCompany ? 'Registrá tu empresa para gestionar proyectos' : 'Empezá a visualizar tus planos en 3D'}
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/8 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {isCompany ? 'Nombre de la empresa' : 'Nombre'}
              </label>
              <input
                name="name"
                type="text"
                required
                minLength={3}
                value={form.name}
                onChange={handleChange}
                placeholder={isCompany ? 'Inmobiliaria XYZ' : 'Juan'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            {!isCompany && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Apellido</label>
                <input
                  name="lastnames"
                  type="text"
                  required
                  minLength={3}
                  value={form.lastnames}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirmar contraseña</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repetí tu contraseña"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Creando cuenta...
                </>
              ) : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          <a href="/" className="hover:text-slate-400 transition-colors">← Volver a la landing</a>
        </p>
      </div>
    </div>
  )
}
