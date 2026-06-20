import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const reservaDates = new Set(reservas.map(r => r.fechaReclamacion))

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayHeaders = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  function getCalendarDays(y, m) {
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const prevMonthDays = new Date(y, m, 0).getDate()
    const days = []

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, current: true })
    }
    const rest = 42 - days.length
    for (let i = 1; i <= rest; i++) {
      days.push({ day: i, current: false })
    }
    return days
  }

  function formatDate(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  function isToday(y, m, d) {
    const t = new Date()
    return y === t.getFullYear() && m === t.getMonth() && d === t.getDate()
  }

  function handleDayClick(day, current) {
    if (!current) return
    const dateStr = formatDate(year, month, day)
    if (reservaDates.has(dateStr)) {
      setSelectedDate(selectedDate === dateStr ? null : dateStr)
    }
  }

  const calendarDays = getCalendarDays(year, month)

  const proximas = reservas.filter(
    (r) => r.estado === 'confirmada' && r.fechaReclamacion >= hoy &&
    (!selectedDate || r.fechaReclamacion === selectedDate)
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

        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">{monthNames[month]} {year}</span>
            <button
              onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-1">
            {dayHeaders.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((d, i) => {
              const dateStr = formatDate(year, month, d.day)
              const hasAppt = d.current && reservaDates.has(dateStr)
              const today = isToday(year, month, d.day)
              const isSelected = selectedDate === dateStr

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(d.day, d.current)}
                  className={`py-1 relative cursor-pointer select-none
                    ${!d.current ? 'text-gray-300' : 'text-gray-900'}
                  `}
                >
                  <div className={`
                    w-9 h-9 mx-auto flex items-center justify-center text-sm rounded-full
                    ${today ? 'bg-blue-600 text-white font-semibold' : ''}
                    ${isSelected && !today ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
                    ${hasAppt && !today && !isSelected ? 'font-medium' : ''}
                    ${d.current && !today && !isSelected ? 'hover:bg-gray-100' : ''}
                  `}>
                    {d.day}
                  </div>
                  {hasAppt && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Próximas citas */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Próximas citas</h1>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mostrar todas
            </button>
          )}
        </div>
        {proximas.length === 0 ? (
          selectedDate ? (
            <EmptyState
              icon={CalendarDays}
              title="Sin citas en esta fecha"
              description={`No tienes citas programadas para el ${selectedDate}.`}
              actionLabel="Mostrar todas"
              onAction={() => setSelectedDate(null)}
            />
          ) : (
            <EmptyState icon={CalendarDays} title="No hay citas próximas" description="No tienes citas programadas. Busca un medicamento y haz una reserva." actionLabel="Buscar medicamento" onAction={() => navigate('/paciente/buscar')} />
          )
        ) : (
          <>
            {selectedDate && (
              <p className="text-sm text-gray-500 mb-3">Mostrando citas del {selectedDate}</p>
            )}
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
          </>
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
