const mockUsuarios = [
  // === PACIENTES (10) ===
  { id: 'u1', nombre: 'Juan Carlos Pérez Rodríguez', documento: '1020345678', email: 'juan.perez@gmail.com', password: 'paciente123', rol: 'paciente', telefono: '3001234567', activo: true, epsId: 'eps1', fechaNacimiento: '1985-03-15', entidadNombre: '', entidadId: '' },
  { id: 'u2', nombre: 'María Elena Gómez López', documento: '1122334455', email: 'maria.gomez@hotmail.com', password: 'paciente123', rol: 'paciente', telefono: '3109876543', activo: true, epsId: 'eps1', fechaNacimiento: '1990-07-22', entidadNombre: '', entidadId: '' },
  { id: 'u3', nombre: 'Carlos Andrés Martínez Ruiz', documento: '9876543210', email: 'carlos.martinez@yahoo.com', password: 'paciente123', rol: 'paciente', telefono: '3204567890', activo: true, epsId: 'eps2', fechaNacimiento: '1978-11-08', entidadNombre: '', entidadId: '' },
  { id: 'u11', nombre: 'Laura Patricia Jiménez Ortiz', documento: '52345678', email: 'laura.jimenez@gmail.com', password: 'paciente123', rol: 'paciente', telefono: '3001112233', activo: true, epsId: 'eps1', fechaNacimiento: '1992-05-18', entidadNombre: '', entidadId: '' },
  { id: 'u12', nombre: 'Diego Fernando Ríos Cárdenas', documento: '53456789', email: 'diego.rios@outlook.com', password: 'paciente123', rol: 'paciente', telefono: '3102223344', activo: true, epsId: 'eps2', fechaNacimiento: '1988-09-30', entidadNombre: '', entidadId: '' },
  { id: 'u13', nombre: 'Sofía Alejandra Quintero Mora', documento: '54567890', email: 'sofia.quintero@gmail.com', password: 'paciente123', rol: 'paciente', telefono: '3203334455', activo: true, epsId: 'eps3', fechaNacimiento: '1995-12-02', entidadNombre: '', entidadId: '' },
  { id: 'u14', nombre: 'Jorge Alberto Vanegas Pardo', documento: '55678901', email: 'jorge.vanegas@yahoo.com', password: 'paciente123', rol: 'paciente', telefono: '3004445566', activo: true, epsId: 'eps4', fechaNacimiento: '1975-06-14', entidadNombre: '', entidadId: '' },
  { id: 'u15', nombre: 'Carmen Elena Duarte Beltrán', documento: '56789012', email: 'carmen.duarte@hotmail.com', password: 'paciente123', rol: 'paciente', telefono: '3105556677', activo: true, epsId: 'eps5', fechaNacimiento: '1982-04-25', entidadNombre: '', entidadId: '' },
  { id: 'u16', nombre: 'Andrés Felipe Ceballos Rojas', documento: '57890123', email: 'andres.ceballos@gmail.com', password: 'paciente123', rol: 'paciente', telefono: '3206667788', activo: true, epsId: 'eps1', fechaNacimiento: '1998-08-10', entidadNombre: '', entidadId: '' },
  { id: 'u17', nombre: 'Valentina Isabel Toro Londoño', documento: '58901234', email: 'valentina.toro@outlook.com', password: 'paciente123', rol: 'paciente', telefono: '3007778899', activo: true, epsId: 'eps3', fechaNacimiento: '1993-11-19', entidadNombre: '', entidadId: '' },

  // === EPS (5) ===
  { id: 'u4', nombre: 'Ana Patricia López', documento: '80234567', email: 'eps@sanitas.com', password: 'eps123', rol: 'eps', telefono: '6017426666', activo: true, epsId: 'eps1', fechaNacimiento: '', entidadNombre: 'EPS Sanitas', entidadId: 'eps1' },
  { id: 'u5', nombre: 'Roberto Mario Suárez', documento: '80345678', email: 'eps@sura.com', password: 'eps123', rol: 'eps', telefono: '6044048000', activo: true, epsId: 'eps2', fechaNacimiento: '', entidadNombre: 'EPS Sura', entidadId: 'eps2' },
  { id: 'u18', nombre: 'Gloria Patricia Mejía Arias', documento: '80456789', email: 'eps@nuevaeps.com', password: 'eps123', rol: 'eps', telefono: '6015551234', activo: true, epsId: 'eps3', fechaNacimiento: '', entidadNombre: 'Nueva EPS', entidadId: 'eps3' },
  { id: 'u19', nombre: 'Héctor Fabio Valencia Serna', documento: '80567890', email: 'eps@coomeva.com', password: 'eps123', rol: 'eps', telefono: '6023456789', activo: true, epsId: 'eps4', fechaNacimiento: '', entidadNombre: 'Coomeva EPS', entidadId: 'eps4' },
  { id: 'u20', nombre: 'Martha Cecilia Rincón Torres', documento: '80678901', email: 'eps@compensar.com', password: 'eps123', rol: 'eps', telefono: '6014445678', activo: true, epsId: 'eps5', fechaNacimiento: '', entidadNombre: 'Compensar EPS', entidadId: 'eps5' },

  // === FARMACIA (5) ===
  { id: 'u6', nombre: 'Lina María Castro Torres', documento: '52123456', email: 'farmacia@audifarma.com', password: 'farmacia123', rol: 'farmacia', telefono: '6014567890', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Audifarma Chapinero', entidadId: 'f1' },
  { id: 'u7', nombre: 'Jorge Enrique Vargas Silva', documento: '53123456', email: 'farmacia@cruzverde.com', password: 'farmacia123', rol: 'farmacia', telefono: '6017894561', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Cruz Verde Kennedy', entidadId: 'f2' },
  { id: 'u21', nombre: 'Ricardo Alonso Morales Díaz', documento: '54123456', email: 'farmacia@farmaservice.com', password: 'farmacia123', rol: 'farmacia', telefono: '6015678901', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Farmaservice Suba', entidadId: 'f3' },
  { id: 'u22', nombre: 'Adriana Milena Rojas Puerto', documento: '55123456', email: 'farmacia@colsubsidio.com', password: 'farmacia123', rol: 'farmacia', telefono: '6012345678', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Droguería Colsubsidio', entidadId: 'f4' },
  { id: 'u23', nombre: 'Fernando José Cifuentes Salazar', documento: '56123456', email: 'farmacia@pasteur.com', password: 'farmacia123', rol: 'farmacia', telefono: '6018901234', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Farmacias Pasteur Centro', entidadId: 'f5' },

  // === PROVEEDOR (2) ===
  { id: 'u8', nombre: 'Pedro Antonio Ramírez Gómez', documento: '74123456', email: 'proveedor@medifarma.com', password: 'proveedor123', rol: 'proveedor', telefono: '6045678901', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'MediFarma S.A.S.', entidadId: 'prov1' },
  { id: 'u9', nombre: 'Diana Marcela Rojas Guzmán', documento: '75123456', email: 'proveedor@lafrancol.com', password: 'proveedor123', rol: 'proveedor', telefono: '6012345678', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Lafrancol S.A.', entidadId: 'prov2' },

  // === ADMIN (1) ===
  { id: 'u10', nombre: 'Admin Sistema SNSDM', documento: '1111111111', email: 'admin@snsdm.gov.co', password: 'admin123', rol: 'admin', telefono: '6010000000', activo: true, epsId: '', fechaNacimiento: '', entidadNombre: 'Ministerio de Salud', entidadId: 'admin1' }
]

export default mockUsuarios
