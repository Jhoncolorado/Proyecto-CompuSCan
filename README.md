# CompuSCan - Sistema de Control y Gestión de Dispositivos

## Descripción General

CompuSCan es una plataforma web desarrollada específicamente para el **SENA - Centro de Comercio y Turismo**. Su objetivo es optimizar y modernizar el registro, consulta y administración de dispositivos institucionales, utilizando tecnología RFID para agilizar el proceso y reducir errores manuales. El sistema responde a la necesidad del SENA de controlar y trazar sus equipos tecnológicos de manera eficiente, segura y alineada con los procesos institucionales.  


---

## Tabla de Contenidos

1. [Características](#características)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Despliegue](#instalación-y-despliegue)
4. [Explicación de Carpetas y Archivos](#explicación-de-carpetas-y-archivos)
5. [Ejemplos de Código Clave](#ejemplos-de-código-clave)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)
9. [Documentación Oficial](#documentación-oficial)

---

## Características

- **Gestión de dispositivos**:  
  - Alta, edición, consulta y eliminación de dispositivos.
  - Búsqueda y filtrado por nombre, serial o RFID.
  - Visualización de detalles de cada equipo.

- **Panel de control**:  
  - Dashboard con resumen de dispositivos registrados y actividad reciente.

- **Seguridad**:  
  - Autenticación de usuarios para acceso a la plataforma.

- **Integración RFID**:  
  - Registro y consulta de dispositivos mediante etiquetas RFID.

---

## Estructura del Proyecto

```
Proyecto-CompuSCan/
│
├── app.js                      # Backend principal (Node.js/Express)
├── package.json                # Dependencias y scripts backend
├── config/
│   ├── database.js             # Conexión a PostgreSQL
│   └── swagger.js              # Documentación API
├── controllers/                # Lógica de negocio
│   ├── dispositivoController.js
│   └── ...
├── middlewares/                # Middlewares personalizados (autenticación, validación, etc.)
│   ├── auth.js
│   └── ...
├── models/                     # Consultas SQL y acceso a datos
│   ├── dispositivoModel.js
│   └── ...
├── routes/                     # Endpoints API
│   ├── dispositivoRoutes.js
│   └── ...
├── public/                     # Archivos estáticos
│   └── index.html
│
└── front/                      # Frontend (React + Vite)
    ├── src/
    │   ├── App.jsx             # Enrutador principal
    │   ├── main.jsx            # Entrada de React
    │   ├── components/         # Componentes reutilizables
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx  # Layout general
    │   │   │   ├── Header.jsx  # Header superior
    │   │   │   └── Sidebar.jsx # Sidebar (si existe)
    │   │   └── ...
    │   ├── pages/              # Vistas principales
    │   │   ├── devices/        # Página de dispositivos
    │   │   │   ├── Devices.jsx # Lógica y renderizado de la tabla de dispositivos
    │   │   │   └── Devices.css # Estilos de la tabla de dispositivos
    │   │   └── ...
    │   └── styles/             # CSS global y variables
    └── ...
```

---

## Instalación y Despliegue

### Requisitos previos
- Node.js (v16+)
- **PostgreSQL**

### Pasos rápidos

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/compuscan.git
cd compuscan

# Instala dependencias del frontend
cd front
npm install

# Instala dependencias del backend
cd ../back
npm install

# Configura variables de entorno (ver documentación en Notion)
# Inicia el backend
npm start

# Inicia el frontend
cd ../front
npm start
```

---

## Explicación de Carpetas y Archivos

### Backend
- **app.js:** Punto de entrada del backend. Configura middlewares globales, rutas, Swagger, y arranca el servidor Express.
  - Ejemplo:
    ```js
    const express = require('express');
    const app = express();
    app.use(express.json());
    app.use('/api/dispositivos', require('./routes/dispositivoRoutes'));
    app.listen(3000, () => console.log('Servidor iniciado'));
    ```
- **package.json:** Lista dependencias, scripts y metadatos del backend.
- **config/database.js:** Pool de conexiones a **PostgreSQL**.
  - Ejemplo:
    ```js
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'compuscansecurity',
      password: process.env.DB_PASSWORD || '1234',
      port: process.env.DB_PORT || 5432,
    });

    // Agregar manejo de errores y logging
    pool.on('error', (err) => {
      console.error('Error inesperado en el pool de PostgreSQL', err);
    });

    // Función para probar la conexión
    const testConnection = async () => {
      try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
        const result = await client.query('SELECT NOW()');
        console.log('✅ Base de datos responde correctamente:', result.rows[0]);
        client.release();
      } catch (err) {
        console.error('❌ Error al conectar con la base de datos:', err);
        throw err;
      }
    };

    testConnection().catch(console.error);

    module.exports = pool; 
    ```
- **config/swagger.js:** Configuración de Swagger para documentar la API REST.
- **controllers/:** Lógica de negocio para cada entidad (por ejemplo, dispositivos).
  - **dispositivoController.js:** Funciones para crear, editar, eliminar y consultar dispositivos.
- **middlewares/:** Middlewares personalizados, como autenticación JWT, validación de datos, manejo de errores, etc.
  - **auth.js:** Verifica el token JWT en las rutas protegidas.
- **models/:** Acceso directo a la base de datos y consultas SQL.
  - **dispositivoModel.js:** Funciones para CRUD de dispositivos en PostgreSQL.
- **routes/:** Define los endpoints de la API agrupados por entidad.
  - **dispositivoRoutes.js:** Rutas para `/api/dispositivos` (GET, POST, PUT, DELETE, etc.).
- **public/:** Archivos estáticos (frontend compilado, imágenes, favicon, etc.).

### Frontend
- **src/App.jsx:** Define las rutas del frontend usando React Router.
  - Ejemplo:
    ```jsx
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Devices from './pages/devices/Devices';
    <BrowserRouter>
      <Routes>
        <Route path="/devices" element={<Devices />} />
      </Routes>
    </BrowserRouter>
    ```
- **src/main.jsx:** Punto de entrada de React.
- **src/components/:** Componentes reutilizables (Header, Sidebar, Layout, etc.).
  - **layout/Layout.jsx:** Estructura general de la app.
  - **layout/Header.jsx:** Header superior con logo, menú y usuario.
  - **layout/Sidebar.jsx:** Menú lateral (si existe).
- **src/pages/:** Vistas principales de la app.
  - **devices/Devices.jsx:** Página de gestión de dispositivos (tabla, búsqueda, CRUD).
  - **devices/Devices.css:** Estilos de la tabla de dispositivos.
- **src/styles/:** CSS global y variables de diseño.

---

## Ejemplos de Código Clave

### Conexión a PostgreSQL (`config/database.js`)
```js
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'compuscansecurity',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

// Agregar manejo de errores y logging
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
        const result = await client.query('SELECT NOW()');
        console.log('✅ Base de datos responde correctamente:', result.rows[0]);
        client.release();
    } catch (err) {
        console.error('❌ Error al conectar con la base de datos:', err);
        throw err;
    }
};

