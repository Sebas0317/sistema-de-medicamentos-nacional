import { useState, useMemo } from 'react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'

export default function RegistrarSuministro() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const inventario = useStore((s) => s.inventario)
  const getSuministrosPorProveedor = useStore((s) => s.getSuministrosPorProveedor)
  const registrarSuministro = useStore((s) => s.registrarSuministro)
  const agregarNotificacion = useStore((s) => s.agregarNotificacion)

  const proveedorId = usuarioActual?.entidadId || ''

  const [form, setForm] = useState({
    farmaciaId: '',
    medicamentoId: '',
    cantidad: 1,
    lote: '',
    vencimiento: '',
    condicionesTransporte: '',
    observaciones: ''
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [historialPage, setHistorialPage] = useState(1)
  const [filtroFecha, setFiltroFecha] = useState('todos')

  const suministros = useMemo(() => {
    let data = getSuministrosPorProveedor(proveedorId)
    data.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))

    if (filtroFecha === 'mes') {
      const mesActual = new Date().getMonth()
      data = data.filter((s) => new Date(s.fechaRegistro).getMonth() === mesActual)
    } else if (filtroFecha === 'ultimo_mes') {
      const hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      data = data.filter((s) => new Date(s.fechaRegistro) >= hace30dias)
    }
    return data
  }, [proveedorId, filtroFecha, getSuministrosPorProveedor])

  const paginatedSum = suministros.slice((historialPage - 1) * 10, historialPage * 10)
  const totalPages = Math.ceil(suministros.length / 10)

  // Inventario de farmacia seleccionada
  const invSeleccionado = useMemo(() => {
    if (!form.farmaciaId) return []
    return inventario
      .filter((i) => i.farmaciaId === form.farmaciaId)
      .map((i) => {
        const med = medicamentos.find((m) => m.id === i.medicamentoId)
        return { ...i, medicamentoNombre: med?.nombre || '', codigoATC: med?.codigoATC || '', requiereAutorizacion: med?.requiereAutorizacion, medicamento: med }
      })
      .sort((a, b) => a.medicamentoNombre.localeCompare(b.medicamentoNombre))
  }, [form.farmaciaId, inventario, medicamentos])

  const medSeleccionado = form.medicamentoId ? medicamentos.find((m) => m.id === form.medicamentoId) : null
  const invActual = form.farmaciaId && form.medicamentoId
    ? inventario.find((i) => i.farmaciaId === form.farmaciaId && i.medicamentoId === form.medicamentoId)
    : null

  const validate = () => {
    const errs = {}
    if (!form.farmaciaId) errs.farmaciaId = 'Selecciona una farmacia'
    if (!form.medicamentoId) errs.medicamentoId = 'Selecciona un medicamento'
    if (!form.cantidad || form.cantidad < 1) errs.cantidad = 'Cantidad mínima: 1'
    if (form.cantidad > 10000) errs.cantidad = 'Máximo 10,000'
    if (!form.lote) errs.lote = 'Número de lote requerido'
    if (!form.vencimiento) errs.vencimiento = 'Fecha de vencimiento requerida'
    else {
      const min = new Date()
      min.setMonth(min.getMonth() + 6)
      if (new Date(form.vencimiento) < min) errs.vencimiento = 'Mínimo 6 meses desde hoy'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = registrarSuministro({
      proveedorId,
      farmaciaId: form.farmaciaId,
      medicamentoId: form.medicamentoId,
      cantidad: form.cantidad,
      numeroLote: form.lote,
      fechaVencimiento: form.vencimiento,
      condicionesTransporte: form.condicionesTransporte,
      observaciones: form.observaciones
    })
    if (result.ok) {
      setSuccess(true)
      setForm({ farmaciaId: '', medicamentoId: '', cantidad: 1, lote: '', vencimiento: '', condicionesTransporte: '', observaciones: '' })
      setErrors({})
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="proveedor" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900 mb-6">Registrar suministro</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            Suministro registrado exitosamente
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nuevo suministro</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farmacia destino</label>
                  <select value={form.farmaciaId} onChange={(e) => setForm((p) => ({ ...p, farmaciaId: e.target.value, medicamentoId: '' }))} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none ${errors.farmaciaId ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="">Seleccionar farmacia...</option>
                    {farmacias.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                  </select>
                  {errors.farmaciaId && <p className="text-xs text-red-500 mt-1">{errors.farmaciaId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicamento</label>
                  <select value={form.medicamentoId} onChange={(e) => setForm((p) => ({ ...p, medicamentoId: e.target.value }))} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none ${errors.medicamentoId ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="">Seleccionar medicamento...</option>
                    {medicamentos.map((m) => <option key={m.id} value={m.id}>{m.nombre} - {m.codigoATC}{m.requiereAutorizacion ? ' (Requiere auth.)' : ''}</option>)}
                  </select>
                  {errors.medicamentoId && <p className="text-xs text-red-500 mt-1">{errors.medicamentoId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input type="number" value={form.cantidad} onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))} min={1} max={10000} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none ${errors.cantidad ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.cantidad && <p className="text-xs text-red-500 mt-1">{errors.cantidad}</p>}
                  {invActual && (
                    <p className="text-xs text-gray-400 mt-1">
                      Stock actual: <strong>{invActual.stock}</strong> → Stock después: <strong className="text-green-600">{invActual.stock + (form.cantidad || 0)}</strong>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de lote</label>
                  <input type="text" value={form.lote} onChange={(e) => setForm((p) => ({ ...p, lote: e.target.value }))} placeholder="LOT-2026-001" className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none ${errors.lote ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.lote && <p className="text-xs text-red-500 mt-1">{errors.lote}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</label>
                  <input type="date" value={form.vencimiento} onChange={(e) => setForm((p) => ({ ...p, vencimiento: e.target.value }))} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none ${errors.vencimiento ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.vencimiento && <p className="text-xs text-red-500 mt-1">{errors.vencimiento}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones de transporte</label>
                  <select value={form.condicionesTransporte} onChange={(e) => setForm((p) => ({ ...p, condicionesTransporte: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="">Seleccionar...</option>
                    <option value="Temperatura ambiente">Temperatura ambiente</option>
                    <option value="Cadena de frío 2-8°C">Cadena de frío 2-8°C</option>
                    <option value="Ultracongelado -20°C">Ultracongelado -20°C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                  <textarea value={form.observaciones} onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Registrar suministro</button>
              </form>
            </div>
          </div>

          {/* Inventario actual */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Inventario en {form.farmaciaId ? farmacias.find((f) => f.id === form.farmaciaId)?.nombre : 'farmacia'}
              </h2>
              {!form.farmaciaId ? (
                <div className="py-8 text-center text-sm text-gray-400">Selecciona una farmacia para ver su inventario</div>
              ) : (
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Medicamento</th>
                        <th className="text-center px-3 py-2 font-medium">Stock</th>
                        <th className="text-center px-3 py-2 font-medium">ATC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invSeleccionado.map((i) => (
                        <tr key={i.id} className={`${i.medicamentoId === form.medicamentoId ? 'bg-red-50 font-medium' : ''} hover:bg-gray-50`}>
                          <td className="px-3 py-2">{i.medicamentoNombre}</td>
                          <td className={`px-3 py-2 text-center font-bold ${i.stock <= i.stockMinimo ? 'text-red-600' : 'text-green-600'}`}>{i.stock}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-400">{i.codigoATC}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historial de suministros */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Historial de suministros</h2>
            <select value={filtroFecha} onChange={(e) => { setFiltroFecha(e.target.value); setHistorialPage(1) }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
              <option value="todos">Todos</option>
              <option value="mes">Este mes</option>
              <option value="ultimo_mes">Último mes</option>
            </select>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            {paginatedSum.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No hay suministros registrados</p>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Fecha</th>
                      <th className="text-left px-4 py-3 font-medium">Farmacia</th>
                      <th className="text-left px-4 py-3 font-medium">Medicamento</th>
                      <th className="text-right px-4 py-3 font-medium">Cantidad</th>
                      <th className="text-left px-4 py-3 font-medium">Lote</th>
                      <th className="text-left px-4 py-3 font-medium">Vencimiento</th>
                      <th className="text-left px-4 py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedSum.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{new Date(s.fechaRegistro).toLocaleDateString('es-CO')}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.farmaciaNombre}</td>
                        <td className="px-4 py-3 text-gray-600">{s.medicamentoNombre}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{s.cantidad}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.numeroLote}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.fechaVencimiento ? new Date(s.fechaVencimiento).toLocaleDateString('es-CO') : '-'}</td>
                        <td className="px-4 py-3"><Badge text={s.estado} variant="success" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Página {historialPage} de {totalPages}</p>
                    <div className="flex gap-1">
                      <button disabled={historialPage <= 1} onClick={() => setHistorialPage(historialPage - 1)} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Anterior</button>
                      <button disabled={historialPage >= totalPages} onClick={() => setHistorialPage(historialPage + 1)} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Siguiente</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
