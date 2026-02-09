# 🚀 Inicio Rápido - Sistema de Reservas

## ⚡ Empezar en 5 minutos

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar email
Copia `.env.example` a `.env` y edita:
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicación
RESTAURANT_EMAIL=reservas@turestaurante.com
```

### Paso 3: Iniciar servidor
```bash
npm start
```

### Paso 4: Probar

**Aplicación del Cliente:**
Abre http://localhost:3000 y haz una reserva de prueba.

**Panel de Administración:**
Abre http://localhost:3000/admin y configura tu restaurant.

---

## 🎛️ Primera Configuración (Panel de Admin)

1. Abre http://localhost:3000/admin
2. Click en **"⚙️ Configuración"**
3. Configura:
   - Horarios (apertura/cierre, comidas, cenas)
   - Días operativos (marca los días que abres)
   - Número de mesas y capacidad total
4. Click en **"Guardar Cambios"**

✅ ¡Listo! Ahora los clientes verán tus horarios reales.

---

## 📧 Cómo obtener contraseña de aplicación de Gmail

1. Ve a https://myaccount.google.com/security
2. Activa la **Verificación en dos pasos**
3. Busca **Contraseñas de aplicaciones**
4. Genera una nueva para "Correo"
5. Copia la contraseña de 16 dígitos
6. Pégala en `.env` como `EMAIL_PASSWORD`

⚠️ **IMPORTANTE:** NO uses tu contraseña normal de Gmail.

---

## 🎨 Personalización Rápida

### Cambiar colores
Edita `reservation-system.html`, línea ~21:

```css
:root {
    --primary: #2C2416;      /* Color principal */
    --secondary: #D4A574;    /* Color acento (botones) */
    --accent: #8B6F47;       /* Color secundario */
}
```

### Cambiar horarios
Edita `reservation-system.html`, línea ~400:

```javascript
const timeSlots = [
    '12:00', '12:30', '13:00', // Añade o quita horarios
];
```

### Cambiar número máximo de comensales
Edita la sección de "guest-selector" en el HTML para añadir más opciones.

---

## 🌐 Subir a Internet (Deploy)

### Opción 1: Vercel (Gratis)
```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify
1. Sube a GitHub
2. Conecta en netlify.com
3. Configura variables de entorno

---

## 🔧 Integrar en Framer

Una vez que tengas el sistema funcionando online:

1. En Framer, añade un **Embed Component**
2. Usa este código:

```html
<iframe 
  src="https://TU-URL.vercel.app" 
  width="100%" 
  height="950px" 
  frameborder="0"
  style="border: none; border-radius: 16px;">
</iframe>
```

---

## ✅ Checklist de Primera Vez

- [ ] Node.js instalado (verifica con `node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Gmail: contraseña de aplicación obtenida
- [ ] Servidor iniciado (`npm start`)
- [ ] Prueba de reserva realizada
- [ ] Email de confirmación recibido
- [ ] Colores personalizados (opcional)
- [ ] Horarios ajustados (opcional)

---

## 🆘 Problemas Comunes

**Error: "Cannot find module"**
→ Ejecuta `npm install`

**Error de email**
→ Verifica `.env` y contraseña de aplicación de Gmail

**Puerto 3000 ocupado**
→ Cambia `PORT=3001` en `.env`

**No recibo emails**
→ Revisa spam/correo no deseado

---

## 📚 Documentación Completa

- `README.md` - Guía completa del sistema
- `FRAMER_INTEGRATION.md` - Integración con Framer
- `.env.example` - Variables de entorno

---

## 💡 Siguiente Paso

Una vez funcionando en local:
1. Personaliza colores y textos
2. Sube a Vercel/Netlify
3. Integra en tu web de Framer
4. ¡Empieza a recibir reservas! 🎉

---

**¿Necesitas ayuda?** Lee la documentación completa en README.md
