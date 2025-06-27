# Documentación del Backend - CompuSCan

## Índice
1. [Arquitectura](#arquitectura)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [API RESTful](#api-restful)
4. [Modelos de Datos](#modelos-de-datos)
5. [Autenticación y Autorización](#autenticación-y-autorización)
6. [Manejo de Errores](#manejo-de-errores)
7. [Conexión a Base de Datos](#conexión-a-base-de-datos)
8. [Integración RFID](#integración-rfid)
9. [Logging y Monitoreo](#logging-y-monitoreo)
10. [Seguridad](#seguridad)
11. [Despliegue](#despliegue)
12. [Guía de Mantenimiento](#guía-de-mantenimiento)
13. [Remoción de Secretos del Historial de Git (Caso Real)](#remoción-de-secretos-del-historial-de-git-caso-real)
14. [Gestión de imágenes múltiples por dispositivo](#gestión-de-imágenes-múltiples-por-dispositivo)
15. [Actualización en tiempo real del dashboard admin (socket.io)](#actualización-en-tiempo-real-del-dashboard-admin-socketio)
16. [Integración de WebSockets con Socket.IO en el Backend](#integración-de-websockets-con-socketio-en-el-backend)
17. [Gestión de usuarios: Deshabilitar y habilitar (histórico y trazabilidad)](#gestión-de-usuarios-deshabilitar-y-habilitar-histórico-y-trazabilidad)
18. [Alternancia ENTRADA/SALIDA por RFID (Backend)](#alternancia-entrada-salida-por-rfid-backend)

---

## Arquitectura

El backend de CompuSCan está construido con Node.js y Express, siguiendo una arquitectura MVC (Modelo-Vista-Controlador) adaptada para APIs RESTful:

- **Modelo**: Interacción con la base de datos PostgreSQL
- **Controlador**: Lógica de negocio y procesamiento de datos
- **Rutas**: Definición de endpoints y gestión de solicitudes HTTP

### Tecnologías principales:

- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **Express**: Framework web para la creación de APIs
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **JWT**: Autenticación basada en tokens
- **Bcrypt**: Encriptación de contraseñas
- **Multer**: Gestión de carga de archivos

---

## Estructura de Directorios

```
backend/
├── app.js                # Punto de entrada principal
├── config/               # Configuraciones
│   ├── database.js       # Configuración de PostgreSQL
│   ├── logger.js         # Configuración de logging
│   └── swagger.js        # Documentación API con Swagger
├── controllers/          # Controladores (lógica de negocio)
│   ├── dispositivoController.js
│   ├── usuarioController.js
│   └── ...
├── middleware/           # Middlewares personalizados
│   ├── auth.js           # Autenticación JWT
│   ├── errorHandler.js   # Manejo centralizado de errores
│   └── ...
├── models/               # Modelos de datos y consultas SQL
│   ├── dispositivoModel.js
│   ├── usuarioModel.js
│   └── ...
├── routes/               # Definición de rutas API
│   ├── dispositivoRoutes.js
│   ├── usuarioRoutes.js
│   └── ...
├── utils/                # Utilidades y helpers
│   ├── validators.js     # Validación de datos
│   ├── formatters.js     # Formateadores de respuesta
│   └── ...
└── package.json          # Dependencias y scripts
```

---

## API RESTful

La API sigue los principios RESTful para proporcionar una interfaz coherente y predecible:

### Convenciones de Nomenclatura

- Uso de sustantivos en plural para recursos (`/dispositivos`, `/usuarios`)
- Verbos HTTP para operaciones (GET, POST, PUT, DELETE)
- Parámetros en URL para identificar recursos (`/dispositivos/:id`)
- Query params para filtrado y paginación (`/dispositivos?marca=Dell&limit=10`)

### Endpoints Principales

#### Dispositivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/dispositivos | Obtener todos los dispositivos |
| GET    | /api/dispositivos/:id | Obtener un dispositivo por ID |
| POST   | /api/dispositivos | Crear un nuevo dispositivo |
| PUT    | /api/dispositivos/:id | Actualizar un dispositivo existente |
| DELETE | /api/dispositivos/:id | Eliminar un dispositivo |
| GET    | /api/dispositivos/usuario/:id | Obtener dispositivos de un usuario |
| POST   | /api/dispositivos/acceso-rfid | Registrar acceso mediante RFID |

#### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/usuarios | Obtener todos los usuarios |
| GET    | /api/usuarios/:id | Obtener un usuario por ID |
| POST   | /api/usuarios | Crear un nuevo usuario |
| PUT    | /api/usuarios/:id | Actualizar un usuario existente |
| DELETE | /api/usuarios/:id | Eliminar un usuario |
| POST   | /api/usuarios/login | Autenticar usuario |

#### Historial

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/historiales | Obtener todos los registros de historial |
| GET    | /api/historiales/:id | Obtener un registro específico |
| GET    | /api/historiales/dispositivo/:id | Obtener historial de un dispositivo |

### Formato de Respuestas

Las respuestas siguen un formato estandarizado:

```json
// Respuesta exitosa
{
  "success": true,
  "data": { ... },
  "message": "Operación completada con éxito"
}

// Respuesta de error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

> **Nota sobre exportación de reportes:**
> Los endpoints de usuarios, historial y dispositivos permiten traer todos los datos mediante paginación (usando un límite alto). El backend NO genera archivos Excel ni expone endpoints especiales para exportar reportes; la exportación a Excel es realizada completamente en el frontend, que consume estos endpoints y genera el archivo en el navegador del usuario.

---

## Modelos de Datos
|
### Esquema de Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:

#### Usuario

```sql
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  documento VARCHAR(20) UNIQUE,
  tipo_documento VARCHAR(10),
  contrasena VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL,
  telefono1 VARCHAR(20),
  telefono2 VARCHAR(20),
  rh VARCHAR(5),
  ficha VARCHAR(20),
  observacion TEXT,
  foto TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP
);
```

#### Dispositivo

```sql
CREATE TABLE dispositivo (
  id_dispositivo SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  marca VARCHAR(50),
  modelo VARCHAR(50),
  serial VARCHAR(50) UNIQUE,
  rfid VARCHAR(100) UNIQUE,
  tipo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pendiente',
  foto TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario INTEGER REFERENCES usuario(id),
  observaciones TEXT
);
```

#### Historial_Dispositivo

```sql
CREATE TABLE historial_dispositivo (
  id_historial SERIAL PRIMARY KEY,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT,
  id_dispositivo INTEGER REFERENCES dispositivo(id_dispositivo)
);
```

### Implementación de Modelos

Los modelos encapsulan la lógica de acceso a datos:

```javascript
// Ejemplo de modelo de dispositivo
const pool = require('../config/database');

const dispositivoModel = {
  getAll: async () => {
    const query = `
      SELECT d.*, u.nombre as nombre_usuario 
      FROM dispositivo d 
      LEFT JOIN usuario u ON d.id_usuario = u.id
      ORDER BY d.fecha_registro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },
  
  getById: async (id) => {
    const query = `
      SELECT d.*, u.nombre as nombre_usuario 
      FROM dispositivo d 
      LEFT JOIN usuario u ON d.id_usuario = u.id
      WHERE d.id_dispositivo = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  
  create: async (dispositivo) => {
    const { nombre, marca, modelo, serial, rfid, tipo, id_usuario, foto, observaciones } = dispositivo;
    const query = `
      INSERT INTO dispositivo 
      (nombre, marca, modelo, serial, rfid, tipo, id_usuario, foto, observaciones) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    const values = [nombre, marca, modelo, serial, rfid, tipo, id_usuario, foto, observaciones];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  // Más métodos para update, delete, etc.
};

module.exports = dispositivoModel;
```

---

## Autenticación y Autorización

### Sistema de Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación de usuarios:

```javascript
// Generación de token JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (user) => {
  const payload = {
    id: user.id,
    correo: user.correo,
    rol: user.rol
  };
  
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    // Buscar usuario por correo
    const user = await usuarioModel.getByEmail(correo);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Credenciales inválidas' } 
      });
    }
    
    // Verificar contraseña
    const isValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Credenciales inválidas' } 
      });
    }
    
    // Actualizar último acceso
    await usuarioModel.updateLastAccess(user.id);
    
    // Generar token
    const token = generateToken(user);
    
    // Respuesta exitosa
    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          foto: user.foto
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Error en el servidor' } 
    });
  }
};
```

### Middleware de Autenticación

```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = (req, res, next) => {
  // Obtener token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Acceso denegado. Token no proporcionado.' } 
    });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Token inválido o expirado' } 
    });
  }
};

// Middleware para verificar rol
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Usuario no autenticado' } 
      });
    }
    
    if (roles.length && !roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Acceso prohibido. No tiene los permisos necesarios.' } 
      });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
```

---

## 🟢 Master Class: JWT en Backend - Cómo funciona, mejores prácticas y tips PRO

### ¿Qué es un JWT?
- Un **JSON Web Token** es un string seguro que representa la identidad de un usuario.
- Se usa para **autenticación sin estado**: el backend no guarda sesiones, solo verifica el token en cada petición.

### ¿Cómo es el flujo típico?

1. **Login:**
   - El usuario envía su correo y contraseña al backend (`POST /api/usuarios/login`).
   - El backend valida las credenciales y, si son correctas, genera un JWT con la info del usuario (id, correo, rol, etc.).
   - El backend responde con el token y los datos básicos del usuario.

2. **Uso del token:**
   - El frontend guarda el token (usualmente en localStorage).
   - En cada petición protegida, el frontend envía el token en el header:
     ```http
     Authorization: Bearer <token>
     ```
   - El backend valida el token en cada endpoint protegido usando el middleware `authenticate`.

3. **Validación:**
   - Si el token es válido y no ha expirado, el backend permite la acción y adjunta los datos del usuario a `req.user`.
   - Si el token es inválido o expiró, responde 401 y el frontend debe pedir login de nuevo.

---

### ¿Qué contiene un JWT?
- **Header:** Algoritmo y tipo de token (ej: HS256, JWT)
- **Payload:** Datos del usuario (id, correo, rol, etc.)
- **Signature:** Firma digital usando la clave secreta del backend

**Ejemplo de payload:**
```json
{
  "id": 47,
  "correo": "usuario@correo.com",
  "rol": "aprendiz",
  "iat": 1710000000,
  "exp": 1710086400
}
```

**Ejemplo de un JWT real:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcsImNvcnJlbyI6InVzZXJpby5AZW1haWwuY29tIiwicm9sIjoiYXByZW5kaXoiLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTcxMDA4NjQwMH0.abc123DEF456ghi789JKL
```

Puedes decodificarlo en [jwt.io](https://jwt.io/).

---

### Tips PRO y Buenas Prácticas

- **Nunca pongas datos sensibles (contraseña, etc.) en el payload del JWT.**
- Usa una clave secreta fuerte y guárdala en variables de entorno (`JWT_SECRET`).
- Define un tiempo de expiración razonable (`expiresIn: '24h'` o menos para apps críticas).
- Siempre valida el token en TODOS los endpoints protegidos.
- Si cambias la contraseña del usuario, considera invalidar los tokens previos (rotación de clave).
- En producción, usa HTTPS para evitar robo de tokens por sniffing.
- Si el usuario es deshabilitado, el backend debe rechazar el token aunque sea válido (verifica el estado en la BD).
- Si el token expira, responde 401 y fuerza logout en el frontend.
- No guardes el token en cookies sin `HttpOnly` y `Secure` en apps públicas.

---

### Troubleshooting y Preguntas Frecuentes

- **¿Por qué recibo 401 aunque el token parece válido?**
  - El token expiró (`exp`).
  - El token fue firmado con otra clave (`JWT_SECRET` cambió).
  - El usuario fue deshabilitado o borrado.
  - El token no se está enviando en el header Authorization.

- **¿Cómo invalidar todos los tokens de un usuario?**
  - Cambia la clave secreta global (invalidas todos los tokens del sistema).
  - O lleva un campo `tokenVersion` en la BD y verifica en el payload.

- **¿Puedo usar JWT para roles y permisos?**
  - Sí, incluye el rol en el payload y usa el middleware `authorize(['rol1','rol2'])`.

- **¿Qué pasa si el token es robado?**
  - El atacante puede hacer peticiones hasta que expire. Por eso, usa HTTPS y expira tokens rápido.

---

### Resumen visual del flujo

```
[Usuario] --login--> [Backend] --genera JWT--> [Frontend]
[Frontend] --petición protegida + token--> [Backend] --valida JWT--> [OK]
```

---

¡Con esto tienes una visión PRO y práctica de JWT en backend Node.js! 🚀

---

## Manejo de Errores

El sistema implementa un manejo centralizado de errores para proporcionar respuestas consistentes:

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Errores conocidos
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      }
    });
  }
  
  // Errores de base de datos
  if (err.code === '23505') { // Unique violation en PostgreSQL
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Ya existe un registro con esos datos'
      }
    });
  }
  
  // Error por defecto
  return res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Error interno del servidor'
    }
  });
};

module.exports = errorHandler;
```

### Implementación en Controladores

```javascript
// Patrón try-catch en controladores
const createDispositivo = async (req, res, next) => {
  try {
    const dispositivo = req.body;
    
    // Validar datos
    if (!dispositivo.nombre || !dispositivo.serial) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Nombre y serial son obligatorios'
        }
      });
    }
    
    // Crear dispositivo
    const result = await dispositivoModel.create(dispositivo);
    
    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      data: result,
      message: 'Dispositivo creado correctamente'
    });
  } catch (error) {
    // Pasar error al manejador centralizado
    next(error);
  }
};
```

---

## Conexión a Base de Datos

La conexión a PostgreSQL se gestiona mediante un pool de conexiones:

```javascript
// config/database.js
const { Pool } = require('pg');
const logger = require('./logger');

// Configuración desde variables de entorno
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'compuscansecurity',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
  // Configuraciones adicionales
  max: 20, // máximo de conexiones concurrentes
  idleTimeoutMillis: 30000, // tiempo de espera antes de liberar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo de espera para conexiones nuevas
});

// Manejo de eventos del pool
pool.on('connect', () => {
  logger.info('Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de PostgreSQL', err);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info('✅ Conexión exitosa a la base de datos PostgreSQL');
    const result = await client.query('SELECT NOW()');
    logger.info(`✅ Base de datos responde correctamente: ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (err) {
    logger.error('❌ Error al conectar con la base de datos:', err);
    throw err;
  }
};

module.exports = {
  pool,
  testConnection,
  query: (text, params) => pool.query(text, params)
};
```

---

## Integración RFID (Ampliada)

### Flujo de Asignación y Validación de RFID

**1. Asignación de RFID a un dispositivo:**

- El admin/validador accede a la pantalla de validación de dispositivos.
- Selecciona un dispositivo pendiente y da clic en "Validar/Asignar RFID".
- Pasa la tarjeta RFID por el lector.
- El frontend envía una petición PUT a `/api/dispositivos/:id` con el campo `rfid` y `estado_validacion: 'aprobado'`.
- El backend:
    - Verifica que el RFID no esté asignado a otro dispositivo.
    - Actualiza el dispositivo con el nuevo RFID y cambia el estado a "aprobado".
    - Registra el evento en la tabla `historial_dispositivo`.
- El frontend muestra confirmación y el dispositivo queda validado.

**Diagrama de flujo:**

```
[Admin/Validador] -> [Pantalla de Validación] -> [PUT /api/dispositivos/:id]
    -> [Verifica RFID único]
    -> [Actualiza dispositivo]
    -> [Registra en historial]
    -> [Respuesta OK]
```

**Ejemplo de payload:**
```json
{
  "rfid": "1234567890ABCDEF",
  "estado_validacion": "aprobado"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Dispositivo actualizado exitosamente",
  "dispositivo": { ... }
}
```

**2. Control de acceso con RFID:**

- El usuario pasa la tarjeta RFID por el lector.
- El frontend envía el RFID al endpoint POST `/api/dispositivos/acceso-rfid`.
- El backend busca el dispositivo y el usuario asociado, valida el acceso y registra la entrada/salida en el historial.
- El backend responde con los datos del usuario, dispositivo, nombre del programa y tipo de evento (entrada/salida).

**Ejemplo de payload:**
```json
{
  "rfid": "1234567890ABCDEF"
}
```

**Respuesta exitosa:**
```json
{
  "usuario": { ... },
  "dispositivo": { ... },
  "nombrePrograma": "Tecnología en Análisis y Desarrollo de Sistemas de Información",
  "tipoEvento": "ENTRADA",
  "mensaje": "Acceso autorizado: ENTRADA"
}
```

### Relación Usuario-Dispositivo-RFID

- Cada dispositivo tiene un campo `rfid` único y un `id_usuario` que lo asocia a un usuario.
- El historial de movimientos se registra en la tabla `historial_dispositivo`.
- El acceso por RFID siempre valida la relación y registra el evento.

### Buenas Prácticas y Recomendaciones
- Validar siempre la unicidad del RFID antes de asignar.
- Registrar todos los eventos de acceso en el historial.
- Proteger los endpoints con autenticación JWT.
- En producción, usar HTTPS y variables de entorno seguras.
- Realizar backups periódicos de la base de datos.

---

## Logging y Monitoreo

El sistema implementa logging estructurado para facilitar el monitoreo y la depuración:

```javascript
// config/logger.js
const winston = require('winston');
const path = require('path');

// Configuración de formato
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Crear logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'compuscan-api' },
  transports: [
    // Logs de consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    }),
    // Logs de archivo
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ]
});

module.exports = logger;
```

### Uso del Logger

```javascript
const logger = require('../config/logger');

// Ejemplos de uso
logger.info('Servidor iniciado en el puerto %d', port);
logger.warn('Intento de acceso no autorizado', { ip: req.ip, path: req.path });
logger.error('Error al procesar solicitud', { error: err.message, stack: err.stack });

// En controladores
const getDispositivos = async (req, res, next) => {
  try {
    logger.debug('Obteniendo lista de dispositivos', { query: req.query });
    const dispositivos = await dispositivoModel.getAll();
    logger.info('Dispositivos obtenidos correctamente', { count: dispositivos.length });
    return res.json({ success: true, data: dispositivos });
  } catch (error) {
    logger.error('Error al obtener dispositivos', { error: error.message });
    next(error);
  }
};
```

---

## Seguridad

El backend implementa diversas medidas de seguridad:

### Protección contra Vulnerabilidades Comunes

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Protección de cabeceras HTTP
app.use(helmet());

// Configuración CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitar peticiones (protección contra DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Demasiadas peticiones, intente más tarde' }
  }
});
app.use('/api/', limiter);

// Prevención de inyección SQL
// Se utiliza parametrización de consultas en los modelos
```

### Validación de Datos

```javascript
// utils/validators.js
const Joi = require('joi');

const schemas = {
  // Esquema para validar dispositivos
  dispositivo: Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    marca: Joi.string().min(2).max(50).required(),
    modelo: Joi.string().min(2).max(50).required(),
    serial: Joi.string().min(5).max(50).required(),
    rfid: Joi.string().max(100),
    tipo: Joi.string().required(),
    id_usuario: Joi.number().integer(),
    foto: Joi.string().allow(null, ''),
    observaciones: Joi.string().allow(null, '')
  }),
  
  // Esquema para validar usuarios
  usuario: Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    correo: Joi.string().email().required(),
    documento: Joi.string().min(5).max(20),
    tipo_documento: Joi.string().max(10),
    contrasena: Joi.string().min(8).required(),
    rol: Joi.string().valid('administrador', 'validador', 'instructor', 'aprendiz').required(),
    telefono1: Joi.string().max(20),
    telefono2: Joi.string().max(20),
    rh: Joi.string().max(5),
    ficha: Joi.string().max(20),
    observacion: Joi.string(),
    foto: Joi.string()
  })
};

// Middleware de validación
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }
    next();
  };
};

module.exports = { schemas, validate };
```

---

## Despliegue

El backend está preparado para desplegarse en diferentes entornos:

### Variables de Entorno

```
# .env.example
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=compuscansecurity
DB_USER=postgres
DB_PASSWORD=1234

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Scripts de Despliegue

```json
// package.json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "lint": "eslint .",
    "db:init": "node database/init_db.js",
    "db:seed": "node database/seed_db.js"
  }
}
```

### Configuración para Diferentes Entornos

```javascript
// config/environment.js
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno según NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

module.exports = {
  // Servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base de datos
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'compuscansecurity',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234'
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};
```

---

## Guía de Mantenimiento

### Añadir Nuevos Endpoints

1. **Crear modelo**: Implementar funciones de acceso a datos en `/models`
2. **Crear controlador**: Implementar lógica de negocio en `/controllers`
3. **Crear rutas**: Definir endpoints en `/routes`
4. **Registrar router**: Añadir el router en `app.js`

```javascript
// 1. Modelo (models/nuevoModel.js)
const pool = require('../config/database');

const nuevoModel = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM nueva_tabla');
    return result.rows;
  },
  // Más métodos...
};

module.exports = nuevoModel;

// 2. Controlador (controllers/nuevoController.js)
const nuevoModel = require('../models/nuevoModel');
const logger = require('../config/logger');

const getAll = async (req, res, next) => {
  try {
    const items = await nuevoModel.getAll();
    return res.json({ success: true, data: items });
  } catch (error) {
    logger.error('Error en getAll:', error);
    next(error);
  }
};

module.exports = { getAll };

// 3. Rutas (routes/nuevoRoutes.js)
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const nuevoController = require('../controllers/nuevoController');

const router = express.Router();

router.get('/', authenticate, nuevoController.getAll);

module.exports = router;

// 4. Registrar en app.js
app.use('/api/nuevo', require('./routes/nuevoRoutes'));
```

### Modificar la Base de Datos

1. Crear script de migración en `/database/migrations`
2. Ejecutar la migración en desarrollo y pruebas
3. Actualizar modelos afectados

### Depuración

- Usar el logger para registrar información relevante
- Implementar tests unitarios para validar cambios
- Verificar logs de errores en `/logs`

### Convenciones de Código

- Usar async/await para operaciones asíncronas
- Manejar errores con try/catch
- Documentar funciones y endpoints
- Seguir principios SOLID y DRY 

## Nota sobre Seguridad en Formularios

Se implementó en el frontend la desactivación del autocompletado en campos sensibles de los formularios de usuario, para evitar exposición de datos previos y reforzar la privacidad.
No requiere cambios en la API, pero es importante para la seguridad integral del sistema. 

## Remoción de Secretos del Historial de Git (Caso Real)

Durante el desarrollo, detecté que un archivo de credenciales sensibles fue subido accidentalmente al repositorio. GitHub bloqueó el push hasta que el secreto fuera eliminado de TODO el historial de commits.

**Solución aplicada:**
- Eliminé el archivo y realicé un commit.
- Utilicé BFG Repo-Cleaner para limpiar el historial:
  ```bash
  java -jar bfg-1.14.0.jar --delete-files nombre-del-archivo-secreto.json
  ```
- Limpié los objetos huérfanos y forcé el push.

**Recomendaciones:**
- Nunca subir archivos de credenciales o secretos al repositorio.
- Agregar archivos sensibles a `.gitignore` antes de hacer commit.
- Si ocurre un error similar, limpiar el historial y avisar a los colaboradores para que vuelvan a clonar el repo. 

---

## Gestión de Imágenes de Dispositivos

- **Subida:**  
  Las imágenes se suben mediante endpoints que usan `multer` y se guardan en `/uploads`.
- **Almacenamiento:**  
  El campo `foto` en la tabla `dispositivo` almacena un array JSON serializado con los nombres de archivo.
- **Entrega:**  
  Todos los endpoints (`getAllDispositivos`, `getDispositivoById`, `getDispositivosPendientes`, `/api/dispositivos/acceso-rfid`, etc.) procesan el campo `foto` para que siempre sea un array plano de strings.
- **Compatibilidad:**  
  Si el campo `foto` es un string base64 (caso antiguo), el backend lo entrega como un array con ese string.
- **Visualización:**  
  El frontend accede a las imágenes mediante URLs del tipo:  
  `http://localhost:3000/uploads/<nombre_de_archivo>`
- **Notas de migración:**  
  Se corrigieron errores donde el campo `foto` podía ser un array anidado o un string base64, asegurando que siempre sea un array plano.

---

## Actualización en tiempo real del dashboard admin (socket.io)

El backend implementa **socket.io** para permitir la actualización en tiempo real del panel de control del administrador:

- **Evento emitido:** `actividad_actualizada`
- **¿Cuándo se emite?**
  - Cada vez que se registra un nuevo acceso o salida (al crear un historial de dispositivo).
  - El evento se emite desde el controlador `historialDispositivoController.js` tras guardar el historial.
- **Datos enviados:**
  - Un objeto con los nuevos stats del dashboard (usuarios, dispositivos, actividad de hoy, actividad reciente, etc.), igual que la respuesta del endpoint `/api/dashboard/stats`.
- **Ventaja UX:**
  - El frontend puede escuchar este evento y actualizar automáticamente la sección "Actividad Hoy" y la actividad reciente, sin recargar la página.
  - Permite monitoreo en vivo para administradores y validadores.

**Referencia de código:**
- Integración de socket.io: ver `app.js` (inicialización y exportación de io)
- Emisión del evento: ver `controllers/historialDispositivoController.js` (método `createHistorial`) 

## Notas sobre Términos y Condiciones

- El backend **no almacena explícitamente** la aceptación de términos, ya que el frontend bloquea el registro si el usuario no acepta.
- El PDF de términos y condiciones es servido por el frontend y mostrado en un modal durante el registro.
- Si se requiere máxima robustez legal, se puede agregar un campo booleano y un timestamp en la tabla de usuarios para guardar la aceptación y la fecha/hora.
- El sistema está preparado para cumplir con normativas de protección de datos y consentimiento informado. 

## Errores Críticos y Funcionalidades Profesionales

### 1. Error 404 de Socket.IO y Actualización en Tiempo Real

- **Problema:** El frontend mostraba errores 404 al intentar conectarse a `/socket.io`, y el panel no se actualizaba en tiempo real.
- **Causa:** El backend creaba dos servidores HTTP distintos: uno para Express y otro para Socket.IO.
- **Solución:**  
  - Se creó el servidor HTTP una sola vez:  
    ```js
    const server = require('http').createServer(app);
    ```
  - Se inicializó Socket.IO sobre ese servidor:  
    ```js
    const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
    ```
  - Se usó `server.listen(...)` para iniciar el backend.
  - Cuando se registra una nueva actividad (entrada/salida), el backend emite el evento `actividad_actualizada` con los datos actualizados del dashboard.
- **Referencia de código:**  
  - Integración de socket.io: ver `app.js` (inicialización y exportación de io)
  - Emisión del evento: ver `controllers/historialDispositivoController.js` (método `createHistorial`)

---

### 2. Implementación del Correo de Registro Exitoso (Backend)

- Se utiliza Nodemailer y una contraseña de aplicación de Gmail para enviar el correo de bienvenida.
- El backend lee las variables `EMAIL_USER` y `EMAIL_PASS` desde el archivo `.env`.
- El correo incluye:
  - Saludo personalizado.
  - Mensaje de bienvenida y confirmación.
  - Botón para iniciar sesión.
  - Información de soporte y firma institucional.
  - (Opcional) Logo institucional.
- Si el correo no se envía, el registro no se interrumpe y se muestra el error en consola para depuración.
- El código relevante está en `controllers/usuarioController.js` (función `sendRegistroExitosoEmail`). 

## Nota sobre Modal de Acceso y Visualización Profesional (Frontend)

La lógica del **modal de acceso profesional**, cierre por tecla y visualización alineada de tarjetas (aprendiz y equipo) es implementada completamente en el frontend. El backend solo entrega los datos necesarios y nunca expone el RFID ni el serial en la UI, cumpliendo con las mejores prácticas de seguridad y privacidad.

# Integración de WebSockets con Socket.IO en el Backend

## ¿Qué es Socket.IO y por qué se eligió?
- **Socket.IO** es una librería para Node.js que permite implementar WebSockets de forma sencilla y compatible con todos los navegadores.
- Se eligió por su facilidad de integración con Express, su robustez y su comunidad activa.

## Paso a paso de la implementación
1. **Unificación del servidor HTTP y Socket.IO**
   - Se crea el servidor HTTP una sola vez y se pasa tanto a Express como a Socket.IO:
     ```js
     const app = express();
     const server = require('http').createServer(app);
     const { Server } = require('socket.io');
     const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
     ```
   - Esto asegura que tanto la API REST como los sockets compartan el mismo puerto y contexto.

2. **Exportación de la instancia de Socket.IO**
   - Se exporta `io` desde `app.js` para poder usarlo en cualquier controlador:
     ```js
     module.exports = { app, io };
     ```

3. **Emisión del evento en el flujo crítico**
   - Cada vez que se registra una entrada/salida por RFID (endpoint `/acceso-rfid`), después de guardar el historial, se emite el evento:
     ```js
     const { io } = require('../app');
     const dashboardController = require('../controllers/dashboardController');
     if (io) {
       const stats = await dashboardController.getDashboardStatsData();
       io.emit('actividad_actualizada', stats);
     }
     ```
   - Esto envía los datos actualizados del dashboard a todos los clientes conectados.

4. **Buenas prácticas**
   - Solo se deja en consola el log esencial de acceso autorizado.
   - Los logs de depuración y emisión de eventos se eliminan para producción.
   - Si ocurre un error al emitir el evento, se muestra como error pero no interrumpe el flujo principal.

## Flujo resumido
1. El usuario pasa la tarjeta RFID.
2. El backend registra el acceso y actualiza el historial.
3. El backend emite el evento `actividad_actualizada` con los nuevos datos.
4. Todos los dashboards conectados reciben el evento y actualizan la UI en tiempo real.

## Ventajas para la industria
- Permite monitoreo en vivo y reacción inmediata ante eventos críticos.
- La arquitectura es escalable y puede adaptarse a otros eventos o módulos.
- El código es limpio, desacoplado y fácil de mantener. 

## Gestión de usuarios: Deshabilitar y habilitar (histórico y trazabilidad)

### Flujo de backend
- Cuando se "elimina" un usuario, el endpoint `/api/usuarios/:id` (PUT) actualiza el campo `estado` a `"deshabilitado"` en vez de borrar el registro.
- El usuario deshabilitado no puede autenticarse ni operar en la app, pero su información y relaciones (dispositivos, historial) se mantienen.
- Para reactivar, el endpoint `/api/usuarios/:id/habilitar` cambia el estado a `"activo"`.

### Importancia institucional
- **Histórico y trazabilidad:** Se conserva el registro de todos los usuarios, incluso los inactivos.
- **Integridad referencial:** Los dispositivos asociados siguen apuntando al usuario, evitando datos huérfanos.
- **Auditoría:** Permite saber quién registró o usó un dispositivo en el pasado.

### Ejemplo de endpoints
- Deshabilitar usuario:
  - `PUT /api/usuarios/47` con body `{ estado: "deshabilitado" }`
  - Respuesta: `{ message: "Usuario deshabilitado correctamente" }`
- Habilitar usuario:
  - `PUT /api/usuarios/47/habilitar`
  - Respuesta: `{ message: "Usuario habilitado correctamente", usuario: { ... } }`

### Relación con dispositivos
- Los dispositivos asociados a un usuario deshabilitado **no se pierden** ni se reasignan.
- El nombre del usuario sigue apareciendo en la consulta de dispositivos.
- (Opcional: Si se requiere, se puede incluir el campo `estado` del usuario en la consulta de dispositivos para mostrarlo en el frontend).

### Buenas prácticas
- **Nunca borres usuarios físicamente si tienen relaciones importantes.**
- Usa siempre el campo `estado` para mantener el histórico y la integridad de los datos.
- Documenta claramente el flujo para otros desarrolladores y auditores. 

## Alternancia ENTRADA/SALIDA por RFID (Backend)

### Descripción

Para evitar registros duplicados de ENTRADA, el sistema implementa una lógica de alternancia en el endpoint de acceso por RFID.  
Esto asegura que para cada dispositivo solo pueda existir un registro abierto (sin salida) en la tabla `historial_dispositivo`.

### Lógica de funcionamiento

1. **Al pasar la tarjeta RFID:**
   - Se busca si existe un registro abierto (`fecha_hora_salida IS NULL`) para el dispositivo.
   - Si **NO existe**: se crea un nuevo registro de ENTRADA.
   - Si **SÍ existe**: se actualiza ese registro, registrando la SALIDA.

2. **Tabla involucrada:**  
   - `historial_dispositivo`
     - `id_historial` (PK)
     - `id_dispositivo` (FK)
     - `fecha_hora_entrada` (timestamp)
     - `fecha_hora_salida` (timestamp, puede ser NULL)
     - `descripcion` (texto)

### Fragmento de código relevante

```js
// Alternancia ENTRADA/SALIDA
const registroAbiertoRes = await pool.query(
  'SELECT * FROM historial_dispositivo WHERE id_dispositivo = $1 AND fecha_hora_salida IS NULL ORDER BY id_historial DESC LIMIT 1',
  [dispositivo.id]
);
if (registroAbiertoRes.rows.length === 0) {
  // Registrar ENTRADA
  await pool.query(
    'INSERT INTO historial_dispositivo (id_dispositivo, fecha_hora_entrada, fecha_hora_salida, descripcion) VALUES ($1, NOW(), NULL, $2)',
    [dispositivo.id, descripcion]
  );
} else {
  // Registrar SALIDA
  await pool.query(
    'UPDATE historial_dispositivo SET fecha_hora_salida = NOW(), descripcion = $1 WHERE id_historial = $2',
    [descripcion, registroAbiertoRes.rows[0].id_historial]
  );
}
```

### Ejemplo de flujo

- **Primer pase de tarjeta:**  
  → Se registra ENTRADA (nuevo registro, salida en NULL).
- **Segundo pase de tarjeta:**  
  → Se registra SALIDA (se actualiza el registro abierto).

### Beneficios

- Integridad de datos: nunca hay dos ENTRADAS abiertas.
- Trazabilidad clara de movimientos.
- Evita inconsistencias en el historial. 

## Configuración de CORS y allowedOrigins

El backend utiliza un array `allowedOrigins` para definir qué dominios y IPs pueden hacer peticiones:

```js
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.1.124:5173',
  'https://compuscan.com',
];
```

- **localhost:** Para desarrollo en el PC.
- **IP local:** Para pruebas desde otros dispositivos en la red (celular, tablet, etc.).
- **Dominio:** Para producción.

**¿Por qué es importante?**
- Permite pruebas y desarrollo sin errores de CORS.
- Facilita el despliegue y la transición entre entornos.

**¿Qué hacer al desplegar?**
- Agregar el dominio real de producción.
- Mantener localhost e IP local si se harán pruebas internas.

**Nota:** Si la IP local cambia, actualiza el array para evitar bloqueos de CORS. 

## Implementación de Asistencia y Justificación en el Backend

### Arquitectura
- Modelo: `asistenciaModel.js` gestiona el registro, actualización y consulta de asistencias.
- Controlador: `asistenciaController.js` expone endpoints REST para registrar, consultar y justificar asistencias.
- Rutas: `asistenciaRoutes.js` define los endpoints y protege con middleware de autenticación y roles.

### Endpoints Principales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/asistencia | Registrar o actualizar asistencia (manual o RFID) |
| GET    | /api/asistencia/por-ficha-fecha | Consultar asistencias por ficha y fecha |
| GET    | /api/asistencia/aprendices/ficha/:id | Listar aprendices por ficha |
| GET    | /api/asistencia/estadisticas | Estadísticas de asistencia por ficha y fecha |
| GET    | /api/asistencia/historial | Historial de asistencias (filtros por ficha, fecha, usuario) |

### Flujo de Registro y Justificación
1. El instructor o el sistema (por RFID) registra la asistencia.
2. El backend valida que no haya duplicados para el mismo usuario y fecha.
3. Permite justificar inasistencias con motivo, observación y evidencia.
4. El backend actualiza el registro y lo marca como "justificado".

### Integración con RFID
- El backend recibe el código RFID, identifica al usuario/dispositivo y registra la asistencia automáticamente.
- Alternancia ENTRADA/SALIDA: Si ya existe una entrada abierta, el siguiente pase se interpreta como salida.

### Historial y Estadísticas
- Endpoints para consultar historial por ficha, usuario, fecha y estado.
- Estadísticas de presentes, ausentes, justificados, % asistencia, RFID, manual.

### Seguridad y Buenas Prácticas
- Todos los endpoints protegidos por JWT y middleware de roles.
- Validación de datos y manejo centralizado de errores.
- No se exponen datos sensibles en las respuestas.

### Código relevante
- `controllers/asistenciaController.js`
- `models/asistenciaModel.js`
- `routes/asistenciaRoutes.js`

--- 