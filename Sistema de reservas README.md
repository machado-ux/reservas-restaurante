# Sistema de Reservas Completo - Bar/Restaurant

Sistema de reservas completo con panel de administración para integrar en tu página web de Framer.

## 🎯 Características

### 👥 **Aplicación del Cliente** (`reservation-system.html`)
- ✅ Flujo paso a paso intuitivo (4 pasos)
- ✅ Selección de comensales (1-9 personas + grupos grandes 10+)
- ✅ Calendario de fechas con validación
- ✅ Selección de horarios dinámicos (según configuración del restaurant)
- ✅ Formulario de contacto validado
- ✅ Notificación por email al restaurante y cliente
- ✅ Diseño responsive y elegante
- ✅ Validaciones en cada paso
- ✅ Recordatorios automáticos de políticas

### 🎛️ **Panel de Administración** (`admin-panel.html`)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ **Configuración de horarios** (apertura, cierre, comidas, cenas)
- ✅ **Días operativos** configurables (selecciona qué días abre el restaurant)
- ✅ **Gestión de mesas** visual (20 mesas por defecto, configurable)
- ✅ **Aforo total** configurable y tracking en tiempo real
- ✅ **Alertas especiales** para grupos grandes (10+)
- ✅ Visualización de todas las reservas del día
- ✅ Confirmación/eliminación de reservas
- ✅ Vista de mesas (disponibles, reservadas, ocupadas)
- ✅ Filtro por fecha
- ✅ Estadísticas de ocupación

## 📋 Acceso a las Aplicaciones

- **Cliente**: `http://localhost:3000/` 
- **Administrador**: `http://localhost:3000/admin`

## 📋 Requisitos

- Node.js 16+
- Docker (opcional, para Supabase local)
- Cuenta de email (opcional) para notificaciones

## 🗄️ Base de datos con Supabase (Docker)

Puedes usar **Supabase** como base de datos en lugar del archivo `data.json`.

1. **Arrancar Supabase** (primera vez puede tardar: descarga imágenes Docker):
   ```bash
   npm run supabase:start
   ```
   Si falla por contenedor existente: `npm run supabase:stop` y luego `npm run supabase:start`.

2. **Ver URLs y la service_role key:**
   ```bash
   npm run supabase:status
   ```
   Copia `API URL` (ej. `http://127.0.0.1:54321`) y `service_role key`.

3. **Crear `.env`** con:
   ```env
   PORT=3000
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_SERVICE_ROLE_KEY=<la key que mostró supabase status>
   ```

4. **Iniciar el servidor:** `npm start`. Si hay variables de Supabase, usará la BD; si no, usará `data.json`.

- **Studio (UI de Supabase):** suele estar en `http://127.0.0.1:54323`.
- **Parar:** `npm run supabase:stop`.

Para **Supabase en la nube** (supabase.com): crea un proyecto, aplica el SQL de `supabase/migrations/` y en `.env` pon `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` de tu proyecto.

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
# Si estás usando Git
git clone [tu-repositorio]
cd reservation-system
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Email configuration
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicación
RESTAURANT_EMAIL=reservas@turestaurante.com

# Server configuration
PORT=3000
```

### 4. Configurar email de Gmail

Si usas Gmail, necesitas crear una "contraseña de aplicación":

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en dos pasos (actívala)
3. Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña en el archivo `.env`

## 🔧 Uso en Desarrollo

### Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### Probar el sistema

**Aplicación del Cliente:**
1. Abre `http://localhost:3000` en tu navegador
2. Completa el flujo de reserva
3. Verifica que recibes el email de notificación

**Panel de Administración:**
1. Abre `http://localhost:3000/admin` en tu navegador
2. Configura horarios y días operativos
3. Ve las reservas en tiempo real
4. Gestiona mesas y capacidad

### 🎛️ Configuración Inicial del Panel de Admin

1. **Accede al panel**: `http://localhost:3000/admin`
2. **Click en "⚙️ Configuración"**
3. **Configura los horarios**:
   - Hora de apertura y cierre
   - Horario de comidas (ej: 12:00 - 16:00)
   - Horario de cenas (ej: 19:00 - 23:00)
