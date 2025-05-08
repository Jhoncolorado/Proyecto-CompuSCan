const pool = require('../config/database');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query);
        return result.rows;
    },

    getDispositivoById: async (id) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getDispositivoBySerial: async (serial) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.serial = $1`;
        const result = await pool.query(query, [serial]);
        return result.rows[0];
    },

    getDispositivoByRFID: async (rfid) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.rfid = $1`;
        const result = await pool.query(query, [rfid]);
        return result.rows[0];
    },

    createDispositivo: async ({ 
        nombre, tipo, serial, rfid, foto, id_usuario
    }) => {
        const query = `
            INSERT INTO dispositivo (
                nombre, tipo, serial, rfid, foto, id_usuario
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        
        const values = [nombre, tipo, serial, rfid, foto, id_usuario];
        console.log('Insertando dispositivo con valores:', values);
        
        const result = await pool.query(query, values);
        console.log('Dispositivo insertado:', result.rows[0]);
        return result.rows[0];
    },

    updateDispositivo: async (id, { 
        nombre, tipo, serial, rfid, foto, id_usuario
    }) => {
        const query = `
            UPDATE dispositivo
            SET 
                nombre = COALESCE($1, nombre),
                tipo = COALESCE($2, tipo),
                serial = COALESCE($3, serial),
                rfid = COALESCE($4, rfid),
                foto = COALESCE($5, foto),
                id_usuario = COALESCE($6, id_usuario)
            WHERE id = $7
            RETURNING *`;
        
        const values = [nombre, tipo, serial, rfid, foto, id_usuario, id];
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