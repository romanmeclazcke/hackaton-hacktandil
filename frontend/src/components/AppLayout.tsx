import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/auth.store'

const navItems = [
  {
    to: '/dashboard',
    label: 'Proyectos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/visualizer',
    label: 'Nuevo plano',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const accountType = useAuthStore((s) => s.accountType)
  const userId = useAuthStore((s) => s.userId)
  const companyId = useAuthStore((s) => s.companyId)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const entityId = userId ?? companyId
  const initials = accountType === 'company' ? 'CO' : 'US'

  return (
    <div className="flex h-screen bg-[#0a0b14] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 transition-all duration-300 border-r border-white/5 bg-[#0f1022] ${sidebarOpen ? 'w-56' : 'w-16'}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/5 ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          {sidebarOpen && (
            <span className="font-bold text-white text-sm whitespace-nowrap">
              Viz<span className="gradient-text">3D</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${!sidebarOpen ? 'justify-center' : ''}`
              }
              title={!sidebarOpen ? label : undefined}
            >
              <span className="shrink-0">{icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/5">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/40 to-violet-500/40 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate capitalize">{accountType}</p>
                <p className="text-[10px] text-slate-600 truncate">{entityId?.slice(0, 8)}...</p>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="shrink-0 text-slate-600 hover:text-red-400 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="w-full flex items-center justify-center py-2 text-slate-600 hover:text-red-400 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0f1022]/50 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="mr-4 text-slate-500 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* New project CTA */}
          <NavLink
            to="/visualizer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo proyecto
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
