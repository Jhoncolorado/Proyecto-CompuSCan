const asistenciaModel = require('../models/asistenciaModel');

const asistenciaController = {
    registrarAsistencia: async (req, res) => {
        try {
            const { id_usuario, id_ficha, fecha, estado, tipo, motivo, observacion } = req.body;
            const asistencia = await asistenciaModel.registrarAsistencia({ id_usuario, id_ficha, fecha, estado, tipo, motivo, observacion });
            res.status(201).json(asistencia);
        } catch (error) {
            console.error('Error en registrarAsistencia:', error);
            res.status(500).json({ error: 'Error al registrar asistencia', details: error.message });
        }
    },
    getAsistenciasPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha } = req.query;
            const asistencias = await asistenciaModel.getAsistenciasPorFicha(id_ficha, fecha);
            res.json(asistencias);
        } catch (error) {
            console.error('Error en getAsistenciasPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener asistencias', details: error.message });
        }
    },
    getAsistenciasPorFichaYFecha: async (req, res) => {
        try {
            const { id_ficha, fecha } = req.query;
            const asistencias = await asistenciaModel.getAsistenciasPorFichaYFecha(id_ficha, fecha);
            res.json(asistencias);
        } catch (error) {
            console.error('Error en getAsistenciasPorFichaYFecha:', error);
            res.status(500).json({ error: 'Error al obtener asistencias', details: error.message });
        }
    },
    getAprendicesPorInstructor: async (req, res) => {
        try {
            const { id_instructor } = req.params;
            const aprendices = await asistenciaModel.getAprendicesPorInstructor(id_instructor);
            res.json(aprendices);
        } catch (error) {
            console.error('Error en getAprendicesPorInstructor:', error);
            res.status(500).json({ error: 'Error al obtener aprendices', details: error.message });
        }
    },
};

module.exports = asistenciaController; 