const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

// Ruta para obtener todas las alertas (GET /api/alertas)
router.get('/', alertaController.getAllAlertas);

// Ruta para obtener una alerta específica por ID (GET /api/alertas/:id)
router.get('/:id', alertaController.getAlertaById);

// Ruta para crear una nueva alerta (POST /api/alertas)
router.post('/', alertaController.createAlerta);

// Ruta para actualizar una alerta (PUT /api/alertas/:id)
router.put('/:id', alertaController.updateAlerta);

// Ruta para eliminar una alerta (DELETE /api/alertas/:id)
router.delete('/:id', alertaController.deleteAlerta);

module.exports = router;