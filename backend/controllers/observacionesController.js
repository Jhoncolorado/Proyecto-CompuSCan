const observacionModel = require('../models/observacionModel');

const observacionController = {
    getAllObservaciones: async (req, res) => {
        try {
            const observaciones = await observacionModel.getAllObservaciones();
            res.json(observaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las observaciones' });
        }
    },
    getObservacionById: async (req, res) => {
        try {
            const observacion = await observacionModel.getObservacionById(req.params.id);
            res.json(observacion);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la observación' });
        }
    },
    createObservacion: async (req, res) => {
        try {
            const newObservacion = await observacionModel.createObservacion(req.body);
            res.status(201).json(newObservacion);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la observación' });
        }
    },
    updateObservacion: async (req, res) => {
        try {
            const updatedObservacion = await observacionModel.updateObservacion(req.params.id, req.body);
            res.json(updatedObservacion);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la observación' });
        }
    },
    deleteObservacion: async (req, res) => {
        try {
            const deletedObservacion = await observacionModel.deleteObservacion(req.params.id);
            res.json(deletedObservacion);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la observación' });
        }
    },
};

module.exports = observacionController;