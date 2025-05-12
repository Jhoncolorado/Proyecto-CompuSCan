const express = require('express');
const router = express.Router();
const pool = require('../db');

// Función auxiliar para registrar eventos en el historial
const registrarEvento = async (id_dispositivo, descripcion) => {
  try {
    console.log('[HISTORIAL] Intentando registrar evento:', { id_dispositivo, descripcion });
    await pool.query(
      'INSERT INTO historial_dispositivo (fecha_hora, descripcion, id_dispositivo) VALUES (NOW(), $1, $2)',
      [descripcion, id_dispositivo]
    );
    console.log('[HISTORIAL] Evento registrado correctamente');
  } catch (error) {
    console.error('[HISTORIAL] Error al registrar evento en historial:', error);
  }
};

// POST /api/dispositivos - Registrar nuevo dispositivo
router.post('/', async (req, res) => {
  try {
    const { nombre, serial, foto, mime_type, id_usuario } = req.body;
    
    const result = await pool.query(
      'INSERT INTO dispositivo (nombre, serial, foto, mime_type, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_dispositivo',
      [nombre, serial, foto, mime_type, id_usuario]
    );

    // Registrar el evento en el historial
    await registrarEvento(result.rows[0].id_dispositivo, 'Registro de nuevo dispositivo');

    res.status(201).json({ 
      message: 'Dispositivo registrado exitosamente',
      id_dispositivo: result.rows[0].id_dispositivo 
    });
  } catch (error) {
    console.error('Error al registrar dispositivo:', error);
    res.status(500).json({ error: 'Error al registrar el dispositivo' });
  }
});

// PUT /api/dispositivos/:id - Actualizar dispositivo
router.put('/:id', async (req, res) => {
  console.log('[DEBUG] Endpoint PUT /api/dispositivos/:id llamado con id:', req.params.id);
  try {
    const { id } = req.params;
    const { nombre, serial, foto, mime_type } = req.body;

    await pool.query(
      'UPDATE dispositivo SET nombre = $1, serial = $2, foto = $3, mime_type = $4 WHERE id_dispositivo = $5',
      [nombre, serial, foto, mime_type, id]
    );

    // Log de depuración antes de registrar evento
    console.log('[DEBUG] Llamando a registrarEvento con:', id, 'Actualización de información del dispositivo');

    // Registrar el evento en el historial
    await registrarEvento(id, 'Actualización de información del dispositivo');

    res.json({ message: 'Dispositivo actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    res.status(500).json({ error: 'Error al actualizar el dispositivo' });
  }
});

// POST /api/dispositivos/:id/validar - Validar dispositivo
router.post('/:id/validar', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query(
      'UPDATE dispositivo SET estado = $1 WHERE id_dispositivo = $2',
      [estado, id]
    );

    // Registrar el evento en el historial
    await registrarEvento(id, `Validación de dispositivo: ${estado}`);

    res.json({ message: 'Dispositivo validado exitosamente' });
  } catch (error) {
    console.error('Error al validar dispositivo:', error);
    res.status(500).json({ error: 'Error al validar el dispositivo' });
  }
});

// GET /api/dispositivos - Obtener todos los dispositivos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.nombre as usuario_nombre 
      FROM dispositivo d 
      LEFT JOIN usuario u ON d.id_usuario = u.id_usuario
      ORDER BY d.id_dispositivo DESC
    `);
    // Procesar imágenes
    const dispositivos = result.rows.map(d => {
      let foto = d.foto;
      if (foto && d.mime_type) {
        // Si la foto es un buffer, conviértela a base64
        if (Buffer.isBuffer(foto)) {
          foto = `data:${d.mime_type};base64,${foto.toString('base64')}`;
        } else if (typeof foto === 'string' && !foto.startsWith('data:')) {
          // Si ya es string base64 pero sin prefijo
          foto = `data:${d.mime_type};base64,${foto}`;
        }
      }
      return { ...d, foto };
    });
    res.json(dispositivos);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: 'Error al obtener los dispositivos' });
  }
});

module.exports = router; 