import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const labelMap = {
  paciente: 'Paciente',
  eps: 'EPS',
  farmacia: 'Farmacia',
  proveedor: 'Proveedor',
  admin: 'Administrador',
  dashboard: 'Inicio',
  buscar: 'Buscar medicamento',
  reservas: 'Mis reservas',
  citas: 'Mis citas',
  farmacias: 'Farmacias y centros de salud',
  solicitudes: 'Solicitudes',
  historial: 'Historial',
  inventario: 'Inventario',
  entregas: 'Entregas',
  alertas: 'Alertas de stock',
  suministro: 'Registrar suministro',
  reportes: 'Reportes',
  auditoria: 'Auditoría',
  perfil: 'Mi perfil'
}

export default function Breadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const pathLabels = segments.map((seg, i) => ({
    label: labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    path: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1
  }))

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-gray-700">
        <Home size={14} />
      </Link>
      {pathLabels.map((item) => (
        <span key={item.path} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-gray-300" />
          {item.isLast ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-gray-700">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
