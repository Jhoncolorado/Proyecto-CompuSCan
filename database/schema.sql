-- ================================================================
-- Script PostgreSQL para la creación de tablas
-- ================================================================

-- Eliminar las tablas si ya existen (para poder ejecutar el script varias veces)
DROP TABLE IF EXISTS caso;
DROP TABLE IF EXISTS historial_dispositivo;
DROP TABLE IF EXISTS historial_alertas;
DROP TABLE IF EXISTS carnet;
DROP TABLE IF EXISTS programas;
DROP TABLE IF EXISTS alerta;
DROP TABLE IF EXISTS dispositivo;
DROP TABLE IF EXISTS usuario;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS tipo_reporte_type CASCADE;

-- Crear tipo ENUM para tipo_reporte
CREATE TYPE tipo_reporte_type AS ENUM ('Robo', 'Pérdida', 'Dañado', 'Otro');

-- ================================================================
-- Tabla: usuario
-- ================================================================
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,              -- Identificador único del usuario.
    nombre VARCHAR(100) NOT NULL,        -- Nombre del usuario.
    correo VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico del usuario.
    documento VARCHAR(50) NOT NULL,      -- Documento de identidad del usuario.
    tipo_documento VARCHAR(50) NOT NULL, -- Tipo de documento (ej. DNI, Pasaporte).
    contrasena VARCHAR(255) NOT NULL,    -- Contraseña del usuario.
    rol VARCHAR(50) NOT NULL,            -- Rol del usuario (Aprendiz, Instructor).
    telefono1 VARCHAR(20),               -- Primer número de teléfono.
    telefono2 VARCHAR(20),               -- Segundo número de teléfono (opcional).
    rh VARCHAR(10),                      -- Tipo de RH del usuario (se reemplaza el campo EPS).
    ficha VARCHAR(50),                   -- Campo adicional para la ficha del usuario.
    observacion TEXT,                    -- Observación adicional del usuario.
    foto BYTEA,                          -- Foto del usuario (almacenada como un archivo binario).
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de registro del usuario.
);

-- ================================================================
-- Tabla: alerta
-- ================================================================
CREATE TABLE IF NOT EXISTS alerta (
    id SERIAL PRIMARY KEY,              -- Identificador único de la alerta.
    descripcion VARCHAR(255),            -- Descripción de la alerta.
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha y hora de la alerta.
);

-- ================================================================
-- Tabla: dispositivo
-- ================================================================
CREATE TABLE IF NOT EXISTS dispositivo (
    id SERIAL PRIMARY KEY,              -- Identificador único del dispositivo.
    nombre VARCHAR(100) NOT NULL,        -- Nombre del dispositivo.
    tipo VARCHAR(50) NOT NULL,           -- Tipo del dispositivo (ej. computadora, teléfono).
    serial VARCHAR(100) UNIQUE,         -- Número de serie del dispositivo.
    foto BYTEA,                          -- Foto del dispositivo (almacenada como un archivo binario).
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de registro del dispositivo.
);

