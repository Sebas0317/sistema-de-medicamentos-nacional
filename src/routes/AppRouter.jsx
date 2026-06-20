import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/shared/ProtectedRoute'
import LandingPage from '../pages/LandingPage'
import NotFound from '../pages/NotFound'
import LoginPaciente from '../pages/paciente/LoginPaciente'
import DashboardPaciente from '../pages/paciente/DashboardPaciente'
import BuscarMedicamento from '../pages/paciente/BuscarMedicamento'
import MisReservas from '../pages/paciente/MisReservas'
import MisCitas from '../pages/paciente/MisCitas'
import FarmaciasCercanas from '../pages/paciente/FarmaciasCercanas'
import LoginEPS from '../pages/eps/LoginEPS'
import DashboardEPS from '../pages/eps/DashboardEPS'
import SolicitudesPendientes from '../pages/eps/SolicitudesPendientes'
import HistorialAutorizaciones from '../pages/eps/HistorialAutorizaciones'
import LoginFarmacia from '../pages/farmacia/LoginFarmacia'
import DashboardFarmacia from '../pages/farmacia/DashboardFarmacia'
import GestionInventario from '../pages/farmacia/GestionInventario'
import ConfirmarEntregas from '../pages/farmacia/ConfirmarEntregas'
import LoginProveedor from '../pages/proveedor/LoginProveedor'
import DashboardProveedor from '../pages/proveedor/DashboardProveedor'
import AlertasStock from '../pages/proveedor/AlertasStock'
import RegistrarSuministro from '../pages/proveedor/RegistrarSuministro'
import Perfil from '../pages/shared/Perfil'
import LoginAdmin from '../pages/admin/LoginAdmin'
import DashboardAdmin from '../pages/admin/DashboardAdmin'
import ReportesAdmin from '../pages/admin/ReportesAdmin'
import AuditoriaAdmin from '../pages/admin/AuditoriaAdmin'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/paciente/login" element={<LoginPaciente />} />
      <Route path="/eps/login" element={<LoginEPS />} />
      <Route path="/farmacia/login" element={<LoginFarmacia />} />
      <Route path="/proveedor/login" element={<LoginProveedor />} />

      {/* Panel Paciente */}
      <Route
        path="/paciente"
        element={<ProtectedRoute rol="paciente" />}
      >
        <Route path="dashboard" element={<DashboardPaciente />} />
        <Route path="buscar" element={<BuscarMedicamento />} />
        <Route path="reservas" element={<MisReservas />} />
        <Route path="citas" element={<MisCitas />} />
         <Route path="farmacias" element={<FarmaciasCercanas />} />
         <Route path="perfil" element={<Perfil />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Panel EPS */}
      <Route
        path="/eps"
        element={<ProtectedRoute rol="eps" />}
      >
        <Route path="dashboard" element={<DashboardEPS />} />
        <Route path="solicitudes" element={<SolicitudesPendientes />} />
        <Route path="historial" element={<HistorialAutorizaciones />} />
        <Route path="perfil" element={<Perfil />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Panel Farmacia */}
      <Route
        path="/farmacia"
        element={<ProtectedRoute rol="farmacia" />}
      >
        <Route path="dashboard" element={<DashboardFarmacia />} />
        <Route path="inventario" element={<GestionInventario />} />
        <Route path="entregas" element={<ConfirmarEntregas />} />
        <Route path="perfil" element={<Perfil />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Panel Proveedor */}
      <Route
        path="/proveedor"
        element={<ProtectedRoute rol="proveedor" />}
      >
        <Route path="dashboard" element={<DashboardProveedor />} />
        <Route path="alertas" element={<AlertasStock />} />
        <Route path="suministro" element={<RegistrarSuministro />} />
        <Route path="perfil" element={<Perfil />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Panel Admin */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={<ProtectedRoute rol="admin" />}
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="reportes" element={<ReportesAdmin />} />
        <Route path="auditoria" element={<AuditoriaAdmin />} />
        <Route path="perfil" element={<Perfil />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
