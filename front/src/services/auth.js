import api from './api';

// Configurar axios para NO incluir credentials en todas las peticiones
// Esto es necesario cuando trabajamos con CORS entre diferentes dominios

// Función para probar la conexión CORS
export const testCORS = async () => {
  try {
    const response = await api.get('/api/test-cors');
    console.log('Test CORS exitoso:', response.data);
    return true;
  } catch (error) {
    console.error('Error en test CORS:', error);
    return false;
  }
};

export const login = async (credentials) => {
  try {
    const loginData = {
      correo: credentials.email,
      contrasena: credentials.password
    };
    console.log('Intentando iniciar sesión con:', loginData);
    const response = await api.post('/api/auth/login', loginData);
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
      console.error('Error de respuesta:', error.response.data, error.response.status);
      throw new Error(error.response.data.error || 'Error al iniciar sesión');
    } else if (error.request) {
      console.error('Error de solicitud sin respuesta:', error.request);
      throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté en ejecución.');
    } else {
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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const response = await api.get(`/api/usuarios/${userId}`);
      console.log('Datos del usuario obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al decodificar token o obtener usuario:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Token inválido o expirado, cerrando sesión');
        localStorage.removeItem('token');
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Usando información básica del token como fallback');
        return {
          id: payload.id,
          rol: payload.rol,
        };
      } catch (tokenError) {
        console.error('Error al procesar token como fallback:', tokenError);
        localStorage.removeItem('token');
        return null;
      }
    }
  } catch (error) {
    console.error('Error general en getCurrentUser:', error);
    localStorage.removeItem('token');
    return null;
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/api/usuarios/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al actualizar el perfil');
  }
};

// Cambiar contraseña
export const changePassword = async (userId, passwordData) => {
  try {
    const response = await api.put(`/api/usuarios/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al cambiar la contraseña');
  }
}; 