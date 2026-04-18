import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '../components/AppLayout'
import ProtectedRoute from '../components/ProtectedRoute'

const LoginPage = lazy(() => import('../features/auth/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'))
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const VisualizerPage = lazy(() => import('../features/visualizer/VisualizerPage'))

function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <svg className="animate-spin-slow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <span className="text-sm">Cargando...</span>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
  },
  {
    path: '/register',
    element: <Suspense fallback={<Loading />}><RegisterPage /></Suspense>,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense>,
      },
      {
        path: 'visualizer',
        element: <Suspense fallback={<Loading />}><VisualizerPage /></Suspense>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
