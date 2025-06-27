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
    getFichasAsignadas: async (req, res) => {
        try {
            // El id del instructor autenticado debe estar en req.user.id
            const id_instructor = req.user && req.user.id;
            if (!id_instructor) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            const fichas = await fichaModel.getFichasAsignadas(id_instructor);
            res.json(fichas);
        } catch (error) {
            console.error('Error en getFichasAsignadas:', error);
            res.status(500).json({ error: 'Error al obtener fichas asignadas', details: error.message });
        }
    },
};

module.exports = fichaController; 