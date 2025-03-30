const programaModel = require('../models/programaModel');

const programaController = {
    getAllProgramas: async (req, res) => {
        try {
            const programas = await programaModel.getAllProgramas();
            res.json(programas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener programas',
                details: error.message 
            });
        }
    },

    getProgramaById: async (req, res) => {
        try {
            const programa = await programaModel.getProgramaById(req.params.id);
            if (!programa) {
                return res.status(404).json({ error: 'Programa no encontrado' });
            }
            res.json(programa);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener programa',
                details: error.message 
            });
        }
    },

    createPrograma: async (req, res) => {
        try {
            const { nombre_programa } = req.body;

            // Validar campos requeridos
            if (!nombre_programa) {
                return res.status(400).json({ 
                    error: 'El nombre del programa es requerido',
                    required: ['nombre_programa']
                });
            }

            const newPrograma = await programaModel.createPrograma({
                nombre_programa
            });

            res.status(201).json({
                message: 'Programa creado exitosamente',
                programa: newPrograma
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al crear programa',
                details: error.message 
            });
        }
    },

    updatePrograma: async (req, res) => {
        try {
            const { nombre_programa } = req.body;

            // Verificar si el programa existe
            const programaExistente = await programaModel.getProgramaById(req.params.id);
            if (!programaExistente) {
                return res.status(404).json({ error: 'Programa no encontrado' });
            }

            const updatedPrograma = await programaModel.updatePrograma(
                req.params.id,
                { nombre_programa }
            );

            res.json({
                message: 'Programa actualizado exitosamente',
                programa: updatedPrograma
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al actualizar programa',
                details: error.message 
            });
        }
    },

    deletePrograma: async (req, res) => {
        try {
            const deletedPrograma = await programaModel.deletePrograma(req.params.id);
            if (!deletedPrograma) {
                return res.status(404).json({ error: 'Programa no encontrado' });
            }
            res.json({ 
                message: 'Programa eliminado correctamente',
                id: deletedPrograma.id
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al eliminar programa',
                details: error.message 
            });
        }
    }
};

module.exports = programaController;