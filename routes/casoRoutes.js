const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');

router.post('/', casoController.createCaso);
router.get('/:estado', casoController.getCasosByEstado); // Ej: /casos/Abierto

module.exports = router;