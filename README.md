# CompuSCan - Sistema de Control y Gestión

## Descripción General
CompuSCan es un sistema integral para la gestión y control de dispositivos, usuarios, historial de accesos, alertas, carnets y casos de incidentes. Permite registrar, monitorear y auditar el uso de dispositivos mediante tecnología RFID, así como gestionar usuarios y eventos de seguridad en una plataforma web moderna.

---

## Estructura del Proyecto (Backend y Frontend)

```
Proyecto-CompuSCan/
│
├── app.js                      # Archivo principal del backend (Node.js/Express)
├── package.json                # Dependencias y scripts del backend
├── config/
│   ├── database.js             # Configuración y conexión a la base de datos (pool de PostgreSQL)
│   └── swagger.js              # Configuración de Swagger para documentación de la API
├── controllers/                # Lógica de negocio de cada entidad
│   ├── dispositivoController.js
│   ├── usuarioController.js
│   └── ...otros controladores
├── models/                     # Acceso a la base de datos (consultas SQL)
│   ├── dispositivoModel.js
│   ├── usuarioModel.js
│   └── ...otros modelos
├── routes/                     # Rutas de la API (Express Routers)
│   ├── dispositivoRoutes.js
│   ├── usuarioRoutes.js
│   └── ...otras rutas
├── public/                     # Archivos estáticos (frontend compilado, imágenes, etc.)
│   └── index.html
│
└── front/                      # Carpeta del frontend (React + Vite)
    ├── src/
    │   ├── App.jsx             # Componente principal de React (enrutador)
    │   ├── main.jsx            # Punto de entrada de React
    │   ├── components/         # Componentes reutilizables (Header, Sidebar, etc.)
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx  # Layout general de la app (estructura de página)
    │   │   │   ├── Header.jsx  # Header superior (logo, menú, usuario)
    │   │   │   └── Sidebar.jsx # (si existe) Menú lateral
    │   │   ├── AccessControl.jsx # Pantalla de control de acceso RFID
    │   │   └── ...otros componentes
    │   ├── pages/              # Páginas principales (cada sección)
    │   │   ├── users/          # Página de usuarios
    │   │   ├── devices/        # Página de dispositivos
    │   │   ├── history/        # Página de historial de accesos
    │   │   │   ├── History.jsx # Componente de la tabla de historial
    │   │   │   └── History.css # Estilos de la tabla de historial
    │   │   └── ...otras páginas
    │   └── styles/             # Archivos CSS globales
    └── ...otros archivos de Vite/React
```

---

## Backend (Node.js/Express)

### app.js
- **Función:** Archivo principal del backend. Configura middlewares, rutas, Swagger, y arranca el servidor Express.
- **Ejemplo de arranque:**
```js
node app.js
```
- **Incluye:**
  - Carga de variables de entorno
  - Configuración de CORS
  - Rutas API (`/api/usuarios`, `/api/dispositivos`, etc.)
  - Servir archivos estáticos y frontend
  - Manejo global de errores

### config/database.js
- **Función:** Configura y exporta el pool de conexiones a PostgreSQL usando `pg`.
- **Ejemplo:**
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

### controllers/
- **Función:** Lógica de negocio de cada entidad. Recibe la petición, valida datos, llama a los modelos y responde.
- **Ejemplo:**
  - `dispositivoController.js`: Alta, baja, modificación y consulta de dispositivos.
  - `usuarioController.js`: Gestión de usuarios.

### models/
- **Función:** Acceso directo a la base de datos. Define funciones para CRUD y consultas complejas.
- **Ejemplo:**
  - `dispositivoModel.js`:
    ```js
    getDispositivoByRFID: async (rfid) => {
      const result = await pool.query('SELECT * FROM dispositivo WHERE rfid = $1', [rfid]);
      return result.rows[0];
    }
    ```

### routes/
- **Función:** Define los endpoints de la API agrupados por entidad.
- **Ejemplo:**
  - `dispositivoRoutes.js`:
    - `GET /api/dispositivos` (listar)
    - `POST /api/dispositivos` (crear)
    - `POST /api/dispositivos/acceso-rfid` (registrar acceso RFID)

### public/
- **Función:** Carpeta de archivos estáticos. Aquí se sirve el frontend compilado y recursos como imágenes.

---

## Frontend (React + Vite)

### src/App.jsx
- **Función:** Define las rutas del frontend usando React Router.
- **Ejemplo:**
```jsx
<Route path="/usuarios" element={<UsersPage />} />
<Route path="/dispositivos" element={<DevicesPage />} />
<Route path="/historial" element={<HistoryPage />} />
```

### src/components/layout/Layout.jsx
- **Función:** Layout general de la app. Incluye el header y el contenedor principal centrado.
- **Ejemplo:**
```jsx
<div className="container-fluid p-0 min-vh-100 bg-light">
  <Header />
  <div className="main-content">...</div>
</div>
```

### src/components/layout/Header.jsx
- **Función:** Header superior con logo, menú de navegación y usuario.
- **Incluye:**
  - Logo
  - Menú de navegación (Inicio, Usuarios, Dispositivos, etc.)
  - Info de usuario y botón de cerrar sesión

