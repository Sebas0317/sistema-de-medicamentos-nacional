import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import ToastContainer from './components/shared/ToastContainer'
import useStore from './store/useStore'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}
