import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Send, Building2, ChevronLeft, Clock } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import useRelativeTime from '../../hooks/useRelativeTime'

export default function MensajesProveedor() {
  const navigate = useNavigate()
  const usuarioActual = useStore((s) => s.usuarioActual)
  const farmacias = useStore((s) => s.farmacias)
  const mensajesChat = useStore((s) => s.mensajesChat)
  const enviarMensajeChat = useStore((s) => s.enviarMensajeChat)
  const { formatRelativeTime } = useRelativeTime()

  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState(null)
  const [texto, setTexto] = useState('')
  const mensajesRef = useRef(null)

  const proveedorId = usuarioActual?.entidadId || ''

  const conversaciones = useMemo(() => {
    if (!proveedorId) return []

    const farmaciaIds = new Set()
    mensajesChat.forEach((m) => {
      if (m.remitenteRol === 'farmacia' && m.destinatarioRol === 'proveedor' && m.destinatarioId === proveedorId) {
        farmaciaIds.add(m.remitenteId)
      }
      if (m.remitenteRol === 'proveedor' && m.destinatarioRol === 'farmacia' && m.remitenteId === proveedorId) {
        farmaciaIds.add(m.destinatarioId)
      }
    })

    return Array.from(farmaciaIds).map((id) => {
      const farmacia = farmacias.find((f) => f.id === id)
      const msgs = mensajesChat.filter(
        (m) =>
          (m.remitenteId === id && m.destinatarioId === proveedorId) ||
          (m.destinatarioId === id && m.remitenteId === proveedorId)
      )
      msgs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      return {
        farmaciaId: id,
        farmaciaNombre: farmacia?.nombre || id,
        ultimoMensaje: msgs[0]?.texto || '',
        ultimaFecha: msgs[0]?.fecha || null,
        totalMensajes: msgs.length,
      }
    }).sort((a, b) => {
      if (!a.ultimaFecha) return 1
      if (!b.ultimaFecha) return -1
      return new Date(b.ultimaFecha) - new Date(a.ultimaFecha)
    })
  }, [mensajesChat, farmacias, proveedorId])

  const mensajesFiltrados = useMemo(() => {
    if (!farmaciaSeleccionada || !proveedorId) return []
    const msgs = mensajesChat.filter(
      (m) =>
        (m.remitenteId === farmaciaSeleccionada && m.destinatarioId === proveedorId) ||
        (m.destinatarioId === farmaciaSeleccionada && m.remitenteId === proveedorId)
    )
    return msgs.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  }, [mensajesChat, farmaciaSeleccionada, proveedorId])

  const selectedFarmaciaNombre = farmacias.find((f) => f.id === farmaciaSeleccionada)?.nombre || ''

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
    }
  }, [mensajesFiltrados])

  const handleSend = () => {
    if (!texto.trim() || !usuarioActual || !farmaciaSeleccionada) return

    enviarMensajeChat({
      remitenteId: proveedorId,
      remitenteNombre: usuarioActual.nombre,
      remitenteRol: 'proveedor',
      destinatarioId: farmaciaSeleccionada,
      destinatarioRol: 'farmacia',
      texto: texto.trim(),
    })

    setTexto('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="proveedor" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <div className="flex items-center gap-2 mb-4">
          {farmaciaSeleccionada && (
            <button
              onClick={() => setFarmaciaSeleccionada(null)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <MessageCircle size={22} className="text-red-600" />
          <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - conversation list */}
          <div className={`lg:col-span-1 ${farmaciaSeleccionada ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" />
                  Conversaciones
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {conversaciones.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No hay conversaciones aún</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {conversaciones.map((conv) => (
                      <button
                        key={conv.farmaciaId}
                        onClick={() => setFarmaciaSeleccionada(conv.farmaciaId)}
                        className={`w-full text-left px-4 py-3 hover:bg-red-50 transition-colors ${
                          farmaciaSeleccionada === conv.farmaciaId
                            ? 'border-l-4 border-red-500 bg-red-50'
                            : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {conv.farmaciaNombre}
                          </span>
                          <span className="flex items-center gap-1">
                            {conv.totalMensajes > 0 && (
                              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {conv.totalMensajes}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">
                            {conv.ultimoMensaje || 'Sin mensajes'}
                          </p>
                          {conv.ultimaFecha && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                              <Clock size={10} />
                              {formatRelativeTime(conv.ultimaFecha)}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat panel */}
          <div className={`lg:col-span-2 ${!farmaciaSeleccionada ? 'hidden lg:block' : 'block'}`}>
            {!farmaciaSeleccionada ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
                <MessageCircle size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Selecciona una farmacia</p>
                <p className="text-sm text-gray-400 mt-1">Elige una conversación del panel izquierdo para empezar a chatear</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[650px]">
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                    <Building2 size={16} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{selectedFarmaciaNombre}</h2>
                    <p className="text-[11px] text-gray-400">
                      {mensajesFiltrados.length > 0
                        ? `último mensaje: ${formatRelativeTime(mensajesFiltrados[mensajesFiltrados.length - 1]?.fecha)}`
                        : 'Sin mensajes aún'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div ref={mensajesRef} className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[500px]">
                  {mensajesFiltrados.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageCircle size={32} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">No hay mensajes en esta conversación</p>
                      <p className="text-xs text-gray-300 mt-1">Escribe tu primer mensaje</p>
                    </div>
                  ) : (
                    mensajesFiltrados.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.remitenteRol === 'proveedor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-xl text-sm ${
                            m.remitenteRol === 'proveedor'
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span
                              className={`text-xs font-semibold ${
                                m.remitenteRol === 'proveedor' ? 'text-red-700' : 'text-blue-600'
                              }`}
                            >
                              {m.remitenteRol === 'proveedor' ? 'Tú' : m.remitenteNombre}
                            </span>
                            <span className="text-[10px] text-gray-400">{formatRelativeTime(m.fecha)}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{m.texto}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!texto.trim()}
                      className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
