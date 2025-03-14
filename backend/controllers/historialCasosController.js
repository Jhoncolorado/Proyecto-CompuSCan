const historialCasosModel = require('../models/historialCasosModel');

const historialCasosController = {
    getAllHistorialCasos: async (req, res) => {
        try {
            const historialCasos = await historialCasosModel.getAllHistorialCasos();
            res.json(historialCasos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el historial de casos' });
        }
    },
    getHistorialCasoById: async (req, res) => {
        try {
            const historialCaso = await historialCasosModel.getHistorialCasoById(req.params.id);
            res.json(historialCaso);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el caso' });
        }
    },
    createHistorialCaso: async (req, res) => {
        try {
            const newHistorialCaso = await historialCasosModel.createHistorialCaso(req.body);
            res.status(201).json(newHistorialCaso);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el caso' });
        }
    },
    updateHistorialCaso: async (req, res) => {
        try {
            const updatedHistorialCaso = await historialCasosModel.updateHistorialCaso(req.params.id, req.body);
            res.json(updatedHistorialCaso);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el caso' });
        }
    },
    deleteHistorialCaso: async (req, res) => {
        try {
            const deletedHistorialCaso = await historialCasosModel.deleteHistorialCaso(req.params.id);
            res.json(deletedHistorialCaso);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el caso' });
        }
    },
};

module.exports = historialCasosController;