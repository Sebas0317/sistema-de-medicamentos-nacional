import { Navigate, Outlet } from 'react-router-dom'
import useStore from '../../store/useStore'

const loginPaths = {
  paciente: '/paciente/login',
  eps: '/eps/login',
  farmacia: '/farmacia/login',
  proveedor: '/proveedor/login',
   admin: '/admin/login'
 }

export default function ProtectedRoute({ rol }) {
  const usuarioActual = useStore((s) => s.usuarioActual)

  if (!usuarioActual) {
    return <Navigate to={loginPaths[rol] || '/'} replace />
  }

  if (usuarioActual.rol !== rol) {
    return <Navigate to={loginPaths[usuarioActual.rol] || '/'} replace />
  }

  return <Outlet />
}
