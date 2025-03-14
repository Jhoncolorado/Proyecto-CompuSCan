const historiasReportesModel = require('../models/historiasReportesModel');

const historiasReportesController = {
    getAllHistoriasReportes: async (req, res) => {
        try {
            const historiasReportes = await historiasReportesModel.getAllHistoriasReportes();
            res.json(historiasReportes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las historias de reportes' });
        }
    },
    getHistoriaReporteById: async (req, res) => {
        try {
            const historiaReporte = await historiasReportesModel.getHistoriaReporteById(req.params.dispositivoId, req.params.alertaId);
            res.json(historiaReporte);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la historia de reporte' });
        }
    },
    createHistoriaReporte: async (req, res) => {
        try {
            const newHistoriaReporte = await historiasReportesModel.createHistoriaReporte(req.body);
            res.status(201).json(newHistoriaReporte);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la historia de reporte' });
        }
    },
    updateHistoriaReporte: async (req, res) => {
        try {
            const updatedHistoriaReporte = await historiasReportesModel.updateHistoriaReporte(req.params.dispositivoId, req.params.alertaId, req.body);
            res.json(updatedHistoriaReporte);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la historia de reporte' });
        }
    },
    deleteHistoriaReporte: async (req, res) => {
        try {
            const deletedHistoriaReporte = await historiasReportesModel.deleteHistoriaReporte(req.params.dispositivoId, req.params.alertaId);
            res.json(deletedHistoriaReporte);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la historia de reporte' });
        }
    },
};

module.exports = historiasReportesController;