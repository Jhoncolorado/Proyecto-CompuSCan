const programasModel = require('../models/programasModel');

const programasController = {
    getAllProgramas: async (req, res) => {
        try {
            const programas = await programasModel.getAllProgramas();
            res.json(programas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los programas' });
        }
    },
    getProgramaById: async (req, res) => {
        try {
            const programa = await programasModel.getProgramaById(req.params.id);
            res.json(programa);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el programa' });
        }
    },
    createPrograma: async (req, res) => {
        try {
            const newPrograma = await programasModel.createPrograma(req.body);
            res.status(201).json(newPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el programa' });
        }
    },
    updatePrograma: async (req, res) => {
        try {
            const updatedPrograma = await programasModel.updatePrograma(req.params.id, req.body);
            res.json(updatedPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el programa' });
        }
    },
    deletePrograma: async (req, res) => {
        try {
            const deletedPrograma = await programasModel.deletePrograma(req.params.id);
            res.json(deletedPrograma);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el programa' });
        }
    },
};

module.exports = programasController;