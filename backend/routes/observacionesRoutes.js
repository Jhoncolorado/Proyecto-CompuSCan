const express = require('express');
const router = express.Router();
const observacionController = require('../controllers/observacionController');

router.get('/', observacionController.getAllObservaciones);
router.get('/:id', observacionController.getObservacionById);
router.post('/', observacionController.createObservacion);
router.put('/:id', observacionController.updateObservacion);
router.delete('/:id', observacionController.deleteObservacion);

module.exports = router;