-- ================================================================
-- Tabla: historial_dispositivo
-- ================================================================
CREATE TABLE IF NOT EXISTS historial_dispositivo (
    id_historial SERIAL PRIMARY KEY,          -- Identificador único del historial.
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del registro.
    descripcion TEXT NOT NULL,                -- Descripción del evento o incidente.
    id_dispositivo INTEGER NOT NULL,          -- ID del dispositivo relacionado.
    
    -- Clave foránea que conecta con la tabla dispositivo
    CONSTRAINT fk_historial_dispositivo FOREIGN KEY (id_dispositivo) 
        REFERENCES dispositivo(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- ================================================================
-- Tabla: caso
-- ================================================================
CREATE TABLE IF NOT EXISTS caso (
    id_caso SERIAL PRIMARY KEY,                 -- Identificador único del caso.
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del caso.
    tipo_reporte tipo_reporte_type NOT NULL,    -- Tipo de reporte (Robo, Pérdida, Dañado, Otro).
    id_historial INTEGER NOT NULL,              -- ID del historial relacionado.
    estado VARCHAR(20) NOT NULL DEFAULT 'Abierto', -- Estado del caso.
    
    -- Clave foránea que conecta con la tabla historial_dispositivo
    CONSTRAINT fk_caso_historial FOREIGN KEY (id_historial)
        REFERENCES historial_dispositivo (id_historial)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Restricción para validar valores posibles del estado
    CONSTRAINT chk_estado CHECK (estado IN ('Abierto', 'En proceso', 'Cerrado', 'Archivado'))
);

-- ================================================================
-- Tabla: historial_alertas
-- ================================================================
CREATE TABLE IF NOT EXISTS historial_alertas (
    id SERIAL PRIMARY KEY,              -- Identificador único del historial de alerta.
    id_alerta INTEGER NOT NULL,         -- ID de la alerta (relación con la tabla alerta).
    id_dispositivo INTEGER NOT NULL,    -- ID del dispositivo (relación con la tabla dispositivo).
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora en que se registra la alerta.
    
    -- Claves foráneas que conectan con las tablas alerta y dispositivo
    CONSTRAINT fk_alerta FOREIGN KEY (id_alerta) REFERENCES alerta(id),
    CONSTRAINT fk_dispositivo FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id)
);

-- ================================================================
-- Tabla: programas
-- ================================================================
CREATE TABLE IF NOT EXISTS programas (
    id SERIAL PRIMARY KEY,              -- Identificador único del programa.
    nombre_programa VARCHAR(100) NOT NULL,  -- Nombre del programa.
    fecha_creacion DATE NOT NULL,        -- Fecha de creación del programa.
    fecha_actualizacion DATE NOT NULL    -- Fecha de última actualización del programa.
);

-- ================================================================
-- Tabla: carnet
-- ================================================================
CREATE TABLE IF NOT EXISTS carnet (
    id SERIAL PRIMARY KEY,               -- Identificador único del carnet.
    id_usuario INTEGER NOT NULL,          -- ID del usuario asociado al carnet (clave foránea).
    id_programa INTEGER NOT NULL,         -- ID del programa asociado al carnet (clave foránea).
    numero_carnet VARCHAR(50) NOT NULL,   -- Número de carnet único.
    observacion TEXT,                     -- Observaciones adicionales sobre el carnet.
    fecha_emision DATE NOT NULL,          -- Fecha de emisión del carnet.
    fecha_vencimiento DATE NOT NULL,      -- Fecha de vencimiento del carnet.
    activo BOOLEAN NOT NULL,              -- Indica si el carnet está activo o no.
    
    -- Claves foráneas que conectan con las tablas usuario y programa
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    CONSTRAINT fk_programa FOREIGN KEY (id_programa) REFERENCES programas(id)
);

-- ================================================================
-- Crear índices para optimizar consultas
-- ================================================================

-- Índices para la tabla caso
CREATE INDEX idx_caso_tipo ON caso(tipo_reporte);
CREATE INDEX idx_caso_fecha ON caso(fecha_hora);
CREATE INDEX idx_caso_estado ON caso(estado);

-- Índices para la tabla historial_dispositivo
CREATE INDEX idx_historial_dispositivo_id ON historial_dispositivo(id_dispositivo);
CREATE INDEX idx_historial_dispositivo_fecha ON historial_dispositivo(fecha_hora);

-- ================================================================
-- Insertar datos de prueba
-- ================================================================

-- Insertar usuario administrador
INSERT INTO usuario (nombre, correo, documento, tipo_documento, contrasena, rol)
VALUES (
    'Administrador',
    'admin@compuscan.com',
    '123456789',
    'CC',
    '$2b$10$YourHashedPasswordHere', -- Reemplazar con hash real
    'admin'
);

-- Insertar programas de prueba
INSERT INTO programas (nombre_programa, fecha_creacion, fecha_actualizacion)
VALUES 
('Tecnología en Análisis y Desarrollo de Sistemas de Información', CURRENT_DATE, CURRENT_DATE),
('Técnico en Programación de Software', CURRENT_DATE, CURRENT_DATE); 