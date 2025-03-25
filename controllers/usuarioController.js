const usuarioModel = require('../models/usuarioModel');

const usuarioController = {
    getAllUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioModel.getAllUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener usuarios',
                details: error.message 
            });
        }
    },

    getUsuarioById: async (req, res) => {
        try {
            const usuario = await usuarioModel.getUsuarioById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener usuario',
                details: error.message 
            });
        }
    },

    createUsuario: async (req, res) => {
        try {
            // Validar campos obligatorios según nuevo SQL
            const { nombre, correo, documento, tipo_documento, contrasena, rol } = req.body;
            if (!nombre || !correo || !documento || !tipo_documento || !contrasena || !rol) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            const newUsuario = await usuarioModel.createUsuario({
                nombre,
                correo,
                documento,
                tipo_documento,
                contrasena,
                rol,
                telefono1: req.body.telefono1 || null,
                telefono2: req.body.telefono2 || null,
                rh: req.body.rh || null,
                ficha: req.body.ficha || null,
                foto: req.body.foto || null
            });
            res.status(201).json(newUsuario);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear usuario',
                details: error.message 
            });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            const updatedUsuario = await usuarioModel.updateUsuario(
                req.params.id, 
                {
                    nombre: req.body.nombre,
                    correo: req.body.correo,
                    telefono1: req.body.telefono1,
                    telefono2: req.body.telefono2,
                    rh: req.body.rh,
                    ficha: req.body.ficha,
                    foto: req.body.foto
                }
            );
            if (!updatedUsuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(updatedUsuario);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar usuario',
                details: error.message 
            });
        }
    },

    deleteUsuario: async (req, res) => {
        try {
            const deletedUsuario = await usuarioModel.deleteUsuario(req.params.id);
            if (!deletedUsuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar usuario',
                details: error.message 
            });
        }
    }
};

module.exports = usuarioController;