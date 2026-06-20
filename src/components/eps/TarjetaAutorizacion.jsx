import { CheckCircle, XCircle } from 'lucide-react'
import Badge from '../shared/Badge'
import useRelativeTime from '../../hooks/useRelativeTime'

export default function TarjetaAutorizacion({ autorizacion, onAprobar, onRechazar }) {
  const { formatRelativeTime } = useRelativeTime()
  const a = autorizacion

  const estadoBadge = {
    pendiente: 'warning',
    aprobada: 'success',
    rechazada: 'danger'
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 ${
      a.estado === 'aprobada' ? 'border-green-200 bg-green-50/30' :
      a.estado === 'rechazada' ? 'border-red-200 bg-red-50/30' :
      'border-gray-100'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge text={a.estado} variant={estadoBadge[a.estado]} />
          <span className="text-xs text-gray-400">{formatRelativeTime(a.fechaSolicitud)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500 text-xs">Paciente</span>
          <p className="font-medium">{a.pacienteNombre}</p>
          <p className="text-xs text-gray-400">CC {a.pacienteDocumento}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Medicamento</span>
          <p className="font-medium">{a.medicamentoNombre}</p>
          {a.medicamento && <Badge text={a.medicamento.categoria} variant="neutral" />}
        </div>
        <div>
          <span className="text-gray-500 text-xs">Cobertura</span>
          <p className="font-medium">{a.cobertura}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Observaciones</span>
          <p className="text-xs text-gray-600 line-clamp-2">{a.observaciones || '-'}</p>
        </div>
      </div>
      {a.estado === 'pendiente' && (
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button onClick={() => onAprobar(a.id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"><CheckCircle size={16} />Aprobar</button>
          <button onClick={() => onRechazar(a)} className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200"><XCircle size={16} />Rechazar</button>
        </div>
      )}
    </div>
  )
}
