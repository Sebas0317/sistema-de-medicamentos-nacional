import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import ToastContainer from './components/shared/ToastContainer'
import useStore from './store/useStore'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)
  const accentColor = useStore((s) => s.accentColor)
  const ejecutarNotificacionesProgramadas = useStore((s) => s.ejecutarNotificacionesProgramadas)

  const colorMap = {
    default: '#6366f1',
    blue: '#2563eb',
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626',
    purple: '#8b5cf6',
  }

  useEffect(() => {
    console.log('[App] darkMode changed:', darkMode, 'html classList:', document.documentElement.classList.toString())
    document.documentElement.classList.toggle('dark', darkMode)
    document.body.style.backgroundColor = darkMode ? '#111827' : '#f9fafb'
    document.body.style.color = darkMode ? '#f3f4f6' : '#111827'
    console.log('[App] after toggle, html classList:', document.documentElement.classList.toString())
  }, [darkMode])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', colorMap[accentColor] || colorMap.default)
  }, [accentColor])

  useEffect(() => {
    const interval = setInterval(() => {
      ejecutarNotificacionesProgramadas()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}
