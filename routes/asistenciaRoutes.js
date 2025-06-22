const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

router.post('/', asistenciaController.registrarAsistencia);
router.get('/por-ficha', asistenciaController.getAsistenciasPorFicha);
router.get('/aprendices/:id_instructor', asistenciaController.getAprendicesPorInstructor);
router.get('/por-ficha-fecha', asistenciaController.getAsistenciasPorFichaYFecha);

module.exports = router; 