import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, AlertTriangle, Clock, CheckSquare, ArrowRight, GitBranch } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'
import useRelativeTime from '../../hooks/useRelativeTime'
import ChatPanel from '../../components/chat/ChatPanel'

export default function DashboardFarmacia() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const inventario = useStore((s) => s.inventario)
  const getEntregasPorFarmacia = useStore((s) => s.getEntregasPorFarmacia)
  const actualizarStock = useStore((s) => s.actualizarStock)
  const medicamentos = useStore((s) => s.medicamentos)
  const usuarios = useStore((s) => s.usuarios)
  const devSetUser = useStore((s) => s.devSetUser)
  const ultimoAcceso = useStore((s) => s.ultimoAcceso)
  const { formatRelativeTime } = useRelativeTime()

  const [devOpen, setDevOpen] = useState(false)

  const farmaciaId = usuarioActual?.entidadId || ''
  const farmacia = useStore((s) => s.farmacias).find((f) => f.id === farmaciaId)

  const invFarmacia = inventario.filter((i) => i.farmaciaId === farmaciaId)
  const enStock = invFarmacia.filter((i) => i.stock > 0).length
  const bajoMinimo = invFarmacia.filter((i) => i.stock <= i.stockMinimo).length
  const entregas = getEntregasPorFarmacia(farmaciaId)
  const pendientes = entregas.filter((e) => e.estado === 'pendiente' || e.estado === 'lista')
  const hoy = new Date().toISOString().split('T')[0]
  const hoyCompletadas = entregas.filter((e) => e.estado === 'entregada' && e.fechaEntrega?.startsWith(hoy))

  // Stock crítico ordenado
  const criticos = invFarmacia
    .filter((i) => i.stock <= i.stockMinimo)
    .sort((a, b) => a.stock / a.stockMinimo - b.stock / b.stockMinimo)
    .slice(0, 5)
    .map((i) => {
      const med = medicamentos.find((m) => m.id === i.medicamentoId)
      return { ...i, medicamentoNombre: med?.nombre || '' }
    })

  const [ajusteModal, setAjusteModal] = useState(null)
  const [nuevoStock, setNuevoStock] = useState(0)
  const [motivoAjuste, setMotivoAjuste] = useState('')

  const handleAjustar = (item) => {
    setAjusteModal(item)
    setNuevoStock(item.stock)
    setMotivoAjuste('')
  }

  const confirmAjuste = () => {
    if (ajusteModal) {
      actualizarStock(ajusteModal.farmaciaId, ajusteModal.medicamentoId, nuevoStock, 'setear')
      setAjusteModal(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="farmacia" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900">{farmacia?.nombre || 'Farmacia'}</h1>
        <p className="text-sm text-gray-500 mt-1">{farmacia?.direccion}
          {ultimoAcceso && <span className="text-xs text-gray-400 ml-4">Último acceso: {new Date(ultimoAcceso).toLocaleString('es-CO')}</span>}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Medicamentos en stock" value={enStock} icon={Package} colorClass="bg-green-100 text-green-600" />
          <StatCard label="Bajo mínimo" value={bajoMinimo} icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
          <StatCard label="Entregas pendientes" value={pendientes.length} icon={Clock} colorClass="bg-yellow-100 text-yellow-600" />
          <StatCard label="Entregas hoy" value={hoyCompletadas.length} icon={CheckSquare} colorClass="bg-accent/10 text-accent" />
        </div>

        {/* Accesos rápidos */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Accesos rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => navigate('/farmacia/inventario')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
              <div className="p-2 bg-amber-100 rounded-lg"><Package size={20} className="text-amber-600" /></div>
              <span className="font-medium text-gray-700">Gestionar inventario</span>
            </button>
            <button onClick={() => navigate('/farmacia/entregas')} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
              <div className="p-2 bg-green-100 rounded-lg"><CheckSquare size={20} className="text-green-600" /></div>
              <span className="font-medium text-gray-700">Confirmar entregas</span>
            </button>
            <button onClick={() => navigate('/farmacia/inventario', { state: { filtro: 'Críticos' } })} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
              <div className="p-2 bg-accent/10 rounded-lg"><AlertTriangle size={20} className="text-accent" /></div>
              <span className="font-medium text-gray-700">Ver alertas</span>
            </button>
          </div>
        </div>

        {/* Alertas de inventario */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Alertas de inventario</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {criticos.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No hay alertas de inventario</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr><th className="text-left px-4 py-3 font-medium">Medicamento</th><th className="text-left px-4 py-3 font-medium">Stock actual</th><th className="text-left px-4 py-3 font-medium">Mínimo</th><th className="text-left px-4 py-3 font-medium">Estado</th><th className="text-left px-4 py-3 font-medium">Acción</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {criticos.map((item) => (
                    <tr key={item.id} className={`${item.stock === 0 ? 'bg-red-50' : 'bg-orange-50'} hover:bg-opacity-70`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.medicamentoNombre}</td>
                      <td className="px-4 py-3"><span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.stock}</span></td>
                      <td className="px-4 py-3 text-gray-600">{item.stockMinimo}</td>
                      <td className="px-4 py-3"><Badge text={item.stock === 0 ? 'Sin stock' : 'Crítico'} variant={item.stock === 0 ? 'danger' : 'warning'} /></td>
                      <td className="px-4 py-3"><button onClick={() => handleAjustar(item)} className="text-sm text-amber-600 hover:text-amber-700 font-medium">Ajustar stock</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Entregas del día */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Entregas del día</h2>
            <Link to="/farmacia/entregas" className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1">Ver todas <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {entregas.filter((e) => e.estado === 'pendiente' || e.estado === 'lista').slice(0, 3).map((e) => (
              <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{e.pacienteNombre}</span>
                  <Badge text={e.estado} variant={e.estado === 'lista' ? 'info' : 'warning'} />
                </div>
                <p className="text-sm text-gray-600">{e.medicamentoNombre}</p>
                <p className="text-xs text-gray-400 mt-1">{e.reserva?.horaReclamacion || '-'}</p>
              </div>
            ))}
            {entregas.filter((e) => e.estado === 'pendiente' || e.estado === 'lista').length === 0 && (
              <p className="text-sm text-gray-500 col-span-3 text-center py-8">No hay entregas pendientes hoy</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={!!ajusteModal} onClose={() => setAjusteModal(null)} title="Ajustar stock" size="sm">
        {ajusteModal && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-900">{ajusteModal.medicamentoNombre}</p>
            <p className="text-xs text-gray-500">Stock actual: {ajusteModal.stock} | Mínimo: {ajusteModal.stockMinimo}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo stock</label>
              <input type="number" value={nuevoStock} onChange={(e) => setNuevoStock(Number(e.target.value))} min={0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <select value={motivoAjuste} onChange={(e) => setMotivoAjuste(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="">Seleccionar...</option>
                <option value="Conteo físico">Conteo físico</option>
                <option value="Error de sistema">Error de sistema</option>
                <option value="Devolución">Devolución</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAjusteModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
              <button onClick={confirmAjuste} className="flex-1 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg">Guardar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Dev: cambio rápido de usuario */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setDevOpen(!devOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900/80 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition-colors backdrop-blur-sm"
        >
          <GitBranch size={12} />
          Dev
        </button>
        {devOpen && (
          <div className="mt-1 bg-white rounded-xl border border-gray-200 shadow-xl p-3 w-64 max-h-72 overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Cambio rápido de usuario</p>
            {usuarios.map(u => (
              <button
                key={u.id}
                onClick={() => { devSetUser(u.id); setDevOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  u.id === usuarioActual?.id
                    ? 'bg-gray-100 font-medium text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{u.nombre.split(' ')[0]}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                  u.rol === 'paciente' ? 'bg-blue-100 text-blue-600' :
                  u.rol === 'eps' ? 'bg-green-100 text-green-600' :
                  u.rol === 'farmacia' ? 'bg-amber-100 text-amber-600' :
                  u.rol === 'proveedor' ? 'bg-red-100 text-red-600' :
                  'bg-purple-100 text-purple-600'
                }`}>{u.rol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <ChatPanel />
    </div>
  )
}
