const carnetModel = require('../models/carnetModel');

const carnetController = {
    // Para RFID: Obtener carnet por ID o número
    getCarnet: async (req, res) => {
        try {
            const { id } = req.params;
            const carnet = await carnetModel.getCarnetById(id);
            if (!carnet || !carnet.activo) {
                return res.status(404).json({ 
                    acceso: false, 
                    error: 'Carnet no encontrado o inactivo' 
                });
            }
            res.json({ 
                acceso: true,
                carnet 
            });
        } catch (error) {
            res.status(500).json({ error: 'Error en RFID', details: error.message });
        }
    },

    // Para admin: Desactivar/reactivar carnet
    updateCarnet: async (req, res) => {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            const updatedCarnet = await carnetModel.updateCarnet(id, { activo });
            res.json(updatedCarnet);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar', 
                details: error.message 
            });
        }
    }
};

module.exports = carnetController;