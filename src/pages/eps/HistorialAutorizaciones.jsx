import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'
import useRelativeTime from '../../hooks/useRelativeTime'

const tabs = ['Todas', 'Pendientes', 'Aprobadas', 'Rechazadas']

export default function HistorialAutorizaciones() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const autorizacionesState = useStore((s) => s.autorizaciones); const usuarios = useStore((s) => s.usuarios); const medicamentos = useStore((s) => s.medicamentos)
  const { formatDateTime } = useRelativeTime()

  const [activeTab, setActiveTab] = useState('Todas')
  const [page, setPage] = useState(1)
  const [exportModal, setExportModal] = useState(false)
  const perPage = 10

  const epsId = usuarioActual?.epsId || ''
  let auths = autorizacionesState
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

  if (activeTab !== 'Todas') {
    const estado = activeTab === 'Aprobadas' ? 'aprobada' : activeTab === 'Rechazadas' ? 'rechazada' : 'pendiente'
    auths = auths.filter((a) => a.estado === estado)
  }

  auths.sort((a, b) => (b.fechaSolicitud || '').localeCompare(a.fechaSolicitud || ''))

  const totalPages = Math.ceil(auths.length / perPage)
  const paginated = auths.slice((page - 1) * perPage, page * perPage)

  const estadoBadge = { pendiente: 'warning', aprobada: 'success', rechazada: 'danger' }
  const rowBg = { pendiente: 'bg-yellow-50/50', aprobada: 'bg-green-50/50', rechazada: 'bg-red-50/50' }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="eps" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Historial de Autorizaciones</h1>
          <button onClick={() => setExportModal(true)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Exportar</button>
        </div>

        <div className="flex gap-1 mb-4 bg-white p-1 rounded-lg border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button key={t} onClick={() => { setActiveTab(t); setPage(1) }} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === t ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>{t}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          {paginated.length === 0 ? (
            <EmptyState icon={ChevronDown} title="Sin autorizaciones" description={`No hay autorizaciones ${activeTab.toLowerCase()}`} />
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">ID</th>
                    <th className="text-left px-4 py-3 font-medium">Paciente</th>
                    <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                    <th className="text-left px-4 py-3 font-medium">Fecha solicitud</th>
                    <th className="text-left px-4 py-3 font-medium">Fecha respuesta</th>
                    <th className="text-left px-4 py-3 font-medium">Estado</th>
                    <th className="text-left px-4 py-3 font-medium">Cobertura</th>
                    <th className="text-left px-4 py-3 font-medium">Motivo rechazo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((a) => (
                    <tr key={a.id} className={`${rowBg[a.estado]} hover:bg-gray-50`}>
                      <td className="px-4 py-3 text-xs text-gray-400">{a.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{a.pacienteNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{a.medicamentoNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDateTime(a.fechaSolicitud)}</td>
                      <td className="px-4 py-3 text-gray-600">{a.fechaRespuesta ? formatDateTime(a.fechaRespuesta) : '-'}</td>
                      <td className="px-4 py-3"><Badge text={a.estado} variant={estadoBadge[a.estado]} /></td>
                      <td className="px-4 py-3 text-gray-600">{a.cobertura}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{a.motivoRechazo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
                  <div className="flex gap-1">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Anterior</button>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Siguiente</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Modal isOpen={exportModal} onClose={() => setExportModal(false)} title="Exportar historial" size="sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">La exportación del historial estará disponible en la versión productiva del sistema.</p>
            <button onClick={() => setExportModal(false)} className="w-full py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg">Entendido</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
