const pool = require('../config/database');

const historialDispositivoModel = {
    getAllHistoriales: async () => {
        const query = `
            SELECT 
                h.id_historial,
                h.fecha_hora_entrada,
                h.fecha_hora_salida,
                h.descripcion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM historial_dispositivo h
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            ORDER BY h.fecha_hora_entrada DESC`;
        const result = await pool.query(query);
        return result.rows;
    },

    getHistorialById: async (id) => {
        const query = `
            SELECT 
                h.id_historial,
                h.fecha_hora_entrada,
                h.fecha_hora_salida,
                h.descripcion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM historial_dispositivo h
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            WHERE h.id_historial = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createHistorial: async ({ 
        descripcion,
        id_dispositivo
    }) => {
        const query = `
            INSERT INTO historial_dispositivo (descripcion, id_dispositivo)
            VALUES ($1, $2)
            RETURNING *`;
        
        const result = await pool.query(query, [descripcion, id_dispositivo]);
        return result.rows[0];
    },

    updateHistorial: async (id, { 
        descripcion,
        id_dispositivo
    }) => {
        const query = `
            UPDATE historial_dispositivo
            SET 
                descripcion = COALESCE($1, descripcion),
                id_dispositivo = COALESCE($2, id_dispositivo)
            WHERE id_historial = $3
            RETURNING *`;
        
        const result = await pool.query(query, [descripcion, id_dispositivo, id]);
        return result.rows[0];
    },

    deleteHistorial: async (id) => {
        const query = 'DELETE FROM historial_dispositivo WHERE id_historial = $1 RETURNING id_historial';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getHistorialesByDispositivo: async (dispositivo_id) => {
        const query = `
            SELECT 
                h.id_historial,
                h.fecha_hora_entrada,
                h.fecha_hora_salida,
                h.descripcion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM historial_dispositivo h
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            WHERE h.id_dispositivo = $1
            ORDER BY h.fecha_hora_entrada DESC`;
        const result = await pool.query(query, [dispositivo_id]);
        return result.rows;
    },

    countActividadHoy: async () => {
        const query = `
            SELECT 
                SUM(CASE WHEN descripcion ILIKE '%entrada%' THEN 1 ELSE 0 END) AS entradas,
                SUM(CASE WHEN descripcion ILIKE '%salida%' THEN 1 ELSE 0 END) AS salidas,
                COUNT(*) AS total
            FROM historial_dispositivo
            WHERE DATE(fecha_hora_entrada) = CURRENT_DATE
        `;
        const result = await pool.query(query);
        return {
            entradas: parseInt(result.rows[0].entradas, 10) || 0,
            salidas: parseInt(result.rows[0].salidas, 10) || 0,
            total: parseInt(result.rows[0].total, 10) || 0
        };
    },

    getActividadReciente: async () => {
        const query = `
            SELECT 
                h.id_historial,
                h.fecha_hora_entrada,
                h.fecha_hora_salida,
                h.descripcion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM historial_dispositivo h
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            ORDER BY h.fecha_hora_entrada DESC
            LIMIT 5
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    getHistorialesPaginados: async (limit, offset) => {
        const query = `
            SELECT 
                h.id_historial,
                h.fecha_hora_entrada,
                h.fecha_hora_salida,
                h.descripcion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM historial_dispositivo h
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            ORDER BY h.fecha_hora_entrada DESC
            LIMIT $1 OFFSET $2`;
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    },

    countHistoriales: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM historial_dispositivo');
        return parseInt(result.rows[0].count, 10);
    }
};

module.exports = historialDispositivoModel;