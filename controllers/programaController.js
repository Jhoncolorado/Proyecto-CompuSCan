const programaModel = require('../models/programaModel');

const programaController = {
    createPrograma: async (req, res) => {
        try {
            const newPrograma = await programaModel.createPrograma(req.body);
            res.status(201).json(newPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el programa' });
        }
    },
    getAllProgramas: async (req, res) => {
        try {
            const programas = await programaModel.getAllProgramas();
            res.json(programas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los programas' });
        }
    },
    getProgramaById: async (req, res) => {
        try {
            const programa = await programaModel.getProgramaById(req.params.id);
            res.json(programa);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el programa' });
        }
    },
    updatePrograma: async (req, res) => {
        try {
            const updatedPrograma = await programaModel.updatePrograma(req.params.id, req.body);
            res.json(updatedPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el programa' });
        }
    },
    deletePrograma: async (req, res) => {
        try {
            const deletedPrograma = await programaModel.deletePrograma(req.params.id);
            res.json(deletedPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el programa' });
        }
    },
};

module.exports = programaController;