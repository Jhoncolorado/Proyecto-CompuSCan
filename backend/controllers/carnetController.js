const carnetModel = require('../models/carnetModel');

const carnetController = {
    getAllCarnets: async (req, res) => {
        try {
            const carnets = await carnetModel.getAllCarnets();
            res.json(carnets);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los carnets' });
        }
    },
    getCarnetById: async (req, res) => {
        try {
            const carnet = await carnetModel.getCarnetById(req.params.id);
            res.json(carnet);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el carnet' });
        }
    },
    createCarnet: async (req, res) => {
        try {
            const newCarnet = await carnetModel.createCarnet(req.body);
            res.status(201).json(newCarnet);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carnet' });
        }
    },
    updateCarnet: async (req, res) => {
        try {
            const updatedCarnet = await carnetModel.updateCarnet(req.params.id, req.body);
            res.json(updatedCarnet);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el carnet' });
        }
    },
    deleteCarnet: async (req, res) => {
        try {
            const deletedCarnet = await carnetModel.deleteCarnet(req.params.id);
            res.json(deletedCarnet);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el carnet' });
        }
    },
};

module.exports = carnetController;