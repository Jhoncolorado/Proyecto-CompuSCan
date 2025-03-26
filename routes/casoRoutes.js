const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       required:
 *         - tipo_reporte
 *         - id_historial
 *       properties:
 *         id_caso:
 *           type: integer
 *           description: ID único del caso
 *         tipo_reporte:
 *           type: string
 *           enum: [Robo, Perdida, Dañado, Otro]
 *           description: Tipo de reporte del caso (debe ser exactamente Robo, Perdida, Dañado u Otro)
 *         id_historial:
 *           type: integer
 *           description: ID del historial del dispositivo asociado
 *         estado:
 *           type: string
 *           enum: [Abierto, En proceso, Cerrado, Archivado]
 *           default: Abierto
 *           description: Estado actual del caso
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del reporte (se genera automáticamente)
 */

/**
 * @swagger
 * /api/casos:
 *   get:
 *     summary: Obtiene todos los casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       500:
 *         description: Error del servidor
 */
router.get('/', casoController.getAllCasos);

/**
 * @swagger
 * /api/casos/{id}:
 *   get:
 *     summary: Obtiene un caso por su ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del caso
 *     responses:
 *       200:
 *         description: Caso encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', casoController.getCasoById);

/**
 * @swagger
 * /api/casos/historial/{historial_id}:
 *   get:
 *     summary: Obtiene todos los casos asociados a un historial
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: historial_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Lista de casos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       500:
 *         description: Error del servidor
 */
router.get('/historial/:historial_id', casoController.getCasosByHistorial);

/**
 * @swagger
 * /api/casos:
 *   post:
 *     summary: Crea un nuevo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_reporte
 *               - id_historial
 *             properties:
 *               tipo_reporte:
 *                 type: string
 *                 enum: [Robo, Perdida, Dañado, Otro]
 *                 description: Debe ser exactamente Robo, Perdida, Dañado u Otro (respetando mayúsculas)
 *               id_historial:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [Abierto, En proceso, Cerrado, Archivado]
 *                 default: Abierto
 *     responses:
 *       201:
 *         description: Caso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       500:
 *         description: Error del servidor
 */
router.post('/', casoController.createCaso);

/**
 * @swagger
 * /api/casos/{id}:
 *   put:
 *     summary: Actualiza un caso existente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del caso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_reporte:
 *                 type: string
 *                 enum: [Robo, Perdida, Dañado, Otro]
 *                 description: Debe ser exactamente Robo, Perdida, Dañado u Otro (respetando mayúsculas)
 *               id_historial:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [Abierto, En proceso, Cerrado, Archivado]
 *     responses:
 *       200:
 *         description: Caso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Caso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', casoController.updateCaso);

/**
 * @swagger
 * /api/casos/{id}:
 *   delete:
 *     summary: Elimina un caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del caso a eliminar
 *     responses:
 *       200:
 *         description: Caso eliminado exitosamente
 *       404:
 *         description: Caso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', casoController.deleteCaso);

module.exports = router;