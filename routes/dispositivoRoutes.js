const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');
const pool = require('../config/database');
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

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
router.post('/', authenticate, authorize(['administrador','validador']), upload.array('foto', 3), dispositivoController.createDispositivo);

/**
 * @swagger
 * /api/dispositivos:
 *   get:
 *     summary: Obtener todos los dispositivos (paginado)
 *     tags: [Dispositivos]
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
 *         description: Cantidad de dispositivos por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Lista paginada de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dispositivo'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get('/', authenticate, authorize(['administrador','validador']), dispositivoController.getAllDispositivos);

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
router.get('/pendientes', authenticate, authorize(['administrador','validador']), dispositivoController.getDispositivosPendientes);

/**
 * @swagger
 * /api/dispositivos/pendientes/count:
 *   get:
 *     summary: Obtener la cantidad de dispositivos pendientes (sin RFID asignado)
 *     tags: [Dispositivos]
 *     responses:
 *       200:
 *         description: Cantidad de dispositivos pendientes
 *       500:
 *         description: Error del servidor
 */
router.get('/pendientes/count', authenticate, authorize(['administrador','validador']), async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM dispositivo WHERE rfid IS NULL');
    res.json({ pendientes: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar dispositivos pendientes' });
  }
});

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
router.get('/:id', authenticate, authorize(['administrador','validador']), dispositivoController.getDispositivoById);

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
router.put('/:id', authenticate, authorize(['administrador','validador']), upload.array('foto', 3), dispositivoController.updateDispositivo);

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
router.delete('/:id', authenticate, authorize(['administrador','validador']), dispositivoController.deleteDispositivo);

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
router.get('/usuario/:usuarioId', authenticate, (req, res, next) => {
  if (
    req.user.rol === 'administrador' ||
    req.user.rol === 'validador' ||
    parseInt(req.params.usuarioId) === req.user.id
  ) {
    return dispositivoController.getDispositivosByUsuario(req, res, next);
  }
  return res.status(403).json({ error: 'No tienes permisos para esta acción' });
});

