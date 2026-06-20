# 💊 SNSDM — Sistema Nacional de Seguimiento y Disponibilidad de Medicamentos

**Universidad del Tolima — Facultad de Ingeniería de Sistemas**  
**Ingeniería de Software IV Semestre — 2026**  
**Docente:** Edna Lucero Triana Salgado

---

## 📋 Problemática

En Colombia, la **falta de disponibilidad de medicamentos** en farmacias y hospitales es un problema recurrente que afecta a millones de pacientes. Los principales puntos críticos son:

- **Fragmentación de la información**: No existe un sistema unificado que permita a pacientes, EPS, farmacias y proveedores conocer en tiempo real la disponibilidad de medicamentos.
- **Procesos manuales y lentos**: Las autorizaciones de medicamentos por parte de las EPS se manejan con trámites presenciales o llamadas telefónicas, generando demoras de días o semanas.
- **Desabastecimiento evitable**: Los proveedores no reciben alertas tempranas sobre stock crítico, lo que lleva a rupturas de inventario que podrían prevenirse.
- **Falta de trazabilidad**: No hay un historial clínico accesible que integre diagnósticos, fórmulas médicas, autorizaciones y entregas.
- **Ineficiencia en dispensación**: Las farmacias carecen de herramientas digitales para gestionar inventarios, confirmar entregas y registrar fallos de suministro.

---

## ✅ Nuestra solución

**SNSDM** es un prototipo web que integra a los cuatro actores del ecosistema farmacéutico colombiano en una sola plataforma, demostrando cómo la tecnología puede resolver estos problemas:

| Problema | Solución implementada |
|----------|----------------------|
| Información fragmentada | Base de datos centralizada con consulta en tiempo real de disponibilidad |
| Autorizaciones lentas | Flujo digital de solicitud → aprobación/rechazo con notificaciones instantáneas |
| Desabastecimiento | Alertas automáticas de stock crítico + dashboard de tendencias |
| Sin trazabilidad | Historial clínico completo con citas, fórmulas, autorizaciones y entregas |
| Gestión manual de inventario | Panel de control con semáforo de stock, ajustes rápidos y reportes |

---

## 🚀 Funcionalidades principales

### 👤 Paciente
- **Login con OTP**: 3 canales (correo, SMS, WhatsApp), código mock `1234`
- **Buscar medicamentos**: Disponibilidad en tiempo real por farmacia
- **Reservar medicamentos**: Con o sin autorización de EPS, reprogramación de citas
- **Mis reservas**: Seguimiento completo con estado y reprogramación
- **Mis citas médicas**: Calendario visual con historial
- **Historial médico**: Citas realizadas con detalle, fórmulas activas/vencidas, reservar medicamentos desde fórmula, solicitar autorización de extensión a la EPS, descargar historial clínico
- **Farmacias cercanas**: Mapa Leaflet con geolocalización, favoritos
- **Chat**: Comunicación directa con farmacias

### 🏥 EPS
- **Dashboard**: Estadísticas de solicitudes, aprobaciones y rechazos con gráficas
- **Solicitudes pendientes**: Aprobación/rechazo con motivo, incluye extensiones de fórmulas médicas
- **Historial de autorizaciones**: Filtros por estado, fecha y paciente

### 💊 Farmacia
- **Dashboard**: Resumen de operaciones, entregas pendientes y completadas
- **Gestión de inventario**: Tabla con semáforo visual (verde/amarillo/rojo), ajustes rápidos de stock
- **Confirmar entregas**: Flujo completo con registro de fallos y motivo

### 🚚 Proveedor
- **Dashboard**: Monitoreo de stock en todas las farmacias, gráficas de demanda y suministros
- **Alertas de stock**: Notificaciones de inventario crítico
- **Registrar suministro**: Formulario con lotes, cantidades y fechas de vencimiento
- **Mensajes**: Chat con farmacias

### ⚙️ Compartido
- **Modo oscuro**: Toggle persistente en localStorage
- **Notificaciones**: En tiempo real con badge en navbar
- **Perfil**: Edición de datos, cambio de contraseña, programación de notificaciones
- **Selector de color acento**: 6 colores disponibles
- **Chat flotante**: Comunicación entre roles
- **Exportación PDF y CSV**: Reportes con encabezado institucional

---

## 👥 Equipo CIPA

