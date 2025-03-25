const pool = require('../config/db');

const historialDispositivoModel = {
    getAllHistorialDispositivos: async () => {
        const query = `
            SELECT h.*, d.nombre as dispositivo_nombre 
            FROM historial_dispositivo h
            JOIN dispositivo d ON h.id_dispositivo = d.id`;
        const result = await pool.query(query);
        return result.rows;
    },

    getHistorialDispositivoById: async (id) => {
        const query = `
            SELECT h.*, d.nombre as dispositivo_nombre 
            FROM historial_dispositivo h
            JOIN dispositivo d ON h.id_dispositivo = d.id
            WHERE h.id_historial = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createHistorialDispositivo: async ({ descripcion, id_dispositivo }) => {
        const query = `
            INSERT INTO historial_dispositivo 
            (descripcion, id_dispositivo)
            VALUES ($1, $2)
            RETURNING *`;
        const result = await pool.query(query, [descripcion, id_dispositivo]);
        return result.rows[0];
    }
};

module.exports = historialDispositivoModel;