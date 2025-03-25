const express = require('express');
const router = express.Router();
const historialDispositivoController = require('../controllers/historialDispositivoController');

// Rutas esenciales
router.get('/', historialDispositivoController.getAllHistorialDispositivos); // Para reportes
router.get('/:id', historialDispositivoController.getHistorialDispositivoById); // Para consultas específicas
router.post('/', historialDispositivoController.createHistorialDispositivo); // Para registrar eventos RFID

module.exports = router;