const express = require('express');
const router = express.Router();
const fichaController = require('../controllers/fichaController');

router.get('/', fichaController.getAllFichas);

module.exports = router; 