### src/pages/users/
- **Función:** Página de gestión de usuarios. Tabla, búsqueda, creación y edición de usuarios.
- **Componentes:**
  - Tabla de usuarios
  - Barra de búsqueda
  - Botón "Nuevo Usuario"

### src/pages/devices/
- **Función:** Página de gestión de dispositivos. Tabla, búsqueda, creación y edición de dispositivos.
- **Componentes:**
  - Tabla de dispositivos
  - Barra de búsqueda
  - Botón "Nuevo Dispositivo"

### src/pages/history/History.jsx
- **Función:** Página de historial de accesos. Muestra una tabla con todos los eventos de entrada/salida de dispositivos.
- **Componentes:**
  - Tabla de historial (fecha, descripción, dispositivo, serial)
  - Estilos iguales a usuarios/dispositivos

### src/components/AccessControl.jsx
- **Función:** Pantalla para pasar la tarjeta RFID.
- **Flujo:**
  1. El input está enfocado automáticamente.
  2. Al pasar la tarjeta, se envía el código RFID al backend (`POST /api/dispositivos/acceso-rfid`).
  3. El backend registra el evento (entrada/salida) y responde con el resultado.
  4. Se muestra el mensaje de acceso autorizado y los datos del usuario/dispositivo.

---

## Flujo de Acceso RFID (de extremo a extremo)

1. **El usuario pasa la tarjeta RFID en la pantalla de control de acceso** (`AccessControl.jsx`).
2. **El frontend envía una petición POST al backend:**
   - Endpoint: `/api/dispositivos/acceso-rfid`
   - Payload: `{ rfid: 'codigo_rfid' }`
3. **El backend busca el dispositivo y usuario asociado, alterna ENTRADA/SALIDA, registra el evento en la base de datos y responde.**
4. **El frontend muestra el resultado y el evento aparece en la tabla de historial.**

---

## ¿Cómo abrir varias pantallas en Vite/React?
- Simplemente abre varias pestañas del navegador y navega a la URL que quieras (por ejemplo, `/usuarios` en una y `/historial` en otra).
- Cada pestaña funciona de forma independiente gracias a React Router.

---

## ¿Dónde está la pantalla para pasar la tarjeta RFID?
- **Archivo:** `front/src/components/AccessControl.jsx`
- **Función:** Permite leer el código RFID y registrar el acceso en el sistema.
- **Ubicación:** Puede estar en el menú principal o como una ruta protegida.

---

## ¿Dónde se guarda y visualiza el historial?
- **Base de datos:** Tabla `historial_dispositivo`.
- **Backend:** Endpoints en `routes/historialDispositivoRoutes.js` y lógica en `controllers/historialDispositivoController.js`.
- **Frontend:** Página `/historial` (`front/src/pages/history/History.jsx`).

---

## Alternancia ENTRADA/SALIDA
- El backend revisa el último evento del dispositivo y alterna automáticamente entre ENTRADA y SALIDA.
- Ejemplo de código:
```js
const ultimoEventoRes = await pool.query(
  'SELECT descripcion FROM historial_dispositivo WHERE id_dispositivo = $1 ORDER BY fecha_hora DESC LIMIT 1',
  [dispositivo.id]
);
let tipoEvento = 'ENTRADA';
if (ultimoEventoRes.rows.length > 0) {
  const ultimaDescripcion = ultimoEventoRes.rows[0].descripcion;
  if (ultimaDescripcion.includes('Acceso autorizado: ENTRADA')) tipoEvento = 'SALIDA';
  else if (ultimaDescripcion.includes('Acceso autorizado: SALIDA')) tipoEvento = 'ENTRADA';
}
```

---

## Respuestas rápidas a dudas frecuentes

- **¿Cómo tener dos pantallas en Vite?**
  Solo abre dos pestañas en el navegador, cada una con la URL que quieras.

- **¿Dónde está la pantalla para pasar la tarjeta?**
  En el componente `AccessControl.jsx` del frontend.

- **¿Dónde se guarda el historial?**
  En la base de datos, tabla `historial_dispositivo`, y se muestra en la página `/historial`.

- **¿Cómo se alterna entre ENTRADA y SALIDA?**
  El backend revisa el último evento del dispositivo y alterna automáticamente.

- **¿Cómo se ve el historial?**
  En la página `/historial`, con una tabla igual a la de usuarios y dispositivos.

---

## Consejos para tu equipo

- **Todo está modularizado:**
  - Backend: rutas, controladores, modelos.
  - Frontend: páginas, componentes, layout.
- **Puedes abrir cualquier sección en cualquier pestaña.**
- **El control de acceso RFID es automático y centralizado.**
- **El historial es global y se actualiza con cada evento.**

---

## Ejemplo de flujo completo de acceso RFID

1. El usuario pasa la tarjeta en la pantalla de control de acceso.
2. El frontend envía el código RFID al backend.
3. El backend registra el evento (entrada/salida) y responde.
4. El frontend muestra el resultado.
5. El evento aparece en la tabla de historial.

---

¿Dudas? Consulta este README o revisa el código fuente en los archivos y rutas indicadas.