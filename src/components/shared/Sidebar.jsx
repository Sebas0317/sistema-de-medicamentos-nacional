import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import useStore from '../../store/useStore'

const roleConfig = {
  paciente: { color: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-50 hover:text-blue-600', label: 'Paciente', light: 'bg-blue-50' },
  eps: { color: 'text-green-600', bg: 'bg-green-600', hover: 'hover:bg-green-50 hover:text-green-600', label: 'EPS', light: 'bg-green-50' },
  farmacia: { color: 'text-amber-600', bg: 'bg-amber-600', hover: 'hover:bg-amber-50 hover:text-amber-600', label: 'Farmacia', light: 'bg-amber-50' },
   proveedor: { color: 'text-red-600', bg: 'bg-red-600', hover: 'hover:bg-red-50 hover:text-red-600', label: 'Proveedor', light: 'bg-red-50' },
   admin: { color: 'text-purple-600', bg: 'bg-purple-600', hover: 'hover:bg-purple-50 hover:text-purple-600', label: 'Admin', light: 'bg-purple-50' }
}

export default function Sidebar({ rol, links }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const logout = useStore((s) => s.logout)

  const config = roleConfig[rol] || roleConfig.paciente

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = usuarioActual
    ? usuarioActual.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
        {!collapsed && (
          <span className="text-xl font-bold text-gray-900">
            SNSDM <span className={`text-sm font-semibold ${config.color}`}>| {config.label}</span>
          </span>
        )}
        {collapsed && <span className="text-xl font-bold text-gray-900 mx-auto">S</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          const Icon = link.icon
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? `${config.bg} text-white`
                  : `text-gray-600 ${config.hover}`
              }`}
              title={collapsed ? link.label : ''}
            >
              {Icon && <Icon size={20} className="shrink-0" />}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${config.light} flex items-center justify-center shrink-0`}>
            <span className={`text-xs font-bold ${config.color}`}>{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {usuarioActual?.nombre?.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">{rol}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 mt-3 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Cerrar sesión"
        >
          <LogOut size={16} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