// Acceso por RFID (nuevo endpoint POST)
router.post('/acceso-rfid', async (req, res) => {
  console.log('DEBUG: Entró al endpoint POST /acceso-rfid');
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

    // --- VALIDACIÓN DE ESTADO DEL USUARIO ---
    if (!usuario || usuario.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario deshabilitado, acceso denegado' });
    }
    // ----------------------------------------

    // Buscar el nombre del programa usando usuario.id_programa
    let nombrePrograma = null;
    if (usuario && usuario.id_programa) {
      const programaRes = await pool.query('SELECT nombre_programa FROM programas WHERE id = $1', [usuario.id_programa]);
      if (programaRes.rows.length > 0) {
        nombrePrograma = programaRes.rows[0].nombre_programa;
      }
    }

    // --- Asegurar que las fotos estén en base64 (data:image/...) ---
    if (usuario && usuario.foto) {
      // IMPORTANTE: Esta conversión es necesaria para que el frontend muestre la foto correctamente
      usuario.foto = 'data:image/jpeg;base64,' + Buffer.from(usuario.foto).toString('base64');
    }
    if (dispositivo && dispositivo.foto) {
      try {
        let arr = JSON.parse(dispositivo.foto);
        if (Array.isArray(arr) && Array.isArray(arr[0])) {
          arr = arr[0];
        }
        dispositivo.foto = Array.isArray(arr) ? arr : [arr];
      } catch {
        dispositivo.foto = [dispositivo.foto];
      }
    }
    // -------------------------------------------------------------

    // Alternancia ENTRADA/SALIDA (corregida)
    // 1. Buscar si hay registro abierto (sin salida) para este dispositivo
    const registroAbiertoRes = await pool.query(
      'SELECT * FROM historial_dispositivo WHERE id_dispositivo = $1 AND fecha_hora_salida IS NULL ORDER BY id_historial DESC LIMIT 1',
      [dispositivo.id]
    );
    let tipoEvento = 'ENTRADA';
    let descripcion;
    if (registroAbiertoRes.rows.length === 0) {
      // No hay entrada abierta, registrar ENTRADA
      tipoEvento = 'ENTRADA';
      descripcion = `Acceso autorizado: ENTRADA - RFID: ${rfid} - Usuario: ${usuario.nombre}`;
      await pool.query(
        'INSERT INTO historial_dispositivo (id_dispositivo, fecha_hora_entrada, fecha_hora_salida, descripcion) VALUES ($1, NOW(), NULL, $2)',
        [dispositivo.id, descripcion]
      );
    } else {
      // Hay entrada abierta, registrar SALIDA
      tipoEvento = 'SALIDA';
      descripcion = `Acceso autorizado: SALIDA - RFID: ${rfid} - Usuario: ${usuario.nombre}`;
      await pool.query(
        'UPDATE historial_dispositivo SET fecha_hora_salida = NOW(), descripcion = $1 WHERE id_historial = $2',
        [descripcion, registroAbiertoRes.rows[0].id_historial]
      );
    }

    // Emitir evento de actualización de actividad para el dashboard
    try {
      const { io } = require('../app');
      const dashboardController = require('../controllers/dashboardController');
      if (io) {
        const stats = await dashboardController.getDashboardStatsData();
        io.emit('actividad_actualizada', stats);
      }
    } catch (e) {
      // Si hay error al emitir el evento, solo lo mostramos como error
      console.error('Error al emitir evento actividad_actualizada:', e);
    }

    // Log esencial de acceso autorizado
    console.log(`[ACCESO] ${descripcion} - Dispositivo: ${dispositivo.nombre}`);

    res.json({
      usuario,
      dispositivo,
      nombrePrograma,
      tipoEvento,
      mensaje: `Acceso autorizado: ${tipoEvento}`
    });
  } catch (error) {
    console.error('[ERROR] Error en acceso RFID:', error);
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

// Acceso por RFID (GET, para compatibilidad)
router.get('/acceso/rfid/:rfid', async (req, res) => {
  console.log('DEBUG: Entró al endpoint GET /acceso/rfid/:rfid');
  try {
    const { rfid } = req.params;
    const dispositivo = await require('../models/dispositivoModel').getDispositivoByRFID(rfid);
    if (!dispositivo) {
      return res.status(404).json({ message: 'No se encontró un dispositivo con ese RFID' });
    }
    // Trae los datos del usuario asociado
    const usuario = await require('../models/usuarioModel').getUsuarioById(dispositivo.id_usuario);

    // --- VALIDACIÓN DE ESTADO DEL USUARIO ---
    if (!usuario || usuario.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario deshabilitado, acceso denegado' });
    }
    // ----------------------------------------

    // Buscar el nombre del programa usando usuario.id_programa
    let nombrePrograma = null;
    if (usuario && usuario.id_programa) {
      // NOTA: Aquí usamos pool directamente para obtener el nombre del programa
      const programaRes = await pool.query('SELECT nombre_programa FROM programas WHERE id = $1', [usuario.id_programa]);
      if (programaRes.rows.length > 0) {
        nombrePrograma = programaRes.rows[0].nombre_programa;
      }
    }
    // --- Asegurar que las fotos estén en base64 (data:image/...) ---
    if (usuario && usuario.foto) {
      usuario.foto = 'data:image/jpeg;base64,' + Buffer.from(usuario.foto).toString('base64');
    }
    if (dispositivo && dispositivo.foto) {
      try {
        let arr = JSON.parse(dispositivo.foto);
        if (Array.isArray(arr) && Array.isArray(arr[0])) {
          arr = arr[0];
        }
        dispositivo.foto = Array.isArray(arr) ? arr : [arr];
      } catch {
        dispositivo.foto = [dispositivo.foto];
      }
    }
    // -------------------------------------------------------------
    // Debug: mostrar el nombre del programa antes de responder
    console.log('DEBUG nombrePrograma (GET):', nombrePrograma);
    res.json({ usuario, dispositivo, nombrePrograma });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

module.exports = router;