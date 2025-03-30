-- Crear tabla de dispositivos si no existe
CREATE TABLE IF NOT EXISTS dispositivo (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    serial VARCHAR(100) UNIQUE NOT NULL,
    procesador VARCHAR(100),
    cargador VARCHAR(50),
    mouse VARCHAR(50),
    foto TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de historial_dispositivo si no existe
CREATE TABLE IF NOT EXISTS historial_dispositivo (
    id SERIAL PRIMARY KEY,
    dispositivo_id INTEGER REFERENCES dispositivo(id),
    usuario_id INTEGER,
    accion VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT
);

-- Crear tabla de alertas si no existe
CREATE TABLE IF NOT EXISTS alerta (
    id SERIAL PRIMARY KEY,
    dispositivo_id INTEGER REFERENCES dispositivo(id),
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente'
); 