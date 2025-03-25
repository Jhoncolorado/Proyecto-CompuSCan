const alertaModel = require('../models/alertaModel');

const alertaController = {
    getAllAlertas: async (req, res) => {
        try {
            const alertas = await alertaModel.getAllAlertas();
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las alertas', details: error.message });
        }
    },

    getAlertaById: async (req, res) => {
        try {
            const alerta = await alertaModel.getAlertaById(req.params.id);
            if (!alerta) {
                return res.status(404).json({ error: 'Alerta no encontrada' });
            }
            res.json(alerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la alerta', details: error.message });
        }
    },

    createAlerta: async (req, res) => {
        try {
            // Validación básica según el nuevo esquema SQL
            if (!req.body.descripcion) {
                return res.status(400).json({ error: 'La descripción es requerida' });
            }
            
            const newAlerta = await alertaModel.createAlerta({
                descripcion: req.body.descripcion,
                // fecha se asigna automáticamente (CURRENT_TIMESTAMP en SQL)
            });
            res.status(201).json(newAlerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la alerta', details: error.message });
        }
    },

    updateAlerta: async (req, res) => {
        try {
            const updatedAlerta = await alertaModel.updateAlerta(req.params.id, {
                descripcion: req.body.descripcion // Solo actualizamos la descripción
            });
            
            if (!updatedAlerta) {
                return res.status(404).json({ error: 'Alerta no encontrada' });
            }
            res.json(updatedAlerta);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la alerta', details: error.message });
        }
    },

    deleteAlerta: async (req, res) => {
        try {
            const deletedAlerta = await alertaModel.deleteAlerta(req.params.id);
            if (!deletedAlerta) {
                return res.status(404).json({ error: 'Alerta no encontrada' });
            }
            res.json({ message: 'Alerta eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la alerta', details: error.message });
        }
    },
};

module.exports = alertaController;