const rfidModel = require('../models/rfidModel');

const rfidController = {
    getAllRfids: async (req, res) => {
        try {
            const rfids = await rfidModel.getAllRfids();
            res.json(rfids);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los rfids' });
        }
    },
    getRfidById: async (req, res) => {
        try {
            const rfid = await rfidModel.getRfidById(req.params.id);
            res.json(rfid);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el rfid' });
        }
    },
    createRfid: async (req, res) => {
        try {
            const newRfid = await rfidModel.createRfid(req.body);
            res.status(201).json(newRfid);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el rfid' });
        }
    },
    updateRfid: async (req, res) => {
        try {
            const updatedRfid = await rfidModel.updateRfid(req.params.id, req.body);
            res.json(updatedRfid);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el rfid' });
        }
    },
    deleteRfid: async (req, res) => {
        try {
            const deletedRfid = await rfidModel.deleteRfid(req.params.id);
            res.json(deletedRfid);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el rfid' });
        }
    },
};

module.exports = rfidController;