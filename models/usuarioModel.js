const pool = require('../config/db');

const usuarioModel = {
    getAllUsuarios: async () => {
        const query = 'SELECT id, nombre, correo, documento, rol FROM usuario';
        const result = await pool.query(query);
        return result.rows;
    },

    getUsuarioById: async (id) => {
        const query = 'SELECT * FROM usuario WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createUsuario: async ({ 
        nombre, correo, documento, tipo_documento, contrasena, rol, 
        telefono1, telefono2, rh, ficha, foto 
    }) => {
        const query = `
            INSERT INTO usuario (
                nombre, correo, documento, tipo_documento, contrasena, rol,
                telefono1, telefono2, rh, ficha, foto
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, nombre, correo, rol`;
        const values = [
            nombre, correo, documento, tipo_documento, contrasena, rol,
            telefono1, telefono2, rh, ficha, foto
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    updateUsuario: async (id, { 
        nombre, correo, telefono1, telefono2, rh, ficha, foto 
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
                foto = COALESCE($7, foto)
            WHERE id = $8
            RETURNING *`;
        const values = [
            nombre, correo, telefono1, telefono2, rh, ficha, foto, id
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