const pool = require('../config/database');

const alertaModel = {
    getAllAlertas: async () => {
        const query = `
            SELECT 
                a.id,
                a.descripcion,
                a.fecha as fecha_creacion,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM alerta a
            LEFT JOIN historial_alertas ha ON a.id = ha.id_alerta
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            ORDER BY a.fecha DESC`;
        const result = await pool.query(query);
        return result.rows;
    },

    getAlertaById: async (id) => {
        const query = `
            SELECT 
                a.*,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM alerta a
            LEFT JOIN historial_alertas ha ON a.id = ha.id_alerta
            LEFT JOIN dispositivo d ON ha.id_dispositivo = d.id
            WHERE a.id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createAlerta: async ({ 
        descripcion,
        dispositivo_id
    }) => {
        // Primero creamos la alerta
        const queryAlerta = `
            INSERT INTO alerta (descripcion)
            VALUES ($1)
            RETURNING *`;
        
        const resultAlerta = await pool.query(queryAlerta, [descripcion]);
        const alerta = resultAlerta.rows[0];

        // Luego creamos el registro en historial_alertas
        const queryHistorial = `
            INSERT INTO historial_alertas (id_alerta, id_dispositivo)
            VALUES ($1, $2)
            RETURNING *`;
        
        await pool.query(queryHistorial, [alerta.id, dispositivo_id]);

        return alerta;
    },

    updateAlerta: async (id, { 
        descripcion,
        dispositivo_id
    }) => {
        // Actualizamos la alerta
        const queryAlerta = `
            UPDATE alerta
            SET descripcion = COALESCE($1, descripcion)
            WHERE id = $2
            RETURNING *`;
        
        const resultAlerta = await pool.query(queryAlerta, [descripcion, id]);
        const alerta = resultAlerta.rows[0];

        // Si se proporciona un nuevo dispositivo_id, actualizamos el historial
        if (dispositivo_id) {
            const queryHistorial = `
                UPDATE historial_alertas
                SET id_dispositivo = $1
                WHERE id_alerta = $2
                RETURNING *`;
            
            await pool.query(queryHistorial, [dispositivo_id, id]);
        }

        return alerta;
    },

    deleteAlerta: async (id) => {
        const query = 'DELETE FROM alerta WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getAlertasByDispositivo: async (dispositivo_id) => {
        const query = `
            SELECT 
                a.*,
                d.nombre as dispositivo_nombre,
                d.serial as dispositivo_serial
            FROM alerta a
            JOIN historial_alertas ha ON a.id = ha.id_alerta
            JOIN dispositivo d ON ha.id_dispositivo = d.id
            WHERE ha.id_dispositivo = $1
            ORDER BY a.fecha DESC`;
        const result = await pool.query(query, [dispositivo_id]);
        return result.rows;
    },

    countAlertasPendientes: async () => {
        const result = await pool.query("SELECT COUNT(*) FROM alerta WHERE estado = 'pendiente'");
        return parseInt(result.rows[0].count, 10);
    }
};

module.exports = alertaModel;