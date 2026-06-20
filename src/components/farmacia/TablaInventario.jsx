import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Badge from '../shared/Badge'
import useRelativeTime from '../../hooks/useRelativeTime'

function getStockBadge(item) {
  if (item.stock === 0) return { text: 'Sin stock', variant: 'danger' }
  if (item.stock <= item.stockMinimo) return { text: 'Crítico', variant: 'warning' }
  if (item.stock <= item.stockMinimo * 2) return { text: 'Advertencia', variant: 'info' }
  return { text: 'OK', variant: 'success' }
}

export default function TablaInventario({ inventario, onUpdateStock, page = 1, perPage = 10 }) {
  const { formatRelativeTime } = useRelativeTime()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState(0)

  const paginated = inventario.slice((page - 1) * perPage, page * perPage)

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="text-left px-4 py-3 font-medium">Medicamento</th>
          <th className="text-left px-4 py-3 font-medium">Código ATC</th>
          <th className="text-left px-4 py-3 font-medium">Stock</th>
          <th className="text-left px-4 py-3 font-medium">Mínimo</th>
          <th className="text-left px-4 py-3 font-medium">Estado</th>
          <th className="text-left px-4 py-3 font-medium">Actualización</th>
          <th className="text-left px-4 py-3 font-medium">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {paginated.map((item) => {
          const badge = getStockBadge(item)
          const rowColor = item.stock === 0 ? 'bg-red-50' : item.stock <= item.stockMinimo ? 'bg-orange-50' : item.stock <= item.stockMinimo * 2 ? 'bg-yellow-50' : ''
          return (
            <tr key={item.id} className={`${rowColor} hover:bg-opacity-70`}>
              <td className="px-4 py-3 font-medium text-gray-900">{item.medicamentoNombre || item.medicamento?.nombre || '-'}</td>
              <td className="px-4 py-3 text-xs text-gray-400">{item.medicamento?.codigoATC || '-'}</td>
              <td className="px-4 py-3"><span className={`font-bold ${item.stock === 0 ? 'text-red-600' : item.stock <= item.stockMinimo ? 'text-amber-600' : 'text-green-600'}`}>{item.stock}</span></td>
              <td className="px-4 py-3 text-gray-600">{item.stockMinimo}</td>
              <td className="px-4 py-3"><Badge text={badge.text} variant={badge.variant} /></td>
              <td className="px-4 py-3 text-xs text-gray-400">{formatRelativeTime(item.ultimaActualizacion)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => onUpdateStock(item.farmaciaId, item.medicamentoId, 1, 'restar')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Minus size={14} /></button>
                  {editingId === item.id ? (
                    <input type="number" value={editValue} onChange={(e) => setEditValue(Number(e.target.value))} onBlur={() => { onUpdateStock(item.farmaciaId, item.medicamentoId, editValue, 'setear'); setEditingId(null) }} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} className="w-14 text-center border border-amber-300 rounded-lg px-1 py-1 text-sm" autoFocus />
                  ) : (
                    <span onClick={() => { setEditingId(item.id); setEditValue(item.stock) }} className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100">{item.stock}</span>
                  )}
                  <button onClick={() => onUpdateStock(item.farmaciaId, item.medicamentoId, 1, 'sumar')} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Plus size={14} /></button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
