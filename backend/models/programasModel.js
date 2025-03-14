const pool = require('../config/db');

const programasModel = {
    getAllProgramas: async () => {
        const query = 'SELECT * FROM programas';
        const result = await pool.query(query);
        return result.rows;
    },
    getProgramaById: async (id) => {
        const query = 'SELECT * FROM programas WHERE idprogramas = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createPrograma: async (programa) => {
        const { nombre_programa } = programa;
        const query = `
            INSERT INTO programas (nombre_programa)
            VALUES ($1)
            RETURNING *`;
        const result = await pool.query(query, [nombre_programa]);
        return result.rows[0];
    },
    updatePrograma: async (id, programa) => {
        const { nombre_programa } = programa;
        const query = `
            UPDATE programas
            SET nombre_programa = $1
            WHERE idprogramas = $2
            RETURNING *`;
        const result = await pool.query(query, [nombre_programa, id]);
        return result.rows[0];
    },
    deletePrograma: async (id) => {
        const query = 'DELETE FROM programas WHERE idprogramas = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = programasModel;