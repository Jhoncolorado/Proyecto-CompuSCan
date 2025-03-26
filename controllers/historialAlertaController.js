const historialAlertaModel = require('../models/historialAlertaModel');

const historialAlertaController = {
    getAllHistorialAlertas: async (req, res) => {
        try {
            const historial = await historialAlertaModel.getAllHistorialAlertas();
            res.json(historial);
        } catch (error) {
            console.error('Error en getAllHistorialAlertas:', error);
            res.status(500).json({ 
                error: 'Error al obtener historial de alertas',
                details: error.message 
            });
        }
    },

    getHistorialAlertaById: async (req, res) => {
        try {
            const historial = await historialAlertaModel.getHistorialAlertaById(req.params.id);
            if (!historial) {
                return res.status(404).json({ error: 'Historial de alerta no encontrado' });
            }
            res.json(historial);
        } catch (error) {
            console.error('Error en getHistorialAlertaById:', error);
            res.status(500).json({ 
                error: 'Error al obtener historial de alerta',
                details: error.message 
            });
        }
    },

    getHistorialByDispositivo: async (req, res) => {
        try {
            const historial = await historialAlertaModel.getHistorialByDispositivo(req.params.dispositivo_id);
            res.json(historial);
        } catch (error) {
            console.error('Error en getHistorialByDispositivo:', error);
            res.status(500).json({ 
                error: 'Error al obtener historial de alertas del dispositivo',
                details: error.message 
            });
        }
    },

    getHistorialByAlerta: async (req, res) => {
        try {
            const historial = await historialAlertaModel.getHistorialByAlerta(req.params.alerta_id);
            res.json(historial);
        } catch (error) {
            console.error('Error en getHistorialByAlerta:', error);
            res.status(500).json({ 
                error: 'Error al obtener historial de la alerta',
                details: error.message 
            });
        }
    },

    createHistorialAlerta: async (req, res) => {
        try {
            const { id_alerta, id_dispositivo } = req.body;

            // Validar campos requeridos
            if (!id_alerta || !id_dispositivo) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    required: ['id_alerta', 'id_dispositivo']
                });
            }

            const newHistorial = await historialAlertaModel.createHistorialAlerta({
                id_alerta,
                id_dispositivo
            });

            res.status(201).json({
                message: 'Historial de alerta creado exitosamente',
                historial: newHistorial
            });
        } catch (error) {
            console.error('Error en createHistorialAlerta:', error);
            if (error.message.includes('La alerta especificada no existe')) {
                return res.status(404).json({
                    error: 'Error al crear historial de alerta',
                    details: error.message
                });
            }
            if (error.message.includes('El dispositivo especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al crear historial de alerta',
                    details: error.message
                });
            }
            res.status(500).json({ 
                error: 'Error al crear historial de alerta',
                details: error.message 
            });
        }
    },

    deleteHistorialAlerta: async (req, res) => {
        try {
            const deletedHistorial = await historialAlertaModel.deleteHistorialAlerta(req.params.id);
            if (!deletedHistorial) {
                return res.status(404).json({ error: 'Historial de alerta no encontrado' });
            }
            res.json({ 
                message: 'Historial de alerta eliminado correctamente',
                id: deletedHistorial.id
            });
        } catch (error) {
            console.error('Error en deleteHistorialAlerta:', error);
            res.status(500).json({ 
                error: 'Error al eliminar historial de alerta',
                details: error.message 
            });
        }
    }
};

module.exports = historialAlertaController;