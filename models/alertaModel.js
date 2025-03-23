const pool = require('../config/db');

const alertaModel = {
    getAllAlertas: async () => {
        try {
            const query = 'SELECT * FROM alertas';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener las alertas:', error);
            throw error;
        }
    },
    getAlertaById: async (id) => {
        try {
            const query = 'SELECT * FROM alertas WHERE idalertas = $1'; // Corregido: usar "idalertas" en lugar de "id"
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Alerta no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener la alerta:', error);
            throw error;
        }
    },
    createAlerta: async (alerta) => {
        try {
            const { tipo_alerta } = alerta;
            const fecha = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
            const hora = new Date().toTimeString().split(' ')[0]; // Hora actual en formato HH:MM:SS
            const query = `
                INSERT INTO alertas (fecha, hora, tipo_alerta)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const result = await pool.query(query, [fecha, hora, tipo_alerta]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear la alerta:', error);
            throw error;
        }
    },
    updateAlerta: async (id, alerta) => {
        try {
            const { fecha, hora, tipo_alerta } = alerta;
            const query = `
                UPDATE alertas
                SET fecha = $1, hora = $2, tipo_alerta = $3
                WHERE idalertas = $4
                RETURNING *`;
            const result = await pool.query(query, [fecha, hora, tipo_alerta, id]);
            if (result.rows.length === 0) {
                throw new Error('Alerta no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar la alerta:', error);
            throw error;
        }
    },
    deleteAlerta: async (id) => {
        try {
            const query = 'DELETE FROM alertas WHERE idalertas = $1 RETURNING *'; // Corregido: usar "idalertas" en lugar de "id"
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Alerta no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar la alerta:', error);
            throw error;
        }
    },
};

module.exports = alertaModel;