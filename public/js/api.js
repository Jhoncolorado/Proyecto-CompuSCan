// Configuración de la API
const API_URL = '/api';

// Funciones de API
window.api = {
    // Usuarios
    async registrarUsuario(userData) {
        try {
            console.log('Iniciando registro de usuario...');
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error desconocido en el registro');
            }
            
            return data;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    },

    // Dispositivos
    async registrarDispositivo(dispositivoData) {
        try {
            console.log('Iniciando registro de dispositivo...');
            
            // Verificar que las fotos existen y son un array
            if (!dispositivoData.fotos || !Array.isArray(dispositivoData.fotos)) {
                throw new Error('Las fotos son requeridas y deben ser un array');
            }

            // Enviar los datos tal como están, sin modificar las fotos
            const response = await fetch(`${API_URL}/dispositivos`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dispositivoData)
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (!response.ok) {
                throw new Error(data.error || data.message || data.errores?.[0] || 'Error al registrar dispositivo');
            }
            return data;
        } catch (error) {
            console.error('Error al registrar dispositivo:', error);
            throw error;
        }
    },

    // Historial de Dispositivos
    async registrarHistorial(historialData) {
        try {
            const response = await fetch(`${API_URL}/historiales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historialData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al registrar historial:', error);
            throw error;
        }
    },

    // Casos
    async registrarCaso(casoData) {
        try {
            const response = await fetch(`${API_URL}/casos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(casoData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al registrar caso:', error);
            throw error;
        }
    },

    // Alertas
    async registrarAlerta(alertaData) {
        try {
            const response = await fetch(`${API_URL}/alertas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alertaData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al registrar alerta:', error);
            throw error;
        }
    }
}; 