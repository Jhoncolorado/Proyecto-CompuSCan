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
            console.log('Recibiendo petición POST en /api/dispositivos');
            console.log('Body recibido:', req.body);
            
            const { nombre, tipo, serial, foto } = req.body;

            // Validar campos obligatorios
            if (!nombre || !tipo || !serial) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            // Verificar si el serial ya existe
            const dispositivoExistente = await dispositivoModel.getDispositivoBySerial(serial);
            if (dispositivoExistente) {
                return res.status(400).json({ error: 'El número de serie ya está registrado' });
            }

            const newDispositivo = await dispositivoModel.createDispositivo({
                nombre,
                tipo,
                serial,
                foto
            });

            res.status(201).json({
                message: 'Dispositivo creado exitosamente',
                dispositivo: newDispositivo
            });
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

            // Verificar si el dispositivo existe
            const dispositivoExistente = await dispositivoModel.getDispositivoById(req.params.id);
            if (!dispositivoExistente) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }

            // Si se está actualizando el serial, verificar que no exista
            if (serial && serial !== dispositivoExistente.serial) {
                const serialExistente = await dispositivoModel.getDispositivoBySerial(serial);
                if (serialExistente) {
                    return res.status(400).json({ error: 'El número de serie ya está registrado' });
                }
            }

            const updatedDispositivo = await dispositivoModel.updateDispositivo(
                req.params.id,
                {
                    nombre,
                    tipo,
                    serial,
                    foto
                }
            );

            res.json({
                message: 'Dispositivo actualizado exitosamente',
                dispositivo: updatedDispositivo
            });
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