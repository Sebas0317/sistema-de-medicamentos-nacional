import { useNavigate } from 'react-router-dom'
import { User, Building2, Pill, Truck, Shield } from 'lucide-react'
import useStore from '../store/useStore'

const roles = [
  {
    title: 'Paciente',
    description: 'Consulta disponibilidad y reserva tus medicamentos',
    icon: User,
    path: '/paciente/login',
    color: 'text-blue-600',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'hover:border-blue-300',
    btn: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'EPS',
    description: 'Gestiona autorizaciones y cobertura de medicamentos',
    icon: Building2,
    path: '/eps/login',
    color: 'text-green-600',
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'hover:border-green-300',
    btn: 'bg-green-600 hover:bg-green-700'
  },
  {
    title: 'Farmacia',
    description: 'Administra inventario y confirma entregas',
    icon: Pill,
    path: '/farmacia/login',
    color: 'text-amber-600',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'hover:border-amber-300',
    btn: 'bg-amber-600 hover:bg-amber-700'
  },
  {
     title: 'Proveedor',
     description: 'Registra suministros y monitorea alertas de stock',
     icon: Truck,
     path: '/proveedor/login',
     color: 'text-red-600',
     bg: 'bg-red-50 hover:bg-red-100',
     border: 'hover:border-red-300',
     btn: 'bg-red-600 hover:bg-red-700'
   },
   {
     title: 'Administrador',
     description: 'Monitorea el sistema y genera reportes',
     icon: Shield,
     path: '/admin/login',
     color: 'text-purple-600',
     bg: 'bg-purple-50 hover:bg-purple-100',
     border: 'hover:border-purple-300',
     btn: 'bg-purple-600 hover:bg-purple-700'
   }
 ]

const dashboardPaths = {
  paciente: '/paciente/dashboard',
  eps: '/eps/dashboard',
  farmacia: '/farmacia/dashboard',
  proveedor: '/proveedor/dashboard',
  admin: '/admin/dashboard'
}

export default function LandingPage() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          SNSDM
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-600">
          Sistema Nacional de Seguimiento y Disponibilidad de Medicamentos
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Plataforma digital para la gestión de medicamentos en Colombia
        </p>
      </header>

      {/* Si ya hay usuario logueado */}
      {usuarioActual && (
        <div className="text-center mb-6">
          <button
            onClick={() => navigate(dashboardPaths[usuarioActual.rol] || '/')}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-md"
          >
            Continuar como {usuarioActual.nombre.split(' ')[0]} ({usuarioActual.rol})
          </button>
          <button
            onClick={() => {
              useStore.getState().logout()
              navigate('/')
            }}
            className="ml-3 px-4 py-3 text-sm text-gray-500 hover:text-red-600 underline"
          >
            Salir
          </button>
        </div>
      )}

      {/* Grid de roles */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
          {roles.map((rol) => {
            const Icon = rol.icon
            return (
              <div
                key={rol.title}
                className={`p-6 bg-white rounded-2xl shadow-sm border border-gray-100 ${rol.bg} ${rol.border} transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer`}
                onClick={() => navigate(rol.path)}
              >
                <div className={`p-3 rounded-xl ${rol.color.replace('text', 'bg').replace('600', '100')} w-fit mb-4`}>
                  <Icon size={32} className={rol.color} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{rol.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{rol.description}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(rol.path) }}
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg ${rol.btn} transition-colors shadow-sm`}
                >
                  Ingresar
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200">
        Universidad del Tolima &middot; Ingeniería de Software IV Semestre &middot; 2026
      </footer>
    </div>
  )
}
