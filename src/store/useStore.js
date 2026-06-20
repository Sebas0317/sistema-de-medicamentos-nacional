import { create } from 'zustand'
import mockUsuarios from '../data/mockUsuarios'
import mockMedicamentos from '../data/mockMedicamentos'
import mockInventario from '../data/mockInventario'
import mockReservas from '../data/mockReservas'
import mockAutorizaciones from '../data/mockAutorizaciones'
import mockEntregas from '../data/mockEntregas'
import mockSuministros from '../data/mockSuministros'
import mockFarmacias from '../data/mockFarmacias'
import mockEPS from '../data/mockEPS'
import mockCentrosSalud from '../data/mockCentrosSalud'

const useStore = create((set, get) => ({
  // === ESTADO INICIAL ===
  usuarioActual: null,
  medicamentos: [...mockMedicamentos],
  inventario: [...mockInventario],
  reservas: [...mockReservas],
  autorizaciones: [...mockAutorizaciones],
  entregas: [...mockEntregas],
  suministros: [...mockSuministros],
  farmacias: [...mockFarmacias],
  eps: [...mockEPS],
  centrosSalud: [...mockCentrosSalud],
  usuarios: [...mockUsuarios],
  notificaciones: [],
  auditoria: [],

  // === ACCIÓN DE AUDITORÍA ===
  registrarEvento: (accion, detalle, usuarioId) => {
    const state = get()
    const usuario = state.usuarios.find(u => u.id === usuarioId)
    const evento = {
      id: 'evt' + Date.now(),
      accion,
      detalle,
      usuarioId,
      usuarioNombre: usuario ? usuario.nombre : 'Sistema',
      usuarioRol: usuario ? usuario.rol : 'sistema',
      fecha: new Date().toISOString()
    }
    set({ auditoria: [evento, ...state.auditoria].slice(0, 500) })
  },

  // === ACCIONES DE AUTENTICACIÓN ===
  login: (emailOrDoc, password) => {
    const { usuarios } = get()
    const usuario = usuarios.find(
      u =>
        (u.email === emailOrDoc || u.documento === emailOrDoc) &&
        u.password === password &&
        u.activo === true
    )
    if (usuario) {
      set({ usuarioActual: usuario })
      get().registrarEvento('INICIO_SESION', `Usuario ${usuario.nombre} (${usuario.rol}) inició sesión`, usuario.id)
      return { ok: true, usuario }
    }
    return { ok: false, error: 'Credenciales inválidas' }
  },

  logout: () => {
    set({ usuarioActual: null })
  },

  // === ACCIONES DE NOTIFICACIONES ===
  agregarNotificacion: (mensaje, tipo = 'info') => {
    const { notificaciones } = get()
    const notif = {
      id: 'notif' + Date.now(),
      mensaje,
      tipo,
      timestamp: new Date().toISOString(),
      leida: false
    }
    set({ notificaciones: [notif, ...notificaciones].slice(0, 20) })
  },

  marcarNotificacionLeida: (id) => {
    const { notificaciones } = get()
    set({
      notificaciones: notificaciones.map(n =>
        n.id === id ? { ...n, leida: true } : n
      )
    })
  },

  limpiarNotificaciones: () => {
    set({ notificaciones: [] })
  },

  // === ACCIONES DE RESERVAS ===
  crearReserva: (datos) => {
    const state = get()
    const { pacienteId, medicamentoId, farmaciaId, fechaReclamacion, horaReclamacion, notas, esADomicilio, direccion } = datos

    // Verificar stock
    const inventarioItem = state.inventario.find(
      i => i.farmaciaId === farmaciaId && i.medicamentoId === medicamentoId
    )
    if (!inventarioItem || inventarioItem.stock === 0) {
      return { ok: false, error: 'Sin stock disponible en esta farmacia' }
    }

    const medicamento = state.medicamentos.find(m => m.id === medicamentoId)
    const reservaId = 'res' + Date.now()
    let autorizacionId = null
    let estadoReserva = 'pendiente'
    let nuevasAutorizaciones = [...state.autorizaciones]
    let nuevasEntregas = [...state.entregas]

    // Si requiere autorización, crear automáticamente
    if (medicamento && medicamento.requiereAutorizacion) {
      const paciente = state.usuarios.find(u => u.id === pacienteId)
      const authId = 'auth' + Date.now()
      autorizacionId = authId
      const nuevaAuth = {
        id: authId,
        reservaId,
        pacienteId,
        medicamentoId,
        epsId: paciente ? paciente.epsId : 'eps1',
        estado: 'pendiente',
        motivoRechazo: '',
        cobertura: 'Pendiente',
        observaciones: 'Autorización generada automáticamente al crear la reserva.',
        fechaSolicitud: new Date().toISOString(),
        fechaRespuesta: null
      }
      nuevasAutorizaciones = [...nuevasAutorizaciones, nuevaAuth]
    } else {
      // Si no requiere autorización, confirmar inmediatamente
      estadoReserva = 'confirmada'
      const entregaId = 'ent' + Date.now()
      const nuevaEntrega = {
        id: entregaId,
        reservaId,
        farmaciaId,
        pacienteId,
        medicamentoId,
        estado: 'pendiente',
        fechaAsignacion: new Date().toISOString(),
        fechaEntrega: null,
        esADomicilio: esADomicilio || false,
        direccion: esADomicilio ? direccion : '',
        firmaDigital: ''
      }
      nuevasEntregas = [...nuevasEntregas, nuevaEntrega]
    }

    const nuevaReserva = {
      id: reservaId,
      pacienteId,
      medicamentoId,
      farmaciaId,
      fechaCreacion: new Date().toISOString(),
      fechaReclamacion,
      horaReclamacion,
      notas: notas || '',
      estado: estadoReserva,
      requiereAutorizacion: medicamento ? medicamento.requiereAutorizacion : false,
      autorizacionId,
      esADomicilio: esADomicilio || false,
      direccion: esADomicilio ? direccion : ''
    }

    set({
      reservas: [...state.reservas, nuevaReserva],
      autorizaciones: nuevasAutorizaciones,
      entregas: nuevasEntregas
    })

    get().agregarNotificacion(
      `Reserva creada para ${medicamento ? medicamento.nombre : 'medicamento'}`,
      'success'
    )
    get().registrarEvento('CREAR_RESERVA', `Reserva creada para ${medicamento ? medicamento.nombre : ''} en ${state.farmacias.find(f => f.id === farmaciaId)?.nombre || ''}`, pacienteId)

    return { ok: true, reserva: nuevaReserva }
  },

  cancelarReserva: (reservaId) => {
    const state = get()
    const reserva = state.reservas.find(r => r.id === reservaId)
    if (!reserva) return

    let nuevasAutorizaciones = [...state.autorizaciones]
    let nuevasEntregas = [...state.entregas]

    if (reserva.autorizacionId) {
      nuevasAutorizaciones = nuevasAutorizaciones.map(a =>
        a.id === reserva.autorizacionId
          ? { ...a, estado: 'cancelada' }
          : a
      )
    }

    nuevasEntregas = nuevasEntregas.map(e =>
      e.reservaId === reservaId
        ? { ...e, estado: 'fallida' }
        : e
    )

    set({
      reservas: state.reservas.map(r =>
        r.id === reservaId ? { ...r, estado: 'cancelada' } : r
      ),
      autorizaciones: nuevasAutorizaciones,
      entregas: nuevasEntregas
    })

    get().agregarNotificacion(
      `Reserva #${reservaId.slice(0, 6)} cancelada`,
      'warning'
    )
    get().registrarEvento('CANCELAR_RESERVA', `Reserva ${reservaId} cancelada por el usuario`, reserva.pacienteId)
  },

  // === ACCIONES DE AUTORIZACIONES ===
  aprobarAutorizacion: (autorizacionId) => {
    const state = get()
    const auth = state.autorizaciones.find(a => a.id === autorizacionId)
    if (!auth) return

    const nuevasEntregas = [...state.entregas]
    let nuevasReservas = [...state.reservas]

    const entregaId = 'ent' + Date.now()
    const nuevaEntrega = {
      id: entregaId,
      reservaId: auth.reservaId,
      farmaciaId: '',
      pacienteId: auth.pacienteId,
      medicamentoId: auth.medicamentoId,
      estado: 'pendiente',
      fechaAsignacion: new Date().toISOString(),
      fechaEntrega: null,
      esADomicilio: false,
      direccion: '',
      firmaDigital: ''
    }

    // Si hay reserva relacionada, actualizar estado y farmacia
    if (auth.reservaId) {
      const reserva = state.reservas.find(r => r.id === auth.reservaId)
      if (reserva) {
        nuevaEntrega.farmaciaId = reserva.farmaciaId
        nuevaEntrega.esADomicilio = reserva.esADomicilio || false
        nuevaEntrega.direccion = reserva.direccion || ''
        nuevasReservas = nuevasReservas.map(r =>
          r.id === auth.reservaId ? { ...r, estado: 'confirmada' } : r
        )
      }
    }
    nuevasEntregas.push(nuevaEntrega)

    set({
      autorizaciones: state.autorizaciones.map(a =>
        a.id === autorizacionId
          ? { ...a, estado: 'aprobada', fechaRespuesta: new Date().toISOString() }
          : a
      ),
      reservas: nuevasReservas,
      entregas: nuevasEntregas
    })

    get().agregarNotificacion(
      `Autorización ${autorizacionId.slice(0, 6)} aprobada exitosamente`,
      'success'
    )
    get().registrarEvento('APROBAR_AUTORIZACION', `Autorización ${autorizacionId} aprobada para ${auth.pacienteId}`, state.usuarioActual?.id || '')
  },

  rechazarAutorizacion: (autorizacionId, motivo) => {
    const state = get()
    const auth = state.autorizaciones.find(a => a.id === autorizacionId)
    if (!auth) return

    let nuevasReservas = [...state.reservas]
    if (auth.reservaId) {
      nuevasReservas = nuevasReservas.map(r =>
        r.id === auth.reservaId ? { ...r, estado: 'cancelada' } : r
      )
    }

    set({
      autorizaciones: state.autorizaciones.map(a =>
        a.id === autorizacionId
          ? { ...a, estado: 'rechazada', motivoRechazo: motivo, fechaRespuesta: new Date().toISOString() }
          : a
      ),
      reservas: nuevasReservas
    })

    get().agregarNotificacion(
      `Autorización ${autorizacionId.slice(0, 6)} rechazada`,
      'error'
    )
    get().registrarEvento('RECHAZAR_AUTORIZACION', `Autorización ${autorizacionId} rechazada: ${motivo}`, state.usuarioActual?.id || '')
  },

  // === ACCIÓN GENÉRICA DE AUTORIZACIONES (requerida por especificación) ===
  actualizarEstadoAutorizacion: (id, estado, motivo) => {
    if (estado === 'aprobada') {
      get().aprobarAutorizacion(id)
    } else if (estado === 'rechazada') {
      get().rechazarAutorizacion(id, motivo || '')
    }
  },

  // === ACCIONES DE INVENTARIO ===
  actualizarStock: (farmaciaId, medicamentoId, cantidad, operacion) => {
    const state = get()
    let nuevoInventario = [...state.inventario]

    nuevoInventario = nuevoInventario.map(item => {
      if (item.farmaciaId === farmaciaId && item.medicamentoId === medicamentoId) {
        let nuevoStock = item.stock
        if (operacion === 'sumar') nuevoStock += cantidad
        else if (operacion === 'restar') nuevoStock = Math.max(0, item.stock - cantidad)
        else if (operacion === 'setear') nuevoStock = cantidad

        return { ...item, stock: nuevoStock, ultimaActualizacion: new Date().toISOString() }
      }
      return item
    })

    set({ inventario: nuevoInventario })

    // Verificar stock crítico
    const updated = nuevoInventario.find(
      i => i.farmaciaId === farmaciaId && i.medicamentoId === medicamentoId
    )
    if (updated && updated.stock <= updated.stockMinimo) {
      const medicamento = state.medicamentos.find(m => m.id === medicamentoId)
      const farmacia = state.farmacias.find(f => f.id === farmaciaId)
      get().agregarNotificacion(
        `Stock crítico: ${medicamento ? medicamento.nombre : ''} en ${farmacia ? farmacia.nombre : ''} (${updated.stock} unidades)`,
        'warning'
      )
    }
  },

  // === ACCIONES DE ENTREGAS ===
  confirmarEntrega: (entregaId, firmaDigital) => {
    const state = get()
    const entrega = state.entregas.find(e => e.id === entregaId)
    if (!entrega) return null

    const nuevasEntregas = state.entregas.map(e =>
      e.id === entregaId
        ? { ...e, estado: 'entregada', firmaDigital, fechaEntrega: new Date().toISOString() }
        : e
    )

    const nuevasReservas = state.reservas.map(r =>
      r.id === entrega.reservaId ? { ...r, estado: 'entregada' } : r
    )

    const entregaActualizada = nuevasEntregas.find(e => e.id === entregaId)

    set({ entregas: nuevasEntregas, reservas: nuevasReservas })

    // Descontar stock
    if (entrega.medicamentoId && entrega.farmaciaId) {
      get().actualizarStock(entrega.farmaciaId, entrega.medicamentoId, 1, 'restar')
    }

    get().agregarNotificacion(
      `Entrega ${entregaId.slice(0, 6)} confirmada exitosamente`,
      'success'
    )
    get().registrarEvento('CONFIRMAR_ENTREGA', `Entrega ${entregaId} confirmada para ${entrega.pacienteId}`, state.usuarioActual?.id || '')

    return entregaActualizada
  },

  marcarEntregaLista: (entregaId) => {
    const state = get()
    set({
      entregas: state.entregas.map(e =>
        e.id === entregaId ? { ...e, estado: 'lista' } : e
      )
    })
    get().agregarNotificacion(
      `Entrega ${entregaId.slice(0, 6)} marcada como lista`,
      'info'
    )
  },

  // === ACCIONES DE SUMINISTROS ===
  registrarSuministro: (datos) => {
    const state = get()
    const sumId = 'sum' + Date.now()

    const nuevoSuministro = {
      id: sumId,
      proveedorId: datos.proveedorId,
      farmaciaId: datos.farmaciaId,
      medicamentoId: datos.medicamentoId,
      cantidad: datos.cantidad,
      numeroLote: datos.numeroLote,
      fechaVencimiento: datos.fechaVencimiento,
      fechaRegistro: new Date().toISOString(),
      estado: 'entregado',
      observaciones: datos.observaciones || '',
      condicionesTransporte: datos.condicionesTransporte || ''
    }

    set({ suministros: [...state.suministros, nuevoSuministro] })

    // Sumar al stock
    get().actualizarStock(datos.farmaciaId, datos.medicamentoId, datos.cantidad, 'sumar')

    get().agregarNotificacion(
      `Suministro registrado: ${datos.cantidad} unidades del lote ${datos.numeroLote}`,
      'success'
    )
    get().registrarEvento('REGISTRAR_SUMINISTRO', `Suministro: ${datos.cantidad} unidades de lote ${datos.numeroLote} a farmacia ${datos.farmaciaId}`, datos.proveedorId)

    return { ok: true, suministro: nuevoSuministro }
  },

  // === SELECTORES ===
  getInventarioPorFarmacia: (farmaciaId) => {
    const state = get()
    return state.inventario
      .filter(i => i.farmaciaId === farmaciaId)
      .map(item => {
        const med = state.medicamentos.find(m => m.id === item.medicamentoId)
        return { ...item, medicamentoNombre: med ? med.nombre : '', medicamento: med || null }
      })
  },

  getReservasPorPaciente: (pacienteId) => {
    const state = get()
    return state.reservas
      .filter(r => r.pacienteId === pacienteId)
      .map(r => {
        const med = state.medicamentos.find(m => m.id === r.medicamentoId)
        const farm = state.farmacias.find(f => f.id === r.farmaciaId)
        const auth = r.autorizacionId
          ? state.autorizaciones.find(a => a.id === r.autorizacionId)
          : null
        return {
          ...r,
          medicamentoNombre: med ? med.nombre : '',
          medicamento: med || null,
          farmaciaNombre: farm ? farm.nombre : '',
          farmacia: farm || null,
          autorizacion: auth || null
        }
      })
  },

  getAutorizacionesPorEPS: (epsId) => {
    const state = get()
    return state.autorizaciones
      .filter(a => a.epsId === epsId)
      .map(a => {
        const paciente = state.usuarios.find(u => u.id === a.pacienteId)
        const medicamento = state.medicamentos.find(m => m.id === a.medicamentoId)
        return {
          ...a,
          pacienteNombre: paciente ? paciente.nombre : '',
          pacienteDocumento: paciente ? paciente.documento : '',
          medicamentoNombre: medicamento ? medicamento.nombre : '',
          medicamento: medicamento || null
        }
      })
  },

  getEntregasPorFarmacia: (farmaciaId) => {
    const state = get()
    return state.entregas
      .filter(e => e.farmaciaId === farmaciaId)
      .map(e => {
        const paciente = state.usuarios.find(u => u.id === e.pacienteId)
        const medicamento = state.medicamentos.find(m => m.id === e.medicamentoId)
        const reserva = state.reservas.find(r => r.id === e.reservaId)
        return {
          ...e,
          pacienteNombre: paciente ? paciente.nombre : '',
          pacienteDocumento: paciente ? paciente.documento : '',
          medicamentoNombre: medicamento ? medicamento.nombre : '',
          medicamento: medicamento || null,
          reserva: reserva || null
        }
      })
  },

  getMedicamentosCriticos: () => {
    const state = get()
    return state.inventario
      .filter(i => i.stock <= i.stockMinimo)
      .map(item => {
        const med = state.medicamentos.find(m => m.id === item.medicamentoId)
        const farm = state.farmacias.find(f => f.id === item.farmaciaId)
        return {
          ...item,
          medicamentoNombre: med ? med.nombre : '',
          medicamento: med || null,
          farmaciaNombre: farm ? farm.nombre : '',
          farmacia: farm || null
        }
      })
  },

  getEventosAuditoria: (filtros = {}) => {
    const state = get()
    let eventos = [...state.auditoria]
    if (filtros.accion) eventos = eventos.filter(e => e.accion === filtros.accion)
    if (filtros.rol) eventos = eventos.filter(e => e.usuarioRol === filtros.rol)
    if (filtros.desde) eventos = eventos.filter(e => e.fecha >= filtros.desde)
    if (filtros.hasta) eventos = eventos.filter(e => e.fecha <= filtros.hasta)
    return eventos
  },

  getStatsGenerales: () => {
    const state = get()
    return {
      totalReservas: state.reservas.length,
      reservasPendientes: state.reservas.filter(r => r.estado === 'pendiente').length,
      autorizacionesPendientes: state.autorizaciones.filter(a => a.estado === 'pendiente').length,
      medicamentosCriticos: state.inventario.filter(i => i.stock <= i.stockMinimo).length,
      entregasHoy: state.entregas.filter(e => {
        if (!e.fechaEntrega) return false
        const hoy = new Date().toISOString().split('T')[0]
        return e.fechaEntrega.startsWith(hoy)
      }).length
    }
  },

  getReservasPorFarmaciaId: (farmaciaId) => {
    const state = get()
    return state.reservas.filter(r => r.farmaciaId === farmaciaId)
  },

  getSuministrosPorProveedor: (proveedorId) => {
    const state = get()
    return state.suministros
      .filter(s => s.proveedorId === proveedorId)
      .map(s => {
        const farm = state.farmacias.find(f => f.id === s.farmaciaId)
        const med = state.medicamentos.find(m => m.id === s.medicamentoId)
        return {
          ...s,
          farmaciaNombre: farm ? farm.nombre : '',
          medicamentoNombre: med ? med.nombre : ''
        }
      })
  }
}))

export default useStore
