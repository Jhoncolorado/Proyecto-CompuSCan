const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

// CRUD para programas
router.post('/', programaController.createPrograma);       // Crear programa
router.get('/', programaController.getAllProgramas);      // Obtener todos los programas
router.get('/:id', programaController.getProgramaById);   // Obtener programa por ID
router.put('/:id', programaController.updatePrograma);    // Actualizar programa
router.delete('/:id', programaController.deletePrograma); // Eliminar programa

module.exports = router;