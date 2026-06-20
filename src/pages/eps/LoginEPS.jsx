import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, LogIn } from 'lucide-react'
import useStore from '../../store/useStore'

export default function LoginEPS() {
  const navigate = useNavigate()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validate = () => {
    const errs = { email: '', password: '' }
    if (!email) errs.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido'
    if (!password) errs.password = 'La contraseña es requerida'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    setErrors(errs)
    return !errs.email && !errs.password
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      if (result.ok && result.usuario.rol === 'eps') {
        navigate('/eps/dashboard')
      } else {
        setError('Credenciales inválidas o no tienes permisos de EPS')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <Building2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Portal EPS</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de autorizaciones y cobertura</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }} placeholder="eps@sanitas.com" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-green-500`} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }} placeholder="••••••••" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none pr-10 ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-green-500`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={16} /></button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <LogIn size={16} />}
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs font-medium text-green-800">Credenciales de prueba:</p>
            <p className="text-xs text-green-700">Email: eps@sanitas.com</p>
            <p className="text-xs text-green-700">Contraseña: eps123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
