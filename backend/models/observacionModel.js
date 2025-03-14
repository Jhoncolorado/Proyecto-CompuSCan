const pool = require('../config/db');

const observacionModel = {
    getAllObservaciones: async () => {
        const query = 'SELECT * FROM observacion';
        const result = await pool.query(query);
        return result.rows;
    },
    getObservacionById: async (id) => {
        const query = 'SELECT * FROM observacion WHERE idobservacion = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createObservacion: async (observacion) => {
        const { usuario_id, comentario } = observacion;
        const query = `
            INSERT INTO observacion (usuario_id, comentario)
            VALUES ($1, $2)
            RETURNING *`;
        const result = await pool.query(query, [usuario_id, comentario]);
        return result.rows[0];
    },
    updateObservacion: async (id, observacion) => {
        const { usuario_id, comentario } = observacion;
        const query = `
            UPDATE observacion
            SET usuario_id = $1, comentario = $2
            WHERE idobservacion = $3
            RETURNING *`;
        const result = await pool.query(query, [usuario_id, comentario, id]);
        return result.rows[0];
    },
    deleteObservacion: async (id) => {
        const query = 'DELETE FROM observacion WHERE idobservacion = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = observacionModel;