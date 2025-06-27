const asistenciaModel = require('../models/asistenciaModel');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const asistenciaController = {
    registrarAsistencia: async (req, res) => {
        try {
            const { id_usuario, id_ficha, estado, tipo, observacion } = req.body;
            const asistencia = await asistenciaModel.registrarAsistencia({ id_usuario, id_ficha, estado, tipo, observacion });
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
    getAprendicesPorFicha: async (req, res) => {
        try {
            const { id_ficha } = req.params;
            console.log('id_ficha recibido:', id_ficha);
            const aprendices = await asistenciaModel.getAprendicesPorFicha(id_ficha);
            console.log('Aprendices encontrados:', aprendices);
            res.json(aprendices);
        } catch (error) {
            console.error('Error en getAprendicesPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener aprendices', details: error.message });
        }
    },
    editarAsistencia: async (req, res) => {
        try {
            const id = req.params.id;
            const { estado, observacion } = req.body;
            let evidencia = null;
            if (req.file) {
                evidencia = req.file.filename;
            }
            const asistenciaActual = await asistenciaModel.getAsistenciaById(id);
            if (!asistenciaActual) {
                return res.status(404).json({ error: 'Asistencia no encontrada' });
            }
            if (evidencia && asistenciaActual.evidencia) {
                const oldPath = path.join(__dirname, '../uploads', asistenciaActual.evidencia);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            const updated = await asistenciaModel.editarAsistencia({
                id,
                estado: estado || asistenciaActual.estado,
                observacion: observacion || asistenciaActual.observacion,
                evidencia: evidencia || asistenciaActual.evidencia
            });
            res.json(updated);
        } catch (error) {
            console.error('Error en editarAsistencia:', error);
            res.status(500).json({ error: 'Error al editar asistencia', details: error.message });
        }
    },
    getEstadisticasPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha_inicio, fecha_fin } = req.query;
            if (!id_ficha) {
                return res.status(400).json({ error: 'id_ficha es requerido' });
            }
            const estadisticas = await asistenciaModel.getEstadisticasPorFicha(id_ficha, fecha_inicio, fecha_fin);
            res.json(estadisticas);
        } catch (error) {
            console.error('Error en getEstadisticasPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener estadísticas', details: error.message });
        }
    },
    getHistorialPorFicha: async (req, res) => {
        try {
            const { id_ficha, fecha_inicio, fecha_fin } = req.query;
            if (!id_ficha) {
                return res.status(400).json({ error: 'id_ficha es requerido' });
            }
            const historial = await asistenciaModel.getHistorialPorFicha(id_ficha, fecha_inicio, fecha_fin);
            res.json(historial);
        } catch (error) {
            console.error('Error en getHistorialPorFicha:', error);
            res.status(500).json({ error: 'Error al obtener historial', details: error.message });
        }
    },
};

module.exports = asistenciaController; 