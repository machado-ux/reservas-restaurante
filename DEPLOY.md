# Deploy: GitHub + Vercel + Supabase

Guía para publicar la app en internet usando un repositorio en GitHub, la base de datos en Supabase y el hosting en Vercel.

---

## 1. Subir la base de datos a Supabase

Antes de desplegar la app, crea el proyecto y las tablas en Supabase.

### 1.1 Crear proyecto en Supabase

1. Entra en **[supabase.com](https://supabase.com)** e inicia sesión.
2. **New project** → elige organización, nombre (ej. `reservas-restaurante`) y contraseña de la base de datos.
3. Espera a que el proyecto esté listo.

### 1.2 Ejecutar la migración (crear tablas)

1. En el proyecto, abre **SQL Editor** → **New query**.
2. Copia **todo** el contenido del archivo:
   ```
   supabase/migrations/20260206233108_crear_tablas_reservas.sql
   ```
3. Pégalo en el editor y pulsa **Run**.
4. Debe aparecer un mensaje de éxito (tablas `restaurant_config`, `restaurant_tables`, `reservations` creadas).

### 1.3 Obtener URL y clave de la API

1. Ve a **Settings** (engranaje) → **API**.
2. Anota:
   - **Project URL** (ej. `https://abcdefghijk.supabase.co`)
   - **service_role** (en "Project API keys", clic en "Reveal" y copia la clave secreta).  
     ⚠️ No la compartas ni la subas a GitHub.

---

## 2. Crear el repositorio en GitHub

### 2.1 Inicializar Git y hacer el primer commit

En la terminal, desde la carpeta del proyecto:

```bash
cd "/Users/machadoscrofani/Downloads/APP reservas rest:bar"

# Inicializar repositorio
git init

# Añadir todos los archivos (respeta .gitignore)
git add .

# Primer commit
git commit -m "Sistema de reservas: app + Supabase + deploy Vercel"
```

### 2.2 Crear el repo en GitHub y subir el código

1. En **[github.com](https://github.com)** → **New repository**.
2. Nombre (ej. `reservas-restaurante`), público, **no** marques "Add a README" si ya tienes uno.
3. Crea el repositorio y copia la URL (ej. `https://github.com/tu-usuario/reservas-restaurante.git`).

En la terminal:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

(Sustituye `TU-USUARIO` y `TU-REPO` por tu usuario y nombre del repo.)

---

## 3. Conectar con Vercel y desplegar

### 3.1 Importar el proyecto en Vercel

1. Entra en **[vercel.com](https://vercel.com)** e inicia sesión (puedes usar tu cuenta de GitHub).
2. **Add New** → **Project**.
3. Importa el repositorio que acabas de crear (si no lo ves, conecta tu cuenta de GitHub en **Settings**).
4. Elige el repo y clic en **Import**.

### 3.2 Variables de entorno en Vercel

Antes de desplegar, configura las variables para que la app use Supabase:

1. En la pantalla de configuración del proyecto, abre **Environment Variables**.
2. Añade:

   | Name                         | Value                          | Entorno   |
   |-----------------------------|---------------------------------|-----------|
   | `SUPABASE_URL`              | `https://tu-project.supabase.co` | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (tu service_role key)  | Production, Preview |

   Pega la **Project URL** y la **service_role** que anotaste en el paso 1.3.

3. Opcional (para emails):  
   `EMAIL_USER`, `EMAIL_PASSWORD`, `RESTAURANT_EMAIL` si quieres notificaciones por correo.

4. Pulsa **Deploy**.

### 3.3 Resultado

- Vercel construye y despliega la app.
- Te dará una URL tipo: `https://tu-proyecto.vercel.app`.
- Cada vez que hagas **push** a `main` en GitHub, Vercel volverá a desplegar automáticamente.

**URLs de la app desplegada:**

- Reservas (clientes): `https://tu-proyecto.vercel.app/`
- Panel de administración: `https://tu-proyecto.vercel.app/admin`

---

## Resumen rápido

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | Supabase | Crear proyecto → SQL Editor → ejecutar `supabase/migrations/...sql` → copiar URL y service_role |
| 2 | GitHub | New repo → en tu PC: `git init`, `git add .`, `git commit`, `git remote add origin`, `git push` |
| 3 | Vercel | Import project desde GitHub → añadir `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` → Deploy |

Si algo falla, revisa que las variables en Vercel coincidan con las de Supabase (sin espacios ni comillas de más) y que la migración se haya ejecutado correctamente en Supabase.
