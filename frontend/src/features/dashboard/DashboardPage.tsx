import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../auth/auth.store'

interface Project {
  id: string
  name: string
  roomCount: number
  area: number
  status: 'ready' | 'processing' | 'draft'
  createdAt: string
  thumbnail?: string
}

// Mock data — cuando el backend tenga endpoint de proyectos, se reemplaza
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Departamento Av. Colón 423',
    roomCount: 3,
    area: 72,
    status: 'ready',
    createdAt: '2026-04-17',
  },
  {
    id: '2',
    name: 'Planta tipo — Torre Central',
    roomCount: 4,
    area: 95,
    status: 'ready',
    createdAt: '2026-04-16',
  },
  {
    id: '3',
    name: 'Loft — Barrio Histórico',
    roomCount: 1,
    area: 48,
    status: 'draft',
    createdAt: '2026-04-15',
  },
]

const statusConfig = {
  ready: { label: 'Listo', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  processing: { label: 'Procesando', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  draft: { label: 'Borrador', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const accountType = useAuthStore((s) => s.accountType)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'ready' | 'draft'>('all')

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-8 animate-fade-in-up">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {accountType === 'company' ? 'Proyectos de la empresa' : 'Mis proyectos'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {MOCK_PROJECTS.length} proyecto{MOCK_PROJECTS.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total proyectos',
            value: MOCK_PROJECTS.length,
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
            color: 'text-blue-400',
          },
          {
            label: 'Listos',
            value: MOCK_PROJECTS.filter((p) => p.status === 'ready').length,
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
            color: 'text-green-400',
          },
          {
            label: 'Superficie total',
            value: `${MOCK_PROJECTS.reduce((a, p) => a + p.area, 0)}m²`,
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
            color: 'text-violet-400',
          },
          {
            label: 'Habitaciones',
            value: MOCK_PROJECTS.reduce((a, p) => a + p.roomCount, 0),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            ),
            color: 'text-pink-400',
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass rounded-xl border border-white/5 p-4">
            <div className={`${color} mb-2`}>{icon}</div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all"
          />
        </div>

        <div className="flex rounded-xl border border-white/10 bg-white/3 p-1 shrink-0">
          {(['all', 'ready', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'ready' ? 'Listos' : 'Borradores'}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4 text-slate-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">No hay proyectos</h3>
          <p className="text-slate-500 text-sm mb-6">
            {search ? `No encontramos resultados para "${search}"` : 'Creá tu primer proyecto subiendo un plano'}
          </p>
          <button
            onClick={() => navigate('/visualizer')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo proyecto
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New project card */}
          <button
            onClick={() => navigate('/visualizer')}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/40 bg-white/[0.02] hover:bg-blue-500/5 transition-all duration-200 p-8 min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Nuevo proyecto</p>
              <p className="text-xs text-slate-500 mt-0.5">Subir plano de planta</p>
            </div>
          </button>

          {/* Project cards */}
          {filtered.map((project) => {
            const status = statusConfig[project.status]
            return (
              <div
                key={project.id}
                className="group glass rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/visualizer?project=${project.id}`)}
              >
                {/* Preview area */}
                <div className="h-36 bg-[#141629] relative overflow-hidden">
                  {/* 3D room SVG placeholder */}
                  <svg viewBox="0 0 300 140" className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="60,110 150,135 240,110 150,85" fill="rgba(59,92,245,0.1)" stroke="rgba(91,134,252,0.4)" strokeWidth="1"/>
                    <polygon points="60,30 60,110 150,85 150,5" fill="rgba(59,92,245,0.15)" stroke="rgba(91,134,252,0.3)" strokeWidth="1"/>
                    <polygon points="240,30 240,110 150,85 150,5" fill="rgba(139,92,246,0.15)" stroke="rgba(167,139,250,0.3)" strokeWidth="1"/>
                    <rect x="75" y="45" width="45" height="35" rx="2" fill="rgba(91,134,252,0.08)" stroke="rgba(91,134,252,0.4)" strokeWidth="1"/>
                    <rect x="195" y="55" width="30" height="45" rx="2" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.4)" strokeWidth="1"/>
                  </svg>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-medium backdrop-blur-sm">
                      Abrir en 3D →
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{project.name}</h3>
                    <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                      {project.roomCount} hab.
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                      </svg>
                      {project.area}m²
                    </span>
                    <span className="ml-auto">{project.createdAt}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
