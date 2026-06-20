import { useEffect, useState, useCallback, useMemo } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import useStore from '../../store/useStore'

const iconMap = {
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' }
}

function ToastItem({ notif, onClose }) {
  const [progress, setProgress] = useState(100)
  const config = iconMap[notif.tipo] || iconMap.info
  const Icon = config.icon

  useEffect(() => {
    const duration = 4000
    const interval = 50
    const step = (interval / duration) * 100
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step
        if (next <= 0) {
          clearInterval(timer)
          return 0
        }
        return next
      })
    }, interval)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress <= 0) {
      const t = setTimeout(() => onClose(notif.id), 0)
      return () => clearTimeout(t)
    }
  }, [progress, notif.id, onClose])

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border ${config.bg} border-gray-100 min-w-[320px] max-w-md relative overflow-hidden animate-slide-in-right`}
    >
      <Icon size={20} className={`${config.color} shrink-0 mt-0.5`} />
      <p className="text-sm text-gray-800 flex-1">{notif.mensaje}</p>
      <button
        onClick={() => onClose(notif.id)}
        className="text-gray-400 hover:text-gray-600 shrink-0"
      >
        <X size={16} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-gray-200 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function ToastContainer() {
  const notificaciones = useStore((s) => s.notificaciones)
  const marcarNotificacionLeida = useStore((s) => s.marcarNotificacionLeida)
  const usuarioActual = useStore((s) => s.usuarioActual)

  const notificacionesFiltradas = useMemo(() => {
    return notificaciones.filter((n) => {
      if (n.usuarioId === usuarioActual?.id) return true
      if (n.rol === usuarioActual?.rol) return true
      if (n.rol === undefined) return true
      return false
    })
  }, [notificaciones, usuarioActual])

  const noLeidas = notificacionesFiltradas.filter((n) => !n.leida).slice(0, 3)

  const handleClose = useCallback((id) => {
    marcarNotificacionLeida(id)
  }, [marcarNotificacionLeida])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {noLeidas.map((n) => (
        <ToastItem key={n.id} notif={n} onClose={handleClose} />
      ))}
    </div>
  )
}
