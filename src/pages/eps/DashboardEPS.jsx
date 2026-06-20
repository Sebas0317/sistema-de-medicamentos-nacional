import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, BarChart3, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/shared/Badge'
import useRelativeTime from '../../hooks/useRelativeTime'

const chartData = [
  { dia: 'Lun', aprobadas: 4, rechazadas: 1, pendientes: 2 },
  { dia: 'Mar', aprobadas: 6, rechazadas: 2, pendientes: 3 },
  { dia: 'Mié', aprobadas: 3, rechazadas: 0, pendientes: 5 },
  { dia: 'Jue', aprobadas: 7, rechazadas: 1, pendientes: 1 },
  { dia: 'Vie', aprobadas: 5, rechazadas: 3, pendientes: 4 },
  { dia: 'Sáb', aprobadas: 2, rechazadas: 0, pendientes: 2 },
  { dia: 'Dom', aprobadas: 1, rechazadas: 1, pendientes: 3 }
]

export default function DashboardEPS() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const autorizacionesState = useStore((s) => s.autorizaciones)
  const usuarios = useStore((s) => s.usuarios)
  const medicamentos = useStore((s) => s.medicamentos)
  const { formatRelativeTime } = useRelativeTime()

  const epsId = usuarioActual?.epsId || ''
  const auths = autorizacionesState
    .filter(a => a.epsId === epsId)
    .map(a => {
      const paciente = usuarios.find(u => u.id === a.pacienteId)
      const medicamento = medicamentos.find(m => m.id === a.medicamentoId)
      return {
        ...a,
        pacienteNombre: paciente ? paciente.nombre : '',
        pacienteDocumento: paciente ? paciente.documento : '',
        medicamentoNombre: medicamento ? medicamento.nombre : '',
        medicamento: medicamento || null
      }
    })
  const pendientes = auths.filter((a) => a.estado === 'pendiente')
  const hoy = new Date().toISOString().split('T')[0]
  const aprobadasHoy = auths.filter((a) => a.estado === 'aprobada' && a.fechaRespuesta?.startsWith(hoy))
  const rechazadasHoy = auths.filter((a) => a.estado === 'rechazada' && a.fechaRespuesta?.startsWith(hoy))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="eps" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900">Bienvenida, {usuarioActual?.entidadNombre || 'EPS'}</h1>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Solicitudes pendientes" value={pendientes.length} icon={Clock} colorClass="bg-yellow-100 text-yellow-600" />
          <StatCard label="Aprobadas hoy" value={aprobadasHoy.length} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
          <StatCard label="Rechazadas hoy" value={rechazadasHoy.length} icon={XCircle} colorClass="bg-red-100 text-red-600" />
          <StatCard label="Total gestionadas" value={auths.length} icon={BarChart3} colorClass="bg-blue-100 text-blue-600" />
        </div>

        {/* Gráfica */}
        <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Autorizaciones por estado — últimos 7 días</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="aprobadas" fill="#22c55e" name="Aprobadas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rechazadas" fill="#ef4444" name="Rechazadas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendientes" fill="#eab308" name="Pendientes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Solicitudes urgentes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Solicitudes urgentes</h2>
            <button onClick={() => navigate('/eps/solicitudes')} className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">Ver todas <ArrowRight size={14} /></button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="text-left px-4 py-3 font-medium">Paciente</th><th className="text-left px-4 py-3 font-medium">Medicamento</th><th className="text-left px-4 py-3 font-medium">Fecha</th><th className="text-left px-4 py-3 font-medium">Prioridad</th><th className="text-left px-4 py-3 font-medium">Acción</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendientes.slice(0, 3).map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.pacienteNombre}</td>
                    <td className="px-4 py-3 text-gray-600">{a.medicamentoNombre}</td>
                    <td className="px-4 py-3 text-gray-600">{a.fechaSolicitud?.split('T')[0]}</td>
                    <td className="px-4 py-3"><Badge text={a.medicamento?.requiereAutorizacion ? 'Alta' : 'Normal'} variant={a.medicamento?.requiereAutorizacion ? 'danger' : 'info'} /></td>
                    <td className="px-4 py-3"><button onClick={() => navigate('/eps/solicitudes')} className="text-sm text-green-600 hover:text-green-700 font-medium">Gestionar</button></td>
                  </tr>
                ))}
                {pendientes.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No hay solicitudes urgentes</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
