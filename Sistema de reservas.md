# 🏗️ Arquitectura del Sistema

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE RESERVAS                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                              ┌──────────────────┐
│                  │                              │                  │
│  APLICACIÓN      │◄────────────────────────────►│  PANEL DE        │
│  DEL CLIENTE     │     Comunicación API         │  ADMINISTRACIÓN  │
│                  │                              │                  │
│ (Puerto 3000)    │                              │ (Puerto 3000     │
│                  │                              │  /admin)         │
└────────┬─────────┘                              └────────┬─────────┘
         │                                                 │
         │                                                 │
         └──────────────┬──────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │                  │
              │  SERVIDOR API    │
              │  (Node.js +      │
              │   Express)       │
              │                  │
              └────────┬─────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ data.   │  │ Email   │  │ Config  │
   │ json    │  │ Service │  │ Manager │
   └─────────┘  └─────────┘  └─────────┘
   (Reservas)   (Nodemailer)  (Settings)
```

---

## 🔄 Flujo de Reserva Completo

### 1️⃣ **Cliente hace una reserva**

```
Cliente → Paso 1: Comensales
       ↓
       Paso 2: Fecha (valida días operativos)
       ↓
       Paso 3: Hora (obtiene slots del servidor)
       ↓  
       GET /api/available-slots?date=2024-02-10
       ← Servidor devuelve horarios según config
       ↓
       Paso 4: Datos personales + Confirmación
       ↓
       POST /api/send-reservation
       {
         name, phone, email,
         guests, date, time
       }
```

### 2️⃣ **Servidor procesa la reserva**

```
Servidor recibe POST /api/send-reservation
       ↓
   Valida datos
       ↓
   Genera ID único
       ↓
   Guarda en data.json
       ↓
   ┌─────────┴─────────┐
   ▼                   ▼
Email al           Email al
Restaurant         Cliente
(con badge si     (confirmación)
es grupo grande)
       │               │
       └───────┬───────┘
               ↓
         Respuesta al cliente
         { success: true }
```

### 3️⃣ **Admin ve la reserva**

```
Admin abre /admin
       ↓
   GET /api/admin/reservations?date=hoy
       ←
   Servidor devuelve array de reservas
       ↓
   Dashboard actualiza:
   - Lista de reservas
   - Estadísticas
   - Aforo
   - Estado de mesas
```

---

## 🗂️ Estructura de Datos

### Configuración del Restaurant (`config`)

```javascript
{
  openingTime: '12:00',
  closingTime: '23:00',
  lunchStart: '12:00',
  lunchEnd: '16:00',
  dinnerStart: '19:00',
  dinnerEnd: '23:00',
  operatingDays: [1, 2, 3, 4, 5, 6, 0], // Lun-Dom
  timeSlotInterval: 30, // minutos
  totalTables: 20,
  totalCapacity: 80,
  tables: [
    { id: 1, number: 1, capacity: 2, status: 'available' },
    { id: 2, number: 2, capacity: 2, status: 'reserved' },
    // ...
  ]
}
```

### Reserva (`reservation`)

```javascript
{
  id: '1707234567890',
  name: 'Juan Pérez',
  phone: '+34 612 345 678',
  email: 'juan@email.com',
  guests: '4', // o '10+' para grupos grandes
  date: '2024-02-10',
  time: '20:00',
  status: 'pending', // o 'confirmed'
  createdAt: '2024-02-07T10:30:00.000Z',
  assignedTables: [] // Array de IDs de mesas
}
```

---

## 🔌 Endpoints de la API

### Endpoints Públicos (Cliente)

#### `GET /`
- Sirve la aplicación del cliente
- HTML: `reservation-system.html`

#### `GET /api/available-slots?date=YYYY-MM-DD`
- Devuelve horarios disponibles para una fecha
- Considera:
  - Días operativos
  - Horarios configurados
  - Capacidad disponible
- Respuesta:
```javascript
{
  success: true,
  slots: [
    { time: '12:00', available: true, remainingCapacity: 80 },
    { time: '12:30', available: true, remainingCapacity: 76 },
    { time: '20:00', available: false, remainingCapacity: 0 }
  ]
}
```

#### `POST /api/send-reservation`
- Crea nueva reserva
- Envía emails
- Guarda en base de datos
- Body: `{ name, phone, email, guests, date, time }`

---

### Endpoints Privados (Admin)

#### `GET /admin`
- Sirve el panel de administración
- HTML: `admin-panel.html`

#### `GET /api/admin/config`
- Obtiene configuración del restaurant
- Respuesta: `{ success: true, config: {...} }`

#### `PUT /api/admin/config`
- Actualiza configuración
- Body: Objeto con configuración completa
- Regenera mesas si cambia `totalTables`

#### `GET /api/admin/reservations?date=YYYY-MM-DD`
- Obtiene reservas de una fecha
- Sin parámetro `date`: devuelve todas
- Respuesta: `{ success: true, reservations: [...] }`

#### `PUT /api/admin/reservations/:id`
- Actualiza estado de reserva
- Body: `{ status: 'confirmed', assignedTables: [1, 2] }`

#### `DELETE /api/admin/reservations/:id`
- Elimina una reserva
- Requiere ID de reserva

#### `GET /api/admin/stats?date=YYYY-MM-DD`
- Estadísticas del día
- Respuesta:
```javascript
{
  success: true,
  stats: {
    totalReservations: 15,
    totalGuests: 56,
    remainingCapacity: 24,
    capacityUsed: 70, // porcentaje
    largeGroups: 2,
    confirmedReservations: 12,
    totalTables: 20
  }
}
```

---

## 💾 Almacenamiento de Datos

### Desarrollo (Actual)
```
data.json
├── config: { ... }
└── reservations: [ ... ]
```

- Archivo JSON en el servidor
- Se carga al inicio
- Se guarda en cada cambio
- **Limitación**: No apto para múltiples servidores

### Producción (Recomendado)

```
PostgreSQL / MySQL / MongoDB
├── tabla: restaurant_config
├── tabla: reservations
├── tabla: tables
└── tabla: customers (opcional)
```

**Beneficios**:
- Concurrencia
- Backups automáticos
- Búsquedas rápidas
- Relaciones entre datos
- Escalabilidad

---

## 🔐 Flujo de Autenticación (Futuro)

```
Admin → /admin
      ↓
  ¿Autenticado?
      │
      ├─ NO → Redirect a /login
      │          ↓
      │      Formulario login
      │          ↓
      │      POST /api/auth/login
      │          ↓
      │      Genera JWT token
      │          ↓
      │      Guarda en cookie
      │          ↓
      └─ SÍ → Muestra panel
               ↓
           Todas las peticiones incluyen:
           Authorization: Bearer [token]
