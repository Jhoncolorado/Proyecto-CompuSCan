const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');

/**
 * @swagger
 * /api/dispositivos:
 *   post:
 *     summary: Crear un nuevo dispositivo
 *     tags: [Dispositivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - serial
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del dispositivo
 *               tipo:
 *                 type: string
 *                 description: Tipo de dispositivo (ej. laptop, tablet, etc.)
 *               serial:
 *                 type: string
 *                 description: Número de serie único del dispositivo
 *               foto:
 *                 type: string
 *                 format: byte
 *                 description: Foto del dispositivo en formato base64
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *       400:
 *         description: Datos inválidos o dispositivo ya existe
 */
router.post('/', dispositivoController.createDispositivo);

/**
 * @swagger
 * /api/dispositivos:
 *   get:
 *     summary: Obtener todos los dispositivos
 *     tags: [Dispositivos]
 *     responses:
 *       200:
 *         description: Lista de dispositivos
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
 *                   tipo:
 *                     type: string
 *                   serial:
 *                     type: string
 *                   foto:
 *                     type: string
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 */
router.get('/', dispositivoController.getAllDispositivos);

/**
 * @swagger
 * /api/dispositivos/{id}:
 *   get:
 *     summary: Obtener un dispositivo por ID
 *     tags: [Dispositivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', dispositivoController.getDispositivoById);

/**
 * @swagger
 * /api/dispositivos/{id}:
 *   put:
 *     summary: Actualizar un dispositivo
 *     tags: [Dispositivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               serial:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: byte
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 *       400:
 *         description: Datos inválidos
 */
router.put('/:id', dispositivoController.updateDispositivo);

/**
 * @swagger
 * /api/dispositivos/{id}:
 *   delete:
 *     summary: Eliminar un dispositivo
 *     tags: [Dispositivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo eliminado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 */
router.delete('/:id', dispositivoController.deleteDispositivo);

module.exports = router;