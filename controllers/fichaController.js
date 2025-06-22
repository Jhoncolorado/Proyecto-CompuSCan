const fichaModel = require('../models/fichaModel');

const fichaController = {
    getAllFichas: async (req, res) => {
        try {
            const fichas = await fichaModel.getAllFichas();
            res.json(fichas);
        } catch (error) {
            console.error('Error en getAllFichas:', error);
            res.status(500).json({ error: 'Error al obtener fichas', details: error.message });
        }
    },
};

module.exports = fichaController; 