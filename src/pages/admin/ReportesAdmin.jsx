import { useState } from 'react'
import { FileText, Download, BarChart3, PieChart, FileSpreadsheet, ArrowRight, Printer } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart as RPieChart, Pie, Cell } from 'recharts'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'

const TIPOS_REPORTE = [
  { id: 'reservas', label: 'Reporte de Reservas', icon: FileText },
  { id: 'autorizaciones', label: 'Reporte de Autorizaciones', icon: FileText },
  { id: 'inventario', label: 'Reporte de Inventario', icon: BarChart3 },
  { id: 'suministros', label: 'Reporte de Suministros', icon: FileSpreadsheet },
  { id: 'actividad', label: 'Reporte de Actividad', icon: PieChart },
]

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6']

export default function ReportesAdmin() {
  const reservas = useStore((s) => s.reservas)
  const autorizaciones = useStore((s) => s.autorizaciones)
  const inventario = useStore((s) => s.inventario)
  const suministros = useStore((s) => s.suministros)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const auditoria = useStore((s) => s.auditoria)
  const [tipoReporte, setTipoReporte] = useState('reservas')
  const [exportando, setExportando] = useState(null)

  const exportar = (formato) => {
    setExportando(formato)
    setTimeout(() => {
      setExportando(null)
    }, 1500)
  }

  const tipoActual = TIPOS_REPORTE.find((t) => t.id === tipoReporte)

  const reservasPorEstado = [
    { name: 'Pendientes', value: reservas.filter((r) => r.estado === 'pendiente').length, color: '#d97706' },
    { name: 'Confirmadas', value: reservas.filter((r) => r.estado === 'confirmada').length, color: '#16a34a' },
    { name: 'Canceladas', value: reservas.filter((r) => r.estado === 'cancelada').length, color: '#dc2626' },
  ]

  const autorizacionesPorEstado = [
    { name: 'Pendientes', value: autorizaciones.filter((a) => a.estado === 'pendiente').length, color: '#d97706' },
    { name: 'Aprobadas', value: autorizaciones.filter((a) => a.estado === 'aprobada').length, color: '#16a34a' },
    { name: 'Rechazadas', value: autorizaciones.filter((a) => a.estado === 'rechazada').length, color: '#dc2626' },
  ]

  const inventarioCritico = medicamentos.map((m) => {
    const inv = inventario.find((i) => i.medicamentoId === m.id)
    return { name: m.nombre.split(' ')[0], stock: inv ? inv.stock : 0, minimo: inv ? inv.stockMinimo : 0 }
  })

  const suministrosPorMes = [
    { name: 'Semana 1', valor: suministros.filter((s) => parseInt(s.fecha.split('-')[2]) <= 7).length },
    { name: 'Semana 2', valor: suministros.filter((s) => parseInt(s.fecha.split('-')[2]) > 7 && parseInt(s.fecha.split('-')[2]) <= 14).length },
    { name: 'Semana 3', valor: suministros.filter((s) => parseInt(s.fecha.split('-')[2]) > 14 && parseInt(s.fecha.split('-')[2]) <= 21).length },
    { name: 'Semana 4', valor: suministros.filter((s) => parseInt(s.fecha.split('-')[2]) > 21).length },
  ]

  const actividadPorAccion = [
    { name: 'Inicio sesión', value: auditoria.filter((a) => a.accion === 'INICIO_SESION').length, color: '#2563eb' },
    { name: 'Reservas', value: auditoria.filter((a) => a.accion === 'CREAR_RESERVA' || a.accion === 'CANCELAR_RESERVA').length, color: '#16a34a' },
    { name: 'Autorizaciones', value: auditoria.filter((a) => a.accion.startsWith('APROBAR') || a.accion.startsWith('RECHAZAR')).length, color: '#d97706' },
    { name: 'Entregas', value: auditoria.filter((a) => a.accion === 'CONFIRMAR_ENTREGA').length, color: '#8b5cf6' },
    { name: 'Suministros', value: auditoria.filter((a) => a.accion === 'REGISTRAR_SUMINISTRO').length, color: '#dc2626' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="admin" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900 mb-6">Reportes Estadísticos</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
          {TIPOS_REPORTE.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTipoReporte(t.id)} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${tipoReporte === t.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
                <Icon size={16} />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {tipoActual && <tipoActual.icon size={20} className="text-gray-700" />}
              <h2 className="text-lg font-semibold text-gray-900">{tipoActual?.label}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => exportar('pdf')} disabled={exportando !== null} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors">
                {exportando === 'pdf' ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Download size={14} />}
                Exportar PDF
              </button>
              <button onClick={() => exportar('excel')} disabled={exportando !== null} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors">
                {exportando === 'excel' ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FileSpreadsheet size={14} />}
                Exportar Excel
              </button>
              <button onClick={() => exportar('print')} disabled={exportando !== null} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors">
                <Printer size={14} />
                Imprimir
              </button>
            </div>
          </div>

          {exportando && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-4">
              Reporte exportado como {exportando.toUpperCase()} exitosamente
            </div>
          )}

          {tipoReporte === 'reservas' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Distribución de reservas por estado. Total: {reservas.length} reservas.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RPieChart>
                    <Pie data={reservasPorEstado} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {reservasPorEstado.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RPieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Resumen</h3>
                  {reservasPorEstado.map((e) => (
                    <div key={e.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                        <span className="text-sm text-gray-600">{e.name}</span>
                      </div>
                      <span className="text-sm font-bold">{e.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-sm font-bold">{reservas.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tipoReporte === 'autorizaciones' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Distribución de autorizaciones por estado. Total: {autorizaciones.length} autorizaciones.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Pendientes', Aprobadas: 0, Rechazadas: 0, Pendientes: autorizaciones.filter((a) => a.estado === 'pendiente').length },
                    { name: 'Aprobadas', Pendientes: 0, Rechazadas: 0, Aprobadas: autorizaciones.filter((a) => a.estado === 'aprobada').length },
                    { name: 'Rechazadas', Pendientes: 0, Aprobadas: 0, Rechazadas: autorizaciones.filter((a) => a.estado === 'rechazada').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Pendientes" fill="#d97706" stackId="a" />
                    <Bar dataKey="Aprobadas" fill="#16a34a" stackId="a" />
                    <Bar dataKey="Rechazadas" fill="#dc2626" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Resumen</h3>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Pendientes</span><span className="text-sm font-bold text-amber-600">{autorizaciones.filter((a) => a.estado === 'pendiente').length}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Aprobadas</span><span className="text-sm font-bold text-green-600">{autorizaciones.filter((a) => a.estado === 'aprobada').length}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Rechazadas</span><span className="text-sm font-bold text-red-600">{autorizaciones.filter((a) => a.estado === 'rechazada').length}</span></div>
                </div>
              </div>
            </div>
          )}

          {tipoReporte === 'inventario' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Nivel de stock actual vs stock mínimo por medicamento.</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventarioCritico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#2563eb" name="Stock actual" />
                  <Bar dataKey="minimo" fill="#dc2626" name="Stock mínimo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tipoReporte === 'suministros' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Suministros registrados por semana. Total: {suministros.length} suministros.</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={suministrosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2} name="Suministros" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {tipoReporte === 'actividad' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Actividad del sistema por tipo de evento. Total: {auditoria.length} eventos.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RPieChart>
                    <Pie data={actividadPorAccion} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {actividadPorAccion.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RPieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Distribución</h3>
                  {actividadPorAccion.map((e) => (
                    <div key={e.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                        <span className="text-sm text-gray-600">{e.name}</span>
                      </div>
                      <span className="text-sm font-bold">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
