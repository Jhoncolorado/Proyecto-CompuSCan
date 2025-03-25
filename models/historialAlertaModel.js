const pool = require('../config/db');

const historialAlertaModel = {
    createHistorialAlerta: async ({ id_alerta, id_dispositivo }) => {
        const query = `
            INSERT INTO historial_alertas 
            (id_alerta, id_dispositivo)
            VALUES ($1, $2)
            RETURNING *`;
        const result = await pool.query(query, [id_alerta, id_dispositivo]);
        return result.rows[0];
    },

    getAlertasByDispositivo: async (id_dispositivo) => {
        const query = `
            SELECT ha.*, a.descripcion as alerta_descripcion
            FROM historial_alertas ha
            JOIN alerta a ON ha.id_alerta = a.id
            WHERE ha.id_dispositivo = $1`;
        const result = await pool.query(query, [id_dispositivo]);
        return result.rows;
    }
};

module.exports = historialAlertaModel;