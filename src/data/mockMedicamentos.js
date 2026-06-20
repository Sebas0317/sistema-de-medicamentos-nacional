const mockMedicamentos = [
  {
    id: 'med1',
    nombre: 'Acetaminofén 500mg',
    codigoATC: 'N02BE01',
    descripcion: 'Analgésico y antipirético de uso común para el tratamiento del dolor leve a moderado y la fiebre.',
    requiereAutorizacion: false,
    categoria: 'analgésico',
    presentacion: 'Caja x 100 tabletas',
    laboratorio: 'Genfar'
  },
  {
    id: 'med2',
    nombre: 'Ibuprofeno 400mg',
    codigoATC: 'M01AE01',
    descripcion: 'Antiinflamatorio no esteroideo para dolor, inflamación y fiebre.',
    requiereAutorizacion: false,
    categoria: 'analgésico',
    presentacion: 'Caja x 60 tabletas',
    laboratorio: 'MK'
  },
  {
    id: 'med3',
    nombre: 'Metformina 850mg',
    codigoATC: 'A10BA02',
    descripcion: 'Antidiabético oral para el control de la diabetes mellitus tipo 2.',
    requiereAutorizacion: false,
    categoria: 'antidiabético',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Procaps'
  },
  {
    id: 'med4',
    nombre: 'Losartán 50mg',
    codigoATC: 'C09CA01',
    descripcion: 'Antihipertensivo que bloquea los receptores de angiotensina II para el tratamiento de la hipertensión arterial.',
    requiereAutorizacion: false,
    categoria: 'cardiovascular',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Genfar'
  },
  {
    id: 'med5',
    nombre: 'Amoxicilina 500mg',
    codigoATC: 'J01CA04',
    descripcion: 'Antibiótico betalactámico para infecciones bacterianas del tracto respiratorio, urinario y piel.',
    requiereAutorizacion: false,
    categoria: 'antibiótico',
    presentacion: 'Caja x 21 cápsulas',
    laboratorio: 'Biogen'
  },
  {
    id: 'med6',
    nombre: 'Atorvastatina 20mg',
    codigoATC: 'C10AA05',
    descripcion: 'Hipolipemiante para reducir el colesterol LDL y prevenir enfermedades cardiovasculares.',
    requiereAutorizacion: false,
    categoria: 'cardiovascular',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Pfizer'
  },
  {
    id: 'med7',
    nombre: 'Omeprazol 20mg',
    codigoATC: 'A02BC01',
    descripcion: 'Inhibidor de la bomba de protones para el tratamiento de úlceras y reflujo gastroesofágico.',
    requiereAutorizacion: false,
    categoria: 'gastrointestinal',
    presentacion: 'Caja x 28 cápsulas',
    laboratorio: 'Sanofi'
  },
  {
    id: 'med8',
    nombre: 'Salbutamol Inhalador 100mcg',
    codigoATC: 'R03AC02',
    descripcion: 'Broncodilatador de acción corta para el alivio del asma y EPOC.',
    requiereAutorizacion: false,
    categoria: 'respiratorio',
    presentacion: 'Inhalador x 200 dosis',
    laboratorio: 'GSK'
  },
  {
    id: 'med9',
    nombre: 'Insulina Glargina 100UI',
    codigoATC: 'A10AE04',
    descripcion: 'Análogo de insulina de acción prolongada para diabetes mellitus tipo 1 y 2.',
    requiereAutorizacion: true,
    categoria: 'antidiabético',
    presentacion: 'Pluma precargada x 3ml',
    laboratorio: 'Sanofi'
  },
  {
    id: 'med10',
    nombre: 'Clonazepam 0.5mg',
    codigoATC: 'N03AE01',
    descripcion: 'Benzodiazepina anticonvulsivante y ansiolítica para trastornos de ansiedad y epilepsia.',
    requiereAutorizacion: true,
    categoria: 'neurológico',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Roche'
  },
  {
    id: 'med11',
    nombre: 'Metotrexato 2.5mg',
    codigoATC: 'L01BA01',
    descripcion: 'Antimetabolito inmunosupresor para artritis reumatoide y psoriasis severa.',
    requiereAutorizacion: true,
    categoria: 'inmunosupresor',
    presentacion: 'Caja x 50 tabletas',
    laboratorio: 'Pfizer'
  },
  {
    id: 'med12',
    nombre: 'Adalimumab 40mg inyectable',
    codigoATC: 'L04AB04',
    descripcion: 'Anticuerpo monoclonal inhibidor del TNF-alfa para enfermedades autoinmunes.',
    requiereAutorizacion: true,
    categoria: 'inmunosupresor',
    presentacion: 'Jeringa precargada x 1',
    laboratorio: 'AbbVie'
  },
  {
    id: 'med13',
    nombre: 'Warfarina 5mg',
    codigoATC: 'B01AA03',
    descripcion: 'Anticoagulante oral para prevención de tromboembolismo en fibrilación auricular y prótesis valvulares.',
    requiereAutorizacion: true,
    categoria: 'cardiovascular',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Bristol'
  },
  {
    id: 'med14',
    nombre: 'Levotiroxina 50mcg',
    codigoATC: 'H03AA01',
    descripcion: 'Hormona tiroidea sintética para el tratamiento del hipotiroidismo.',
    requiereAutorizacion: false,
    categoria: 'endocrino',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Merck'
  },
  {
    id: 'med15',
    nombre: 'Amlodipino 5mg',
    codigoATC: 'C08CA01',
    descripcion: 'Bloqueador de canales de calcio para hipertensión arterial y angina de pecho.',
    requiereAutorizacion: false,
    categoria: 'cardiovascular',
    presentacion: 'Caja x 30 tabletas',
    laboratorio: 'Pfizer'
  }
]

export default mockMedicamentos
