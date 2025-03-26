const historialDispositivoModel = require('../models/historialDispositivoModel');

const historialDispositivoController = {
    getAllHistoriales: async (req, res) => {
        try {
            const historiales = await historialDispositivoModel.getAllHistoriales();
            res.json(historiales);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener historiales',
                details: error.message 
            });
        }
    },

    getHistorialById: async (req, res) => {
        try {
            const historial = await historialDispositivoModel.getHistorialById(req.params.id);
            if (!historial) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }
            res.json(historial);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener historial',
                details: error.message 
            });
        }
    },

    createHistorial: async (req, res) => {
        try {
            const { descripcion, id_dispositivo } = req.body;

            // Validar campos obligatorios
            if (!descripcion || !id_dispositivo) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    required: ['descripcion', 'id_dispositivo']
                });
            }

            const newHistorial = await historialDispositivoModel.createHistorial({
                descripcion,
                id_dispositivo
            });

            res.status(201).json({
                message: 'Historial creado exitosamente',
                historial: newHistorial
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear historial',
                details: error.message 
            });
        }
    },

    updateHistorial: async (req, res) => {
        try {
            const { descripcion, id_dispositivo } = req.body;

            // Verificar si el historial existe
            const historialExistente = await historialDispositivoModel.getHistorialById(req.params.id);
            if (!historialExistente) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }

            const updatedHistorial = await historialDispositivoModel.updateHistorial(
                req.params.id,
                {
                    descripcion,
                    id_dispositivo
                }
            );

            res.json({
                message: 'Historial actualizado exitosamente',
                historial: updatedHistorial
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar historial',
                details: error.message 
            });
        }
    },

    deleteHistorial: async (req, res) => {
        try {
            const deletedHistorial = await historialDispositivoModel.deleteHistorial(req.params.id);
            if (!deletedHistorial) {
                return res.status(404).json({ error: 'Historial no encontrado' });
            }
            res.json({ message: 'Historial eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar historial',
                details: error.message 
            });
        }
    },

    getHistorialesByDispositivo: async (req, res) => {
        try {
            const historiales = await historialDispositivoModel.getHistorialesByDispositivo(req.params.dispositivo_id);
            res.json(historiales);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener historiales del dispositivo',
                details: error.message 
            });
        }
    }
};

module.exports = historialDispositivoController;