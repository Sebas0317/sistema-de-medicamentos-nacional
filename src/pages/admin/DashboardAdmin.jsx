import { useNavigate } from 'react-router-dom'
import { Users, Pill, Building2, ShoppingCart, CheckCircle, AlertTriangle, BarChart3, ArrowRight, Activity, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import StatCard from '../../components/shared/StatCard'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6']

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const usuarios = useStore((s) => s.usuarios)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const getStatsGenerales = useStore((s) => s.getStatsGenerales)
  const auditoria = useStore((s) => s.auditoria)
  const ultimoAcceso = useStore((s) => s.ultimoAcceso)

  const stats = getStatsGenerales()
  const pacientes = usuarios.filter((u) => u.rol === 'paciente').length
  const admins = usuarios.filter((u) => u.rol === 'admin').length

  const usuariosPorRol = [
    { name: 'Pacientes', value: pacientes, color: '#2563eb' },
    { name: 'EPS', value: usuarios.filter((u) => u.rol === 'eps').length, color: '#16a34a' },
    { name: 'Farmacias', value: usuarios.filter((u) => u.rol === 'farmacia').length, color: '#d97706' },
    { name: 'Proveedores', value: usuarios.filter((u) => u.rol === 'proveedor').length, color: '#dc2626' },
    { name: 'Admins', value: admins, color: '#8b5cf6' }
  ]

  const eventosRecientes = auditoria.slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="admin" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
        {ultimoAcceso && <p className="text-xs text-gray-400 mt-1 mb-6">Último acceso: {new Date(ultimoAcceso).toLocaleString('es-CO')}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Usuarios registrados" value={usuarios.length} icon={Users} colorClass="bg-purple-100 text-purple-600" />
          <StatCard label="Medicamentos" value={medicamentos.length} icon={Pill} colorClass="bg-blue-100 text-blue-600" />
          <StatCard label="Farmacias" value={farmacias.length} icon={Building2} colorClass="bg-amber-100 text-amber-600" />
          <StatCard label="Total reservas" value={stats.totalReservas} icon={ShoppingCart} colorClass="bg-green-100 text-green-600" />
          <StatCard label="Reservas pendientes" value={stats.reservasPendientes} icon={Clock} colorClass="bg-yellow-100 text-yellow-600" />
          <StatCard label="Auth. pendientes" value={stats.autorizacionesPendientes} icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
          <StatCard label="Med. críticos" value={stats.medicamentosCriticos} icon={BarChart3} colorClass="bg-orange-100 text-orange-600" />
          <StatCard label="Entregas hoy" value={stats.entregasHoy} icon={CheckCircle} colorClass="bg-teal-100 text-teal-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuarios por rol</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={usuariosPorRol} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {usuariosPorRol.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del sistema</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total medicamentos en catálogo</span>
                <span className="font-bold text-lg">{medicamentos.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Alertas de stock crítico</span>
                <span className="font-bold text-lg text-red-600">{stats.medicamentosCriticos}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Autorizaciones pendientes</span>
                <span className="font-bold text-lg text-amber-600">{stats.autorizacionesPendientes}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Entregas realizadas hoy</span>
                <span className="font-bold text-lg text-green-600">{stats.entregasHoy}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => navigate('/admin/reportes')} className="flex-1 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg">Ver reportes</button>
              <button onClick={() => navigate('/admin/auditoria')} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Auditoría</button>
            </div>
          </div>
        </div>

        {/* Eventos recientes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Eventos recientes</h2>
            <button onClick={() => navigate('/admin/auditoria')} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">Ver todos <ArrowRight size={14} /></button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {eventosRecientes.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No hay eventos registrados</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {eventosRecientes.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-3 p-3 hover:bg-gray-50">
                    <Activity size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{evt.detalle}</p>
                      <p className="text-xs text-gray-400">{new Date(evt.fecha).toLocaleString('es-CO')} — {evt.usuarioNombre} ({evt.usuarioRol})</p>
                    </div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{evt.accion}</span>
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
