# Guía de Integración con Framer

Esta guía te ayudará a integrar el sistema de reservas en tu página web de Framer.

## 📋 Opciones de Integración

### Opción 1: Embed Completo (Recomendado)

Esta es la opción más sencilla y mantiene toda la funcionalidad.

#### Pasos:

1. **Sube tu sistema a un servidor**
   - Puedes usar Vercel, Netlify, o tu propio hosting
   - Necesitarás el backend funcionando para los emails

2. **En Framer:**
   - Añade un componente **Embed** a tu página
   - Usa este código:

```html
<iframe 
  src="https://tu-dominio.com/reservation-system.html" 
  width="100%" 
  height="950px" 
  frameborder="0"
  style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</iframe>
```

3. **Ajusta el estilo** si es necesario para que coincida con tu diseño

---

### Opción 2: Modal/Popup

Abre el sistema de reservas como ventana emergente.

#### En Framer (Custom Code):

```javascript
// Añade un botón en Framer con ID "reservar-btn"

<script>
document.getElementById('reservar-btn').addEventListener('click', function() {
  // Opción A: Modal en la misma página
  const modal = document.createElement('div');
  modal.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  modal.innerHTML = `
    <div style="position: relative; width: 100%; max-width: 700px;">
      <button onclick="this.closest('.modal').remove()" 
              style="position: absolute; top: -40px; right: 0; 
                     background: white; border: none; border-radius: 50%;
                     width: 35px; height: 35px; cursor: pointer; 
                     font-size: 20px; z-index: 10000;">✕</button>
      <iframe src="https://tu-dominio.com/reservation-system.html" 
              width="100%" 
              height="900px" 
              frameborder="0"
              style="border: none; border-radius: 16px; background: white;">
      </iframe>
    </div>
  `;
  
  modal.className = 'modal';
  document.body.appendChild(modal);
  
  // Cerrar al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
});
</script>
```

---

### Opción 3: Code Component (Avanzado)

Para máximo control y personalización.

#### Pasos:

1. **En Framer, crea un nuevo Code Component**
2. **Copia todo el contenido** de `reservation-system.html`
3. **Adapta los estilos** según tu diseño en Figma
4. **Conecta el backend** para emails

```typescript
import { addPropertyControls, ControlType } from "framer"

export default function ReservationSystem(props) {
    return (
        <div style={{ width: "100%", maxWidth: 600 }}>
            {/* Pega aquí el HTML del sistema de reservas */}
            {/* Adapta los estilos según tu diseño */}
        </div>
    )
}

addPropertyControls(ReservationSystem, {
    primaryColor: {
        type: ControlType.Color,
        defaultValue: "#D4A574"
    },
    // Añade más controles según necesites
})
```

---

## 🚀 Deploy del Backend

### Opción A: Vercel (Gratis y Fácil)

1. **Instala Vercel CLI:**
```bash
npm install -g vercel
```

2. **Desde la carpeta del proyecto:**
```bash
vercel
```

3. **Configura las variables de entorno** en el dashboard de Vercel

4. **Tu URL será algo como:** `https://tu-proyecto.vercel.app`

### Opción B: Netlify

1. **Conecta tu repositorio** de GitHub
2. **Configura las variables de entorno** en Netlify
3. **Deploy automático** con cada push

### Opción C: Railway/Render

Similar a Vercel, pero con más opciones de backend.

---

## 🔧 Configuración del Backend en Producción

### Variables de Entorno Necesarias:

```
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-app
RESTAURANT_EMAIL=reservas@turestaurante.com
PORT=3000
```

### En Vercel:

1. Ve a tu proyecto → Settings → Environment Variables
2. Añade cada variable una por una
3. Redeploy el proyecto

---

## 🎨 Personalización de Colores en Framer

Si usas la opción de embed, puedes ajustar los colores editando el CSS:

```css
:root {
    --primary: #TU-COLOR-PRINCIPAL;
    --secondary: #TU-COLOR-ACENTO;
    --accent: #TU-COLOR-SECUNDARIO;
    /* etc... */
}
```

**Tips:**
- Usa los colores de tu marca de Figma
- Mantén suficiente contraste para legibilidad
- Prueba en modo claro y oscuro si tu web lo soporta

---

## 📱 Responsive en Framer

El sistema es 100% responsive, pero asegúrate:

1. **En móvil:** El iframe debe tener `width: 100%`
2. **Height dinámico:** Usa `min-height: 900px` para evitar scroll doble
3. **Padding:** Añade padding en Framer para que no toque los bordes

---

## ✅ Checklist de Integración

- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno configuradas
- [ ] Email de prueba enviado correctamente
- [ ] Sistema embebido en Framer
- [ ] Probado en móvil y desktop
- [ ] Colores adaptados a tu marca
- [ ] Textos personalizados (nombre del restaurante, etc.)
- [ ] Horarios configurados correctamente
- [ ] SSL/HTTPS activo (obligatorio para producción)

---

## 🆘 Troubleshooting

### El email no se envía:
- Verifica las credenciales en `.env`
- Comprueba que usas contraseña de aplicación de Gmail
- Revisa los logs del servidor

### El iframe no se muestra:
- Verifica que la URL es correcta
- Comprueba configuración CORS en el servidor
- Asegúrate de usar HTTPS

### Problemas de estilo:
- Ajusta el CSS directamente en `reservation-system.html`
- Usa media queries para responsive
- Comprueba z-index si hay conflictos

---

## 💡 Tips Pro

1. **Analytics**: Añade Google Analytics para trackear reservas
2. **A/B Testing**: Prueba diferentes textos en los botones
3. **WhatsApp**: Considera añadir confirmación por WhatsApp
4. **Reminder**: Sistema de recordatorios 24h antes
5. **Admin Panel**: Crea panel para gestionar reservas

---

¿Necesitas ayuda? Revisa el README principal o contacta con soporte técnico.
