# CompuSCan - Sistema de Control y Gestión de Dispositivos

## Descripción General

CompuSCan es una plataforma web desarrollada para el **SENA - Centro de Comercio y Turismo**. Permite la gestión, registro y control de dispositivos institucionales usando tecnología RFID, con trazabilidad, seguridad y automatización de procesos.

---

## Tabla de Contenidos
1. [Características](#características)
2. [Arquitectura y Diagrama General](#arquitectura-y-diagrama-general)
3. [Integración Física y Lógica del Lector RFID](#integración-física-y-lógica-del-lector-rfid)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Despliegue](#instalación-y-despliegue)
6. [Flujo de Asignación y Validación de RFID](#flujo-de-asignación-y-validación-de-rfid)
7. [Roles y Permisos](#roles-y-permisos)
8. [Ejemplo de Uso Real](#ejemplo-de-uso-real)
9. [Descarga de Reportes en Excel](#descarga-de-reportes-en-excel)
10. [Documentación Oficial](#documentación-oficial)
11. [Tecnologías Utilizadas](#tecnologías-utilizadas)
12. [Mejoras Recientes](#mejoras-recientes)
13. [Mejoras de Seguridad y Experiencia en Formularios](#mejoras-de-seguridad-y-experiencia-en-formularios)
14. [FAQ](#faq)
15. [Contribuciones](#contribuciones)
16. [Licencia](#licencia)
17. [Remoción de Secretos del Historial de Git (Caso Real)](#remoción-de-secretos-del-historial-de-git-caso-real)
18. [Gestión de imágenes múltiples por dispositivo](#gestión-de-imágenes-múltiples-por-dispositivo)

---

## Características

- **Gestión de dispositivos**: Alta, edición, consulta, eliminación, búsqueda, validación y trazabilidad por RFID.
- **Panel de control**: Dashboard con estadísticas, actividad y accesos recientes.
- **Gestión de usuarios**: Perfiles, roles, control de acceso y personalización.
- **Seguridad**: Autenticación robusta, validación avanzada y protección contra ataques.
- **Integración RFID**: Registro, consulta y control de entrada/salida de equipos.
- **Diseño responsivo**: Adaptable a móviles y escritorio.

---

## Arquitectura y Diagrama General

```
+-------------------+         +-------------------+         +-------------------+
|   Usuario Final   | <--->   |     Frontend      | <--->   |     Backend       |
| (Web/Móvil RFID)  |         |   (React + Vite)  |         | (Node/Express)    |
+-------------------+         +-------------------+         +-------------------+
                                                                |
                                                                v
                                                        +-------------------+
                                                        |   PostgreSQL DB   |
                                                        +-------------------+
```

- El usuario interactúa con la app web (React) para registrar, validar y consultar dispositivos.
- El frontend consume la API RESTful del backend (Node.js/Express).
- El backend gestiona la lógica, seguridad y persistencia en PostgreSQL.
- El flujo RFID permite registrar y validar dispositivos de forma segura y rápida.

---

## Integración Física y Lógica del Lector RFID

### ¿Cómo se conecta el lector RFID?
- El lector RFID utilizado es un dispositivo USB que actúa como teclado (HID).
- Al pasar una tarjeta, el lector "escribe" el código RFID en un campo de entrada invisible en el frontend.
- El frontend detecta el valor y lo envía automáticamente al backend para validación y registro.

### Ejemplo de flujo:
1. El usuario/admin enfoca la pantalla de validación/acceso.
2. Pasa la tarjeta por el lector RFID.
3. El lector "escribe" el código en el input invisible (como si fuera un teclado).
4. El frontend detecta el cambio y dispara la petición al backend (`/api/dispositivos/acceso-rfid`).
5. El backend procesa el acceso, valida y responde con los datos correspondientes.

### Recomendaciones de hardware:
- Lector RFID USB compatible con HID (plug & play, no requiere drivers especiales).
- Configuración de teclado en español para evitar errores de lectura.
- Probar el lector en un editor de texto: al pasar la tarjeta debe aparecer el código RFID automáticamente.

### Nota:
- Este método permite máxima compatibilidad y facilidad de integración, ya que no requiere software adicional ni drivers especiales.
- Si se requiere integración con otros tipos de lectores (serial, TCP/IP), se puede adaptar el flujo para recibir el dato por otros medios y enviarlo al backend.

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

## Flujo de Asignación y Validación de RFID

### 1. Asignación de RFID a un dispositivo (por un administrador/validador)

**Diagrama de flujo:**

```
[Admin/Validador] -> [Pantalla de Validación de Dispositivos]
    -> Selecciona dispositivo pendiente
    -> Da clic en "Validar/Asignar RFID"
    -> Pasa la tarjeta RFID por el lector
    -> El frontend envía el RFID y el ID del dispositivo al backend
    -> El backend:
        - Verifica que el RFID no esté asignado
        - Actualiza el dispositivo con el nuevo RFID y cambia el estado a "aprobado"
        - Registra el evento en el historial
    -> El frontend muestra confirmación y el dispositivo queda validado
```

**Internamente:**
- El endpoint `/api/dispositivos/:id` (PUT) recibe el RFID y actualiza el dispositivo.
- Se valida que el RFID sea único.
- Se registra el evento en la tabla `historial_dispositivo`.
- El dispositivo pasa a estado "aprobado" y queda listo para ser usado por el usuario.

### 2. Control de acceso con RFID

- El usuario pasa la tarjeta RFID por el lector.
- El frontend envía el RFID al backend (`/api/dispositivos/acceso-rfid`).
- El backend busca el dispositivo y el usuario asociado, valida el acceso y registra la entrada/salida en el historial.
- El frontend muestra el carnet digital con los datos y foto del usuario/dispositivo.

---

## Roles y Permisos

- **Administrador:** Acceso total, gestión de usuarios, dispositivos, reportes y validaciones.
- **Validador:** Puede validar y asignar RFID a dispositivos, ver reportes y gestionar accesos.
- **Aprendiz/Instructor:** Solo pueden ver y gestionar sus propios dispositivos y perfil.

---

## Ejemplo de Uso Real

**Registrar y validar un dispositivo:**
1. El usuario registra un nuevo dispositivo desde su perfil.
2. El admin/validador ve el dispositivo como "pendiente" en la pantalla de validación.
3. El admin/validador selecciona el dispositivo, da clic en "Validar/Asignar RFID" y pasa la tarjeta RFID.
4. El sistema actualiza el dispositivo, lo aprueba y lo asocia al usuario.
5. El usuario puede ver su dispositivo validado y usarlo para acceder.

---

## Descarga de Reportes en Excel

El sistema permite a los administradores y validadores descargar los reportes de **Usuarios**, **Historial** y **Dispositivos** en formato Excel (.xlsx) directamente desde el panel de reportes del frontend.

### ¿Cómo funciona?
- En la página de reportes, cada pestaña (Usuarios, Historial, Dispositivos) tiene un botón **Exportar a Excel**.
- Al hacer clic, el sistema descarga automáticamente un archivo Excel con los datos actuales de la pestaña seleccionada.

### Proceso de implementación
1. **Frontend (React):**
   - El botón "Exportar a Excel" ejecuta la función `handleExport`, que:
     - Llama a la API correspondiente (`/api/usuarios`, `/api/historiales`, `/api/dispositivos`) con un límite alto para traer todos los datos.
     - Filtra y transforma los datos para dejar solo los campos relevantes.
     - Usa la librería [xlsx](https://www.npmjs.com/package/xlsx) para generar el archivo Excel en el navegador.
     - Descarga automáticamente el archivo con el nombre adecuado (por ejemplo, `usuarios.xlsx`).
2. **Backend (Node/Express):**
   - Los endpoints de la API soportan paginación y permiten traer todos los registros si se solicita un límite alto.
   - No es necesario ningún cambio especial en el backend para la exportación, ya que el frontend se encarga de transformar y descargar el archivo.
3. **Librería utilizada:**
   - Se utiliza la librería `xlsx` en el frontend para convertir los datos JSON a formato Excel y disparar la descarga.

### Ejemplo de uso
1. Ve al panel de **Reportes**.
2. Selecciona la pestaña que deseas exportar (Usuarios, Historial, Dispositivos).
3. Haz clic en el botón **Exportar a Excel**.
4. El archivo se descargará automáticamente con los datos actuales de la pestaña seleccionada.

### Fragmento de código relevante (frontend)

```jsx
import * as XLSX from 'xlsx';

const handleExport = async () => {
  // ...fetch de datos según la pestaña activa...
  const ws = XLSX.utils.json_to_sheet(filteredData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, activeTab);
  XLSX.writeFile(wb, filename);
};
```

### Consideraciones
- El proceso es 100% en el navegador, no requiere instalar nada adicional en el backend.
- El archivo Excel incluye solo los campos relevantes y está listo para ser usado o compartido.
- Si hay muchos registros, la exportación puede tardar unos segundos.

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

## Mejoras de Seguridad y Experiencia en Formularios

Durante la revisión y pruebas del sistema, identifiqué que algunos campos de los formularios (nombre, documento, correo, teléfonos, etc.) mostraban el historial/autocompletado del navegador, lo cual representa un riesgo de privacidad.
Para solucionarlo, deshabilité el autocompletado en todos los campos sensibles de los formularios de registro y edición de usuario, agregando el atributo `autoComplete="off"` en los inputs correspondientes.

Esto mejora la seguridad y la experiencia del usuario, evitando que el navegador sugiera datos previos en campos personales.

---

## FAQ

**¿Qué pasa si un RFID ya está asignado?**
- El sistema no permite asignar un RFID duplicado y muestra un error.

**¿Cómo se protege la información?**
- Todas las contraseñas están encriptadas, los tokens JWT se usan para autenticación y los datos sensibles nunca se exponen.

**¿Puedo usar el sistema en móvil?**
- Sí, la interfaz es completamente responsiva.

**¿Qué roles existen y qué puede hacer cada uno?**
- Ver sección de [Roles y Permisos](#roles-y-permisos).

---

## Contribuciones

Este proyecto es parte del desarrollo académico del SENA - Centro de Comercio y Turismo. Las contribuciones deben seguir el proceso establecido por la institución.

---

## Licencia

Este proyecto está licenciado bajo términos específicos del SENA. Consulte la documentación oficial para más detalles sobre derechos de uso y distribución.

---

© 2023 SENA - Centro de Comercio y Turismo. Todos los derechos reservados.

## Remoción de Secretos del Historial de Git (Caso Real)

### Problema Detectado
Durante el desarrollo, accidentalmente subí un archivo de credenciales sensibles (`active-tome-461303-c6-67856b9faa48.json`) al repositorio. GitHub detectó el secreto en el historial de commits y activó la protección de push, bloqueando cualquier intento de subir cambios hasta eliminar completamente el archivo de TODO el historial.

### Proceso de Solución
1. **Identificación:** GitHub mostró un error indicando la presencia de un secreto en un commit específico, impidiendo el push.
2. **Backup:** Realicé una copia de seguridad del repositorio por precaución.
3. **Eliminación del archivo:** Borré el archivo de la carpeta y realicé un commit para reflejar el cambio.
4. **Limpieza del historial:** Utilicé la herramienta [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) con el comando:
   ```bash
   java -jar bfg-1.14.0.jar --delete-files active-tome-461303-c6-67856b9faa48.json
   ```
5. **Limpieza de objetos huérfanos:**
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```
6. **Verificación:** Me aseguré de que el archivo ya no existía en el historial con:
   ```bash
   git log --all -- active-tome-461303-c6-67856b9faa48.json
   ```
7. **Push forzado:** Subí los cambios limpiados con:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

### Aprendizaje y Recomendaciones
- **Nunca subir archivos de credenciales o secretos al repositorio.**
- **Agregar archivos sensibles a `.gitignore` antes de hacer commit.**
- Si ocurre un error similar, limpiar el historial con BFG o `git filter-repo` y forzar el push.
- Avisar a los colaboradores para que vuelvan a clonar el repo después de una limpieza de historial.

Este proceso garantiza la seguridad del proyecto y el cumplimiento de las políticas de GitHub.

## Gestión de imágenes múltiples por dispositivo

Cada dispositivo puede tener hasta 3 fotos (frontal, trasera y cerrado).
Las imágenes se suben desde el frontend, se almacenan en el backend en la carpeta `/uploads` y se visualizan tanto en el panel de usuario como en el panel de administración.

- Al registrar o editar un dispositivo, el usuario puede subir hasta 3 imágenes.
- El backend guarda los archivos y almacena en la base de datos un array JSON con los nombres de archivo en el campo `foto`.
- El backend expone la carpeta `/uploads` para que el frontend pueda mostrar las imágenes.
- En todas las vistas, el frontend recorre el array de nombres y muestra las imágenes con sus etiquetas correspondientes.
- Si no hay imágenes, se muestra un placeholder "Sin imagen".

Este flujo es robusto, retrocompatible y profesional. 