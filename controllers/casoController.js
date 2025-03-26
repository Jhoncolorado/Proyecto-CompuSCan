const casoModel = require('../models/casoModel');

const casoController = {
    getAllCasos: async (req, res) => {
        try {
            const casos = await casoModel.getAllCasos();
            res.json(casos);
        } catch (error) {
            console.error('Error en getAllCasos:', error);
            res.status(500).json({ 
                error: 'Error al obtener casos',
                details: error.message 
            });
        }
    },

    getCasoById: async (req, res) => {
        try {
            const caso = await casoModel.getCasoById(req.params.id);
            if (!caso) {
                return res.status(404).json({ error: 'Caso no encontrado' });
            }
            res.json(caso);
        } catch (error) {
            console.error('Error en getCasoById:', error);
            res.status(500).json({ 
                error: 'Error al obtener caso',
                details: error.message 
            });
        }
    },

    getCasosByHistorial: async (req, res) => {
        try {
            const casos = await casoModel.getCasosByHistorial(req.params.historial_id);
            res.json(casos);
        } catch (error) {
            console.error('Error en getCasosByHistorial:', error);
            res.status(500).json({ 
                error: 'Error al obtener casos del historial',
                details: error.message 
            });
        }
    },

    createCaso: async (req, res) => {
        try {
            const {
                tipo_reporte,
                id_historial,
                estado
            } = req.body;

            // Validar campos requeridos
            if (!tipo_reporte || !id_historial) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    required: ['tipo_reporte', 'id_historial']
                });
            }

            // Validar estado si se proporciona
            if (estado) {
                const estadosValidos = ['Abierto', 'En proceso', 'Cerrado', 'Archivado'];
                if (!estadosValidos.includes(estado)) {
                    return res.status(400).json({ 
                        error: 'Estado inválido',
                        estadosPermitidos: estadosValidos
                    });
                }
            }

            const newCaso = await casoModel.createCaso({
                tipo_reporte,
                id_historial,
                estado: estado || 'Abierto'
            });

            res.status(201).json({
                message: 'Caso creado exitosamente',
                caso: newCaso
            });
        } catch (error) {
            console.error('Error en createCaso:', error);
            if (error.message.includes('El historial especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al crear caso',
                    details: error.message
                });
            }
            res.status(500).json({ 
                error: 'Error al crear caso',
                details: error.message 
            });
        }
    },

    updateCaso: async (req, res) => {
        try {
            const {
                tipo_reporte,
                id_historial,
                estado
            } = req.body;

            // Validar estado si se proporciona
            if (estado) {
                const estadosValidos = ['Abierto', 'En proceso', 'Cerrado', 'Archivado'];
                if (!estadosValidos.includes(estado)) {
                    return res.status(400).json({ 
                        error: 'Estado inválido',
                        estadosPermitidos: estadosValidos
                    });
                }
            }

            const updatedCaso = await casoModel.updateCaso(
                req.params.id,
                {
                    tipo_reporte,
                    id_historial,
                    estado
                }
            );

            res.json({
                message: 'Caso actualizado exitosamente',
                caso: updatedCaso
            });
        } catch (error) {
            console.error('Error en updateCaso:', error);
            if (error.message.includes('Caso no encontrado')) {
                return res.status(404).json({
                    error: 'Error al actualizar caso',
                    details: error.message
                });
            }
            if (error.message.includes('El historial especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al actualizar caso',
                    details: error.message
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar caso',
                details: error.message 
            });
        }
    },

    deleteCaso: async (req, res) => {
        try {
            const deletedCaso = await casoModel.deleteCaso(req.params.id);
            if (!deletedCaso) {
                return res.status(404).json({ error: 'Caso no encontrado' });
            }
            res.json({ 
                message: 'Caso eliminado correctamente',
                id: deletedCaso.id_caso
            });
        } catch (error) {
            console.error('Error en deleteCaso:', error);
            res.status(500).json({ 
                error: 'Error al eliminar caso',
                details: error.message 
            });
        }
    }
};

module.exports = casoController;