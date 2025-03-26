const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

/**
 * @swagger
 * /api/alertas:
 *   post:
 *     summary: Crear una nueva alerta
 *     tags: [Alertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - dispositivo_id
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada de la alerta
 *               dispositivo_id:
 *                 type: integer
 *                 description: ID del dispositivo relacionado
 *     responses:
 *       201:
 *         description: Alerta creada exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 */
router.post('/', alertaController.createAlerta);

/**
 * @swagger
 * /api/alertas:
 *   get:
 *     summary: Obtener todas las alertas
 *     tags: [Alertas]
 *     responses:
 *       200:
 *         description: Lista de alertas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descripcion:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                   dispositivo_nombre:
 *                     type: string
 *                   dispositivo_serial:
 *                     type: string
 */
router.get('/', alertaController.getAllAlertas);

/**
 * @swagger
 * /api/alertas/{id}:
 *   get:
 *     summary: Obtener una alerta por ID
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     responses:
 *       200:
 *         description: Alerta encontrada
 *       404:
 *         description: Alerta no encontrada
 */
router.get('/:id', alertaController.getAlertaById);

/**
 * @swagger
 * /api/alertas/{id}:
 *   put:
 *     summary: Actualizar una alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               dispositivo_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Alerta actualizada exitosamente
 *       404:
 *         description: Alerta no encontrada
 *       400:
 *         description: Datos inválidos
 */
router.put('/:id', alertaController.updateAlerta);

/**
 * @swagger
 * /api/alertas/{id}:
 *   delete:
 *     summary: Eliminar una alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     responses:
 *       200:
 *         description: Alerta eliminada exitosamente
 *       404:
 *         description: Alerta no encontrada
 */
router.delete('/:id', alertaController.deleteAlerta);

/**
 * @swagger
 * /api/alertas/dispositivo/{dispositivo_id}:
 *   get:
 *     summary: Obtener alertas por dispositivo
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: dispositivo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Lista de alertas del dispositivo
 */
router.get('/dispositivo/:dispositivo_id', alertaController.getAlertasByDispositivo);

/**
 * @swagger
 * /api/alertas/usuario/{usuario_id}:
 *   get:
 *     summary: Obtener alertas por usuario
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de alertas del usuario
 */
router.get('/usuario/:usuario_id', alertaController.getAlertasByUsuario);

module.exports = router;