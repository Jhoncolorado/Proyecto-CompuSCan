const express = require('express');
const router = express.Router();
const historialDispositivoController = require('../controllers/historialDispositivoController');

// Rutas para historial de dispositivos
router.get('/', historialDispositivoController.getAllHistorialDispositivos);
router.get('/:id', historialDispositivoController.getHistorialDispositivoById);
router.post('/', historialDispositivoController.createHistorialDispositivo);
router.put('/:id', historialDispositivoController.updateHistorialDispositivo);
router.delete('/:id', historialDispositivoController.deleteHistorialDispositivo);

module.exports = router;