const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Función auxiliar para convertir base64 a formato adecuado para BYTEA
const prepareImageForDB = (base64String) => {
    // Si no hay imagen, retornar null
    if (!base64String) return null;
    
    // Si no es string o no es base64, retornar como está
    if (typeof base64String !== 'string' || !base64String.startsWith('data:')) {
        return base64String;
    }
    
    try {
        // Extraer la parte base64 (eliminar el prefijo data:image/xxx;base64,)
        const base64Data = base64String.split(',')[1];
        // PostgreSQL tiene la función decode() que convierte base64 a bytea
        // Aquí solo preparamos el string para la consulta SQL
        return base64Data;
    } catch (error) {
        console.error('Error al procesar imagen:', error);
        return null;
    }
};

// Almacenamiento temporal de tokens de recuperación (en memoria para demo)
const passwordResetTokens = {};

// Configuración de nodemailer usando variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const usuarioController = {
    getAllUsuarios: async (req, res) => {
        try {
            // Soporte de paginación
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const total = await usuarioModel.countUsuarios();
            const usuarios = await usuarioModel.getUsuariosPaginados(limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.json({
                data: usuarios,
                total,
                page,
                totalPages,
                limit
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener usuarios',
                details: error.message 
            });
        }
    },

    getUsuarioById: async (req, res) => {
        // Validar que el parámetro id sea un número entero válido
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }
        try {
            const usuario = await usuarioModel.getUsuarioById(id);
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
            
            // Preparar la foto para guardar en la DB si es base64
            const fotoProcesada = prepareImageForDB(foto);

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
                foto: fotoProcesada
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
                rh, ficha, observacion, foto, rol, estado
            } = req.body;
            await usuarioModel.updateUsuario(
                req.params.id,
                {
                    nombre,
                    correo,
                    telefono1,
                    telefono2,
                    rh,
                    ficha,
                    observacion,
                    foto,
                    rol,
                    estado
                }
            );
            // Consultar el usuario actualizado para devolver la foto en base64
            const usuarioActualizado = await usuarioModel.getUsuarioById(req.params.id);
            res.json({
                message: 'Usuario actualizado exitosamente',
                usuario: usuarioActualizado
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

            // Actualizar último acceso
            await usuarioModel.updateUltimoAcceso(usuario.id);

            // No enviar la contraseña en la respuesta
            const usuarioResponse = {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                documento: usuario.documento,
                tipo_documento: usuario.tipo_documento,
                rol: usuario.rol,
                telefono1: usuario.telefono1,
                telefono2: usuario.telefono2,
                rh: usuario.rh,
                ficha: usuario.ficha,
                observacion: usuario.observacion,
                foto: usuario.foto,
                fecha_registro: usuario.fecha_registro,
                estado: usuario.estado
            };

            res.json({
                message: 'Login exitoso',
                usuario: usuarioResponse
            });
        } catch (error) {
            console.error('Error en login:', error); // Debug
            res.status(500).json({ 
                error: 'Error en el login',
                details: error.message 
            });
        }
    },

    // Registro en dos pasos
    registerStep1: async (req, res) => {
        try {
            const { nombre, correo, documento, tipo_documento, contrasena } = req.body;

            // Validar campos obligatorios
            if (!nombre || !correo || !documento || !tipo_documento || !contrasena) {
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

            // Crear usuario solo con los datos básicos, el resto null
            const newUsuario = await usuarioModel.createUsuario({
                nombre,
                correo,
                documento,
                tipo_documento,
                contrasena: hashedPassword,
                rol: 'pendiente', // Valor temporal para cumplir NOT NULL
                telefono1: null,
                telefono2: null,
                rh: null,
                ficha: null,
                observacion: null,
                foto: null
            });

            res.status(201).json({
                message: 'Primer paso de registro exitoso',
                usuario: {
                    id: newUsuario.id,
                    nombre: newUsuario.nombre,
                    correo: newUsuario.correo
                }
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error en el primer paso de registro',
                details: error.message 
            });
        }
    },

    registerStep2: async (req, res) => {
        try {
            const { id } = req.params;
            const { rol, telefono1, telefono2, rh, ficha, observacion, foto } = req.body;

            // Validar campos obligatorios
            if (!rol) {
                return res.status(400).json({ error: 'El rol es obligatorio' });
            }

            // Si es aprendiz, ficha es obligatoria
            if (rol === 'aprendiz' && !ficha) {
                return res.status(400).json({ error: 'El número de ficha es obligatorio para aprendices' });
            }

            // Verificar que el usuario exista
            const usuarioExistente = await usuarioModel.getUsuarioById(id);
            if (!usuarioExistente) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Actualizar usuario con los datos adicionales, incluyendo el rol
            const updatedUsuario = await usuarioModel.updateUsuario(id, {
                nombre: null, // No se actualiza
                correo: null, // No se actualiza
                telefono1,
                telefono2,
                rh,
                ficha,
                observacion,
                foto,
                rol // <-- ahora sí se actualiza el rol
            });

            res.json({
                message: 'Segundo paso de registro exitoso',
                usuario: {
                    id: updatedUsuario.id,
                    nombre: updatedUsuario.nombre,
                    correo: updatedUsuario.correo,
                    rol: updatedUsuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error en el segundo paso de registro',
                details: error.message 
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { actual, nueva } = req.body;
            const id = req.params.id;
            if (!actual || !nueva) {
                return res.status(400).json({ error: 'Debes enviar la contraseña actual y la nueva.' });
            }
            const usuario = await usuarioModel.getUsuarioById(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            const contrasenaValida = await bcrypt.compare(actual, usuario.contrasena);
            if (!contrasenaValida) {
                return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nueva, salt);
            await usuarioModel.updateUsuario(id, { contrasena: hashedPassword });
            res.json({ message: 'Contraseña actualizada exitosamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al cambiar la contraseña', details: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { correo } = req.body;
            if (!correo) return res.status(400).json({ error: 'Correo requerido' });
            const usuario = await usuarioModel.getUsuarioByEmail(correo);
            if (!usuario) return res.status(404).json({ error: 'No existe un usuario con ese correo' });
            // Generar token seguro y temporal
            const token = crypto.randomBytes(32).toString('hex');
            // Guardar token en memoria (en producción usar DB o Redis) con expiración
            passwordResetTokens[token] = { id: usuario.id, expires: Date.now() + 1000 * 60 * 30 };
            // Enlace de recuperación
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
            // Enviar correo
            await transporter.sendMail({
                from: process.env.MAIL_FROM || 'no-reply@compuscan.com',
                to: correo,
                subject: 'Recuperación de contraseña - CompuSCan',
                html: `<p>Hola ${usuario.nombre},</p>
<p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Si no solicitaste este cambio, ignora este correo.</p>
<p>CompuSCan</p>`
            });
            res.json({ message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
        } catch (error) {
            res.status(500).json({ error: 'Error enviando el correo de recuperación', details: error.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, nueva } = req.body;
            if (!token || !nueva) return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
            const data = passwordResetTokens[token];
            if (!data || data.expires < Date.now()) return res.status(400).json({ error: 'Token inválido o expirado' });
            const usuario = await usuarioModel.getUsuarioById(data.id);
            if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nueva, salt);
            await usuarioModel.updateUsuario(data.id, { contrasena: hashedPassword });
            delete passwordResetTokens[token];
            res.json({ message: 'Contraseña restablecida exitosamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al restablecer la contraseña', details: error.message });
        }
    }
};

module.exports = usuarioController;