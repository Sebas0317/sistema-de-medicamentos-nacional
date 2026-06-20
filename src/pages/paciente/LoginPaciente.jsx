import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Eye, EyeOff, LogIn } from 'lucide-react'
import useStore from '../../store/useStore'

export default function LoginPaciente() {
  const navigate = useNavigate()
  const login = useStore((s) => s.login)
  const [documento, setDocumento] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tipoDoc, setTipoDoc] = useState('CC')
  const [errors, setErrors] = useState({ documento: '', password: '' })

  const validate = () => {
    const errs = { documento: '', password: '' }
    if (!documento) errs.documento = 'El documento es requerido'
    else if (!/^\d{8,10}$/.test(documento)) errs.documento = 'Mínimo 8 dígitos'
    if (!password) errs.password = 'La contraseña es requerida'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => { setDocumento(e.target.value); setErrors((p) => ({ ...p, documento: '' })) }}
                placeholder="1020345678"
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                  errors.documento ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-accent'
                } focus:ring-2 focus:border-transparent`}
              />
              {errors.documento && <p className="mt-1 text-xs text-red-500">{errors.documento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors pr-10 ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-accent'
                  } focus:ring-2 focus:border-transparent`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="recordar" className="rounded border-gray-300 text-accent focus:ring-accent" />
              <label htmlFor="recordar" className="text-sm text-gray-600">Recordarme</label>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <LogIn size={16} />}
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-blue-800 mb-1">Credenciales de prueba:</p>
            <p className="text-xs text-blue-700">Documento: 1020345678</p>
            <p className="text-xs text-blue-700">Contraseña: paciente123</p>
          </div>

          <div className="mt-4 text-center">
            <button className="text-sm text-accent hover:text-accent/80">¿Olvidaste tu contraseña?</button>
          </div>
        </div>
      </div>
    </div>
  )
}
