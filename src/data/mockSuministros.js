const mockSuministros = [
  // === prov1 (MediFarma) → f1 ===
  { id: 'sum1', proveedorId: 'prov1', farmaciaId: 'f1', medicamentoId: 'med1', cantidad: 200, numeroLote: 'LOT-2026-001', fechaVencimiento: '2027-06-15', fechaRegistro: '2026-06-10T08:00:00', estado: 'entregado', observaciones: 'Suministro mensual acetaminofén', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum2', proveedorId: 'prov1', farmaciaId: 'f1', medicamentoId: 'med3', cantidad: 100, numeroLote: 'LOT-2026-002', fechaVencimiento: '2027-03-20', fechaRegistro: '2026-06-12T10:30:00', estado: 'entregado', observaciones: 'Metformina lote regular', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum3', proveedorId: 'prov1', farmaciaId: 'f1', medicamentoId: 'med7', cantidad: 50, numeroLote: 'LOT-2026-003', fechaVencimiento: '2026-12-01', fechaRegistro: '2026-06-15T14:00:00', estado: 'entregado', observaciones: 'Insulina glargina cadena de frío', condicionesTransporte: 'Cadena de frío 2-8°C' },

  // === prov1 (MediFarma) → f2 ===
  { id: 'sum4', proveedorId: 'prov1', farmaciaId: 'f2', medicamentoId: 'med1', cantidad: 300, numeroLote: 'LOT-2026-004', fechaVencimiento: '2027-08-10', fechaRegistro: '2026-06-11T09:00:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum5', proveedorId: 'prov1', farmaciaId: 'f2', medicamentoId: 'med4', cantidad: 150, numeroLote: 'LOT-2026-005', fechaVencimiento: '2027-05-25', fechaRegistro: '2026-06-13T11:15:00', estado: 'entregado', observaciones: 'Losartán para programa cardiovascular', condicionesTransporte: 'Temperatura ambiente' },

  // === prov1 (MediFarma) → f3 ===
  { id: 'sum6', proveedorId: 'prov1', farmaciaId: 'f3', medicamentoId: 'med1', cantidad: 500, numeroLote: 'LOT-2026-006', fechaVencimiento: '2027-09-30', fechaRegistro: '2026-06-14T07:30:00', estado: 'entregado', observaciones: 'Apertura de nueva farmacia Suba', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum7', proveedorId: 'prov1', farmaciaId: 'f3', medicamentoId: 'med2', cantidad: 200, numeroLote: 'LOT-2026-007', fechaVencimiento: '2027-04-15', fechaRegistro: '2026-06-14T07:30:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum8', proveedorId: 'prov1', farmaciaId: 'f3', medicamentoId: 'med6', cantidad: 100, numeroLote: 'LOT-2026-008', fechaVencimiento: '2027-02-28', fechaRegistro: '2026-06-14T07:30:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },

  // === prov2 (Lafrancol) → f1 ===
  { id: 'sum9', proveedorId: 'prov2', farmaciaId: 'f1', medicamentoId: 'med5', cantidad: 300, numeroLote: 'LOT-2026-009', fechaVencimiento: '2027-07-20', fechaRegistro: '2026-06-09T13:45:00', estado: 'entregado', observaciones: 'Amoxicilina 500mg pedido quincenal', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum10', proveedorId: 'prov2', farmaciaId: 'f1', medicamentoId: 'med10', cantidad: 80, numeroLote: 'LOT-2026-010', fechaVencimiento: '2027-01-15', fechaRegistro: '2026-06-11T15:00:00', estado: 'entregado', observaciones: 'Amlodipino 5mg lote urgente', condicionesTransporte: 'Temperatura ambiente' },

  // === prov2 (Lafrancol) → f2 ===
  { id: 'sum11', proveedorId: 'prov2', farmaciaId: 'f2', medicamentoId: 'med2', cantidad: 120, numeroLote: 'LOT-2026-011', fechaVencimiento: '2027-06-30', fechaRegistro: '2026-06-10T10:00:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum12', proveedorId: 'prov2', farmaciaId: 'f2', medicamentoId: 'med8', cantidad: 60, numeroLote: 'LOT-2026-012', fechaVencimiento: '2027-10-05', fechaRegistro: '2026-06-12T09:30:00', estado: 'entregado', observaciones: 'Salbutamol inhalador pedido especial', condicionesTransporte: 'Temperatura ambiente' },

  // === prov2 (Lafrancol) → f4 ===
  { id: 'sum13', proveedorId: 'prov2', farmaciaId: 'f4', medicamentoId: 'med1', cantidad: 400, numeroLote: 'LOT-2026-013', fechaVencimiento: '2027-11-20', fechaRegistro: '2026-06-15T08:00:00', estado: 'entregado', observaciones: 'Apertura Colsubsidio Engativá', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum14', proveedorId: 'prov2', farmaciaId: 'f4', medicamentoId: 'med3', cantidad: 200, numeroLote: 'LOT-2026-014', fechaVencimiento: '2027-08-15', fechaRegistro: '2026-06-15T08:00:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum15', proveedorId: 'prov2', farmaciaId: 'f4', medicamentoId: 'med7', cantidad: 30, numeroLote: 'LOT-2026-015', fechaVencimiento: '2026-11-30', fechaRegistro: '2026-06-15T08:00:00', estado: 'entregado', observaciones: 'Insulina refrigerada', condicionesTransporte: 'Cadena de frío 2-8°C' },

  // === prov1 (MediFarma) → f5 ===
  { id: 'sum16', proveedorId: 'prov1', farmaciaId: 'f5', medicamentoId: 'med1', cantidad: 250, numeroLote: 'LOT-2026-016', fechaVencimiento: '2027-12-10', fechaRegistro: '2026-06-16T09:00:00', estado: 'entregado', observaciones: 'Apertura Pasteur Centro', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum17', proveedorId: 'prov1', farmaciaId: 'f5', medicamentoId: 'med9', cantidad: 100, numeroLote: 'LOT-2026-017', fechaVencimiento: '2027-08-30', fechaRegistro: '2026-06-16T09:00:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' },
  { id: 'sum18', proveedorId: 'prov1', farmaciaId: 'f5', medicamentoId: 'med4', cantidad: 60, numeroLote: 'LOT-2026-018', fechaVencimiento: '2027-05-15', fechaRegistro: '2026-06-16T09:00:00', estado: 'entregado', observaciones: '', condicionesTransporte: 'Temperatura ambiente' }
]

export default mockSuministros
