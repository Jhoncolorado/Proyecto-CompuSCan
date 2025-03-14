const pool = require('../config/db');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = 'SELECT * FROM dispositivo';
        const result = await pool.query(query);
        return result.rows;
    },
    getDispositivoById: async (id) => {
        const query = 'SELECT * FROM dispositivo WHERE iddispositivo = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createDispositivo: async (dispositivo) => {
        const { marca, modelo, usuario_id } = dispositivo;
        const query = `
            INSERT INTO dispositivo (marca, modelo, usuario_id)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [marca, modelo, usuario_id]);
        return result.rows[0];
    },
    updateDispositivo: async (id, dispositivo) => {
        const { marca, modelo, usuario_id } = dispositivo;
        const query = `
            UPDATE dispositivo
            SET marca = $1, modelo = $2, usuario_id = $3
            WHERE iddispositivo = $4
            RETURNING *`;
        const result = await pool.query(query, [marca, modelo, usuario_id, id]);
        return result.rows[0];
    },
    deleteDispositivo: async (id) => {
        const query = 'DELETE FROM dispositivo WHERE iddispositivo = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = dispositivoModel;