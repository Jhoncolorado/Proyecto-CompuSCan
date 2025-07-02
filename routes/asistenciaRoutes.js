const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const upload = require('../middleware/upload');

router.post('/', asistenciaController.registrarAsistencia);
router.get('/por-ficha', asistenciaController.getAsistenciasPorFicha);
router.get('/aprendices/instructor/:id_instructor', asistenciaController.getAprendicesPorInstructor);
router.get('/por-ficha-fecha', asistenciaController.getAsistenciasPorFichaYFecha);
router.get('/estadisticas', asistenciaController.getEstadisticasPorFicha);
router.get('/historial', asistenciaController.getHistorialPorFicha);
router.get('/aprendices/ficha/:id_ficha', asistenciaController.getAprendicesPorFicha);
router.put('/:id', upload.single('evidencia'), asistenciaController.editarAsistencia);
router.post('/marcar-salida', async (req, res) => {
  try {
    const { id_usuario, id_ficha, fecha } = req.body;
    const pool = require('../config/database');
    const result = await pool.query(
      `UPDATE asistencia SET hora_salida = NOW() WHERE id_usuario = $1 AND id_ficha = $2 AND fecha = $3 RETURNING *`,
      [id_usuario, id_ficha, fecha]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de asistencia no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar salida', details: error.message });
  }
});

module.exports = router; 