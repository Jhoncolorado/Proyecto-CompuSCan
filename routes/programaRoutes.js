const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

// Rutas para programas
router.post('/', programaController.createPrograma);
router.get('/', programaController.getAllProgramas);
router.get('/:id', programaController.getProgramaById);
router.put('/:id', programaController.updatePrograma);
router.delete('/:id', programaController.deletePrograma);

module.exports = router;