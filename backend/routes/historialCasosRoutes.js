const express = require('express');
const router = express.Router();
const historialCasosController = require('../controllers/historialCasosController');

router.get('/', historialCasosController.getAllHistorialCasos);
router.get('/:id', historialCasosController.getHistorialCasoById);
router.post('/', historialCasosController.createHistorialCaso);
router.put('/:id', historialCasosController.updateHistorialCaso);
router.delete('/:id', historialCasosController.deleteHistorialCaso);

module.exports = router;