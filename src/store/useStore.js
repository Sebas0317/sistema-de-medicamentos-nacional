import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
import mockCitasMedicas from '../data/mockCitasMedicas'
import mockFormulasMedicas from '../data/mockFormulasMedicas'

const useStore = create(persist((set, get) => ({
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
  citasMedicas: [...mockCitasMedicas],
  formulasMedicas: [...mockFormulasMedicas],
  usuarios: [...mockUsuarios],
  notificaciones: [],
    auditoria: [],
  movimientosInventario: [],
  darkMode: false,
  mensajesChat: [],
  favoritos: [],
  ultimoAcceso: null,
  accentColor: 'default',

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
      set({ usuarioActual: usuario, ultimoAcceso: new Date().toISOString() })
      get().registrarEvento('INICIO_SESION', `Usuario ${usuario.nombre} (${usuario.rol}) inició sesión`, usuario.id)
      return { ok: true, usuario }
    }
    return { ok: false, error: 'Credenciales inválidas' }
  },

  logout: () => {
    set({ usuarioActual: null })
  },

  setUltimoAcceso: () => {
    set({ ultimoAcceso: new Date().toISOString() })
  },

  setAccentColor: (color) => {
    set({ accentColor: color })
  },

  devSetUser: (userId) => {
    const state = get()
    const usuario = state.usuarios.find(u => u.id === userId)
    if (usuario) set({ usuarioActual: usuario })
  },

  actualizarPerfil: (datos) => {
    const state = get()
    const usuario = state.usuarioActual
    if (!usuario) return

    const usuarioActualizado = { ...usuario, ...datos }

    set({
      usuarioActual: usuarioActualizado,
      usuarios: state.usuarios.map(u =>
        u.id === usuario.id ? usuarioActualizado : u
      )
    })

    get().agregarNotificacion('Perfil actualizado exitosamente', 'success')
    get().registrarEvento('ACTUALIZAR_PERFIL', `Usuario ${usuario.nombre} actualizó su perfil`, usuario.id)
  },

  toggleFavorito: (farmaciaId) => {
    const state = get()
    const favs = state.favoritos
    if (favs.includes(farmaciaId)) {
      set({ favoritos: favs.filter(f => f !== farmaciaId) })
    } else {
      set({ favoritos: [...favs, farmaciaId] })
    }
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
      entregas: nuevasEntregas,
      notificaciones: [{
        id: Date.now(),
        mensaje: `Reserva #${reservaId.slice(0, 6)} cancelada`,
        tipo: 'warning',
        leida: false,
        fecha: new Date().toISOString()
      }, ...state.notificaciones],
      auditoria: [{
        id: 'evt' + Date.now(),
        accion: 'CANCELAR_RESERVA',
        detalle: `Reserva ${reservaId} cancelada por el usuario`,
        usuarioId: reserva.pacienteId,
        usuarioNombre: state.usuarios.find(u => u.id === reserva.pacienteId)?.nombre || '',
        usuarioRol: 'paciente',
        fecha: new Date().toISOString()
      }, ...state.auditoria]
    })
  },

  // === ACCIONES DE AUTORIZACIONES ===
  aprobarAutorizacion: (autorizacionId) => {
    const state = get()
    const auth = state.autorizaciones.find(a => a.id === autorizacionId)
    if (!auth) return

    let nuevasFormulas = [...state.formulasMedicas]
    const nuevasEntregas = [...state.entregas]
    let nuevasReservas = [...state.reservas]

    // Si es extensión de fórmula, actualizar fórmula
    if (auth.tipo === 'extension_formula' && auth.formulaId) {
      const formula = state.formulasMedicas.find(f => f.id === auth.formulaId)
      if (formula) {
        const nuevaFecha = new Date()
        nuevaFecha.setDate(nuevaFecha.getDate() + 90)
        nuevasFormulas = nuevasFormulas.map(f =>
          f.id === auth.formulaId
            ? { ...f, estado: 'activa', fechaVencimiento: nuevaFecha.toISOString().split('T')[0] }
            : f
        )
      }
    } else {
      // Flujo normal de autorización de reserva
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
    }

    set({
      autorizaciones: state.autorizaciones.map(a =>
        a.id === autorizacionId
          ? { ...a, estado: 'aprobada', fechaRespuesta: new Date().toISOString() }
          : a
      ),
      reservas: nuevasReservas,
      entregas: nuevasEntregas,
      formulasMedicas: nuevasFormulas,
      notificaciones: [{
        id: 'notif' + Date.now(),
        mensaje: `Autorización ${autorizacionId.slice(0, 6)} aprobada exitosamente`,
        tipo: 'success',
        timestamp: new Date().toISOString(),
        leida: false
      }, ...state.notificaciones],
      auditoria: [{
        id: 'evt' + Date.now(),
        accion: 'APROBAR_AUTORIZACION',
        detalle: `Autorización ${autorizacionId} aprobada para ${auth.pacienteId}`,
        usuarioId: state.usuarioActual?.id || '',
        usuarioNombre: state.usuarioActual?.nombre || '',
        usuarioRol: state.usuarioActual?.rol || 'eps',
        fecha: new Date().toISOString()
      }, ...state.auditoria]
    })
  },

  rechazarAutorizacion: (autorizacionId, motivo) => {
    const state = get()
    const auth = state.autorizaciones.find(a => a.id === autorizacionId)
    if (!auth) return

    let nuevasFormulas = [...state.formulasMedicas]
    let nuevasReservas = [...state.reservas]

    if (auth.tipo === 'extension_formula' && auth.formulaId) {
      nuevasFormulas = nuevasFormulas.map(f =>
        f.id === auth.formulaId ? { ...f, estado: 'vencida' } : f
      )
    }

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
      formulasMedicas: nuevasFormulas,
      reservas: nuevasReservas,
      notificaciones: [{
        id: 'notif' + Date.now(),
        mensaje: `Autorización ${autorizacionId.slice(0, 6)} rechazada`,
        tipo: 'error',
        timestamp: new Date().toISOString(),
        leida: false
      }, ...state.notificaciones],
      auditoria: [{
        id: 'evt' + Date.now(),
        accion: 'RECHAZAR_AUTORIZACION',
        detalle: `Autorización ${autorizacionId} rechazada: ${motivo}`,
        usuarioId: state.usuarioActual?.id || '',
        usuarioNombre: state.usuarioActual?.nombre || '',
        usuarioRol: state.usuarioActual?.rol || 'eps',
        fecha: new Date().toISOString()
      }, ...state.auditoria]
    })
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
    let movimiento = null

    nuevoInventario = nuevoInventario.map(item => {
      if (item.farmaciaId === farmaciaId && item.medicamentoId === medicamentoId) {
        let nuevoStock = item.stock
        if (operacion === 'sumar') nuevoStock += cantidad
        else if (operacion === 'restar') nuevoStock = Math.max(0, item.stock - cantidad)
        else if (operacion === 'setear') nuevoStock = cantidad

        const diferencia = nuevoStock - item.stock
        movimiento = {
          id: 'mov' + Date.now(),
          farmaciaId,
          medicamentoId,
          tipo: diferencia > 0 ? 'entrada' : 'salida',
          cantidad: Math.abs(diferencia),
          stockAnterior: item.stock,
          stockNuevo: nuevoStock,
          fecha: new Date().toISOString()
        }

        return { ...item, stock: nuevoStock, ultimaActualizacion: new Date().toISOString() }
      }
      return item
    })

    const updated = nuevoInventario.find(
      i => i.farmaciaId === farmaciaId && i.medicamentoId === medicamentoId
    )

    let notif = null
    if (updated && updated.stock <= updated.stockMinimo) {
      const medicamento = state.medicamentos.find(m => m.id === medicamentoId)
      const farmacia = state.farmacias.find(f => f.id === farmaciaId)
      notif = {
        id: 'notif' + Date.now(),
        mensaje: `Stock crítico: ${medicamento ? medicamento.nombre : ''} en ${farmacia ? farmacia.nombre : ''} (${updated.stock} unidades)`,
        tipo: 'warning',
        timestamp: new Date().toISOString(),
        leida: false
      }
    }

    set({
      inventario: nuevoInventario,
      movimientosInventario: movimiento
        ? [movimiento, ...state.movimientosInventario].slice(0, 200)
        : state.movimientosInventario,
      notificaciones: notif
        ? [notif, ...state.notificaciones].slice(0, 20)
        : state.notificaciones
    })
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

    // Descontar stock inline
    let nuevoInventario = [...state.inventario]
    let movimientos = [...state.movimientosInventario]
    if (entrega.medicamentoId && entrega.farmaciaId) {
      nuevoInventario = nuevoInventario.map(item => {
        if (item.farmaciaId === entrega.farmaciaId && item.medicamentoId === entrega.medicamentoId) {
          const nuevoStock = Math.max(0, item.stock - 1)
          const movimiento = {
            id: 'mov' + Date.now(),
            farmaciaId: entrega.farmaciaId,
            medicamentoId: entrega.medicamentoId,
            tipo: 'salida',
            cantidad: 1,
            stockAnterior: item.stock,
            stockNuevo: nuevoStock,
            fecha: new Date().toISOString()
          }
          movimientos = [movimiento, ...movimientos].slice(0, 200)
          return { ...item, stock: nuevoStock, ultimaActualizacion: new Date().toISOString() }
        }
        return item
      })
    }

    const updated = nuevoInventario.find(
      i => i.farmaciaId === entrega.farmaciaId && i.medicamentoId === entrega.medicamentoId
    )
    let notifStock = null
    if (updated && updated.stock <= updated.stockMinimo) {
      const medicamento = state.medicamentos.find(m => m.id === entrega.medicamentoId)
      const farmacia = state.farmacias.find(f => f.id === entrega.farmaciaId)
      notifStock = {
        id: 'notif' + Date.now(),
        mensaje: `Stock crítico: ${medicamento ? medicamento.nombre : ''} en ${farmacia ? farmacia.nombre : ''} (${updated.stock} unidades)`,
        tipo: 'warning',
        timestamp: new Date().toISOString(),
        leida: false
      }
    }

    set({
      entregas: nuevasEntregas,
      reservas: nuevasReservas,
      inventario: nuevoInventario,
      movimientosInventario: movimientos,
      notificaciones: [{
        id: 'notif' + Date.now(),
        mensaje: `Entrega ${entregaId.slice(0, 6)} confirmada exitosamente`,
        tipo: 'success',
        timestamp: new Date().toISOString(),
        leida: false
      }, ...(notifStock ? [notifStock] : []), ...state.notificaciones].slice(0, 20),
      auditoria: [{
        id: 'evt' + Date.now(),
        accion: 'CONFIRMAR_ENTREGA',
        detalle: `Entrega ${entregaId} confirmada para ${entrega.pacienteId}`,
        usuarioId: state.usuarioActual?.id || '',
        usuarioNombre: state.usuarioActual?.nombre || '',
        usuarioRol: state.usuarioActual?.rol || 'farmacia',
        fecha: new Date().toISOString()
      }, ...state.auditoria]
    })

    return entregaActualizada
  },

  marcarEntregaLista: (entregaId) => {
    const state = get()
    set({
      entregas: state.entregas.map(e =>
        e.id === entregaId ? { ...e, estado: 'lista' } : e
      ),
      notificaciones: [{
        id: 'notif' + Date.now(),
        mensaje: `Entrega ${entregaId.slice(0, 6)} marcada como lista`,
        tipo: 'info',
        timestamp: new Date().toISOString(),
        leida: false
      }, ...state.notificaciones].slice(0, 20)
    })
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
  },

  // === CITAS MÉDICAS Y FÓRMULAS ===
  getCitasMedicasPorPaciente: (pacienteId) => {
    const state = get()
    return state.citasMedicas
      .filter(c => c.pacienteId === pacienteId)
      .map(c => {
        const cs = state.centrosSalud.find(h => h.id === c.centroSaludId)
        const formula = c.formulaId
          ? state.formulasMedicas.find(f => f.id === c.formulaId)
          : null
        return { ...c, centroSalud: cs || null, formula: formula || null }
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  },

  getFormulasPorPaciente: (pacienteId) => {
    const state = get()
    return state.formulasMedicas
      .filter(f => f.pacienteId === pacienteId)
      .map(f => {
        const cita = state.citasMedicas.find(c => c.id === f.citaMedicaId)
        const cs = cita ? state.centrosSalud.find(h => h.id === cita.centroSaludId) : null
        return {
          ...f,
          cita: cita ? { ...cita, centroSalud: cs || null } : null,
          requiereAutorizacion: f.medicamentos.some(m => {
            const med = state.medicamentos.find(med => med.id === m.medicamentoId)
            return med ? med.requiereAutorizacion : false
          })
        }
      })
      .sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision))
  },

  getHistorialClinico: (pacienteId) => {
    const state = get()
    const citas = state.getCitasMedicasPorPaciente(pacienteId)
    const formulas = state.getFormulasPorPaciente(pacienteId)
    const reservas = state.getReservasPorPaciente(pacienteId)
    const paciente = state.usuarios.find(u => u.id === pacienteId)
    return { paciente, citas, formulas, reservas }
  },

  solicitarAutorizacionFormula: (formulaId) => {
    const state = get()
    const formula = state.formulasMedicas.find(f => f.id === formulaId)
    if (!formula) return { ok: false, error: 'Fórmula no encontrada' }
    if (formula.estado !== 'vencida') return { ok: false, error: 'Solo se puede solicitar autorización para fórmulas vencidas' }

    const paciente = state.usuarios.find(u => u.id === formula.pacienteId)
    const authId = 'auth' + Date.now()

    const nuevasAutorizaciones = [...state.autorizaciones, {
      id: authId,
      epsId: paciente ? paciente.epsId : 'eps1',
      pacienteId: formula.pacienteId,
      medicamentoId: formula.medicamentos[0]?.medicamentoId || '',
      tipo: 'extension_formula',
      estado: 'pendiente',
      cobertura: 'Pendiente',
      fechaSolicitud: new Date().toISOString(),
      fechaRespuesta: null,
      diagnosticoCIE10: '',
      diagnostico: formula.diagnostico,
      observaciones: `Solicitud de extensión de fórmula médica #${formulaId} - ${formula.medico} (${formula.especialidad}). Vencimiento original: ${formula.fechaVencimiento}`,
      reservaId: null,
      motivoRechazo: '',
      formulaId: formulaId,
    }]

    set({
      autorizaciones: nuevasAutorizaciones,
      formulasMedicas: state.formulasMedicas.map(f =>
        f.id === formulaId ? { ...f, estado: 'autorizacion_pendiente' } : f
      )
    })

    get().agregarNotificacion('Solicitud de autorización enviada a la EPS', 'success')
    get().registrarEvento('SOLICITAR_AUTORIZACION_FORMULA',
      `Solicitud de extensión para fórmula ${formulaId} del paciente ${formula.pacienteId}`,
      formula.pacienteId)

    return { ok: true, autorizacionId: authId }
  },

  toggleDarkMode: () => {
    set(state => ({ darkMode: !state.darkMode }))
  },

  cambiarContrasena: (usuarioId, contrasenaActual, nuevaContrasena) => {
    const state = get()
    const usuario = state.usuarios.find(u => u.id === usuarioId)
    if (!usuario) return { success: false, error: 'Usuario no encontrado' }
    if (usuario.password !== contrasenaActual) return { success: false, error: 'Contraseña actual incorrecta' }
    const usuarios = state.usuarios.map(u =>
      u.id === usuarioId ? { ...u, password: nuevaContrasena } : u
    )
    set({ usuarios })
    return { success: true }
  },

  enviarMensajeChat: (mensaje) => {
    const state = get()
    const msg = {
      id: 'msg' + Date.now(),
      ...mensaje,
      fecha: new Date().toISOString()
    }
    let destinatarios = []
    if (msg.destinatarioRol === 'farmacia') {
      destinatarios = state.usuarios.filter(u => u.rol === 'farmacia' && u.entidadId === msg.destinatarioId)
    } else if (msg.destinatarioRol === 'proveedor') {
      destinatarios = state.usuarios.filter(u => u.rol === 'proveedor')
    }
    const nuevasNotifs = destinatarios.map(u => ({
      id: 'notif' + Date.now() + u.id,
      mensaje: 'Nuevo mensaje de ' + msg.remitenteNombre,
      tipo: 'info',
      timestamp: new Date().toISOString(),
      leida: false,
      usuarioId: u.id,
      rol: u.rol
    }))
    set({ mensajesChat: [...state.mensajesChat, msg], notificaciones: [...nuevasNotifs, ...state.notificaciones].slice(0, 20) })
  },

  getMensajesPorFarmacia: (farmaciaId) => {
    const state = get()
    return state.mensajesChat.filter((m) => {
      const farmaciaEnvia = m.remitenteRol === 'farmacia' && m.remitenteId === farmaciaId && m.destinatarioRol === 'proveedor'
      const farmaciaRecibe = m.destinatarioRol === 'farmacia' && m.destinatarioId === farmaciaId && m.remitenteRol === 'proveedor'
      return farmaciaEnvia || farmaciaRecibe
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  },

  marcarNotificacionLeida: (notifId) => {
    const state = get()
    const notificaciones = state.notificaciones.map(n =>
      n.id === notifId ? { ...n, leida: true } : n
    )
    set({ notificaciones })
  },

  marcarTodasNotificacionesLeidas: () => {
    const state = get()
    const notificaciones = state.notificaciones.map(n => ({ ...n, leida: true }))
    set({ notificaciones })
  },

  // === AUTENTICACIÓN OTP ===
  codigosOTP: {},

  generarOTP: (documento) => {
    const state = get()
    const usuario = state.usuarios.find(u => u.documento === documento && u.rol === 'paciente' && u.activo)
    if (!usuario) return { ok: false, error: 'Paciente no encontrado' }
    const otp = '1234'
    set({ codigosOTP: { ...state.codigosOTP, [documento]: { codigo: otp, expira: Date.now() + 300000 } } })
    return { ok: true, mensaje: `Código enviado a ${usuario.email} y al teléfono ${usuario.telefono || 'registrado'}` }
  },

  loginConOTP: (documento, codigo) => {
    const state = get()
    const otpData = state.codigosOTP[documento]
    if (!otpData) return { ok: false, error: 'Solicita un código primero' }
    if (Date.now() > otpData.expira) return { ok: false, error: 'Código expirado, solicita uno nuevo' }
    if (otpData.codigo !== codigo) return { ok: false, error: 'Código incorrecto' }
    const usuario = state.usuarios.find(u => u.documento === documento && u.rol === 'paciente' && u.activo)
    if (!usuario) return { ok: false, error: 'Paciente no encontrado' }
    set({ usuarioActual: usuario, ultimoAcceso: new Date().toISOString() })
    get().registrarEvento('INICIO_SESION_OTP', `Usuario ${usuario.nombre} (${usuario.rol}) inició sesión con código`, usuario.id)
    return { ok: true, usuario }
  },

  // === REPROGRAMAR RESERVA ===
  reprogramarReserva: (reservaId, nuevaFecha, nuevaHora) => {
    const state = get()
    const reserva = state.reservas.find(r => r.id === reservaId)
    if (!reserva) return { ok: false, error: 'Reserva no encontrada' }
    if (reserva.estado !== 'pendiente' && reserva.estado !== 'confirmada') return { ok: false, error: 'Solo se pueden reprogramar reservas pendientes o confirmadas' }
    set({
      reservas: state.reservas.map(r =>
        r.id === reservaId ? { ...r, fechaReclamacion: nuevaFecha, horaReclamacion: nuevaHora } : r
      )
    })
    get().agregarNotificacion('Reserva reprogramada exitosamente', 'success')
    get().registrarEvento('REPROGRAMAR_RESERVA', `Reserva ${reservaId} reprogramada a ${nuevaFecha} ${nuevaHora}`, reserva.pacienteId)
    return { ok: true }
  },

  // === VERIFICAR VENCIMIENTO DE RESERVAS ===
  verificarVencimientoReservas: () => {
    const state = get()
    const hoy = new Date().toISOString().split('T')[0]
    let vencidas = 0
    const nuevasReservas = state.reservas.map(r => {
      if ((r.estado === 'pendiente' || r.estado === 'confirmada') && r.fechaReclamacion < hoy) {
        vencidas++
        return { ...r, estado: 'cancelada' }
      }
      return r
    })
    if (vencidas > 0) {
      set({ reservas: nuevasReservas })
      get().agregarNotificacion(`${vencidas} reserva(s) vencida(s) cancelada(s) automáticamente`, 'warning')
    }
    return vencidas
  },

  // === REGISTRAR FALLO ENTREGA ===
  registrarFalloEntrega: (entregaId, motivo) => {
    const state = get()
    const entrega = state.entregas.find(e => e.id === entregaId)
    if (!entrega) return
    set({
      entregas: state.entregas.map(e =>
        e.id === entregaId ? { ...e, estado: 'fallida' } : e
      ),
      reservas: state.reservas.map(r =>
        r.id === entrega.reservaId ? { ...r, estado: 'pendiente' } : r
      )
    })
    get().agregarNotificacion(`Entrega ${entregaId.slice(0, 6)} registrada como fallida: ${motivo}`, 'error')
    get().registrarEvento('REGISTRAR_FALLO_ENTREGA', `Entrega ${entregaId}: ${motivo}`, state.usuarioActual?.id || '')
  },

  // === NOTIFICACIONES PROGRAMADAS ===
  notificacionesProgramadas: [],

  programarNotificacion: (datos) => {
    const state = get()
    const notif = {
      id: 'prog' + Date.now(),
      mensaje: datos.mensaje,
      tipo: datos.tipo || 'info',
      fechaProgramada: datos.fechaProgramada,
      creada: new Date().toISOString(),
      activa: true,
      usuarioId: datos.usuarioId || state.usuarioActual?.id || ''
    }
    set({ notificacionesProgramadas: [...state.notificacionesProgramadas, notif].slice(0, 50) })
    get().agregarNotificacion(`Notificación programada: ${datos.mensaje}`, 'info')
    return { ok: true, notificacion: notif }
  },

  cancelarNotificacionProgramada: (notifId) => {
    const state = get()
    set({
      notificacionesProgramadas: state.notificacionesProgramadas.map(n =>
        n.id === notifId ? { ...n, activa: false } : n
      )
    })
    get().agregarNotificacion('Notificación programada cancelada', 'info')
  },

  ejecutarNotificacionesProgramadas: () => {
    const state = get()
    const ahora = Date.now()
    let pendientes = []
    let activas = []
    state.notificacionesProgramadas.forEach(n => {
      if (n.activa && new Date(n.fechaProgramada).getTime() <= ahora) {
        pendientes.push(n)
      } else {
        activas.push(n)
      }
    })
    if (pendientes.length > 0) {
      const nuevasNotifs = pendientes.map(n => ({
        id: 'notif' + Date.now() + n.id,
        mensaje: n.mensaje,
        tipo: n.tipo,
        timestamp: new Date().toISOString(),
        leida: false,
        usuarioId: n.usuarioId
      }))
      set({ notificacionesProgramadas: activas, notificaciones: [...nuevasNotifs, ...state.notificaciones].slice(0, 20) })
    }
  }
}), {
  name: 'snsdm-storage',
  partialize: (state) => ({
    usuarioActual: state.usuarioActual,
    auditoria: state.auditoria,
    darkMode: state.darkMode,
    notificaciones: state.notificaciones,
    mensajesChat: state.mensajesChat,
    favoritos: state.favoritos,
    ultimoAcceso: state.ultimoAcceso,
    accentColor: state.accentColor,
    notificacionesProgramadas: state.notificacionesProgramadas,
  })
}))

export default useStore
