import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { CheckCircle, Clock, MapPin, XCircle } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'
import useRelativeTime from '../../hooks/useRelativeTime'

const tabs = ['Pendientes', 'Listas para entregar', 'Completadas', 'Fallidas']

export default function ConfirmarEntregas() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const entregasState = useStore((s) => s.entregas)
  const usuarios = useStore((s) => s.usuarios)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const reservas = useStore((s) => s.reservas)
  const marcarEntregaLista = useStore((s) => s.marcarEntregaLista)
  const confirmarEntrega = useStore((s) => s.confirmarEntrega)
  const registrarFalloEntrega = useStore((s) => s.registrarFalloEntrega)

  const [activeTab, setActiveTab] = useState('Pendientes')
  const [confirmModal, setConfirmModal] = useState(null)
  const [recibeNombre, setRecibeNombre] = useState('')
  const [firmaDigital, setFirmaDigital] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [reciboModal, setReciboModal] = useState(null)
  const [falloModal, setFalloModal] = useState(null)
  const [motivoFallo, setMotivoFallo] = useState('')

  const farmaciaId = usuarioActual?.entidadId || ''
  let entregas = entregasState
    .filter(e => e.farmaciaId === farmaciaId)
    .map(e => {
      const paciente = usuarios.find(u => u.id === e.pacienteId)
      const medicamento = medicamentos.find(m => m.id === e.medicamentoId)
      const reserva = e.reservaId ? reservas.find(r => r.id === e.reservaId) : null
      return {
        ...e,
        pacienteNombre: paciente ? paciente.nombre : '',
        pacienteDocumento: paciente ? paciente.documento : '',
        medicamentoNombre: medicamento ? medicamento.nombre : '',
        medicamento: medicamento || null,
        reserva: reserva || null
      }
    })

  if (activeTab === 'Pendientes') entregas = entregas.filter((e) => e.estado === 'pendiente')
  else if (activeTab === 'Listas para entregar') entregas = entregas.filter((e) => e.estado === 'lista')
  else if (activeTab === 'Completadas') entregas = entregas.filter((e) => e.estado === 'entregada')
  else if (activeTab === 'Fallidas') entregas = entregas.filter((e) => e.estado === 'fallida')

  const handleMarcarLista = (id) => {
    marcarEntregaLista(id)
  }

  const handleAbrirConfirmacion = (entrega) => {
    setConfirmModal(entrega)
    setRecibeNombre(entrega.pacienteNombre || '')
    setFirmaDigital('')
    setCheck1(false)
    setCheck2(false)
  }

  const handleConfirmar = () => {
    if (!confirmModal || !firmaDigital || !check1 || !check2) return
    const result = confirmarEntrega(confirmModal.id, firmaDigital)
    if (result) {
      setReciboModal(result)
      setConfirmModal(null)
    }
  }

  const handleDescargarPDF = (recibo) => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('SNSDM - COMPROBANTE DE ENTREGA', 14, 20)
    doc.setFontSize(10)
    doc.text(`ENT-${recibo.id}-${new Date().toISOString().split('T')[0]}`, 14, 28)

    const campos = [
      ['Farmacia', usuarioActual?.entidadNombre || ''],
      ['Paciente', recibo.pacienteNombre],
      ['Medicamento', recibo.medicamentoNombre],
      ['Cantidad', '1'],
      ['Fecha/Hora', new Date().toLocaleString('es-CO')],
      ['Recibe', recibo.firmaDigital],
    ]

    doc.autoTable({
      startY: 34,
      head: [['Campo', 'Valor']],
      body: campos,
      theme: 'grid',
    })

    const finalY = doc.lastAutoTable.finalY || 80
    doc.setFontSize(9)
    doc.text('Este documento es válido como constancia de entrega', 14, finalY + 14)

    doc.save(`comprobante-entrega-${recibo.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="farmacia" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900 mb-4">Confirmar Entregas</h1>

        <div className="flex gap-1 mb-4 bg-white p-1 rounded-lg border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === t ? 'bg-amber-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>{t}</button>
          ))}
        </div>

        <div className="space-y-3">
          {entregas.length === 0 ? (
            <EmptyState icon={CheckCircle} title="No hay entregas" description={`No se encontraron entregas ${activeTab.toLowerCase()}`} />
          ) : entregas.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge text={e.estado === 'entregada' ? 'Entregada' : e.estado === 'lista' ? 'Lista' : 'Pendiente'} variant={e.estado === 'entregada' ? 'success' : e.estado === 'lista' ? 'info' : 'warning'} />
                  <span className="text-xs text-gray-400">ID: {e.id}</span>
                </div>
                <span className="text-xs text-gray-400">{e.fechaAsignacion ? new Date(e.fechaAsignacion).toLocaleDateString('es-CO') : ''}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Paciente</span>
                  <p className="font-medium text-gray-900">{e.pacienteNombre}</p>
                  <p className="text-xs text-gray-400">CC {e.pacienteDocumento}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Medicamento</span>
                  <p className="font-medium text-gray-900">{e.medicamentoNombre}</p>
                  <p className="text-xs text-gray-400">Cantidad: 1</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Tipo</span>
                  <div className="flex items-center gap-1">
                    {e.esADomicilio ? <MapPin size={14} className="text-blue-500" /> : <Clock size={14} className="text-gray-500" />}
                    <span>{e.esADomicilio ? 'A domicilio' : 'Retiro en farmacia'}</span>
                  </div>
                  {e.direccion && <p className="text-xs text-gray-400 mt-0.5">{e.direccion}</p>}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap">
                {e.estado === 'pendiente' && (
                  <>
                    <button onClick={() => handleMarcarLista(e.id)} className="flex items-center gap-1 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-200 transition-colors"><Clock size={16} />Marcar como lista</button>
                    <button onClick={() => { setFalloModal(e); setMotivoFallo('') }} className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"><XCircle size={16} />Registrar fallo</button>
                  </>
                )}
                {e.estado === 'lista' && (
                  <button onClick={() => handleAbrirConfirmacion(e)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"><CheckCircle size={16} />Confirmar entrega</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal confirmar entrega */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title="Confirmar entrega" size="md">
        {confirmModal && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Paciente:</strong> {confirmModal.pacienteNombre}</p>
              <p><strong>Medicamento:</strong> {confirmModal.medicamentoNombre}</p>
              <p><strong>Fecha:</strong> {confirmModal.reserva?.fechaReclamacion || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de quien recibe</label>
              <input type="text" value={recibeNombre} onChange={(e) => setRecibeNombre(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma digital / Número de cédula</label>
              <input type="text" value={firmaDigital} onChange={(e) => setFirmaDigital(e.target.value)} placeholder="Nombre completo y/o CC" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={check1} onChange={(e) => setCheck1(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              Confirmo que el medicamento fue entregado correctamente
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={check2} onChange={(e) => setCheck2(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              Se verificó la identificación del receptor
            </label>
            <button onClick={handleConfirmar} disabled={!firmaDigital || !check1 || !check2} className="w-full py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors">Confirmar entrega</button>
          </div>
        )}
      </Modal>

      {/* Modal comprobante */}
      <Modal isOpen={!!reciboModal} onClose={() => setReciboModal(null)} title="Comprobante de entrega" size="md">
        {reciboModal && (
          <div className="space-y-4">
            <div className="text-center border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-900">SNSDM</h2>
              <p className="text-sm font-medium text-gray-600">COMPROBANTE DE ENTREGA</p>
              <p className="text-xs text-gray-400">ENT-{reciboModal.id}-{new Date().toISOString().split('T')[0]}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Farmacia:</span><span className="font-medium">{usuarioActual?.entidadNombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Paciente:</span><span className="font-medium">{reciboModal.pacienteNombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Medicamento:</span><span className="font-medium">{reciboModal.medicamentoNombre}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cantidad:</span><span className="font-medium">1</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fecha/Hora:</span><span className="font-medium">{new Date().toLocaleString('es-CO')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Recibe:</span><span className="font-medium">{reciboModal.firmaDigital}</span></div>
            </div>
            <div className="border-t border-gray-200 pt-3 text-center">
              <p className="text-xs text-gray-400">Este documento es válido como constancia de entrega</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-3">Imprimir</button>
              <button onClick={() => handleDescargarPDF(reciboModal)} className="py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg px-3">Descargar PDF</button>
              <button onClick={() => setReciboModal(null)} className="flex-1 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg">Cerrar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal registrar fallo */}
      <Modal isOpen={!!falloModal} onClose={() => setFalloModal(null)} title="Registrar fallo en entrega" size="sm">
        {falloModal && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Paciente:</strong> {falloModal.pacienteNombre}</p>
              <p><strong>Medicamento:</strong> {falloModal.medicamentoNombre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del fallo</label>
              <select value={motivoFallo} onChange={(e) => setMotivoFallo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">Selecciona un motivo</option>
                <option value="Paciente no se presentó">Paciente no se presentó</option>
                <option value="Medicamento no disponible">Medicamento no disponible</option>
                <option value="Dirección incorrecta">Dirección incorrecta</option>
                <option value="Documentación incompleta">Documentación incompleta</option>
                <option value="Problema logístico">Problema logístico</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setFalloModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
              <button onClick={() => {
                if (motivoFallo) {
                  registrarFalloEntrega(falloModal.id, motivoFallo)
                  setFalloModal(null)
                }
              }} disabled={!motivoFallo} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-1"><XCircle size={16} />Registrar fallo</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
