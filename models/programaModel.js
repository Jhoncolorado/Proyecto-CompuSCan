const db = require('../config/db');

const programaModel = {
    getAllProgramas: async () => {
        const query = `
            SELECT id, nombre_programa, fecha_creacion, fecha_actualizacion
            FROM programas
            ORDER BY nombre_programa ASC
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener programas: ${error.message}`);
        }
    },

    getProgramaById: async (id) => {
        const query = `
            SELECT id, nombre_programa, fecha_creacion, fecha_actualizacion
            FROM programas
            WHERE id = $1
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener programa: ${error.message}`);
        }
    },

    createPrograma: async (programaData) => {
        const { nombre_programa } = programaData;
        const query = `
            INSERT INTO programas (nombre_programa, fecha_creacion, fecha_actualizacion)
            VALUES ($1, CURRENT_DATE, CURRENT_DATE)
            RETURNING id, nombre_programa, fecha_creacion, fecha_actualizacion
        `;
        try {
            const { rows } = await db.query(query, [nombre_programa]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al crear programa: ${error.message}`);
        }
    },

    updatePrograma: async (id, programaData) => {
        const { nombre_programa } = programaData;
        const query = `
            UPDATE programas
            SET nombre_programa = COALESCE($1, nombre_programa),
                fecha_actualizacion = CURRENT_DATE
            WHERE id = $2
            RETURNING id, nombre_programa, fecha_creacion, fecha_actualizacion
        `;
        try {
            const { rows } = await db.query(query, [nombre_programa, id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al actualizar programa: ${error.message}`);
        }
    },

    deletePrograma: async (id) => {
        const query = `
            DELETE FROM programas
            WHERE id = $1
            RETURNING id
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar programa: ${error.message}`);
        }
    }
};

module.exports = programaModel;