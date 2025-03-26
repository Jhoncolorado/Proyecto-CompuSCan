const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

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
            const { 
                nombre, correo, documento, tipo_documento, 
                contrasena, rol, telefono1, telefono2, 
                rh, ficha, observacion, foto 
            } = req.body;

            // Validar campos obligatorios
            if (!nombre || !correo || !documento || !tipo_documento || !contrasena || !rol) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            // Verificar si el correo ya existe
            const usuarioExistente = await usuarioModel.getUsuarioByEmail(correo);
            if (usuarioExistente) {
                return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            }

            // Verificar si el documento ya existe
            const documentoExistente = await usuarioModel.getUsuarioByDocument(documento);
            if (documentoExistente) {
                return res.status(400).json({ error: 'El documento ya está registrado' });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            const newUsuario = await usuarioModel.createUsuario({
                nombre,
                correo,
                documento,
                tipo_documento,
                contrasena: hashedPassword,
                rol,
                telefono1,
                telefono2,
                rh,
                ficha,
                observacion,
                foto
            });

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                usuario: {
                    id: newUsuario.id,
                    nombre: newUsuario.nombre,
                    correo: newUsuario.correo,
                    rol: newUsuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear usuario',
                details: error.message 
            });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            const { 
                nombre, correo, telefono1, telefono2, 
                rh, ficha, observacion, foto 
            } = req.body;

            // Verificar si el usuario existe
            const usuarioExistente = await usuarioModel.getUsuarioById(req.params.id);
            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Si se está actualizando el correo, verificar que no exista
            if (correo && correo !== usuarioExistente.correo) {
                const correoExistente = await usuarioModel.getUsuarioByEmail(correo);
                if (correoExistente) {
                    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
                }
            }

            const updatedUsuario = await usuarioModel.updateUsuario(
                req.params.id,
                {
                    nombre,
                    correo,
                    telefono1,
                    telefono2,
                    rh,
                    ficha,
                    observacion,
                    foto
                }
            );

            res.json({
                message: 'Usuario actualizado exitosamente',
                usuario: {
                    id: updatedUsuario.id,
                    nombre: updatedUsuario.nombre,
                    correo: updatedUsuario.correo,
                    rol: updatedUsuario.rol
                }
            });
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
    },

    login: async (req, res) => {
        try {
            const { correo, contrasena } = req.body;
            console.log('Intento de login para:', correo); // Debug

            if (!correo || !contrasena) {
                return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
            }

            const usuario = await usuarioModel.getUsuarioByEmail(correo);
            console.log('Usuario encontrado:', usuario ? 'Sí' : 'No'); // Debug

            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
            console.log('Contraseña válida:', contrasenaValida); // Debug

            if (!contrasenaValida) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // No enviar la contraseña en la respuesta
            const { contrasena: _, ...usuarioSinContrasena } = usuario;

            res.json({
                message: 'Login exitoso',
                usuario: usuarioSinContrasena
            });
        } catch (error) {
            console.error('Error en login:', error); // Debug
            res.status(500).json({ 
                error: 'Error en el login',
                details: error.message 
            });
        }
    }
};

module.exports = usuarioController;