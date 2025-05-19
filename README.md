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
    │   │   └── ...
    │   └── styles/             # CSS global
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
- **app.js:** Configura middlewares, rutas, Swagger, y arranca el servidor Express.
- **config/database.js:** Pool de conexiones a **PostgreSQL**.
- **controllers/:** Lógica de negocio (por ejemplo, dispositivos).
- **models/:** Acceso directo a la base de datos.
- **routes/:** Endpoints de la API agrupados por entidad.
- **public/:** Archivos estáticos.

### Frontend
- **src/App.jsx:** Rutas del frontend usando React Router.
- **src/components/layout/Layout.jsx:** Layout general de la app.
- **src/components/layout/Header.jsx:** Header superior con logo, menú y usuario.
- **src/pages/devices/:** Página de gestión de dispositivos.
- **src/styles/:** CSS global.

---

## Ejemplos de Código Clave

### Conexión a PostgreSQL (`config/database.js`)
```js
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});
module.exports = pool;
```

### Endpoint para registrar dispositivo (`routes/dispositivoRoutes.js`)
```js
router.post('/api/dispositivos', dispositivoController.crearDispositivo);
```

### Controlador de registro de dispositivo (`controllers/dispositivoController.js`)
```js
exports.crearDispositivo = async (req, res) => {
  const { nombre, serial, rfid } = req.body;
  try {
    const nuevo = await dispositivoModel.crearDispositivo({ nombre, serial, rfid });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar dispositivo' });
  }
};
```

### Modelo de dispositivo (`models/dispositivoModel.js`)
```js
const pool = require('../config/database');
exports.crearDispositivo = async ({ nombre, serial, rfid }) => {
  const result = await pool.query(
    'INSERT INTO dispositivo (nombre, serial, rfid) VALUES ($1, $2, $3) RETURNING *',
    [nombre, serial, rfid]
  );
  return result.rows[0];
};
```

### Ejemplo de uso de RFID en el backend
```js
// Registrar acceso RFID
router.post('/api/dispositivos/acceso-rfid', async (req, res) => {
  const { rfid } = req.body;
  // Buscar dispositivo por RFID y registrar evento...
});
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