const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

/**
 * @swagger
 * /api/programas:
 *   get:
 *     summary: Obtener todos los programas
 *     tags: [Programas]
 *     responses:
 *       200:
 *         description: Lista de programas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre_programa:
 *                     type: string
 *                   fecha_creacion:
 *                     type: string
 *                     format: date
 *                   fecha_actualizacion:
 *                     type: string
 *                     format: date
 */
router.get('/', programaController.getAllProgramas);

/**
 * @swagger
 * /api/programas/{id}:
 *   get:
 *     summary: Obtener un programa específico por ID
 *     tags: [Programas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Programa encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre_programa:
 *                   type: string
 *                 fecha_creacion:
 *                   type: string
 *                   format: date
 *                 fecha_actualizacion:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Programa no encontrado
 */
router.get('/:id', programaController.getProgramaById);

/**
 * @swagger
 * /api/programas:
 *   post:
 *     summary: Crear un nuevo programa
 *     tags: [Programas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_programa
 *             properties:
 *               nombre_programa:
 *                 type: string
 *                 description: Nombre del programa
 *     responses:
 *       201:
 *         description: Programa creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 programa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre_programa:
 *                       type: string
 *                     fecha_creacion:
 *                       type: string
 *                       format: date
 *                     fecha_actualizacion:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Datos inválidos
 */
router.post('/', programaController.createPrograma);

/**
 * @swagger
 * /api/programas/{id}:
 *   put:
 *     summary: Actualizar un programa existente
 *     tags: [Programas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_programa:
 *                 type: string
 *                 description: Nuevo nombre del programa
 *     responses:
 *       200:
 *         description: Programa actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 programa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre_programa:
 *                       type: string
 *                     fecha_creacion:
 *                       type: string
 *                       format: date
 *                     fecha_actualizacion:
 *                       type: string
 *                       format: date
 *       404:
 *         description: Programa no encontrado
 *       400:
 *         description: Datos inválidos
 */
router.put('/:id', programaController.updatePrograma);

/**
 * @swagger
 * /api/programas/{id}:
 *   delete:
 *     summary: Eliminar un programa
 *     tags: [Programas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa a eliminar
 *     responses:
 *       200:
 *         description: Programa eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       404:
 *         description: Programa no encontrado
 */
router.delete('/:id', programaController.deletePrograma);

module.exports = router;