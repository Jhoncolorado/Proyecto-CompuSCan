// Configuración de la API
const API_URL = '/api';

// Funciones de API
window.api = {
    // Usuarios
    async registrarUsuario(userData) {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error desconocido');
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
            const response = await fetch(`${API_URL}/dispositivos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dispositivoData)
            });
            return await response.json();
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