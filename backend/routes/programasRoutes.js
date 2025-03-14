const express = require('express');
const router = express.Router();
const programasController = require('../controllers/programasController');

router.get('/', programasController.getAllProgramas);
router.get('/:id', programasController.getProgramaById);
router.post('/', programasController.createPrograma);
router.put('/:id', programasController.updatePrograma);
router.delete('/:id', programasController.deletePrograma);

module.exports = router;