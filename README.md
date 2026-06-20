# SNSDM — Sistema Nacional de Seguimiento y Disponibilidad de Medicamentos

Prototipo académico para Colombia. Plataforma digital para la gestión de medicamentos que integra a pacientes, EPS, farmacias y proveedores en un solo sistema.

**Universidad del Tolima · Ingeniería de Software IV Semestre · 2026**

---

## Instalación

```bash
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`.

---

## Credenciales de prueba

| Rol | Email / Documento | Contraseña |
|------|-------------------|------------|
| Paciente | 1020345678 | paciente123 |
| EPS | eps@sanitas.com | eps123 |
| Farmacia | farmacia@audifarma.com | farmacia123 |
| Proveedor | proveedor@medifarma.com | proveedor123 |

---

## Módulos

### Paciente
- Consulta de disponibilidad de medicamentos en tiempo real
- Reserva de medicamentos con/sin autorización de EPS
- Seguimiento de reservas y citas
- Visualización de estado de autorizaciones

### EPS
- Gestión de solicitudes de autorización de medicamentos
- Aprobación/rechazo con motivo detallado
- Historial completo con filtros y paginación
- Dashboard con estadísticas y gráficas

### Farmacia
- Gestión de inventario con semáforo de stock
- Ajustes rápidos de stock por medicamento
- Confirmación de entregas con firma digital
- Generación de comprobantes de entrega

### Proveedor
- Monitor de stock en todas las farmacias
- Alertas de inventario crítico
- Registro de suministros con lotes y vencimientos
- Dashboard con gráficas de demanda y suministros

---

## Stack tecnológico

- **React 18** + Vite
- **React Router v6** (rutas por rol)
- **Zustand** (estado global con datos mock)
- **Tailwind CSS** (estilos utilitarios)
- **Lucide React** (íconos)
- **Recharts** (gráficas interactivas)

---

## Estructura del proyecto

```
src/
├── data/                  # Datos mock (JSON/JS)
├── store/                 # Estado global Zustand
├── routes/                # Router con rutas protegidas
├── hooks/                 # Custom hooks
├── pages/
│   ├── paciente/          # Login, Dashboard, Buscar, Reservas, Citas
│   ├── eps/               # Login, Dashboard, Solicitudes, Historial
│   ├── farmacia/          # Login, Dashboard, Inventario, Entregas
│   └── proveedor/         # Login, Dashboard, Alertas, Suministros
├── components/
│   ├── shared/            # Navbar, Sidebar, Modal, Badge, etc.
│   ├── paciente/          # TarjetaMedicamento, FormularioReserva
│   ├── eps/               # TarjetaAutorizacion
│   ├── farmacia/          # TablaInventario
│   └── proveedor/         # AlertaStockCard
└── App.jsx
```

---

## Reglas de negocio implementadas

1. Creación automática de autorización al reservar medicamentos que la requieren
2. Aprobación de autorización → confirma la reserva y crea entrega pendiente
3. Rechazo de autorización → cancela la reserva automáticamente
4. Confirmación de entrega → descuenta stock de la farmacia
5. Registro de suministro → suma stock automáticamente
6. Stock crítico: stock ≤ stock mínimo → alertas al sistema

---

## Capturas de pantalla

*(Agregar capturas aquí)*
