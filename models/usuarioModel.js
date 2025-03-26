const pool = require('../config/db');

const usuarioModel = {
    getAllUsuarios: async () => {
        const query = 'SELECT id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro FROM usuario';
        const result = await pool.query(query);
        return result.rows;
    },

    getUsuarioById: async (id) => {
        const query = 'SELECT id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro FROM usuario WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getUsuarioByEmail: async (correo) => {
        const query = 'SELECT * FROM usuario WHERE correo = $1';
        const result = await pool.query(query, [correo]);
        return result.rows[0];
    },

    getUsuarioByDocument: async (documento) => {
        const query = 'SELECT * FROM usuario WHERE documento = $1';
        const result = await pool.query(query, [documento]);
        return result.rows[0];
    },

    createUsuario: async ({ 
        nombre, correo, documento, tipo_documento, 
        contrasena, rol, telefono1, telefono2, 
        rh, ficha, observacion, foto 
    }) => {
        const query = `
            INSERT INTO usuario (
                nombre, correo, documento, tipo_documento, 
                contrasena, rol, telefono1, telefono2, 
                rh, ficha, observacion, foto
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro`;
        
        const values = [
            nombre, correo, documento, tipo_documento,
            contrasena, rol, telefono1, telefono2,
            rh, ficha, observacion, foto
        ];
        
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    updateUsuario: async (id, { 
        nombre, correo, telefono1, telefono2, 
        rh, ficha, observacion, foto 
    }) => {
        const query = `
            UPDATE usuario
            SET 
                nombre = COALESCE($1, nombre),
                correo = COALESCE($2, correo),
                telefono1 = COALESCE($3, telefono1),
                telefono2 = COALESCE($4, telefono2),
                rh = COALESCE($5, rh),
                ficha = COALESCE($6, ficha),
                observacion = COALESCE($7, observacion),
                foto = COALESCE($8, foto)
            WHERE id = $9
            RETURNING id, nombre, correo, documento, tipo_documento, rol, telefono1, telefono2, rh, ficha, observacion, foto, fecha_registro`;
        
        const values = [
            nombre, correo, telefono1, telefono2,
            rh, ficha, observacion, foto, id
        ];
        
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteUsuario: async (id) => {
        const query = 'DELETE FROM usuario WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = usuarioModel;