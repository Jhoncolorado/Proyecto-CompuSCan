const historialDispositivoModel = require('../models/historialDispositivoModel');

const historialDispositivoController = {
    getAllHistorialDispositivos: async (req, res) => {
        try {
            const historial = await historialDispositivoModel.getAllHistorialDispositivos();
            res.json(historial);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener el historial',
                details: error.message 
            });
        }
    },

    getHistorialDispositivoById: async (req, res) => {
        try {
            const historial = await historialDispositivoModel.getHistorialDispositivoById(req.params.id);
            if (!historial) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            res.json(historial);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener el registro',
                details: error.message 
            });
        }
    },

    createHistorialDispositivo: async (req, res) => {
        try {
            const { descripcion, id_dispositivo } = req.body;
            if (!descripcion || !id_dispositivo) {
                return res.status(400).json({ error: 'Descripción y ID de dispositivo son requeridos' });
            }

            const newHistorial = await historialDispositivoModel.createHistorialDispositivo({
                descripcion,
                id_dispositivo
            });
            res.status(201).json(newHistorial);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear registro',
                details: error.message 
            });
        }
    }
};

module.exports = historialDispositivoController;