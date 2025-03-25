const express = require('express');
const router = express.Router();
const historialAlertaController = require('../controllers/historialAlertaController');

router.post('/', historialAlertaController.createHistorialAlerta);
router.get('/dispositivo/:id_dispositivo', historialAlertaController.getAlertasByDispositivo);

module.exports = router;