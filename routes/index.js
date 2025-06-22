const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/stats', dashboardController.getDashboardStats);

// Nueva ruta para fichas
router.use('/fichas', require('./fichaRoutes'));
// Nueva ruta para asistencia
router.use('/asistencia', require('./asistenciaRoutes'));

module.exports = router; 