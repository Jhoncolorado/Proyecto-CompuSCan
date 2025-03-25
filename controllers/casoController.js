const casoModel = require('../models/casoModel');

const casoController = {
    createCaso: async (req, res) => {
        try {
            const { tipo_reporte, id_historial, estado } = req.body;
            if (!tipo_reporte || !id_historial) {
                return res.status(400).json({ error: 'tipo_reporte y id_historial son requeridos' });
            }
            const newCaso = await casoModel.createCaso({
                tipo_reporte,
                id_historial,
                estado: estado || 'Abierto' // Valor por defecto
            });
            res.status(201).json(newCaso);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear caso',
                details: error.message 
            });
        }
    },

    getCasosByEstado: async (req, res) => {
        try {
            const { estado } = req.params;
            const casos = await casoModel.getCasosByEstado(estado);
            res.json(casos);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener casos',
                details: error.message 
            });
        }
    }
};

module.exports = casoController;