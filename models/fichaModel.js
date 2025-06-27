const pool = require('../config/database');

const fichaModel = {
    getAllFichas: async () => {
        const result = await pool.query('SELECT id_ficha, codigo, nombre FROM ficha ORDER BY codigo ASC');
        return result.rows;
    },
    getFichasAsignadas: async (id_instructor) => {
        const result = await pool.query(
            `SELECT f.id_ficha AS id, f.codigo, f.nombre
             FROM ficha f
             JOIN instructor_ficha ifi ON f.id_ficha = ifi.id_ficha
             WHERE ifi.id_instructor = $1
             ORDER BY f.codigo ASC`,
            [id_instructor]
        );
        return result.rows;
    },
};

module.exports = fichaModel; 