const express = require('express');
const router = express.Router();
const fichaController = require('../controllers/fichaController');
const { authenticate } = require('../middleware/auth');

router.get('/', fichaController.getAllFichas);
router.get('/asignadas', authenticate, fichaController.getFichasAsignadas);

module.exports = router; 