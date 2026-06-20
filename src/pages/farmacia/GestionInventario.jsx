import { useState, useMemo } from 'react'
import { Plus, Minus, Search, ArrowUpDown, ChevronDown, Package, ArrowDown, ArrowUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'
import useRelativeTime from '../../hooks/useRelativeTime'

const filtros = ['Todos', 'Críticos', 'Sin stock', 'Bien abastecidos']

export default function GestionInventario() {
  const location = useLocation()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const inventario = useStore((s) => s.inventario)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const actualizarStock = useStore((s) => s.actualizarStock)
  const movimientosInventario = useStore((s) => s.movimientosInventario)
  const { formatRelativeTime, formatDateTime } = useRelativeTime()

  const farmaciaId = usuarioActual?.entidadId || ''
  const farmacia = farmacias.find((f) => f.id === farmaciaId)

  const [busqueda, setBusqueda] = useState('')
  const [filtroActivo, setFiltroActivo] = useState(location.state?.filtro || 'Todos')
  const [orden, setOrden] = useState('nombre')
  const [entradaModal, setEntradaModal] = useState(false)
  const [historialModal, setHistorialModal] = useState(null)
  const [formEntrada, setFormEntrada] = useState({ medicamentoId: '', tipo: 'entrada', cantidad: 1, lote: '', vencimiento: '', observaciones: '' })

  let inv = useMemo(() => {
    let items = inventario.filter((i) => i.farmaciaId === farmaciaId).map((i) => {
      const med = medicamentos.find((m) => m.id === i.medicamentoId)
      return { ...i, medicamentoNombre: med?.nombre || '', codigoATC: med?.codigoATC || '', categoria: med?.categoria || '', medicamento: med }
    })

    if (busqueda) {
      const q = busqueda.toLowerCase()
      items = items.filter((i) => i.medicamentoNombre.toLowerCase().includes(q))
    }

    if (filtroActivo === 'Críticos') items = items.filter((i) => i.stock <= i.stockMinimo)
    else if (filtroActivo === 'Sin stock') items = items.filter((i) => i.stock === 0)
    else if (filtroActivo === 'Bien abastecidos') items = items.filter((i) => i.stock > i.stockMinimo * 2)

    if (orden === 'nombre') items.sort((a, b) => a.medicamentoNombre.localeCompare(b.medicamentoNombre))
    else if (orden === 'stock_asc') items.sort((a, b) => a.stock - b.stock)
    else if (orden === 'stock_desc') items.sort((a, b) => b.stock - a.stock)

    return items
  }, [inventario, farmaciaId, medicamentos, busqueda, filtroActivo, orden])

  const criticosCount = inv.filter((i) => i.stock <= i.stockMinimo).length

  const getStockBadge = (item) => {
    if (item.stock === 0) return { text: 'Sin stock', variant: 'danger' }
    if (item.stock <= item.stockMinimo) return { text: 'Crítico', variant: 'warning' }
    if (item.stock <= item.stockMinimo * 2) return { text: 'Advertencia', variant: 'info' }
    return { text: 'OK', variant: 'success' }
  }

  const handleSumar = (item) => actualizarStock(item.farmaciaId, item.medicamentoId, 1, 'sumar')
  const handleRestar = (item) => { if (item.stock > 0) actualizarStock(item.farmaciaId, item.medicamentoId, 1, 'restar') }
  const handleGuardarStock = (item, valor) => actualizarStock(item.farmaciaId, item.medicamentoId, Number(valor), 'setear')

  const handleEntradaMasiva = () => {
    if (!formEntrada.medicamentoId || !formEntrada.cantidad) return
    const operacion = formEntrada.tipo === 'salida' ? 'restar' : 'sumar'
    actualizarStock(farmaciaId, formEntrada.medicamentoId, Number(formEntrada.cantidad), operacion)
    setEntradaModal(false)
    setFormEntrada({ medicamentoId: '', tipo: 'entrada', cantidad: 1, lote: '', vencimiento: '', observaciones: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="farmacia" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-sm text-gray-500">{farmacia?.nombre} &middot; {inv.length} medicamentos</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={`${criticosCount} alertas críticas`} variant="danger" />
            <button onClick={() => setEntradaModal(true)} className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">+ Agregar movimiento</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar medicamento..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100">
            {filtros.map((f) => (
              <button key={f} onClick={() => setFiltroActivo(f)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filtroActivo === f ? 'bg-amber-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>{f}</button>
            ))}
          </div>
          <select value={orden} onChange={(e) => setOrden(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
            <option value="nombre">Nombre A-Z</option>
            <option value="stock_asc">Stock menor</option>
            <option value="stock_desc">Stock mayor</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          {inv.length === 0 ? (
            <EmptyState icon={Package} title="Sin inventario" description="No hay medicamentos en esta farmacia" />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                  <th className="text-left px-4 py-3 font-medium">Categoría</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 font-medium">Mínimo</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 font-medium">Actualización</th>
                  <th className="text-left px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inv.map((item) => {
                  const badge = getStockBadge(item)
                  const rowColor = item.stock === 0 ? 'bg-red-50' : item.stock <= item.stockMinimo ? 'bg-orange-50' : item.stock <= item.stockMinimo * 2 ? 'bg-yellow-50' : ''
                  return (
                    <tr key={item.id} className={`${rowColor} hover:bg-opacity-70`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.medicamentoNombre}</p>
                        <p className="text-xs text-gray-400">{item.codigoATC}</p>
                      </td>
                      <td className="px-4 py-3"><Badge text={item.categoria} variant="neutral" /></td>
                      <td className="px-4 py-3"><span className={`font-bold text-lg ${item.stock === 0 ? 'text-red-600' : item.stock <= item.stockMinimo ? 'text-amber-600' : 'text-green-600'}`}>{item.stock}</span></td>
                      <td className="px-4 py-3 text-gray-600">{item.stockMinimo}</td>
                      <td className="px-4 py-3"><Badge text={badge.text} variant={badge.variant} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatRelativeTime(item.ultimaActualizacion)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleRestar(item)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Minus size={14} /></button>
                          <input type="number" value={item.stock} onChange={(e) => handleGuardarStock(item, e.target.value)} className="w-14 text-center text-sm border border-gray-200 rounded-lg px-1 py-1" min={0} />
                          <button onClick={() => handleSumar(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Plus size={14} /></button>
                          <button onClick={() => setHistorialModal(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs">Hist.</button>
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

      {/* Modal entrada masiva */}
      <Modal isOpen={entradaModal} onClose={() => setEntradaModal(false)} title="Agregar movimiento" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medicamento</label>
            <select value={formEntrada.medicamentoId} onChange={(e) => setFormEntrada((p) => ({ ...p, medicamentoId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="">Seleccionar...</option>
              {medicamentos.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
            <select value={formEntrada.tipo} onChange={(e) => setFormEntrada((p) => ({ ...p, tipo: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input type="number" value={formEntrada.cantidad} onChange={(e) => setFormEntrada((p) => ({ ...p, cantidad: Number(e.target.value) }))} min={1} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de lote</label>
            <input type="text" value={formEntrada.lote} onChange={(e) => setFormEntrada((p) => ({ ...p, lote: e.target.value }))} placeholder="LOT-2026-XXX" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</label>
            <input type="date" value={formEntrada.vencimiento} onChange={(e) => setFormEntrada((p) => ({ ...p, vencimiento: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea value={formEntrada.observaciones} onChange={(e) => setFormEntrada((p) => ({ ...p, observaciones: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEntradaModal(false)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={handleEntradaMasiva} className="flex-1 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg">Guardar movimiento</button>
          </div>
        </div>
      </Modal>

      {/* Modal historial */}
      <Modal isOpen={!!historialModal} onClose={() => setHistorialModal(null)} title="Historial del medicamento" size="lg">
        {historialModal && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{historialModal.medicamentoNombre}</p>
                <p className="text-xs text-gray-400">{historialModal.codigoATC}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Stock actual: <span className="font-bold text-lg text-gray-900">{historialModal.stock}</span></p>
                <p className="text-xs text-gray-500">Mínimo: {historialModal.stockMinimo}</p>
              </div>
            </div>

            <div className="flex gap-2 text-xs text-gray-500">
              <Badge text={historialModal.categoria} variant="neutral" />
              <span>Última actualización: {formatRelativeTime(historialModal.ultimaActualizacion)}</span>
            </div>

            <hr className="border-gray-100" />

            <p className="text-sm font-medium text-gray-700">Movimientos recientes</p>

            {(() => {
              const movs = movimientosInventario.filter(
                m => m.medicamentoId === historialModal.medicamentoId && m.farmaciaId === farmaciaId
              )
              if (movs.length === 0) {
                return (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                    No hay movimientos registrados en esta sesión
                  </div>
                )
              }
              return (
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {movs.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        {m.tipo === 'entrada' ? (
                          <ArrowDown size={14} className="text-green-600" />
                        ) : (
                          <ArrowUp size={14} className="text-red-600" />
                        )}
                        <span className={m.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}>
                          {m.tipo === 'entrada' ? '+' : '-'}{m.cantidad}
                        </span>
                        <span className="text-gray-500">
                          ({m.stockAnterior} → {m.stockNuevo})
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDateTime(m.fecha)}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}
      </Modal>
    </div>
  )
}
