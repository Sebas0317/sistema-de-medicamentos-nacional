import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, TrendingUp, Package, Layers, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/shared/Badge'
import ChatPanel from '../../components/chat/ChatPanel'

const topMedicamentosData = [
  { nombre: 'Metformina 850mg', reservas: 12 },
  { nombre: 'Acetaminofén 500mg', reservas: 10 },
  { nombre: 'Insulina Glargina', reservas: 8 },
  { nombre: 'Losartán 50mg', reservas: 7 },
  { nombre: 'Amoxicilina 500mg', reservas: 6 }
]

const suministrosSemanales = [
  { semana: 'Sem 1', cantidad: 450 },
  { semana: 'Sem 2', cantidad: 620 },
  { semana: 'Sem 3', cantidad: 380 },
  { semana: 'Sem 4', cantidad: 710 }
]

export default function DashboardProveedor() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const inventario = useStore((s) => s.inventario)
  const farmacias = useStore((s) => s.farmacias)
  const medicamentos = useStore((s) => s.medicamentos)
  const suministros = useStore((s) => s.suministros)
  const getMedicamentosCriticos = useStore((s) => s.getMedicamentosCriticos)
  const ultimoAcceso = useStore((s) => s.ultimoAcceso)

  const [hora, setHora] = useState(new Date().toLocaleString('es-CO'))

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date().toLocaleString('es-CO')), 60000)
    return () => clearInterval(timer)
  }, [])

  const proveedorId = usuarioActual?.entidadId || ''

  // Farmacias con alerta (al menos 1 crítico)
  const criticos = getMedicamentosCriticos()
  const farmaciasConAlerta = new Set(criticos.map((c) => c.farmaciaId)).size

  // Suministros este mes
  const mesActual = new Date().getMonth()
  const suministrosEsteMes = suministros.filter((s) => {
    const fecha = new Date(s.fechaRegistro)
    return fecha.getMonth() === mesActual && s.proveedorId === proveedorId
  }).length

  // Medicamentos críticos total
  const medicamentosCriticos = criticos.length

  // Lotes activos (últimos 30 días)
  const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const lotesActivos = suministros.filter((s) => {
    const fecha = new Date(s.fechaRegistro)
    return fecha >= hace30Dias && s.estado === 'entregado'
  }).length

  // Farmacias críticas para tabla urgente
  const farmaciasUrgentes = []
  farmacias.forEach((farm) => {
    const criticosFarm = criticos.filter((c) => c.farmaciaId === farm.id)
    if (criticosFarm.length > 0) {
      farmaciasUrgentes.push({
        farmacia: farm,
        totalCriticos: criticosFarm.length,
        ultimoSuministro: suministros
          .filter((s) => s.farmaciaId === farm.id)
          .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))[0]
      })
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="proveedor" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">Dashboard — {usuarioActual?.entidadNombre || 'Proveedor'}</h1>
          <span className="text-sm text-gray-400">{hora}
            {ultimoAcceso && <span className="ml-4">Último acceso: {new Date(ultimoAcceso).toLocaleString('es-CO')}</span>}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard label="Farmacias con alerta" value={farmaciasConAlerta} icon={AlertOctagon} colorClass="bg-red-100 text-red-600" />
          <StatCard label="Suministros registrados hoy" value={suministrosEsteMes} icon={TrendingUp} colorClass="bg-green-100 text-green-600" />
          <StatCard label="Medicamentos críticos" value={medicamentosCriticos} icon={Package} colorClass="bg-amber-100 text-amber-600" />
          <StatCard label="Total lotes activos" value={lotesActivos} icon={Layers} colorClass="bg-blue-100 text-blue-600" />
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 medicamentos más solicitados</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMedicamentosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="reservas" fill="#dc2626" radius={[0, 4, 4, 0]} name="Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Suministros registrados por semana (últimas 4 semanas)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={suministrosSemanales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cantidad" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626', r: 4 }} name="Unidades" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmacias urgentes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Farmacias que necesitan atención urgente</h2>
            <button onClick={() => navigate('/proveedor/alertas')} className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">Ver todas <ArrowRight size={14} /></button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {farmaciasUrgentes.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No hay farmacias con alertas críticas</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr><th className="text-left px-4 py-3 font-medium">Farmacia</th><th className="text-left px-4 py-3 font-medium"># Medicamentos críticos</th><th className="text-left px-4 py-3 font-medium">Último suministro</th><th className="text-left px-4 py-3 font-medium">Acción</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {farmaciasUrgentes.map((f) => (
                    <tr key={f.farmacia.id} className="hover:bg-red-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{f.farmacia.nombre}</td>
                      <td className="px-4 py-3"><span className="font-bold text-red-600">{f.totalCriticos}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{f.ultimoSuministro ? new Date(f.ultimoSuministro.fechaRegistro).toLocaleDateString('es-CO') : 'Nunca'}</td>
                      <td className="px-4 py-3"><button onClick={() => navigate('/proveedor/alertas')} className="text-red-600 hover:text-red-700 font-medium">Abastecer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <ChatPanel />
    </div>
  )
}
