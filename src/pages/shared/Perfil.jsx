import { useState } from 'react'
import { Bell, Mail, Smartphone, Clock, Edit3, Save, X, Lock, KeyRound } from 'lucide-react'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'
import Badge from '../../components/shared/Badge'
import Modal from '../../components/shared/Modal'

export default function Perfil() {
  const usuarioActual = useStore((s) => s.usuarioActual)
  const eps = useStore((s) => s.eps)
  const agregarNotificacion = useStore((s) => s.agregarNotificacion)
  const actualizarPerfil = useStore((s) => s.actualizarPerfil)
  const cambiarContrasena = useStore((s) => s.cambiarContrasena)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [recordatorioHoras, setRecordatorioHoras] = useState('24')
  const [editModal, setEditModal] = useState(false)
  const [formData, setFormData] = useState({ email: '', telefono: '' })
  const [passwordModal, setPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [passwordError, setPasswordError] = useState('')

  const openEditModal = () => {
    setFormData({
      email: usuarioActual.email || '',
      telefono: usuarioActual.telefono || ''
    })
    setEditModal(true)
  }

  if (!usuarioActual) return null

  const rol = usuarioActual.rol
  const epsPaciente = eps.find((e) => e.id === usuarioActual.epsId)

  const initials = usuarioActual.nombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const roleColors = {
    paciente: 'bg-blue-100 text-blue-600',
    eps: 'bg-green-100 text-green-600',
    farmacia: 'bg-amber-100 text-amber-600',
    proveedor: 'bg-red-100 text-red-600',
    admin: 'bg-purple-100 text-purple-600'
  }

  const handleCambiarContrasena = async () => {
    setPasswordError('')
    if (passwordForm.nueva !== passwordForm.confirmar) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    if (passwordForm.nueva.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    const result = await cambiarContrasena(usuarioActual.id, passwordForm.actual, passwordForm.nueva)
    if (result.success) {
      setPasswordModal(false)
      setPasswordForm({ actual: '', nueva: '', confirmar: '' })
      agregarNotificacion('Contraseña actualizada exitosamente', 'success')
    } else {
      setPasswordError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol={rol} />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900 mb-6">Mi perfil</h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Avatar */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${roleColors[rol] || 'bg-gray-100'} flex items-center justify-center`}>
              <span className="text-xl font-bold">{initials}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{usuarioActual.nombre}</h2>
              <Badge text={rol === 'paciente' ? 'Paciente' : usuarioActual.entidadNombre || rol} variant={rol === 'paciente' ? 'info' : rol === 'eps' ? 'success' : rol === 'farmacia' ? 'warning' : 'danger'} />
            </div>
          </div>

          {/* Información personal */}
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Información personal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nombre completo</span>
                <p className="font-medium text-gray-900 mt-0.5">{usuarioActual.nombre}</p>
              </div>
              <div>
                <span className="text-gray-500">Documento</span>
                <p className="font-medium text-gray-900 mt-0.5">{usuarioActual.documento || 'No registrado'}</p>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <p className="font-medium text-gray-900 mt-0.5">{usuarioActual.email}</p>
              </div>
              <div>
                <span className="text-gray-500">Teléfono</span>
                <p className="font-medium text-gray-900 mt-0.5">{usuarioActual.telefono || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* Información de acceso */}
          <div className="p-6 border-t border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900">Información de acceso</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Rol</span>
                <p className="font-medium text-gray-900 mt-0.5 capitalize">{usuarioActual.rol === 'eps' ? 'EPS' : usuarioActual.rol === 'farmacia' ? 'Farmacia' : usuarioActual.rol === 'proveedor' ? 'Proveedor' : 'Paciente'}</p>
              </div>
              <div>
                <span className="text-gray-500">Estado de cuenta</span>
                <p className="mt-0.5"><Badge text={usuarioActual.activo ? 'Activa' : 'Inactiva'} variant={usuarioActual.activo ? 'success' : 'danger'} /></p>
              </div>
              <div className="sm:col-span-2 flex items-center">
                <button
                  onClick={() => { setPasswordForm({ actual: '', nueva: '', confirmar: '' }); setPasswordError(''); setPasswordModal(true) }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Lock size={14} />
                  Cambiar contraseña
                </button>
              </div>
              <div>
                <span className="text-gray-500">Último acceso</span>
                <p className="font-medium text-gray-900 mt-0.5">{new Date().toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

          {/* EPS asignada (solo pacientes) */}
          {rol === 'paciente' && epsPaciente && (
            <div className="p-6 border-t border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-900">Mi EPS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nombre</span>
                  <p className="font-medium text-gray-900 mt-0.5">{epsPaciente.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-500">NIT</span>
                  <p className="font-medium text-gray-900 mt-0.5">{epsPaciente.nit}</p>
                </div>
                <div>
                  <span className="text-gray-500">Teléfono</span>
                  <p className="font-medium text-gray-900 mt-0.5">{epsPaciente.telefono}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium text-gray-900 mt-0.5">{epsPaciente.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Preferencias de notificaciones y alertas (HU-08) */}
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-gray-500" />
              <h3 className="font-semibold text-gray-900">Preferencias de notificaciones y recordatorios</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <div><p className="text-sm font-medium text-gray-900">Notificaciones por email</p><p className="text-xs text-gray-500">Alertas de reservas y autorizaciones</p></div>
                </div>
                <div onClick={() => setNotifEmail(!notifEmail)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${notifEmail ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${notifEmail ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-gray-500" />
                  <div><p className="text-sm font-medium text-gray-900">Notificaciones SMS</p><p className="text-xs text-gray-500">Recordatorios de citas y entregas</p></div>
                </div>
                <div onClick={() => setNotifSms(!notifSms)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${notifSms ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${notifSms ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <div><p className="text-sm font-medium text-gray-900">Recordatorios automáticos</p><p className="text-xs text-gray-500">Notificar antes de una cita o entrega</p></div>
                </div>
                <select value={recordatorioHoras} onChange={(e) => setRecordatorioHoras(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-gray-900 outline-none">
                  <option value="1">1 hora antes</option>
                  <option value="3">3 horas antes</option>
                  <option value="6">6 horas antes</option>
                  <option value="12">12 horas antes</option>
                  <option value="24">24 horas antes</option>
                  <option value="48">48 horas antes</option>
                </select>
              </div>
            </div>
            <button onClick={() => { agregarNotificacion('Preferencias guardadas exitosamente', 'success') }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              Guardar preferencias
            </button>
          </div>

          {/* Botón editar */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Edit3 size={16} />
              Editar perfil
            </button>
          </div>
        </div>

        <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Editar perfil" size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" value={usuarioActual.nombre} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
              <input type="text" value={usuarioActual.documento || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditModal(false)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1"><X size={16} />Cancelar</button>
              <button onClick={() => { actualizarPerfil({ email: formData.email, telefono: formData.telefono }); setEditModal(false) }} className="flex-1 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center gap-1"><Save size={16} />Guardar</button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Cambiar contraseña" size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input
                type="password"
                value={passwordForm.actual}
                onChange={(e) => setPasswordForm({ ...passwordForm, actual: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.nueva}
                onChange={(e) => setPasswordForm({ ...passwordForm, nueva: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.confirmar}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPasswordModal(false)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1"><X size={16} />Cancelar</button>
              <button onClick={handleCambiarContrasena} className="flex-1 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center gap-1"><KeyRound size={16} />Guardar</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
