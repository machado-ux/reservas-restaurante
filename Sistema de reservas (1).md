# 💻 Setup en Cursor IDE

Esta guía te ayudará a configurar el proyecto en Cursor para desarrollar y personalizar el sistema de reservas.

## 📦 Importar el Proyecto en Cursor

### Opción 1: Abrir Carpeta Directamente

1. Descarga y descomprime todos los archivos del proyecto
2. Abre **Cursor**
3. File → Open Folder
4. Selecciona la carpeta del proyecto
5. Cursor cargará automáticamente el proyecto

### Opción 2: Desde Terminal

```bash
# Navega a la carpeta del proyecto
cd /ruta/a/reservation-system

# Abre Cursor desde terminal
cursor .
```

---

## 🔧 Configuración Inicial en Cursor

### 1. Terminal Integrada

Abre la terminal en Cursor (`` Ctrl+` `` o `Cmd+` `` en Mac):

```bash
# Instalar dependencias
npm install
```

### 2. Crear archivo .env

En Cursor, crea un nuevo archivo llamado `.env` en la raíz del proyecto:

```
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicación
RESTAURANT_EMAIL=reservas@turestaurante.com
PORT=3000
```

### 3. Extensiones Recomendadas

Cursor debería sugerir estas extensiones automáticamente:

- **ESLint** - Para linting de JavaScript
- **Prettier** - Formateo de código
- **Live Server** - Para preview del HTML
- **npm Intellisense** - Autocompletado de paquetes

---

## 🚀 Ejecutar el Proyecto

### Desde la Terminal de Cursor

```bash
# Iniciar servidor
npm start

# O con auto-reload (desarrollo)
npm run dev
```

### Vista Previa

1. El servidor se ejecutará en `http://localhost:3000`
2. Abre tu navegador y ve a esa dirección
3. O usa **Cursor → View → Preview** para verlo integrado

---

## ✏️ Edición y Personalización con Cursor AI

### Usar Cursor AI para Personalizar

1. **Selecciona el código** que quieres modificar
2. Presiona `Cmd+K` (Mac) o `Ctrl+K` (Windows/Linux)
3. Escribe lo que quieres cambiar, por ejemplo:
   - "Cambia el color primario a azul marino"
   - "Añade un campo para comentarios especiales"
   - "Modifica los horarios para incluir solo cenas"

### Ejemplos de Prompts para Cursor AI

```
"Cambia todos los colores dorados (#D4A574) a un verde oliva (#8B9556)"

"Añade un selector de ocasión especial (cumpleaños, aniversario, negocio)"

"Modifica el layout para que sea más compacto en móvil"

"Añade validación para que el teléfono sea solo números españoles"

"Crea un paso adicional para seleccionar preferencias de mesa (terraza, interior, barra)"
```

---

## 📁 Estructura del Proyecto en Cursor

```
reservation-system/
├── 📄 reservation-system.html    ← Frontend (edita aquí estilos y UI)
├── 📄 server.js                  ← Backend (edita aquí lógica de email)
├── 📄 package.json               ← Dependencias
├── 📄 .env                       ← Configuración (crea este archivo)
├── 📄 .env.example               ← Plantilla de configuración
├── 📄 .gitignore                 ← Archivos ignorados por Git
├── 📄 README.md                  ← Documentación completa
├── 📄 QUICK_START.md             ← Inicio rápido
├── 📄 FRAMER_INTEGRATION.md      ← Guía de integración
└── 📄 CURSOR_SETUP.md            ← Esta guía
```

---

## 🎨 Personalización Común con Cursor

### 1. Cambiar Colores

**Archivo:** `reservation-system.html`

Busca (Cmd+F / Ctrl+F) `:root {` y encontrarás:

```css
:root {
    --primary: #2C2416;
    --secondary: #D4A574;
    --accent: #8B6F47;
    /* ... más colores */
}
```

**Con Cursor AI:**
1. Selecciona toda la sección `:root`
2. `Cmd+K` → "Cambia estos colores a una paleta verde bosque"

### 2. Modificar Horarios

**Archivo:** `reservation-system.html`

Busca `const timeSlots = [` (línea ~400):

```javascript
const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];
```

**Con Cursor AI:**
1. Selecciona el array `timeSlots`
2. `Cmd+K` → "Modifica para tener horarios cada hora de 13:00 a 23:00"

### 3. Añadir Campos al Formulario

**Con Cursor AI:**
1. Encuentra el formulario en Step 4
2. Selecciona la sección de inputs
3. `Cmd+K` → "Añade un campo opcional para comentarios especiales"

---

## 🐛 Debugging en Cursor

### 1. Console.log Automático

Selecciona una variable y usa Cursor AI:
- "Añade un console.log para esta variable"

### 2. DevTools Integrado

- `Cmd+Shift+I` (Mac) o `Ctrl+Shift+I` (Windows)
- O click derecho → Inspect

### 3. Breakpoints

1. Click en el número de línea para añadir breakpoint
2. Ejecuta con debugger de Cursor

---

## 📝 Tareas Comunes con Cursor AI

### Traducir a Otro Idioma

1. Selecciona todo el HTML
2. `Cmd+K` → "Traduce todos los textos al inglés/catalán/francés"

### Añadir Google Analytics

1. Selecciona el `<head>`
2. `Cmd+K` → "Añade Google Analytics con el ID GA-XXXXXXXXX"

### Mejorar Accesibilidad

1. Selecciona una sección
2. `Cmd+K` → "Añade atributos ARIA para mejorar accesibilidad"

### Optimizar para SEO

1. Selecciona el `<head>`
2. `Cmd+K` → "Añade meta tags para SEO de un restaurante"

---

## 🔄 Git Integration en Cursor

### Inicializar Git (si aún no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit: Restaurant reservation system"
```

### Ver Cambios

- Cursor muestra cambios en el panel lateral izquierdo
- Click en **Source Control** (icono de rama)

### Commit Rápido

1. Escribe mensaje de commit
2. `Cmd+Enter` para commit
3. Push a GitHub si tienes repositorio remoto

---

## 🧪 Testing en Cursor

### Probar Manualmente

1. Inicia el servidor: `npm start`
2. Abre preview o navegador
3. Completa una reserva de prueba

### Verificar Emails

1. Revisa la consola de Cursor para logs
2. Verifica que lleguen los emails
3. Comprueba formato HTML en el email

---

## 💾 Guardar Snippets Personalizados

### Crear Snippet Reutilizable

1. Selecciona código útil
2. Click derecho → "Save as Snippet"
3. Dale un nombre como "reservation-form-field"
4. Reutiliza con `@snippet-name`

---

## 🚢 Deploy desde Cursor

### Vercel

```bash
# Terminal en Cursor
npm install -g vercel
vercel login
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

---

## ⚙️ Settings Recomendados para Cursor

Añade a `.vscode/settings.json` (Cursor lo usa también):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

---

## 🎯 Workflow Recomendado

1. **Abre Cursor** con el proyecto
2. **Terminal integrada** → `npm start`
3. **Split screen**: código a la izquierda, preview a la derecha
4. **Edita con Cursor AI** usando `Cmd+K`
5. **Guarda** → auto-reload del navegador
6. **Commit** cuando estés satisfecho
7. **Deploy** cuando esté listo para producción

---

## 🆘 Solución de Problemas

**Cursor no reconoce el proyecto:**
→ Cierra y reabre Cursor con la carpeta correcta

**Terminal no funciona:**
→ `View → Terminal` o `` Ctrl+` ``

**Cursor AI no responde:**
→ Verifica que tienes conexión a internet
→ Revisa tu suscripción de Cursor

**Cambios no se ven:**
→ Recarga el navegador (Cmd+R / Ctrl+R)
→ Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

---

## 🎓 Recursos Adicionales

- [Cursor Docs](https://cursor.sh/docs)
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [Nodemailer Docs](https://nodemailer.com/about/)

---

## 💡 Pro Tips

1. Usa **Cmd+P** para búsqueda rápida de archivos
2. Usa **Cmd+Shift+F** para buscar en todo el proyecto
3. Usa **Cursor AI Chat** para preguntas más complejas
4. Crea **branches** en Git antes de cambios grandes
5. Haz **commits frecuentes** para poder revertir si es necesario

---

¡Listo para empezar a desarrollar! 🚀

Si tienes dudas sobre Cursor específicas, consulta su documentación oficial.
