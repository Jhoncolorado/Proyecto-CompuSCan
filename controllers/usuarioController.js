const usuarioModel = require('../models/usuarioModel');

const usuarioController = {
    getAllUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioModel.getAllUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },
    getUsuarioById: async (req, res) => {
        try {
            const usuario = await usuarioModel.getUsuarioById(req.params.id);
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    },
    createUsuario: async (req, res) => {
        try {
            const newUsuario = await usuarioModel.createUsuario(req.body);
            res.status(201).json(newUsuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    },
    updateUsuario: async (req, res) => {
        try {
            const updatedUsuario = await usuarioModel.updateUsuario(req.params.id, req.body);
            res.json(updatedUsuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    },
    deleteUsuario: async (req, res) => {
        try {
            const deletedUsuario = await usuarioModel.deleteUsuario(req.params.id);
            res.json(deletedUsuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    },
};

module.exports = usuarioController;