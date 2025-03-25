const historialAlertaModel = require('../models/historialAlertaModel');

const historialAlertaController = {
    createHistorialAlerta: async (req, res) => {
        try {
            const { id_alerta, id_dispositivo } = req.body;
            if (!id_alerta || !id_dispositivo) {
                return res.status(400).json({ error: 'id_alerta y id_dispositivo son requeridos' });
            }
            const newHistorial = await historialAlertaModel.createHistorialAlerta({
                id_alerta,
                id_dispositivo
            });
            res.status(201).json(newHistorial);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al registrar alerta',
                details: error.message 
            });
        }
    },

    getAlertasByDispositivo: async (req, res) => {
        try {
            const { id_dispositivo } = req.params;
            const alertas = await historialAlertaModel.getAlertasByDispositivo(id_dispositivo);
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener alertas',
                details: error.message 
            });
        }
    }
};

module.exports = historialAlertaController;