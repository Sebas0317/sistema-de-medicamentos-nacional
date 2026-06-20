import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, Eye, AlertTriangle, X, Calendar } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'

const estadoBadge = {
  pendiente: 'warning',
  confirmada: 'success',
  cancelada: 'danger',
  entregada: 'info'
}

const estadoLabel = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  entregada: 'Entregada'
}

const tabs = ['Todas', 'Pendientes', 'Confirmadas', 'Entregadas', 'Canceladas']

const horarios = Array.from({ length: 10 }, (_, i) => {
  const h = i + 8
  return `${String(h).padStart(2, '0')}:00`
})

export default function MisReservas() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const reservasState = useStore((s) => s.reservas)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const autorizaciones = useStore((s) => s.autorizaciones)
  const cancelarReserva = useStore((s) => s.cancelarReserva)
  const reprogramarReserva = useStore((s) => s.reprogramarReserva)
  const [activeTab, setActiveTab] = useState('Todas')
  const [detailReserva, setDetailReserva] = useState(null)
  const [cancelModal, setCancelModal] = useState(null)
  const [reprogramarModal, setReprogramarModal] = useState(null)
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevaHora, setNuevaHora] = useState('10:00')

  let reservas = reservasState.filter(r => r.pacienteId === usuarioActual?.id)
    .map(r => {
      const med = medicamentos.find(m => m.id === r.medicamentoId)
      const farm = farmacias.find(f => f.id === r.farmaciaId)
      const auth = r.autorizacionId ? autorizaciones.find(a => a.id === r.autorizacionId) : null
      return {
        ...r,
        medicamentoNombre: med ? med.nombre : '',
        medicamento: med || null,
        farmaciaNombre: farm ? farm.nombre : '',
        farmacia: farm || null,
        autorizacion: auth || null
      }
    })

  if (activeTab !== 'Todas') {
    const estadoKey = activeTab.toLowerCase().replace('das', 'da').replace('das', 'da').replace('das', 'da').replace('das', 'da')
    const estadoMap = { pendientes: 'pendiente', confirmadas: 'confirmada', entregadas: 'entregada', canceladas: 'cancelada' }
    const estadoFiltro = estadoMap[activeTab.toLowerCase()]
    if (estadoFiltro) reservas = reservas.filter((r) => r.estado === estadoFiltro)
  }

  const handleCancelar = (id) => {
    setCancelModal(id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Mis Reservas</h1>
          <Badge text={`${reservas.length} reservas`} variant="info" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white p-1 rounded-lg border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === t ? 'bg-accent text-white' : 'text-gray-600 hover:text-gray-900'}`}>{t}</button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          {reservas.length === 0 ? (
            <EmptyState icon={XCircle} title="No hay reservas" description={`No se encontraron reservas ${activeTab.toLowerCase()}`} actionLabel="Buscar medicamento" onAction={() => navigate('/paciente/buscar')} />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                  <th className="text-left px-4 py-3 font-medium">Farmacia</th>
                  <th className="text-left px-4 py-3 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium">Hora</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 font-medium">Auth.</th>
                  <th className="text-left px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservas.map((r, i) => {
                  const authBadge = r.autorizacion
                    ? { text: r.autorizacion.estado === 'aprobada' ? 'Aprobada' : r.autorizacion.estado === 'rechazada' ? 'Rechazada' : 'Pendiente', variant: r.autorizacion.estado === 'aprobada' ? 'success' : r.autorizacion.estado === 'rechazada' ? 'danger' : 'warning' }
                    : null
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.medicamentoNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{r.farmaciaNombre}</td>
                      <td className="px-4 py-3 text-gray-600">{r.fechaReclamacion}</td>
                      <td className="px-4 py-3 text-gray-600">{r.horaReclamacion}</td>
                      <td className="px-4 py-3"><Badge text={estadoLabel[r.estado]} variant={estadoBadge[r.estado]} /></td>
                      <td className="px-4 py-3">{authBadge ? <Badge text={authBadge.text} variant={authBadge.variant} /> : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setDetailReserva(r)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg" title="Ver detalle"><Eye size={16} /></button>
                          {(r.estado === 'pendiente' || r.estado === 'confirmada') && (
                            <>
                              <button onClick={() => { setReprogramarModal(r); setNuevaFecha(r.fechaReclamacion); setNuevaHora(r.horaReclamacion) }} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Reprogramar"><Calendar size={16} /></button>
                              <button onClick={() => handleCancelar(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Cancelar"><XCircle size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={!!detailReserva} onClose={() => setDetailReserva(null)} title="Detalle de reserva" size="md">
        {detailReserva && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-500">Medicamento:</span><p className="font-medium text-gray-900">{detailReserva.medicamentoNombre}</p></div>
              <div><span className="text-gray-500">Farmacia:</span><p className="font-medium text-gray-900">{detailReserva.farmaciaNombre}</p></div>
              <div><span className="text-gray-500">Fecha:</span><p className="font-medium text-gray-900">{detailReserva.fechaReclamacion}</p></div>
              <div><span className="text-gray-500">Hora:</span><p className="font-medium text-gray-900">{detailReserva.horaReclamacion}</p></div>
              <div><span className="text-gray-500">Estado:</span><Badge text={estadoLabel[detailReserva.estado]} variant={estadoBadge[detailReserva.estado]} /></div>
              <div><span className="text-gray-500">Requiere auth.:</span><p className="font-medium text-gray-900">{detailReserva.requiereAutorizacion ? 'Sí' : 'No'}</p></div>
            </div>
            {detailReserva.notas && <div><span className="text-gray-500">Notas:</span><p className="text-gray-700 mt-1">{detailReserva.notas}</p></div>}
            {detailReserva.autorizacion && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium mb-1">Autorización:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-gray-500">Estado: <Badge text={detailReserva.autorizacion.estado} variant={detailReserva.autorizacion.estado === 'aprobada' ? 'success' : detailReserva.autorizacion.estado === 'rechazada' ? 'danger' : 'warning'} /></span>
                  <span className="text-gray-500">Cobertura: {detailReserva.autorizacion.cobertura}</span>
                  {detailReserva.autorizacion.motivoRechazo && <span className="text-gray-500 col-span-2">Motivo rechazo: {detailReserva.autorizacion.motivoRechazo}</span>}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">Creada: {new Date(detailReserva.fechaCreacion).toLocaleString('es-CO')}</p>
          </div>
        )}
      </Modal>

      {/* Modal reprogramar */}
      <Modal isOpen={!!reprogramarModal} onClose={() => setReprogramarModal(null)} title="Reprogramar cita" size="md">
        {reprogramarModal && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Medicamento:</strong> {reprogramarModal.medicamentoNombre}</p>
              <p><strong>Farmacia:</strong> {reprogramarModal.farmaciaNombre}</p>
              <p className="text-xs text-gray-500 mt-1">Fecha actual: {reprogramarModal.fechaReclamacion} — {reprogramarModal.horaReclamacion}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha</label>
              <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva hora</label>
              <select value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none">
                {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReprogramarModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
              <button onClick={() => {
                if (nuevaFecha) {
                  reprogramarReserva(reprogramarModal.id, nuevaFecha, nuevaHora)
                  setReprogramarModal(null)
                }
              }} className="flex-1 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 rounded-lg flex items-center justify-center gap-1"><Calendar size={16} />Reprogramar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal confirmar cancelación */}
      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancelar reserva" size="sm">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <p className="text-gray-700 text-sm">¿Estás seguro de cancelar esta reserva?</p>
          <p className="text-xs text-gray-400">Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setCancelModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Volver</button>
            <button onClick={() => { cancelarReserva(cancelModal); setCancelModal(null) }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-1"><XCircle size={16} />Cancelar reserva</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
