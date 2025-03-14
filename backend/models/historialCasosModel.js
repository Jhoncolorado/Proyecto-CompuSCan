const pool = require('../config/db');

const historialCasosModel = {
    getAllHistorialCasos: async () => {
        const query = 'SELECT * FROM historial_casos';
        const result = await pool.query(query);
        return result.rows;
    },
    getHistorialCasoById: async (id) => {
        const query = 'SELECT * FROM historial_casos WHERE idhistorial_casos = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createHistorialCaso: async (historial) => {
        const { fecha, hora, tipo_reporte, historial_dispositivos_id } = historial;
        const query = `
            INSERT INTO historial_casos (fecha, hora, tipo_reporte, historial_dispositivos_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, tipo_reporte, historial_dispositivos_id]);
        return result.rows[0];
    },
    updateHistorialCaso: async (id, historial) => {
        const { fecha, hora, tipo_reporte, historial_dispositivos_id } = historial;
        const query = `
            UPDATE historial_casos
            SET fecha = $1, hora = $2, tipo_reporte = $3, historial_dispositivos_id = $4
            WHERE idhistorial_casos = $5
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, tipo_reporte, historial_dispositivos_id, id]);
        return result.rows[0];
    },
    deleteHistorialCaso: async (id) => {
        const query = 'DELETE FROM historial_casos WHERE idhistorial_casos = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = historialCasosModel;