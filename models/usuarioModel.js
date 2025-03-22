const pool = require('../config/db');

const usuarioModel = {
    getAllUsuarios: async () => {
        try {
            const query = 'SELECT * FROM usuario';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },
    getUsuarioById: async (id) => {
        try {
            const query = 'SELECT * FROM usuario WHERE idusuario = $1';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw error;
        }
    },
    createUsuario: async (usuario) => {
        try {
            const { nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol } = usuario;
            const query = `
                INSERT INTO usuario (nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`;
            const result = await pool.query(query, [nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw error;
        }
    },
    updateUsuario: async (id, usuario) => {
        try {
            const { nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol } = usuario;
            const query = `
                UPDATE usuario
                SET nombre = $1, apellido = $2, correo = $3, documento = $4, tipo_documento = $5, contrasena = $6, telefono = $7, eps = $8, ficha = $9, rol = $10
                WHERE idusuario = $11
                RETURNING *`;
            const result = await pool.query(query, [nombre, apellido, correo, documento, tipo_documento, contrasena, telefono, eps, ficha, rol, id]);
            if (result.rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    },
    deleteUsuario: async (id) => {
        try {
            const query = 'DELETE FROM usuario WHERE idusuario = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw error;
        }
    },
};

module.exports = usuarioModel;