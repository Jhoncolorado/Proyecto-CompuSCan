const historialDispositivoModel = require('../models/historialDispositivoModel');

const historialDispositivoController = {
    getAllHistorialDispositivos: async (req, res) => {
        try {
            const historial = await historialDispositivoModel.getAllHistorialDispositivos();
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el historial de dispositivos' });
        }
    },
    getHistorialDispositivoById: async (req, res) => {
        try {
            const historial = await historialDispositivoModel.getHistorialDispositivoById(req.params.id);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el historial de dispositivos' });
        }
    },
    createHistorialDispositivo: async (req, res) => {
        try {
            const newHistorial = await historialDispositivoModel.createHistorialDispositivo(req.body);
            res.status(201).json(newHistorial);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el historial de dispositivos' });
        }
    },
    updateHistorialDispositivo: async (req, res) => {
        try {
            const updatedHistorial = await historialDispositivoModel.updateHistorialDispositivo(req.params.id, req.body);
            res.json(updatedHistorial);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el historial de dispositivos' });
        }
    },
    deleteHistorialDispositivo: async (req, res) => {
        try {
            const deletedHistorial = await historialDispositivoModel.deleteHistorialDispositivo(req.params.id);
            res.json(deletedHistorial);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el historial de dispositivos' });
        }
    },
};

module.exports = historialDispositivoController;