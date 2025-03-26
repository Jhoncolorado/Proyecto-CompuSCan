const express = require('express');
const router = express.Router();
const historialDispositivoController = require('../controllers/historialDispositivoController');

/**
 * @swagger
 * /api/historiales:
 *   get:
 *     summary: Obtener todos los historiales de dispositivos
 *     tags: [Historiales]
 *     responses:
 *       200:
 *         description: Lista de historiales obtenida exitosamente
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
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                   dispositivo:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       serial:
 *                         type: string
 */
router.get('/', historialDispositivoController.getAllHistoriales);

/**
 * @swagger
 * /api/historiales/{id}:
 *   get:
 *     summary: Obtener un historial específico por ID
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descripcion:
 *                   type: string
 *                 fecha_registro:
 *                   type: string
 *                   format: date-time
 *                 dispositivo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     serial:
 *                       type: string
 *       404:
 *         description: Historial no encontrado
 */
router.get('/:id', historialDispositivoController.getHistorialById);

/**
 * @swagger
 * /api/historiales:
 *   post:
 *     summary: Crear un nuevo historial
 *     tags: [Historiales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - id_dispositivo
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento o cambio
 *               id_dispositivo:
 *                 type: integer
 *                 description: ID del dispositivo asociado
 *     responses:
 *       201:
 *         description: Historial creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 historial:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descripcion:
 *                       type: string
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                     dispositivo:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nombre:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                         serial:
 *                           type: string
 *       400:
 *         description: Datos inválidos o faltantes
 */
router.post('/', historialDispositivoController.createHistorial);

/**
 * @swagger
 * /api/historiales/{id}:
 *   put:
 *     summary: Actualizar un historial existente
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del evento o cambio
 *               id_dispositivo:
 *                 type: integer
 *                 description: Nuevo ID del dispositivo asociado
 *     responses:
 *       200:
 *         description: Historial actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 historial:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descripcion:
 *                       type: string
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                     dispositivo:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nombre:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                         serial:
 *                           type: string
 *       404:
 *         description: Historial no encontrado
 *       400:
 *         description: Datos inválidos
 */
router.put('/:id', historialDispositivoController.updateHistorial);

/**
 * @swagger
 * /api/historiales/{id}:
 *   delete:
 *     summary: Eliminar un historial
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial a eliminar
 *     responses:
 *       200:
 *         description: Historial eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Historial no encontrado
 */
router.delete('/:id', historialDispositivoController.deleteHistorial);

/**
 * @swagger
 * /api/historiales/dispositivo/{dispositivo_id}:
 *   get:
 *     summary: Obtener todos los historiales de un dispositivo específico
 *     tags: [Historiales]
 *     parameters:
 *       - in: path
 *         name: dispositivo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Lista de historiales del dispositivo obtenida exitosamente
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
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                   dispositivo:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       serial:
 *                         type: string
 */
router.get('/dispositivo/:dispositivo_id', historialDispositivoController.getHistorialesByDispositivo);

module.exports = router;