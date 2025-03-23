const pool = require('../config/db');

const programaModel = {
    getAllProgramas: async () => {
        try {
            const query = 'SELECT * FROM programas';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los programas:', error);
            throw error;
        }
    },
    getProgramaById: async (id) => {
        try {
            const query = 'SELECT * FROM programas WHERE idprogramas = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Programa no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener el programa:', error);
            throw error;
        }
    },
    createPrograma: async (programa) => {
        try {
            const { nombre_programa } = programa;
            const query = `
                INSERT INTO programas (nombre_programa)
                VALUES ($1)
                RETURNING *`;
            const result = await pool.query(query, [nombre_programa]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el programa:', error);
            throw error;
        }
    },
    updatePrograma: async (id, programa) => {
        try {
            const { nombre_programa } = programa;
            const query = `
                UPDATE programas
                SET nombre_programa = $1
                WHERE idprogramas = $2
                RETURNING *`;
            const result = await pool.query(query, [nombre_programa, id]);
            if (result.rows.length === 0) {
                throw new Error('Programa no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el programa:', error);
            throw error;
        }
    },
    deletePrograma: async (id) => {
        try {
            const query = 'DELETE FROM programas WHERE idprogramas = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Programa no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar el programa:', error);
            throw error;
        }
    },
};

module.exports = programaModel;