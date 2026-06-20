import { useState, useMemo } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import EmptyState from '../../components/shared/EmptyState'
import AlertaStockCard from '../../components/proveedor/AlertaStockCard'
import useRelativeTime from '../../hooks/useRelativeTime'

const criticidadFiltros = ['Todos', 'Sin stock', 'Crítico (≤ mínimo)', 'Advertencia', 'OK']

export default function AlertasStock() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const inventario = useStore((s) => s.inventario)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const registrarSuministro = useStore((s) => s.registrarSuministro)

  const [busqueda, setBusqueda] = useState('')
  const [filtroFarmacia, setFiltroFarmacia] = useState('todas')
  const [filtroCriticidad, setFiltroCriticidad] = useState('Todos')
  const [vista, setVista] = useState('tabla')
  const [suministroModal, setSuministroModal] = useState(null)
  const [formSum, setFormSum] = useState({ farmaciaId: '', medicamentoId: '', cantidad: 1, lote: '', vencimiento: '' })
  const { formatRelativeTime } = useRelativeTime()

  const proveedorId = usuarioActual?.entidadId || ''

  const items = useMemo(() => {
    let data = inventario.map((i) => {
      const med = medicamentos.find((m) => m.id === i.medicamentoId)
      const farm = farmacias.find((f) => f.id === i.farmaciaId)
      return { ...i, medicamentoNombre: med?.nombre || '', codigoATC: med?.codigoATC || '', farmaciaNombre: farm?.nombre || '', medicamento: med, farmacia: farm }
    })

    if (busqueda) {
      const q = busqueda.toLowerCase()
      data = data.filter((i) => i.medicamentoNombre.toLowerCase().includes(q) || i.farmaciaNombre.toLowerCase().includes(q))
    }
    if (filtroFarmacia !== 'todas') data = data.filter((i) => i.farmaciaId === filtroFarmacia)

    if (filtroCriticidad === 'Sin stock') data = data.filter((i) => i.stock === 0)
    else if (filtroCriticidad === 'Crítico (≤ mínimo)') data = data.filter((i) => i.stock > 0 && i.stock <= i.stockMinimo)
    else if (filtroCriticidad === 'Advertencia') data = data.filter((i) => i.stock > i.stockMinimo && i.stock <= i.stockMinimo * 2)
    else if (filtroCriticidad === 'OK') data = data.filter((i) => i.stock > i.stockMinimo * 2)

    // Ordenar: sin stock primero, luego críticos
    data.sort((a, b) => {
      const scoreA = a.stock === 0 ? 0 : a.stock <= a.stockMinimo ? 1 : 2
      const scoreB = b.stock === 0 ? 0 : b.stock <= b.stockMinimo ? 1 : 2
      return scoreA - scoreB
    })

    return data
  }, [inventario, medicamentos, farmacias, busqueda, filtroFarmacia, filtroCriticidad])

  const criticosActivos = items.filter((i) => i.stock <= i.stockMinimo).length

  const getBadge = (item) => {
    if (item.stock === 0) return { text: 'Sin stock', variant: 'danger' }
    if (item.stock <= item.stockMinimo) return { text: 'Crítico', variant: 'warning' }
    if (item.stock <= item.stockMinimo * 2) return { text: 'Advertencia', variant: 'info' }
    return { text: 'OK', variant: 'success' }
  }

  const handleAbastecer = (item) => {
    setSuministroModal(item)
    setFormSum({ farmaciaId: item.farmaciaId, medicamentoId: item.medicamentoId, cantidad: Math.max(item.stockMinimo * 2 - item.stock, 1), lote: '', vencimiento: '' })
  }

  const handleRegistrar = () => {
    if (!formSum.lote || !formSum.vencimiento || formSum.cantidad < 1) return
    registrarSuministro({
      proveedorId,
      farmaciaId: formSum.farmaciaId,
      medicamentoId: formSum.medicamentoId,
      cantidad: formSum.cantidad,
      numeroLote: formSum.lote,
      fechaVencimiento: formSum.vencimiento
    })
    setSuministroModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="proveedor" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-xl font-bold text-gray-900">Monitor de Stock — Todas las farmacias</h1>
          <Badge text={`${criticosActivos} alertas críticas activas`} variant="danger" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar medicamento o farmacia..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <select value={filtroFarmacia} onChange={(e) => setFiltroFarmacia(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
            <option value="todas">Todas las farmacias</option>
            {farmacias.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select>
          <select value={filtroCriticidad} onChange={(e) => setFiltroCriticidad(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
            {criticidadFiltros.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
            <button onClick={() => setVista('tabla')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${vista === 'tabla' ? 'bg-red-600 text-white' : 'text-gray-600'}`}>Tabla</button>
            <button onClick={() => setVista('cards')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${vista === 'cards' ? 'bg-red-600 text-white' : 'text-gray-600'}`}>Tarjetas</button>
          </div>
        </div>

        {vista === 'tabla' ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {items.length === 0 ? (
              <EmptyState icon={RefreshCw} title="Sin resultados" description="No hay datos con los filtros actuales" />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Farmacia</th>
                    <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                    <th className="text-left px-4 py-3 font-medium">Stock</th>
                    <th className="text-left px-4 py-3 font-medium">Mínimo</th>
                    <th className="text-left px-4 py-3 font-medium">Estado</th>
                    <th className="text-left px-4 py-3 font-medium">Actualización</th>
                    <th className="text-left px-4 py-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const badge = getBadge(item)
                    const rowColor = item.stock === 0 ? 'bg-red-50' : item.stock <= item.stockMinimo ? 'bg-orange-50' : ''
                    return (
                      <tr key={item.id} className={`${rowColor} hover:bg-opacity-70`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{item.farmaciaNombre}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{item.medicamentoNombre}</p>
                          <p className="text-xs text-gray-400">{item.codigoATC}</p>
                        </td>
                        <td className="px-4 py-3"><span className={`font-bold text-lg ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.stock}</span></td>
                        <td className="px-4 py-3 text-gray-600">{item.stockMinimo}</td>
                        <td className="px-4 py-3"><Badge text={badge.text} variant={badge.variant} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{formatRelativeTime(item.ultimaActualizacion)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleAbastecer(item)} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Abastecer</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <AlertaStockCard key={item.id} inventarioItem={item} onAbastecer={handleAbastecer} />
            ))}
            {items.length === 0 && (
              <div className="col-span-full">
                <EmptyState icon={RefreshCw} title="Sin resultados" description="No hay datos con los filtros actuales" />
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={!!suministroModal} onClose={() => setSuministroModal(null)} title="Abastecer medicamento" size="md">
        {suministroModal && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Farmacia:</strong> {suministroModal.farmaciaNombre}</p>
              <p><strong>Medicamento:</strong> {suministroModal.medicamentoNombre}</p>
              <p><strong>Stock actual:</strong> {suministroModal.stock} / <strong>Mínimo:</strong> {suministroModal.stockMinimo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad a suministrar</label>
              <input type="number" value={formSum.cantidad} onChange={(e) => setFormSum((p) => ({ ...p, cantidad: Number(e.target.value) }))} min={1} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              <p className="text-xs text-gray-400 mt-1">Stock después: {suministroModal.stock + (formSum.cantidad || 0)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de lote</label>
              <input type="text" value={formSum.lote} onChange={(e) => setFormSum((p) => ({ ...p, lote: e.target.value }))} placeholder="LOT-2026-XXX" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</label>
              <input type="date" value={formSum.vencimiento} onChange={(e) => setFormSum((p) => ({ ...p, vencimiento: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <button onClick={handleRegistrar} className="w-full py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Registrar suministro</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
