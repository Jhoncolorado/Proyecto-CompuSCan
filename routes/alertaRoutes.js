const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

// Rutas para alertas
router.get('/', alertaController.getAllAlertas);
router.get('/:id', alertaController.getAlertaById);
router.post('/', alertaController.createAlerta);
router.put('/:id', alertaController.updateAlerta);
router.delete('/:id', alertaController.deleteAlerta);

module.exports = router;