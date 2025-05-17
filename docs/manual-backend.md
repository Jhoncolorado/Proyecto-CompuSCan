# Manual de Referencia Backend

## Índice
1. [Introducción al Desarrollo Backend](#introducción-al-desarrollo-backend)
2. [Arquitecturas y Patrones](#arquitecturas-y-patrones)
3. [APIs y Comunicación](#apis-y-comunicación)
4. [Bases de Datos](#bases-de-datos)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [Despliegue y DevOps](#despliegue-y-devops)
7. [Testing y QA](#testing-y-qa)
8. [Ejemplos de Implementación](#ejemplos-de-implementación)
9. [Buenas Prácticas](#buenas-prácticas)
10. [Recursos Adicionales](#recursos-adicionales)

## Introducción al Desarrollo Backend

El desarrollo backend se refiere a la parte de una aplicación web que opera en el servidor, gestionando la lógica de negocio, el acceso a datos y la comunicación con el cliente. Es el "cerebro" oculto de la aplicación que procesa solicitudes, aplica reglas de negocio y devuelve respuestas.

### Tecnologías y Lenguajes Comunes

#### Lenguajes de Programación
- **JavaScript/Node.js**: Entorno de ejecución basado en JavaScript para servidores.
- **Python**: Muy utilizado con frameworks como Django y Flask.
- **Java**: Robusto y ampliamente adoptado en entornos empresariales con Spring.
- **PHP**: Popular para desarrollo web con Laravel o Symfony.
- **C#/.NET**: Solución completa de Microsoft para aplicaciones empresariales.
- **Go**: Eficiente y escalable, ideal para microservicios.
- **Ruby**: Conocido por Ruby on Rails y su productividad.

#### Frameworks y Librerías
- **Node.js**: Express.js, NestJS, Koa, Fastify
- **Python**: Django, Flask, FastAPI
- **Java**: Spring Boot, Quarkus
- **PHP**: Laravel, Symfony
- **C#**: ASP.NET Core
- **Go**: Gin, Echo
- **Ruby**: Ruby on Rails, Sinatra

### El Rol del Backend en Aplicaciones Web

El backend cumple varias funciones críticas:

1. **Procesamiento de Datos**: Aplicar lógica de negocio a los datos recibidos.
2. **Almacenamiento**: Gestionar la persistencia en bases de datos.
3. **Autenticación y Autorización**: Verificar identidades y permisos.
4. **Integración**: Comunicarse con otros servicios y APIs.
5. **Rendimiento**: Optimizar tiempos de respuesta y gestionar recursos.
6. **Seguridad**: Proteger datos y prevenir vulnerabilidades.

## Arquitecturas y Patrones

### Arquitectura Cliente-Servidor

La arquitectura cliente-servidor divide la aplicación en dos partes:

```
Cliente (Frontend) <---HTTP/API---> Servidor (Backend) <---> Base de Datos
```

- **Cliente**: Interfaz de usuario, responsable de la presentación.
- **Servidor**: Procesa solicitudes, ejecuta lógica de negocio y accede a datos.
- **Comunicación**: Generalmente mediante HTTP con formatos como JSON.

### Arquitectura MVC

El patrón Modelo-Vista-Controlador separa responsabilidades:

```
           ┌─────────────┐
           │ Controlador │◄───── Solicitud HTTP
           └──────┬──────┘
                  │
                  ▼
┌─────────┐    ┌──────┐
│  Vista  │◄───┤Modelo│
└─────────┘    └──────┘
     │
     ▼
  Respuesta
```

- **Modelo**: Gestiona datos y lógica de negocio.
- **Vista**: Presentación de datos (templates o JSON en APIs).
- **Controlador**: Maneja solicitudes y coordina modelo y vista.

### Arquitectura de Capas

Organiza el código en capas con responsabilidades específicas:

```
┌───────────────────┐
│     Interfaz      │ Controllers/Routes
├───────────────────┤
│  Lógica Negocio   │ Services
├───────────────────┤
│ Acceso a Datos    │ Models/Repositories
├───────────────────┤
│   Persistencia    │ Database
└───────────────────┘
```

1. **Capa de Presentación**: Controllers y routers que manejan solicitudes.
2. **Capa de Lógica de Negocio**: Services que implementan reglas de negocio.
3. **Capa de Acceso a Datos**: Models o repositories que gestionan entidades.
4. **Capa de Persistencia**: Interacción directa con la base de datos.

### Microservicios vs Monolíticos

**Aplicación Monolítica**:
- Una sola aplicación unificada
- Más simple de desarrollar y desplegar inicialmente
- Adecuada para equipos pequeños y aplicaciones de complejidad media

**Arquitectura de Microservicios**:
- Múltiples servicios especializados que se comunican entre sí
- Cada servicio se enfoca en una funcionalidad específica
- Escalado independiente
- Adecuada para aplicaciones complejas y equipos grandes

## APIs y Comunicación

### Tipos de APIs

#### REST (Representational State Transfer)

Arquitectura basada en recursos identificados por URLs y operados mediante métodos HTTP:

```
GET    /usuarios           - Obtener todos los usuarios
GET    /usuarios/123       - Obtener usuario con ID 123
POST   /usuarios           - Crear nuevo usuario
PUT    /usuarios/123       - Actualizar todo el usuario 123
PATCH  /usuarios/123       - Actualizar parcialmente usuario 123
DELETE /usuarios/123       - Eliminar usuario 123
```

Características:
- Stateless (sin estado)
- Interfaz uniforme
- Sistema por capas
- Respuestas cacheables

#### GraphQL

Lenguaje de consulta para APIs que permite al cliente solicitar exactamente los datos que necesita:

```graphql
query {
  usuario(id: "123") {
    nombre
    email
    posts {
      titulo
      fecha
    }
  }
}
```

Características:
- Una sola URL para todos los recursos
- Consultas flexibles definidas por el cliente
- Tipado fuerte
- Resolvers independientes por campo

#### gRPC

Framework RPC (Remote Procedure Call) desarrollado por Google:

```protobuf
service UsuarioService {
  rpc GetUsuario(UsuarioRequest) returns (Usuario) {}
  rpc ListUsuarios(ListUsuariosRequest) returns (ListUsuariosResponse) {}
}
```

Características:
- Alto rendimiento con Protocol Buffers
- Soporte para streaming
- Generación automática de código cliente/servidor
- Ideal para comunicación entre microservicios

### Diseño de APIs RESTful

#### Principios de Diseño

1. **Orientado a Recursos**: Identificar y modelar recursos, no acciones.
2. **URLs Descriptivas**: Usar nombres de recursos en plural.
   ```
   /articulos en lugar de /getArticulos
   ```
3. **Métodos HTTP**: Usar el método HTTP adecuado para cada operación.
4. **Códigos de Estado**: Utilizar códigos HTTP estándar para indicar resultados.
5. **Versionado**: Incluir versión en la URL o encabezados.
   ```
   /api/v1/usuarios
   ```
6. **Filtrado y Paginación**: Implementar mediante parámetros de consulta.
   ```
   /productos?categoria=electronica&orden=precio&pagina=2&limite=10
   ```
7. **HATEOAS**: Incluir enlaces relacionados en las respuestas.

#### Ejemplo de Diseño RESTful

```javascript
// routes/usuarioRoutes.js
const router = express.Router();

// Obtener todos los usuarios (con filtros opcionales)
router.get('/', usuarioController.getAllUsuarios);

// Obtener un usuario específico
router.get('/:id', usuarioController.getUsuarioById);

// Crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

// Actualizar un usuario existente
router.put('/:id', usuarioController.updateUsuario);

// Actualizar parcialmente un usuario
router.patch('/:id', usuarioController.partialUpdateUsuario);

// Eliminar un usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
```

### Documentación de APIs

#### Swagger/OpenAPI

Herramienta para documentar APIs de forma interactiva:

```javascript
// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios',
      version: '1.0.0',
      description: 'API para gestionar usuarios',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./routes/*.js'], // Archivos con anotaciones
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
```

## Bases de Datos

### Tipos de Bases de Datos

#### Relacionales (SQL)
- **PostgreSQL**: Robusta, extensible, ideal para datos complejos y geoespaciales.
- **MySQL/MariaDB**: Popular, fácil de usar, buena para aplicaciones web estándar.
- **SQL Server**: Solución empresarial de Microsoft con buen soporte e integración.
- **Oracle**: Para entornos empresariales de alto rendimiento.
- **SQLite**: Base de datos de archivo único, ideal para aplicaciones móviles y embebidas.

#### No Relacionales (NoSQL)
- **MongoDB**: Base de datos documental para datos semiestructurados.
- **Redis**: Almacén clave-valor en memoria para caching y datos temporales.
- **Cassandra**: Base de datos columnar para grandes volúmenes de datos distribuidos.
- **Neo4j**: Base de datos de grafos para datos altamente relacionados.
- **Firebase/Firestore**: Solución basada en la nube para desarrollo rápido.

### ORM y Modelado de Datos

Los Object-Relational Mappers (ORM) facilitan la interacción con bases de datos relacionales usando objetos:

#### Sequelize (JavaScript/Node.js)

```javascript
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});

// Uso
async function createUser() {
  await Usuario.create({
    nombre: 'Juan Pérez',
    email: 'juan@example.com'
  });
}
```

#### Acceso nativo a PostgreSQL con Node.js

```javascript
// models/usuarioModel.js
const pool = require('../config/db');

const usuarioModel = {
  getAllUsuarios: async () => {
    const query = 'SELECT id, nombre, correo FROM usuario';
    const result = await pool.query(query);
    return result.rows;
  },
  
  getUsuarioById: async (id) => {
    const query = 'SELECT id, nombre, correo FROM usuario WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  
  createUsuario: async (usuario) => {
    const { nombre, correo, contrasena } = usuario;
    const query = `
      INSERT INTO usuario (nombre, correo, contrasena) 
      VALUES ($1, $2, $3) 
      RETURNING id, nombre, correo
    `;
    const result = await pool.query(query, [nombre, correo, contrasena]);
    return result.rows[0];
  }
};

module.exports = usuarioModel;
```

### Migraciones y Gestión del Esquema

Las migraciones permiten versionar y evolucionar el esquema de la base de datos:

```sql
-- migrations/001_create_users_table.sql
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrations/002_add_user_fields.sql
ALTER TABLE usuario
ADD COLUMN telefono VARCHAR(20),
ADD COLUMN estado BOOLEAN DEFAULT true;
```

### Patrones de Acceso a Datos

#### Repository Pattern

Separa la lógica de acceso a datos de la lógica de negocio:

```javascript
// repositories/usuarioRepository.js
class UsuarioRepository {
  async findAll() {
    const query = 'SELECT * FROM usuario';
    const result = await pool.query(query);
    return result.rows;
  }
  
  async findById(id) {
    const query = 'SELECT * FROM usuario WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  async create(usuario) {
    const { nombre, correo, contrasena } = usuario;
    const query = `
      INSERT INTO usuario (nombre, correo, contrasena) 
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(query, [nombre, correo, contrasena]);
    return result.rows[0];
  }
}

// services/usuarioService.js
class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }
  
  async obtenerTodos() {
    return this.usuarioRepository.findAll();
  }
  
  async crearUsuario(usuario) {
    // Validar datos
    if (!usuario.nombre || !usuario.correo) {
      throw new Error('Datos incompletos');
    }
    
    // Encriptar contraseña
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, 10);
    
    // Crear usuario
    return this.usuarioRepository.create(usuario);
  }
}
```

## Autenticación y Seguridad

### Métodos de Autenticación

#### JWT (JSON Web Tokens)

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    // Verificar credenciales
    const usuario = await usuarioModel.getUsuarioByEmail(correo);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
```

#### Middleware de Autenticación

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};

module.exports = { verificarToken, esAdmin };
```

### Protección contra Vulnerabilidades Comunes

#### Inyección SQL

**Incorrecta (vulnerable)**:
```javascript
// NO HAGAS ESTO
const id = req.params.id;
const query = `SELECT * FROM usuarios WHERE id = ${id}`;
```

**Correcta (parameterizada)**:
```javascript
const id = req.params.id;
const query = 'SELECT * FROM usuarios WHERE id = $1';
const result = await pool.query(query, [id]);
```

#### Cross-Site Scripting (XSS)

**Prevención**:
- Escapar datos de salida
- Usar encabezados de seguridad como Content-Security-Policy
- Validar y sanitizar entradas

```javascript
// Middleware de seguridad
const helmet = require('helmet');
app.use(helmet());
```

#### CSRF (Cross-Site Request Forgery)

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### Manejo de Secretos y Configuración

```javascript
// .env (nunca compartir en control de versiones)
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña_segura
JWT_SECRET=clave_super_secreta

// config/db.js
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

## Despliegue y DevOps

### Entornos de Despliegue

#### Desarrollo, Pruebas y Producción

```javascript
// config/config.js
const config = {
  development: {
    database: 'app_dev',
    logLevel: 'debug',
    apiUrl: 'http://localhost:3000'
  },
  test: {
    database: 'app_test',
    logLevel: 'info',
    apiUrl: 'http://staging-api.example.com'
  },
  production: {
    database: 'app_prod',
    logLevel: 'error',
    apiUrl: 'https://api.example.com'
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
```

### Contenedorización con Docker

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "app.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
  
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secretpassword
      - POSTGRES_DB=myapp

volumes:
  postgres_data:
```

### CI/CD (Integración y Despliegue Continuos)

Ejemplo de pipeline con GitHub Actions:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        uses: some-deployment-action@v1
        with:
          api_token: ${{ secrets.DEPLOY_TOKEN }}
```

## Testing y QA

### Tipos de Pruebas

#### Pruebas Unitarias

Verifican componentes individuales de forma aislada:

```javascript
// __tests__/models/usuarioModel.test.js
const usuarioModel = require('../../models/usuarioModel');
const pool = require('../../config/db');

// Mock del pool de conexiones
jest.mock('../../config/db');

describe('usuarioModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllUsuarios debería devolver todos los usuarios', async () => {
    // Configurar el mock
    pool.query.mockResolvedValue({
      rows: [
        { id: 1, nombre: 'Usuario 1', correo: 'usuario1@example.com' },
        { id: 2, nombre: 'Usuario 2', correo: 'usuario2@example.com' }
      ]
    });

    // Ejecutar la función
    const usuarios = await usuarioModel.getAllUsuarios();

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith('SELECT id, nombre, correo FROM usuario');
    expect(usuarios).toHaveLength(2);
    expect(usuarios[0].nombre).toBe('Usuario 1');
  });
});
```

#### Pruebas de Integración

Verifican la interacción entre componentes:

```javascript
// __tests__/integration/usuarios.test.js
const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');

describe('API de Usuarios', () => {
  beforeAll(async () => {
    // Configurar base de datos de prueba
    await pool.query('TRUNCATE TABLE usuario RESTART IDENTITY CASCADE');
    await pool.query(`
      INSERT INTO usuario (nombre, correo, contrasena) 
      VALUES ('Test User', 'test@example.com', 'hashedpassword')
    `);
  });

  test('GET /api/usuarios debería devolver lista de usuarios', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', 'Bearer ' + validToken);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await pool.end();
  });
});
```

#### Pruebas de Carga

Verifican el rendimiento bajo condiciones de uso intensivo:

```javascript
// loadtest.js con k6
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
};

export default function() {
  let res = http.get('http://localhost:3000/api/usuarios');
  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
```

## Ejemplos de Implementación

### Estructura de Carpetas para un Proyecto Express

```
proyecto/
├── app.js                 # Punto de entrada principal
├── package.json           # Dependencias y scripts
├── config/                # Configuración
│   ├── db.js              # Conexión a base de datos
│   ├── logger.js          # Configuración de logging
│   └── swagger.js         # Configuración de documentación API
├── controllers/           # Controladores
│   ├── usuarioController.js
│   └── productoController.js
├── middleware/            # Middleware personalizado
│   ├── auth.js            # Autenticación
│   └── errorHandler.js    # Manejo de errores
├── models/                # Modelos de datos
│   ├── usuarioModel.js
│   └── productoModel.js
├── routes/                # Definición de rutas
│   ├── usuarioRoutes.js
│   └── productoRoutes.js
├── services/              # Lógica de negocio
│   ├── usuarioService.js
│   └── emailService.js
├── utils/                 # Utilidades
│   ├── validators.js
│   └── helpers.js
├── tests/                 # Pruebas
│   ├── unit/
│   └── integration/
└── public/                # Archivos estáticos
    ├── css/
    └── js/
```

### Implementación Completa de un Endpoint API

```javascript
// controllers/usuarioController.js
const usuarioService = require('../services/usuarioService');
const { validationResult } = require('express-validator');

exports.getAllUsuarios = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, search } = req.query;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sort || 'nombre',
      search: search || ''
    };
    
    const usuarios = await usuarioService.obtenerTodos(options);
    
    res.status(200).json({
      data: usuarios.data,
      pagination: {
        total: usuarios.total,
        page: options.page,
        pages: Math.ceil(usuarios.total / options.limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createUsuario = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    
    res.status(201).json({
      message: 'Usuario creado con éxito',
      data: nuevoUsuario
    });
  } catch (error) {
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    next(error);
  }
};

// routes/usuarioRoutes.js
const express = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, esAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, usuarioController.getAllUsuarios);

router.post('/',
  verificarToken,
  esAdmin,
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Correo electrónico inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  usuarioController.createUsuario
);

module.exports = router;

// services/usuarioService.js
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

exports.obtenerTodos = async (options) => {
  const { page, limit, sort, search } = options;
  
  const offset = (page - 1) * limit;
  
  const query = {
    text: `
      SELECT id, nombre, correo, rol, fecha_registro
      FROM usuario
      WHERE nombre ILIKE $1 OR correo ILIKE $1
      ORDER BY ${sort === 'fecha' ? 'fecha_registro' : 'nombre'} ASC
      LIMIT $2 OFFSET $3
    `,
    values: [`%${search}%`, limit, offset]
  };
  
  const countQuery = {
    text: `
      SELECT COUNT(*) FROM usuario
      WHERE nombre ILIKE $1 OR correo ILIKE $1
    `,
    values: [`%${search}%`]
  };
  
  const [data, countResult] = await Promise.all([
    usuarioModel.query(query),
    usuarioModel.query(countQuery)
  ]);
  
  return {
    data: data.rows,
    total: parseInt(countResult.rows[0].count, 10)
  };
};

exports.crearUsuario = async (usuario) => {
  // Verificar email único
  const existente = await usuarioModel.getUsuarioByEmail(usuario.correo);
  if (existente) {
    const error = new Error('El correo ya está registrado');
    error.code = 'DUPLICATE_EMAIL';
    throw error;
  }
  
  // Encriptar contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
  usuario.contrasena = hashedPassword;
  
  // Crear usuario
  return usuarioModel.createUsuario(usuario);
};
```

## Buenas Prácticas

### Organización del Código

1. **Separación de responsabilidades**:
   - Cada módulo/clase debe tener una única responsabilidad.
   - Utiliza capas (controllers, services, models) para organizar el código.

2. **DRY (Don't Repeat Yourself)**:
   - Extrae lógica común a funciones o clases reutilizables.
   - Crea middleware para funcionalidades repetitivas.

3. **KISS (Keep It Simple, Stupid)**:
   - Mantén las soluciones simples y directas.
   - Evita sobre-ingeniería y patrones excesivamente complejos.

### Rendimiento y Escalabilidad

1. **Caching**:
   - Implementa Redis para cachear resultados frecuentes.
   - Utiliza técnicas de caché HTTP (ETag, Cache-Control).

2. **Optimización de consultas**:
   - Crea índices adecuados en la base de datos.
   - Limita los campos seleccionados a los necesarios.
   - Utiliza paginación para conjuntos grandes de datos.

3. **Procesamiento asíncrono**:
   - Utiliza colas (RabbitMQ, Redis, Bull) para tareas pesadas.
   - Implementa webhooks para notificaciones.

### Gestión de Errores

```javascript
// middleware/errorHandler.js
const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  // Loguear error
  logger.error(`${err.name}: ${err.message}`, {
    method: req.method,
    url: req.url,
    body: req.body,
    stack: err.stack
  });
  
  // Errores conocidos
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.details
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'No autorizado'
    });
  }
  
  // Error de servidor (genérico)
  res.status(500).json({
    error: 'Error interno del servidor',
    requestId: req.id // Para seguimiento
  });
};

// app.js
const errorHandler = require('./middleware/errorHandler');
// Último middleware (después de todas las rutas)
app.use(errorHandler);
```

## Recursos Adicionales

### Libros Recomendados
- **"Clean Code"** por Robert C. Martin
- **"Designing Data-Intensive Applications"** por Martin Kleppmann
- **"RESTful Web APIs"** por Leonard Richardson
- **"Node.js Design Patterns"** por Mario Casciaro
- **"Web Scalability for Startup Engineers"** por Artur Ejsmont

### Recursos Online
- [MDN Web Docs - Server-side](https://developer.mozilla.org/es/docs/Learn/Server-side)
- [Node.js Documentation](https://nodejs.org/es/docs/)
- [Express.js Documentation](https://expressjs.com/es/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Roadmap.sh - Backend](https://roadmap.sh/backend)
- [REST API Tutorial](https://restfulapi.net/)
- [FreeCodeCamp - APIs and Microservices](https://www.freecodecamp.org/learn/apis-and-microservices/)

### Comunidades
- [Stack Overflow](https://stackoverflow.com/)
- [DEV Community](https://dev.to/)
- [Reddit - r/webdev, r/node](https://www.reddit.com/r/webdev/)
- [Discord - NodeJS, Backend](https://discord.com/invite/nodejs) 