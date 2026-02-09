# Conexión con Supabase para probar la app

Sigue estos pasos para usar una base de datos en la nube (gratis) y probar la app con datos persistentes.

## 1. Crear proyecto en Supabase

1. Entra en **[supabase.com](https://supabase.com)** e inicia sesión (o crea una cuenta gratis).
2. Pulsa **"New project"**.
3. Elige tu organización, nombre del proyecto (ej. `reservas-restaurante`) y una contraseña para la base de datos (guárdala por si la necesitas).
4. Espera a que el proyecto esté listo (1–2 minutos).

## 2. Obtener URL y clave de la API

1. En el proyecto, ve a **Settings** (icono de engranaje) → **API**.
2. Anota:
   - **Project URL** (ej. `https://abcdefghijk.supabase.co`)
   - **service_role** (en "Project API keys" → "secret"): haz clic en "Reveal" y copia la clave.  
     ⚠️ Esta clave es secreta; no la subas a Git ni la compartas.

## 3. Crear las tablas en la base de datos

1. En el menú izquierdo, abre **SQL Editor**.
2. Pulsa **"New query"**.
3. Copia y pega **todo** el contenido del archivo `supabase/migrations/20260206233108_crear_tablas_reservas.sql` (o el bloque SQL de abajo).
4. Pulsa **Run** (o Ctrl+Enter).

Si prefieres, puedes copiar este SQL:

```sql
-- Configuración del restaurante (una sola fila)
CREATE TABLE restaurant_config (
    id INT PRIMARY KEY DEFAULT 1,
    opening_time TEXT NOT NULL DEFAULT '12:00',
    closing_time TEXT NOT NULL DEFAULT '23:00',
    lunch_start TEXT NOT NULL DEFAULT '12:00',
    lunch_end TEXT NOT NULL DEFAULT '16:00',
    dinner_start TEXT NOT NULL DEFAULT '19:00',
    dinner_end TEXT NOT NULL DEFAULT '23:00',
    operating_days INT[] NOT NULL DEFAULT '{1,2,3,4,5,6,0}',
    time_slot_interval INT NOT NULL DEFAULT 30,
    total_tables INT NOT NULL DEFAULT 20,
    total_capacity INT NOT NULL DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE restaurant_tables (
    id SERIAL PRIMARY KEY,
    number INT NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied'))
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    guests TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    assigned_tables JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_date_time ON reservations(date, time);
CREATE INDEX idx_reservations_status ON reservations(status);

INSERT INTO restaurant_config (id) VALUES (1);

INSERT INTO restaurant_tables (number, capacity)
SELECT i, CASE WHEN i <= 8 THEN 2 WHEN i <= 14 THEN 4 WHEN i <= 18 THEN 6 ELSE 8 END
FROM generate_series(1, 20) AS i;

ALTER TABLE restaurant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "config_all" ON restaurant_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "tables_all" ON restaurant_tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "reservations_all" ON reservations FOR ALL USING (true) WITH CHECK (true);
```

## 4. Configurar la app con Supabase

Crea o edita el archivo **`.env`** en la raíz del proyecto (donde está `package.json`) con:

```env
PORT=3000
SUPABASE_URL=https://TU-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key...
```

Sustituye:

- `TU-PROJECT-REF.supabase.co` por la **Project URL** de Supabase (sin la barra final).
- `eyJ...` por la clave **service_role** que copiaste en el paso 2.

Guarda el archivo.

## 5. Arrancar la app

En la terminal, en la carpeta del proyecto:

```bash
npm start
```

Abre en el navegador:

- **Cliente (reservas):** http://localhost:3000  
- **Panel admin:** http://localhost:3000/admin  

Si el servidor arranca y en la consola ves algo como `🗄️ Base de datos: Supabase`, la conexión está funcionando.

---

**Sin Supabase:** Si no creas `.env` o no pones `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, la app sigue funcionando usando el archivo `data.json` (sin base de datos en la nube).
