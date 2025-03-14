const pool = require('../config/db');

const carnetModel = {
    getAllCarnets: async () => {
        const query = 'SELECT * FROM carnet';
        const result = await pool.query(query);
        return result.rows;
    },
    getCarnetById: async (id) => {
        const query = 'SELECT * FROM carnet WHERE idcarnet = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createCarnet: async (carnet) => {
        const { usuario_id, programas_id, numero_carnet, observacion } = carnet;
        const query = `
            INSERT INTO carnet (usuario_id, programas_id, numero_carnet, observacion)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await pool.query(query, [usuario_id, programas_id, numero_carnet, observacion]);
        return result.rows[0];
    },
    updateCarnet: async (id, carnet) => {
        const { usuario_id, programas_id, numero_carnet, observacion } = carnet;
        const query = `
            UPDATE carnet
            SET usuario_id = $1, programas_id = $2, numero_carnet = $3, observacion = $4
            WHERE idcarnet = $5
            RETURNING *`;
        const result = await pool.query(query, [usuario_id, programas_id, numero_carnet, observacion, id]);
        return result.rows[0];
    },
    deleteCarnet: async (id) => {
        const query = 'DELETE FROM carnet WHERE idcarnet = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = carnetModel;