const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/historiales - Obtener todos los registros de historial
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        h.id_historial,
        h.fecha_hora,
        h.descripcion,
        d.nombre as dispositivo_nombre,
        d.serial as dispositivo_serial
      FROM historial_dispositivo h
      LEFT JOIN dispositivo d ON h.id_dispositivo = d.id_dispositivo
      ORDER BY h.fecha_hora DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

// POST /api/historiales/test - Crear registros de prueba
router.post('/test', async (req, res) => {
  try {
    // Primero obtenemos algunos dispositivos existentes
    const dispositivos = await pool.query('SELECT id_dispositivo FROM dispositivo LIMIT 3');
    
    if (dispositivos.rows.length === 0) {
      return res.status(400).json({ error: 'No hay dispositivos registrados para crear historial de prueba' });
    }

    // Creamos algunos registros de prueba
    const registrosPrueba = [
      {
        descripcion: 'Acceso autorizado al laboratorio',
        id_dispositivo: dispositivos.rows[0].id_dispositivo
      },
      {
        descripcion: 'Registro de dispositivo',
        id_dispositivo: dispositivos.rows[0].id_dispositivo
      },
      {
        descripcion: 'Validación de dispositivo completada',
        id_dispositivo: dispositivos.rows[1]?.id_dispositivo
      },
      {
        descripcion: 'Actualización de información del dispositivo',
        id_dispositivo: dispositivos.rows[2]?.id_dispositivo
      }
    ];

    // Insertamos los registros
    for (const registro of registrosPrueba) {
      await pool.query(
        'INSERT INTO historial_dispositivo (fecha_hora, descripcion, id_dispositivo) VALUES (NOW(), $1, $2)',
        [registro.descripcion, registro.id_dispositivo]
      );
    }

    res.json({ message: 'Registros de prueba creados exitosamente' });
  } catch (error) {
    console.error('Error al crear registros de prueba:', error);
    res.status(500).json({ error: 'Error al crear registros de prueba' });
  }
});

module.exports = router; 