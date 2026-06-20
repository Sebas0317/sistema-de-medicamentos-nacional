import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Eye, EyeOff, LogIn, Smartphone, Mail, KeyRound, MessageSquare, MessageCircle, CheckCircle, ChevronRight } from 'lucide-react'
import useStore from '../../store/useStore'

const canales = [
  { id: 'correo', label: 'Correo electrónico', icon: Mail, desc: 'Recibe el código en tu email' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Recibe el código por mensaje de texto' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Recibe el código por WhatsApp' },
]

export default function LoginPaciente() {
  const navigate = useNavigate()
  const login = useStore((s) => s.login)
  const generarOTP = useStore((s) => s.generarOTP)
  const loginConOTP = useStore((s) => s.loginConOTP)
  const [metodo, setMetodo] = useState('password')
  const [documento, setDocumento] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tipoDoc, setTipoDoc] = useState('CC')
  const [errors, setErrors] = useState({ documento: '', password: '' })
  const [codigo, setCodigo] = useState('')
  const [canalSeleccionado, setCanalSeleccionado] = useState(null)
  const [codigoEnviado, setCodigoEnviado] = useState(false)
  const [showEnviadoModal, setShowEnviadoModal] = useState(false)

  const validate = () => {
    const errs = { documento: '', password: '' }
    if (!documento) errs.documento = 'El documento es requerido'
    else if (!/^\d{8,10}$/.test(documento)) errs.documento = 'Mínimo 8 dígitos'
    if (metodo === 'password') {
      if (!password) errs.password = 'La contraseña es requerida'
      else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    }
    setErrors(errs)
    return !errs.documento && !errs.password
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const result = login(documento, password)
      if (result.ok) {
        navigate('/paciente/dashboard')
      } else {
        setError(result.error)
      }
      setLoading(false)
    }, 500)
  }

  const handleSeleccionarCanal = (canal) => {
    setError('')
    if (!documento || !/^\d{8,10}$/.test(documento)) {
      setError('Ingresa un documento válido (8-10 dígitos)')
      return
    }
    const result = generarOTP(documento)
    if (!result.ok) { setError(result.error); return }
    setCanalSeleccionado(canal)
    setShowEnviadoModal(true)
  }

  const handleCerrarEnviadoModal = () => {
    setShowEnviadoModal(false)
    setCodigoEnviado(true)
    setCodigo('')
  }

  const handleIngresarConCodigo = () => {
    if (!codigo) { setError('Ingresa el código recibido'); return }
    setLoading(true)
    setTimeout(() => {
      const result = loginConOTP(documento, codigo)
      if (result.ok) {
        navigate('/paciente/dashboard')
      } else {
        setError(result.error)
      }
      setLoading(false)
    }, 500)
  }

  const handleVolverACanales = () => {
    setCodigoEnviado(false)
    setCanalSeleccionado(null)
    setCodigo('')
  }

  const metodos = [
    { id: 'password', label: 'Contraseña', icon: KeyRound },
    { id: 'codigo', label: 'Código', icon: Smartphone },
  ]

  const contactoLabel = {
    correo: 'kevin****@gmail.com',
    sms: '*** *** 5678',
    whatsapp: '*** *** 5678',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Portal Paciente</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tus medicamentos y reservas</p>
        </div>

        {/* Selector de método */}
        <div className="flex gap-1 mb-4 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {metodos.map((m) => {
            const Icon = m.icon
            return (
              <button key={m.id} onClick={() => { setMetodo(m.id); setError(''); setCodigoEnviado(false); setCodigo(''); setCanalSeleccionado(null) }}
                className={`flex items-center justify-center gap-1.5 flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${metodo === m.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Icon size={16} />{m.label}
              </button>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {metodo === 'password' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                <select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-400">
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
                <input type="text" value={documento} onChange={(e) => { setDocumento(e.target.value); setErrors((p) => ({ ...p, documento: '' })) }} placeholder="1020345678"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors bg-gray-50 text-gray-900 placeholder:text-gray-400 ${errors.documento ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 focus:border-transparent`} />
                {errors.documento && <p className="mt-1 text-xs text-red-500">{errors.documento}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }} placeholder="••••••••"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors pr-10 bg-gray-50 text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 focus:border-transparent`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <LogIn size={16} />}
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>
          ) : !codigoEnviado ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
                <input type="text" value={documento} onChange={(e) => { setDocumento(e.target.value); setError('') }} placeholder="1020345678"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 text-center">¿Dónde quieres recibir el código?</p>
              <div className="space-y-2">
                {canales.map((c) => {
                  const Icon = c.icon
                  return (
                    <button key={c.id} onClick={() => handleSeleccionarCanal(c.id)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-blue-500 transition-all text-left">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{c.label}</p>
                        <p className="text-xs text-gray-500">{c.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  )
                })}
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <CheckCircle size={16} />
                Código enviado correctamente
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de verificación</label>
                <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="1234"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest bg-gray-50 text-gray-900" maxLength={6} />
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <button onClick={handleIngresarConCodigo} disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <LogIn size={16} />}
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
              <button onClick={handleVolverACanales} className="w-full text-sm text-gray-600 hover:text-gray-900 underline">
                Cambiar método de envío
              </button>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-blue-800 mb-1">Credenciales de prueba:</p>
            <p className="text-xs text-blue-700">Documento: 1020345678</p>
            <p className="text-xs text-blue-700">Contraseña: paciente123 — Código: 1234</p>
          </div>

          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-600/80">¿Olvidaste tu contraseña?</button>
          </div>
        </div>
      </div>

      {/* Modal de código enviado */}
      {showEnviadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleCerrarEnviadoModal}>
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Código enviado</h3>
            <p className="text-sm text-gray-600">
              Hemos enviado un código de verificación a{' '}
              <strong className="text-gray-900">{contactoLabel[canalSeleccionado]}</strong>
              {' '}vía {canales.find(c => c.id === canalSeleccionado)?.label.toLowerCase()}.
            </p>
            <p className="text-xs text-gray-400">El código expira en 5 minutos</p>
            <button onClick={handleCerrarEnviadoModal}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              OK, ingresar código
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
