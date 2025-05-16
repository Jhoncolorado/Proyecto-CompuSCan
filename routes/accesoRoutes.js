const express = require('express');
const router = express.Router();
const historialDispositivoModel = require('../models/historialDispositivoModel');
const pool = require('../config/db');

// Endpoint para acceso por RFID
router.get('/rfid/:rfid', async (req, res) => {
  try {
    const { rfid } = req.params;
    console.log('[ACCESO] Tarjeta RFID leída:', rfid);

    // Obtener dispositivo
    const dispositivo = await require('../models/dispositivoModel').getDispositivoByRFID(rfid);
    if (!dispositivo) {
      console.log('[ACCESO] No se encontró dispositivo con RFID:', rfid);
      return res.status(404).json({ message: 'No se encontró un dispositivo con ese RFID' });
    }
    console.log('[ACCESO] Dispositivo encontrado:', dispositivo.nombre);

    // Obtener usuario
    const usuario = await require('../models/usuarioModel').getUsuarioById(dispositivo.id_usuario);
    console.log('[ACCESO] Usuario encontrado:', usuario.nombre);

    // Obtener el último evento del dispositivo para determinar si es entrada o salida
    const ultimoEvento = await pool.query(
      'SELECT descripcion FROM historial_dispositivo WHERE id_dispositivo = $1 ORDER BY fecha_hora DESC LIMIT 1',
      [dispositivo.id]
    );

    let tipoEvento = 'ENTRADA';
    if (ultimoEvento.rows.length > 0) {
      const ultimaDescripcion = ultimoEvento.rows[0].descripcion;
      if (ultimaDescripcion.includes('Acceso autorizado: ENTRADA')) tipoEvento = 'SALIDA';
      else if (ultimaDescripcion.includes('Acceso autorizado: SALIDA')) tipoEvento = 'ENTRADA';
      // Si no contiene ninguna, por defecto será ENTRADA
    }

    const descripcion = `Acceso autorizado: ${tipoEvento} - RFID: ${rfid} - Usuario: ${usuario.nombre}`;

    // Registrar el evento en el historial directamente con pool
    try {
      const result = await pool.query(
        'INSERT INTO historial_dispositivo (descripcion, id_dispositivo) VALUES ($1, $2) RETURNING *',
        [descripcion, dispositivo.id]
      );
      console.log(`[HISTORIAL] ${descripcion}`);
    } catch (historialError) {
      console.error('[HISTORIAL] Error al registrar evento:', historialError);
    }

    // Log de acceso autorizado
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