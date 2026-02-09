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

-- Mesas del restaurante
CREATE TABLE restaurant_tables (
    id SERIAL PRIMARY KEY,
    number INT NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied'))
);

-- Reservas
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

-- Índices para consultas frecuentes
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_date_time ON reservations(date, time);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Insertar configuración por defecto
INSERT INTO restaurant_config (id) VALUES (1);

-- Insertar 20 mesas por defecto
INSERT INTO restaurant_tables (number, capacity)
SELECT i,
    CASE
        WHEN i <= 8 THEN 2
        WHEN i <= 14 THEN 4
        WHEN i <= 18 THEN 6
        ELSE 8
    END
FROM generate_series(1, 20) AS i;

-- Habilitar RLS (opcional: para producción con Supabase Auth)
-- Por ahora permitimos acceso al servicio desde el backend con la key
ALTER TABLE restaurant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Políticas que permiten acceso al backend (service_role las ignora; anon puede usar si hace falta)
CREATE POLICY "config_all" ON restaurant_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "tables_all" ON restaurant_tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "reservations_all" ON reservations FOR ALL USING (true) WITH CHECK (true);
