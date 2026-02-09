# 📊 Guía del Panel de Administración

## 🚀 Acceso al Panel

URL: `http://localhost:3000/admin` (o `https://tu-dominio.com/admin` en producción)

---

## 📋 Vista General del Dashboard

El panel muestra 4 métricas principales en tiempo real:

### 1. **Reservas Hoy**
- Total de reservas para el día seleccionado
- Actualización automática

### 2. **Comensales**
- Total de personas esperadas
- Suma de todos los comensales de las reservas

### 3. **Grupos Grandes** ⚠️
- Número de reservas de 10+ personas
- **ALERTA ESPECIAL**: Aparecen marcadas en rojo en la lista

### 4. **Aforo**
- Porcentaje de ocupación actual
- Barra de progreso visual
- Plazas disponibles restantes
- **Código de colores**:
  - Verde: < 80% ocupación
  - Rojo: > 80% ocupación (casi lleno)

---

## ⚙️ Configuración del Restaurante

### Cómo Acceder
Click en el botón **"⚙️ Configuración"** en la esquina superior derecha.

### Opciones Disponibles

#### 1️⃣ **Horarios de Operación**

**Hora de Apertura/Cierre**
- Define el horario general del restaurant
- Ejemplo: Apertura 12:00, Cierre 23:00

**Horario de Comidas**
- Inicio: 12:00
- Fin: 16:00
- Los clientes verán estos horarios en la app

**Horario de Cenas**
- Inicio: 19:00
- Fin: 23:00
- Se generan slots cada 30 minutos

**💡 Tip**: Los horarios que configures aquí se mostrarán automáticamente en la aplicación del cliente. Si cambias el horario de cenas a 20:00-00:00, los clientes solo verán esos horarios disponibles.

#### 2️⃣ **Días Operativos**

Selecciona los días que el restaurant está abierto:
- Click en cada día para activar/desactivar
- Los días seleccionados aparecen en color naranja
- Los clientes solo podrán reservar en días operativos

**Ejemplo**: Si solo abres Jue-Dom, selecciona solo esos 4 días.

#### 3️⃣ **Mesas y Capacidad**

**Número de Mesas**
- Total de mesas en el restaurant
- Por defecto: 20 mesas
- Rango: 1-50 mesas

**Capacidad Total**
- Máximo de comensales simultáneos
- Por defecto: 80 personas
- El sistema bloqueará reservas cuando se alcance

**💡 Distribución de Mesas** (configuración actual):
- Mesas 1-8: 2 personas cada una (16 plazas)
- Mesas 9-14: 4 personas cada una (24 plazas)
- Mesas 15-18: 6 personas cada una (24 plazas)
- Mesas 19-20: 8 personas cada una (16 plazas)
- **Total: 80 plazas**

---

## 📅 Gestión de Reservas

### Cambiar Fecha
Usa el selector de fecha en la parte superior para ver reservas de otros días.

### Lista de Reservas

Cada tarjeta de reserva muestra:
- **Nombre** del cliente
- **Fecha y hora** de la reserva
- **Número de comensales**
- **Teléfono** de contacto
- **Estado**: Pendiente o Confirmada

#### 🚨 Reservas de Grupos Grandes

Las reservas de **10+ personas** tienen:
- **Fondo rojo claro**
- **Badge "⚠️ GRUPO GRANDE"** pulsante
- **Borde rojo** en la tarjeta

**¿Por qué es importante?**
- Requieren más atención
- Pueden necesitar mesas agrupadas
- Afectan significativamente el aforo

### Acciones Rápidas

#### ✓ Confirmar
- Click en "✓ Confirmar" para marcar como confirmada
- La tarjeta cambia a borde verde
- No envía email automático (ya se envió al crear la reserva)

#### 👁️ Ver Detalles
- Abre modal con toda la información
- Muestra: nombre, teléfono, email, fecha, hora, comensales, estado, ID
- Opciones adicionales: Confirmar o Eliminar

#### 🗑️ Eliminar
- Desde el modal de detalles
- Requiere confirmación
- Elimina la reserva permanentemente

---

## 🪑 Estado de Mesas

### Vista Visual
El panel muestra todas las mesas en una cuadrícula con:
- **Número de mesa**
- **Capacidad** (2, 4, 6 u 8 personas)
- **Estado** (código de colores)

### Estados de Mesa

#### 🟢 **Disponible** (Verde)
- Mesa sin reserva
- Lista para asignar

#### 🟠 **Reservada** (Naranja)
- Mesa tiene reserva confirmada
- No disponible para ese horario

#### 🔴 **Ocupada** (Rojo)
- Mesa actualmente en uso
- Clientes presentes

### Leyenda
La leyenda en la parte inferior explica cada color.

**💡 Funcionalidad Futura**: Click en una mesa para asignarla a una reserva específica.

---

## 🔄 Actualizar Datos

