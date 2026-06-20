const mockEntregas = [
  // === f1 (Audifarma) ===
  { id: 'ent1', reservaId: 'res1', farmaciaId: 'f1', pacienteId: 'u1', medicamentoId: 'med3', estado: 'pendiente', fechaAsignacion: '2026-06-16T09:00:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent2', reservaId: 'res4', farmaciaId: 'f1', pacienteId: 'u2', medicamentoId: 'med2', estado: 'entregada', fechaAsignacion: '2026-06-10T07:45:00', fechaEntrega: '2026-06-18T09:30:00', esADomicilio: false, direccion: '', firmaDigital: 'María Elena Gómez - CC1122334455' },
  { id: 'ent3', reservaId: 'res8', farmaciaId: 'f1', pacienteId: 'u3', medicamentoId: 'med10', estado: 'entregada', fechaAsignacion: '2026-06-11T09:30:00', fechaEntrega: '2026-06-19T18:15:00', esADomicilio: true, direccion: 'Cra 15 #45-20, Bogotá', firmaDigital: 'Carlos Martínez - CC9876543210' },
  { id: 'ent4', reservaId: 'res17', farmaciaId: 'f1', pacienteId: 'u14', medicamentoId: 'med5', estado: 'pendiente', fechaAsignacion: '2026-06-13T11:45:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },

  // === f2 (Cruz Verde) ===
  { id: 'ent5', reservaId: 'res2', farmaciaId: 'f2', pacienteId: 'u1', medicamentoId: 'med1', estado: 'pendiente', fechaAsignacion: '2026-06-16T09:15:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent6', reservaId: 'res12', farmaciaId: 'f2', pacienteId: 'u12', medicamentoId: 'med1', estado: 'entregada', fechaAsignacion: '2026-06-09T10:15:00', fechaEntrega: '2026-06-21T11:20:00', esADomicilio: false, direccion: '', firmaDigital: 'Diego Ríos - CC53456789' },
  { id: 'ent7', reservaId: 'res7', farmaciaId: 'f2', pacienteId: 'u3', medicamentoId: 'med4', estado: 'pendiente', fechaAsignacion: '2026-06-16T12:00:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },

  // === f3 (Farmaservice) ===
  { id: 'ent8', reservaId: 'res5', farmaciaId: 'f3', pacienteId: 'u2', medicamentoId: 'med5', estado: 'lista', fechaAsignacion: '2026-06-12T14:20:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent9', reservaId: 'res15', farmaciaId: 'f3', pacienteId: 'u13', medicamentoId: 'med2', estado: 'pendiente', fechaAsignacion: '2026-06-18T09:00:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent10', reservaId: 'res21', farmaciaId: 'f3', pacienteId: 'u16', medicamentoId: 'med4', estado: 'pendiente', fechaAsignacion: '2026-06-16T10:30:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },

  // === f4 (Colsubsidio) ===
  { id: 'ent11', reservaId: 'res9', farmaciaId: 'f4', pacienteId: 'u11', medicamentoId: 'med9', estado: 'lista', fechaAsignacion: '2026-06-15T15:00:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent12', reservaId: 'res19', farmaciaId: 'f4', pacienteId: 'u15', medicamentoId: 'med3', estado: 'pendiente', fechaAsignacion: '2026-06-15T10:00:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent13', reservaId: 'res16', farmaciaId: 'f4', pacienteId: 'u13', medicamentoId: 'med14', estado: 'pendiente', fechaAsignacion: '2026-06-17T14:30:00', fechaEntrega: null, esADomicilio: true, direccion: 'Av. Chile #68-50, Bogotá', firmaDigital: '' },

  // === f5 (Pasteur) ===
  { id: 'ent14', reservaId: 'res11', farmaciaId: 'f5', pacienteId: 'u11', medicamentoId: 'med15', estado: 'pendiente', fechaAsignacion: '2026-06-18T11:20:00', fechaEntrega: null, esADomicilio: true, direccion: 'Calle 72 #10-30, Bogotá', firmaDigital: '' },
  { id: 'ent15', reservaId: 'res13', farmaciaId: 'f5', pacienteId: 'u12', medicamentoId: 'med8', estado: 'pendiente', fechaAsignacion: '2026-06-17T13:30:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' },
  { id: 'ent16', reservaId: 'res25', farmaciaId: 'f5', pacienteId: 'u1', medicamentoId: 'med14', estado: 'pendiente', fechaAsignacion: '2026-06-19T09:30:00', fechaEntrega: null, esADomicilio: false, direccion: '', firmaDigital: '' }
]

export default mockEntregas
