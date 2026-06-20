import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Calendar, Pill, Clock, Search, List, CalendarDays, Bell, AlertTriangle, Stethoscope, FileText, ChevronRight } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/shared/Badge'
import useRelativeTime from '../../hooks/useRelativeTime'

const estadoBadge = {
  pendiente: 'warning',
  confirmada: 'success',
  cancelada: 'danger',
  entregada: 'info'
}

const estadoLabel = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  entregada: 'Entregada'
}

export default function DashboardPaciente() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const getReservasPorPaciente = useStore((s) => s.getReservasPorPaciente)
  const inventario = useStore((s) => s.inventario)
  const autorizaciones = useStore((s) => s.autorizaciones)
  const notificaciones = useStore((s) => s.notificaciones)
  const ultimoAcceso = useStore((s) => s.ultimoAcceso)
  const verificarVencimientoReservas = useStore((s) => s.verificarVencimientoReservas)
  const getCitasMedicasPorPaciente = useStore((s) => s.getCitasMedicasPorPaciente)
  const { formatRelativeTime } = useRelativeTime()
  const [vencidas, setVencidas] = useState(0)

  useEffect(() => {
    const count = verificarVencimientoReservas()
    if (count > 0) setVencidas(count)
  }, [])

  const reservas = getReservasPorPaciente(usuarioActual?.id || '')
  const activas = reservas.filter((r) => r.estado === 'pendiente' || r.estado === 'confirmada')
  const proximas = reservas.filter((r) => r.estado === 'confirmada' && r.fechaReclamacion >= new Date().toISOString().split('T')[0])
  const disponibles = inventario.filter((i) => i.stock > 0).length
  const authPendientes = autorizaciones.filter((a) => a.pacienteId === usuarioActual?.id && a.estado === 'pendiente').length

  const hora = new Date().getHours()
  let saludo = 'Buenos días'
  if (hora >= 12 && hora < 18) saludo = 'Buenas tardes'
  if (hora >= 18) saludo = 'Buenas noches'

  const ultimasReservas = reservas.slice(0, 3)
  const notisRecientes = notificaciones.slice(0, 3)
  const citasMedicas = getCitasMedicasPorPaciente(usuarioActual?.id || '')
  const ultimasCitas = citasMedicas.filter(c => c.estado === 'realizada').slice(0, 3)
  const proximasCitasMedicas = citasMedicas.filter(c => c.estado === 'programada')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-gray-900">
          {saludo}, {usuarioActual?.nombre?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">¿Qué necesitas hoy?
          {ultimoAcceso && <span className="text-xs text-gray-400 ml-4">Último acceso: {new Date(ultimoAcceso).toLocaleString('es-CO')}</span>}
        </p>

        {vencidas > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">{vencidas} reserva(s) vencida(s) cancelada(s)</p>
              <p className="text-xs text-red-600">Las reservas con fecha anterior a hoy se cancelaron automáticamente.</p>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Reservas activas" value={activas.length} icon={ShoppingCart} colorClass="bg-blue-100 text-blue-600" />
          <StatCard label="Próximas citas" value={proximas.length} icon={Calendar} colorClass="bg-green-100 text-green-600" />
          <StatCard label="Medicamentos disp." value={disponibles} icon={Pill} colorClass="bg-amber-100 text-amber-600" />
          <StatCard label="Autorizaciones pend." value={authPendientes} icon={Clock} colorClass="bg-red-100 text-red-600" />
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Acciones rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button onClick={() => navigate('/paciente/buscar')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-blue-100 rounded-lg"><Search size={20} className="text-blue-600" /></div>
              <span className="font-medium text-gray-700">Buscar medicamento</span>
            </button>
            <button onClick={() => navigate('/paciente/reservas')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-green-100 rounded-lg"><List size={20} className="text-green-600" /></div>
              <span className="font-medium text-gray-700">Ver mis reservas</span>
            </button>
            <button onClick={() => navigate('/paciente/citas')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="p-2 bg-amber-100 rounded-lg"><CalendarDays size={20} className="text-amber-600" /></div>
              <span className="font-medium text-gray-700">Mis citas</span>
            </button>
            <button onClick={() => navigate('/paciente/historial-medico')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
              <div className="p-2 bg-purple-100 rounded-lg"><FileText size={20} className="text-purple-600" /></div>
              <span className="font-medium text-gray-700">Historial médico</span>
            </button>
          </div>
        </div>

        {/* Últimas citas médicas */}
        {ultimasCitas.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Últimas citas médicas</h2>
              <button onClick={() => navigate('/paciente/historial-medico')} className="text-sm text-accent hover:text-accent/80">Ver historial</button>
            </div>
            <div className="space-y-2">
              {ultimasCitas.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{c.medico}</p>
                    <p className="text-xs text-gray-500">{c.especialidad}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.motivo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(c.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-500">{c.hora}</p>
                  </div>
                  {c.formula && (
                    <div className="flex-shrink-0">
                      <div className="p-1.5 bg-green-100 rounded-lg" title="Tiene fórmula médica">
                        <FileText size={14} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Últimas reservas */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Últimas reservas</h2>
            <button onClick={() => navigate('/paciente/reservas')} className="text-sm text-accent hover:text-accent/80">Ver todas</button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {ultimasReservas.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No tienes reservas aún</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr><th className="text-left px-4 py-3 font-medium">Medicamento</th><th className="text-left px-4 py-3 font-medium">Farmacia</th><th className="text-left px-4 py-3 font-medium">Fecha</th><th className="text-left px-4 py-3 font-medium">Estado</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ultimasReservas.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.medicamentoNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{r.farmaciaNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{r.fechaReclamacion}</td>
                      <td className="px-4 py-3"><Badge text={estadoLabel[r.estado]} variant={estadoBadge[r.estado]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Notificaciones */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notificaciones recientes</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {notisRecientes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay notificaciones</p>
            ) : (
              <div className="space-y-3">
                {notisRecientes.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <Bell size={16} className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">{n.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(n.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
