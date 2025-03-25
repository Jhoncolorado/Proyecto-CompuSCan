const pool = require('../config/db');

const alertaModel = {
    getAllAlertas: async () => {
        try {
            const query = 'SELECT * FROM alerta';  // Cambiado de "alertas" a "alerta" (singular)
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener las alertas:', error);
            throw error;
        }
    },

    getAlertaById: async (id) => {
        try {
            const query = 'SELECT * FROM alerta WHERE id = $1';  // Cambiado a "id" (no "idalertas")
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

    createAlerta: async (alertaData) => {
        try {
            const { descripcion } = alertaData;
            const query = `
                INSERT INTO alerta (descripcion)  // Solo insertamos descripción (fecha es automática)
                VALUES ($1)
                RETURNING *`;
            const result = await pool.query(query, [descripcion]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear la alerta:', error);
            throw error;
        }
    },

    updateAlerta: async (id, alertaData) => {
        try {
            const { descripcion } = alertaData;
            const query = `
                UPDATE alerta
                SET descripcion = $1  // Solo actualizamos descripción
                WHERE id = $2
                RETURNING *`;
            const result = await pool.query(query, [descripcion, id]);
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
            const query = 'DELETE FROM alerta WHERE id = $1 RETURNING *';  // Cambiado a "id"
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