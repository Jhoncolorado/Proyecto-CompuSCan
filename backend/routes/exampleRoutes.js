const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Ruta de ejemplo
router.get('/example', exampleController.getExample);

module.exports = router;