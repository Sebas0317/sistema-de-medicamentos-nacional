import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import ToastContainer from './components/shared/ToastContainer'
import useStore from './store/useStore'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)
  const accentColor = useStore((s) => s.accentColor)

  const colorMap = {
    default: '#6366f1',
    blue: '#2563eb',
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626',
    purple: '#8b5cf6',
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', colorMap[accentColor] || colorMap.default)
  }, [accentColor])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}
