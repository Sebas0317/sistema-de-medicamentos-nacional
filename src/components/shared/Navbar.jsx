import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Moon, Sun, Bell, CheckCircle, AlertTriangle, Info, Palette } from 'lucide-react'
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
      { label: 'Historial Médico', path: '/paciente/historial-medico' },
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
     { label: 'Suministros', path: '/proveedor/suministro' },
     { label: 'Mensajes', path: '/proveedor/mensajes' }
   ],
   admin: [
     { label: 'Dashboard', path: '/admin/dashboard' },
     { label: 'Reportes', path: '/admin/reportes' },
     { label: 'Auditoría', path: '/admin/auditoria' }
   ]
 }

export default function Navbar({ rol }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const logout = useStore((s) => s.logout)
  const darkMode = useStore((s) => s.darkMode)
  const toggleDarkMode = useStore((s) => s.toggleDarkMode)
  const notificaciones = useStore((s) => s.notificaciones)
  const accentColor = useStore((s) => s.accentColor)
  const setAccentColor = useStore((s) => s.setAccentColor)

  const [colorOpen, setColorOpen] = useState(false)
  const colorRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false)
    }
    if (colorOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [colorOpen])

  const colores = [
    { id: 'default', label: 'Por defecto', color: '#6366f1' },
    { id: 'blue', label: 'Azul', color: '#2563eb' },
    { id: 'green', label: 'Verde', color: '#16a34a' },
    { id: 'amber', label: 'Ambar', color: '#d97706' },
    { id: 'red', label: 'Rojo', color: '#dc2626' },
    { id: 'purple', label: 'Púrpura', color: '#8b5cf6' },
  ]
  const marcarNotificacionLeida = useStore((s) => s.marcarNotificacionLeida)
  const marcarTodasNotificacionesLeidas = useStore((s) => s.marcarTodasNotificacionesLeidas)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const config = roleConfig[rol] || roleConfig.paciente
  const links = roleLinks[rol] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = usuarioActual
    ? usuarioActual.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : ''

  const notificacionesFiltradas = notificaciones.filter((n) => {
    if (n.usuarioId === usuarioActual?.id) return true
    if (n.rol === usuarioActual?.rol) return true
    if (n.rol === undefined) return true
    return false
  })

  const notificacionesRecientes = notificacionesFiltradas.slice(0, 5)
  const noLeidas = notificacionesFiltradas.filter((n) => !n.leida).length

  const getNotifIcon = (tipo) => {
    switch (tipo) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />
      case 'error':
        return <AlertTriangle size={16} className="text-red-500" />
      default:
        return <Info size={16} className="text-blue-500" />
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'Ahora'
    if (diffMin < 60) return `Hace ${diffMin} min`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `Hace ${diffHrs}h`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `Hace ${diffDays}d`
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to={`/${rol}/dashboard`} className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">SNSDM</span>
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
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Accent Color */}
            <div className="relative" ref={colorRef}>
              <button onClick={() => setColorOpen(!colorOpen)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Palette size={18} />
              </button>
              {colorOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-3 w-48">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color acento</p>
                  <div className="space-y-1">
                    {colores.map(c => (
                      <button key={c.id} onClick={() => { setAccentColor(c.id); setColorOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${accentColor === c.id ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: c.color }} />
                        <span className="text-gray-700 dark:text-gray-200">{c.label}</span>
                        {accentColor === c.id && <span className="ml-auto text-xs text-accent">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Bell size={18} />
                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {noLeidas > 9 ? '9+' : noLeidas}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notificacionesRecientes.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No hay notificaciones
                      </div>
                    ) : (
                      notificacionesRecientes.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => marcarNotificacionLeida(notif.id)}
                          className={`w-full text-left flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !notif.leida ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {getNotifIcon(notif.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!notif.leida ? 'font-semibold' : ''} text-gray-800 dark:text-gray-200`}>
                              {notif.mensaje}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                              {formatTime(notif.timestamp || notif.fecha)}
                            </p>
                          </div>
                          {!notif.leida && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                  {notificacionesFiltradas.length > 0 && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => marcarTodasNotificacionesLeidas()}
                        className="w-full px-3 py-1.5 text-xs text-center text-accent hover:bg-accent/10 dark:hover:bg-accent/20 rounded-lg transition-colors"
                      >
                        Marcar todas como leídas
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to={`/${rol}/perfil`}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <div className={`w-8 h-8 rounded-full ${config.color.replace('text', 'bg').replace('600', '100')} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${config.color}`}>{initials}</span>
              </div>
              <span className="font-medium">{usuarioActual?.nombre?.split(' ')[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
              <div className={`w-8 h-8 rounded-full ${config.color.replace('text', 'bg').replace('600', '100')} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${config.color}`}>{initials}</span>
              </div>
              <span className="font-medium">{usuarioActual?.nombre}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Bell size={16} />
                <span>Notificaciones</span>
                {noLeidas > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {noLeidas > 9 ? '9+' : noLeidas}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
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
