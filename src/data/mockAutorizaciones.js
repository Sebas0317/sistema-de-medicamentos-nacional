const mockAutorizaciones = [
  {
    id: 'auth1',
    reservaId: 'res3',
    pacienteId: 'u1',
    medicamentoId: 'med9',
    epsId: 'eps1',
    estado: 'pendiente',
    motivoRechazo: '',
    cobertura: '100%',
    observaciones: 'Paciente con diagnóstico CIE-10 E11 - Diabetes tipo 2. Requiere insulina glargina para control glucémico.',
    fechaSolicitud: '2026-06-13T08:16:00',
    fechaRespuesta: null
  },
  {
    id: 'auth2',
    reservaId: 'res6',
    pacienteId: 'u2',
    medicamentoId: 'med10',
    epsId: 'eps1',
    estado: 'rechazada',
    motivoRechazo: 'El medicamento no está incluido en el plan de beneficios para el diagnóstico reportado. Se requiere evaluación por neurología.',
    cobertura: '0%',
    observaciones: 'Paciente solicita Clonazepam para ansiedad generalizada sin prescripción especializada.',
    fechaSolicitud: '2026-06-08T10:25:00',
    fechaRespuesta: '2026-06-10T14:30:00'
  },
  {
    id: 'auth3',
    reservaId: 'res8',
    pacienteId: 'u3',
    medicamentoId: 'med12',
    epsId: 'eps2',
    estado: 'aprobada',
    motivoRechazo: '',
    cobertura: '100%',
    observaciones: 'Paciente con artritis reumatoide severa CIE-10 M05. Tratamiento biológico aprobado por comité técnico.',
    fechaSolicitud: '2026-06-07T13:05:00',
    fechaRespuesta: '2026-06-09T10:00:00'
  },
  {
    id: 'auth4',
    reservaId: null,
    pacienteId: 'u1',
    medicamentoId: 'med11',
    epsId: 'eps1',
    estado: 'pendiente',
    motivoRechazo: '',
    cobertura: '80%',
    observaciones: 'Paciente con diagnóstico CIE-10 L40.0 - Psoriasis vulgar. Requiere metotrexato como terapia sistémica.',
    fechaSolicitud: '2026-06-14T11:00:00',
    fechaRespuesta: null
  },
  {
    id: 'auth5',
    reservaId: null,
    pacienteId: 'u2',
    medicamentoId: 'med9',
    epsId: 'eps1',
    estado: 'aprobada',
    motivoRechazo: '',
    cobertura: '100%',
    observaciones: 'Paciente con diabetes tipo 2 CIE-10 E11. Tratamiento aprobado por endocrinología.',
    fechaSolicitud: '2026-06-10T09:30:00',
    fechaRespuesta: '2026-06-12T16:00:00'
  },
  {
    id: 'auth6',
    reservaId: null,
    pacienteId: 'u3',
    medicamentoId: 'med10',
    epsId: 'eps2',
    estado: 'rechazada',
    motivoRechazo: 'El paciente no ha completado las evaluaciones psicológicas requeridas. Se solicita nueva remisión con psiquiatría.',
    cobertura: '0%',
    observaciones: 'Solicitud de Clonazepam para trastorno de pánico sin evaluación psiquiátrica completa.',
    fechaSolicitud: '2026-06-11T15:20:00',
    fechaRespuesta: '2026-06-14T08:30:00'
  },
  {
    id: 'auth7',
    reservaId: null,
    pacienteId: 'u1',
    medicamentoId: 'med13',
    epsId: 'eps1',
    estado: 'pendiente',
    motivoRechazo: '',
    cobertura: '100%',
    observaciones: 'Paciente con fibrilación auricular CIE-10 I48. Requiere anticoagulación oral con warfarina.',
    fechaSolicitud: '2026-06-15T07:15:00',
    fechaRespuesta: null
  },
  {
    id: 'auth8',
    reservaId: null,
    pacienteId: 'u3',
    medicamentoId: 'med11',
    epsId: 'eps2',
    estado: 'aprobada',
    motivoRechazo: '',
    cobertura: '80%',
    observaciones: 'Paciente con artritis reumatoide CIE-10 M05. Aprobado por reumatología con seguimiento mensual.',
    fechaSolicitud: '2026-06-08T14:00:00',
    fechaRespuesta: '2026-06-11T11:30:00'
  }
]

export default mockAutorizaciones
