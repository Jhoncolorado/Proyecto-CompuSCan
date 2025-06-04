const dispositivoModel = require('../models/dispositivoModel');

/**
 * Gestión de imágenes múltiples por dispositivo:
 * - Se reciben hasta 3 archivos por dispositivo usando multer (campo 'foto').
 * - Los archivos se guardan en /uploads y sus nombres se almacenan como un array JSON en el campo 'foto' de la base de datos.
 * - Todas las funciones del controlador devuelven el campo 'foto' como un array de strings (nombres de archivo).
 * - El backend expone la carpeta /uploads como ruta pública para que el frontend pueda mostrar las imágenes.
 */

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
            // Soporte de paginación
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const total = await dispositivoModel.countDispositivos();
            const dispositivos = await dispositivoModel.getDispositivosPaginados(limit, offset);
            const totalPages = Math.ceil(total / limit);

            res.json({
                data: dispositivos,
                total,
                page,
                totalPages,
                limit
            });
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
            console.log('BODY:', req.body);
            console.log('FILES:', req.files);
            const { nombre, tipo, serial, mimeType, id_usuario } = req.body;
            // Procesar fotos
            let fotos = [];
            if (req.files && req.files.length > 0) {
                fotos = req.files.map(f => f.filename);
            } else if (req.body.foto) {
                // Compatibilidad con una sola foto enviada como string
                fotos = [req.body.foto];
            }
            // Validar que tipo exista antes de usar toLowerCase
            const tipoFinal = (typeof tipo === 'string') ? tipo.toLowerCase() : '';
            const newDevice = await dispositivoModel.createDispositivo({
                nombre,
                tipo: tipoFinal,
                serial,
                rfid: null, // Se asigna después
                foto: JSON.stringify(fotos),
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
            const dispositivo = await dispositivoModel.getDispositivoById(id);
            if (!dispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado' });
            }
            if (req.body.serial && req.body.serial !== dispositivo.serial) {
                const dispositivoExistente = await dispositivoModel.getDispositivoBySerial(req.body.serial);
                if (dispositivoExistente) {
                    return res.status(400).json({ message: 'Ya existe un dispositivo con ese serial' });
                }
            }
            // Procesar fotos
            let fotos = [];
            if (req.files && req.files.length > 0) {
                fotos = req.files.map(f => f.filename);
            } else if (req.body.foto) {
                // Compatibilidad con una sola foto enviada como string
                fotos = Array.isArray(req.body.foto) ? req.body.foto : [req.body.foto];
            } else if (dispositivo.foto) {
                try {
                    fotos = JSON.parse(dispositivo.foto);
                } catch {
                    fotos = [dispositivo.foto];
                }
            }
            const dispositivoData = {
                nombre: req.body.nombre || dispositivo.nombre,
                tipo: req.body.tipo || dispositivo.tipo,
                serial: req.body.serial || dispositivo.serial,
                rfid: req.body.rfid !== undefined ? req.body.rfid : dispositivo.rfid,
                foto: JSON.stringify(fotos),
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