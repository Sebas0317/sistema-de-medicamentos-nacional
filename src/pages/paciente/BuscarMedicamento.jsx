import { useState, useMemo } from 'react'
import { Search, Pill, AlertTriangle, MapPin, Clock, Package } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'

const categorias = ['todas', 'analgésico', 'antibiótico', 'cardiovascular', 'antidiabético', 'gastrointestinal', 'respiratorio', 'neurológico', 'inmunosupresor', 'endocrino']

function getStockBadge(stock, stockMinimo) {
  if (stock === 0) return { text: 'Sin stock', variant: 'danger' }
  if (stock <= stockMinimo) return { text: 'Stock bajo', variant: 'warning' }
  if (stock <= stockMinimo * 2) return { text: 'Stock moderado', variant: 'info' }
  return { text: 'Disponible', variant: 'success' }
}

export default function BuscarMedicamento() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const medicamentos = useStore((s) => s.medicamentos)
  const inventario = useStore((s) => s.inventario)
  const farmacias = useStore((s) => s.farmacias)
  const eps = useStore((s) => s.eps)
  const crearReserva = useStore((s) => s.crearReserva)
  const agregarNotificacion = useStore((s) => s.agregarNotificacion)

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [soloDisponible, setSoloDisponible] = useState(false)
  const [selectedMed, setSelectedMed] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [fechaReclamacion, setFechaReclamacion] = useState('')
  const [horaReclamacion, setHoraReclamacion] = useState('10:00')
  const [notas, setNotas] = useState('')
  const [esADomicilio, setEsADomicilio] = useState(false)
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservaError, setReservaError] = useState('')

  const filtrados = useMemo(() => {
    let result = [...medicamentos]
    if (busqueda) {
      const q = busqueda.toLowerCase()
      result = result.filter((m) => m.nombre.toLowerCase().includes(q) || m.codigoATC.toLowerCase().includes(q))
    }
    if (categoria !== 'todas') result = result.filter((m) => m.categoria === categoria)
    if (soloDisponible) {
      const medIdsConStock = new Set(inventario.filter((i) => i.stock > 0).map((i) => i.medicamentoId))
      result = result.filter((m) => medIdsConStock.has(m.id))
    }
    return result
  }, [medicamentos, busqueda, categoria, soloDisponible, inventario])

  const disponibilidad = useMemo(() => {
    if (!selectedMed) return []
    return inventario
      .filter((i) => i.medicamentoId === selectedMed.id)
      .map((i) => {
        const farm = farmacias.find((f) => f.id === i.farmaciaId)
        return { ...i, farmaciaNombre: farm?.nombre || '', farmacia: farm }
      })
  }, [selectedMed, inventario, farmacias])

  const handleReservar = (farmaciaId) => {
    setSelectedFarmId(farmaciaId)
    setReservaError('')
    setFechaReclamacion('')
    setHoraReclamacion('10:00')
    setNotas('')
    setEsADomicilio(false)
    setDireccion('')
    setShowModal(true)
  }

  const handleConfirmarReserva = async () => {
    if (!fechaReclamacion) { setReservaError('Selecciona una fecha'); return }
    setLoading(true)
    setReservaError('')
    setTimeout(() => {
      const result = crearReserva({
        pacienteId: usuarioActual.id,
        medicamentoId: selectedMed.id,
        farmaciaId: selectedFarmId,
        fechaReclamacion,
        horaReclamacion,
        notas,
        esADomicilio,
        direccion
      })
      if (result.ok) {
        setShowModal(false)
        agregarNotificacion('Reserva creada exitosamente', 'success')
      } else {
        setReservaError(result.error)
      }
      setLoading(false)
    }, 500)
  }

  const epsPaciente = eps.find((e) => e.id === usuarioActual?.epsId)

  const horarios = Array.from({ length: 10 }, (_, i) => {
    const h = i + 8
    return `${String(h).padStart(2, '0')}:00`
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de medicamentos */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">Buscar medicamento</h1>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o código ATC..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                {categorias.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <input type="checkbox" checked={soloDisponible} onChange={(e) => setSoloDisponible(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              Solo con stock disponible
            </label>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin pr-1">
              {filtrados.map((med) => (
                <div
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`p-4 bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    selectedMed?.id === med.id ? 'border-blue-500 shadow-md' : 'border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{med.nombre}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">ATC: {med.codigoATC}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge text={med.categoria} variant="neutral" />
                      {med.requiereAutorizacion && <Badge text="Requiere auth. EPS" variant="warning" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{med.presentacion} · {med.laboratorio}</p>
                </div>
              ))}
              {filtrados.length === 0 && (
                <EmptyState icon={Search} title="Sin resultados" description="No se encontraron medicamentos con esos filtros" />
              )}
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            {!selectedMed ? (
              <EmptyState icon={Pill} title="Selecciona un medicamento" description="Haz clic en un medicamento de la lista para ver su disponibilidad" />
            ) : (
              <div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{selectedMed.nombre}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedMed.descripcion}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge text={selectedMed.categoria} variant="neutral" />
                    <Badge text={selectedMed.presentacion} variant="info" />
                    <Badge text={selectedMed.laboratorio} variant="purple" />
                  </div>
                  {selectedMed.requiereAutorizacion && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-yellow-700">Este medicamento requiere autorización previa de tu EPS. Se enviará la solicitud automáticamente.</p>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">Disponibilidad en farmacias</h3>
                <div className="space-y-3">
                  {disponibilidad.map((item) => {
                    const badge = getStockBadge(item.stock, item.stockMinimo)
                    return (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.farmaciaNombre}</h4>
                            {item.farmacia && (
                              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                <div className="flex items-center gap-1"><MapPin size={12} /><span>{item.farmacia.direccion}</span></div>
                                <div className="flex items-center gap-1"><Clock size={12} /><span>{item.farmacia.horario}</span></div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`text-xl font-bold ${item.stock === 0 ? 'text-red-500' : item.stock <= item.stockMinimo ? 'text-amber-500' : 'text-green-600'}`}>
                              {item.stock}
                            </span>
                            <div className="mt-1"><Badge text={badge.text} variant={badge.variant} /></div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleReservar(item.farmaciaId)}
                          disabled={item.stock === 0}
                          className="mt-3 w-full py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {item.stock === 0 ? 'Sin stock disponible' : 'Reservar'}
                        </button>
                      </div>
                    )
                  })}
                  {disponibilidad.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No hay farmacias con este medicamento actualmente</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Reservar ${selectedMed?.nombre || ''}`} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar farmacia</label>
            <select value={selectedFarmId} onChange={(e) => setSelectedFarmId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {disponibilidad.map((item) => (
                <option key={item.farmaciaId} value={item.farmaciaId}>
                  {item.farmaciaNombre} — Stock: {item.stock}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de reclamación</label>
            <input type="date" value={fechaReclamacion} onChange={(e) => setFechaReclamacion(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora de reclamación</label>
            <select value={horaReclamacion} onChange={(e) => setHoraReclamacion(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="domicilio" checked={esADomicilio} onChange={(e) => setEsADomicilio(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="domicilio" className="text-sm text-gray-700">Entrega a domicilio</label>
          </div>
          {esADomicilio && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Cra XX #YY-ZZ, Barrio, Ciudad" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}
          {selectedMed?.requiereAutorizacion && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Package size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Este medicamento requiere autorización previa de <strong>{epsPaciente?.nombre || 'tu EPS'}</strong>. La solicitud se enviará automáticamente. Tiempo estimado: 24-48 horas.
              </p>
            </div>
          )}
          {reservaError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{reservaError}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleConfirmarReserva} disabled={loading} className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
              {loading ? 'Procesando...' : 'Confirmar reserva'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
