import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const horarios = Array.from({ length: 10 }, (_, i) => {
  const h = i + 8
  return `${String(h).padStart(2, '0')}:00`
})

export default function FormularioReserva({ medicamento, farmacia, onSubmit, onCancel, isLoading }) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('10:00')
  const [notas, setNotas] = useState('')
  const [esDomicilio, setEsDomicilio] = useState(false)
  const [direccion, setDireccion] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!fecha) errs.fecha = 'Selecciona una fecha'
    if (esDomicilio && !direccion) errs.direccion = 'Ingresa la dirección'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ medicamentoId: medicamento.id, farmaciaId: farmacia.id, fechaReclamacion: fecha, horaReclamacion: hora, notas, esADomicilio: esDomicilio, direccion })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700">
          {farmacia.nombre} — Stock: <span className="text-gray-900">{farmacia.stock} unidades</span>
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de reclamación</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors.fecha ? 'border-red-300' : 'border-gray-200'}`} />
        {errors.fecha && <p className="text-xs text-red-500 mt-1">{errors.fecha}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
        <select value={hora} onChange={(e) => setHora(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
        <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="domicilio" checked={esDomicilio} onChange={(e) => setEsDomicilio(e.target.checked)} className="rounded border-gray-300 text-blue-600" />
        <label htmlFor="domicilio" className="text-sm text-gray-700">A domicilio</label>
      </div>
      {esDomicilio && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors.direccion ? 'border-red-300' : 'border-gray-200'}`} />
          {errors.direccion && <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>}
        </div>
      )}
      {medicamento.requiereAutorizacion && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertTriangle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-700">Requiere autorización de tu EPS. Se enviará solicitud automática.</p>
        </div>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
        <button type="submit" disabled={isLoading} className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          {isLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
          {isLoading ? 'Procesando...' : 'Confirmar reserva'}
        </button>
      </div>
    </form>
  )
}
