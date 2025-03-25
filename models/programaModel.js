const pool = require('../config/db');

const programaModel = {
    getAllProgramas: async () => {
        const query = 'SELECT * FROM programas';
        const result = await pool.query(query);
        return result.rows;
    },

    getProgramaById: async (id) => {
        const query = 'SELECT * FROM programas WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0]; // Retorna undefined si no existe
    },

    createPrograma: async ({ nombre_programa }) => {
        const query = `
            INSERT INTO programas 
            (nombre_programa, fecha_creacion, fecha_actualizacion)
            VALUES ($1, CURRENT_DATE, CURRENT_DATE)
            RETURNING *`;
        const result = await pool.query(query, [nombre_programa]);
        return result.rows[0];
    },

    updatePrograma: async (id, { nombre_programa }) => {
        const query = `
            UPDATE programas
            SET 
                nombre_programa = $1,
                fecha_actualizacion = CURRENT_DATE
            WHERE id = $2
            RETURNING *`;
        const result = await pool.query(query, [nombre_programa, id]);
        return result.rows[0];
    },

    deletePrograma: async (id) => {
        const query = 'DELETE FROM programas WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = programaModel;