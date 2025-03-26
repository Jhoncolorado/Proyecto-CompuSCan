const express = require('express');
const router = express.Router();
const historialAlertaController = require('../controllers/historialAlertaController');

/**
 * @swagger
 * /api/historial-alertas:
 *   get:
 *     summary: Obtiene todo el historial de alertas
 *     tags: [Historial de Alertas]
 *     responses:
 *       200:
 *         description: Lista de historial de alertas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_alerta:
 *                     type: integer
 *                   id_dispositivo:
 *                     type: integer
 *                   fecha_hora:
 *                     type: string
 *                     format: date-time
 *                   tipo_alerta:
 *                     type: string
 *                   descripcion_alerta:
 *                     type: string
 *                   nombre_dispositivo:
 *                     type: string
 *                   serial:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/', historialAlertaController.getAllHistorialAlertas);

/**
 * @swagger
 * /api/historial-alertas:
 *   post:
 *     summary: Crea un nuevo registro en el historial de alertas
 *     tags: [Historial de Alertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_alerta
 *               - id_dispositivo
 *             properties:
 *               id_alerta:
 *                 type: integer
 *                 description: ID de la alerta
 *               id_dispositivo:
 *                 type: integer
 *                 description: ID del dispositivo
 *     responses:
 *       201:
 *         description: Registro de historial creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Alerta o dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', historialAlertaController.createHistorialAlerta);

/**
 * @swagger
 * /api/historial-alertas/dispositivo/{dispositivo_id}:
 *   get:
 *     summary: Obtiene el historial de alertas de un dispositivo específico
 *     tags: [Historial de Alertas]
 *     parameters:
 *       - in: path
 *         name: dispositivo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Lista de historial de alertas del dispositivo obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/dispositivo/:dispositivo_id', historialAlertaController.getHistorialByDispositivo);

/**
 * @swagger
 * /api/historial-alertas/alerta/{alerta_id}:
 *   get:
 *     summary: Obtiene el historial de una alerta específica
 *     tags: [Historial de Alertas]
 *     parameters:
 *       - in: path
 *         name: alerta_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     responses:
 *       200:
 *         description: Lista de historial de la alerta obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/alerta/:alerta_id', historialAlertaController.getHistorialByAlerta);

/**
 * @swagger
 * /api/historial-alertas/{id}:
 *   get:
 *     summary: Obtiene un registro específico del historial de alertas
 *     tags: [Historial de Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de historial
 *     responses:
 *       200:
 *         description: Registro de historial encontrado exitosamente
 *       404:
 *         description: Registro de historial no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', historialAlertaController.getHistorialAlertaById);

/**
 * @swagger
 * /api/historial-alertas/{id}:
 *   delete:
 *     summary: Elimina un registro del historial de alertas
 *     tags: [Historial de Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de historial
 *     responses:
 *       200:
 *         description: Registro de historial eliminado exitosamente
 *       404:
 *         description: Registro de historial no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', historialAlertaController.deleteHistorialAlerta);

module.exports = router;