-- Migración para agregar el campo 'completed' a la tabla events
-- Ejecutar este script si ya tienes datos en tu base de datos

-- Verificar si la columna ya existe
PRAGMA table_info(events);

-- Agregar la columna 'completed' si no existe
ALTER TABLE events ADD COLUMN completed BOOLEAN DEFAULT FALSE;

-- Actualizar eventos existentes para que no estén completados por defecto
UPDATE events SET completed = FALSE WHERE completed IS NULL;

-- Verificar que la migración fue exitosa
SELECT COUNT(*) as total_events, 
       SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_events,
       SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending_events
FROM events;
