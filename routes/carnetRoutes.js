const express = require('express');
const router = express.Router();
const carnetController = require('../controllers/carnetController');

/**
 * @swagger
 * /api/carnets:
 *   get:
 *     summary: Obtiene todos los carnets
 *     tags: [Carnets]
 *     responses:
 *       200:
 *         description: Lista de carnets obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_usuario:
 *                     type: integer
 *                   id_programa:
 *                     type: integer
 *                   numero_carnet:
 *                     type: string
 *                   observacion:
 *                     type: string
 *                   fecha_emision:
 *                     type: string
 *                     format: date
 *                   fecha_vencimiento:
 *                     type: string
 *                     format: date
 *                   activo:
 *                     type: boolean
 *                   nombre_usuario:
 *                     type: string
 *                   nombre_programa:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/', carnetController.getAllCarnets);

/**
 * @swagger
 * /api/carnets/{id}:
 *   get:
 *     summary: Obtiene un carnet por su ID
 *     tags: [Carnets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del carnet
 *     responses:
 *       200:
 *         description: Carnet encontrado exitosamente
 *       404:
 *         description: Carnet no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', carnetController.getCarnetById);

/**
 * @swagger
 * /api/carnets/numero/{numero}:
 *   get:
 *     summary: Obtiene un carnet por su número
 *     tags: [Carnets]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número del carnet
 *     responses:
 *       200:
 *         description: Carnet encontrado exitosamente
 *       404:
 *         description: Carnet no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/numero/:numero', carnetController.getCarnetByNumero);

/**
 * @swagger
 * /api/carnets/usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene todos los carnets de un usuario
 *     tags: [Carnets]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de carnets del usuario obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuario_id', carnetController.getCarnetsByUsuario);

/**
 * @swagger
 * /api/carnets:
 *   post:
 *     summary: Crea un nuevo carnet
 *     tags: [Carnets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_programa
 *               - numero_carnet
 *               - fecha_emision
 *               - fecha_vencimiento
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario al que pertenece el carnet
 *               id_programa:
 *                 type: integer
 *                 description: ID del programa asociado al carnet
 *               numero_carnet:
 *                 type: string
 *                 description: Número único del carnet
 *               observacion:
 *                 type: string
 *                 description: Observaciones adicionales sobre el carnet
 *               fecha_emision:
 *                 type: string
 *                 format: date
 *                 description: Fecha de emisión del carnet
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de vencimiento del carnet
 *               activo:
 *                 type: boolean
 *                 description: Estado del carnet (activo/inactivo)
 *     responses:
 *       201:
 *         description: Carnet creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Usuario o programa no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', carnetController.createCarnet);

/**
 * @swagger
 * /api/carnets/{id}:
 *   put:
 *     summary: Actualiza un carnet existente
 *     tags: [Carnets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del carnet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario al que pertenece el carnet
 *               id_programa:
 *                 type: integer
 *                 description: ID del programa asociado al carnet
 *               numero_carnet:
 *                 type: string
 *                 description: Número único del carnet
 *               observacion:
 *                 type: string
 *                 description: Observaciones adicionales sobre el carnet
 *               fecha_emision:
 *                 type: string
 *                 format: date
 *                 description: Fecha de emisión del carnet
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de vencimiento del carnet
 *               activo:
 *                 type: boolean
 *                 description: Estado del carnet (activo/inactivo)
 *     responses:
 *       200:
 *         description: Carnet actualizado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Carnet, usuario o programa no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', carnetController.updateCarnet);

/**
 * @swagger
 * /api/carnets/{id}:
 *   delete:
 *     summary: Elimina un carnet
 *     tags: [Carnets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del carnet
 *     responses:
 *       200:
 *         description: Carnet eliminado exitosamente
 *       404:
 *         description: Carnet no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', carnetController.deleteCarnet);

/**
 * @swagger
 * /api/carnets/check/vencimientos:
 *   post:
 *     summary: Verifica y actualiza el estado de los carnets vencidos
 *     tags: [Carnets]
 *     responses:
 *       200:
 *         description: Verificación completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 carnetsVencidos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_carnet:
 *                         type: integer
 *                       numero_carnet:
 *                         type: string
 *       500:
 *         description: Error del servidor
 */
router.post('/check/vencimientos', carnetController.checkVencimientos);

module.exports = router;