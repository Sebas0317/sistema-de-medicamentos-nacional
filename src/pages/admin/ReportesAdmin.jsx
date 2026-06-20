import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { FileText, Download, BarChart3, PieChart, FileSpreadsheet, ArrowRight, Printer, ImageDown } from 'lucide-react'
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
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [capturando, setCapturando] = useState(false)
  const reporteRef = useRef(null)

  const filteredReservas = fechaDesde && fechaHasta
    ? reservas.filter(r => r.fechaReclamacion >= fechaDesde && r.fechaReclamacion <= fechaHasta)
    : reservas

  const filteredAutorizaciones = fechaDesde && fechaHasta
    ? autorizaciones.filter(a => a.fecha >= fechaDesde && a.fecha <= fechaHasta)
    : autorizaciones

  const filteredSuministros = fechaDesde && fechaHasta
    ? suministros.filter(s => s.fechaRegistro >= fechaDesde && s.fechaRegistro <= fechaHasta)
    : suministros

  const filteredAuditoria = fechaDesde && fechaHasta
    ? auditoria.filter(a => a.fecha >= fechaDesde && a.fecha <= fechaHasta)
    : auditoria

  const exportar = (formato) => {
    if (formato !== 'pdf') {
      setExportando(formato)
      setTimeout(() => {
        setExportando(null)
      }, 1500)
      return
    }

    const doc = new jsPDF()
    const date = new Date().toISOString().split('T')[0]
    const title = `SNSDM - Reporte de ${tipoActual.label}`

    doc.setFontSize(14)
    doc.text('SNSDM - Sistema Nacional de Seguimiento y Disponibilidad de Medicamentos', 14, 16)
    doc.setFontSize(9)
    doc.text('Universidad del Tolima · Ingeniería de Software · Prof. Edna Lucero Triana Salgado', 14, 22)
    doc.text('CIPA: Juan Sebastian Sandoval · Andres Cipamocha · Cebastian Molina · Diego Lavacude', 14, 28)
    doc.setFontSize(10)
    doc.text(title, 14, 36)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 42)

    let headers, rows

    switch (tipoReporte) {
      case 'reservas':
        headers = [['Estado', 'Cantidad']]
        rows = reservasPorEstado.map((r) => [r.name, r.value])
        break
      case 'autorizaciones':
        headers = [['Estado', 'Cantidad']]
        rows = autorizacionesPorEstado.map((a) => [a.name, a.value])
        break
      case 'inventario':
        headers = [['Medicamento', 'Stock', 'Mínimo']]
        rows = inventarioCritico.map((i) => [i.name, i.stock, i.minimo])
        break
      case 'suministros':
        headers = [['Semana', 'Valor']]
        rows = suministrosPorMes.map((s) => [s.name, s.valor])
        break
      case 'actividad':
        headers = [['Acción', 'Cantidad']]
        rows = actividadPorAccion.map((a) => [a.name, a.value])
        break
      default:
        headers = []
        rows = []
    }

    doc.autoTable({
      startY: 48,
      head: headers,
      body: rows,
    })

    doc.save(`reporte-${tipoReporte}-${date}.pdf`)
    setExportando(formato)
    setTimeout(() => setExportando(null), 1500)
  }

  const capturarImagen = async () => {
    setCapturando(true)
    try {
      const canvas = await html2canvas(reporteRef.current)
      const link = document.createElement('a')
      link.download = `reporte-${tipoReporte}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } finally {
      setCapturando(false)
    }
  }

  const tipoActual = TIPOS_REPORTE.find((t) => t.id === tipoReporte)

  const reservasPorEstado = [
    { name: 'Pendientes', value: filteredReservas.filter((r) => r.estado === 'pendiente').length, color: '#d97706' },
    { name: 'Confirmadas', value: filteredReservas.filter((r) => r.estado === 'confirmada').length, color: '#16a34a' },
    { name: 'Canceladas', value: filteredReservas.filter((r) => r.estado === 'cancelada').length, color: '#dc2626' },
  ]

  const autorizacionesPorEstado = [
    { name: 'Pendientes', value: filteredAutorizaciones.filter((a) => a.estado === 'pendiente').length, color: '#d97706' },
    { name: 'Aprobadas', value: filteredAutorizaciones.filter((a) => a.estado === 'aprobada').length, color: '#16a34a' },
    { name: 'Rechazadas', value: filteredAutorizaciones.filter((a) => a.estado === 'rechazada').length, color: '#dc2626' },
  ]

  const inventarioCritico = medicamentos.map((m) => {
    const inv = inventario.find((i) => i.medicamentoId === m.id)
    return { name: m.nombre.split(' ')[0], stock: inv ? inv.stock : 0, minimo: inv ? inv.stockMinimo : 0 }
  })

  const suministrosPorMes = [
    { name: 'Semana 1', valor: filteredSuministros.filter((s) => new Date(s.fechaRegistro).getDate() <= 7).length },
    { name: 'Semana 2', valor: filteredSuministros.filter((s) => new Date(s.fechaRegistro).getDate() > 7 && new Date(s.fechaRegistro).getDate() <= 14).length },
    { name: 'Semana 3', valor: filteredSuministros.filter((s) => new Date(s.fechaRegistro).getDate() > 14 && new Date(s.fechaRegistro).getDate() <= 21).length },
    { name: 'Semana 4', valor: filteredSuministros.filter((s) => new Date(s.fechaRegistro).getDate() > 21).length },
  ]

  const actividadPorAccion = [
    { name: 'Inicio sesión', value: filteredAuditoria.filter((a) => a.accion === 'INICIO_SESION').length, color: '#2563eb' },
    { name: 'Reservas', value: filteredAuditoria.filter((a) => a.accion === 'CREAR_RESERVA' || a.accion === 'CANCELAR_RESERVA').length, color: '#16a34a' },
    { name: 'Autorizaciones', value: filteredAuditoria.filter((a) => a.accion.startsWith('APROBAR') || a.accion.startsWith('RECHAZAR')).length, color: '#d97706' },
    { name: 'Entregas', value: filteredAuditoria.filter((a) => a.accion === 'CONFIRMAR_ENTREGA').length, color: '#8b5cf6' },
    { name: 'Suministros', value: filteredAuditoria.filter((a) => a.accion === 'REGISTRAR_SUMINISTRO').length, color: '#dc2626' },
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

        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Filtrar por fecha:</span>
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg" />
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg" />
            {(fechaDesde || fechaHasta) && (
              <button onClick={() => { setFechaDesde(''); setFechaHasta('') }} className="text-xs text-red-600 hover:underline">Limpiar</button>
            )}
          </div>

        <div ref={reporteRef} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
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
              <button onClick={capturarImagen} disabled={capturando !== false} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-colors">
                {capturando ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <ImageDown size={14} />}
                Descargar imagen
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
              <p className="text-sm text-gray-500 mb-4">Distribución de reservas por estado. Total: {filteredReservas.length} reservas.</p>
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
                    <span className="text-sm font-bold">{filteredReservas.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tipoReporte === 'autorizaciones' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Distribución de autorizaciones por estado. Total: {filteredAutorizaciones.length} autorizaciones.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Pendientes', Aprobadas: 0, Rechazadas: 0, Pendientes: filteredAutorizaciones.filter((a) => a.estado === 'pendiente').length },
                    { name: 'Aprobadas', Pendientes: 0, Rechazadas: 0, Aprobadas: filteredAutorizaciones.filter((a) => a.estado === 'aprobada').length },
                    { name: 'Rechazadas', Pendientes: 0, Aprobadas: 0, Rechazadas: filteredAutorizaciones.filter((a) => a.estado === 'rechazada').length },
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
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Pendientes</span><span className="text-sm font-bold text-amber-600">{filteredAutorizaciones.filter((a) => a.estado === 'pendiente').length}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Aprobadas</span><span className="text-sm font-bold text-green-600">{filteredAutorizaciones.filter((a) => a.estado === 'aprobada').length}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Rechazadas</span><span className="text-sm font-bold text-red-600">{filteredAutorizaciones.filter((a) => a.estado === 'rechazada').length}</span></div>
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
              <p className="text-sm text-gray-500 mb-4">Suministros registrados por semana. Total: {filteredSuministros.length} suministros.</p>
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
              <p className="text-sm text-gray-500 mb-4">Actividad del sistema por tipo de evento. Total: {filteredAuditoria.length} eventos.</p>
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
