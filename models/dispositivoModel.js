const pool = require('../config/db');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = 'SELECT * FROM dispositivo';
        const result = await pool.query(query);
        return result.rows;
    },

    getDispositivoById: async (id) => {
        const query = 'SELECT * FROM dispositivo WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0]; // Retorna undefined si no existe
    },

    createDispositivo: async ({ nombre, tipo, serial, foto }) => {
        const query = `
            INSERT INTO dispositivo 
            (nombre, tipo, serial, foto)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [nombre, tipo, serial, foto];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    updateDispositivo: async (id, { nombre, tipo, serial, foto }) => {
        const query = `
            UPDATE dispositivo
            SET 
                nombre = COALESCE($1, nombre),
                tipo = COALESCE($2, tipo),
                serial = COALESCE($3, serial),
                foto = COALESCE($4, foto)
            WHERE id = $5
            RETURNING *`;
        const values = [nombre, tipo, serial, foto, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteDispositivo: async (id) => {
        const query = 'DELETE FROM dispositivo WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = dispositivoModel;