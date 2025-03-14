const pool = require('../config/db');

const usuarioModel = {
    getAllUsuarios: async () => {
        const query = 'SELECT * FROM usuario';
        const result = await pool.query(query);
        return result.rows;
    },
    getUsuarioById: async (id) => {
        const query = 'SELECT * FROM usuario WHERE idusuario = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createUsuario: async (usuario) => {
        const { nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol } = usuario;
        const query = `
            INSERT INTO usuario (nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`;
        const result = await pool.query(query, [nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol]);
        return result.rows[0];
    },
    updateUsuario: async (id, usuario) => {
        const { nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol } = usuario;
        const query = `
            UPDATE usuario
            SET nombre = $1, apellido = $2, correo = $3, documento = $4, tipo_documento = $5, contrasena = $6, telefono = $7, eps = $8, ficha = $9, rol = $10
            WHERE idusuario = $11
            RETURNING *`;
        const result = await pool.query(query, [nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol, id]);
        return result.rows[0];
    },
    deleteUsuario: async (id) => {
        const query = 'DELETE FROM usuario WHERE idusuario = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
};

module.exports = usuarioModel;