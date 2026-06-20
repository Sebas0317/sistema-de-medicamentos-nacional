import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import useStore from '../../store/useStore'
import useRelativeTime from '../../hooks/useRelativeTime'

export default function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const usuarioActual = useStore((s) => s.usuarioActual)
  const mensajesChat = useStore((s) => s.mensajesChat)
  const enviarMensajeChat = useStore((s) => s.enviarMensajeChat)
  const { formatRelativeTime } = useRelativeTime()

  const rol = usuarioActual?.rol
  const entidadId = usuarioActual?.entidadId

  const mensajesFiltrados = mensajesChat.filter((m) => {
    const esFarmaciaProveedor =
      (m.remitenteRol === 'farmacia' && m.destinatarioRol === 'proveedor') ||
      (m.remitenteRol === 'proveedor' && m.destinatarioRol === 'farmacia')

    if (!esFarmaciaProveedor) return false

    if (rol === 'farmacia') {
      return m.remitenteId === entidadId || m.destinatarioId === entidadId
    }

    if (rol === 'proveedor') {
      return m.remitenteId === entidadId || m.destinatarioId === entidadId
    }

    return true
  })

  const handleSend = () => {
    if (!texto.trim() || !usuarioActual) return

    const remitenteId = entidadId
    const remitenteNombre = usuarioActual.nombre
    const remitenteRol = rol

    let destinatarioId, destinatarioRol
    if (rol === 'farmacia') {
      destinatarioRol = 'proveedor'
      destinatarioId = 'prov1'
    } else if (rol === 'proveedor') {
      destinatarioRol = 'farmacia'
      destinatarioId = 'farm1'
    } else {
      return
    }

    enviarMensajeChat({
      remitenteId,
      remitenteNombre,
      remitenteRol,
      destinatarioId,
      destinatarioRol,
      texto: texto.trim(),
    })

    setTexto('')
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px] h-[400px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 bg-amber-600 text-white">
            <span className="font-semibold text-sm">Mensajes</span>
            <button onClick={() => setOpen(false)} className="hover:bg-amber-500 rounded-lg p-1 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {mensajesFiltrados.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-8">No hay mensajes</p>
            ) : (
              mensajesFiltrados.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg text-sm ${
                    m.remitenteRol === 'farmacia'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        m.remitenteRol === 'farmacia' ? 'text-amber-700' : 'text-red-700'
                      }`}
                    >
                      {m.remitenteNombre}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatRelativeTime(m.fecha)}
                    </span>
                  </div>
                  <p className="text-gray-700">{m.texto}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 p-3 flex items-center gap-2">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!texto.trim()}
              className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