| Integrante | Rol |
|------------|-----|
| Juan Sebastian Sandoval | Desarrollo frontend y store |
| Andres Cipamocha | Mock data y lógica de negocio |
| Cebastian Molina | Componentes UI y diseño responsive |
| Diego Lavacude | Documentación y testing |

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.3 | Interfaz de usuario |
| Vite | 6.0 | Bundler y dev server |
| React Router | 6.28 | Navegación por roles |
| Zustand | 5.0 | Estado global con persistencia |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Lucide React | 0.460 | Íconos |
| Recharts | 2.13 | Gráficas interactivas |
| Leaflet + react-leaflet | 1.9 / 4.2 | Mapas interactivos |
| jsPDF + jspdf-autotable | 4.2 | Exportación PDF |
| html2canvas | — | Captura de gráficas |

---

## 📦 Instalación

```bash
git clone https://github.com/Sebas0317/sistema-de-medicamentos-nacional.git
cd sistema-de-medicamentos-nacional
npm install
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`.

### Compartir en red (ngrok)

```bash
npm run share
```

---

## 🔑 Credenciales de prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| **Paciente** | Documento 1020345678 | `paciente123` |
| **EPS** | `eps@nuevaeps.com` | `eps123` |
| **Farmacia** | `farmacia@audifarma.com` | `farmacia123` |
| **Proveedor** | `proveedor@medifarma.com` | `proveedor123` |
| **Admin** | `admin@snsdm.gov.co` | `admin123` |

OTP mock: código `1234`, cualquier documento de 8–10 dígitos funciona.

---

## 🗂️ Estructura del proyecto

```
src/
├── data/                        # Datos mock (10 archivos)
│   ├── mockUsuarios.js          # 23 usuarios (10 pacientes, 5 EPS, 5 farmacias, 2 proveedores, 1 admin)
│   ├── mockMedicamentos.js      # 15 medicamentos
│   ├── mockInventario.js        # 75 registros (5 farmacias × 15 medicamentos)
│   ├── mockReservas.js          # 25 reservas
│   ├── mockAutorizaciones.js    # 18 autorizaciones con diagnósticos CIE-10
│   ├── mockEntregas.js          # 16 entregas
│   ├── mockSuministros.js       # 18 suministros
│   ├── mockFarmacias.js         # 5 farmacias
│   ├── mockEPS.js               # 5 EPS
│   ├── mockCentrosSalud.js      # 5 centros de salud
│   ├── mockCitasMedicas.js      # 16 citas médicas
│   └── mockFormulasMedicas.js   # 14 fórmulas médicas
├── store/
│   └── useStore.js              # Estado global Zustand (1000+ líneas)
├── routes/
│   └── AppRouter.jsx            # Router con 8 rutas protegidas por rol
├── pages/
│   ├── paciente/                # 7 páginas
│   ├── eps/                     # 3 páginas
│   ├── farmacia/                # 3 páginas
│   ├── proveedor/               # 5 páginas
│   ├── admin/                   # 3 páginas
│   └── shared/                  # Perfil, LandingPage
├── components/
│   └── shared/                  # Navbar, Modal, Badge, Toast, Chat, etc.
└── App.jsx                      # Entry point
```

---

## 📊 Reglas de negocio implementadas

1. **Reserva de medicamentos**: Verifica disponibilidad en inventario antes de reservar
2. **Autorizaciones automáticas**: Al reservar un medicamento que requiere autorización, se crea una solicitud pendiente para la EPS
3. **Aprobación de autorización**: Confirma la reserva, descuenta stock y crea una entrega pendiente
4. **Rechazo de autorización**: Cancela la reserva automáticamente con notificación al paciente
5. **Extensión de fórmulas**: La EPS puede aprobar extensión de fórmula vencida por 90 días
6. **Confirmación de entrega**: Descuenta stock definitivamente, genera comprobante
7. **Registro de fallo**: Las farmacias pueden marcar entregas como fallidas con motivo
8. **Stock crítico**: stock ≤ stock mínimo → alertas automáticas al proveedor
9. **Registro de suministro**: Suma stock al inventario de la farmacia
10. **Vencimiento automático**: Las reservas vencidas se cancelan automáticamente al ingresar al dashboard
11. **Notificaciones programadas**: El paciente puede programar recordatorios que se ejecutan cada 30 segundos
12. **Chat**: Mensajes persistentes entre farmacia y proveedor con filtro por farmacia

---

## 🔒 Seguridad

- **Rutas protegidas**: Cada rol tiene acceso exclusivo a sus páginas
- **Persistencia selectiva**: Solo datos no sensibles se guardan en localStorage
- **Autenticación mock**: Login con hash de contraseña simulado
- **OTP**: Validación de código de un solo uso

---

## 🌐 Repositorio

[https://github.com/Sebas0317/sistema-de-medicamentos-nacional.git](https://github.com/Sebas0317/sistema-de-medicamentos-nacional.git)
