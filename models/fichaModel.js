const pool = require('../config/database');

const fichaModel = {
    getAllFichas: async () => {
        const result = await pool.query('SELECT id_ficha, codigo, nombre FROM ficha ORDER BY codigo ASC');
        return result.rows;
    },
};

module.exports = fichaModel; 