import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, CalendarDays } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import EmptyState from '../../components/shared/EmptyState'

const estadoBadge = {
  confirmada: 'success',
  entregada: 'info',
  cancelada: 'danger'
}

const authBadgeVariant = {
  aprobada: 'success',
  rechazada: 'danger',
  pendiente: 'warning'
}

export default function MisCitas() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const reservasState = useStore((s) => s.reservas)
  const reservas = reservasState.filter(r => r.pacienteId === usuarioActual?.id)
  const hoy = new Date().toISOString().split('T')[0]

  const proximas = reservas.filter(
    (r) => r.estado === 'confirmada' && r.fechaReclamacion >= hoy
  ).sort((a, b) => a.fechaReclamacion.localeCompare(b.fechaReclamacion))

  const historial = reservas.filter(
    (r) => r.estado === 'entregada' || r.estado === 'cancelada'
  ).sort((a, b) => b.fechaReclamacion.localeCompare(a.fechaReclamacion))

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  function getDiaSemana(fecha) {
    const d = new Date(fecha + 'T12:00:00')
    return diasSemana[d.getDay()]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />

        {/* Próximas citas */}
        <h1 className="text-xl font-bold text-gray-900 mb-4">Próximas citas</h1>
        {proximas.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No hay citas próximas" description="No tienes citas programadas. Busca un medicamento y haz una reserva." actionLabel="Buscar medicamento" onAction={() => navigate('/paciente/buscar')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {proximas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{cita.fechaReclamacion?.split('-')[2]}</span>
                    <p className="text-sm text-gray-500">{getDiaSemana(cita.fechaReclamacion)}</p>
                  </div>
                  <Badge text={cita.estado} variant={estadoBadge[cita.estado]} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-gray-700 font-medium">{cita.horaReclamacion}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{cita.medicamentoNombre}</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">{cita.farmaciaNombre}</p>
                      <p className="text-xs text-gray-400">{cita.farmacia?.direccion || ''}</p>
                    </div>
                  </div>
                  {cita.autorizacion && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Auth:</span>
                      <Badge text={cita.autorizacion.estado} variant={authBadgeVariant[cita.autorizacion.estado] || 'neutral'} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/paciente/farmacias', { state: { lugarId: cita.farmaciaId, tab: 'centros' } })}
                  className="mt-3 w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Cómo llegar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Historial */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Historial de citas</h2>
        {historial.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No hay historial de citas</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                  <th className="text-left px-4 py-3 font-medium">Farmacia</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historial.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{c.fechaReclamacion}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.medicamentoNombre}</td>
                    <td className="px-4 py-3 text-gray-600">{c.farmaciaNombre}</td>
                    <td className="px-4 py-3"><Badge text={c.estado === 'entregada' ? 'Entregada' : 'Cancelada'} variant={estadoBadge[c.estado]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
