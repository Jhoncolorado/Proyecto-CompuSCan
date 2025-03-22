const pool = require('../config/db');

const historialDispositivoModel = {
    getAllHistorialDispositivos: async () => {
        try {
            const query = 'SELECT * FROM historial_dispositivos';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener el historial de dispositivos:', error);
            throw error;
        }
    },
    getHistorialDispositivoById: async (id) => {
        try {
            const query = 'SELECT * FROM historial_dispositivos WHERE id = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Historial de dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener el historial de dispositivos:', error);
            throw error;
        }
    },
    createHistorialDispositivo: async (historial) => {
        try {
            const { fecha, hora, descripcion, dispositivo_id } = historial;
            const query = `
                INSERT INTO historial_dispositivos (fecha, hora, descripcion, dispositivo_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *`;
            const result = await pool.query(query, [fecha, hora, descripcion, dispositivo_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el historial de dispositivos:', error);
            throw error;
        }
    },
    updateHistorialDispositivo: async (id, historial) => {
        try {
            const { fecha, hora, descripcion, dispositivo_id } = historial;
            const query = `
                UPDATE historial_dispositivos
                SET fecha = $1, hora = $2, descripcion = $3, dispositivo_id = $4
                WHERE id = $5
                RETURNING *`;
            const result = await pool.query(query, [fecha, hora, descripcion, dispositivo_id, id]);
            if (result.rows.length === 0) {
                throw new Error('Historial de dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el historial de dispositivos:', error);
            throw error;
        }
    },
    deleteHistorialDispositivo: async (id) => {
        try {
            const query = 'DELETE FROM historial_dispositivos WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Historial de dispositivo no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar el historial de dispositivos:', error);
            throw error;
        }
    },
};

module.exports = historialDispositivoModel;