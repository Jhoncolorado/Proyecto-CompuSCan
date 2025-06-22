const express = require('express');
const router = express.Router();
const historialDispositivoModel = require('../models/historialDispositivoModel');
const pool = require('../config/database');

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

    // Buscar si hay registro abierto (sin salida) para este usuario/dispositivo
    const registroAbierto = await pool.query(
      'SELECT * FROM historial_dispositivo WHERE id_dispositivo = $1 AND fecha_hora_salida IS NULL ORDER BY id_historial DESC LIMIT 1',
      [dispositivo.id]
    );

    let tipoEvento = 'ENTRADA';
    let mensaje = '';
    if (registroAbierto.rows.length === 0) {
      // No hay entrada abierta, registrar ENTRADA
      await pool.query(
        'INSERT INTO historial_dispositivo (id_dispositivo, fecha_hora_entrada, fecha_hora_salida, descripcion) VALUES ($1, NOW(), NULL, $2)',
        [dispositivo.id, `Acceso autorizado: ENTRADA - RFID: ${rfid} - Usuario: ${usuario.nombre}`]
      );
      // Registrar asistencia automática (solo si el usuario tiene ficha)
      console.log('[ACCESO] Intentando registrar asistencia automática para usuario:', usuario.id, 'ficha:', usuario.id_ficha);
      if (usuario.id_ficha) {
        const hoy = new Date().toISOString().slice(0, 10);
        // Evitar duplicados: solo si no existe ya asistencia para hoy
        const existe = await pool.query(
          'SELECT 1 FROM asistencia WHERE id_usuario = $1 AND fecha = $2',
          [usuario.id, hoy]
        );
        console.log('[ACCESO] ¿Ya existe asistencia para hoy?', existe.rows.length);
        if (existe.rows.length === 0) {
          await require('../models/asistenciaModel').registrarAsistencia({
            id_usuario: usuario.id,
            id_ficha: usuario.id_ficha,
            fecha: hoy,
            estado: 'presente',
            tipo: 'rfid',
          });
          console.log('[ACCESO] Asistencia automática registrada para usuario:', usuario.id);
        }
      }
      tipoEvento = 'ENTRADA';
      mensaje = 'Entrada registrada';
    } else {
      // Hay entrada abierta, registrar SALIDA
      await pool.query(
        'UPDATE historial_dispositivo SET fecha_hora_salida = NOW(), descripcion = $1 WHERE id_historial = $2',
        [`Acceso autorizado: SALIDA - RFID: ${rfid} - Usuario: ${usuario.nombre}`, registroAbierto.rows[0].id_historial]
      );
      tipoEvento = 'SALIDA';
      mensaje = 'Salida registrada';
    }

    res.json({ 
      usuario, 
      dispositivo,
      tipoEvento,
      mensaje
    });
  } catch (error) {
    console.error('[ERROR] Error en acceso RFID:', error);
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

module.exports = router; 