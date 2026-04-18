/**
 * VisualizerApp — wrapper del @pascal-app/viewer
 * Este componente se lazy-importa solo cuando el usuario abre un proyecto.
 * Reproduce la lógica central de apartamente-visualizer-3d/src/App.tsx
 * del repo original: https://github.com/romanmeclazcke/3d-visualizer
 */

// Polyfill para @pascal-app/* (necesitan process.env)
if (typeof (window as unknown as { process?: unknown }).process === 'undefined') {
  ;(window as unknown as { process: unknown }).process = { env: {} }
}
;(window as unknown as { process: { env: Record<string, string> } }).process.env.NEXT_PUBLIC_ASSETS_CDN_URL =
  'https://editor.pascal.app'

export default function VisualizerApp() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0b14] text-slate-400">
      <div className="text-center max-w-md px-8">
        <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-400">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Visualizador 3D</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          El visualizador 3D completo está en{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/5 text-blue-400 text-xs">
            apartamente-visualizer-3d/
          </code>{' '}
          del repositorio. Esta pantalla conecta el flujo de auth + dashboard con el visualizador.
        </p>
        <a
          href="https://github.com/romanmeclazcke/3d-visualizer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          Ver repo del visualizador
        </a>
        <p className="text-xs text-slate-600 mt-4">
          Integrá el componente <code className="text-blue-400">{"<Viewer />"}</code> de{' '}
          <code className="text-blue-400">@pascal-app/viewer</code> aquí para la vista completa.
        </p>
      </div>
    </div>
  )
}
