const dispositivoModel = require('../models/dispositivoModel');

const dispositivoController = {
    getAllDispositivos: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getAllDispositivos();
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener dispositivos',
                details: error.message 
            });
        }
    },

    getDispositivoById: async (req, res) => {
        try {
            const dispositivo = await dispositivoModel.getDispositivoById(req.params.id);
            if (!dispositivo) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.json(dispositivo);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener dispositivo',
                details: error.message 
            });
        }
    },

    createDispositivo: async (req, res) => {
        try {
            // Validar campos obligatorios según nuevo SQL
            const { nombre, tipo, serial } = req.body;
            if (!nombre || !tipo || !serial) {
                return res.status(400).json({ error: 'Nombre, tipo y serial son requeridos' });
            }

            const newDispositivo = await dispositivoModel.createDispositivo({
                nombre,
                tipo,
                serial,
                foto: req.body.foto || null // Campo opcional (BYTEA)
            });
            res.status(201).json(newDispositivo);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear dispositivo',
                details: error.message 
            });
        }
    },

    updateDispositivo: async (req, res) => {
        try {
            const { nombre, tipo, serial, foto } = req.body;
            const updatedDispositivo = await dispositivoModel.updateDispositivo(req.params.id, {
                nombre,
                tipo,
                serial,
                foto
            });

            if (!updatedDispositivo) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.json(updatedDispositivo);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar dispositivo',
                details: error.message 
            });
        }
    },

    deleteDispositivo: async (req, res) => {
        try {
            const deletedDispositivo = await dispositivoModel.deleteDispositivo(req.params.id);
            if (!deletedDispositivo) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.json({ message: 'Dispositivo eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar dispositivo',
                details: error.message 
            });
        }
    }
};

module.exports = dispositivoController;