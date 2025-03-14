const pool = require('../config/db');

const alertasModel = {
    getAllAlertas: async () => {
        const query = 'SELECT * FROM alertas';
        const result = await pool.query(query);
        return result.rows;
    },
    getAlertaById: async (id) => {
        const query = 'SELECT * FROM alertas WHERE idalertas = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createAlerta: async (alerta) => {
        const { fecha, hora, tipo_alerta } = alerta;
        const query = `
            INSERT INTO alertas (fecha, hora, tipo_alerta)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, tipo_alerta]);
        return result.rows[0];
    },
    updateAlerta: async (id, alerta) => {
        const { fecha, hora, tipo_alerta } = alerta;
        const query = `
            UPDATE alertas
            SET fecha = $1, hora = $2, tipo_alerta = $3
            WHERE idalertas = $4
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, tipo_alerta, id]);
        return result.rows[0];
    },
    deleteAlerta: async (id) => {
        const query = 'DELETE FROM alertas WHERE idalertas = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = alertasModel;