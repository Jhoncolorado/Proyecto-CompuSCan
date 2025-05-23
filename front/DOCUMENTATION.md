# Documentación del Frontend - CompuSCan

## Índice
1. [Arquitectura](#arquitectura)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Gestión de Estado](#gestión-de-estado)
6. [Rutas y Navegación](#rutas-y-navegación)
7. [Estilos y Diseño](#estilos-y-diseño)
8. [Integración con Backend](#integración-con-backend)
9. [Seguridad](#seguridad)
10. [Optimización y Rendimiento](#optimización-y-rendimiento)
11. [Guía de Mantenimiento](#guía-de-mantenimiento)

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
│   │   └── ui/         # Componentes de interfaz (botones, tablas, etc.)
│   ├── context/        # Contextos de React (AuthContext)
│   ├── pages/          # Componentes de página completa
│   │   ├── home/       # Página de inicio
│   │   ├── devices/    # Gestión de dispositivos
│   │   ├── users/      # Gestión de usuarios
│   │   ├── profile/    # Perfil de usuario
│   │   └── ...
│   ├── styles/         # Estilos globales y variables CSS
│   ├── utils/          # Utilidades y helpers
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
    <Route path="alerts" element={<Alerts />} />
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