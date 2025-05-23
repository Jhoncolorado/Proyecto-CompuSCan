# CompuSCan - Sistema de Control y Gestión de Dispositivos

## Descripción General

CompuSCan es una plataforma web desarrollada específicamente para el **SENA - Centro de Comercio y Turismo**. Su objetivo es optimizar y modernizar el registro, consulta y administración de dispositivos institucionales, utilizando tecnología RFID para agilizar el proceso y reducir errores manuales. El sistema responde a la necesidad del SENA de controlar y trazar sus equipos tecnológicos de manera eficiente, segura y alineada con los procesos institucionales.  


---

## Tabla de Contenidos

1. [Características](#características)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Despliegue](#instalación-y-despliegue)
4. [Documentación Oficial](#documentación-oficial)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Mejoras Recientes](#mejoras-recientes)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

---

## Características

- **Gestión de dispositivos**:  
  - Alta, edición, consulta y eliminación de dispositivos.
  - Búsqueda y filtrado por nombre, serial o RFID.
  - Visualización de detalles de cada equipo.
  - Validación de dispositivos con sistema de aprobación.

- **Panel de control**:  
  - Dashboard con resumen de dispositivos registrados y actividad reciente.
  - Interfaces diferenciadas según el rol del usuario.
  - Visualización de estadísticas y accesos recientes.

- **Gestión de usuarios**:
  - Administración de perfiles de usuarios (aprendices, instructores, administradores).
  - Control de acceso basado en roles.
  - Perfiles personalizados con foto e información detallada.

- **Seguridad**:  
  - Autenticación robusta de usuarios.
  - Validación avanzada de formularios.
  - Protección contra ataques comunes.

- **Integración RFID**:  
  - Registro y consulta de dispositivos mediante etiquetas RFID.
  - Control de entrada/salida de equipos.
  - Historial completo de movimientos.

- **Diseño responsivo**:
  - Interfaz adaptable a dispositivos móviles y escritorio.
  - Experiencia de usuario optimizada para diferentes tamaños de pantalla.

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
    │   ├── utils/              # Utilidades
    │   │   ├── validators.js   # Validadores de formularios
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

## Documentación Oficial

Para facilitar el entendimiento y mantenimiento del proyecto, hemos creado documentación técnica detallada para cada componente principal:

### [Documentación del Frontend](./front/DOCUMENTATION.md)
Documentación detallada sobre la arquitectura, componentes, flujo de datos, gestión de estado, rutas, estilos, integración con backend, seguridad y guía de mantenimiento del frontend.

### [Documentación del Backend](./DOCUMENTATION-BACKEND.md)
Documentación completa sobre la arquitectura, API RESTful, modelos de datos, autenticación, manejo de errores, conexión a base de datos, integración RFID, logging, seguridad y guía de mantenimiento del backend.

---

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **React Router**: Navegación y enrutamiento
- **Axios**: Cliente HTTP para comunicación con el backend
- **CSS Modules**: Estilos encapsulados por componente
- **React Icons**: Iconografía consistente en toda la aplicación

### Backend
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Express**: Framework web para crear APIs
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **JWT**: Autenticación basada en tokens
- **Bcrypt**: Encriptación de contraseñas
- **Multer**: Manejo de carga de archivos

### Herramientas de Desarrollo
- **Vite**: Herramienta de construcción rápida para el frontend
- **ESLint**: Linting de código
- **Nodemon**: Reinicio automático del servidor durante desarrollo

---

## Mejoras Recientes

### Sistema de Validación de Formularios
- Implementación de un sistema robusto de validación con feedback en tiempo real
- Validadores específicos para correos, contraseñas, documentos y otros campos
- Componente `FormError` para mostrar errores de manera consistente
- Indicador visual de fortaleza de contraseñas (`PasswordStrength`)

### Interfaz de Usuario Mejorada
- Diseño completamente responsivo para todas las páginas
- Tablas con diseño optimizado para mejor visualización de datos
- Sistema de navegación mejorado con indicadores visuales claros
- Componentes modales para acciones importantes

### Optimización de Rendimiento
- Carga diferida de componentes para mejorar tiempos de carga
- Optimización de consultas a la base de datos
- Implementación de caché para datos frecuentemente utilizados

### Experiencia de Usuario
- Flujos de trabajo simplificados para tareas comunes
- Mensajes de retroalimentación claros para todas las acciones
- Interfaces diferenciadas según el rol del usuario
- Diseño visual coherente en toda la aplicación

---

## Contribuciones

Este proyecto es parte del desarrollo académico del SENA - Centro de Comercio y Turismo. Las contribuciones deben seguir el proceso establecido por la institución.

---

## Licencia

Este proyecto está licenciado bajo términos específicos del SENA. Consulte la documentación oficial para más detalles sobre derechos de uso y distribución.

---

© 2023 SENA - Centro de Comercio y Turismo. Todos los derechos reservados. 