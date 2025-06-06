const pool = require('../config/database');

/**
 * El campo 'foto' en la tabla 'dispositivo' es de tipo TEXT y almacena un array JSON de nombres de archivo.
 * Todas las funciones del modelo (getAllDispositivos, getDispositivosPaginados, getDispositivoById, etc.)
 * devuelven el campo 'foto' como un array de strings, nunca como base64 ni binario.
 * Ejemplo de valor en la base de datos:
 *   ["img1.jpg","img2.jpg","img3.jpg"]
 */

const dispositivoModel = {
    getAllDispositivos: async () => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, d.mime_type, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            ORDER BY d.fecha_registro DESC`;
        const result = await pool.query(query);
        // Devolver foto como array de nombres de archivo
        return result.rows.map(device => {
            if (device.foto) {
                try {
                    device.foto = JSON.parse(device.foto);
                    if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                        device.foto = device.foto[0];
                    }
                } catch {
                    device.foto = [device.foto];
                }
            }
            return device;
        });
    },

    getDispositivoById: async (id) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.id = $1`;
        const result = await pool.query(query, [id]);
        const device = result.rows[0];
        if (device && device.foto) {
            try {
                device.foto = JSON.parse(device.foto);
                if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                    device.foto = device.foto[0];
                }
            } catch {
                device.foto = [device.foto];
            }
        }
        return device;
    },

    getDispositivoBySerial: async (serial) => {
        const query = `
            SELECT d.*, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            WHERE d.serial = $1`;
        const result = await pool.query(query, [serial]);
        const device = result.rows[0];
        if (device && device.foto) {
            try {
                device.foto = JSON.parse(device.foto);
                if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                    device.foto = device.foto[0];
                }
            } catch {
                device.foto = [device.foto];
            }
        }
        return device;
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
            try {
                dispositivo.foto = JSON.parse(dispositivo.foto);
                if (Array.isArray(dispositivo.foto) && Array.isArray(dispositivo.foto[0])) {
                    dispositivo.foto = dispositivo.foto[0];
                }
            } catch {
                dispositivo.foto = [dispositivo.foto];
            }
        }
        return dispositivo;
    },

    createDispositivo: async ({ 
        nombre, tipo, serial, rfid, foto, mimeType, id_usuario
    }) => {
        const query = `
            INSERT INTO dispositivo (
                nombre, tipo, serial, rfid, foto, mime_type, id_usuario
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
        const values = [nombre, tipo, serial, rfid, foto, mimeType, id_usuario];
        console.log('Insertando dispositivo con valores:', { 
            nombre, tipo, serial, rfid, 
            foto: foto ? 'Foto presente (base64)' : 'Sin foto',
            mimeType, id_usuario 
        });
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
        // Devolver foto como array de nombres de archivo
        return result.rows.map(device => {
            if (device.foto) {
                try {
                    device.foto = JSON.parse(device.foto);
                    if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                        device.foto = device.foto[0];
                    }
                } catch {
                    device.foto = [device.foto];
                }
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
        // Procesar foto igual que en los otros métodos
        return result.rows.map(device => {
            if (device.foto) {
                try {
                    device.foto = JSON.parse(device.foto);
                    if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                        device.foto = device.foto[0];
                    }
                } catch {
                    device.foto = [device.foto];
                }
            }
            return device;
        });
    },

    countDispositivos: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM dispositivo');
        return parseInt(result.rows[0].count, 10);
    },

    getDispositivosPaginados: async (limit, offset) => {
        const query = `
            SELECT d.id, d.nombre, d.tipo, d.serial, d.rfid, d.foto, d.id_usuario, d.fecha_registro, d.estado_validacion, d.mime_type, u.nombre as nombre_usuario
            FROM dispositivo d
            JOIN usuario u ON d.id_usuario = u.id
            ORDER BY d.fecha_registro DESC
            LIMIT $1 OFFSET $2`;
        const result = await pool.query(query, [limit, offset]);
        return result.rows.map(device => {
            if (device.foto) {
                try {
                    device.foto = JSON.parse(device.foto);
                    if (Array.isArray(device.foto) && Array.isArray(device.foto[0])) {
                        device.foto = device.foto[0];
                    }
                } catch {
                    device.foto = [device.foto];
                }
            }
            return device;
        });
    }
};

module.exports = dispositivoModel;