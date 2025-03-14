const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertasController');

router.get('/', alertasController.getAllAlertas);
router.get('/:id', alertasController.getAlertaById);
router.post('/', alertasController.createAlerta);
router.put('/:id', alertasController.updateAlerta);
router.delete('/:id', alertasController.deleteAlerta);

module.exports = router;