```

---

## 📧 Flujo de Emails

```
Nueva Reserva
      ↓
  ┌────────┴────────┐
  ▼                 ▼
Email a          Email a
Restaurant       Cliente
      │              │
      │              │
Template HTML    Template HTML
con detalles     con confirmación
      │              │
      ├─ Si grupo   │
      │  grande:    │
      │  badge rojo │
      │              │
      └──────┬───────┘
             ↓
        Nodemailer
             ↓
        SMTP Server
        (Gmail)
             ↓
      📬 Buzón de correo
```

---

## 🎨 Flujo de Interfaz

### Cliente

```
Landing
  │
  ├─ Header
  ├─ Progress Bar (4 pasos)
  ├─ Step 1: Guest Selector
  │   └─ Validación: required
  ├─ Step 2: Date Picker
  │   └─ Validación: fecha futura + día operativo
  ├─ Step 3: Time Slots (dinámicos)
  │   └─ Fetch de /api/available-slots
  ├─ Step 4: Contact Form + Summary
  │   └─ Validación: email, phone, name
  └─ Success: Confirmación visual
```

### Admin

```
Dashboard
  │
  ├─ Header (date selector, config, refresh)
  ├─ Stats Grid (4 cards)
  │   ├─ Total reservas
  │   ├─ Total comensales
  │   ├─ Grupos grandes (alerta)
  │   └─ Aforo (barra progreso)
  ├─ Main Content
  │   ├─ Reservations List
  │   │   ├─ Card (normal)
  │   │   └─ Card (grupo grande - rojo)
  │   └─ Tables Grid
  │       ├─ Mesa disponible (verde)
  │       ├─ Mesa reservada (naranja)
  │       └─ Mesa ocupada (rojo)
  ├─ Modals
  │   ├─ Config Modal
  │   └─ Details Modal
  └─ Toast Notifications
```

---

## 🔄 Sincronización en Tiempo Real

### Actual (Polling Manual)
```
Usuario hace click en "Actualizar"
       ↓
   Fetch nuevos datos
       ↓
   Actualiza UI
```

### Futuro (WebSockets - Opcional)
```
Nueva reserva creada
       ↓
Servidor emite evento via WebSocket
       ↓
Admin panel escucha evento
       ↓
Actualiza UI automáticamente
       ↓
🔔 Notificación visual
```

**Implementación**:
- Usar Socket.io
- Conexión persistente
- Updates en tiempo real
- Sin necesidad de recargar

---

## 📱 Responsive Breakpoints

```
Mobile:     < 768px
  └─ Columna única
  └─ Stats apilados
  └─ Header vertical

Tablet:     768px - 1024px
  └─ 2 columnas en stats
  └─ Main content apilado
  └─ Mesas en grid 4-6 cols

Desktop:    > 1024px
  └─ 4 columnas en stats
  └─ Main content 2 cols
  └─ Mesas en grid 6-8 cols
```

---

## 🚀 Deployment Flow

```
Desarrollo Local
       ↓
   Git commit
       ↓
   Push a GitHub
       ↓
   Vercel/Netlify detecta
       ↓
   Build automático
       ↓
   Deploy a producción
       ↓
   URL final: https://tu-restaurant.vercel.app
       │
       ├─ /         → Cliente
       └─ /admin    → Admin
```

---

## 🔍 Debugging Tips

### Cliente no ve horarios:
```
1. Verifica config en /admin
2. Check días operativos
3. Console del navegador (F12)
4. Network tab → /api/available-slots
```

### Emails no llegan:
```
1. Logs del servidor (terminal)
2. Verifica .env
3. Test SMTP:
   node -e "require('./server.js')"
4. Check spam
```

### Stats incorrectas:
```
1. Verifica data.json
2. Fecha correcta en date selector
3. Refresh browser
4. Server logs
```

---

¿Necesitas más detalles sobre alguna parte específica? Consulta la documentación completa en los archivos README y guías específicas.
