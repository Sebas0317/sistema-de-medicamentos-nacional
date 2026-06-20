import { useEffect } from 'react'
import useStore from '../store/useStore'

export default function useInventarioAlerts() {
  const inventario = useStore((s) => s.inventario)
  const medicamentos = useStore((s) => s.medicamentos)
  const farmacias = useStore((s) => s.farmacias)
  const agregarNotificacion = useStore((s) => s.agregarNotificacion)

  useEffect(() => {
    const alreadyChecked = sessionStorage.getItem('inventarioAlertChecked')
    if (alreadyChecked) return

    const criticos = inventario.filter((i) => i.stock <= i.stockMinimo && i.stock > 0)
    const sinStock = inventario.filter((i) => i.stock === 0)

    if (criticos.length > 0 || sinStock.length > 0) {
      const totalAlertas = criticos.length + sinStock.length
      agregarNotificacion(
        `Se detectaron ${totalAlertas} alertas de inventario (${criticos.length} críticas, ${sinStock.length} sin stock)`,
        'warning'
      )

      sinStock.slice(0, 3).forEach((item) => {
        const med = medicamentos.find((m) => m.id === item.medicamentoId)
        const farm = farmacias.find((f) => f.id === item.farmaciaId)
        agregarNotificacion(
          `Sin stock: ${med ? med.nombre : ''} en ${farm ? farm.nombre : ''}`,
          'error'
        )
      })
    }

    sessionStorage.setItem('inventarioAlertChecked', 'true')
  }, [])
}
