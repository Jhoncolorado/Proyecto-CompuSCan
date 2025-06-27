const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../config/mailer');

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

async function sendRegistroExitosoEmail(email, nombre) {
  await transporter.sendMail({
    from: 'CompuSCan <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: '¡Registro exitoso en CompuSCan!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <!-- Logo institucional (descomenta y pon tu URL real si quieres mostrarlo)
        <img src=\"logo-compSCan.png.png\" alt=\"CompuSCan\" style=\"height: 48px; margin-bottom: 16px;\" />
        -->
        <h2 style="color: #388e3c;">¡Bienvenido/a, ${nombre}!</h2>
        <p>Tu registro en <b>CompuSCan</b> fue exitoso.</p>
        <p>Ya puedes iniciar sesión y gestionar tus dispositivos en la plataforma.</p>
        <a href="http://localhost:5173/login" style="display:inline-block;padding:10px 20px;background:#388e3c;color:#fff;text-decoration:none;border-radius:5px;margin:16px 0;">Iniciar sesión</a>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 18px 0;">
        <p style="color: #888; font-size: 13px;">
          ¿Tienes dudas? Responde a este correo o contacta a nuestro equipo de soporte.<br>
          Si no reconoces este registro, ignora este mensaje.<br>
          Nunca compartas tu contraseña con nadie.
        </p>
        <div style="margin-top: 18px; color: #888; font-size: 12px;">
          <b>Equipo CompuSCan</b><br>
          https://compuscan.com
        </div>
      </div>
    `
  });
}

const usuarioController = {
    getAllUsuarios: async (req, res) => {
        try {
            // Soporte de paginación y filtros
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;
            const { estado, todos } = req.query;

            let usuarios = [];
            let total = 0;
            let totalPages = 1;

            if (todos === 'true') {
                // Traer todos los usuarios (activos y deshabilitados)
                usuarios = await usuarioModel.getAllUsuarios();
                total = usuarios.length;
                totalPages = 1;
                return res.json({ data: usuarios, total, page: 1, totalPages, limit: usuarios.length });
            } else if (estado) {
                // Traer solo usuarios por estado
                usuarios = await usuarioModel.getUsuariosByEstado(estado, limit, offset);
                total = await usuarioModel.countUsuariosByEstado(estado);
                totalPages = Math.ceil(total / limit);
                return res.json({ data: usuarios, total, page, totalPages, limit });
            } else {
                // Paginación normal (solo activos)
                usuarios = await usuarioModel.getUsuariosPaginados(limit, offset);
                total = await usuarioModel.countUsuarios();
                totalPages = Math.ceil(total / limit);
                return res.json({ data: usuarios, total, page, totalPages, limit });
            }
        } catch (error) {
            console.error('Error en getAllUsuarios:', error);
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
            console.error('Error en getUsuarioById:', error);
            res.status(500).json({ 
                error: 'Error al obtener usuario',
                details: error.message 
            });
        }
    },

    createUsuario: async (req, res) => {
        try {
            let { 
                nombre, correo, documento, tipo_documento, 
                contrasena, rol, telefono1, telefono2, 
                rh, ficha, id_ficha, observacion, foto, programa, id_programa, estado
            } = req.body;

            // Validar campos obligatorios
            if (!nombre || !correo || !documento || !tipo_documento || !contrasena || !rol) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            // --- Validación de fuerza de contraseña ---
            const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            if (!strongPassword.test(contrasena)) {
                return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.' });
            }
            // -----------------------------------------

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

            // Mapeo robusto de ficha/programa
            let idFichaFinal = id_ficha || ficha || null;
            let idProgramaFinal = id_programa || programa || null;
            if (idFichaFinal !== null && idFichaFinal !== undefined) idFichaFinal = parseInt(idFichaFinal, 10);
            if (idProgramaFinal !== null && idProgramaFinal !== undefined) idProgramaFinal = parseInt(idProgramaFinal, 10);

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
                id_ficha: idFichaFinal,
                observacion,
                foto: fotoProcesada,
                id_programa: idProgramaFinal,
                estado: estado || 'activo'
            });

            // Enviar correo de registro exitoso
            try {
              await sendRegistroExitosoEmail(newUsuario.correo, newUsuario.nombre);
            } catch (mailError) {
              console.error('Error enviando correo de registro:', mailError);
            }

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
            console.error('Error en createUsuario:', error);
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
            console.error('Error en updateUsuario:', error);
            res.status(500).json({ 
                error: 'Error al actualizar usuario',
                details: error.message
            });
        }
    },

    deleteUsuario: async (req, res) => {
        try {
            // Cambiar estado a 'deshabilitado' en vez de borrar
            const updated = await usuarioModel.updateUsuario(req.params.id, { estado: 'deshabilitado' });
            if (!updated) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario deshabilitado correctamente' });
        } catch (error) {
            console.error('Error en deleteUsuario:', error);
            res.status(500).json({ 
                error: 'Error al deshabilitar usuario',
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

            // --- VALIDACIÓN DE ESTADO DEL USUARIO ---
            if (usuario.estado !== 'activo') {
                return res.status(403).json({ error: 'Usuario deshabilitado, acceso denegado' });
            }
            // ----------------------------------------

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
    },

    habilitarUsuario: async (req, res) => {
        try {
            const updated = await usuarioModel.updateUsuario(req.params.id, { estado: 'activo' });
            if (!updated) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario habilitado correctamente', usuario: updated });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al habilitar usuario',
                details: error.message 
            });
        }
    },

    // Obtener usuario por documento (para QR y perfil público)
    getUsuarioByDocument: async (req, res) => {
        try {
            const { documento } = req.params;
            const usuario = await usuarioModel.getUsuarioByDocument(documento);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Manejo robusto de la foto para todos los casos
            if (usuario.foto) {
                if (typeof usuario.foto === 'string') {
                    if (!usuario.foto.startsWith('data:image')) {
                        usuario.foto = 'data:image/jpeg;base64,' + usuario.foto;
                    }
                } else if (Buffer.isBuffer(usuario.foto)) {
                    usuario.foto = 'data:image/jpeg;base64,' + usuario.foto.toString('base64');
                }
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuario por documento', details: error.message });
        }
    }
};

module.exports = usuarioController;