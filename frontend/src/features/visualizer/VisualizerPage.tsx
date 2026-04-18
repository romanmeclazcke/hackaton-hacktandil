import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// @pascal-app polyfill
type WinWithProcess = { process?: { env?: Record<string, string> } }
const _win = window as WinWithProcess
if (!_win.process?.env) {
  _win.process = { env: {} }
}
_win.process!.env!['NEXT_PUBLIC_ASSETS_CDN_URL'] = 'https://editor.pascal.app'

type ViewMode = 'upload' | 'processing' | 'ready'

export default function VisualizerPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<ViewMode>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Lazy load the heavy visualizer only when needed
  const [VisualizerApp, setVisualizerApp] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    if (mode === 'ready') {
      import('./VisualizerApp').then((m) => setVisualizerApp(() => m.default)).catch(console.error)
    }
  }, [mode])

  function handleFile(file: File) {
    if (!file.type.match(/^image\//)) {
      setError('Solo se aceptan imágenes (JPG, PNG, WebP)')
      return
    }
    setError(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    if (!projectName) setProjectName(file.name.replace(/\.[^.]+$/, ''))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleProcess() {
    if (!selectedFile) return
    setMode('processing')
    // Simulate a short processing delay (real processing happens inside VisualizerApp)
    await new Promise((r) => setTimeout(r, 1200))
    setMode('ready')
  }

  // Full-screen visualizer
  if (mode === 'ready') {
    return (
      <div className="h-full flex flex-col">
        {/* Thin bar above the visualizer */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#0f1022]/80 shrink-0">
          <button
            onClick={() => { setMode('upload'); setSelectedFile(null); setPreviewUrl(null) }}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span className="text-sm text-white font-medium truncate">{projectName || 'Nuevo proyecto'}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">Vista 3D activa</span>
          </div>
        </div>

        {/* Visualizer iframe-like area */}
        {VisualizerApp ? (
          <div className="flex-1 overflow-hidden">
            <VisualizerApp />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <svg className="animate-spin-slow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span className="text-sm">Cargando visualizador...</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in-up">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver al dashboard
      </button>

      <h1 className="text-2xl font-bold text-white mb-2">Nuevo proyecto</h1>
      <p className="text-slate-400 text-sm mb-8">Subí el plano de tu apartamento y lo convertimos en 3D</p>

      {/* Project name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre del proyecto</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Ej: Departamento Av. Colón 423"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
          dragOver
            ? 'border-blue-500 bg-blue-500/5'
            : selectedFile
            ? 'border-green-500/40 bg-green-500/5'
            : 'border-white/10 hover:border-white/20 bg-white/[0.02] cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        {selectedFile && previewUrl ? (
          <div className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span className="text-sm font-medium text-white">Imagen cargada</span>
                </div>
                <p className="text-sm text-slate-400 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null) }}
                  className="mt-3 text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Cambiar imagen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${dragOver ? 'bg-blue-500/20 text-blue-400 scale-110' : 'bg-white/5 text-slate-500'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-white font-medium mb-1">
              {dragOver ? 'Soltá el archivo' : 'Arrastrá tu plano aquí'}
            </p>
            <p className="text-slate-500 text-sm mb-4">o hacé click para seleccionar</p>
            <p className="text-xs text-slate-600">JPG, PNG, WebP — hasta 20MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Process button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleProcess}
          disabled={!selectedFile || mode === 'processing'}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25"
        >
          {mode === 'processing' ? (
            <>
              <svg className="animate-spin-slow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Procesando con IA...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Generar vista 3D
            </>
          )}
        </button>
      </div>

      {/* How it works */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <p className="text-xs text-slate-600 mb-4 uppercase tracking-wider">Cómo funciona</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '1', text: 'Subís el plano de tu apartamento' },
            { step: '2', text: 'La IA detecta paredes y ambientes' },
            { step: '3', text: 'Explorás en 3D inmersivo' },
          ].map(({ step, text }) => (
            <div key={step} className="text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center mx-auto mb-2">
                {step}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