4. **Selecciona días operativos**: Click en los días que el restaurant abre
5. **Configura capacidad**:
   - Número de mesas (ej: 20)
   - Capacidad total (ej: 80 personas)
6. **Guarda los cambios**

Una vez configurado, estos horarios se aplicarán automáticamente en la aplicación del cliente.

## 🌐 Integración con Framer

### Opción 1: Embed Code (Recomendado)

1. En Framer, añade un componente **Embed**
2. Pega este código:

```html
<iframe 
  src="https://tu-dominio.com/reservation-system.html" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border: none; border-radius: 16px;">
</iframe>
```

### Opción 2: Custom Code Component

1. Crea un nuevo **Code Component** en Framer
2. Copia el contenido de `reservation-system.html`
3. Adapta los estilos según tu diseño

### Opción 3: Popup/Modal

Puedes hacer que el sistema aparezca como modal al hacer clic en "Reservar":

```javascript
// En tu página de Framer
<button onclick="openReservationModal()">Reservar Mesa</button>

<script>
function openReservationModal() {
  // Abre el sistema de reservas en un modal
  window.open('/reservation-system.html', 'reservas', 'width=700,height=900');
}
</script>
```

## 📧 Configuración de Emails

### Usando Gmail

El sistema está configurado por defecto para Gmail. Solo necesitas:
- Email de Gmail
- Contraseña de aplicación (ver instrucciones arriba)

### Usando SendGrid (Alternativa profesional)

1. Crea cuenta en [SendGrid](https://sendgrid.com)
2. Obtén tu API Key
3. Modifica `.env`:

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=tu-api-key
RESTAURANT_EMAIL=reservas@turestaurante.com
```

4. Actualiza `server.js` para usar SendGrid (código incluido en comentarios)

## 🎨 Personalización

### Colores

Edita las variables CSS en `reservation-system.html`:

```css
:root {
    --primary: #2C2416;      /* Color principal */
    --secondary: #D4A574;    /* Color acento */
    --accent: #8B6F47;       /* Color secundario */
    --bg: #FAF8F5;          /* Fondo */
    --text: #2C2416;        /* Texto */
    --error: #C44536;       /* Errores */
    --success: #5B8C5A;     /* Éxito */
}
```

### Horarios

Modifica el array `timeSlots` en el JavaScript:

```javascript
const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',  // Comidas
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'   // Cenas
];
```

### Mensajes y Avisos

Edita directamente el HTML para cambiar los textos de advertencia, mensajes de confirmación, etc.

## 📱 Responsive

El sistema es totalmente responsive y se adapta a:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔒 Seguridad

- ✅ Validación de formularios en frontend
- ✅ Validación de formularios en backend
- ✅ Protección contra inyección SQL (usar base de datos)
- ✅ Rate limiting en el servidor
- ✅ Sanitización de inputs

**Importante**: Para producción, implementa:
1. Base de datos para guardar reservas
2. Sistema de autenticación para panel de admin
3. HTTPS/SSL
4. CORS configurado correctamente

## 📊 Próximos Pasos (Opcional)

### Panel de Administración

Puedes añadir:
- Dashboard para ver todas las reservas
- Calendario visual de ocupación
- Gestión de horarios y disponibilidad
- Confirmación manual de reservas
- Sistema de recordatorios por SMS/WhatsApp

### Base de Datos

Conecta con PostgreSQL, MySQL o MongoDB para:
- Guardar reservas
- Historial de clientes
- Estadísticas de ocupación
- Gestión de disponibilidad real

### Integraciones

- WhatsApp API para confirmaciones
- Google Calendar sync
- Sistema de pagos (señal/depósito)
- CRM para gestión de clientes

## 🆘 Soporte

Si tienes problemas:

1. Verifica que Node.js está instalado: `node --version`
2. Verifica las variables de entorno en `.env`
3. Revisa los logs del servidor en la consola
4. Verifica que el puerto 3000 esté libre

## 📄 Licencia

Este proyecto es de uso libre para tu restaurante/bar.

---

**¿Necesitas ayuda?** Contacta con tu desarrollador para implementación personalizada.
