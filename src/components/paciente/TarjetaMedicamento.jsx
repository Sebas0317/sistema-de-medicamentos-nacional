import Badge from '../shared/Badge'

export default function TarjetaMedicamento({ medicamento, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(medicamento)}
      className={`p-4 bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{medicamento.nombre}</h3>
          <p className="text-xs text-gray-400 mt-0.5">ATC: {medicamento.codigoATC}</p>
        </div>
        <div className="flex gap-1">
          <Badge text={medicamento.categoria} variant="neutral" />
          {medicamento.requiereAutorizacion && <Badge text="Requiere auth." variant="warning" />}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{medicamento.presentacion} &middot; {medicamento.laboratorio}</p>
    </div>
  )
}
