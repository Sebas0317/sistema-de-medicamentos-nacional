import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-200 select-none">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Página no encontrada</h2>
        <p className="text-gray-500 mt-2">La ruta que buscas no existe en el sistema.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Home size={18} />
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
