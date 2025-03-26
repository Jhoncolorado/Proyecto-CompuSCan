const alertaModel = require('../models/alertaModel');

const alertaController = {
    getAllAlertas: async (req, res) => {
        try {
            const alertas = await alertaModel.getAllAlertas();
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener alertas',
                details: error.message 
            });
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
            res.status(500).json({ 
                error: 'Error al obtener alerta',
                details: error.message 
            });
        }
    },

    createAlerta: async (req, res) => {
        try {
            const { descripcion, dispositivo_id } = req.body;

            // Validar campos obligatorios
            if (!descripcion || !dispositivo_id) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    required: ['descripcion', 'dispositivo_id']
                });
            }

            const newAlerta = await alertaModel.createAlerta({
                descripcion,
                dispositivo_id
            });

            res.status(201).json({
                message: 'Alerta creada exitosamente',
                alerta: newAlerta
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear alerta',
                details: error.message 
            });
        }
    },

    updateAlerta: async (req, res) => {
        try {
            const { descripcion, dispositivo_id } = req.body;

            // Verificar si la alerta existe
            const alertaExistente = await alertaModel.getAlertaById(req.params.id);
            if (!alertaExistente) {
                return res.status(404).json({ error: 'Alerta no encontrada' });
            }

            const updatedAlerta = await alertaModel.updateAlerta(
                req.params.id,
                {
                    descripcion,
                    dispositivo_id
                }
            );

            res.json({
                message: 'Alerta actualizada exitosamente',
                alerta: updatedAlerta
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar alerta',
                details: error.message 
            });
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
            res.status(500).json({ 
                error: 'Error al eliminar alerta',
                details: error.message 
            });
        }
    },

    getAlertasByDispositivo: async (req, res) => {
        try {
            const alertas = await alertaModel.getAlertasByDispositivo(req.params.dispositivo_id);
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener alertas del dispositivo',
                details: error.message 
            });
        }
    },

    getAlertasByUsuario: async (req, res) => {
        try {
            const alertas = await alertaModel.getAlertasByUsuario(req.params.usuario_id);
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener alertas del usuario',
                details: error.message 
            });
        }
    }
};

module.exports = alertaController;