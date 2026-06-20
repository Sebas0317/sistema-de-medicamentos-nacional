import { AlertTriangle, Package } from 'lucide-react'
import Badge from '../shared/Badge'

function getBadge(item) {
  if (item.stock === 0) return { text: 'Sin stock', variant: 'danger' }
  if (item.stock <= item.stockMinimo) return { text: 'Crítico', variant: 'warning' }
  if (item.stock <= item.stockMinimo * 2) return { text: 'Advertencia', variant: 'info' }
  return { text: 'OK', variant: 'success' }
}

export default function AlertaStockCard({ inventarioItem, onAbastecer }) {
  const badge = getBadge(inventarioItem)
  const isCritico = inventarioItem.stock <= inventarioItem.stockMinimo

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 transition-all hover:shadow-md ${
      isCritico ? 'border-red-200' : 'border-gray-100'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{inventarioItem.farmaciaNombre}</p>
          <p className="text-sm text-gray-600">{inventarioItem.medicamentoNombre}</p>
          <p className="text-xs text-gray-400">{inventarioItem.codigoATC}</p>
        </div>
        <Badge text={badge.text} variant={badge.variant} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-3xl font-bold ${inventarioItem.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
          {inventarioItem.stock}
        </span>
        <span className="text-sm text-gray-400">/ {inventarioItem.stockMinimo} mín</span>
        {isCritico && <AlertTriangle size={18} className="text-red-500" />}
      </div>
      <button
        onClick={() => onAbastecer(inventarioItem)}
        className="w-full py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        Abastecer
      </button>
    </div>
  )
}
