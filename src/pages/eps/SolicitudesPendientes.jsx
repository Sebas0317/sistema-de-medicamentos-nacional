import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'
import useRelativeTime from '../../hooks/useRelativeTime'

const filtros = ['Todas', 'Requieren autorización especial']

export default function SolicitudesPendientes() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const autorizacionesState = useStore((s) => s.autorizaciones); const usuarios = useStore((s) => s.usuarios); const medicamentos = useStore((s) => s.medicamentos)
  const aprobarAutorizacion = useStore((s) => s.aprobarAutorizacion)
  const rechazarAutorizacion = useStore((s) => s.rechazarAutorizacion)
  const { formatRelativeTime } = useRelativeTime()

  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todas')
  const [orden, setOrden] = useState('fecha')
  const [rechazoModal, setRechazoModal] = useState(null)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [razonRechazo, setRazonRechazo] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)

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

  // Filtros
  if (filtro === 'Requieren autorización especial') {
    auths = auths.filter((a) => a.medicamento?.requiereAutorizacion === true)
  }

  if (busqueda) {
    const q = busqueda.toLowerCase()
    auths = auths.filter((a) => a.pacienteNombre?.toLowerCase().includes(q) || a.medicamentoNombre?.toLowerCase().includes(q))
  }

  if (orden === 'fecha') auths.sort((a, b) => (b.fechaSolicitud || '').localeCompare(a.fechaSolicitud || ''))
  else if (orden === 'paciente') auths.sort((a, b) => (a.pacienteNombre || '').localeCompare(b.pacienteNombre || ''))

  const handleAprobar = (id) => {
    setConfirmModal(id)
  }

  const confirmAprobar = () => {
    if (confirmModal) {
      aprobarAutorizacion(confirmModal)
      setConfirmModal(null)
    }
  }

  const handleRechazar = (auth) => {
    setRechazoModal(auth)
    setMotivoRechazo('')
    setRazonRechazo('')
  }

  const confirmRechazar = () => {
    if (rechazoModal && motivoRechazo.length >= 10) {
      const texto = `${razonRechazo ? razonRechazo + ': ' : ''}${motivoRechazo}`
      rechazarAutorizacion(rechazoModal.id, texto)
      setRechazoModal(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="eps" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold text-gray-900">Solicitudes de Autorización</h1>
          <Badge text={`${auths.length} solicitudes`} variant="info" />
        </div>

        {/* Barra herramientas */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar paciente o medicamento..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
              {filtros.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={orden} onChange={(e) => setOrden(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
              <option value="fecha">Fecha (reciente)</option>
              <option value="paciente">Paciente A-Z</option>
            </select>
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {auths.length === 0 ? (
            <EmptyState icon={CheckCircle} title="No hay solicitudes" description="No se encontraron autorizaciones con estos filtros" />
          ) : auths.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border shadow-sm p-5 ${
              a.estado === 'aprobada' ? 'border-green-200 bg-green-50/30' :
              a.estado === 'rechazada' ? 'border-red-200 bg-red-50/30' :
              'border-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge text={a.estado === 'aprobada' ? 'Aprobada' : a.estado === 'rechazada' ? 'Rechazada' : 'Pendiente'} variant={a.estado === 'aprobada' ? 'success' : a.estado === 'rechazada' ? 'danger' : 'warning'} />
                  <span className="text-xs text-gray-400">{formatRelativeTime(a.fechaSolicitud)}</span>
                </div>
                <span className="text-xs text-gray-400">{a.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500 text-xs">Paciente</span>
                  <p className="font-medium text-gray-900">{a.pacienteNombre}</p>
                  <p className="text-xs text-gray-400">CC {a.pacienteDocumento}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Medicamento</span>
                  <p className="font-medium text-gray-900">{a.medicamentoNombre}</p>
                  {a.medicamento && <Badge text={a.medicamento.categoria} variant="neutral" />}
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Cobertura</span>
                  <p className="font-medium text-gray-900">{a.cobertura}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Observaciones</span>
                  <p className="text-gray-600 text-xs line-clamp-2">{a.observaciones || '-'}</p>
                </div>
              </div>
              {a.motivoRechazo && (
                <div className="mb-3 p-2 bg-red-50 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700">{a.motivoRechazo}</p>
                </div>
              )}
              {a.estado === 'pendiente' && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => handleAprobar(a.id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"><CheckCircle size={16} />Aprobar</button>
                  <button onClick={() => handleRechazar(a)} className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"><XCircle size={16} />Rechazar</button>
                </div>
              )}
              {a.fechaRespuesta && (
                <p className="text-xs text-gray-400 mt-2">Respondida: {new Date(a.fechaRespuesta).toLocaleString('es-CO')}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal confirmar aprobación */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title="Confirmar aprobación" size="sm">
        <p className="text-sm text-gray-600 mb-4">¿Estás seguro de aprobar esta autorización?</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
          <button onClick={confirmAprobar} className="flex-1 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">Confirmar</button>
        </div>
      </Modal>

      {/* Modal rechazo */}
      <Modal isOpen={!!rechazoModal} onClose={() => setRechazoModal(null)} title="Rechazar autorización" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Indica el motivo del rechazo para <strong>{rechazoModal?.medicamentoNombre}</strong> de <strong>{rechazoModal?.pacienteNombre}</strong></p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Razón</label>
            <select value={razonRechazo} onChange={(e) => setRazonRechazo(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Seleccionar...</option>
              <option value="Sin cobertura">Sin cobertura</option>
              <option value="Medicamento no incluido en POS">Medicamento no incluido en POS</option>
              <option value="Diagnóstico no compatible">Diagnóstico no compatible</option>
              <option value="Documentación incompleta">Documentación incompleta</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo detallado <span className="text-red-500">*</span></label>
            <textarea value={motivoRechazo} onChange={(e) => setMotivoRechazo(e.target.value)} rows={3} placeholder="Mínimo 10 caracteres..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
            {motivoRechazo.length < 10 && motivoRechazo.length > 0 && <p className="text-xs text-red-500 mt-1">Mínimo 10 caracteres</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setRechazoModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={confirmRechazar} disabled={motivoRechazo.length < 10} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">Confirmar rechazo</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
