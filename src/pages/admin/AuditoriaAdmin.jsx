import { useState } from 'react'
import { Search, Filter, Activity, RotateCcw, Download } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'

const ACCIONES = ['INICIO_SESION', 'CREAR_RESERVA', 'CANCELAR_RESERVA', 'APROBAR_AUTORIZACION', 'RECHAZAR_AUTORIZACION', 'CONFIRMAR_ENTREGA', 'REGISTRAR_SUMINISTRO']
const ROLES = ['paciente', 'eps', 'farmacia', 'proveedor', 'admin']

export default function AuditoriaAdmin() {
  const auditoria = useStore((s) => s.auditoria)
  const [filtroAccion, setFiltroAccion] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [busqueda, setBusqueda] = useState('')

  let eventosFiltrados = [...auditoria]
  if (filtroAccion) eventosFiltrados = eventosFiltrados.filter((e) => e.accion === filtroAccion)
  if (filtroRol) eventosFiltrados = eventosFiltrados.filter((e) => e.usuarioRol === filtroRol)
  if (busqueda) eventosFiltrados = eventosFiltrados.filter((e) => e.detalle.toLowerCase().includes(busqueda.toLowerCase()) || e.usuarioNombre.toLowerCase().includes(busqueda.toLowerCase()))

  const limpiarFiltros = () => { setFiltroAccion(''); setFiltroRol(''); setBusqueda('') }
  const hayFiltros = filtroAccion || filtroRol || busqueda

  const exportarCSV = () => {
    const headers = ['ID', 'Acción', 'Detalle', 'Usuario', 'Rol', 'Fecha']
    const rows = eventosFiltrados.map(e => [
      e.id,
      e.accion,
      `"${(e.detalle || '').replace(/"/g, '""')}"`,
      e.usuarioNombre,
      e.usuarioRol,
      e.fecha
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auditoria-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="admin" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Registro de Auditoría</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity size={14} />
            <span>{auditoria.length} eventos registrados</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar en eventos..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={filtroAccion} onChange={(e) => setFiltroAccion(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-gray-900 outline-none cursor-pointer">
                <option value="">Todas las acciones</option>
                {ACCIONES.map((a) => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-gray-900 outline-none cursor-pointer">
                <option value="">Todos los roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {hayFiltros && (
              <button onClick={limpiarFiltros} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <RotateCcw size={14} /> Limpiar filtros
              </button>
            )}
            <button
              onClick={exportarCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Download size={14} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {eventosFiltrados.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No se encontraron eventos con los filtros aplicados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Fecha / Hora</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Usuario</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Rol</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Acción</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventosFiltrados.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(evt.fecha).toLocaleString('es-CO')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{evt.usuarioNombre}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          evt.usuarioRol === 'admin' ? 'bg-purple-100 text-purple-700' :
                          evt.usuarioRol === 'paciente' ? 'bg-blue-100 text-blue-700' :
                          evt.usuarioRol === 'eps' ? 'bg-green-100 text-green-700' :
                          evt.usuarioRol === 'farmacia' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>{evt.usuarioRol}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{evt.accion}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{evt.detalle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
