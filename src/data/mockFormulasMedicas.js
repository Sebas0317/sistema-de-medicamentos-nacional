const mockFormulasMedicas = [
  {
    id: 'f1',
    pacienteId: 'u1',
    citaMedicaId: 'cm1',
    medico: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    fechaEmision: '2026-03-15',
    fechaVencimiento: '2026-06-15',
    estado: 'activa',
    diagnostico: 'Hipertensión arterial esencial',
    medicamentos: [
      { medicamentoId: 'med4', nombre: 'Losartán 50mg', cantidad: 30, indicaciones: 'Tomar 1 tableta cada 12 horas', dosis: '50mg cada 12h' },
      { medicamentoId: 'med15', nombre: 'Amlodipino 5mg', cantidad: 30, indicaciones: 'Tomar 1 tableta al día', dosis: '5mg al día' },
    ]
  },
  {
    id: 'f2',
    pacienteId: 'u1',
    citaMedicaId: 'cm2',
    medico: 'Dra. Laura Gómez',
    especialidad: 'Cardiología',
    fechaEmision: '2026-04-02',
    fechaVencimiento: '2026-07-02',
    estado: 'activa',
    diagnostico: 'Angina de pecho estable',
    medicamentos: [
      { medicamentoId: 'med15', nombre: 'Amlodipino 5mg', cantidad: 60, indicaciones: 'Tomar 1 tableta al día', dosis: '5mg al día' },
      { medicamentoId: 'med6', nombre: 'Atorvastatina 20mg', cantidad: 30, indicaciones: 'Tomar 1 tableta en la noche', dosis: '20mg al día' },
    ]
  },
  {
    id: 'f3',
    pacienteId: 'u1',
    citaMedicaId: 'cm3',
    medico: 'Dr. Andrés Rivera',
    especialidad: 'Endocrinología',
    fechaEmision: '2026-05-10',
    fechaVencimiento: '2026-08-10',
    estado: 'activa',
    diagnostico: 'Diabetes mellitus tipo 2',
    medicamentos: [
      { medicamentoId: 'med3', nombre: 'Metformina 850mg', cantidad: 90, indicaciones: 'Tomar 1 tableta cada 8 horas', dosis: '850mg cada 8h' },
    ]
  },
  {
    id: 'f4',
    pacienteId: 'u2',
    citaMedicaId: 'cm4',
    medico: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    fechaEmision: '2026-02-20',
    fechaVencimiento: '2026-05-20',
    estado: 'vencida',
    diagnostico: 'Infección respiratoria aguda',
    medicamentos: [
      { medicamentoId: 'med5', nombre: 'Amoxicilina 500mg', cantidad: 14, indicaciones: 'Tomar 1 cada 8 horas por 7 días', dosis: '500mg cada 8h' },
      { medicamentoId: 'med1', nombre: 'Acetaminofén 500mg', cantidad: 10, indicaciones: 'Tomar 1 cada 6 horas si hay fiebre', dosis: '500mg cada 6h PRN' },
    ]
  },
  {
    id: 'f5',
    pacienteId: 'u2',
    citaMedicaId: 'cm5',
    medico: 'Dra. Patricia Rojas',
    especialidad: 'Neumología',
    fechaEmision: '2026-03-28',
    fechaVencimiento: '2026-06-28',
    estado: 'activa',
    diagnostico: 'Asma bronquial persistente',
    medicamentos: [
      { medicamentoId: 'med8', nombre: 'Salbutamol Inhalador 100mcg', cantidad: 2, indicaciones: '2 inhalaciones cada 6 horas si hay síntomas', dosis: '200mcg cada 6h PRN' },
    ]
  },
  {
    id: 'f6',
    pacienteId: 'u3',
    citaMedicaId: 'cm6',
    medico: 'Dr. Juan Pablo Silva',
    especialidad: 'Medicina General',
    fechaEmision: '2026-04-12',
    fechaVencimiento: '2026-07-12',
    estado: 'activa',
    diagnostico: 'Gastritis aguda',
    medicamentos: [
      { medicamentoId: 'med7', nombre: 'Omeprazol 20mg', cantidad: 28, indicaciones: 'Tomar 1 cápsula en ayunas', dosis: '20mg al día' },
    ]
  },
  {
    id: 'f7',
    pacienteId: 'u3',
    citaMedicaId: 'cm7',
    medico: 'Dr. Andrés Rivera',
    especialidad: 'Gastroenterología',
    fechaEmision: '2026-05-05',
    fechaVencimiento: '2026-08-05',
    estado: 'activa',
    diagnostico: 'Enfermedad por reflujo gastroesofágico',
    medicamentos: [
      { medicamentoId: 'med7', nombre: 'Omeprazol 20mg', cantidad: 56, indicaciones: 'Tomar 1 cápsula en ayunas por 8 semanas', dosis: '20mg al día' },
    ]
  },
  {
    id: 'f8',
    pacienteId: 'u4',
    citaMedicaId: 'cm8',
    medico: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    fechaEmision: '2026-01-15',
    fechaVencimiento: '2026-04-15',
    estado: 'vencida',
    diagnostico: 'Artritis reumatoide',
    medicamentos: [
      { medicamentoId: 'med11', nombre: 'Metotrexato 2.5mg', cantidad: 50, indicaciones: 'Tomar 4 tabletas una vez por semana', dosis: '10mg semanal' },
    ]
  },
  {
    id: 'f9',
    pacienteId: 'u4',
    citaMedicaId: 'cm9',
    medico: 'Dra. Laura Gómez',
    especialidad: 'Reumatología',
    fechaEmision: '2026-03-30',
    fechaVencimiento: '2026-06-30',
    estado: 'activa',
    diagnostico: 'Artritis reumatoide severa',
    medicamentos: [
      { medicamentoId: 'med12', nombre: 'Adalimumab 40mg inyectable', cantidad: 2, indicaciones: '1 inyección subcutánea cada 2 semanas', dosis: '40mg cada 2 semanas' },
      { medicamentoId: 'med1', nombre: 'Acetaminofén 500mg', cantidad: 60, indicaciones: 'Tomar 1 cada 8 horas si hay dolor', dosis: '500mg cada 8h PRN' },
    ]
  },
  {
    id: 'f10',
    pacienteId: 'u4',
    citaMedicaId: 'cm10',
    medico: 'Dra. Patricia Rojas',
    especialidad: 'Medicina Interna',
    fechaEmision: '2026-05-20',
    fechaVencimiento: '2026-08-20',
    estado: 'activa',
    diagnostico: 'Fibrilación auricular — anticoagulación crónica',
    medicamentos: [
      { medicamentoId: 'med13', nombre: 'Warfarina 5mg', cantidad: 90, indicaciones: 'Tomar 1 tableta al día según INR', dosis: '5mg al día' },
    ]
  },
  {
    id: 'f11',
    pacienteId: 'u1',
    citaMedicaId: 'cm11',
    medico: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    fechaEmision: '2026-06-01',
    fechaVencimiento: '2026-09-01',
    estado: 'activa',
    diagnostico: 'Hipertensión arterial — control',
    medicamentos: [
      { medicamentoId: 'med4', nombre: 'Losartán 50mg', cantidad: 30, indicaciones: 'Tomar 1 tableta cada 12 horas', dosis: '50mg cada 12h' },
    ]
  },
  {
    id: 'f12',
    pacienteId: 'u1',
    citaMedicaId: 'cm12',
    medico: 'Dra. Patricia Rojas',
    especialidad: 'Medicina Interna',
    fechaEmision: '2026-07-15',
    fechaVencimiento: '2026-10-15',
    estado: 'activa',
    diagnostico: 'Hipotiroidismo subclínico',
    medicamentos: [
      { medicamentoId: 'med14', nombre: 'Levotiroxina 50mcg', cantidad: 30, indicaciones: 'Tomar 1 tableta en ayunas 30 minutos antes del desayuno', dosis: '50mcg al día' },
    ]
  },
  {
    id: 'f13',
    pacienteId: 'u5',
    citaMedicaId: 'cm13',
    medico: 'Dr. Juan Pablo Silva',
    especialidad: 'Medicina General',
    fechaEmision: '2026-05-08',
    fechaVencimiento: '2026-08-08',
    estado: 'activa',
    diagnostico: 'Infección del tracto urinario',
    medicamentos: [
      { medicamentoId: 'med5', nombre: 'Amoxicilina 500mg', cantidad: 14, indicaciones: 'Tomar 1 cada 8 horas por 7 días', dosis: '500mg cada 8h' },
    ]
  },
  {
    id: 'f14',
    pacienteId: 'u5',
    citaMedicaId: 'cm14',
    medico: 'Dr. Andrés Rivera',
    especialidad: 'Urología',
    fechaEmision: '2026-06-18',
    fechaVencimiento: '2026-09-18',
    estado: 'activa',
    diagnostico: 'Hiperplasia prostática benigna',
    medicamentos: [
      { medicamentoId: 'med1', nombre: 'Acetaminofén 500mg', cantidad: 30, indicaciones: 'Tomar 1 cada 8 horas si hay dolor', dosis: '500mg cada 8h PRN' },
    ]
  },
]

export default mockFormulasMedicas
