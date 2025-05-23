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

---

## Modelos de Datos

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

## Integración RFID

El sistema integra tecnología RFID para el control de acceso de dispositivos:

### Endpoint de Acceso RFID

```javascript
// routes/dispositivoRoutes.js
router.post('/acceso-rfid', async (req, res) => {
  try {
    const { rfid } = req.body;
    
    // Buscar el dispositivo por RFID
    const dispositivo = await dispositivoModel.getByRFID(rfid);
    if (!dispositivo) {
      return res.status(404).json({ 
        success: false, 
        message: 'No se encontró un dispositivo con ese RFID' 
      });
    }

    // Buscar el usuario asociado
    const usuario = await usuarioModel.getById(dispositivo.id_usuario);

    // Determinar si es entrada o salida
    const ultimoEvento = await historialModel.getLastByDispositivo(dispositivo.id_dispositivo);
    
    let tipoEvento = 'ENTRADA';
    if (ultimoEvento && ultimoEvento.descripcion.includes('ENTRADA')) {
      tipoEvento = 'SALIDA';
    }
    
    // Registrar evento en historial
    const descripcion = `Acceso autorizado: ${tipoEvento} - RFID: ${rfid} - Usuario: ${usuario.nombre}`;
    await historialModel.create({
      descripcion,
      id_dispositivo: dispositivo.id_dispositivo
    });

    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        usuario,
        dispositivo,
        tipoEvento
      },
      message: `Acceso autorizado: ${tipoEvento}`
    });
  } catch (error) {
    console.error('Error en acceso RFID:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al procesar acceso RFID' } 
    });
  }
});
```

### Lector RFID

El sistema está diseñado para integrarse con lectores RFID físicos mediante:

1. **API REST**: Los lectores envían solicitudes HTTP al endpoint `/api/dispositivos/acceso-rfid`
2. **WebSockets**: Para actualizaciones en tiempo real de accesos (opcional)
3. **Aplicación de escritorio**: Interfaz para operadores de control de acceso

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