testConnection().catch(console.error);

module.exports = pool;
```

### Middleware de autenticación JWT (`middleware/auth.js`)
```js
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    logger.warn('Intento de acceso no autorizado - Token no proporcionado');
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`Usuario autenticado: ${decoded.id}`);
    next();
  } catch (err) {
    logger.warn(`Token inválido: ${token}`);
    res.status(401).json({ error: 'Token inválido' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      logger.warn(`Usuario ${req.user.id} intentó acceder a recurso no autorizado`);
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

### Rutas de dispositivos (`routes/dispositivoRoutes.js`)
```js
const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');

router.post('/', dispositivoController.createDispositivo);
router.get('/', dispositivoController.getAllDispositivos);
router.get('/pendientes', dispositivoController.getDispositivosPendientes);
router.get('/:id', dispositivoController.getDispositivoById);
router.put('/:id', dispositivoController.updateDispositivo);
router.delete('/:id', dispositivoController.deleteDispositivo);
router.get('/usuario/:usuarioId', dispositivoController.getDispositivosByUsuario);

module.exports = router;
```

### Controlador de dispositivos (`controllers/dispositivoController.js`)
```js
const dispositivoModel = require('../models/dispositivoModel');

const dispositivoController = {
    getAllDispositivos: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getAllDispositivos();
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los dispositivos', error: error.message });
        }
    },
    getDispositivoById: async (req, res) => {
        try {
            const { id } = req.params;
            const dispositivo = await dispositivoModel.getDispositivoById(id);
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }
            res.json(dispositivo);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el dispositivo', error: error.message });
        }
    },
    createDispositivo: async (req, res) => {
        try {
            const { nombre, tipo, serial, foto, mimeType, id_usuario } = req.body;
            let fotoProcesada = null;
            if (foto && typeof foto === 'string' && foto.startsWith('data:')) {
                fotoProcesada = foto.split(',')[1];
            }
            const newDevice = await dispositivoModel.createDispositivo({
                nombre,
                tipo: tipo.toLowerCase(),
                serial,
                rfid: null,
                foto: fotoProcesada,
                mimeType,
                id_usuario
            });
            res.status(201).json({
                message: 'Dispositivo registrado exitosamente',
                dispositivo: newDevice
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el dispositivo', error: error.message });
        }
    },
    updateDispositivo: async (req, res) => {
        try {
            const { id } = req.params;
            const dispositivo = await dispositivoModel.getDispositivoById(id);
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }
            let fotoProcesada = dispositivo.foto;
            if (req.body.foto && typeof req.body.foto === 'string' && req.body.foto.startsWith('data:')) {
                fotoProcesada = req.body.foto.split(',')[1];
            }
            const dispositivoData = {
                nombre: req.body.nombre || dispositivo.nombre,
                tipo: req.body.tipo || dispositivo.tipo,
                serial: req.body.serial || dispositivo.serial,
                rfid: req.body.rfid !== undefined ? req.body.rfid : dispositivo.rfid,
                foto: fotoProcesada,
                mimeType: req.body.mimeType || dispositivo.mimeType,
                id_usuario: req.body.id_usuario || dispositivo.id_usuario,
                estado_validacion: req.body.estado_validacion || dispositivo.estado_validacion
            };
            const updatedDispositivo = await dispositivoModel.updateDispositivo(id, dispositivoData);
            res.json({
                message: 'Dispositivo actualizado exitosamente',
                dispositivo: updatedDispositivo
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar dispositivo', error: error.message });
        }
    },
    deleteDispositivo: async (req, res) => {
        try {
            const { id } = req.params;
            const dispositivo = await dispositivoModel.deleteDispositivo(id);
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }
            res.json({
                message: 'Dispositivo eliminado exitosamente',
                id: dispositivo.id
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar dispositivo', error: error.message });
        }
    },
    getDispositivosByUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const dispositivos = await dispositivoModel.getDispositivosByUsuario(usuarioId);
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los dispositivos del usuario', error: error.message });
        }
    },
    getDispositivosPendientes: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getDispositivosPendientes();
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener dispositivos pendientes', error: error.message });
        }
    }
};

module.exports = dispositivoController;
```

### Modelo de dispositivos (`models/dispositivoModel.js`)
```js
const pool = require('../config/database');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, d.mime_type, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query);
        return result.rows.map(device => {
            if (device.foto) {
                const mime = device.mime_type || device.mimeType || 'image/jpeg';
                device.foto = `data:${mime};base64,` + Buffer.from(device.foto).toString('base64');
            }
            return device;
        });
    },
    getDispositivoById: async (id) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    getDispositivoBySerial: async (serial) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.serial = $1`;
        const result = await pool.query(query, [serial]);
        return result.rows[0];
    },
    getDispositivoByRFID: async (rfid) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.rfid = $1`;
        const result = await pool.query(query, [rfid]);
        const dispositivo = result.rows[0];
        if (dispositivo && dispositivo.foto) {
            const mime = dispositivo.mime_type || dispositivo.mimeType || 'image/jpeg';
            dispositivo.foto = `data:${mime};base64,` + Buffer.from(dispositivo.foto).toString('base64');
        }
        return dispositivo;
    },
    createDispositivo: async ({ 
        nombre, tipo, serial, rfid, foto, id_usuario
    }) => {
        const query = `
            INSERT INTO dispositivo (
                nombre, tipo, serial, rfid, foto, id_usuario
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const values = [nombre, tipo, serial, rfid, foto, id_usuario];
        console.log('Insertando dispositivo con valores:', values);
        const result = await pool.query(query, values);
        console.log('Dispositivo insertado:', result.rows[0]);
        return result.rows[0];
    },
    updateDispositivo: async (id, { 
        nombre, tipo, serial, rfid, foto, id_usuario, estado_validacion
    }) => {
        let query, values;
        if (foto && typeof foto === 'string' && foto.length > 10) {
            query = `
                UPDATE dispositivo
                SET 
                    nombre = COALESCE($1, nombre),
                    tipo = COALESCE($2, tipo),
                    serial = COALESCE($3, serial),
                    rfid = COALESCE($4, rfid),
                    foto = decode($5, 'base64'),
                    id_usuario = COALESCE($6, id_usuario),
                    estado_validacion = COALESCE($7, estado_validacion)
                WHERE id = $8
                RETURNING *`;
            values = [nombre, tipo, serial, rfid, foto, id_usuario, estado_validacion, id];
        } else {
            query = `
                UPDATE dispositivo
                SET 
                    nombre = COALESCE($1, nombre),
                    tipo = COALESCE($2, tipo),
                    serial = COALESCE($3, serial),
                    rfid = COALESCE($4, rfid),
                    id_usuario = COALESCE($5, id_usuario),
                    estado_validacion = COALESCE($6, estado_validacion)
                WHERE id = $7
                RETURNING *`;
            values = [nombre, tipo, serial, rfid, id_usuario, estado_validacion, id];
        }
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    deleteDispositivo: async (id) => {
        const query = 'DELETE FROM dispositivo WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    getDispositivosByUsuario: async (usuarioId) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.id_usuario = $1
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query, [usuarioId]);
        return result.rows.map(device => {
            if (device.foto) {
                const mime = device.mime_type || device.mimeType || 'image/jpeg';
                device.foto = `data:${mime};base64,` + Buffer.from(device.foto).toString('base64');
            }
            return device;
        });
    },
    getDispositivosPendientes: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.rfid IS NULL
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query);
        return result.rows.map(device => {
            device.foto = null;
            return device;
        });
    },
    countDispositivos: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM dispositivo');
        return parseInt(result.rows[0].count, 10);
    }
};

module.exports = dispositivoModel;
```

---

## Tecnologías Utilizadas

- **Frontend:** React, Bootstrap, CSS personalizado
- **Backend:** Node.js, Express, **PostgreSQL**
- **Otros:** React Router, Context API, react-icons, JWT

---

## Contribuciones

¿Quieres contribuir?  
Lee la [guía de contribución](https://www.notion.so/CompuSCan-Proyectos-77faef643c4c471d90e582c54537902c) y sigue las buenas prácticas del equipo.

---

## Licencia

Este proyecto está bajo la licencia MIT.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Documentación Oficial

La documentación ampliada, manuales y guías de uso están disponibles en Notion:  
👉 [CompuSCan Proyectos - Documentación Oficial](https://www.notion.so/CompuSCan-Proyectos-77faef643c4c471d90e582c54537902c)

> Para dudas, sugerencias o reportes, revisa la documentación en Notion. 