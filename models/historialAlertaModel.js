const db = require('../config/db');

const historialAlertaModel = {
    getAllHistorialAlertas: async () => {
        const query = `
            SELECT 
                ha.id,
                ha.id_alerta,
                ha.id_dispositivo,
                ha.fecha_hora,
                a.descripcion as descripcion_alerta,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM historial_alertas ha
            LEFT JOIN alerta a ON ha.id_alerta = a.id
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            ORDER BY ha.fecha_hora DESC
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener historial de alertas: ${error.message}`);
        }
    },

    getHistorialAlertaById: async (id) => {
        const query = `
            SELECT 
                ha.id,
                ha.id_alerta,
                ha.id_dispositivo,
                ha.fecha_hora,
                a.descripcion as descripcion_alerta,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM historial_alertas ha
            LEFT JOIN alerta a ON ha.id_alerta = a.id
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            WHERE ha.id = $1
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al obtener historial de alerta: ${error.message}`);
        }
    },

    getHistorialByDispositivo: async (id_dispositivo) => {
        const query = `
            SELECT 
                ha.id,
                ha.id_alerta,
                ha.id_dispositivo,
                ha.fecha_hora,
                a.descripcion as descripcion_alerta,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM historial_alertas ha
            LEFT JOIN alerta a ON ha.id_alerta = a.id
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            WHERE ha.id_dispositivo = $1
            ORDER BY ha.fecha_hora DESC
        `;
        try {
            const { rows } = await db.query(query, [id_dispositivo]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener historial de alertas del dispositivo: ${error.message}`);
        }
    },

    getHistorialByAlerta: async (id_alerta) => {
        const query = `
            SELECT 
                ha.id,
                ha.id_alerta,
                ha.id_dispositivo,
                ha.fecha_hora,
                a.descripcion as descripcion_alerta,
                d.nombre as nombre_dispositivo,
                d.serial
            FROM historial_alertas ha
            LEFT JOIN alerta a ON ha.id_alerta = a.id
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            WHERE ha.id_alerta = $1
            ORDER BY ha.fecha_hora DESC
        `;
        try {
            const { rows } = await db.query(query, [id_alerta]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener historial de la alerta: ${error.message}`);
        }
    },

    createHistorialAlerta: async (historialData) => {
        const { id_alerta, id_dispositivo } = historialData;

        // Verificar si la alerta existe
        const checkAlerta = await db.query(
            'SELECT id FROM alerta WHERE id = $1',
            [id_alerta]
        );

        if (checkAlerta.rows.length === 0) {
            throw new Error('La alerta especificada no existe');
        }

        // Verificar si el dispositivo existe
        const checkDispositivo = await db.query(
            'SELECT id FROM dispositivo WHERE id = $1',
            [id_dispositivo]
        );

        if (checkDispositivo.rows.length === 0) {
            throw new Error('El dispositivo especificado no existe');
        }

        const query = `
            INSERT INTO historial_alertas (
                id_alerta,
                id_dispositivo
            )
            VALUES ($1, $2)
            RETURNING *
        `;
        try {
            const { rows } = await db.query(query, [id_alerta, id_dispositivo]);
            // Obtener el registro completo con la información relacionada
            return await historialAlertaModel.getHistorialAlertaById(rows[0].id);
        } catch (error) {
            throw new Error(`Error al crear historial de alerta: ${error.message}`);
        }
    },

    deleteHistorialAlerta: async (id) => {
        const query = `
            DELETE FROM historial_alertas
            WHERE id = $1
            RETURNING id
        `;
        try {
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error al eliminar historial de alerta: ${error.message}`);
        }
    }
};

module.exports = historialAlertaModel;