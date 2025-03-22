const express = require('express');
const router = express.Router();
const dispositivoController = require('../controllers/dispositivoController');

// Rutas para dispositivos
router.get('/', dispositivoController.getAllDispositivos);
router.get('/:id', dispositivoController.getDispositivoById);
router.post('/', dispositivoController.createDispositivo);
router.put('/:id', dispositivoController.updateDispositivo);
router.delete('/:id', dispositivoController.deleteDispositivo);

module.exports = router;