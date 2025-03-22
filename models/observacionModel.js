const pool = require('../config/db');

const observacionModel = {
    getAllObservaciones: async () => {
        try {
            const query = 'SELECT * FROM observaciones';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener las observaciones:', error);
            throw error;
        }
    },
    getObservacionById: async (id) => {
        try {
            const query = 'SELECT * FROM observaciones WHERE id = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Observación no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener la observación:', error);
            throw error;
        }
    },
    createObservacion: async (observacion) => {
        try {
            const { usuario_id, comentario } = observacion;
            const query = `
                INSERT INTO observaciones (usuario_id, comentario)
                VALUES ($1, $2)
                RETURNING *`;
            const result = await pool.query(query, [usuario_id, comentario]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear la observación:', error);
            throw error;
        }
    },
    updateObservacion: async (id, observacion) => {
        try {
            const { usuario_id, comentario } = observacion;
            const query = `
                UPDATE observaciones
                SET usuario_id = $1, comentario = $2
                WHERE id = $3
                RETURNING *`;
            const result = await pool.query(query, [usuario_id, comentario, id]);
            if (result.rows.length === 0) {
                throw new Error('Observación no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar la observación:', error);
            throw error;
        }
    },
    deleteObservacion: async (id) => {
        try {
            const query = 'DELETE FROM observaciones WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Observación no encontrada');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar la observación:', error);
            throw error;
        }
    },
};

module.exports = observacionModel;