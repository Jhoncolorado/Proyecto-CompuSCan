const pool = require('../config/db');

const historiasReportesModel = {
    getAllHistoriasReportes: async () => {
        const query = 'SELECT * FROM historias_reportes';
        const result = await pool.query(query);
        return result.rows;
    },
    getHistoriaReporteById: async (dispositivoId, alertaId) => {
        const query = 'SELECT * FROM historias_reportes WHERE dispositivo_id = $1 AND alertas_idalertas = $2';
        const result = await pool.query(query, [dispositivoId, alertaId]);
        return result.rows[0];
    },
    createHistoriaReporte: async (historia) => {
        const { alertas_idalertas, dispositivo_id, fecha_hora } = historia;
        const query = `
            INSERT INTO historias_reportes (alertas_idalertas, dispositivo_id, fecha_hora)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [alertas_idalertas, dispositivo_id, fecha_hora]);
        return result.rows[0];
    },
    updateHistoriaReporte: async (dispositivoId, alertaId, historia) => {
        const { fecha_hora } = historia;
        const query = `
            UPDATE historias_reportes
            SET fecha_hora = $1
            WHERE dispositivo_id = $2 AND alertas_idalertas = $3
            RETURNING *`;
        const result = await pool.query(query, [fecha_hora, dispositivoId, alertaId]);
        return result.rows[0];
    },
    deleteHistoriaReporte: async (dispositivoId, alertaId) => {
        const query = 'DELETE FROM historias_reportes WHERE dispositivo_id = $1 AND alertas_idalertas = $2 RETURNING *';
        const result = await pool.query(query, [dispositivoId, alertaId]);
        return result.rows[0];
    },
};

module.exports = historiasReportesModel;