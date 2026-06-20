import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MapPin, Phone, Clock, Navigation, Building2, Pill, Hospital } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import useStore from '../../store/useStore'
import Navbar from '../../components/shared/Navbar'
import Breadcrumb from '../../components/shared/Breadcrumb'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const coloredIcon = (color) => L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const blueIcon = coloredIcon('blue')
const redIcon = coloredIcon('red')
const orangeIcon = coloredIcon('orange')
const goldIcon = coloredIcon('gold')

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const tabs = [
  { id: 'todas', label: 'Todas', icon: MapPin },
  { id: 'farmacias', label: 'Farmacias', icon: Pill },
  { id: 'centros', label: 'Centros de Salud', icon: Hospital },
]

function MapContent({ lugares, ubicacionUsuario, lugarDestino }) {
  const map = useMap()

  useEffect(() => {
    if (lugares.length === 0) {
      map.setView([ubicacionUsuario.lat, ubicacionUsuario.lng], 13)
      return
    }
    const bounds = L.latLngBounds(lugares.map((l) => [l.lat, l.lng]))
    bounds.extend([ubicacionUsuario.lat, ubicacionUsuario.lng])
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
  }, [lugares, ubicacionUsuario.lat, ubicacionUsuario.lng, map])

  return (
    <>
      <Marker position={[ubicacionUsuario.lat, ubicacionUsuario.lng]} icon={blueIcon}>
        <Popup>Tu ubicación</Popup>
      </Marker>
      {lugares.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat, l.lng]}
          icon={l.id === lugarDestino ? goldIcon : l.tipo === 'Farmacia' ? orangeIcon : redIcon}
        >
          <Popup>
            <strong>{l.nombre}</strong>
            <br />
            {l.distancia.toFixed(1)} km
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function FarmaciasCercanas() {
  const location = useLocation()
  const farmacias = useStore((s) => s.farmacias)
  const centrosSalud = useStore((s) => s.centrosSalud)
  const lugarDestino = location.state?.lugarId || null
  const tabInicial = location.state?.tab || (lugarDestino ? (farmacias.some(f => f.id === lugarDestino) ? 'farmacias' : 'todas') : 'todas')
  const [activeTab, setActiveTab] = useState(tabInicial)
  const lugarRefs = useRef({})

  const ubicacionUsuario = { lat: 4.6386, lng: -74.0868 }

  useEffect(() => {
    if (lugarDestino && lugarRefs.current[lugarDestino]) {
      setTimeout(() => {
        lugarRefs.current[lugarDestino]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [])

  const farmaciasConDistancia = farmacias.map((f) => ({
    ...f,
    tipo: 'Farmacia',
    distancia: calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, f.lat, f.lng),
  })).sort((a, b) => a.distancia - b.distancia)

  const centrosConDistancia = centrosSalud.map((c) => ({
    ...c,
    distancia: calcularDistancia(ubicacionUsuario.lat, ubicacionUsuario.lng, c.lat, c.lng),
  })).sort((a, b) => a.distancia - b.distancia)

  const todos = [...farmaciasConDistancia, ...centrosConDistancia].sort((a, b) => a.distancia - b.distancia)

  const lugares = activeTab === 'todas' ? todos : activeTab === 'farmacias' ? farmaciasConDistancia : centrosConDistancia

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar rol="paciente" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Farmacias y Centros de Salud Cercanos</h1>
        <p className="text-sm text-gray-500 mb-6">Ubicación de referencia: Chapinero, Bogotá</p>

        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border border-gray-100 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === t.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Icon size={14} />{t.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista en mapa</h2>
            <MapContainer
              center={[4.6386, -74.0868]}
              zoom={13}
              className="w-full h-80 rounded-lg z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapContent
                lugares={lugares}
                ubicacionUsuario={ubicacionUsuario}
                lugarDestino={lugarDestino}
              />
            </MapContainer>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'todas' ? 'Todos los lugares' : activeTab === 'farmacias' ? 'Farmacias' : 'Centros de Salud'}
              <span className="text-sm font-normal text-gray-500 ml-2">({lugares.length})</span>
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {lugares.map((l) => (
                <div key={l.id} ref={(el) => { lugarRefs.current[l.id] = el }} className={`bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all ${l.id === lugarDestino && activeTab !== 'todas' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${l.tipo === 'Farmacia' ? 'bg-amber-100' : 'bg-red-100'}`}>
                        {l.tipo === 'Farmacia' ? <Pill size={16} className="text-amber-600" /> : <Building2 size={16} className="text-red-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{l.nombre}</h3>
                        {l.tipo !== 'Farmacia' && <span className="text-xs text-gray-400">{l.tipo}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                      <MapPin size={10} />{l.distancia.toFixed(1)} km
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400 shrink-0" />{l.direccion}</div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400 shrink-0" />{l.telefono}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400 shrink-0" />{l.horario}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`https://www.google.com/maps/dir/${ubicacionUsuario.lat},${ubicacionUsuario.lng}/${l.lat},${l.lng}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      <Navigation size={12} />Cómo llegar
                    </a>
                    <a href={`tel:${l.telefono}`} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Phone size={12} />Llamar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
