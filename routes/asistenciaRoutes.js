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

module.exports = router;