-- SQL para Supabase - Tabla de Estudiantes
-- Ejecuta este script en el editor SQL de Supabase

-- Crear tabla de estudiantes
CREATE TABLE estudiantes (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT NOT NULL UNIQUE,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 120),
    genero TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda por cédula
CREATE INDEX idx_estudiantes_cedula ON estudiantes(cedula);

-- Índice de búsqueda de texto completo para nombre y apellido
CREATE INDEX idx_estudiantesNombre ON estudiantes USING gin (to_tsvector('spanish', nombre || ' ' || apellido));

-- Trigger para actualización automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_estudiantes_updated_at
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

-- Política para permitir todo (ajusta según tus necesidades de seguridad)
CREATE POLICY "Permitir todo" ON estudiantes
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Ejemplo de inserción de datos de prueba
-- INSERT INTO estudiantes (nombre, apellido, cedula, edad, genero)
-- VALUES ('Juan', 'Pérez', '12345678', 25, 'Masculino');

-- Consultas útiles:
-- Seleccionar todos los estudiantes ordenados por nombre:
-- SELECT * FROM estudiantes ORDER BY nombre;

-- Buscar por cédula:
-- SELECT * FROM estudiantes WHERE cedula = '12345678';

-- Buscar por nombre o apellido:
-- SELECT * FROM estudiantes 
-- WHERE nombre ILIKE '%juan%' OR apellido ILIKE '%perez%';