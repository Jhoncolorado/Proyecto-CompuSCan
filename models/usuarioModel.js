const pool = require('../config/database');

const usuarioModel = {
    getAllUsuarios: async () => {
        const query = 'SELECT id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro, estado FROM usuario';
        const result = await pool.query(query);
        // Convertir foto BYTEA a base64 con prefijo
        return result.rows.map(user => {
            if (user.foto) {
                user.foto = 'data:image/jpeg;base64,' + Buffer.from(user.foto).toString('base64');
            }
            return user;
        });
    },

    getUsuarioById: async (id) => {
        const query = 'SELECT id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro, estado FROM usuario WHERE id = $1';
        const result = await pool.query(query, [id]);
        const user = result.rows[0];
        if (user && user.foto) {
            user.foto = 'data:image/jpeg;base64,' + Buffer.from(user.foto).toString('base64');
        }
        return user;
    },

    getUsuarioByEmail: async (correo) => {
        const query = 'SELECT * FROM usuario WHERE correo = $1';
        const result = await pool.query(query, [correo]);
        return result.rows[0];
    },

    getUsuarioByDocument: async (documento) => {
        const query = `
            SELECT u.*, p.nombre_programa
            FROM usuario u
            LEFT JOIN programas p ON u.id_programa = p.id
            WHERE u.documento = $1
        `;
        const result = await pool.query(query, [documento]);
        return result.rows[0];
    },

    createUsuario: async ({ 
        nombre, correo, documento, tipo_documento, 
        contrasena, rol, telefono1, telefono2, 
        rh, ficha, observacion, foto, id_programa
    }) => {
        // Procesar foto base64
        let fotoBase64 = null;
        if (foto && typeof foto === 'string' && foto.startsWith('data:')) {
            fotoBase64 = foto.split(',')[1];
        } else if (foto) {
            fotoBase64 = foto;
        }
        let query;
        let values;
        if (fotoBase64) {
            query = `
                INSERT INTO usuario (
                    nombre, correo, documento, tipo_documento, 
                    contrasena, rol, telefono1, telefono2, 
                    rh, ficha, observacion, foto, id_programa
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, decode($12, 'base64'), $13)
                RETURNING id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro, id_programa`;
            values = [
                nombre, correo, documento, tipo_documento,
                contrasena, rol, telefono1, telefono2,
                rh, ficha, observacion, fotoBase64, id_programa || null
            ];
        } else {
            query = `
                INSERT INTO usuario (
                    nombre, correo, documento, tipo_documento, 
                    contrasena, rol, telefono1, telefono2, 
                    rh, ficha, observacion, foto, id_programa
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, null, $12)
                RETURNING id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro, id_programa`;
            values = [
                nombre, correo, documento, tipo_documento,
                contrasena, rol, telefono1, telefono2,
                rh, ficha, observacion, id_programa || null
            ];
        }
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    updateUsuario: async (id, { 
        nombre, correo, telefono1, telefono2, 
        rh, ficha, observacion, foto, rol, estado, contrasena
    }) => {
        // Procesar foto base64
        let fotoBase64 = null;
        if (foto && typeof foto === 'string' && foto.startsWith('data:')) {
            fotoBase64 = foto.split(',')[1];
        } else if (foto) {
            fotoBase64 = foto;
        }
        try {
            let query;
            let values;
            if (fotoBase64 && contrasena) {
                query = `
                    UPDATE usuario
                    SET 
                        nombre = COALESCE($1, nombre),
                        correo = COALESCE($2, correo),
                        telefono1 = COALESCE($3, telefono1),
                        telefono2 = COALESCE($4, telefono2),
                        rh = COALESCE($5, rh),
                        ficha = COALESCE($6, ficha),
                        observacion = COALESCE($7, observacion),
                        foto = decode($8, 'base64'),
                        rol = COALESCE($9, rol),
                        estado = COALESCE($10, estado),
                        contrasena = COALESCE($11, contrasena)
                    WHERE id = $12
                    RETURNING *`;
                values = [
                    nombre, correo, telefono1, telefono2,
                    rh, ficha, observacion, fotoBase64, rol, estado, contrasena, id
                ];
            } else if (contrasena) {
                query = `
                    UPDATE usuario
                    SET 
                        nombre = COALESCE($1, nombre),
                        correo = COALESCE($2, correo),
                        telefono1 = COALESCE($3, telefono1),
                        telefono2 = COALESCE($4, telefono2),
                        rh = COALESCE($5, rh),
                        ficha = COALESCE($6, ficha),
                        observacion = COALESCE($7, observacion),
                        rol = COALESCE($8, rol),
                        estado = COALESCE($9, estado),
                        contrasena = COALESCE($10, contrasena)
                    WHERE id = $11
                    RETURNING *`;
                values = [
                    nombre, correo, telefono1, telefono2,
                    rh, ficha, observacion, rol, estado, contrasena, id
                ];
            } else if (fotoBase64 && fotoBase64.length > 10) {
                query = `
                    UPDATE usuario
                    SET 
                        nombre = COALESCE($1, nombre),
                        correo = COALESCE($2, correo),
                        telefono1 = COALESCE($3, telefono1),
                        telefono2 = COALESCE($4, telefono2),
                        rh = COALESCE($5, rh),
                        ficha = COALESCE($6, ficha),
                        observacion = COALESCE($7, observacion),
                        foto = decode($8, 'base64'),
                        rol = COALESCE($9, rol),
                        estado = COALESCE($10, estado)
                    WHERE id = $11
                    RETURNING *`;
                values = [
                    nombre, correo, telefono1, telefono2,
                    rh, ficha, observacion, fotoBase64, rol, estado, id
                ];
            } else {
                query = `
                    UPDATE usuario
                    SET 
                        nombre = COALESCE($1, nombre),
                        correo = COALESCE($2, correo),
                        telefono1 = COALESCE($3, telefono1),
                        telefono2 = COALESCE($4, telefono2),
                        rh = COALESCE($5, rh),
                        ficha = COALESCE($6, ficha),
                        observacion = COALESCE($7, observacion),
                        rol = COALESCE($8, rol),
                        estado = COALESCE($9, estado)
                    WHERE id = $10
                    RETURNING *`;
                values = [
                    nombre, correo, telefono1, telefono2,
                    rh, ficha, observacion, rol, estado, id
                ];
            }
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    deleteUsuario: async (id) => {
        const query = 'DELETE FROM usuario WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    countUsuarios: async () => {
        const result = await pool.query('SELECT COUNT(*) FROM usuario');
        return parseInt(result.rows[0].count, 10);
    },

    updateUltimoAcceso: async (id) => {
        const query = 'UPDATE usuario SET ultimo_acceso = NOW() WHERE id = $1';
        await pool.query(query, [id]);
    },

    getUsuariosPaginados: async (limit, offset) => {
        const query = 'SELECT id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro, estado FROM usuario ORDER BY id DESC LIMIT $1 OFFSET $2';
        const result = await pool.query(query, [limit, offset]);
        return result.rows.map(user => {
            if (user.foto) {
                user.foto = 'data:image/jpeg;base64,' + Buffer.from(user.foto).toString('base64');
            }
            return user;
        });
    }
};

module.exports = usuarioModel;