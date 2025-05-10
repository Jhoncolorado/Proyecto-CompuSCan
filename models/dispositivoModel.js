const pool = require('../config/database');

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, u.nombre as nombre_usuario
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
        const dispositivo = result.rows[0];
        if (dispositivo && dispositivo.foto) {
            dispositivo.foto = 'data:image/jpeg;base64,' + Buffer.from(dispositivo.foto).toString('base64');
        }
        return dispositivo;
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
        nombre, tipo, serial, rfid, foto, id_usuario, estado_validacion
    }) => {
        let query, values;
        if (foto && typeof foto === 'string' && foto.length > 10) {
            query = `
                UPDATE dispositivo
                SET 
                    nombre = COALESCE($1, nombre),
                    tipo = COALESCE($2, tipo),
                    serial = COALESCE($3, serial),
                    rfid = COALESCE($4, rfid),
                    foto = decode($5, 'base64'),
                    id_usuario = COALESCE($6, id_usuario),
                    estado_validacion = COALESCE($7, estado_validacion)
                WHERE id = $8
                RETURNING *`;
            values = [nombre, tipo, serial, rfid, foto, id_usuario, estado_validacion, id];
        } else {
            query = `
                UPDATE dispositivo
                SET 
                    nombre = COALESCE($1, nombre),
                    tipo = COALESCE($2, tipo),
                    serial = COALESCE($3, serial),
                    rfid = COALESCE($4, rfid),
                    id_usuario = COALESCE($5, id_usuario),
                    estado_validacion = COALESCE($6, estado_validacion)
                WHERE id = $7
                RETURNING *`;
            values = [nombre, tipo, serial, rfid, id_usuario, estado_validacion, id];
        }
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteDispositivo: async (id) => {
        const query = 'DELETE FROM dispositivo WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getDispositivosByUsuario: async (usuarioId) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.id_usuario = $1
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query, [usuarioId]);
        // Convertir foto a base64 si existe
        return result.rows.map(device => {
            if (device.foto) {
                device.foto = 'data:image/jpeg;base64,' + Buffer.from(device.foto).toString('base64');
            }
            return device;
        });
    },

    getDispositivosPendientes: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.rfid IS NULL
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query);
        // Forzar el campo foto a null para evitar problemas en el frontend
        return result.rows.map(device => {
            device.foto = null;
            return device;
        });
    }
};

module.exports = dispositivoModel;