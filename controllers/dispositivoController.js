const dispositivoModel = require('../models/dispositivoModel');

// Funciones de validación
const validarTipoDispositivo = (tipo) => {
    const tiposValidos = ['laptop', 'tablet', 'camera', 'monitor'];
    return tiposValidos.includes(tipo.toLowerCase());
};

const validarSerial = (serial) => {
    // El serial debe tener al menos 5 caracteres y contener números
    return serial.length >= 5 && /\d/.test(serial);
};

const validarMarcaModelo = (texto) => {
    // La marca y modelo deben tener al menos 2 caracteres y no contener caracteres especiales
    return texto.length >= 2 && /^[a-zA-Z0-9\s-]+$/.test(texto);
};

const validarFotos = (fotos) => {
    if (!Array.isArray(fotos) || fotos.length !== 3) {
        return { valido: false, mensaje: 'Se requieren exactamente 3 fotos' };
    }

    for (let i = 0; i < fotos.length; i++) {
        if (!fotos[i].startsWith('data:image')) {
            return { valido: false, mensaje: `La foto ${i + 1} no es una imagen válida en formato base64` };
        }
        
        // Validar tamaño máximo (5MB por foto)
        const sizeInMB = (fotos[i].length * 3/4) / (1024*1024);
        if (sizeInMB > 5) {
            return { valido: false, mensaje: `La foto ${i + 1} excede el tamaño máximo permitido de 5MB` };
        }
    }

    return { valido: true };
};


const dispositivoController = {
    getAllDispositivos: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getAllDispositivos();
            res.json(dispositivos);
        } catch (error) {
            console.error('Error al obtener dispositivos:', error);
            res.status(500).json({ 
                message: 'Error al obtener los dispositivos',
                error: error.message 
            });
        }
    },

    getDispositivoById: async (req, res) => {
        try {
            const { id } = req.params;
            const dispositivo = await dispositivoModel.getDispositivoById(id);
            
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }
            
            res.json(dispositivo);
        } catch (error) {
            console.error('Error al obtener dispositivo:', error);
            res.status(500).json({ 
                message: 'Error al obtener el dispositivo',
                error: error.message 
            });
        }
    },

    createDispositivo: async (req, res) => {
        try {
            const { nombre, tipo, serial, foto, mimeType, id_usuario } = req.body;
            // Procesar la foto (base64)
            let fotoProcesada = null;
            if (foto && typeof foto === 'string' && foto.startsWith('data:')) {
                fotoProcesada = foto.split(',')[1];
            }
            // Quitar validación Google Vision: solo guardar
            const newDevice = await dispositivoModel.createDispositivo({
                nombre,
                tipo: tipo.toLowerCase(),
                serial,
                rfid: null, // Se asigna después
                foto: fotoProcesada,
                mimeType,
                id_usuario
            });
            res.status(201).json({
                message: 'Dispositivo registrado exitosamente',
                dispositivo: newDevice
            });
        } catch (error) {
            console.error('Error al crear dispositivo:', error);
            res.status(500).json({
                message: 'Error al crear el dispositivo',
                error: error.message
            });
        }
    },

    updateDispositivo: async (req, res) => {
        try {
            const { id } = req.params;
            // Validar que el dispositivo exista
            const dispositivo = await dispositivoModel.getDispositivoById(id);
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }

            // Si se está actualizando el serial, verificar que no exista
            if (req.body.serial && req.body.serial !== dispositivo.serial) {
                const dispositivoExistente = await dispositivoModel.getDispositivoBySerial(req.body.serial);
                if (dispositivoExistente) {
                    return res.status(400).json({ message: 'Ya existe un dispositivo con ese serial' });
                }
            }

            // Procesar la foto (base64)
            let fotoProcesada = dispositivo.foto;
            if (req.body.foto && typeof req.body.foto === 'string' && req.body.foto.startsWith('data:')) {
                fotoProcesada = req.body.foto.split(',')[1];
            }

            const dispositivoData = {
                nombre: req.body.nombre || dispositivo.nombre,
                tipo: req.body.tipo || dispositivo.tipo,
                serial: req.body.serial || dispositivo.serial,
                rfid: req.body.rfid !== undefined ? req.body.rfid : dispositivo.rfid,
                foto: fotoProcesada,
                mimeType: req.body.mimeType || dispositivo.mimeType,
                id_usuario: req.body.id_usuario || dispositivo.id_usuario,
                estado_validacion: req.body.estado_validacion || dispositivo.estado_validacion
            };

            const updatedDispositivo = await dispositivoModel.updateDispositivo(id, dispositivoData);
            res.json({
                message: 'Dispositivo actualizado exitosamente',
                dispositivo: updatedDispositivo
            });
        } catch (error) {
            console.error('Error al actualizar dispositivo:', error);
            res.status(500).json({ 
                message: 'Error al actualizar dispositivo',
                error: error.message
            });
        }
    },

    deleteDispositivo: async (req, res) => {
        try {
            const { id } = req.params;
            const dispositivo = await dispositivoModel.deleteDispositivo(id);
            
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }

            res.json({
                message: 'Dispositivo eliminado exitosamente',
                id: dispositivo.id
            });
        } catch (error) {
            console.error('Error al eliminar dispositivo:', error);
            res.status(500).json({ 
                message: 'Error al eliminar dispositivo',
                error: error.message
            });
        }
    },

    getDispositivosByUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const dispositivos = await dispositivoModel.getDispositivosByUsuario(usuarioId);
            res.json(dispositivos);
        } catch (error) {
            console.error('Error al obtener dispositivos del usuario:', error);
            res.status(500).json({ 
                message: 'Error al obtener los dispositivos del usuario',
                error: error.message 
            });
        }
    },

    getDispositivosPendientes: async (req, res) => {
        try {
            const dispositivos = await dispositivoModel.getDispositivosPendientes();
            res.json(dispositivos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener dispositivos pendientes', error: error.message });
        }
    }
};

module.exports = dispositivoController;