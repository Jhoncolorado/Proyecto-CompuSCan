const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

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
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   correo:
 *                     type: string
 *                   documento:
 *                     type: string
 *                   tipo_documento:
 *                     type: string
 *                   rol:
 *                     type: string
 *                   telefono1:
 *                     type: string
 *                   telefono2:
 *                     type: string
 *                   rh:
 *                     type: string
 *                   ficha:
 *                     type: string
 *                   observacion:
 *                     type: string
 *                   foto:
 *                     type: string
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 */
router.get('/', usuarioController.getAllUsuarios);

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
router.get('/:id', usuarioController.getUsuarioById);

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
router.put('/:id', usuarioController.updateUsuario);

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
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;