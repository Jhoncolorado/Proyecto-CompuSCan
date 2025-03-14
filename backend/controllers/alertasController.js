const alertasModel = require('../models/alertasModel');

const alertasController = {
    getAllAlertas: async (req, res) => {
        try {
            const alertas = await alertasModel.getAllAlertas();
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las alertas' });
        }
    },
    getAlertaById: async (req, res) => {
        try {
            const alerta = await alertasModel.getAlertaById(req.params.id);
            res.json(alerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la alerta' });
        }
    },
    createAlerta: async (req, res) => {
        try {
            const newAlerta = await alertasModel.createAlerta(req.body);
            res.status(201).json(newAlerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la alerta' });
        }
    },
    updateAlerta: async (req, res) => {
        try {
            const updatedAlerta = await alertasModel.updateAlerta(req.params.id, req.body);
            res.json(updatedAlerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la alerta' });
        }
    },
    deleteAlerta: async (req, res) => {
        try {
            const deletedAlerta = await alertasModel.deleteAlerta(req.params.id);
            res.json(deletedAlerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la alerta' });
        }
    },
};

module.exports = alertasController;