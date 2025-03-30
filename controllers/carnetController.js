const carnetModel = require('../models/carnetModel');

const carnetController = {
    getAllCarnets: async (req, res) => {
        try {
            const carnets = await carnetModel.getAllCarnets();
            res.json(carnets);
        } catch (error) {
            console.error('Error en getAllCarnets:', error);
            res.status(500).json({ 
                error: 'Error al obtener carnets',
                details: error.message 
            });
        }
    },

    getCarnetById: async (req, res) => {
        try {
            const carnet = await carnetModel.getCarnetById(req.params.id);
            if (!carnet) {
                return res.status(404).json({ error: 'Carnet no encontrado' });
            }
            res.json(carnet);
        } catch (error) {
            console.error('Error en getCarnetById:', error);
            res.status(500).json({ 
                error: 'Error al obtener carnet',
                details: error.message 
            });
        }
    },

    getCarnetByNumero: async (req, res) => {
        try {
            const carnet = await carnetModel.getCarnetByNumero(req.params.numero);
            if (!carnet) {
                return res.status(404).json({ error: 'Carnet no encontrado' });
            }
            res.json(carnet);
        } catch (error) {
            console.error('Error en getCarnetByNumero:', error);
            res.status(500).json({ 
                error: 'Error al obtener carnet',
                details: error.message 
            });
        }
    },

    getCarnetsByUsuario: async (req, res) => {
        try {
            const carnets = await carnetModel.getCarnetsByUsuario(req.params.usuario_id);
            res.json(carnets);
        } catch (error) {
            console.error('Error en getCarnetsByUsuario:', error);
            res.status(500).json({ 
                error: 'Error al obtener carnets del usuario',
                details: error.message 
            });
        }
    },

    createCarnet: async (req, res) => {
        try {
            const {
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo
            } = req.body;

            // Validar campos requeridos
            if (!id_usuario || !id_programa || !numero_carnet || !fecha_emision || !fecha_vencimiento) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    required: ['id_usuario', 'id_programa', 'numero_carnet', 'fecha_emision', 'fecha_vencimiento']
                });
            }

            // Validar formato de fechas
            const fechaEmision = new Date(fecha_emision);
            const fechaVencimiento = new Date(fecha_vencimiento);
            const hoy = new Date();

            if (isNaN(fechaEmision.getTime())) {
                return res.status(400).json({ 
                    error: 'Formato de fecha de emisión inválido'
                });
            }

            if (isNaN(fechaVencimiento.getTime())) {
                return res.status(400).json({ 
                    error: 'Formato de fecha de vencimiento inválido'
                });
            }

            if (fechaVencimiento <= fechaEmision) {
                return res.status(400).json({ 
                    error: 'La fecha de vencimiento debe ser posterior a la fecha de emisión'
                });
            }

            const newCarnet = await carnetModel.createCarnet({
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo
            });

            res.status(201).json({
                message: 'Carnet creado exitosamente',
                carnet: newCarnet
            });
        } catch (error) {
            console.error('Error en createCarnet:', error);
            if (error.message.includes('El usuario especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al crear carnet',
                    details: error.message
                });
            }
            if (error.message.includes('El programa especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al crear carnet',
                    details: error.message
                });
            }
            if (error.message.includes('El número de carnet ya está en uso')) {
                return res.status(400).json({
                    error: 'Error al crear carnet',
                    details: error.message
                });
            }
            res.status(500).json({ 
                error: 'Error al crear carnet',
                details: error.message 
            });
        }
    },

    updateCarnet: async (req, res) => {
        try {
            const {
                id_usuario,
                id_programa,
                numero_carnet,
                observacion,
                fecha_emision,
                fecha_vencimiento,
                activo
            } = req.body;

            // Validar formato de fechas si se proporcionan
            if (fecha_emision) {
                const fechaEmision = new Date(fecha_emision);
                if (isNaN(fechaEmision.getTime())) {
                    return res.status(400).json({ 
                        error: 'Formato de fecha de emisión inválido'
                    });
                }
            }

            if (fecha_vencimiento) {
                const fechaVencimiento = new Date(fecha_vencimiento);
                if (isNaN(fechaVencimiento.getTime())) {
                    return res.status(400).json({ 
                        error: 'Formato de fecha de vencimiento inválido'
                    });
                }

                if (fecha_emision && fechaVencimiento <= new Date(fecha_emision)) {
                    return res.status(400).json({ 
                        error: 'La fecha de vencimiento debe ser posterior a la fecha de emisión'
                    });
                }
            }

            const updatedCarnet = await carnetModel.updateCarnet(
                req.params.id,
                {
                    id_usuario,
                    id_programa,
                    numero_carnet,
                    observacion,
                    fecha_emision,
                    fecha_vencimiento,
                    activo
                }
            );

            if (!updatedCarnet) {
                return res.status(404).json({ error: 'Carnet no encontrado' });
            }

            res.json({
                message: 'Carnet actualizado exitosamente',
                carnet: updatedCarnet
            });
        } catch (error) {
            console.error('Error en updateCarnet:', error);
            if (error.message.includes('Carnet no encontrado')) {
                return res.status(404).json({
                    error: 'Error al actualizar carnet',
                    details: error.message
                });
            }
            if (error.message.includes('El usuario especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al actualizar carnet',
                    details: error.message
                });
            }
            if (error.message.includes('El programa especificado no existe')) {
                return res.status(404).json({
                    error: 'Error al actualizar carnet',
                    details: error.message
                });
            }
            if (error.message.includes('El número de carnet ya está en uso')) {
                return res.status(400).json({
                    error: 'Error al actualizar carnet',
                    details: error.message
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar carnet',
                details: error.message 
            });
        }
    },

    deleteCarnet: async (req, res) => {
        try {
            const deletedCarnet = await carnetModel.deleteCarnet(req.params.id);
            if (!deletedCarnet) {
                return res.status(404).json({ error: 'Carnet no encontrado' });
            }
            res.json({ 
                message: 'Carnet eliminado correctamente',
                id: deletedCarnet.id
            });
        } catch (error) {
            console.error('Error en deleteCarnet:', error);
            res.status(500).json({ 
                error: 'Error al eliminar carnet',
                details: error.message 
            });
        }
    },

    checkVencimientos: async (req, res) => {
        try {
            const carnetsVencidos = await carnetModel.checkVencimientos();
            res.json({
                message: 'Verificación de vencimientos completada',
                carnetsVencidos: carnetsVencidos
            });
        } catch (error) {
            console.error('Error en checkVencimientos:', error);
            res.status(500).json({ 
                error: 'Error al verificar vencimientos',
                details: error.message 
            });
        }
    }
};

module.exports = carnetController;