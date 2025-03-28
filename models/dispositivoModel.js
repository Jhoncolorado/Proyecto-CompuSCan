const pool = require('../config/database');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = `
            SELECT id, tipo, marca, modelo, serial, procesador, cargador, mouse, foto, fecha_registro 
            FROM dispositivo 
            ORDER BY fecha_registro DESC`;
        const result = await pool.query(query);
        return result.rows;
    },

    getDispositivoById: async (id) => {
        const query = 'SELECT * FROM dispositivo WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getDispositivoBySerial: async (serial) => {
        const query = 'SELECT * FROM dispositivo WHERE serial = $1';
        const result = await pool.query(query, [serial]);
        return result.rows[0];
    },

    createDispositivo: async ({ 
        tipo, marca, modelo, serial, procesador, cargador, mouse, foto 
    }) => {
        const query = `
            INSERT INTO dispositivo (
                tipo, marca, modelo, serial, procesador, cargador, mouse, foto
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;
        
        const values = [tipo, marca, modelo, serial, procesador, cargador, mouse, foto];
        console.log('Insertando dispositivo con valores:', values);
        
        const result = await pool.query(query, values);
        console.log('Dispositivo insertado:', result.rows[0]);
        return result.rows[0];
    },

    updateDispositivo: async (id, { 
        tipo, marca, modelo, serial, procesador, cargador, mouse, foto 
    }) => {
        const query = `
            UPDATE dispositivo
            SET 
                tipo = COALESCE($1, tipo),
                marca = COALESCE($2, marca),
                modelo = COALESCE($3, modelo),
                serial = COALESCE($4, serial),
                procesador = COALESCE($5, procesador),
                cargador = COALESCE($6, cargador),
                mouse = COALESCE($7, mouse),
                foto = COALESCE($8, foto)
            WHERE id = $9
            RETURNING *`;
        
        const values = [tipo, marca, modelo, serial, procesador, cargador, mouse, foto, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteDispositivo: async (id) => {
        const query = 'DELETE FROM dispositivo WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = dispositivoModel;