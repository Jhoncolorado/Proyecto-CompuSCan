const pool = require('../config/db');

const historialDispositivosModel = {
    getAllHistorialDispositivos: async () => {
        const query = 'SELECT * FROM historial_dispositivos';
        const result = await pool.query(query);
        return result.rows;
    },
    getHistorialDispositivoById: async (id) => {
        const query = 'SELECT * FROM historial_dispositivos WHERE idhistorial_dispositivos = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createHistorialDispositivo: async (historial) => {
        const { fecha, hora, descripcion, dispositivo_iddispositivo } = historial;
        const query = `
            INSERT INTO historial_dispositivos (fecha, hora, descripcion, dispositivo_iddispositivo)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, descripcion, dispositivo_iddispositivo]);
        return result.rows[0];
    },
    updateHistorialDispositivo: async (id, historial) => {
        const { fecha, hora, descripcion, dispositivo_iddispositivo } = historial;
        const query = `
            UPDATE historial_dispositivos
            SET fecha = $1, hora = $2, descripcion = $3, dispositivo_iddispositivo = $4
            WHERE idhistorial_dispositivos = $5
            RETURNING *`;
        const result = await pool.query(query, [fecha, hora, descripcion, dispositivo_iddispositivo, id]);
        return result.rows[0];
    },
    deleteHistorialDispositivo: async (id) => {
        const query = 'DELETE FROM historial_dispositivos WHERE idhistorial_dispositivos = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = historialDispositivosModel;