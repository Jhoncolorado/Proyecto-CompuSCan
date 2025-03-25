const pool = require('../config/db');

const casoModel = {
    createCaso: async ({ tipo_reporte, id_historial, estado }) => {
        const query = `
            INSERT INTO caso 
            (tipo_reporte, id_historial, estado)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [tipo_reporte, id_historial, estado]);
        return result.rows[0];
    },

    getCasosByEstado: async (estado) => {
        const query = `
            SELECT c.*, h.descripcion as historial_descripcion
            FROM caso c
            JOIN historial_dispositivo h ON c.id_historial = h.id_historial
            WHERE c.estado = $1`;
        const result = await pool.query(query, [estado]);
        return result.rows;
    }
};

module.exports = casoModel;