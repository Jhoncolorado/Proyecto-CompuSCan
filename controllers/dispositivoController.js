const dispositivoModel = require('../models/dispositivoModel');

const dispositivoController = {
    getAllDispositivos: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getAllDispositivos();
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los dispositivos' });
        }
    },
    getDispositivoById: async (req, res) => {
        try {
            const dispositivo = await dispositivoModel.getDispositivoById(req.params.id);
            res.json(dispositivo);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el dispositivo' });
        }
    },
    createDispositivo: async (req, res) => {
        try {
            const newDispositivo = await dispositivoModel.createDispositivo(req.body);
            res.status(201).json(newDispositivo);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el dispositivo' });
        }
    },
    updateDispositivo: async (req, res) => {
        try {
            const updatedDispositivo = await dispositivoModel.updateDispositivo(req.params.id, req.body);
            res.json(updatedDispositivo);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el dispositivo' });
        }
    },
    deleteDispositivo: async (req, res) => {
        try {
            const deletedDispositivo = await dispositivoModel.deleteDispositivo(req.params.id);
            res.json(deletedDispositivo);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el dispositivo' });
        }
    },
};

module.exports = dispositivoController;