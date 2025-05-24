import axios from 'axios';

// Siempre usamos la URL completa para evitar problemas con el proxy
// En producción debe apuntar a tu API desplegada
const API_URL = 'https://compuscan-backend.vercel.app/api';

// Configurar axios para incluir credentials en todas las peticiones
axios.defaults.withCredentials = true;

// Función para probar la conexión CORS
export const testCORS = async () => {
  try {
    const response = await axios.get(`${API_URL}/test-cors`);
    console.log('Test CORS exitoso:', response.data);
    return true;
  } catch (error) {
    console.error('Error en test CORS:', error);
    return false;
  }
};

// Interceptor para agregar el token a todas las peticiones
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  response => response,
  error => {
    // Si recibimos un 401 (no autorizado), limpiar el token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    // Ajustar los nombres de los campos para que coincidan con el backend
    const loginData = {
      correo: credentials.email,
      contrasena: credentials.password
    };

    console.log('Intentando iniciar sesión con:', loginData);

    // Ya no probamos CORS primero, vamos directamente al login
    const response = await axios.post(`${API_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Respuesta del servidor:', response.data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('No se recibió el token de autenticación');
    }
  } catch (error) {
    console.error('Error completo:', error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data, error.response.status);
      throw new Error(error.response.data.error || 'Error al iniciar sesión');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de solicitud sin respuesta:', error.request);
      throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté en ejecución.');
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error en la configuración:', error.message);
      throw new Error('Error al procesar la solicitud');
    }
  }
};

export const logout = () => {
  // Simplemente eliminar el token del localStorage
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) return null;

    console.log('Obteniendo datos actualizados del usuario desde API');

    try {
      // Decodificar el token JWT para obtener la información básica del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Obtener información completa del usuario usando el ID del token
      const userId = payload.id;
      const response = await axios.get(`${API_URL}/usuarios/${userId}`);
      
      console.log('Datos del usuario obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al decodificar token o obtener usuario:', error);
      
      // Verificar si el token no es válido o está expirado
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Token inválido o expirado, cerrando sesión');
        localStorage.removeItem('token');
        return null;
      }
      
      // Si hay otro tipo de error, intentar obtener información básica del token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Usando información básica del token como fallback');
        return {
          id: payload.id,
          rol: payload.rol,
          // Añadir más campos según los datos que contenga el token
        };
      } catch (tokenError) {
        console.error('Error al procesar token como fallback:', tokenError);
        localStorage.removeItem('token');
        return null;
      }
    }
  } catch (error) {
    console.error('Error general en getCurrentUser:', error);
    // Si hay error en obtener el usuario, consideramos que no está autenticado
    localStorage.removeItem('token');
    return null;
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/usuarios/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al actualizar el perfil');
  }
};

// Cambiar contraseña
export const changePassword = async (userId, passwordData) => {
  try {
    // Ajustar según la API del backend
    const response = await axios.put(`${API_URL}/usuarios/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al cambiar la contraseña');
  }
}; 