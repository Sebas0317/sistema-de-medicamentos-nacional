const mockReservas = [
  // === u1 (Juan - eps1) ===
  { id: 'res1', pacienteId: 'u1', medicamentoId: 'med3', farmaciaId: 'f1', fechaReclamacion: '2026-06-22', horaReclamacion: '10:00', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-15T08:30:00', autorizacionId: 'auth3' },
  { id: 'res2', pacienteId: 'u1', medicamentoId: 'med1', farmaciaId: 'f2', fechaReclamacion: '2026-06-25', horaReclamacion: '14:30', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-16T09:15:00', autorizacionId: '' },
  { id: 'res3', pacienteId: 'u1', medicamentoId: 'med7', farmaciaId: 'f1', fechaReclamacion: '2026-06-28', horaReclamacion: '11:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-17T10:00:00', autorizacionId: 'auth1' },

  // === u2 (María - eps1) ===
  { id: 'res4', pacienteId: 'u2', medicamentoId: 'med2', farmaciaId: 'f1', fechaReclamacion: '2026-06-18', horaReclamacion: '09:00', estado: 'entregada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-10T07:45:00', autorizacionId: '' },
  { id: 'res5', pacienteId: 'u2', medicamentoId: 'med5', farmaciaId: 'f3', fechaReclamacion: '2026-06-20', horaReclamacion: '16:00', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-12T14:20:00', autorizacionId: '' },
  { id: 'res6', pacienteId: 'u2', medicamentoId: 'med13', farmaciaId: 'f2', fechaReclamacion: '2026-06-15', horaReclamacion: '08:00', estado: 'cancelada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-08T11:30:00', autorizacionId: 'auth2' },

  // === u3 (Carlos - eps2) ===
  { id: 'res7', pacienteId: 'u3', medicamentoId: 'med4', farmaciaId: 'f2', fechaReclamacion: '2026-06-24', horaReclamacion: '15:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-16T12:00:00', autorizacionId: '' },
  { id: 'res8', pacienteId: 'u3', medicamentoId: 'med10', farmaciaId: 'f1', fechaReclamacion: '2026-06-19', horaReclamacion: '18:00', estado: 'entregada', modalidad: 'domicilio', esADomicilio: true, direccion: 'Cra 15 #45-20, Bogotá', createdAt: '2026-06-11T09:30:00', autorizacionId: 'auth5' },

  // === u11 (Laura - eps1) ===
  { id: 'res9', pacienteId: 'u11', medicamentoId: 'med9', farmaciaId: 'f4', fechaReclamacion: '2026-06-23', horaReclamacion: '10:30', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-15T15:00:00', autorizacionId: '' },
  { id: 'res10', pacienteId: 'u11', medicamentoId: 'med6', farmaciaId: 'f3', fechaReclamacion: '2026-06-26', horaReclamacion: '12:00', estado: 'cancelada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-14T08:45:00', autorizacionId: 'auth6' },
  { id: 'res11', pacienteId: 'u11', medicamentoId: 'med15', farmaciaId: 'f5', fechaReclamacion: '2026-06-30', horaReclamacion: '09:00', estado: 'pendiente', modalidad: 'domicilio', esADomicilio: true, direccion: 'Calle 72 #10-30, Bogotá', createdAt: '2026-06-18T11:20:00', autorizacionId: 'auth4' },

  // === u12 (Diego - eps2) ===
  { id: 'res12', pacienteId: 'u12', medicamentoId: 'med1', farmaciaId: 'f2', fechaReclamacion: '2026-06-21', horaReclamacion: '11:00', estado: 'entregada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-09T10:15:00', autorizacionId: '' },
  { id: 'res13', pacienteId: 'u12', medicamentoId: 'med8', farmaciaId: 'f5', fechaReclamacion: '2026-06-27', horaReclamacion: '17:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-17T13:30:00', autorizacionId: 'auth7' },
  { id: 'res14', pacienteId: 'u12', medicamentoId: 'med12', farmaciaId: 'f1', fechaReclamacion: '2026-06-29', horaReclamacion: '07:30', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-16T16:00:00', autorizacionId: '' },

  // === u13 (Sofía - eps3) ===
  { id: 'res15', pacienteId: 'u13', medicamentoId: 'med2', farmaciaId: 'f3', fechaReclamacion: '2026-06-24', horaReclamacion: '13:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-18T09:00:00', autorizacionId: '' },
  { id: 'res16', pacienteId: 'u13', medicamentoId: 'med14', farmaciaId: 'f4', fechaReclamacion: '2026-06-28', horaReclamacion: '10:00', estado: 'pendiente', modalidad: 'domicilio', esADomicilio: true, direccion: 'Av. Chile #68-50, Bogotá', createdAt: '2026-06-17T14:30:00', autorizacionId: '' },

  // === u14 (Jorge - eps4) ===
  { id: 'res17', pacienteId: 'u14', medicamentoId: 'med5', farmaciaId: 'f1', fechaReclamacion: '2026-06-22', horaReclamacion: '09:30', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-13T11:45:00', autorizacionId: '' },
  { id: 'res18', pacienteId: 'u14', medicamentoId: 'med11', farmaciaId: 'f5', fechaReclamacion: '2026-06-30', horaReclamacion: '14:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-19T08:00:00', autorizacionId: 'auth8' },

  // === u15 (Carmen - eps5) ===
  { id: 'res19', pacienteId: 'u15', medicamentoId: 'med3', farmaciaId: 'f4', fechaReclamacion: '2026-06-25', horaReclamacion: '11:30', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-15T10:00:00', autorizacionId: '' },
  { id: 'res20', pacienteId: 'u15', medicamentoId: 'med9', farmaciaId: 'f2', fechaReclamacion: '2026-06-29', horaReclamacion: '16:00', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-14T13:15:00', autorizacionId: '' },

  // === u16 (Andrés - eps1) ===
  { id: 'res21', pacienteId: 'u16', medicamentoId: 'med4', farmaciaId: 'f3', fechaReclamacion: '2026-06-23', horaReclamacion: '08:00', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-16T10:30:00', autorizacionId: '' },
  { id: 'res22', pacienteId: 'u16', medicamentoId: 'med10', farmaciaId: 'f5', fechaReclamacion: '2026-06-27', horaReclamacion: '15:30', estado: 'cancelada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-12T12:00:00', autorizacionId: '' },

  // === u17 (Valentina - eps3) ===
  { id: 'res23', pacienteId: 'u17', medicamentoId: 'med12', farmaciaId: 'f2', fechaReclamacion: '2026-06-26', horaReclamacion: '12:00', estado: 'pendiente', modalidad: 'domicilio', esADomicilio: true, direccion: 'Calle 100 #15-80, Bogotá', createdAt: '2026-06-18T15:45:00', autorizacionId: '' },
  { id: 'res24', pacienteId: 'u17', medicamentoId: 'med1', farmaciaId: 'f4', fechaReclamacion: '2026-06-30', horaReclamacion: '10:00', estado: 'confirmada', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-17T10:00:00', autorizacionId: '' },

  // === u1 (Juan) extra pedido ===
  { id: 'res25', pacienteId: 'u1', medicamentoId: 'med14', farmaciaId: 'f5', fechaReclamacion: '2026-06-27', horaReclamacion: '16:30', estado: 'pendiente', modalidad: 'presencial', esADomicilio: false, direccion: '', createdAt: '2026-06-19T09:30:00', autorizacionId: '' }
]

export default mockReservas
