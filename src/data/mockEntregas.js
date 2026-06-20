const mockEntregas = [
  {
    id: 'ent1',
    reservaId: 'res1',
    farmaciaId: 'f1',
    pacienteId: 'u1',
    medicamentoId: 'med1',
    estado: 'pendiente',
    fechaAsignacion: '2026-06-10T09:30:00',
    fechaEntrega: null,
    esADomicilio: false,
    direccion: '',
    firmaDigital: ''
  },
  {
    id: 'ent2',
    reservaId: 'res4',
    farmaciaId: 'f1',
    pacienteId: 'u2',
    medicamentoId: 'med3',
    estado: 'entregada',
    fechaAsignacion: '2026-06-11T11:05:00',
    fechaEntrega: '2026-06-21T10:30:00',
    esADomicilio: false,
    direccion: '',
    firmaDigital: 'María Gómez - CC 1122334455'
  },
  {
    id: 'ent3',
    reservaId: 'res5',
    farmaciaId: 'f2',
    pacienteId: 'u2',
    medicamentoId: 'med5',
    estado: 'pendiente',
    fechaAsignacion: '2026-06-09T16:50:00',
    fechaEntrega: null,
    esADomicilio: true,
    direccion: 'Carrera 45 #67-89, Barrio El Poblado, Medellín',
    firmaDigital: ''
  },
  {
    id: 'ent4',
    reservaId: 'res8',
    farmaciaId: 'f1',
    pacienteId: 'u3',
    medicamentoId: 'med12',
    estado: 'entregada',
    fechaAsignacion: '2026-06-09T10:00:00',
    fechaEntrega: '2026-06-14T14:00:00',
    esADomicilio: true,
    direccion: 'Calle 23 #45-67, Barrio Teusaquillo, Bogotá',
    firmaDigital: 'Carlos Martínez - CC 9876543210'
  },
  {
    id: 'ent5',
    reservaId: 'res9',
    farmaciaId: 'f2',
    pacienteId: 'u3',
    medicamentoId: 'med14',
    estado: 'lista',
    fechaAsignacion: '2026-06-10T07:55:00',
    fechaEntrega: null,
    esADomicilio: false,
    direccion: '',
    firmaDigital: ''
  },
  {
    id: 'ent6',
    reservaId: 'res12',
    farmaciaId: 'f2',
    pacienteId: 'u3',
    medicamentoId: 'med6',
    estado: 'entregada',
    fechaAsignacion: '2026-06-05T12:35:00',
    fechaEntrega: '2026-06-16T11:15:00',
    esADomicilio: false,
    direccion: '',
    firmaDigital: 'Carlos Martínez - CC 9876543210'
  },
  {
    id: 'ent7',
    reservaId: null,
    farmaciaId: 'f1',
    pacienteId: 'u1',
    medicamentoId: 'med7',
    estado: 'fallida',
    fechaAsignacion: '2026-06-15T10:00:00',
    fechaEntrega: null,
    esADomicilio: false,
    direccion: '',
    firmaDigital: ''
  },
  {
    id: 'ent8',
    reservaId: null,
    farmaciaId: 'f2',
    pacienteId: 'u2',
    medicamentoId: 'med1',
    estado: 'pendiente',
    fechaAsignacion: '2026-06-14T16:20:00',
    fechaEntrega: null,
    esADomicilio: false,
    direccion: '',
    firmaDigital: ''
  }
]

export default mockEntregas
