import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import useStore from '../../store/useStore'

const roleConfig = {
  paciente: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Paciente', border: 'border-blue-600' },
  eps: { color: 'text-green-600', bg: 'bg-green-50', label: 'EPS', border: 'border-green-600' },
  farmacia: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Farmacia', border: 'border-amber-600' },
   proveedor: { color: 'text-red-600', bg: 'bg-red-50', label: 'Proveedor', border: 'border-red-600' },
   admin: { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Admin', border: 'border-purple-600' }
}

const roleLinks = {
   paciente: [
     { label: 'Inicio', path: '/paciente/dashboard' },
     { label: 'Buscar', path: '/paciente/buscar' },
     { label: 'Reservas', path: '/paciente/reservas' },
     { label: 'Citas', path: '/paciente/citas' },
     { label: 'Farmacias y Hospitales', path: '/paciente/farmacias' }
   ],
  eps: [
    { label: 'Inicio', path: '/eps/dashboard' },
    { label: 'Solicitudes', path: '/eps/solicitudes' },
    { label: 'Historial', path: '/eps/historial' }
  ],
  farmacia: [
    { label: 'Inicio', path: '/farmacia/dashboard' },
    { label: 'Inventario', path: '/farmacia/inventario' },
    { label: 'Entregas', path: '/farmacia/entregas' }
  ],
   proveedor: [
     { label: 'Inicio', path: '/proveedor/dashboard' },
     { label: 'Alertas', path: '/proveedor/alertas' },
     { label: 'Suministros', path: '/proveedor/suministro' }
   ],
   admin: [
     { label: 'Dashboard', path: '/admin/dashboard' },
     { label: 'Reportes', path: '/admin/reportes' },
     { label: 'Auditoría', path: '/admin/auditoria' }
   ]
 }

export default function Navbar({ rol }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const logout = useStore((s) => s.logout)

  const config = roleConfig[rol] || roleConfig.paciente
  const links = roleLinks[rol] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = usuarioActual
    ? usuarioActual.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to={`/${rol}/dashboard`} className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">SNSDM</span>
              <span className={`text-sm font-semibold ${config.color}`}>| {config.label}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? `${config.bg} ${config.color}`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* User info & logout */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={`/${rol}/perfil`}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <div className={`w-8 h-8 rounded-full ${config.color.replace('text', 'bg').replace('600', '100')} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${config.color}`}>{initials}</span>
              </div>
              <span className="font-medium">{usuarioActual?.nombre?.split(' ')[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? `${config.bg} ${config.color}`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <hr className="my-2 border-gray-200" />
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
              <div className={`w-8 h-8 rounded-full ${config.color.replace('text', 'bg').replace('600', '100')} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${config.color}`}>{initials}</span>
              </div>
              <span className="font-medium">{usuarioActual?.nombre}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
