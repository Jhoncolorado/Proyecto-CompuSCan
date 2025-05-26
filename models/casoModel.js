const db = require('../config/database');

const casoModel = {
    getAllCasos: async () => {
        const query = `
            SELECT 
                c.id_caso,
                c.fecha_hora,
                c.tipo_reporte,
                c.id_historial,
                c.estado,
                h.id_dispositivo,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM caso c
            LEFT JOIN historial_dispositivo h ON c.id_historial = h.id_historial
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            ORDER BY c.fecha_hora DESC
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener casos: ${error.message}`);
        }
    },

    getCasoById: async (id_caso) => {
        const query = `
            SELECT 
                c.id_caso,
                c.fecha_hora,
                c.tipo_reporte,
                c.id_historial,
                c.estado,
                h.id_dispositivo,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM caso c
            LEFT JOIN historial_dispositivo h ON c.id_historial = h.id_historial
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            WHERE c.id_caso = $1
        `;
        try {
            const { rows } = await db.query(query, [id_caso]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener caso: ${error.message}`);
        }
    },

    getCasosByHistorial: async (id_historial) => {
        const query = `
            SELECT 
                c.id_caso,
                c.fecha_hora,
                c.tipo_reporte,
                c.id_historial,
                c.estado,
                h.id_dispositivo,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM caso c
            LEFT JOIN historial_dispositivo h ON c.id_historial = h.id_historial
            LEFT JOIN dispositivo d ON h.id_dispositivo = d.id
            WHERE c.id_historial = $1
            ORDER BY c.fecha_hora DESC
        `;
        try {
            const { rows } = await db.query(query, [id_historial]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener casos del historial: ${error.message}`);
        }
    },

    createCaso: async (casoData) => {
        const {
            tipo_reporte,
            id_historial,
            estado = 'Abierto'
        } = casoData;

        // Validar que el historial existe
        const checkHistorial = await db.query(
            'SELECT id_historial FROM historial_dispositivo WHERE id_historial = $1',
            [id_historial]
        );

        if (checkHistorial.rows.length === 0) {
            throw new Error('El historial especificado no existe');
        }

        const query = `
            INSERT INTO caso (
                tipo_reporte,
                id_historial,
                estado
            )
            VALUES ($1, $2, $3)
            RETURNING id_caso
        `;
        try {
            const { rows } = await db.query(query, [
                tipo_reporte,
                id_historial,
                estado
            ]);
            
            // Obtener el caso completo con la información relacionada
            return await casoModel.getCasoById(rows[0].id_caso);
        } catch (error) {
            throw new Error(`Error al crear caso: ${error.message}`);
        }
    },

    updateCaso: async (id_caso, casoData) => {
        const {
            tipo_reporte,
            id_historial,
            estado
        } = casoData;

        // Verificar si el caso existe
        const casoExistente = await casoModel.getCasoById(id_caso);
        if (!casoExistente) {
            throw new Error('Caso no encontrado');
        }

        // Si se proporciona id_historial, verificar que existe
        if (id_historial) {
            const checkHistorial = await db.query(
                'SELECT id_historial FROM historial_dispositivo WHERE id_historial = $1',
                [id_historial]
            );

            if (checkHistorial.rows.length === 0) {
                throw new Error('El historial especificado no existe');
            }
        }

        const query = `
            UPDATE caso
            SET tipo_reporte = COALESCE($1, tipo_reporte),
                id_historial = COALESCE($2, id_historial),
                estado = COALESCE($3, estado)
            WHERE id_caso = $4
            RETURNING id_caso
        `;
        try {
            const { rows } = await db.query(query, [
                tipo_reporte,
                id_historial,
                estado,
                id_caso
            ]);
            
            // Obtener el caso actualizado con la información relacionada
            return await casoModel.getCasoById(rows[0].id_caso);
        } catch (error) {
            throw new Error(`Error al actualizar caso: ${error.message}`);
        }
    },

    deleteCaso: async (id_caso) => {
        const query = `
            DELETE FROM caso
            WHERE id_caso = $1
            RETURNING id_caso
        `;
        try {
            const { rows } = await db.query(query, [id_caso]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar caso: ${error.message}`);
        }
    }
};

module.exports = casoModel;