Click en **"🔄 Actualizar"** para:
- Recargar reservas
- Actualizar estadísticas
- Refrescar estado de mesas
- Sincronizar configuración

Se actualiza automáticamente cada vez que:
- Llega una nueva reserva
- Confirmas/eliminas una reserva
- Cambias la configuración

---

## 📧 Notificaciones por Email

Cuando llega una **nueva reserva**, recibes un email con:

### Email Normal
- Asunto: "🍽️ Nueva Reserva - [Nombre Cliente]"
- Detalles completos de la reserva
- Datos de contacto del cliente
- Link al panel de admin

### Email de Grupo Grande
- Asunto: "🍽️ Nueva Reserva - [Nombre] **[GRUPO GRANDE]**"
- Badge rojo destacado: "⚠️ GRUPO GRANDE (10+)"
- Mismos detalles + alerta visual

**💡 Tip**: Configura filtros en tu email para destacar reservas de grupos grandes.

---

## 📊 Métricas y Estadísticas

### Aforo en Tiempo Real

**Cómo se calcula**:
1. Suma todos los comensales de reservas confirmadas
2. Compara con capacidad total
3. Muestra porcentaje y plazas restantes

**Ejemplo**:
- Capacidad total: 80 personas
- Reservas confirmadas: 56 personas
- Aforo usado: 70%
- Disponible: 24 plazas

**Alerta de Capacidad**:
- **< 80%**: Barra verde - Normal
- **> 80%**: Barra roja - Casi lleno
- **100%**: El sistema no aceptará más reservas para ese día

### Filtro por Fecha

- Cambia la fecha para ver otros días
- Las estadísticas se recalculan automáticamente
- Útil para planificar días con alta demanda

---

## 💡 Mejores Prácticas

### 1. **Configuración Inicial**
- Configura horarios desde el primer día
- Selecciona correctamente los días operativos
- Ajusta la capacidad a tu realidad

### 2. **Gestión Diaria**
- Revisa el panel cada mañana
- Confirma reservas telefónicamente
- Presta atención extra a grupos grandes

### 3. **Grupos Grandes**
- Contacta con el cliente para confirmar
- Planifica la distribución de mesas
- Considera reservar zona específica

### 4. **Comunicación**
- Los datos de contacto están siempre visibles
- Llama si hay dudas sobre la reserva
- Confirma grupos grandes 24h antes

### 5. **Capacidad**
- Monitorea el aforo regularmente
- Si llegas al 80%, considera cerrar ciertas franjas
- Ajusta la capacidad si cambias distribución de mesas

---

## 🔐 Seguridad

### Acceso al Panel
- **Actualmente**: Sin autenticación (desarrollo)
- **Producción**: Implementar login con usuario/contraseña
- **Recomendado**: Usar HTTPS siempre

### Protección de Datos
- Los datos se guardan en `data.json` en el servidor
- **Importante**: En producción, usar base de datos real (PostgreSQL, MySQL)
- Hacer backups regulares

---

## 🆘 Problemas Comunes

### "No se cargan las reservas"
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador (F12)
- Actualiza la página (F5)

### "Los horarios no aparecen en la app del cliente"
- Guarda la configuración en el panel de admin
- Recarga la aplicación del cliente
- Verifica que los días operativos estén seleccionados

### "El email no llega"
- Verifica configuración en `.env`
- Revisa spam/correo no deseado
- Comprueba logs del servidor

### "Las estadísticas no coinciden"
- Click en "🔄 Actualizar"
- Verifica que la fecha sea correcta
- Recarga la página

---

## 📱 Uso en Móvil

El panel es **completamente responsive**:
- Dashboard se adapta a pantalla pequeña
- Estadísticas se muestran en columna
- Mesas en cuadrícula adaptativa
- Modales optimizados para móvil

**💡 Tip**: Accede desde tablet para mejor experiencia.

---

## 🚀 Próximos Pasos (Opcional)

### Funcionalidades Avanzadas

1. **Asignación Automática de Mesas**
   - Click en mesa → Asignar a reserva
   - Algoritmo de optimización

2. **Historial de Clientes**
   - Ver reservas anteriores
   - Clientes frecuentes
   - Notas especiales

3. **Reportes y Analytics**
   - Ocupación por día de la semana
   - Horarios más populares
   - Ingresos estimados

4. **Notificaciones Push**
   - Alertas en tiempo real
   - Recordatorios automáticos
   - WhatsApp integration

5. **Multi-usuario**
   - Diferentes niveles de acceso
   - Host, manager, admin
   - Log de acciones

---

## 📞 Soporte

Si tienes dudas sobre el panel de administración, consulta:
- **README.md**: Guía completa del sistema
- **QUICK_START.md**: Inicio rápido
- **CURSOR_SETUP.md**: Desarrollo y personalización

---

**¡Listo para gestionar tu restaurante eficientemente! 🎉**
