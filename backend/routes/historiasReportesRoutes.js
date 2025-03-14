const express = require('express');
const router = express.Router();
const historiasReportesController = require('../controllers/historiasReportesController');

router.get('/', historiasReportesController.getAllHistoriasReportes);
router.get('/:dispositivoId/:alertaId', historiasReportesController.getHistoriaReporteById);
router.post('/', historiasReportesController.createHistoriaReporte);
router.put('/:dispositivoId/:alertaId', historiasReportesController.updateHistoriaReporte);
router.delete('/:dispositivoId/:alertaId', historiasReportesController.deleteHistoriaReporte);

module.exports = router;