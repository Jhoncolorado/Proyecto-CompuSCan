# Documentación del Frontend - CompuSCan

## Índice
1. [Arquitectura](#arquitectura)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Gestión de Estado](#gestión-de-estado)
6. [Rutas y Navegación](#rutas-y-navegación)
7. [Estilos y Diseño](#estilos-y-diseño)
8. [Validación de Formularios](#validación-de-formularios)
9. [Integración con Backend](#integración-con-backend)
10. [Seguridad](#seguridad)
11. [Optimización y Rendimiento](#optimización-y-rendimiento)
12. [Guía de Mantenimiento](#guía-de-mantenimiento)
13. [Integración de WebSockets con Socket.IO en el Frontend](#integración-de-websockets-con-socketio-en-el-frontend)

---

## Arquitectura

El frontend de CompuSCan está construido con React, utilizando un enfoque modular y basado en componentes. La arquitectura sigue un patrón de diseño que separa claramente:

- **Presentación**: Componentes visuales y de UI
- **Lógica de negocio**: Manejo de datos y operaciones
- **Gestión de estado**: Contexto de autenticación y estados locales
- **Enrutamiento**: Navegación entre diferentes vistas

### Tecnologías principales:

- **React**: Biblioteca principal para la construcción de interfaces
- **React Router**: Manejo de rutas y navegación
- **Context API**: Gestión de estado global (autenticación)
- **Axios**: Cliente HTTP para comunicación con el backend
- **CSS Modules**: Estilos encapsulados por componente

---

## Estructura de Directorios

```
front/
├── public/             # Archivos estáticos públicos
├── src/                # Código fuente principal
│   ├── components/     # Componentes reutilizables
│   │   ├── layout/     # Componentes de estructura (Header, Sidebar)
│   │   ├── ui/         # Componentes de interfaz (botones, tablas, etc.)
│   │   ├── FormError.jsx # Componente para mostrar errores en formularios
│   │   └── PasswordStrength.jsx # Componente para indicador de fortaleza de contraseña
│   ├── context/        # Contextos de React (AuthContext)
│   ├── pages/          # Componentes de página completa
│   │   ├── home/       # Página de inicio
│   │   ├── devices/    # Gestión de dispositivos
│   │   ├── users/      # Gestión de usuarios
│   │   ├── profile/    # Perfil de usuario
│   │   └── ...
│   ├── styles/         # Estilos globales y variables CSS
│   ├── utils/          # Utilidades y helpers
│   │   └── validators.js # Funciones de validación para formularios
│   ├── App.jsx         # Componente principal y rutas
│   ├── main.jsx        # Punto de entrada
│   └── ...
└── package.json        # Dependencias y scripts
```

---

## Componentes Principales

### Layout

El sistema utiliza un layout consistente en todas las páginas que incluye:

- **Header**: Barra superior con logo, navegación principal y menú de usuario
- **Sidebar**: Menú lateral con navegación contextual según el rol del usuario
- **Main Content**: Área principal de contenido que cambia según la ruta

### Páginas Principales

#### Home / Dashboard

- **Para administradores**: Muestra estadísticas generales, gráficos de uso y accesos recientes
- **Para usuarios**: Muestra información personal, dispositivos registrados y actividad reciente

#### Perfil de Usuario

Permite a los usuarios:
- Ver y editar información personal
- Cambiar su foto de perfil
- Ver su historial de accesos (eliminado para evitar redundancia)

#### Gestión de Dispositivos

- Tabla de dispositivos con filtros y búsqueda
- Formularios para crear y editar dispositivos
- Validación de dispositivos mediante RFID
- Visualización de detalles de dispositivos

#### Gestión de Usuarios (Solo administradores)

- Tabla de usuarios con filtros y búsqueda
- Formularios para crear y editar usuarios
- Asignación de roles y permisos

### Componentes de UI Reutilizables

#### FormError

Componente para mostrar mensajes de error en formularios de manera consistente:

```jsx
// FormError.jsx
import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const FormError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="form-error">
      <FaExclamationCircle className="form-error-icon" />
      <span className="form-error-message">{message}</span>
    </div>
  );
};

export default FormError;
```

Ejemplo de uso:
```jsx
<div className="form-group">
  <label htmlFor="email">Correo electrónico</label>
  <input 
    type="email" 
    id="email"
    value={email}
    onChange={handleEmailChange}
    className={emailError ? 'input-error' : ''}
  />
  <FormError message={emailError} />
</div>
```

#### PasswordStrength

Componente que visualiza la fortaleza de una contraseña mientras el usuario la escribe:

```jsx
// PasswordStrength.jsx
import React from 'react';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    // Lógica para calcular la fortaleza
    let strength = 0;
    
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return strength;
  };
  
  const strength = calculateStrength(password);
  
  const getLabel = () => {
    if (strength === 0) return 'Muy débil';
    if (strength === 1) return 'Débil';
    if (strength === 2) return 'Moderada';
    if (strength === 3) return 'Buena';
    if (strength === 4) return 'Fuerte';
    return 'Muy fuerte';
  };
  
  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index}
            className={`strength-bar ${index < strength ? `level-${strength}` : ''}`}
          />
        ))}
      </div>
      <span className={`strength-label level-${strength}`}>
        {getLabel()}
      </span>
    </div>
  );
};

export default PasswordStrength;
```

---

## Flujo de Datos

El flujo de datos en la aplicación sigue un patrón unidireccional:

1. **Obtención de datos**: 
   - Al cargar un componente, se solicitan datos al backend mediante Axios
   - Los datos se almacenan en el estado del componente o en contextos globales

2. **Renderizado**: 
   - Los componentes se renderizan utilizando los datos del estado
   - Se aplican transformaciones y filtros según sea necesario

3. **Interacción del usuario**:
   - Las acciones del usuario (clicks, formularios) desencadenan eventos
   - Los manejadores de eventos actualizan el estado o realizan llamadas al backend

4. **Actualización**:
   - El estado actualizado provoca un nuevo renderizado de los componentes afectados

### Ejemplo de flujo en la página de perfil:

```jsx
// Flujo simplificado del componente Profile
useEffect(() => {
  // 1. Obtención de datos
  const fetchUser = async () => {
    const response = await axios.get(`/api/usuarios/${user.id}`);
    setFormData(response.data);
  };
  fetchUser();
}, [user]);

// 2. Renderizado con los datos
return (
  <div className="profile-container">
    <h2>Mi Perfil</h2>
    <form onSubmit={handleSave}>
      {/* Campos del formulario utilizando formData */}
    </form>
  </div>
);

// 3. Interacción del usuario
const handleSave = async (e) => {
  e.preventDefault();
  // 4. Actualización (backend y estado local)
  await axios.put(`/api/usuarios/${user.id}`, formData);
  setMessage('Datos actualizados correctamente');
};
```

---

## Gestión de Estado

La aplicación utiliza diferentes estrategias para la gestión del estado:

### Estado Global

- **AuthContext**: Gestiona la autenticación y la información del usuario actual
  - Provee métodos para login, logout y actualización del usuario
  - Almacena el token JWT y la información básica del usuario

### Estado Local

- **useState**: Para gestionar el estado específico de cada componente
- **useReducer**: Para estados más complejos con múltiples sub-valores

### Estado de Formularios

- Formularios controlados con validación en tiempo real
- Manejo de errores y mensajes de feedback

---

## Rutas y Navegación

La navegación se implementa usando React Router v6 con las siguientes rutas principales:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/acceso" element={<AccessControl />} />
  <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
    <Route index element={<IndexRedirect />} />
    <Route path="dashboard" element={<Home />} />
    <Route path="devices" element={<Devices />} />
    <Route path="users" element={<PrivateRoute requiredRole="administrador"><Users /></PrivateRoute>} />
    <Route path="reports" element={<Reports />} />
    <Route path="history" element={<History />} />
    <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="device-validation" element={<DeviceValidation />} />
    <Route path="home-user" element={<HomeUser />} />
    <Route path="my-devices" element={<UserDevicesPage />} />
  </Route>
</Routes>
```

### Rutas Protegidas

Se implementa un componente `PrivateRoute` que verifica:
- Si el usuario está autenticado
- Si el usuario tiene el rol requerido para acceder a la ruta

```jsx
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

---

## Estilos y Diseño

El diseño de la interfaz sigue los principios de Material Design con una paleta de colores institucional:

### Sistema de Diseño

- **Colores primarios**: Verde institucional SENA (#2e7d32, #43a047, #4caf50)
- **Colores secundarios**: Azul para instructores, Naranja para aprendices
- **Tipografía**: Sistema de fuentes sans-serif moderno y legible

### Implementación de Estilos

- **CSS Modules**: Estilos encapsulados por componente para evitar colisiones
- **Variables CSS**: Definición centralizada de colores, espaciados y tipografía
- **Estilos en línea**: Para casos específicos donde se requiere estilizado dinámico

### Componentes UI

- Tarjetas con sombras suaves para contenido principal
- Botones con estados hover y active claramente definidos
- Tablas responsivas con opciones de ordenamiento y filtrado
- Formularios con validación visual y feedback inmediato

### Diseño Responsivo

La aplicación está completamente optimizada para diferentes tamaños de pantalla:

- **Mobile First**: Diseño base optimizado para dispositivos móviles
- **Media Queries**: Ajustes específicos para tablets y escritorio
- **Layouts Flexibles**: Uso de Flexbox y Grid para estructuras adaptables
- **Componentes Adaptables**: Elementos de UI que se ajustan al espacio disponible

Ejemplos de implementación responsiva:

```css
/* Ejemplo de CSS responsivo para tablas */
.table-container {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 600px; /* Asegura que la tabla tenga un ancho mínimo */
}

@media (max-width: 768px) {
  .table th, .table td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1201px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Validación de Formularios

La aplicación implementa un sistema robusto de validación de formularios para garantizar la integridad de los datos:

### Utilidad de Validadores

El archivo `utils/validators.js` contiene funciones reutilizables para validar diferentes tipos de datos:

```javascript
// Ejemplo de validators.js
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El correo electrónico es obligatorio';
  if (!regex.test(email)) return 'El formato del correo electrónico no es válido';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  return '';
};

export const validateDocument = (document) => {
  if (!document) return 'El documento es obligatorio';
  if (!/^\d{7,12}$/.test(document)) return 'El documento debe tener entre 7 y 12 dígitos';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'El nombre es obligatorio';
  if (name.length < 3) return 'El nombre debe tener al menos 3 caracteres';
  return '';
};
```

### Implementación en Formularios

La validación se implementa en tiempo real mientras el usuario escribe:

```jsx
// Ejemplo de uso en un formulario de registro
const [formData, setFormData] = useState({
  nombre: '',
  correo: '',
  contrasena: '',
  documento: ''
});

const [errors, setErrors] = useState({
  nombre: '',
  correo: '',
  contrasena: '',
  documento: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  
  // Validación en tiempo real
  switch (name) {
    case 'nombre':
      setErrors({ ...errors, nombre: validateName(value) });
      break;
    case 'correo':
      setErrors({ ...errors, correo: validateEmail(value) });
      break;
    case 'contrasena':
      setErrors({ ...errors, contrasena: validatePassword(value) });
      break;
    case 'documento':
      setErrors({ ...errors, documento: validateDocument(value) });
      break;
    default:
      break;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validación completa antes de enviar
  const nombreError = validateName(formData.nombre);
  const correoError = validateEmail(formData.correo);
  const contrasenaError = validatePassword(formData.contrasena);
  const documentoError = validateDocument(formData.documento);
  
  setErrors({
    nombre: nombreError,
    correo: correoError,
    contrasena: contrasenaError,
    documento: documentoError
  });
  
  // Solo enviar si no hay errores
  if (!nombreError && !correoError && !contrasenaError && !documentoError) {
    // Enviar datos al servidor
  }
};
```

### Componentes de Validación Visual

Los componentes `FormError` y `PasswordStrength` proporcionan feedback visual al usuario:

```jsx
// Ejemplo de formulario con validación visual
<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="nombre">Nombre completo</label>
    <input
      type="text"
      id="nombre"
      name="nombre"
      value={formData.nombre}
      onChange={handleChange}
      className={errors.nombre ? 'input-error' : ''}
    />
    <FormError message={errors.nombre} />
  </div>
  
  <div className="form-group">
    <label htmlFor="contrasena">Contraseña</label>
    <input
      type="password"
      id="contrasena"
      name="contrasena"
      value={formData.contrasena}
      onChange={handleChange}
      className={errors.contrasena ? 'input-error' : ''}
    />
    <PasswordStrength password={formData.contrasena} />
    <FormError message={errors.contrasena} />
  </div>
  
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Enviando...' : 'Registrarse'}
  </button>
</form>
```

---

## Integración con Backend

La comunicación con el backend se realiza principalmente a través de Axios:

### Configuración Base

```jsx
import axios from 'axios';

// Configuración base de Axios
axios.defaults.baseURL = 'http://localhost:3000/api';

// Interceptor para añadir token de autenticación
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirigir a login si hay error de autenticación
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Patrón de Llamadas API

```jsx
// Ejemplo de servicio para dispositivos
const dispositivosService = {
  getAll: async () => {
    const response = await axios.get('/dispositivos');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/dispositivos/${id}`);
    return response.data;
  },
  
  create: async (dispositivo) => {
    const response = await axios.post('/dispositivos', dispositivo);
    return response.data;
  },
  
  update: async (id, dispositivo) => {
    const response = await axios.put(`/dispositivos/${id}`, dispositivo);
    return response.data;
  },
  
  delete: async (id) => {
    await axios.delete(`/dispositivos/${id}`);
  }
};
```

---

## Seguridad

### Autenticación

- Implementación de JWT (JSON Web Tokens)
- Almacenamiento seguro de tokens en localStorage
- Renovación automática de tokens expirados

### Autorización

- Control de acceso basado en roles (RBAC)
- Verificación de permisos en componentes y rutas
- Ocultamiento de opciones no permitidas según el rol

### Protección de Datos

- Validación de entradas en formularios
- Sanitización de datos antes de enviarlos al backend
- Manejo seguro de información sensible

---

## Optimización y Rendimiento

### Estrategias Implementadas

- **Code Splitting**: Carga diferida de componentes grandes
- **Lazy Loading**: Carga de componentes solo cuando son necesarios
- **Memoización**: Uso de React.memo, useMemo y useCallback para evitar renderizados innecesarios
- **Optimización de imágenes**: Compresión y carga progresiva

### Buenas Prácticas

- Evitar renderizados innecesarios
- Minimizar el número de estados y efectos
- Optimizar listas largas con virtualización
- Implementar debounce en búsquedas y filtros

---

## Guía de Mantenimiento

### Añadir Nuevas Páginas

1. Crear un nuevo directorio en `src/pages/`
2. Implementar el componente principal y estilos
3. Añadir la ruta en `App.jsx`
4. Actualizar la navegación en `Sidebar.jsx` si es necesario

### Modificar Componentes Existentes

1. Identificar el componente a modificar
2. Realizar cambios manteniendo la estructura y convenciones
3. Verificar que no se rompan otras partes que usan el componente
4. Actualizar tests si existen

### Depuración

- Usar React Developer Tools para inspeccionar componentes y props
- Implementar logging estratégico para seguimiento de errores
- Verificar la consola del navegador para errores y advertencias

### Convenciones de Código

- Nombres de componentes en PascalCase
- Nombres de funciones y variables en camelCase
- Archivos de componentes con extensión `.jsx`
- Archivos de estilos con extensión `.css` o `.module.css` 

En la sección de reportes, el tab 'Usuarios' ya muestra datos reales de la API /api/usuarios. Los demás tabs están listos para integración de datos reales (historial, casos, dispositivos, actividad). 

---

## Pantalla de Validación/Asignación de RFID

### Flujo de usuario para validar un dispositivo con RFID

1. El admin/validador ingresa a la sección "Validación de Dispositivos".
2. Selecciona un dispositivo pendiente de validación.
3. Da clic en "Validar/Asignar RFID".
4. Pasa la tarjeta RFID por el lector.
5. El frontend captura el RFID y envía una petición PUT al backend (`/api/dispositivos/:id`).
6. El backend valida y responde con el estado actualizado.
7. El frontend muestra confirmación y actualiza la lista de dispositivos.

**Diagrama de flujo:**

```
[Admin/Validador] -> [Pantalla de Validación] -> [Selecciona dispositivo] -> [Da clic en Validar/Asignar RFID]
    -> [Pasa tarjeta RFID] -> [PUT /api/dispositivos/:id] -> [Backend responde] -> [Muestra confirmación]
```

### Ejemplo de integración frontend-backend para RFID

```js
// Fragmento de DeviceValidation.jsx
const handleAssignRfid = async () => {
  if (!rfid) return;
  setLoading(true);
  await axios.put(`/api/dispositivos/${selectedDevice.id}`, {
    rfid,
    estado_validacion: 'aprobado',
  });
  setLoading(false);
  // Actualiza la lista y muestra confirmación
};
```

---

## Buenas Prácticas de UI/UX
- Usar feedback visual claro para cada acción (mensajes de éxito/error).
- Deshabilitar botones mientras se procesa una acción.
- Validar campos antes de enviar formularios.
- Mantener la interfaz limpia y accesible.
- Adaptar el diseño a dispositivos móviles y escritorio.

---

## Troubleshooting (Solución de problemas)
- **No se asigna el RFID:** Verifica que el RFID no esté ya asignado a otro dispositivo.
- **No se actualiza la lista:** Asegúrate de recargar los datos tras una validación exitosa.
- **Errores de red:** Comprueba la conexión con el backend y revisa la consola para detalles.

---

## Eliminación de Autocompletado en Campos Sensibles

Para reforzar la privacidad y evitar errores de ingreso, deshabilité el autocompletado en los siguientes campos de los formularios del frontend:
- Nombre completo
- Correo electrónico
- Documento
- Teléfonos
- RH

Esto se implementó en los archivos `Login.jsx` y `Users.jsx` usando el atributo `autoComplete="off"`.
Así, el navegador ya no muestra ni almacena valores previos en estos campos. 

## Manejo y Limpieza de Secretos en el Historial de Git

Durante el desarrollo del frontend, accidentalmente subí un archivo de credenciales sensibles al repositorio. GitHub bloqueó el push por seguridad, exigiendo la eliminación del secreto de TODO el historial de commits.

**Solución aplicada:**
- Eliminé el archivo y realicé un commit.
- Utilicé BFG Repo-Cleaner para limpiar el historial:
  ```bash
  java -jar bfg-1.14.0.jar --delete-files nombre-del-archivo-secreto.json
  ```
- Limpié los objetos huérfanos y forcé el push.

**Lecciones aprendidas:**
- Siempre agregar archivos sensibles a `.gitignore`.
- Si ocurre un error similar, limpiar el historial y avisar a los colaboradores.
- Verificar que el historial esté limpio antes de subir cambios importantes. 

---

## Gestión de imágenes múltiples por dispositivo

### Descripción general
El frontend permite subir, editar y visualizar hasta **3 imágenes** (frontal, trasera y cerrado) por dispositivo, de forma intuitiva y consistente en todas las vistas.

### Flujo técnico
- **Carga de imágenes:**
  - En los formularios de registro y edición de dispositivos (`UserDevices.jsx`), el usuario puede seleccionar hasta 3 archivos (foto frontal, trasera y cerrado).
  - Se utiliza un objeto `FormData` para enviar los archivos al backend en el campo `foto` (pueden ser menos de 3 si el usuario no sube todas).
- **Visualización:**
  - En las tablas y tarjetas de dispositivos, se recorre el array de nombres de imagen recibido desde la API y se muestran las fotos con su etiqueta correspondiente.
  - Si no hay imagen, se muestra un placeholder "Sin imagen".
- **Edición:**
  - Al editar un dispositivo, se pueden subir nuevas imágenes (las anteriores se mantienen si no se reemplazan).
- **Compatibilidad:**
  - El sistema es retrocompatible: dispositivos antiguos con una sola foto se muestran correctamente.
- **Recomendaciones:**
  - Se recomienda subir imágenes en formato JPG o PNG, de hasta 5MB cada una.
  - El frontend no fuerza el tipo de archivo, pero valida que sean imágenes antes de enviarlas.

### Ejemplo de uso
- Registrar o editar un dispositivo:
  - Seleccionar hasta 3 imágenes en el formulario.
  - Guardar los cambios; las imágenes se mostrarán automáticamente en la tabla y en la vista de detalle. 

---

## Menú de Validación y Asignación de RFID (Diseño Responsive y Profesional)

El menú de validación de dispositivos pendientes para asignación de RFID fue rediseñado para ofrecer una experiencia profesional, moderna y totalmente adaptable a cualquier dispositivo.

### Características principales
- **Grid adaptable:**
  - 3 columnas en desktop, 2 en tablet, 1 en móvil.
  - Las tarjetas de dispositivos se distribuyen automáticamente según el ancho de pantalla.
- **Tarjetas compactas y limpias:**
  - Cada dispositivo pendiente se muestra en una tarjeta con fondo blanco, sombra, bordes suaves y espaciado generoso.
  - Imágenes (frontal, trasera, cerrado) y datos clave (nombre, tipo, serial, usuario) bien jerarquizados.
  - Botón de acción ancho y destacado.
- **Formulario de validación en contexto:**
  - Al seleccionar un dispositivo, el formulario de asignación de RFID aparece **en el lugar exacto de la tarjeta seleccionada** dentro del grid, sin centrar ni desplazar la pantalla.
  - El usuario no pierde el contexto ni el scroll, y puede validar varios dispositivos de forma fluida.
- **Scroll automático:**
  - Si hay muchos dispositivos, la lista tiene altura máxima y scroll vertical, evitando que la página se haga infinita.
- **Colores institucionales y visual profesional:**
  - Verde SENA para botones y acentos, fondo blanco, sombras suaves.

### Ventajas UX
- Experiencia moderna y clara, ideal para listas largas.
- El usuario siempre mantiene el contexto y puede volver fácilmente a la lista.
- 100% responsive y usable en cualquier dispositivo.

### Ubicación del código
- Componente: `front/src/components/DeviceValidation.jsx`
- Estilos: `front/src/styles/DeviceValidation.css`

---

## Actualización en tiempo real del dashboard admin

El panel de control del administrador ahora muestra la "Actividad Hoy" (ingresos y salidas) en tiempo real, sin necesidad de recargar la página. Esto se logra mediante la integración de **socket.io**:

- El backend emite un evento cada vez que se registra un nuevo acceso/salida.
- El frontend escucha el evento y actualiza automáticamente el contador y la actividad reciente.
- Si el socket no está disponible, el dashboard sigue funcionando con la carga inicial por HTTP.

**Ventaja UX:** El admin ve los cambios de actividad al instante, ideal para monitoreo en vivo. 

## Implementación de Términos y Condiciones

- **Ubicación:** Segundo paso del formulario de registro de usuario.
- **Componente:**  
  - Se muestra un checkbox obligatorio con el texto:  
    > Acepto los términos y condiciones de la política de protección de datos.
  - El enlace "términos y condiciones" abre un modal elegante con el PDF embebido (`/public/politica_confidencialidad_sena.pdf`).
  - El botón de registro solo se habilita si el usuario acepta los términos.
  - Debajo, aparece el texto:  
    > Recibirás confirmación del registro por correo electrónico.
    en gris claro y perfectamente alineado.
- **Accesibilidad y UX:**  
  - El usuario no puede registrarse sin aceptar los términos.
  - El modal permite leer el PDF sin salir del registro.
  - El diseño es compacto, alineado y profesional.
- **Personalización:**  
  - El PDF puede ser reemplazado por otro documento en la carpeta `public` si se actualizan los términos. 

## Errores Críticos y Funcionalidades de Experiencia de Usuario

### 1. Error 404 de Socket.IO y Actualización en Tiempo Real

- **Problema:** El frontend mostraba errores 404 al intentar conectarse a `/socket.io`, y el panel de actividad no se actualizaba automáticamente.
- **Causa:** El backend no tenía Socket.IO correctamente configurado en el mismo servidor HTTP.
- **Solución:**  
  - El backend fue corregido para compartir el mismo servidor HTTP entre Express y Socket.IO.
  - El frontend mantiene el cliente Socket.IO y escucha el evento `actividad_actualizada`.
  - Cuando el backend emite el evento, el panel de "Actividad Hoy" y la actividad reciente se actualizan automáticamente, sin recargar la página.
- **Ventaja UX:** El administrador ve los cambios de actividad al instante, ideal para monitoreo en vivo.

**Fragmento relevante en el frontend:**
```js
import { io as socketIOClient } from 'socket.io-client';

useEffect(() => {
  const socket = socketIOClient('http://localhost:3000');
  socket.on('actividad_actualizada', (newStats) => {
    setStats(prev => ({
      ...prev,
      actividad: newStats.actividad,
      actividadReciente: newStats.actividadReciente
    }));
  });
  return () => socket.disconnect();
}, []);
```

---

### 2. Implementación del Correo de Registro Exitoso (Frontend)

- El frontend muestra mensajes claros al usuario tras el registro.
- El usuario recibe un correo automático de bienvenida, con diseño profesional y botón para iniciar sesión.
- El frontend **no gestiona el envío**, solo muestra el resultado y guía al usuario.
- El diseño del correo es amigable, institucional y cumple con las mejores prácticas de UX. 

# Integración de WebSockets con Socket.IO en el Frontend

## ¿Cómo se conecta el frontend?
- Se utiliza la librería `socket.io-client` para conectarse al backend:
  ```js
  import { io as socketIOClient } from 'socket.io-client';
  ```
- La conexión se realiza usando el hostname dinámico para compatibilidad:
  ```js
  const socket = socketIOClient(`http://${window.location.hostname}:3000`);
  ```

## Escucha y actualización en tiempo real
- En el dashboard, se escucha el evento `actividad_actualizada`:
  ```js
  useEffect(() => {
    const socket = socketIOClient(`http://${window.location.hostname}:3000`);
    socket.on('actividad_actualizada', (newStats) => {
      setStats(prev => ({
        ...prev,
        actividad: newStats.actividad,
        actividadReciente: newStats.actividadReciente
      }));
    });
    return () => socket.disconnect();
  }, []);
  ```
- Cuando el backend emite el evento, el dashboard actualiza automáticamente la sección de "Actividad Hoy" y la actividad reciente, sin recargar la página.

## Beneficios UX
- El usuario ve los cambios al instante, lo que es ideal para monitoreo y control en tiempo real.
- La solución es robusta, compatible con cualquier navegador moderno y fácil de extender a otros módulos.

## Buenas prácticas
- Se usa un solo socket por componente.
- Se desconecta el socket al desmontar el componente para evitar fugas de memoria.
- El código es claro y fácil de mantener. 

## Modal de Acceso Profesional y Tarjetas Alineadas (Control de Acceso)

### Descripción general
Al pasar la tarjeta RFID en la pantalla de acceso, se muestra un **modal profesional** que presenta:
- Carnet del aprendiz con diseño idéntico al físico (logo, foto, datos, QR).
- Tarjeta del equipo con fotos (frontal grande, trasera y cerrado más anchas), tipo y estado, perfectamente alineados y con íconos.
- No se muestran datos sensibles como RFID ni serial.

### Cierre por teclado
- El modal solo se cierra al presionar **Enter** o **Escape**.
- Al cerrar, el input invisible se vuelve a enfocar automáticamente para el siguiente registro.

### Accesibilidad y experiencia
- 100% accesible por teclado.
- Diseño responsive y profesional.
- El fondo de la pantalla es un degradado verde institucional SENA.
- El título principal es blanco con sombra para máximo contraste.

### Fragmento de código relevante
```jsx
React.useEffect(() => {
  if (!data) return;
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleModalClose();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [data]);
```

### Ubicación del código
- Componente: `front/src/components/AccessControl.jsx`
- Estilos: Inline y clases CSS (`carnet-tarjeta`, `modal-access-card`, etc.)

### Seguridad y UX
- El flujo es ágil, seguro y profesional, ideal para puntos de control de acceso.
- El vigilante solo compara visualmente y presiona Enter para continuar. 

## Gestión de usuarios: Deshabilitar y habilitar (histórico institucional)

### ¿Cómo funciona?
- Cuando un administrador "elimina" un usuario, **no se borra de la base de datos**: solo se actualiza el campo `estado` a `"deshabilitado"`.
- El usuario deshabilitado **no puede iniciar sesión** ni usar la app, pero su información y relaciones (dispositivos, historial) se conservan.
- En el panel de usuarios, hay un **checkbox** para alternar entre ver usuarios activos y deshabilitados.
- Los usuarios deshabilitados aparecen con un badge gris y la opción de **habilitar** (reactivar) desde el mismo panel.
- Al habilitar, el usuario vuelve a estado `"activo"` y puede usar la app normalmente.

### ¿Por qué es importante?
- **Histórico y trazabilidad:** Mantiene el registro de todos los usuarios, incluso los que ya no están activos.
- **Evita pérdida de datos:** No se pierden relaciones con dispositivos ni historial.
- **Flexibilidad institucional:** Permite reactivar aprendices o instructores que regresan, sin crear duplicados.

### Mensajes y visualización
- Al deshabilitar: Modal de confirmación con mensaje "¿Está seguro de deshabilitar este usuario? El usuario no podrá iniciar sesión hasta que sea habilitado nuevamente."
- Al habilitar: Mensaje de éxito "Usuario habilitado correctamente".
- Badge de estado: "Deshabilitado" en gris, "Activo" en verde.

### Relación con dispositivos
- Los dispositivos asociados a un usuario deshabilitado **no se pierden** ni se reasignan.
- El nombre del usuario sigue apareciendo en la tabla de dispositivos.
- (Nota: Si se requiere, se puede mostrar visualmente que el usuario está deshabilitado en la tabla de dispositivos, agregando el campo `estado` en la consulta del backend).

### Buenas prácticas
- **Nunca borres usuarios físicamente si tienen relaciones importantes.**
- Usa siempre el campo `estado` para mantener el histórico y la integridad de los datos.
- Informa claramente al usuario/admin sobre el estado y las acciones disponibles. 

## Alternancia ENTRADA/SALIDA por RFID (Frontend)

El frontend refleja la lógica de alternancia ENTRADA/SALIDA implementada en el backend:

- Al pasar la tarjeta RFID de un dispositivo:
  - Si el dispositivo no tiene una ENTRADA abierta, se muestra como "ENTRADA registrada".
  - Si ya tenía una ENTRADA abierta, el siguiente pase se interpreta como "SALIDA registrada".
- El historial de movimientos siempre muestra pares de ENTRADA/SALIDA, evitando duplicidad de registros abiertos.
- Esto garantiza que el usuario siempre vea el estado real del dispositivo y evita confusiones en la interfaz.

**Nota:**  
La lógica de alternancia es gestionada completamente por el backend; el frontend solo consume el resultado y actualiza la UI en consecuencia. 

## QR dinámico y adaptable según entorno

El QR que se muestra en el carnet digital se genera automáticamente usando la IP, dominio y puerto desde donde se abrió la app:

```js
value={`http://${window.location.hostname}:${window.location.port}/usuario/${data.usuario.documento}`}
```

Esto garantiza que:
- Si abres la app en localhost, el QR apunta a localhost.
- Si abres la app con la IP local, el QR apunta a esa IP.
- Si abres la app en producción, el QR apunta al dominio real.

**Ventajas:**
- El QR siempre es funcional, sin importar el entorno.
- No es necesario modificar el código para cambiar de entorno.
- Permite pruebas profesionales desde cualquier dispositivo.

**Recomendación:**
- Cambia la variable `VITE_API_URL` en el `.env` del frontend según el entorno donde vayas a probar.
- El backend debe aceptar los orígenes correctos en CORS.

**Resultado:**
- El sistema es flexible, profesional y listo para desarrollo, pruebas y producción sin errores de acceso ni QR. 

---

## Implementación de Asistencia en el Frontend

La gestión de asistencia en el frontend de CompuSCan se implementó así:

- **Pantalla de asistencia:**
  - Se creó una página dedicada donde el usuario puede pasar su tarjeta RFID.
  - El frontend detecta automáticamente el código RFID usando un input invisible (el lector actúa como teclado).
  - Al detectar el código, se envía una petición al backend para registrar la asistencia.

- **Visualización de historial:**
  - Los usuarios pueden ver su historial de asistencias, filtrando por fecha, ficha o estado.
  - Los administradores pueden ver el historial de todos los usuarios y descargar reportes.

- **UX y validaciones:**
  - Se muestran mensajes claros de éxito o error al registrar la asistencia.
  - El frontend previene acciones duplicadas y permite justificar inasistencias.
  - Se actualiza el historial en tiempo real tras cada registro.

- **Seguridad:**
  - Solo usuarios autenticados pueden acceder a la funcionalidad de asistencia.
  - El token de autenticación se envía en cada petición.

--- 