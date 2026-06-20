import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react'
import useStore from '../../store/useStore'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Todos los campos son requeridos'); return }
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = login(email, password)
      if (result.ok && result.usuario.rol === 'admin') {
        navigate('/admin/dashboard')
      } else {
        setError('Credenciales inválidas o no tienes permisos de administrador')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-2xl mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Portal Administrador</h1>
          <p className="text-gray-400 text-sm mt-1">Monitoreo y control del sistema</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@snsdm.gov.co" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10 focus:ring-2 focus:ring-gray-900 outline-none" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={16} /></button>
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <LogIn size={16} />}
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-800">Credenciales de prueba:</p>
            <p className="text-xs text-gray-600">Email: admin@snsdm.gov.co</p>
            <p className="text-xs text-gray-600">Contraseña: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
