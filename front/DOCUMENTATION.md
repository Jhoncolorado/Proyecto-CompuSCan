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