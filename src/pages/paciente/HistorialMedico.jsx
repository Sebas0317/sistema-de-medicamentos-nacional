import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, FileText, Download, Pill, AlertCircle, CheckCircle, Send, Stethoscope, Plus, Clock, MapPin, User, Building2 } from 'lucide-react'
import useStore from '../../store/useStore'
import Modal from '../../components/shared/Modal'
import Badge from '../../components/shared/Badge'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'

const estadosFormula = {
  activa: { label: 'Activa', variant: 'success' },
  vencida: { label: 'Vencida', variant: 'error' },
  autorizacion_pendiente: { label: 'Autorización solicitada', variant: 'warning' },
}

export default function HistorialMedico() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const getCitasMedicasPorPaciente = useStore((s) => s.getCitasMedicasPorPaciente)
  const getFormulasPorPaciente = useStore((s) => s.getFormulasPorPaciente)
  const getHistorialClinico = useStore((s) => s.getHistorialClinico)
  const solicitarAutorizacionFormula = useStore((s) => s.solicitarAutorizacionFormula)
  const farmacias = useStore((s) => s.farmacias)
  const inventario = useStore((s) => s.inventario)
  const medicamentos = useStore((s) => s.medicamentos)
  const crearReserva = useStore((s) => s.crearReserva)
  const getReservasPorPaciente = useStore((s) => s.getReservasPorPaciente)
  const formulasMedicasStore = useStore((s) => s.formulasMedicas)

  const pacienteId = usuarioActual?.id || ''

  const citas = getCitasMedicasPorPaciente(pacienteId)
  const formulas = getFormulasPorPaciente(pacienteId)
  const reservas = getReservasPorPaciente(pacienteId)

  const [verDetalleCita, setVerDetalleCita] = useState(null)
  const [verFormula, setVerFormula] = useState(null)
  const [reservarModal, setReservarModal] = useState(null)
  const [authConfirm, setAuthConfirm] = useState(null)
  const [descargando, setDescargando] = useState(false)

  const formulasActivas = formulas.filter(f => f.estado === 'activa')
  const formulasVencidas = formulas.filter(f => f.estado === 'vencida')
  const formulasPendientes = formulas.filter(f => f.estado === 'autorizacion_pendiente')

  const handleReservar = (medicamentoId, formulaId) => {
    const farmaciasConStock = farmacias.filter(f =>
      inventario.some(i => i.farmaciaId === f.id && i.medicamentoId === medicamentoId && i.stock > 0)
    )
    setReservarModal({ medicamentoId, formulaId, farmacias: farmaciasConStock, fecha: '', hora: '', farmaciaId: '' })
  }

  const confirmarReserva = () => {
    if (!reservarModal.farmaciaId || !reservarModal.fecha || !reservarModal.hora) return
    const med = medicamentos.find(m => m.id === reservarModal.medicamentoId)
    const result = crearReserva({
      pacienteId,
      medicamentoId: reservarModal.medicamentoId,
      farmaciaId: reservarModal.farmaciaId,
      fechaReclamacion: reservarModal.fecha,
      horaReclamacion: reservarModal.hora,
      notas: `Reserva desde fórmula médica #${reservarModal.formulaId}`,
      esADomicilio: false,
    })
    if (result.ok) {
      setReservarModal(null)
    }
  }

  const handleSolicitarAutorizacion = (formulaId) => {
    const result = solicitarAutorizacionFormula(formulaId)
    if (result.ok) setAuthConfirm(result)
  }

  const handleDescargar = () => {
    setDescargando(true)
    const data = getHistorialClinico(pacienteId)
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-clinico-${usuarioActual?.nombre?.replace(/\s+/g, '-') || 'paciente'}.json`
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setDescargando(false), 500)
  }

  const citasRealizadas = citas.filter(c => c.estado === 'realizada')
  const citasProgramadas = citas.filter(c => c.estado === 'programada')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Historial Médico</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tus citas médicas, fórmulas y más</p>
        </div>
        <button onClick={handleDescargar} disabled={descargando}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50">
          <Download size={16} />
          {descargando ? 'Descargando...' : 'Descargar historial'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-2xl font-bold text-blue-600">{citasRealizadas.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Citas realizadas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-2xl font-bold text-green-600">{formulasActivas.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fórmulas activas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-2xl font-bold text-amber-600">{formulasVencidas.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fórmulas vencidas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-2xl font-bold text-purple-600">{reservas.filter(r => r.estado === 'pendiente' || r.estado === 'confirmada').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reservas activas</p>
        </div>
      </div>

      {/* Citas Médicas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Citas Médicas</h2>
        </div>

        {citasProgramadas.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-blue-600 mb-3">Próximas citas</p>
            <div className="space-y-2">
              {citasProgramadas.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.medico}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.especialidad} — {c.motivo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-blue-600">{new Date(c.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Historial de citas {citasProgramadas.length > 0 ? `(${citasRealizadas.length})` : ''}
          </p>
          {citasRealizadas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay citas médicas registradas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {citasRealizadas.map(c => (
                <div key={c.id}>
                  <button onClick={() => setVerDetalleCita(c)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Stethoscope size={18} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.medico}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.especialidad} — {c.motivo}</p>
                      {c.centroSalud && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.centroSalud.nombre}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 mr-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(c.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.hora}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-medium text-accent hover:text-accent/80">Ver detalle</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fórmulas Activas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Fórmulas Activas</h2>
          <Badge variant="success">{formulasActivas.length}</Badge>
        </div>
        <div className="px-6 py-4">
          {formulasActivas.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No tienes fórmulas activas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formulasActivas.map(f => (
                <div key={f.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.medico}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{f.especialidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Vence: {new Date(f.fechaVencimiento).toLocaleDateString('es-CO')}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <Clock size={12} className="text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Activa</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{f.diagnostico}</p>
                  <div className="space-y-2">
                    {f.medicamentos.map(m => (
                      <div key={m.medicamentoId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <Pill size={14} className="text-accent flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{m.nombre}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{m.dosis} — {m.cantidad} unidades</p>
                          </div>
                        </div>
                        <button onClick={() => handleReservar(m.medicamentoId, f.id)}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-colors">
                          <Plus size={12} />Reservar
                        </button>
                      </div>
                    ))}
                  </div>
                  {f.cita && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Emitida el {new Date(f.fechaEmision).toLocaleDateString('es-CO')} en {f.cita.centroSalud?.nombre || 'consulta médica'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fórmulas Vencidas + Pendientes */}
      {(formulasVencidas.length > 0 || formulasPendientes.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Fórmulas Vencidas</h2>
            <Badge variant="error">{formulasVencidas.length}</Badge>
          </div>
          <div className="px-6 py-4 space-y-4">
            {formulasPendientes.map(f => (
              <div key={f.id} className="p-4 border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.medico}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{f.especialidad}</p>
                  </div>
                  <Badge variant="warning">Autorización solicitada</Badge>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{f.diagnostico}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vencía: {new Date(f.fechaVencimiento).toLocaleDateString('es-CO')}</p>
              </div>
            ))}

            {formulasVencidas.map(f => (
              <div key={f.id} className="p-4 border border-red-200 dark:border-red-700 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.medico}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{f.especialidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600 font-medium">Vencida el {new Date(f.fechaVencimiento).toLocaleDateString('es-CO')}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <AlertCircle size={12} className="text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Vencida</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{f.diagnostico}</p>
                <div className="space-y-2 mb-3">
                  {f.medicamentos.map(m => (
                    <div key={m.medicamentoId} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                      <Pill size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{m.nombre}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{m.dosis}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleSolicitarAutorizacion(f.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                  <Send size={16} />
                  Solicitar autorización a la EPS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Detalle de cita médica */}
      {verDetalleCita && (
        <Modal isOpen={!!verDetalleCita} onClose={() => setVerDetalleCita(null)} title="Detalle de cita médica" size="2xl">
          <div className="space-y-5">
            {/* Médico y especialidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-accent" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Médico</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{verDetalleCita.medico}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{verDetalleCita.especialidad}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-accent" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha y hora</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(verDetalleCita.fecha).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{verDetalleCita.hora}</p>
              </div>
            </div>

            {/* Lugar */}
            {verDetalleCita.centroSalud && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={14} className="text-accent" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lugar de atención</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{verDetalleCita.centroSalud.nombre}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{verDetalleCita.centroSalud.direccion}</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {verDetalleCita.centroSalud.telefono} — {verDetalleCita.centroSalud.tipo}
                </p>
              </div>
            )}

            {/* Motivo y diagnóstico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Motivo</span>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{verDetalleCita.motivo}</p>
              </div>
              {verDetalleCita.diagnostico && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diagnóstico</span>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{verDetalleCita.diagnostico}</p>
                </div>
              )}
            </div>

            {/* Fórmula médica */}
            {verDetalleCita.formula ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fórmula médica</span>
                  <Badge variant={estadosFormula[verDetalleCita.formula.estado]?.variant} size="sm">
                    {estadosFormula[verDetalleCita.formula.estado]?.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Emitida</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(verDetalleCita.formula.fechaEmision).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vence</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(verDetalleCita.formula.fechaVencimiento).toLocaleDateString('es-CO')}
                      {verDetalleCita.formula.estado === 'vencida' && (
                        <span className="text-xs text-red-500 ml-1">(Vencida)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {verDetalleCita.formula.medicamentos.map(m => (
                    <div key={m.medicamentoId} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Pill size={16} className="text-accent flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{m.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{m.dosis} — {m.cantidad} unidades</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{m.indicaciones}</p>
                        </div>
                      </div>
                      {verDetalleCita.formula.estado === 'activa' && (
                        <button onClick={() => { setVerDetalleCita(null); handleReservar(m.medicamentoId, verDetalleCita.formula.id) }}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-colors ml-2">
                          <Plus size={12} />Reservar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {verDetalleCita.formula.estado === 'vencida' && (
                  <button onClick={() => { setVerDetalleCita(null); handleSolicitarAutorizacion(verDetalleCita.formula.id) }}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                    <Send size={16} />Solicitar autorización a la EPS
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl text-center">
                <FileText size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No se emitió fórmula médica en esta cita</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Ver fórmula */}
      {verFormula && (
        <Modal isOpen={!!verFormula} onClose={() => setVerFormula(null)} title="Fórmula Médica" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Médico</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{verFormula.medico}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Especialidad</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{verFormula.especialidad}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de emisión</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(verFormula.fechaEmision).toLocaleDateString('es-CO')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vencimiento</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(verFormula.fechaVencimiento).toLocaleDateString('es-CO')}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Diagnóstico</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">{verFormula.diagnostico}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Medicamentos recetados</p>
              <div className="space-y-2">
                {verFormula.medicamentos.map(m => (
                  <div key={m.medicamentoId} className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-accent" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{m.nombre}</span>
                      </div>
                      {verFormula.estado === 'activa' && (
                        <button onClick={() => { setVerFormula(null); handleReservar(m.medicamentoId, verFormula.id) }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-colors">
                          <Plus size={12} />Reservar
                        </button>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Dosis: {m.dosis}</span>
                      <span>Cantidad: {m.cantidad}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{m.indicaciones}</p>
                  </div>
                ))}
              </div>
            </div>

            {verFormula.estado === 'vencida' && (
              <button onClick={() => { setVerFormula(null); handleSolicitarAutorizacion(verFormula.id) }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                <Send size={16} />Solicitar autorización a la EPS
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Reservar medicamento */}
      {reservarModal && (
        <Modal isOpen={!!reservarModal} onClose={() => setReservarModal(null)} title="Reservar medicamento" size="md">
          <div className="space-y-4">
            {reservarModal.farmacias.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                No hay farmacias con stock disponible para este medicamento
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farmacia</label>
                  <select value={reservarModal.farmaciaId} onChange={(e) => setReservarModal({ ...reservarModal, farmaciaId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent outline-none">
                    <option value="">Selecciona una farmacia</option>
                    {reservarModal.farmacias.map(f => (
                      <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                    <input type="date" value={reservarModal.fecha} onChange={(e) => setReservarModal({ ...reservarModal, fecha: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
                    <input type="time" value={reservarModal.hora} onChange={(e) => setReservarModal({ ...reservarModal, hora: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                </div>
                <button onClick={confirmarReserva} disabled={!reservarModal.farmaciaId || !reservarModal.fecha || !reservarModal.hora}
                  className="w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  <Calendar size={16} />Confirmar reserva
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Confirmación de autorización */}
      {authConfirm && (
        <Modal isOpen={!!authConfirm} onClose={() => setAuthConfirm(null)} title="Solicitud enviada" size="sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tu solicitud de autorización ha sido enviada a la EPS. Recibirás una notificación cuando sea respondida.
            </p>
            <button onClick={() => setAuthConfirm(null)}
              className="w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors">
              Entendido
            </button>
          </div>
        </Modal>
      )}
      </div>
      </div>
    </div>
  )
}
