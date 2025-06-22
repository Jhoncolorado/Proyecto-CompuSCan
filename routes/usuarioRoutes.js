const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', usuarioController.login);

/**
 * @swagger
 * /api/usuarios/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Solicitud de recuperación enviada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/forgot-password', usuarioController.forgotPassword);

/**
 * @swagger
 * /api/usuarios/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - nueva_contrasena
 *               - token
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               nueva_contrasena:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña del usuario
 *               token:
 *                 type: string
 *                 description: Token de recuperación
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/reset-password', usuarioController.resetPassword);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - documento
 *               - tipo_documento
 *               - contrasena
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               documento:
 *                 type: string
 *                 description: Número de documento de identidad
 *               tipo_documento:
 *                 type: string
 *                 description: Tipo de documento (CC, CE, etc.)
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *               rol:
 *                 type: string
 *                 description: Rol del usuario (admin, usuario)
 *               telefono1:
 *                 type: string
 *                 description: Número de teléfono principal
 *               telefono2:
 *                 type: string
 *                 description: Número de teléfono secundario
 *               rh:
 *                 type: string
 *                 description: Tipo de sangre
 *               ficha:
 *                 type: string
 *                 description: Número de ficha del aprendiz
 *               observacion:
 *                 type: string
 *                 description: Observaciones adicionales
 *               foto:
 *                 type: string
 *                 format: byte
 *                 description: Foto del usuario en formato base64
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *       401:
 *         description: No autorizado
 */
router.post('/', usuarioController.createUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios (paginado)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de usuarios por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticate, authorize(['administrador','admin','validador']), usuarioController.getAllUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', authenticate, (req, res, next) => {
  if (
    req.user.rol === 'administrador' ||
    req.user.rol === 'validador' ||
    parseInt(req.params.id) === req.user.id
  ) {
    return usuarioController.getUsuarioById(req, res, next);
  }
  return res.status(403).json({ error: 'No tienes permisos para esta acción' });
});

/**
 * @swagger
 * /api/usuarios/{id}/password:
 *   put:
 *     summary: Cambiar la contraseña de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nueva_contrasena:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/:id/password', usuarioController.changePassword);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               telefono1:
 *                 type: string
 *               telefono2:
 *                 type: string
 *               rh:
 *                 type: string
 *               ficha:
 *                 type: string
 *               observacion:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: byte
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/:id', authenticate, authorize(['administrador','admin','validador']), usuarioController.updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', authenticate, authorize(['administrador','admin','validador']), usuarioController.deleteUsuario);

// Registro en dos pasos
router.post('/register-step1', usuarioController.registerStep1);
router.put('/register-step2/:id', usuarioController.registerStep2);

/**
 * @swagger
 * /api/usuarios/{id}/habilitar:
 *   put:
 *     summary: Habilitar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario habilitado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/:id/habilitar', authenticate, authorize(['administrador','admin','validador']), usuarioController.habilitarUsuario);

// Obtener usuario por documento (para QR y perfil público)
router.get('/documento/:documento', usuarioController.getUsuarioByDocument);

module.exports = router;