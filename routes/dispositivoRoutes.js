const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');
const pool = require('../config/database');

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
 * /api/dispositivos/pendientes:
 *   get:
 *     summary: Obtener dispositivos sin RFID
 *     tags: [Dispositivos]
 *     responses:
 *       200:
 *         description: Lista de dispositivos sin RFID
 *       500:
 *         description: Error del servidor
 */
router.get('/pendientes', dispositivoController.getDispositivosPendientes);

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

/**
 * @swagger
 * /api/dispositivos/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener dispositivos de un usuario específico
 *     tags: [Dispositivos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de dispositivos del usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:usuarioId', dispositivoController.getDispositivosByUsuario);

router.get('/acceso/rfid/:rfid', async (req, res) => {
  try {
    const { rfid } = req.params;
    const dispositivo = await require('../models/dispositivoModel').getDispositivoByRFID(rfid);
    if (!dispositivo) {
      return res.status(404).json({ message: 'No se encontró un dispositivo con ese RFID' });
    }
    // Trae los datos del usuario asociado
    const usuario = await require('../models/usuarioModel').getUsuarioById(dispositivo.id_usuario);
    res.json({ usuario, dispositivo });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

// Acceso por RFID (nuevo endpoint POST)
router.post('/acceso-rfid', async (req, res) => {
  try {
    const { rfid } = req.body;
    // Buscar el dispositivo por RFID
    const dispositivoRes = await pool.query('SELECT * FROM dispositivo WHERE rfid = $1', [rfid]);
    if (dispositivoRes.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró un dispositivo con ese RFID' });
    }
    const dispositivo = dispositivoRes.rows[0];

    // Buscar el usuario asociado
    const usuarioRes = await pool.query('SELECT * FROM usuario WHERE id = $1', [dispositivo.id_usuario]);
    const usuario = usuarioRes.rows[0];

    // --- Asegurar que las fotos estén en base64 (data:image/...) ---
    if (usuario && usuario.foto) {
      usuario.foto = 'data:image/jpeg;base64,' + Buffer.from(usuario.foto).toString('base64');
    }
    if (dispositivo && dispositivo.foto) {
      const mime = dispositivo.mime_type || dispositivo.mimeType || 'image/jpeg';
      dispositivo.foto = `data:${mime};base64,` + Buffer.from(dispositivo.foto).toString('base64');
    }
    // -------------------------------------------------------------

    // Alternancia ENTRADA/SALIDA
    const ultimoEventoRes = await pool.query(
      'SELECT descripcion FROM historial_dispositivo WHERE id_dispositivo = $1 ORDER BY fecha_hora DESC LIMIT 1',
      [dispositivo.id]
    );
    let tipoEvento = 'ENTRADA';
    if (ultimoEventoRes.rows.length > 0) {
      const ultimaDescripcion = ultimoEventoRes.rows[0].descripcion;
      if (ultimaDescripcion.includes('Acceso autorizado: ENTRADA')) tipoEvento = 'SALIDA';
      else if (ultimaDescripcion.includes('Acceso autorizado: SALIDA')) tipoEvento = 'ENTRADA';
    }
    const descripcion = `Acceso autorizado: ${tipoEvento} - RFID: ${rfid} - Usuario: ${usuario.nombre}`;
    await pool.query(
      'INSERT INTO historial_dispositivo (fecha_hora, descripcion, id_dispositivo) VALUES (NOW(), $1, $2)',
      [descripcion, dispositivo.id]
    );

    console.log(`[ACCESO] ${descripcion} - Dispositivo: ${dispositivo.nombre}`);

    res.json({
      usuario,
      dispositivo,
      tipoEvento,
      mensaje: `Acceso autorizado: ${tipoEvento}`
    });
  } catch (error) {
    console.error('[ERROR] Error en acceso RFID:', error);
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

module.exports = router;